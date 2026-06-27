import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { upsertToGHL } from "@/lib/ghl";

export const runtime = "nodejs";

const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET ?? "";
const WHOP_API_KEY = process.env.WHOP_API_KEY ?? "";

// Verify Whop's signature header: `x-whop-signature: t=<ts>,v1=<hex hmac-sha256(ts.body)>`.
// Version-agnostic on the payload's api_version (Whop dashboard set to v1).
function verify(raw: string, header: string | null): boolean {
  if (!header || !WHOP_WEBHOOK_SECRET) return false;
  const [tPart, sPart] = header.split(",");
  const timestamp = (tPart ?? "").split("=")[1];
  const [version, sentSig] = (sPart ?? "").split("=");
  if (!timestamp || version !== "v1" || !sentSig) return false;
  const now = Math.round(Date.now() / 1000);
  if (Number.isNaN(Number(timestamp)) || Math.abs(now - Number(timestamp)) > 300) return false;
  const expected = crypto
    .createHmac("sha256", WHOP_WEBHOOK_SECRET)
    .update(`${timestamp}.${raw}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sentSig));
  } catch {
    return false;
  }
}

async function emailFromMembership(membershipId: string): Promise<string | null> {
  if (!membershipId || !WHOP_API_KEY) return null;
  try {
    const r = await fetch(`https://api.whop.com/api/v2/memberships/${membershipId}`, {
      headers: { Authorization: `Bearer ${WHOP_API_KEY}` },
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.email ?? j?.user?.email ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verify(raw, req.headers.get("x-whop-signature"))) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  let body: { action?: string; data?: Record<string, any> };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const action = body?.action ?? "";
  if (/^(app_)?membership\.(went_valid|activated)$/.test(action)) {
    const d = (body.data ?? {}) as Record<string, any>;
    let email: string | null = d.email ?? d.user_email ?? d.user?.email ?? null;
    if (!email && d.id) email = await emailFromMembership(String(d.id));
    const name: string | undefined = d.name ?? d.user?.name ?? d.user?.username ?? undefined;
    if (email) {
      try {
        await upsertToGHL(email, name, "Benji's Blueprints (Whop)");
      } catch {
        // never fail the webhook on a downstream error
      }
    }
  }

  return NextResponse.json({ ok: true });
}
