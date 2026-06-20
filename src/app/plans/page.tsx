import type { Metadata } from "next";
import HoverVideo from "@/components/HoverVideo";
import { PLANS, SHOPIFY_URL, GHL_URL, SLACK_URL, alibabaSearch } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Your Business Plan Library — Benji's Blueprints",
  description: "Download any plan and launch it — suppliers, a Shopify store, or a full CRM, one click away.",
  robots: { index: false },
};

export default function PlansPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--ink:#0b0b0c;--ink-2:#15161a;--ink-3:#1d1f25;--cream:#f4ecd8;--cream-soft:rgba(244,236,216,.6);
    --gold:#d4af37;--gold-bright:#f5d061;--orange:#ff6a00;--line:rgba(244,236,216,.12)}
  html{-webkit-text-size-adjust:100%}
  body{font-family:'Manrope',system-ui,-apple-system,sans-serif;background:var(--ink);color:var(--cream);-webkit-font-smoothing:antialiased}
  .wrap{max-width:1140px;margin:0 auto;padding:48px 22px 80px}
  .top{text-align:center;margin-bottom:14px}
  .wordmark{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:18px}
  .check{display:inline-flex;align-items:center;gap:8px;background:rgba(212,175,55,.12);border:1px solid var(--gold);color:var(--gold-bright);
    font-size:13px;font-weight:700;padding:6px 14px;border-radius:100px;margin-bottom:18px}
  h1{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.02em;margin-bottom:12px}
  h1 .hl{color:var(--gold-bright)}
  .lead{color:var(--cream-soft);font-size:17px;max-width:620px;margin:0 auto 26px;line-height:1.5}
  .slack{display:inline-block;background:linear-gradient(90deg,var(--gold),var(--gold-bright));color:var(--ink);
    font-weight:800;font-size:16px;text-decoration:none;padding:15px 28px;border-radius:12px}
  .slack small{display:block;font-weight:600;font-size:12px;opacity:.8;margin-top:2px}
  .divider{margin:46px 0 24px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-soft)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
  .card{background:var(--ink-2);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
  .thumb-wrap{position:relative;height:280px;overflow:hidden;cursor:pointer;background:var(--ink-3)}
  .thumb{width:100%;height:280px;object-fit:cover;display:block}
  .thumb-play{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;
    background:rgba(11,11,12,.6);color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center;
    backdrop-filter:blur(4px);pointer-events:none}
  .thumb-wrap:hover .thumb-play{opacity:0;transition:opacity .2s}
  .card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:10px;flex:1}
  .card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
  .card h3{font-size:18px;font-weight:800;line-height:1.2}
  .badge{flex-shrink:0;font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:4px 8px;border-radius:6px}
  .badge.shopify{background:rgba(149,191,71,.16);color:#bfe089}
  .badge.ghl{background:rgba(124,198,255,.14);color:#9fd3ff}
  .blurb{color:var(--cream-soft);font-size:13.5px;line-height:1.45;flex:1}
  .actions{display:flex;flex-direction:column;gap:8px;margin-top:4px}
  .btn{display:flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;font-weight:800;font-size:14px;
    padding:11px 14px;border-radius:10px;border:1px solid transparent}
  .btn-cta.shopify{background:#95bf47;color:#0b2e13}
  .btn-cta.ghl{background:#2dd4bf;color:#08312c}
  .btn-cta:hover{filter:brightness(1.06)}
  .row2{display:flex;gap:8px}
  .btn-sec{flex:1;background:var(--ink-3);color:var(--cream);border:1px solid var(--line);font-weight:700;font-size:13px}
  .btn-sec:hover{border-color:var(--gold)}
  .foot{margin-top:60px;text-align:center;color:var(--cream-soft);font-size:13px}
  .foot a{color:var(--gold)}
        `,
        }}
      />
      <main className="wrap">
        <div className="top">
          <div className="wordmark">Benji&apos;s Blueprints</div>
          <span className="check">✓ You&apos;re in — full library unlocked</span>
          <h1>
            Your <span className="hl">Business Plan</span> Library
          </h1>
          <p className="lead">
            Download any plan below and launch it. Each one routes you to the exact next step —
            cheap suppliers, a ready-made Shopify store, or a full CRM + phone system to run it.
          </p>
          <a className="slack" href={SLACK_URL} target="_blank" rel="noopener noreferrer">
            Join the Inner Circle — $99/mo
            <small>Private Slack + live coaching calls every week</small>
          </a>
        </div>

        <div className="divider">— {PLANS.length} done-for-you business plans —</div>

        <div className="grid">
          {PLANS.map((p) => (
            <div className="card" key={p.slug}>
              <HoverVideo src={`/videos/${p.slug}.mp4`} poster={`/thumbs/${p.slug}.jpg`} alt={p.title} />
              <div className="card-body">
                <div className="card-head">
                  <h3>{p.title}</h3>
                  <span className={`badge ${p.type}`}>{p.type === "shopify" ? "Product" : "Service"}</span>
                </div>
                <p className="blurb">{p.blurb}</p>
                <div className="actions">
                  {p.type === "shopify" ? (
                    <a className="btn btn-cta shopify" href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer">
                      🛒 Launch your Shopify store →
                    </a>
                  ) : (
                    <a className="btn btn-cta ghl" href={GHL_URL} target="_blank" rel="noopener noreferrer">
                      📞 Run it with GoHighLevel →
                    </a>
                  )}
                  <div className="row2">
                    <a className="btn btn-sec" href={`/plans/${p.slug}.pdf`} target="_blank" rel="noopener noreferrer">
                      ⬇ Plan PDF
                    </a>
                    <a className="btn btn-sec" href={alibabaSearch(p.supplier)} target="_blank" rel="noopener noreferrer">
                      🔎 Suppliers
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="foot">
          New plans added every week. <a href={SLACK_URL}>Join the inner circle</a> to get them first + weekly live calls.
        </p>
      </main>
    </>
  );
}
