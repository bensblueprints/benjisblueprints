import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { whopApi, WHOP_COMPANY_ID } from "@/lib/whop";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";
import { WHOP_FREE_URL } from "@/lib/plans";

export const runtime = "nodejs";

const SITE = "https://benjisblueprints.com";
const REDIRECT_URI =
  process.env.WHOP_OAUTH_REDIRECT_URI ?? `${SITE}/api/auth/whop/callback`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const jar = await cookies();
  const savedState = jar.get("bb_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${SITE}/plans?login=error`);
  }

  // Exchange the code for a user access token.
  const auth = await whopApi.oauth.exchangeCode({ code, redirectUri: REDIRECT_URI });
  if (!auth.ok) {
    return NextResponse.redirect(`${SITE}/plans?login=error`);
  }
  const token = auth.tokens.access_token;

  // Identify the user.
  let userId = "";
  try {
    const me = await fetch("https://api.whop.com/v5/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meJson = await me.json();
    userId = meJson?.id ?? "";
  } catch {
    userId = "";
  }
  if (!userId) return NextResponse.redirect(`${SITE}/plans?login=error`);

  // Verify they're a member of the free community.
  let isMember = false;
  try {
    const access = await whopApi.access.checkIfUserHasAccessToCompany({
      companyId: WHOP_COMPANY_ID,
      userId,
    });
    isMember = Boolean(access?.hasAccess);
  } catch {
    isMember = false;
  }

  if (!isMember) {
    // Logged in but not a member yet — send them to join free.
    const res = NextResponse.redirect(WHOP_FREE_URL);
    res.cookies.delete("bb_oauth_state");
    return res;
  }

  const res = NextResponse.redirect(`${SITE}/plans`);
  res.cookies.set(SESSION_COOKIE, signSession(userId), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  res.cookies.delete("bb_oauth_state");
  return res;
}
