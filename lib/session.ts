import { SignJWT, jwtVerify } from "jose";

export type UserRole = "ADMIN" | "LEARNER";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "afrimind-dev-secret-change-in-production"
);

export const COOKIE_NAME = "afrimind_session";

export async function createToken(user: SessionUser) {
  return new SignJWT({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}
