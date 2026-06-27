// GoHighLevel contact sync. Shared by the Whop webhook and the magic-link register route.
const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";

export async function upsertToGHL(email: string, name?: string, source?: string): Promise<void> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) return;
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const body: Record<string, unknown> = {
    locationId: GHL_LOCATION_ID,
    email,
    tags: ["free-member", "benjis-blueprints"],
    source: source ?? "Benji's Blueprints",
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
