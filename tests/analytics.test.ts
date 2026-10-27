import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  initAnalytics,
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackWhatsAppCheckoutClick,
  setAnalyticsConsent,
  hasAnalyticsConsent,
} from "@/lib/analytics";
import { CartLineItem, Product } from "@/types/catalogue";

describe("Analytics & Privacy Integration Suite", () => {
  beforeEach(() => {
    // Setup clean mock window and localStorage
    const storage: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((k) => delete storage[k]);
      },
    };

    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", {
      localStorage: localStorageMock,
      location: { pathname: "/" },
      document: { title: "RAJISHINE" },
    });
  });

  it("handles missing GA4 and PostHog credentials without throwing errors", () => {
    expect(() => {
      initAnalytics();
      trackPageView("/products/rjs00001");
    }).not.toThrow();
  });

  it("manages user cookie consent accurately", () => {
    expect(hasAnalyticsConsent()).toBe(false);

    setAnalyticsConsent(true);
    expect(hasAnalyticsConsent()).toBe(true);

    setAnalyticsConsent(false);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("safely executes e-commerce tracking functions without throwing", () => {
    const product: Product = {
      productId: "RJS00001",
      productName: "Temple Necklace",
      category: "Necklaces",
      categorySlug: "necklaces",
      description: "Traditional temple necklace",
      images: ["/images/products/RJS00001/gold-front.webp"],
      productPrice: 2499,
      discountedPrice: 1999,
      quantities: [5],
      colors: ["Gold"],
      variants: [
        {
          color: "Gold",
          quantity: 5,
          isAvailable: true,
          images: ["/images/products/RJS00001/gold-front.webp"],
          primaryImage: "/images/products/RJS00001/gold-front.webp",
        },
      ],
      totalStock: 5,
      inStock: true,
      primaryImage: "/images/products/RJS00001/gold-front.webp",
    };

    const cartItem: CartLineItem = {
      lineId: "RJS00001:::Gold",
      productId: "RJS00001",
      productName: "Temple Necklace",
      color: "Gold",
      unitPrice: 1999,
      quantity: 1,
      image: "/images/products/RJS00001/gold-front.webp",
      maxAvailableStock: 5,
      category: "Necklaces",
    };

    expect(() => {
      trackProductView(product, "Gold");
      trackAddToCart(cartItem);
      trackWhatsAppCheckoutClick("RJS-20261027-TEST", [cartItem], 1999);
    }).not.toThrow();
  });
});
