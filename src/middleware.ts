import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Inlined to avoid importing lib/session (which uses node:crypto and can't be
// bundled into the Edge middleware runtime). Must match SESSION_COOKIE there.
const SESSION_COOKIE = "bb_session";

// Edge-safe HMAC verification (Web Crypto). Mirrors lib/session.verifySession,
// which uses node:crypto and can't run in the Edge middleware runtime.
const SECRET =
  process.env.AUTH_SECRET ?? process.env.WHOP_API_KEY ?? "bb-session-fallback-secret";

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifySessionEdge(cookie: string | undefined): Promise<boolean> {
  if (!cookie) return false;
  const parts = cookie.split(".");
  if (parts.length !== 3) return false;
  const [userId, exp, sig] = parts;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${userId}.${exp}`));
    return timingSafeEqual(bufToHex(mac), sig);
  } catch {
    return false;
  }
}

// Routes that never require a session.
const PUBLIC_PATHS = new Set<string>([
  "/",
  "/api/auth/register",
  "/api/auth/verify",
  "/api/auth/logout",
  "/api/whop/webhook",
  "/api/get-plans",
]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // The Whop-embedded experience view self-gates via its own Whop token.
  if (pathname.startsWith("/experiences")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionEdge(cookie)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals and static asset files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
