# RAJISHINE — Static Jewellery Storefront

A high-performance, editorial, static e-commerce storefront for **RAJISHINE**, an Indian fashion and bridal jewellery brand serving customers across India and Indians worldwide.

🌐 **Production Domain:** [https://rajishine.com](https://rajishine.com)

---

## 💎 Project Overview

RAJISHINE combines the elegance of high-end South Indian temple, kundan, and bridal jewellery with a modern, static-first architecture. 

The website operates as a pure static storefront where:
- The **GitHub repository** is the authoritative source of truth.
- Product inventory, categories, collections, homepage banners, customer reviews, and site settings are managed via **CSV spreadsheets**.
- Product images are stored directly in the repository under `public/images/`.
- Customers can browse collections, select colours, adjust quantities, and build a persistent multi-item shopping bag.
- Order submission is fulfilled directly through **WhatsApp** via precomposed messages containing line items, product IDs, quantities, and price breakdowns.
- No backend database, user accounts, or payment gateways are needed for this phase.
- Built-in **Google Analytics 4** and **PostHog** integrations track interactions gracefully with full privacy compliance.

---

## 🏛️ Technology Stack

- **Framework:** Next.js (App Router, Static Export `output: 'export'`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom RAJISHINE luxury palette
- **Icons:** Lucide Icons & Custom SVG Brand Graphics
- **CSV Engine:** RFC 4180-compliant CSV parser with strict type validation
- **State Management:** Static-compatible Persistent Cart via browser `localStorage`
- **Testing:** Vitest with 21 automated tests covering catalogue validation, cart logic, pricing, and WhatsApp checkout formatting
- **Hosting:** GitHub Pages / Vercel (automated continuous deployment on Git push via GitHub Actions)

---

## 🎨 Visual Identity

| Token | Hex Code | Visual Application |
|---|---|---|
| **Warm Ivory** | `#FAF6EF` | Primary page canvas & luxury background |
| **Champagne Beige** | `#E8D8C5` | Subtle borders, filigree dividers, card frames |
| **Antique Gold** | `#B08D57` | Refined accents, badges, and secondary typography |
| **Deep Maroon** | `#641F2B` | Primary call-to-action buttons, key prices, and announcements |
| **Dark Espresso** | `#30231E` | Primary headings, body copy, and editorial accents |
| **Pure White** | `#FFFFFF` | Product card surfaces and high-contrast containers |

---

## 📁 Repository Directory Structure

```text
rajishine/
├── public/
│   ├── favicon.ico
│   ├── logo/
│   │   └── rajishine-logo.svg
│   └── images/
│       ├── products/
│       │   ├── RJS00001/
│       │   ├── RJS00002/
│       │   └── ...
│       ├── homepage/
│       ├── categories/
│       ├── collections/
│       └── reviews/
├── data/
│   ├── products.csv              # Master product inventory
│   ├── product-images.csv        # Advanced multi-image per variant manifest
│   ├── categories.csv            # Category names, slugs, and banner images
│   ├── collections.csv           # Curated collections & product groupings
│   ├── homepage.csv              # Section ordering, hero banners, and text
│   ├── reviews.csv               # Client reviews and testimonials
│   ├── site-settings.csv         # WhatsApp number, brand name, disclaimers
│   ├── README.md                 # Spreadsheet management guide
│   └── templates/                # Clean CSV starter templates
├── src/
│   ├── app/                      # Next.js App Router static pages
│   ├── components/               # Header, Footer, AnnouncementBar, etc.
│   ├── features/
│   │   ├── cart/                 # Persistent Shopping Bag & Drawer
│   │   ├── catalogue/            # Product grids, detail views, selectors
│   │   ├── checkout/             # WhatsApp message formatting & desk
│   │   └── analytics/            # GA4, PostHog & Cookie Consent
│   ├── lib/
│   │   ├── csv/                  # RFC 4180 parser & string utilities
│   │   ├── data/                 # Typed catalogue data-access layer
│   │   ├── pricing/              # INR currency formatters & line calculation
│   │   └── analytics/            # Analytics event tracking abstraction
│   └── types/                    # Domain models and CSV row interfaces
├── scripts/
│   ├── validate-catalogue.ts     # Validates CSV schemas, IDs, and relations
│   ├── validate-images.ts        # Validates disk image existence
│   └── generate-placeholder-assets.ts # Generates luxury WebP placeholder assets
├── tests/                        # Vitest automated test suites
├── docs/                         # In-depth architectural & deployment guides
├── .env.example                  # Environment variable reference
└── package.json
```

---

## 📊 Content Management Workflow

Managing the store requires **no coding**:

1. Open `data/products.csv` in **Google Sheets** or **Excel** (UTF-8 encoding).
2. Add or update product rows.
3. Save or export as **CSV UTF-8**.
4. Add corresponding images to `public/images/products/<PRODUCT_ID>/`.
5. Update `data/product-images.csv` if a product has multiple photos for the same colour.
6. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Add new Kundan Bridal Choker (RJS00009)"
   git push origin main
   ```
7. Vercel automatically validates the files and publishes the new static site.

👉 *See [`data/README.md`](data/README.md) for full column schemas and Excel formatting instructions.*

---

## 🛠️ Local Development & Scripts

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Validation Scripts
```bash
# Validates all CSV spreadsheets (schemas, duplicate IDs, price validity, color/quantity parity)
npm run validate:catalogue

# Validates that every image path referenced in CSVs actually exists on disk
npm run validate:images

# Runs both validations together
npm run validate
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. TypeScript Check & Production Build
```bash
npm run typecheck
npm run build
```
The static website is compiled and exported directly into the `out/` folder.

---

## 💬 WhatsApp Checkout Process

When customers finish selecting jewellery:
1. They review their bag at `/cart` or `/checkout`.
2. They can optionally enter their name and delivery location.
3. Clicking **Submit Order via WhatsApp** generates a clean order request reference (e.g. `RJS-20261027-A8B9`) and opens a precomposed WhatsApp message:
   ```text
   Hello RAJISHINE! I would like to place an order.

   Order Request: RJS-20261027-A8B9

   ITEMS

   1. Temple Necklace
      Product ID: RJS00001
      Colour: Gold
      Unit Price: ₹1,999
      Quantity: 2
      Line Total: ₹3,998

   2. Pearl Jhumkas
      Product ID: RJS00002
      Colour: Pearl White
      Unit Price: ₹899
      Quantity: 1
      Line Total: ₹899

   --------------------------------
   Subtotal: ₹4,897
   Shipping: To be confirmed
   Estimated Total: ₹4,897 + shipping, if applicable

   Please confirm availability, shipping charges,
   delivery details, and the final order amount.

   Thank you!
   ```
4. RAJISHINE's concierge confirms live stock, exact shipping costs, and provides payment instructions directly.

---

## 📈 Analytics Setup

Storefront analytics are integrated with:
- **Google Analytics 4:** Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **PostHog:** Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

👉 *See [`docs/ANALYTICS_SETUP.md`](docs/ANALYTICS_SETUP.md) for event schemas, DebugView instructions, and privacy controls.*

---

## 🚀 Deployment & Hosting

The storefront is fully static (`output: 'export'`) and can be deployed anywhere:

### Recommended: GitHub Pages (100% Free & Commercial-Friendly)
- Automated deployment workflow is pre-configured in `.github/workflows/deploy-pages.yml`.
- Custom domain (`rajishine.com`) is supported with free automatic HTTPS.
- Zero extra accounts needed; fully hosted directly from this repository.

👉 *See [`docs/GITHUB_PAGES_SETUP.md`](docs/GITHUB_PAGES_SETUP.md) for step-by-step setup and DNS instructions.*

### Alternative: Vercel
- Hosted with static output export.
- **Note on Vercel Plan:** Commercial stores require a **Vercel Pro plan** (the free Hobby plan is restricted to non-commercial personal projects per Vercel policy: [https://vercel.com/docs/plans/hobby](https://vercel.com/docs/plans/hobby)).

👉 *See [`docs/VERCEL_DEPLOYMENT.md`](docs/VERCEL_DEPLOYMENT.md) for full Vercel instructions.*
👉 *See [`docs/MIGRATION_READINESS.md`](docs/MIGRATION_READINESS.md) for our commerce migration architecture.*
