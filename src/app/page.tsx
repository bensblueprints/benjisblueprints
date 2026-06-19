import type { Metadata } from "next";
import PlanForm from "@/components/PlanForm";

export const metadata: Metadata = {
  title: "Free Business Plans — Benji's Blueprints",
  description:
    "Drop your email and get the entire library of done-for-you business plans free — the exact breakdowns from my daily videos. New plans added every week.",
  alternates: { canonical: "https://benjisblueprints.com/" },
  openGraph: {
    title: "Steal My Genius Business Ideas — Free",
    description:
      "Get the full library of done-for-you business plans, free. The exact breakdowns from my daily videos.",
    url: "https://benjisblueprints.com/",
    type: "website",
  },
};

const PLANS = [
  "Loaded Fruit Cups",
  "Holographic Chocolate",
  "Espresso Popsicles",
  "Tote Wall Storage",
  "Cheesecake Pops",
  "Dessert Cups",
  "Nail Printing",
  "Foam Parties",
  "Souvenir Popsicles",
  "The TV That Disappears",
  "Snap-On Tiles",
];

export default function Page() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--ink:#0b0b0c;--ink-2:#15161a;--cream:#f4ecd8;--cream-soft:rgba(244,236,216,.62);
    --gold:#d4af37;--gold-bright:#f5d061;--line:rgba(244,236,216,.14)}
  html{-webkit-text-size-adjust:100%}
  body{font-family:'Manrope',system-ui,-apple-system,sans-serif;background:var(--ink);color:var(--cream);
    -webkit-font-smoothing:antialiased;min-height:100vh}
  .bridge{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:40px 22px;text-align:center;position:relative;overflow:hidden}
  .bridge::before{content:"";position:absolute;inset:0;
    background:radial-gradient(900px 500px at 50% -10%,rgba(212,175,55,.16),transparent 70%);pointer-events:none}
  .bridge-inner{position:relative;width:100%;max-width:640px}
  .wordmark{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.32em;
    text-transform:uppercase;color:var(--gold);margin-bottom:30px}
  .eyebrow{display:inline-block;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;
    letter-spacing:.22em;text-transform:uppercase;color:var(--ink);background:var(--gold);
    padding:6px 12px;border-radius:100px;margin-bottom:22px;font-weight:700}
  h1{font-size:clamp(32px,7vw,54px);line-height:1.05;font-weight:800;letter-spacing:-.02em;margin-bottom:18px}
  h1 .hl{color:var(--gold-bright)}
  .sub{font-size:clamp(16px,2.4vw,19px);line-height:1.5;color:var(--cream-soft);max-width:540px;
    margin:0 auto 34px}
  .planform{display:flex;flex-direction:column;gap:12px;max-width:440px;margin:0 auto}
  .planform input{width:100%;padding:16px 18px;font-size:16px;border-radius:12px;border:1px solid var(--line);
    background:var(--ink-2);color:var(--cream);outline:none;font-family:inherit;text-align:center}
  .planform input:focus{border-color:var(--gold)}
  .planform button{width:100%;padding:16px 18px;font-size:16px;font-weight:800;border-radius:12px;border:none;
    background:linear-gradient(90deg,var(--gold),var(--gold-bright));color:var(--ink);cursor:pointer;
    transition:transform .15s ease,filter .15s ease}
  .planform button:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.05)}
  .planform button:disabled{opacity:.65;cursor:default}
  .planform-error{color:#ffb4b4;font-size:14px}
  .planform-fine{color:var(--cream-soft);font-size:13px;margin-top:2px}
  .planform-done{max-width:440px;margin:0 auto;background:var(--ink-2);border:1px solid var(--line);
    border-radius:16px;padding:32px 24px}
  .planform-check{width:54px;height:54px;margin:0 auto 14px;border-radius:50%;
    background:linear-gradient(90deg,var(--gold),var(--gold-bright));color:var(--ink);
    font-size:28px;font-weight:900;display:flex;align-items:center;justify-content:center}
  .planform-done h2{font-size:24px;font-weight:800;margin-bottom:8px}
  .planform-done p{color:var(--cream-soft);font-size:15px;margin-bottom:20px}
  .planform-open{display:inline-block;background:linear-gradient(90deg,var(--gold),var(--gold-bright));
    color:var(--ink);font-weight:800;text-decoration:none;padding:14px 24px;border-radius:12px}
  .count{margin-top:34px;font-size:13px;color:var(--cream-soft);
    font-family:'JetBrains Mono',ui-monospace,monospace;letter-spacing:.04em}
  .plan-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:18px;max-width:560px}
  .plan-chips span{font-size:12px;color:var(--cream-soft);border:1px solid var(--line);border-radius:100px;
    padding:5px 11px;background:rgba(244,236,216,.03)}
  .foot{margin-top:42px;font-size:12px;color:var(--cream-soft)}
        `,
        }}
      />
      <main className="bridge">
        <div className="bridge-inner">
          <div className="wordmark">Benji&apos;s Blueprints</div>
          <span className="eyebrow">Free Download</span>
          <h1>
            Steal My Genius <span className="hl">Business Ideas</span>
          </h1>
          <p className="sub">
            Drop your email and I&apos;ll send you the entire library of
            done-for-you business plans — the exact breakdowns from my daily
            videos. New plans added every week.
          </p>

          <PlanForm />

          <div className="count">
            {PLANS.length}+ full business plans inside &middot; updated weekly
          </div>
          <div className="plan-chips">
            {PLANS.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>

          <p className="foot">No spam, ever. Just the plans.</p>
        </div>
      </main>
    </>
  );
}
