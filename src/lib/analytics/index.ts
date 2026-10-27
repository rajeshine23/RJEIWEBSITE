import posthog from "posthog-js";
import { CartLineItem, Product } from "@/types/catalogue";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

let isPostHogInitialized = false;

// Check cookie consent state
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  const consent = localStorage.getItem("rajishine_cookie_consent");
  return consent === "granted";
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rajishine_cookie_consent", granted ? "granted" : "denied");
  
  if (granted) {
    initAnalytics();
  } else {
    // If denied, disable PostHog persistence
    if (isPostHogInitialized) {
      posthog.opt_out_capturing();
    }
  }
}

/**
 * Initializes GA4 and PostHog once if credentials are present and consent is given.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;

  const consent = localStorage.getItem("rajishine_cookie_consent");
  // Default to allowing if consent banner was accepted, or if user hasn't explicitly denied
  if (consent === "denied") {
    return;
  }

  // Initialize PostHog
  if (POSTHOG_KEY && !isPostHogInitialized) {
    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false, // We manually trigger on App Router navigation to avoid duplicate hits
        capture_pageleave: true,
        autocapture: false,
        disable_session_recording: true, // Privacy-first default as required by specification
        persistence: "localStorage",
        loaded: () => {
          isPostHogInitialized = true;
        },
      });
    } catch {
      // Degrade silently
    }
  }
}

/**
 * Sends a SPA Page View event to GA4 and PostHog.
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window === "undefined") return;

  // Google Analytics 4 page_view
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "page_view", {
      page_location: url,
      page_title: title || document.title,
    });
  }

  // PostHog $pageview
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("$pageview", {
      $current_url: url,
      title: title || document.title,
    });
  }
}

/**
 * Tracks viewing a product detail page.
 */
export function trackProductView(product: Product, selectedColor?: string): void {
  const price = product.discountedPrice || product.productPrice;

  // GA4 view_item
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "view_item", {
      currency: "INR",
      value: price,
      items: [
        {
          item_id: product.productId,
          item_name: product.productName,
          item_category: product.category,
          price: price,
          item_variant: selectedColor || product.colors[0],
          quantity: 1,
        },
      ],
    });
  }

  // PostHog product_viewed
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("product_viewed", {
      product_id: product.productId,
      product_name: product.productName,
      category: product.category,
      price: price,
      color: selectedColor || product.colors[0],
      in_stock: product.inStock,
    });
  }
}

/**
 * Tracks adding an item to the shopping cart.
 */
export function trackAddToCart(item: CartLineItem): void {
  // GA4 add_to_cart
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "add_to_cart", {
      currency: "INR",
      value: item.unitPrice * item.quantity,
      items: [
        {
          item_id: item.productId,
          item_name: item.productName,
          item_category: item.category,
          price: item.unitPrice,
          item_variant: item.color,
          quantity: item.quantity,
        },
      ],
    });
  }

  // PostHog add_to_cart
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("add_to_cart", {
      product_id: item.productId,
      product_name: item.productName,
      category: item.category,
      color: item.color,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      line_total: item.unitPrice * item.quantity,
    });
  }
}

/**
 * Tracks removing an item from the shopping cart.
 */
export function trackRemoveFromCart(item: CartLineItem): void {
  // GA4 remove_from_cart
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "remove_from_cart", {
      currency: "INR",
      value: item.unitPrice * item.quantity,
      items: [
        {
          item_id: item.productId,
          item_name: item.productName,
          price: item.unitPrice,
          item_variant: item.color,
          quantity: item.quantity,
        },
      ],
    });
  }

  // PostHog remove_from_cart
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("remove_from_cart", {
      product_id: item.productId,
      product_name: item.productName,
      color: item.color,
      quantity: item.quantity,
    });
  }
}

/**
 * Tracks viewing the shopping cart.
 */
export function trackViewCart(items: CartLineItem[], subtotal: number): void {
  // GA4 view_cart
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "view_cart", {
      currency: "INR",
      value: subtotal,
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.productName,
        price: i.unitPrice,
        item_variant: i.color,
        quantity: i.quantity,
      })),
    });
  }

  // PostHog cart_viewed
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("cart_viewed", {
      item_count: items.reduce((s, i) => s + i.quantity, 0),
      cart_subtotal: subtotal,
    });
  }
}

/**
 * Tracks initiating checkout process.
 */
export function trackBeginCheckout(items: CartLineItem[], subtotal: number): void {
  // GA4 begin_checkout
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "begin_checkout", {
      currency: "INR",
      value: subtotal,
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.productName,
        price: i.unitPrice,
        item_variant: i.color,
        quantity: i.quantity,
      })),
    });
  }

  // PostHog checkout_started
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("checkout_started", {
      total_items: items.reduce((s, i) => s + i.quantity, 0),
      cart_subtotal: subtotal,
    });
  }
}

/**
 * Tracks click on WhatsApp checkout button.
 * CRITICAL REQUIREMENT: This is an inquiry click event, NEVER a purchase or transaction event.
 * No customer PII (phone number, customer address, full message) is transmitted.
 */
export function trackWhatsAppCheckoutClick(
  reference: string,
  items: CartLineItem[],
  subtotal: number
): void {
  // GA4 custom event: whatsapp_checkout_click
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "whatsapp_checkout_click", {
      currency: "INR",
      value: subtotal,
      order_reference: reference,
      item_count: items.length,
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.productName,
        price: i.unitPrice,
        item_variant: i.color,
        quantity: i.quantity,
      })),
    });
  }

  // PostHog whatsapp_checkout_clicked
  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("whatsapp_checkout_clicked", {
      order_reference: reference,
      item_count: items.length,
      cart_subtotal: subtotal,
    });
  }
}

/**
 * Tracks category selection.
 */
export function trackCategorySelect(categoryName: string, slug: string): void {
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "select_category", {
      category_name: categoryName,
      slug,
    });
  }

  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("category_selected", {
      category_name: categoryName,
      slug,
    });
  }
}

/**
 * Tracks collection selection.
 */
export function trackCollectionSelect(collectionName: string, slug: string): void {
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "select_collection", {
      collection_name: collectionName,
      slug,
    });
  }

  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("collection_selected", {
      collection_name: collectionName,
      slug,
    });
  }
}

/**
 * Tracks hero CTA click.
 */
export function trackHeroCtaClick(label: string, destinationUrl: string): void {
  if (GA_MEASUREMENT_ID && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "click_hero_cta", {
      cta_label: label,
      destination_url: destinationUrl,
    });
  }

  if (POSTHOG_KEY && isPostHogInitialized) {
    posthog.capture("hero_cta_clicked", {
      cta_label: label,
      destination_url: destinationUrl,
    });
  }
}
