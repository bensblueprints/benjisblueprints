import { NextResponse } from "next/server";
import { makeWebhookValidator } from "@whop/api";

export const runtime = "nodejs";

const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET ?? "";
const WHOP_API_KEY = process.env.WHOP_API_KEY ?? "";

const validateWebhook = WHOP_WEBHOOK_SECRET
  ? makeWebhookValidator({ webhookSecret: WHOP_WEBHOOK_SECRET })
  : null;

// Upsert a contact into GoHighLevel (dedupes by email).
async function upsertToGHL(email: string, name?: string) {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) return;
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const body: Record<string, unknown> = {
    locationId: GHL_LOCATION_ID,
    email,
    tags: ["free-member", "benjis-blueprints"],
    source: "Benji's Blueprints (Whop)",
  };
  if (parts.length) {
    body.firstName = parts[0];
    if (parts.length > 1) body.lastName = parts.slice(1).join(" ");
  }
  await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// Fallback: fetch the membership to get the email if the webhook payload omits it.
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
  let body: { action?: string; data?: Record<string, unknown> };
  try {
    if (validateWebhook) {
      body = (await validateWebhook(req)) as unknown as typeof body;
    } else {
      body = await req.json();
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  const action = body?.action ?? "";
  // "Membership activated" in the Whop UI = membership.went_valid (cover both labels).
  if (/^(app_)?membership\.(went_valid|activated)$/.test(action)) {
    const d = (body.data ?? {}) as Record<string, any>;
    let email: string | null = d.email ?? d.user_email ?? d.user?.email ?? null;
    if (!email && d.id) email = await emailFromMembership(String(d.id));
    const name: string | undefined =
      d.name ?? d.user?.name ?? d.user?.username ?? undefined;
    if (email) {
      try {
        await upsertToGHL(email, name);
      } catch {
        // never fail the webhook on a downstream error
      }
    }
  }

  return NextResponse.json({ ok: true });
}
