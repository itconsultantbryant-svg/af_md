import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, generateOtp } from "@/lib/auth";
import { sendVerificationEmail, sendVerificationSms } from "@/lib/notifications";
import { json, error } from "@/lib/api";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return error("Not authenticated", 401);

  const { type } = await req.json();
  const otp = generateOtp();
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return error("User not found", 404);

  if (type === "email") {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: otp, verifyTokenExpiry: expiry },
    });
    await sendVerificationEmail(user.email, otp);
    return json({
      success: true,
      devCode: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  }

  if (type === "sms" && user.phone) {
    await prisma.user.update({
      where: { id: user.id },
      data: { smsVerifyToken: otp, verifyTokenExpiry: expiry },
    });
    await sendVerificationSms(user.phone, otp);
    return json({
      success: true,
      devCode: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  }

  return error("Invalid resend type");
}
