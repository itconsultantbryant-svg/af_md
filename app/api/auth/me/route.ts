import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { json, error } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return error("Not authenticated", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      emailVerified: true,
      phoneVerified: true,
      createdAt: true,
    },
  });

  return json({ user });
}
