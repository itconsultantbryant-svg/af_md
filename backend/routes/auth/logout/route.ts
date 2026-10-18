import { COOKIE_NAME } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST() {
  const res = json({ success: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
