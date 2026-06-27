import crypto from "node:crypto";

// Signed, HttpOnly session cookie proving the user is a verified free member.
// AUTH_SECRET is preferred; falls back to WHOP_API_KEY so existing deploys keep working.
const SECRET =
  process.env.AUTH_SECRET ?? process.env.WHOP_API_KEY ?? "bb-session-fallback-secret";
export const SESSION_COOKIE = "bb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function signSession(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${userId}.${exp}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(cookie: string | undefined | null): string | null {
  if (!cookie) return null;
  const parts = cookie.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(`${userId}.${exp}`).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  } catch {
    return null;
  }
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  return userId;
}
