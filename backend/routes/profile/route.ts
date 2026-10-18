import { NextRequest } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toSessionUser } from "@/lib/auth";
import { createToken, COOKIE_NAME } from "@/lib/session";
import { json, error } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return error("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      organization: true,
      jobTitle: true,
      bio: true,
      country: true,
      emailVerified: true,
      phoneVerified: true,
      createdAt: true,
    },
  });
  return json({ user });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return error("Unauthorized", 401);

  const body = await req.json();
  const { firstName, lastName, phone, organization, jobTitle, bio, country, currentPassword, newPassword } = body;

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return error("User not found", 404);

  const updateData: Record<string, string | undefined> = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (organization !== undefined) updateData.organization = organization;
  if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
  if (bio !== undefined) updateData.bio = bio;
  if (country !== undefined) updateData.country = country;

  if (newPassword) {
    if (!currentPassword || !(await verifyPassword(currentPassword, user.password))) {
      return error("Current password is incorrect", 400);
    }
    updateData.password = await hashPassword(newPassword);
  }

  const updated = await prisma.user.update({
    where: { id: session.id },
    data: updateData,
  });

  const newSession = toSessionUser(updated);
  const token = await createToken(newSession);
  const res = json({ user: newSession });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", maxAge: 604800, path: "/" });
  return res;
}
