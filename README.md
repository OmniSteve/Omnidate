# Date Invite — Deployment Guide

## What's included

```
public/
  index.html          ← the entire frontend (3 pages, stars, runaway No button)
functions/
  api/
    confirm.js        ← Cloudflare Pages Function (POST /api/confirm)
wrangler.toml         ← Pages config
```

No D1 database needed. The Worker just fires one email via Resend.

---

## Step 1 — Get a free Resend account

1. Go to **resend.com** and sign up (free tier: 3,000 emails/month)
2. Add and verify a sending domain (e.g. `omnidesign.pro`)
3. Create an API key — copy it

---

## Step 2 — Deploy to Cloudflare Pages

### Option A: Drag and drop (quickest)

1. Zip the entire `date-invite` folder
2. Go to **Cloudflare Dashboard → Pages → Create a project → Upload assets**
3. Upload the zip, set **build output directory** to `public`
4. Deploy

### Option B: Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy public --project-name=date-invite
```

For the Functions to deploy, push the whole folder (not just `public`):
```bash
wrangler pages deploy . --project-name=date-invite
```

---

## Step 3 — Set environment variables

In **Cloudflare Dashboard → Pages → date-invite → Settings → Environment Variables**:

| Variable        | Value                            |
|-----------------|----------------------------------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxx`       |
| `TO_EMAIL`       | your email address (Steve's)    |
| `FROM_EMAIL`     | `date@omnidesign.pro` (verified in Resend) |

Set these for **Production** (and Preview if you want to test).

---

## Step 4 — Share the link

Send Alex the Cloudflare Pages URL, e.g.:
`https://date-invite.pages.dev`

Or add a custom domain in Pages settings.

---

## How it works

- Page 1: Yes / No question. "No" button teleports away from the cursor on hover/touch.
- Page 2: Date + time picker. On confirm → `POST /api/confirm` → Resend email to you.
- Page 3: Confirmation screen for Alex.
