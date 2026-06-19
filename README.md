# Benji's Blueprints

Email-capture landing page for **benjisblueprints.com**. Visitors drop their email and instantly get the free library of done-for-you business plans (a public Google Drive folder) — delivered on-screen and by email.

## How it works
- `/` — squeeze page (email field).
- `POST /api/get-plans` — validates the email, emails the subscriber the Drive folder link (via Resend), emails a lead notification to `ADMIN_EMAILS`, and returns success. The page then reveals the folder link inline.

## Stack
Next.js (App Router) · Resend (transactional email) · deployed on Netlify.

## Setup
```bash
npm install
cp .env.example .env.local   # add your RESEND_API_KEY
npm run dev
```

## Environment variables (set in Netlify)
| Var | Required | Default |
|---|---|---|
| `RESEND_API_KEY` | ✅ | — |
| `EMAIL_FROM` | — | `Benji <ben@benjisaiempire.com>` (must be a Resend-verified sender) |
| `ADMIN_EMAILS` | — | `ben@advancedmarketing.co` |
| `NEXT_PUBLIC_PLANS_URL` | — | the public Drive folder of business plans |

## Deploy (Netlify)
Connect this repo to a Netlify site, set `RESEND_API_KEY` in the site env vars, and point `benjisblueprints.com` at the site. The `@netlify/plugin-nextjs` adapter (declared in `netlify.toml`) handles the Next.js build + the `/api/get-plans` function automatically.
