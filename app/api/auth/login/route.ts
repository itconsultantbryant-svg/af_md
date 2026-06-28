import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  createToken,
  COOKIE_NAME,
  toSessionUser,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.password))) {
      return error("Invalid email or password", 401);
    }

    const session = toSessionUser(user);
    const token = await createToken(session);

    const res = json({ user: session });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return error("Login failed", 500);
  }
}
