import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { upsertUser, createToken } from "@/lib/store";
import { upsertToGHL } from "@/lib/ghl";

export const runtime = "nodejs";

const SITE = (process.env.SITE_URL || "https://benjisblueprints.com").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "Benji <ben@benjisaiempire.com>";

const schema = z.object({ email: z.string().email() });

function magicLinkEmail(link: string) {
  return `<!doctype html><html><body style="margin:0;background:#0b0b0c;font-family:Arial,Helvetica,sans-serif;color:#f4ecd8;padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px">
      <tr><td style="font:700 13px 'Courier New',monospace;letter-spacing:.28em;text-transform:uppercase;color:#d4af37;padding-bottom:18px">Benji's Blueprints</td></tr>
      <tr><td style="font-size:26px;font-weight:800;line-height:1.2;padding-bottom:14px">Your access link is ready 🔓</td></tr>
      <tr><td style="font-size:16px;line-height:1.6;color:rgba(244,236,216,.75);padding-bottom:26px">
        Click below to unlock the full library of <strong>245+ done-for-you business plans + supplier lists</strong> and join the free community. This link logs you straight in — no password needed.
      </td></tr>
      <tr><td style="padding-bottom:18px">
        <a href="${link}" style="display:inline-block;background:#d4af37;color:#0b0b0c;font-weight:800;font-size:16px;text-decoration:none;padding:15px 28px;border-radius:10px">Unlock my plans →</a>
      </td></tr>
      <tr><td style="font-size:13px;line-height:1.6;color:rgba(244,236,216,.5);padding-bottom:18px">
        Or paste this into your browser:<br><a href="${link}" style="color:#d4af37;word-break:break-all">${link}</a>
      </td></tr>
      <tr><td style="font-size:13px;line-height:1.6;color:rgba(244,236,216,.45)">
        This link expires in 20 minutes. If you didn't request it, you can ignore this email.
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

  // Record the (unverified) user and mint a single-use magic link.
  await upsertUser(email);
  const token = await createToken(email);
  const link = `${SITE}/api/auth/verify?token=${token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your access link 🔓",
      html: magicLinkEmail(link),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't send the email. Double-check the address and try again." },
      { status: 502 }
    );
  }

  // Sync the lead to GoHighLevel (non-blocking on failure).
  try {
    await upsertToGHL(email, undefined, "Benji's Blueprints (magic link)");
  } catch {
    // ignore — the access link already went out
  }

  return NextResponse.json({ ok: true });
}
