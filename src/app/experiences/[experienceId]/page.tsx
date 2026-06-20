import { headers } from "next/headers";
import { verifyUserToken } from "@whop/api";
import { whopApi } from "@/lib/whop";
import PlansGrid from "@/components/PlansGrid";
import { PLANS, WHOP_FREE_URL } from "@/lib/plans";

export const dynamic = "force-dynamic";

const baseCss = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--ink:#0b0b0c;--ink-2:#15161a;--ink-3:#1d1f25;--cream:#f4ecd8;--cream-soft:rgba(244,236,216,.6);
    --gold:#d4af37;--gold-bright:#f5d061;--line:rgba(244,236,216,.12)}
  body{font-family:'Manrope',system-ui,-apple-system,sans-serif;background:var(--ink);color:var(--cream);-webkit-font-smoothing:antialiased}
  .wrap{max-width:1140px;margin:0 auto;padding:36px 22px 70px}
  .top{text-align:center;margin-bottom:28px}
  .wordmark{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
  h1{font-size:clamp(26px,5vw,40px);font-weight:800;letter-spacing:-.02em;margin-bottom:10px}
  h1 .hl{color:var(--gold-bright)}
  .lead{color:var(--cream-soft);font-size:16px;max-width:600px;margin:0 auto}
  .gate{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 22px}
  .gate h1{margin-bottom:14px}
  .gate p{color:var(--cream-soft);font-size:17px;max-width:460px;margin:0 auto 26px;line-height:1.5}
  .join{display:inline-block;background:linear-gradient(90deg,var(--gold),var(--gold-bright));color:var(--ink);font-weight:800;font-size:16px;text-decoration:none;padding:15px 30px;border-radius:12px}
`;

function Gate() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: baseCss }} />
      <main className="gate">
        <div className="wordmark">Benji&apos;s Blueprints</div>
        <h1>
          Join free to <span className="hl">unlock the plans</span>
        </h1>
        <p>
          This library is for free community members. Join in one click — it&apos;s 100% free —
          and get every done-for-you business plan, supplier list, and weekly drop.
        </p>
        <a className="join" href={WHOP_FREE_URL} target="_blank" rel="noopener noreferrer">
          Join the Free Community →
        </a>
      </main>
    </>
  );
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;

  let userId: string | null = null;
  try {
    const payload = await verifyUserToken(await headers());
    userId = payload?.userId ?? null;
  } catch {
    userId = null;
  }

  let hasAccess = false;
  if (userId) {
    try {
      const res = await whopApi.access.checkIfUserHasAccessToExperience({ experienceId, userId });
      hasAccess = Boolean(res?.hasAccess);
    } catch {
      hasAccess = false;
    }
  }

  if (!hasAccess) return <Gate />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: baseCss }} />
      <main className="wrap">
        <div className="top">
          <div className="wordmark">Benji&apos;s Blueprints</div>
          <h1>
            Your <span className="hl">Business Plan</span> Library
          </h1>
          <p className="lead">
            {PLANS.length} done-for-you plans. Hover any card to preview the breakdown, download the
            plan, find suppliers, and launch it.
          </p>
        </div>
        <PlansGrid />
      </main>
    </>
  );
}
