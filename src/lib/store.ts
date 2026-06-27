import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

// Persistent stores backed by Netlify Blobs.
// - users: keyed by lowercased email
// - tokens: keyed by the opaque magic-link token
//
// On Netlify these are auto-configured at runtime. For local `next build`
// they're never written/read (all routes are dynamic / nodejs), so the missing
// runtime context never trips the build.

export interface UserRecord {
  email: string;
  verified: boolean;
  createdAt: string;
  whopEnrolled: boolean;
}

interface TokenRecord {
  email: string;
  expiresAt: number; // epoch ms
}

const TOKEN_TTL_MS = 20 * 60 * 1000; // 20 minutes

function usersStore() {
  return getStore({ name: "bb-users", consistency: "strong" });
}
function tokensStore() {
  return getStore({ name: "bb-tokens", consistency: "strong" });
}

function userKey(email: string): string {
  return email.trim().toLowerCase();
}

export async function getUser(email: string): Promise<UserRecord | null> {
  const key = userKey(email);
  if (!key) return null;
  const rec = (await usersStore().get(key, { type: "json" })) as UserRecord | null;
  return rec ?? null;
}

/** Create the user if new, or merge `patch` into the existing record. Returns the saved record. */
export async function upsertUser(
  email: string,
  patch: Partial<Omit<UserRecord, "email">> = {}
): Promise<UserRecord> {
  const key = userKey(email);
  const existing = await getUser(key);
  const rec: UserRecord = {
    email: key,
    verified: existing?.verified ?? false,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    whopEnrolled: existing?.whopEnrolled ?? false,
    ...patch,
  };
  await usersStore().setJSON(key, rec);
  return rec;
}

/** Issue a single-use magic-link token (32 random bytes hex) for an email. */
export async function createToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const rec: TokenRecord = {
    email: userKey(email),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
  await tokensStore().setJSON(token, rec);
  return token;
}

/** Validate + burn a token. Returns the associated email, or null if invalid/expired. */
export async function consumeToken(token: string): Promise<string | null> {
  if (!token) return null;
  const store = tokensStore();
  const rec = (await store.get(token, { type: "json" })) as TokenRecord | null;
  if (!rec) return null;
  // Single use: always delete once looked up.
  await store.delete(token);
  if (!rec.expiresAt || rec.expiresAt < Date.now()) return null;
  return rec.email;
}
