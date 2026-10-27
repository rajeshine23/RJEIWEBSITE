# RAJISHINE Vercel Deployment Guide

This storefront is fully pre-configured for automated static deployment on Vercel directly from the GitHub repository.

---

## ⚠️ Important Hosting Plan Notice

> [!CAUTION]
> **Vercel Hobby Plan Terms Notice:**
> The **Vercel Hobby plan is restricted to personal, non-commercial use only**.
> Because RAJISHINE is a commercial brand storefront selling jewellery, the production store must be hosted on an appropriate plan such as the **Vercel Pro plan** (or an alternative static host like Cloudflare Pages or AWS S3 + CloudFront).
> Review Vercel's official plan terms here: [https://vercel.com/docs/plans/hobby](https://vercel.com/docs/plans/hobby)

---

## 🚀 Step-by-Step Vercel Setup

### 1. Connect GitHub Repository
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New... > Project**.
3. Select your GitHub account and import the `RajiShine` repository.

### 2. Configure Build Settings
Vercel detects Next.js automatically:
- **Framework Preset:** `Next.js`
- **Root Directory:** `./`
- **Build Command:** `npm run build` (This automatically runs `npm run validate` beforehand via the prebuild hook!)
- **Output Directory:** `out` (Pure static export)
- **Install Command:** `npm install`

### 3. Add Environment Variables
In the **Environment Variables** section, configure:

| Key | Example Value | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://rajishine.com` | Canonical storefront domain |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Optional: GA4 Measurement ID |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_xxxxxxxxxxxx` | Optional: PostHog Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://app.posthog.com` | Optional: PostHog Ingestion Host |

### 4. Deploy and Verify
1. Click **Deploy**.
2. Vercel will clone the repository, validate all CSV spreadsheets and image files, run tests, and generate all static pages.
3. Once deployed, verify your custom domain (`https://rajishine.com`) in **Project Settings > Domains**.

---

## 🔄 Content Publishing Workflow

Once connected:
1. Edit any CSV in `data/` or add images to `public/images/`.
2. Commit and push to your `main` branch.
3. Vercel automatically re-validates the catalogue and updates the live site in under 60 seconds!
