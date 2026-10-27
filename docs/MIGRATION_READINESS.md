# RAJISHINE Migration-Readiness Architecture

This static storefront is architected with a strict separation of concerns, enabling RAJISHINE to migrate effortlessly to a full commerce platform (such as Shopify, MedusaJS, Saleor, BigCommerce, or a headless database backend) without rewriting presentation components.

---

## 🏛️ Modular Architectural Separation

```
Presentation Components
(ProductCard, ProductDetailClient, CategoryGrid)
              ▲
              │ Typed Interfaces (Product, Category, Collection)
              ▼
Data Access Layer (src/lib/data/catalogue.ts)
              ▲
              │ Swappable data source
              ▼
Current: File-based CSV Parsers (src/lib/csv/)
Future: Commerce Platform API Client (e.g. Shopify Storefront API)
```

### 1. Data-Access Abstraction Layer (`src/lib/data/catalogue.ts`)
Components throughout the Next.js App Router do **not** read files or CSV rows directly. Instead, they consume clean, typed domain functions:
- `getAllProducts(): Product[]`
- `getProductById(id: string): Product | undefined`
- `getAllCategories(): Category[]`
- `getCategoryBySlug(slug: string): Category | undefined`
- `getAllCollections(): Collection[]`
- `getCollectionBySlug(slug: string): Collection | undefined`
- `getSiteSettings(): SiteSettings`

**Future Migration Step:**
To connect to an external commerce API, you only need to swap the implementation inside `src/lib/data/catalogue.ts` from reading CSV files to fetching from your commerce GraphQL/REST endpoint. All UI views, SEO metadata generators, and page templates will remain unchanged.

---

## 🏷️ Stable Identifiers and SKUs
- Every product uses an immutable primary key `productId` formatted as `^RJS[0-9]{5}$` (e.g. `RJS00001`).
- Every cart line item is keyed by `${productId}:::${color}`.
- These stable IDs can be mapped 1:1 to external SKU fields or inventory item IDs in any ERP, warehouse management system, or Shopify product variant table.

---

## 🛒 Independent Cart & Checkout Modules
- **Cart (`src/features/cart/CartContext.tsx`):**
  Uses a standalone React context that tracks line items, unit prices, variant selections, and local quantities.
  When moving to server-managed carts, replace the `localStorage` persistence effect with your commerce platform's cart mutations (`cartCreate`, `cartLinesAdd`).
- **Checkout (`src/features/checkout/`):**
  Separated into a modular checkout handler. The current implementation composes a WhatsApp click-to-chat order request. This can be swapped for Stripe Checkout, Razorpay, or hosted platform checkouts by replacing `whatsapp.ts` with a payment gateway provider.

---

## 📊 Analytics Abstraction
- All e-commerce tracking is centralized in `src/lib/analytics/index.ts`.
- Standard Google Analytics 4 e-commerce schemas (`view_item`, `add_to_cart`, `view_cart`, `begin_checkout`) and PostHog properties are utilized.
- Migrating to a gateway will simply involve triggering `purchase` upon webhook confirmation rather than `whatsapp_checkout_clicked` on button click.
