import { CartLineItem, OrderCustomerInfo, SiteSettings } from "@/types/catalogue";
import { formatInr, calculateLineTotal, calculateCartSubtotal, calculateCartSavings } from "@/lib/pricing/format";

/**
 * Generates a clean client-side order reference e.g., RJS-20261027-7K2X.
 * Note: As a static site, this is a client reference for the order inquiry, not a backend DB record.
 */
export function generateOrderReference(customDate?: Date): string {
  const d = customDate || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RJS-${year}${month}${day}-${randomSuffix}`;
}

export interface ComposeMessageOptions {
  reference?: string;
  customerInfo?: OrderCustomerInfo;
}

/**
 * Composes a clear, professional WhatsApp order request message.
 */
export function composeWhatsAppOrderMessage(
  items: CartLineItem[],
  options: ComposeMessageOptions = {}
): string {
  const ref = options.reference || generateOrderReference();
  const subtotal = calculateCartSubtotal(items);
  const totalSavings = calculateCartSavings(items);
  const customer = options.customerInfo;

  const itemSections = items.map((item, index) => {
    const lineTotal = calculateLineTotal(item.unitPrice, item.quantity);
    return `${index + 1}. ${item.productName}
   Product ID: ${item.productId}
   Colour: ${item.color}
   Unit Price: ${formatInr(item.unitPrice)}
   Quantity: ${item.quantity}
   Line Total: ${formatInr(lineTotal)}`;
  });

  let message = `Hello RAJISHINE! I would like to place an order.

Order Request: ${ref}

ITEMS

${itemSections.join("\n\n")}

--------------------------------
Subtotal: ${formatInr(subtotal)}`;

  if (totalSavings > 0) {
    message += `\nConfigured Discount Savings: ${formatInr(totalSavings)}`;
  }

  message += `\nShipping: To be confirmed
Estimated Total: ${formatInr(subtotal)} + shipping, if applicable`;

  // Customer contact info (if provided)
  const customerFields: string[] = [];
  if (customer?.customerName?.trim()) {
    customerFields.push(`Name: ${customer.customerName.trim()}`);
  }
  if (customer?.deliveryAddress?.trim()) {
    customerFields.push(`Delivery Address: ${customer.deliveryAddress.trim()}`);
  }
  if (customer?.deliveryCity?.trim() || customer?.deliveryPincode?.trim()) {
    const locParts = [customer.deliveryCity?.trim(), customer.deliveryPincode?.trim()].filter(Boolean);
    customerFields.push(`City / Pincode: ${locParts.join(" - ")}`);
  }
  if (customer?.notes?.trim()) {
    customerFields.push(`Notes: ${customer.notes.trim()}`);
  }

  if (customerFields.length > 0) {
    message += `\n\nCustomer Details:\n${customerFields.join("\n")}`;
  }

  message += `\n
Please confirm availability, shipping charges,
delivery details, and the final order amount.

Thank you!`;

  return message;
}

/**
 * Normalizes a phone number to WhatsApp international format (digits only).
 */
export function normalizeWhatsAppNumber(rawNumber: string, countryCode: string = "+91"): string {
  if (!rawNumber) return "";
  let clean = rawNumber.replace(/[^0-9]/g, "");
  const cleanCode = countryCode.replace(/[^0-9]/g, "");

  // If number starts without country code and is 10 digits, prepend code
  if (clean.length === 10 && cleanCode) {
    clean = `${cleanCode}${clean}`;
  }

  return clean;
}

export interface WhatsAppUrlResult {
  url: string | null;
  encodedMessage: string;
  rawMessage: string;
  reference: string;
  error?: string;
}

/**
 * Builds the complete WhatsApp click-to-chat URL.
 */
export function buildWhatsAppCheckoutUrl(
  items: CartLineItem[],
  settings: SiteSettings,
  customerInfo?: OrderCustomerInfo
): WhatsAppUrlResult {
  const reference = generateOrderReference();

  if (items.length === 0) {
    return {
      url: null,
      encodedMessage: "",
      rawMessage: "",
      reference,
      error: "Your shopping cart is empty.",
    };
  }

  const rawPhone = settings.whatsappPhoneNumber?.trim() || "";
  const phone = normalizeWhatsAppNumber(rawPhone, settings.whatsappCountryCode);

  const rawMessage = composeWhatsAppOrderMessage(items, { reference, customerInfo });
  const encodedMessage = encodeURIComponent(rawMessage);

  if (!phone) {
    return {
      url: null,
      encodedMessage,
      rawMessage,
      reference,
      error: "WhatsApp business phone number is currently not configured in site settings.",
    };
  }

  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  return {
    url,
    encodedMessage,
    rawMessage,
    reference,
  };
}
