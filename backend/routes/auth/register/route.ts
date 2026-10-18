import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  createToken,
  COOKIE_NAME,
  toSessionUser,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
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

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "LEARNER",
        emailVerified: true,
        phoneVerified: true,
      },
    });

    const session = toSessionUser(user);
    const token = await createToken(session);

    const res = json({
      user: session,
      message: "Account created successfully.",
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
