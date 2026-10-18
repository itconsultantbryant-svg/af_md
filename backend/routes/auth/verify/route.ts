import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, createToken, COOKIE_NAME, toSessionUser } from "@/lib/auth";
import { json, error } from "@/lib/api";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return error("Not authenticated", 401);

  const { type, code } = await req.json();
  if (!code || !type) return error("Code and type required");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return error("User not found", 404);

  if (user.verifyTokenExpiry && user.verifyTokenExpiry < new Date()) {
    return error("Verification code expired", 400);
  }

  if (type === "email") {
    if (user.emailVerifyToken !== code) return error("Invalid email code", 400);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });
    const newSession = toSessionUser(updated);
    const token = await createToken(newSession);
    const res = json({ success: true, user: newSession });
    res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", maxAge: 604800, path: "/" });
    return res;
  }

  if (type === "sms") {
    if (user.smsVerifyToken !== code) return error("Invalid SMS code", 400);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true, smsVerifyToken: null },
    });
    const newSession = toSessionUser(updated);
    const token = await createToken(newSession);
    const res = json({ success: true, user: newSession });
    res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", maxAge: 604800, path: "/" });
    return res;
  }

  return error("Invalid verification type");
}
