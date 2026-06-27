import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

const SITE = (process.env.SITE_URL || "https://benjisblueprints.com").replace(/\/$/, "");

export async function GET() {
  const res = NextResponse.redirect(`${SITE}/`);
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
