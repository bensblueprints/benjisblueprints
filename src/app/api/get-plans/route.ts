import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const PLANS_URL =
  process.env.NEXT_PUBLIC_PLANS_URL ||
  "https://drive.google.com/drive/folders/1I--Aa_uMJMtv5p95IHHBcEGPJj1gEA0u";
const WHOP_FREE_URL =
  process.env.NEXT_PUBLIC_WHOP_URL ||
  "https://whop.com/benjis-business-blueprints/free-business-plans-suppliers";
const FROM = process.env.EMAIL_FROM || "Benji <ben@benjisaiempire.com>";
const NOTIFY = (process.env.ADMIN_EMAILS || "ben@advancedmarketing.co")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const schema = z.object({ email: z.string().email() });

function subscriberEmail() {
  return `<!doctype html><html><body style="margin:0;background:#0b0b0c;font-family:Arial,Helvetica,sans-serif;color:#f4ecd8;padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px">
      <tr><td style="font:700 13px 'Courier New',monospace;letter-spacing:.28em;text-transform:uppercase;color:#d4af37;padding-bottom:18px">Benji's Blueprints</td></tr>
      <tr><td style="font-size:26px;font-weight:800;line-height:1.2;padding-bottom:14px">Here are your free business plans 📈</td></tr>
      <tr><td style="font-size:16px;line-height:1.6;color:rgba(244,236,216,.75);padding-bottom:26px">
        Thanks for joining. Click below to enter the <strong>free community</strong> — that's where every done-for-you business plan, supplier list, and new weekly drop lives. It's 100% free to join.
      </td></tr>
      <tr><td style="padding-bottom:18px">
        <a href="${WHOP_FREE_URL}" style="display:inline-block;background:#d4af37;color:#0b0b0c;font-weight:800;font-size:16px;text-decoration:none;padding:15px 28px;border-radius:10px">Enter the free community →</a>
      </td></tr>
      <tr><td style="font-size:13px;line-height:1.6;color:rgba(244,236,216,.5);padding-bottom:18px">
        Or paste this into your browser:<br><a href="${WHOP_FREE_URL}" style="color:#d4af37;word-break:break-all">${WHOP_FREE_URL}</a>
      </td></tr>
      <tr><td style="font-size:13px;line-height:1.6;color:rgba(244,236,216,.5)">
        Prefer the raw files? <a href="${PLANS_URL}" style="color:#d4af37">Grab the plans folder here</a>.
      </td></tr>
      <tr><td style="padding-top:30px;border-top:1px solid rgba(244,236,216,.14);margin-top:24px;font-size:12px;color:rgba(244,236,216,.4)">
        — Benji &middot; benjisblueprints.com
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "Email service not configured." }, { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your free business plans 📈",
      html: subscriberEmail(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't send the email. Double-check the address and try again." },
      { status: 502 }
    );
  }

  if (NOTIFY.length) {
    try {
      await resend.emails.send({
        from: FROM,
        to: NOTIFY,
        subject: `New plan subscriber: ${email}`,
        html: `<p>New email captured on benjisblueprints.com:</p><p style="font-size:18px"><strong>${email}</strong></p><p style="color:#888">${new Date().toISOString()}</p>`,
      });
    } catch {
      // ignore — subscriber already got their plans
    }
  }

  return NextResponse.json({ ok: true });
}
