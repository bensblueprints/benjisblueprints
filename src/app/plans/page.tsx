import type { Metadata } from "next";
import { cookies } from "next/headers";
import PlansGrid from "@/components/PlansGrid";
import { PLANS, SLACK_URL, WHOP_FREE_URL } from "@/lib/plans";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Business Plan Library — Benji's Blueprints",
  robots: { index: false },
};

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--ink:#0b0b0c;--ink-2:#15161a;--ink-3:#1d1f25;--cream:#f4ecd8;--cream-soft:rgba(244,236,216,.6);
    --gold:#d4af37;--gold-bright:#f5d061;--line:rgba(244,236,216,.12)}
  body{font-family:'Manrope',system-ui,-apple-system,sans-serif;background:var(--ink);color:var(--cream);-webkit-font-smoothing:antialiased}
  .wrap{max-width:1140px;margin:0 auto;padding:42px 22px 80px}
  .top{text-align:center;margin-bottom:28px}
  .wordmark{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
  h1{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.02em;margin-bottom:12px}
  h1 .hl{color:var(--gold-bright)}
  .lead{color:var(--cream-soft);font-size:16px;max-width:600px;margin:0 auto 22px;line-height:1.5}
  .upsell{display:inline-block;color:var(--gold);font-size:13px;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(212,175,55,.4);padding-bottom:1px}
  .upsell:hover{color:var(--gold-bright)}
  .divider{margin:34px 0 24px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-soft)}
  .gate{min-height:88vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 22px}
  .gate h1{margin-bottom:14px}
  .gate p{color:var(--cream-soft);font-size:17px;max-width:460px;margin:0 auto 28px;line-height:1.5}
  .btns{display:flex;flex-direction:column;gap:12px;width:100%;max-width:340px}
  .btn-gold{background:linear-gradient(90deg,var(--gold),var(--gold-bright));color:var(--ink);font-weight:800;font-size:16px;text-decoration:none;padding:15px 28px;border-radius:12px}
  .btn-ghost{background:var(--ink-2);border:1px solid var(--line);color:var(--cream);font-weight:700;font-size:15px;text-decoration:none;padding:14px 28px;border-radius:12px}
  .btn-ghost:hover{border-color:var(--gold)}
`;

function LoginGate() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="gate">
        <div className="wordmark">Benji&apos;s Blueprints</div>
        <h1>
          Members <span className="hl">only</span>
        </h1>
        <p>
          The plan library is for free community members. Log in with Whop to view it — or join
          free in one click if you haven&apos;t yet.
        </p>
        <div className="btns">
          <a className="btn-gold" href="/api/auth/whop/login">
            Log in with Whop →
          </a>
          <a className="btn-ghost" href={WHOP_FREE_URL} target="_blank" rel="noopener noreferrer">
            Not a member? Join free →
          </a>
        </div>
      </main>
    </>
  );
}

export default async function PlansPage() {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = verifySession(session);

  if (!userId) return <LoginGate />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="wrap">
        <div className="top">
          <div className="wordmark">Benji&apos;s Blueprints</div>
          <h1>
            Your <span className="hl">Business Plan</span> Library
          </h1>
          <p className="lead">
            You&apos;re in. {PLANS.length} done-for-you plans — hover any card to preview the
            breakdown, download the plan, find suppliers, and launch it.
          </p>
          <a className="upsell" href={SLACK_URL} target="_blank" rel="noopener noreferrer">
            Want live coaching? Join the Inner Circle — $99/mo →
          </a>
        </div>
        <div className="divider">— {PLANS.length} done-for-you business plans —</div>
        <PlansGrid />
      </main>
    </>
  );
}
