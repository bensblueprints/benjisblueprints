import { WhopServerSdk } from "@whop/api";

// Server SDK for the "Benjis Business Blueprints Login" Whop app.
export const whopApi = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "",
  appApiKey: process.env.WHOP_API_KEY ?? "",
});

// The free community company — members of this whop unlock the content.
export const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID ?? "biz_n7oyqtb2Enrre3";

// The free plan/access pass users are comped into (optional — enables auto-enroll attempt).
const WHOP_FREE_PLAN_ID = process.env.WHOP_FREE_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_PLAN_ID || "";
const WHOP_API_KEY = process.env.WHOP_API_KEY ?? "";

/**
 * Best-effort auto-enroll of an email into the free Whop community.
 *
 * NOTE: As of @whop/api 0.0.51 the Server SDK exposes no "create a free
 * membership by email" mutation (only payments.createCheckoutSession /
 * chargeUser, which require the user to go through checkout). We therefore
 * attempt the Whop v2 REST "comp a membership" endpoint when a free plan id is
 * configured, and fall back gracefully. This NEVER throws — callers should not
 * fail the request on a false return; they still email/show the join link.
 *
 * Returns true only if Whop confirms a membership was created.
 */
export async function enrollFreeMember(email: string): Promise<boolean> {
  if (!WHOP_API_KEY || !WHOP_FREE_PLAN_ID) return false;
  try {
    const res = await fetch("https://api.whop.com/api/v2/memberships", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHOP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan_id: WHOP_FREE_PLAN_ID, email }),
    });
    if (!res.ok) return false;
    const j = (await res.json().catch(() => null)) as { id?: string; valid?: boolean } | null;
    return Boolean(j && (j.id || j.valid));
  } catch {
    return false;
  }
}
