# RAJISHINE Analytics & Privacy Configuration Guide

This guide explains how to configure, verify, and monitor Google Analytics 4 (GA4) and PostHog for the RAJISHINE static storefront.

---

## 🔑 Environment Variables

Add the following variables in `.env.local` for local development, or in your Vercel Project Settings (`Settings > Environment Variables`):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_SITE_URL=https://rajishine.com
```

### Safe Graceful Degradation
- If either ID is empty or omitted, the application operates normally with zero console errors or crashes.
- The Google tag script will not be injected if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is blank.
- PostHog will not attempt initialization if `NEXT_PUBLIC_POSTHOG_KEY` is blank.

---

## 🛡️ Privacy Safeguards & Data Exclusions

In compliance with international privacy best practices:
1. **No Sensitive PII Transmitted:**
   - Customer phone numbers, home delivery addresses, full names, and personal delivery notes are **strictly excluded** from all analytics events.
   - WhatsApp message contents are never recorded or sent to GA4 or PostHog.
2. **Session Recording Disabled:**
   - PostHog session recording is disabled by default (`disable_session_recording: true`) to avoid capturing sensitive customer browsing or input data.
3. **Cookie Consent Management:**
   - A non-intrusive cookie consent banner is rendered to visitors.
   - User choices (`granted` or `denied`) are stored in `localStorage` under `rajishine_cookie_consent`.
   - If denied, PostHog calls `opt_out_capturing()` and tracking stops.

---

## 📈 Tracked Events & Dictionary

| Event (GA4) | Event (PostHog) | Payload / Properties | Notes |
|---|---|---|---|
| `page_view` | `$pageview` | `page_location`, `title` | Fired on client-side route changes without duplicate counts. |
| `view_item` | `product_viewed` | `item_id`, `item_name`, `price`, `color`, `category` | Fired when visiting a product detail page. |
| `add_to_cart` | `add_to_cart` | `item_id`, `item_name`, `unit_price`, `quantity`, `color` | Fired when an item is added to the shopping bag. |
| `remove_from_cart` | `remove_from_cart` | `item_id`, `color`, `quantity` | Fired when an item is removed from the bag. |
| `view_cart` | `cart_viewed` | `value`, `item_count`, `items` array | Fired when opening the slide-out bag or viewing `/cart`. |
| `begin_checkout` | `checkout_started` | `value`, `total_items`, `items` array | Fired when proceeding to the WhatsApp order desk. |
| `whatsapp_checkout_click` | `whatsapp_checkout_clicked` | `order_reference`, `item_count`, `cart_subtotal` | **Inquiry click only. NEVER fires a `purchase` event.** |
| `select_category` | `category_selected` | `category_name`, `slug` | Fired when clicking category links. |
| `select_collection` | `collection_selected` | `collection_name`, `slug` | Fired when clicking collection cards. |
| `click_hero_cta` | `hero_cta_clicked` | `cta_label`, `destination_url` | Fired when clicking hero banners. |

> **IMPORTANT:** A click on the WhatsApp checkout button initiates an order inquiry, not a paid financial transaction. We deliberately avoid emitting a `purchase` event to protect conversion metrics and maintain accurate accounting.

---

## 🔍 How to Verify Events

### Google Analytics 4 (GA4) DebugView
1. Install the [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnnbpmfnimdolnjgahmheneakbmfljfo).
2. Enable the extension on `https://rajishine.com` (or `http://localhost:3000`).
3. Open your Google Analytics dashboard and go to **Admin > DebugView**.
4. Browse products, add to cart, and observe incoming events in real time.

### PostHog Event Explorer
1. Open your PostHog project dashboard.
2. Navigate to **Activity > Events**.
3. Filter by `event in [product_viewed, add_to_cart, whatsapp_checkout_clicked]`.
4. Inspect event properties to verify product IDs, categories, and totals.
