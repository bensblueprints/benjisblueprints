"use client";

import Script from "next/script";

const PLAN_ID = process.env.NEXT_PUBLIC_WHOP_PLAN_ID || "plan_ZdpPf42segDvD";

export default function WhopSignup() {
  return (
    <div className="whop-embed">
      <div
        data-whop-checkout-plan-id={PLAN_ID}
        data-whop-checkout-theme="dark"
        style={{ minHeight: 480 }}
      />
      <Script src="https://js.whop.com/static/checkout/loader.js" strategy="afterInteractive" />
    </div>
  );
}
