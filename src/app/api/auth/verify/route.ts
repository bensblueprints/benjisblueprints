import { NextResponse } from "next/server";
import { consumeToken, upsertUser } from "@/lib/store";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";
import { enrollFreeMember } from "@/lib/whop";

export const runtime = "nodejs";

const SITE = (process.env.SITE_URL || "https://benjisblueprints.com").replace(/\/$/, "");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";

  const email = await consumeToken(token);
  if (!email) {
    return NextResponse.redirect(`${SITE}/?err=expired`);
  }

  // Best-effort auto-enroll into the free Whop community. Never fail on this.
  let whopEnrolled = false;
  try {
    whopEnrolled = await enrollFreeMember(email);
  } catch {
    whopEnrolled = false;
  }

  // Mark the user verified (and record enrollment result).
  try {
    await upsertUser(email, { verified: true, whopEnrolled });
  } catch {
    // Even if persistence hiccups, still log them in below.
  }

  const res = NextResponse.redirect(`${SITE}/plans?welcome=1`);
  res.cookies.set(SESSION_COOKIE, signSession(email), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
