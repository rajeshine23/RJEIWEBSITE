# Deploying RAJISHINE on GitHub Pages

This guide explains how RAJISHINE is hosted on GitHub Pages with zero external dependencies, automated continuous deployment, and custom domain configuration for `rajishine.com`.

---

## 1. Enable GitHub Pages in Repository Settings

Because RAJISHINE uses modern GitHub Actions deployment, you only need to flip one setting in GitHub:

1. Open your repository on GitHub: [rajeshine23/RJEIWEBSITE](https://github.com/rajeshine23/RJEIWEBSITE)
2. Click **Settings** (top navigation tab).
3. In the left sidebar, under **Code and automation**, click **Pages**.
4. Under **Build and deployment** → **Source**, select:
   👉 **`GitHub Actions`** (instead of "Deploy from a branch").

That's it! Every time you push a commit or edit a CSV on GitHub, the `.github/workflows/deploy-pages.yml` workflow will automatically validate, compile, and deploy the updated storefront to GitHub Pages.

---

## 2. Custom Domain Setup (`rajishine.com`)

The repository already includes `public/CNAME` pre-set to `rajishine.com`.

### DNS Configuration in Cloudflare / Domain Registrar

Add the following DNS records in your domain dashboard:

#### A Records (for apex domain `rajishine.com`):
| Type | Name | Content / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (or `rajishine.com`) | `185.199.108.153` | Auto / 1 hour |
| **A** | `@` (or `rajishine.com`) | `185.199.109.153` | Auto / 1 hour |
| **A** | `@` (or `rajishine.com`) | `185.199.110.153` | Auto / 1 hour |
| **A** | `@` (or `rajishine.com`) | `185.199.111.153` | Auto / 1 hour |

#### CNAME Record (for `www.rajishine.com`):
| Type | Name | Content / Value |
| :--- | :--- | :--- |
| **CNAME** | `www` | `rajeshine23.github.io` |

*(If using Cloudflare, you can set the proxy status to "DNS only" during initial HTTPS certificate generation by GitHub, then enable Cloudflare proxying if desired.)*

#### Enable HTTPS in GitHub:
Once DNS propagates, in **Settings → Pages**:
- Check **Enforce HTTPS** (GitHub provisions a free Let's Encrypt SSL certificate automatically).

---

## 3. Analytics Environment Secrets (Optional)

Default GA4 Measurement ID (`G-Y53V4D67TS`) and PostHog Key (`phc_x3kWyozsxZfzmxqN6HuwHDwD6dpbnMuQYsXYUNV7TJW9`) are automatically injected by the workflow.

If you ever wish to override them:
1. In repository **Settings** → **Secrets and variables** → **Actions**.
2. Add repository secrets:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_POSTHOG_KEY`

---

## 4. How Catalogue Updates Work

When you add new products or update prices:
1. Edit `data/products.csv` directly in GitHub or push locally.
2. The GitHub Action will run:
   - Verifies CSV formatting and image paths.
   - Builds the static export.
   - Publishes to the live site in ~60-90 seconds.
