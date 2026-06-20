import { WhopServerSdk } from "@whop/api";

// Server SDK for the "Benjis Business Blueprints Login" Whop app.
export const whopApi = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "",
  appApiKey: process.env.WHOP_API_KEY ?? "",
});

// The free community company — members of this whop unlock the content.
export const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID ?? "biz_n7oyqtb2Enrre3";
