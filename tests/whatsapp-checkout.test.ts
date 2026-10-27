import { describe, it, expect } from "vitest";
import {
  composeWhatsAppOrderMessage,
  buildWhatsAppCheckoutUrl,
  generateOrderReference,
  normalizeWhatsAppNumber,
} from "@/features/checkout/whatsapp";
import { CartLineItem, SiteSettings } from "@/types/catalogue";

describe("WhatsApp Checkout & Order Messaging Suite", () => {
  const sampleItems: CartLineItem[] = [
    {
      lineId: "RJS00001:::Gold",
      productId: "RJS00001",
      productName: "Temple Necklace",
      color: "Gold",
      unitPrice: 1999,
      quantity: 2,
      image: "/images/products/RJS00001/gold-front.webp",
      maxAvailableStock: 5,
      category: "Necklaces",
    },
    {
      lineId: "RJS00002:::Pearl White",
      productId: "RJS00002",
      productName: "Pearl Jhumkas",
      color: "Pearl White",
      unitPrice: 899,
      quantity: 1,
      image: "/images/products/RJS00002/pearl.webp",
      maxAvailableStock: 12,
      category: "Earrings",
    },
  ];

  const sampleSettings: SiteSettings = {
    brandName: "RAJISHINE",
    siteUrl: "https://rajishine.com",
    currency: "INR",
    whatsappCountryCode: "+91",
    whatsappPhoneNumber: "919876543210",
    announcementText: "Welcome to RAJISHINE",
    instagramUrl: "https://www.instagram.com/raji_fashion_jewelry",
    contactEmail: "care@rajishine.com",
    footerCopyright: "© 2026 RAJISHINE",
    defaultSeoDescription: "Fine Indian Jewellery",
    socialShareImage: "/images/homepage/hero-bridal.webp",
    shippingDisclaimer: "Shipping charges to be confirmed via WhatsApp",
  };

  it("generates structured order reference with prefix RJS-", () => {
    const ref = generateOrderReference();
    expect(ref).toMatch(/^RJS-[0-9]{8}-[A-Z0-9]{4}$/);
  });

  it("composes complete WhatsApp order message containing all line items", () => {
    const msg = composeWhatsAppOrderMessage(sampleItems, {
      reference: "RJS-TEST-1234",
      customerInfo: {
        customerName: "Priya Sharma",
        deliveryAddress: "Flat 402, Royal Palms",
        deliveryCity: "Bengaluru",
        deliveryPincode: "560038",
        notes: "Please package securely for bridal trousseau",
      },
    });

    expect(msg).toContain("Hello RAJISHINE! I would like to place an order.");
    expect(msg).toContain("Order Request: RJS-TEST-1234");
    expect(msg).toContain("1. Temple Necklace");
    expect(msg).toContain("Product ID: RJS00001");
    expect(msg).toContain("Colour: Gold");
    expect(msg).toContain("Quantity: 2");
    expect(msg).toContain("Line Total: ₹3,998");
    expect(msg).toContain("2. Pearl Jhumkas");
    expect(msg).toContain("Product ID: RJS00002");
    expect(msg).toContain("Subtotal: ₹4,897");
    expect(msg).toContain("Estimated Total: ₹4,897 + shipping, if applicable");
    expect(msg).toContain("Name: Priya Sharma");
    expect(msg).toContain("City / Pincode: Bengaluru - 560038");
    expect(msg).toContain("Please confirm availability, shipping charges");
  });

  it("builds valid click-to-chat WhatsApp URL", () => {
    const result = buildWhatsAppCheckoutUrl(sampleItems, sampleSettings);
    expect(result.url).toBeDefined();
    expect(result.url).toContain("https://wa.me/919876543210?text=");
    expect(result.error).toBeUndefined();

    // Decode and verify the URL encoded message
    const decoded = decodeURIComponent(result.encodedMessage);
    expect(decoded).toContain("Order Request:");
    expect(decoded).toContain("Temple Necklace");
  });

  it("returns error and disables checkout when WhatsApp phone is unconfigured", () => {
    const emptySettings: SiteSettings = {
      ...sampleSettings,
      whatsappPhoneNumber: "",
    };

    const result = buildWhatsAppCheckoutUrl(sampleItems, emptySettings);
    expect(result.url).toBeNull();
    expect(result.error).toContain("WhatsApp business phone number is currently not configured");
  });

  it("normalizes phone numbers to pure digits including country code", () => {
    expect(normalizeWhatsAppNumber("+91 98765-43210", "+91")).toBe("919876543210");
    expect(normalizeWhatsAppNumber("9876543210", "+91")).toBe("919876543210");
  });
});
