// The business-plan library shown after signup. Each plan routes to the right
// monetization CTA: shippable products -> Shopify, local/service businesses -> GoHighLevel.
export type PlanType = "shopify" | "ghl";

export interface Plan {
  slug: string;
  title: string;
  type: PlanType;
  blurb: string;
  /** Alibaba search term for the cheapest key input. */
  supplier: string;
}

export const PLANS: Plan[] = [
  { slug: "loaded-fruit-cups", title: "Loaded Fruit Cups", type: "ghl", blurb: "Fresh layered fruit-cocktail cups — a high-margin local dessert kiosk.", supplier: "clear PET cups with lids" },
  { slug: "holographic-chocolate", title: "Holographic Chocolate", type: "shopify", blurb: "Edible rainbow chocolate bars — a premium giftable product you ship.", supplier: "diffraction grating film sheets" },
  { slug: "espresso-popsicles", title: "Espresso Popsicles", type: "ghl", blurb: "Frozen latte pops — the cafe summer upsell nobody's doing.", supplier: "popsicle sleeve bags" },
  { slug: "tote-wall-storage", title: "Tote Wall Storage", type: "ghl", blurb: "Custom garage tote-wall installs — a local service + plans/kit.", supplier: "27 gallon heavy duty storage totes" },
  { slug: "cheesecake-pops", title: "Cheesecake Pops", type: "ghl", blurb: "Decorated cheesecake cakesicles — start with supermarket cheesecake.", supplier: "cakesicle silicone molds" },
  { slug: "dessert-cups", title: "Dessert Cups", type: "ghl", blurb: "Layered tiramisu/matcha dessert cups — a grab-and-go flavor wall.", supplier: "clear dessert cups with dome lids" },
  { slug: "nail-printing", title: "Nail Printing", type: "ghl", blurb: "Instant digital nail-art printing — salon/kiosk/event service.", supplier: "digital nail printer machine" },
  { slug: "souvenir-popsicles", title: "Souvenir Popsicles", type: "ghl", blurb: "3D sculpted landmark gelato pops — sell where tourists already are.", supplier: "3D silicone popsicle molds" },
  { slug: "the-tv-that-disappears", title: "The TV That Disappears", type: "shopify", blurb: "Mirror TVs that vanish into the wall — a premium product you sell + ship.", supplier: "mirror tv glass two way" },
  { slug: "snap-on-tiles", title: "Snap-On Tiles", type: "shopify", blurb: "Interlocking garage floor tiles — a shippable home-improvement product.", supplier: "garage floor tiles interlocking" },
  { slug: "foam-parties", title: "Foam Parties", type: "ghl", blurb: "Foam-cannon party rentals — fast-ROI local events service.", supplier: "foam machine cannon party" },
  { slug: "light-bulb-drinks", title: "Light Bulb Drinks", type: "ghl", blurb: "Novelty light-bulb-bottle shakes — the most photogenic drink in town.", supplier: "light bulb shaped drink bottles" },
];

export const SHOPIFY_URL = process.env.NEXT_PUBLIC_SHOPIFY_URL || "https://www.shopify.com/free-trial";
export const GHL_URL = process.env.NEXT_PUBLIC_GHL_URL || "https://www.gohighlevel.com";
export const SLACK_URL = process.env.NEXT_PUBLIC_SLACK_URL || "#";
export const PLANS_FOLDER_URL =
  process.env.NEXT_PUBLIC_PLANS_URL ||
  "https://drive.google.com/drive/folders/1I--Aa_uMJMtv5p95IHHBcEGPJj1gEA0u";

export const alibabaSearch = (q: string) =>
  `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(q)}`;
