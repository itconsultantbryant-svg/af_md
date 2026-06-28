import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  createToken,
  verifyToken,
  COOKIE_NAME,
  type SessionUser,
  type UserRole,
} from "@/lib/session";

export type { SessionUser, UserRole };
export { COOKIE_NAME, createToken, verifyToken };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export async function requireVerifiedLearner(): Promise<SessionUser> {
  const session = await requireSession();
  if (!session.emailVerified && !session.phoneVerified) {
    throw new Error("Verification required");
  }
  return session;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getUserFromDb(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function toSessionUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}): SessionUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as UserRole,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
  };
}
