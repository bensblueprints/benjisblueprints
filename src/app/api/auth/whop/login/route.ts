import { NextResponse } from "next/server";
import { whopApi } from "@/lib/whop";

export const runtime = "nodejs";

const REDIRECT_URI =
  process.env.WHOP_OAUTH_REDIRECT_URI ?? "https://benjisblueprints.com/api/auth/whop/callback";

export async function GET() {
  const { url, state } = whopApi.oauth.getAuthorizationUrl({
    redirectUri: REDIRECT_URI,
    scope: ["read_user"],
  });
  const res = NextResponse.redirect(url);
  res.cookies.set("bb_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
