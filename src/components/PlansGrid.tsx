import HoverVideo from "@/components/HoverVideo";
import { PLANS, SHOPIFY_URL, GHL_URL, alibabaSearch } from "@/lib/plans";

export default function PlansGrid() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
  .card{background:var(--ink-2,#15161a);border:1px solid var(--line,rgba(244,236,216,.12));border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
  .thumb-wrap{position:relative;height:280px;overflow:hidden;cursor:pointer;background:var(--ink-3,#1d1f25)}
  .thumb{width:100%;height:280px;object-fit:cover;display:block}
  .thumb-play{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;
    background:rgba(11,11,12,.6);color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);pointer-events:none}
  .thumb-wrap:hover .thumb-play{opacity:0;transition:opacity .2s}
  .card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:10px;flex:1}
  .card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
  .card h3{font-size:18px;font-weight:800;line-height:1.2}
  .badge{flex-shrink:0;font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:4px 8px;border-radius:6px}
  .badge.shopify{background:rgba(149,191,71,.16);color:#bfe089}
  .badge.ghl{background:rgba(124,198,255,.14);color:#9fd3ff}
  .blurb{color:var(--cream-soft,rgba(244,236,216,.6));font-size:13.5px;line-height:1.45;flex:1}
  .actions{display:flex;flex-direction:column;gap:8px;margin-top:4px}
  .btn{display:flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;font-weight:800;font-size:14px;padding:11px 14px;border-radius:10px;border:1px solid transparent}
  .btn-cta.shopify{background:#95bf47;color:#0b2e13}
  .btn-cta.ghl{background:#2dd4bf;color:#08312c}
  .btn-cta:hover{filter:brightness(1.06)}
  .row2{display:flex;gap:8px}
  .btn-sec{flex:1;background:var(--ink-3,#1d1f25);color:var(--cream,#f4ecd8);border:1px solid var(--line,rgba(244,236,216,.12));font-weight:700;font-size:13px}
  .btn-sec:hover{border-color:var(--gold,#d4af37)}
        `,
        }}
      />
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
    </>
  );
}
