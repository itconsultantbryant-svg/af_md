import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  createToken,
  generateOtp,
  COOKIE_NAME,
  toSessionUser,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { sendVerificationEmail, sendVerificationSms } from "@/lib/notifications";
import { json, error } from "@/lib/api";
import { checkDbConnection, dbConfigHint, isDbConnectionError } from "@/lib/db-health";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    if (!(await checkDbConnection())) {
      return error(
        `Registration is unavailable: database not connected. ${dbConfigHint()}`,
        503
      );
    }

    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) return error("Email already registered", 409);

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "LEARNER",
        emailVerifyToken: otp,
        smsVerifyToken: data.phone ? generateOtp() : null,
        verifyTokenExpiry: expiry,
      },
    });

    await sendVerificationEmail(user.email, otp);
    if (user.phone && user.smsVerifyToken) {
      await sendVerificationSms(user.phone, user.smsVerifyToken);
    }

    const session = toSessionUser(user);
    const token = await createToken(session);

    const res = json({
      user: session,
      message: "Account created. Please verify your email or phone.",
      devEmailCode: process.env.NODE_ENV === "development" ? otp : undefined,
      devSmsCode:
        process.env.NODE_ENV === "development" ? user.smsVerifyToken : undefined,
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (e) {
    if (e instanceof ZodError) return error("Invalid registration data");
    if (isDbConnectionError(e)) {
      return error(`Registration is unavailable: database error. ${dbConfigHint()}`, 503);
    }
    console.error(e);
    return error("Registration failed", 500);
  }
}
