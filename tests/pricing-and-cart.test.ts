import { describe, it, expect } from "vitest";
import {
  formatInr,
  getEffectivePrice,
  getDiscountPercentage,
  calculateLineTotal,
  calculateCartSubtotal,
  calculateCartSavings,
} from "@/lib/pricing/format";
import { CartLineItem, Product } from "@/types/catalogue";

describe("Pricing and Cart Calculation Suite", () => {
  it("formats prices in INR currency accurately", () => {
    expect(formatInr(1999)).toMatch(/₹\s?1,999/);
    expect(formatInr(0)).toMatch(/₹\s?0/);
    expect(formatInr(125000)).toMatch(/₹\s?1,25,000/);
  });

  it("calculates effective price respecting discounts", () => {
    expect(getEffectivePrice(2499, 1999)).toBe(1999);
    expect(getEffectivePrice(899, undefined)).toBe(899);
    expect(getEffectivePrice(1000, 1200)).toBe(1000); // Invalid discount higher than regular price ignored
  });

  it("calculates discount percentages correctly", () => {
    expect(getDiscountPercentage(2499, 1999)).toBe(20);
    expect(getDiscountPercentage(1000, 500)).toBe(50);
    expect(getDiscountPercentage(899, undefined)).toBeUndefined();
  });

  it("calculates line item totals and cart subtotals", () => {
    const items: CartLineItem[] = [
      {
        lineId: "RJS00001:::Gold",
        productId: "RJS00001",
        productName: "Temple Necklace",
        color: "Gold",
        unitPrice: 1999,
        originalPrice: 2499,
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

    expect(calculateLineTotal(items[0].unitPrice, items[0].quantity)).toBe(3998);
    expect(calculateLineTotal(items[1].unitPrice, items[1].quantity)).toBe(899);
    expect(calculateCartSubtotal(items)).toBe(4897);
    expect(calculateCartSavings(items)).toBe(1000); // 500 * 2 saved on item 0
  });

  it("distinguishes line items when the same product is added in two different colours", () => {
    const itemGold: CartLineItem = {
      lineId: "RJS00001:::Gold",
      productId: "RJS00001",
      productName: "Temple Necklace",
      color: "Gold",
      unitPrice: 1999,
      quantity: 1,
      image: "/images/products/RJS00001/gold.webp",
      maxAvailableStock: 5,
      category: "Necklaces",
    };

    const itemAntique: CartLineItem = {
      lineId: "RJS00001:::Antique Gold",
      productId: "RJS00001",
      productName: "Temple Necklace",
      color: "Antique Gold",
      unitPrice: 1999,
      quantity: 2,
      image: "/images/products/RJS00001/antique.webp",
      maxAvailableStock: 2,
      category: "Necklaces",
    };

    const cart = [itemGold, itemAntique];
    expect(cart).toHaveLength(2);
    expect(cart[0].lineId).not.toBe(cart[1].lineId);
    expect(calculateCartSubtotal(cart)).toBe(1999 * 3);
  });
});
