import { CartLineItem } from "@/types/catalogue";

/**
 * Formats a numeric price into INR currency format (e.g., ₹2,499).
 */
export function formatInr(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }
  
  // Format with Indian numbering system (e.g. 1,00,000)
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return formatter.format(Math.round(amount));
}

/**
 * Returns the effective selling price (discounted if available, otherwise regular price).
 */
export function getEffectivePrice(regularPrice: number, discountedPrice?: number): number {
  if (
    discountedPrice !== undefined &&
    discountedPrice !== null &&
    !isNaN(discountedPrice) &&
    discountedPrice > 0 &&
    discountedPrice < regularPrice
  ) {
    return discountedPrice;
  }
  return regularPrice;
}

/**
 * Calculates percentage discount saved.
 */
export function getDiscountPercentage(
  regularPrice: number,
  discountedPrice?: number
): number | undefined {
  if (!discountedPrice || discountedPrice >= regularPrice || regularPrice <= 0) {
    return undefined;
  }
  const pct = Math.round(((regularPrice - discountedPrice) / regularPrice) * 100);
  return pct > 0 ? pct : undefined;
}

/**
 * Calculates line total for a given item.
 */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return Math.max(0, unitPrice) * Math.max(0, quantity);
}

/**
 * Computes subtotal for an array of cart items.
 */
export function calculateCartSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + calculateLineTotal(item.unitPrice, item.quantity), 0);
}

/**
 * Computes total savings from discounts across cart items.
 */
export function calculateCartSavings(items: CartLineItem[]): number {
  return items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.unitPrice) {
      return sum + (item.originalPrice - item.unitPrice) * item.quantity;
    }
    return sum;
  }, 0);
}
