"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MessageCircle, ShieldAlert, ArrowLeft, Copy, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import { SiteSettings, OrderCustomerInfo } from "@/types/catalogue";
import { formatInr } from "@/lib/pricing/format";
import { buildWhatsAppCheckoutUrl, generateOrderReference } from "./whatsapp";
import { trackWhatsAppCheckoutClick } from "@/lib/analytics";

interface CheckoutClientProps {
  settings: SiteSettings;
}

export function CheckoutClient({ settings }: CheckoutClientProps) {
  const { items, itemCount, subtotal, isHydrated } = useCart();

  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    customerName: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPincode: "",
    notes: "",
  });

  const [copied, setCopied] = useState(false);
  const [reference] = useState(() => generateOrderReference());

  const checkoutResult = useMemo(() => {
    return buildWhatsAppCheckoutUrl(items, settings, customerInfo);
  }, [items, settings, customerInfo]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-ivory py-16 px-4">
        <div className="max-w-md mx-auto bg-white border border-brand-champagne/40 rounded-lg p-8 text-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-brand-gold-dark mx-auto mb-3 opacity-60" />
          <h1 className="font-serif text-2xl font-bold text-brand-espresso mb-2">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-brand-espresso/70 mb-6">
            Please add jewellery items to your bag before proceeding to the WhatsApp order desk.
          </p>
          <Link
            href="/categories"
            className="inline-block px-6 py-2.5 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-maroon-dark"
          >
            Browse Jewellery
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    if (!checkoutResult.url) return;
    trackWhatsAppCheckoutClick(checkoutResult.reference, items, subtotal);
    window.open(checkoutResult.url, "_blank");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(checkoutResult.rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center space-x-2">
          <Link
            href="/cart"
            className="text-xs uppercase tracking-wider font-semibold text-brand-gold-dark hover:text-brand-maroon flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Direct Concierge Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            WhatsApp Order Request
          </h1>
          <p className="text-xs text-brand-espresso/70 mt-2 max-w-lg mx-auto">
            Order Reference: <strong className="font-mono text-brand-maroon">{reference}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Customer Details Form */}
          <div className="space-y-6">
            <div className="bg-white border border-brand-champagne/40 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-espresso border-b border-brand-champagne/30 pb-3">
                1. Delivery &amp; Contact Details
              </h2>
              <p className="text-xs text-brand-espresso/60">
                Optional: Enter your contact details below to pre-populate them in your WhatsApp inquiry message.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.customerName}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, customerName: e.target.value })
                    }
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-sm px-3.5 py-2.5 rounded border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-brand-ivory/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    rows={2}
                    value={customerInfo.deliveryAddress}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, deliveryAddress: e.target.value })
                    }
                    placeholder="Street, Apartment / House No., Landmark"
                    className="w-full text-sm px-3.5 py-2.5 rounded border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-brand-ivory/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={customerInfo.deliveryCity}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, deliveryCity: e.target.value })
                      }
                      placeholder="e.g. Bengaluru, Karnataka"
                      className="w-full text-sm px-3.5 py-2.5 rounded border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-brand-ivory/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                      Postal Pincode
                    </label>
                    <input
                      type="text"
                      value={customerInfo.deliveryPincode}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, deliveryPincode: e.target.value })
                      }
                      placeholder="e.g. 560038"
                      className="w-full text-sm px-3.5 py-2.5 rounded border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-brand-ivory/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Special Notes / Wedding Date
                  </label>
                  <input
                    type="text"
                    value={customerInfo.notes}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, notes: e.target.value })
                    }
                    placeholder="e.g. Wedding event date, gift box request, etc."
                    className="w-full text-sm px-3.5 py-2.5 rounded border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-brand-ivory/20"
                  />
                </div>
              </div>
            </div>

            {/* Selected Items Summary */}
            <div className="bg-white border border-brand-champagne/40 rounded-lg p-6 shadow-sm space-y-3">
              <h3 className="font-serif text-base font-bold text-brand-espresso">
                Items in Request ({itemCount})
              </h3>
              <div className="divide-y divide-brand-champagne/30 text-xs">
                {items.map((i) => (
                  <div key={i.lineId} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-brand-espresso">{i.productName}</p>
                      <p className="text-brand-gold-dark text-[11px]">
                        Colour: {i.color} • Qty: {i.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-brand-maroon">
                      {formatInr(i.unitPrice * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-brand-champagne/40 flex justify-between items-center font-bold text-sm">
                <span>Estimated Subtotal:</span>
                <span className="text-brand-maroon font-serif text-base">
                  {formatInr(subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Precomposed WhatsApp Message & Action */}
          <div className="space-y-6">
            <div className="bg-white border border-brand-champagne/40 rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-brand-champagne/30 pb-3">
                <h2 className="font-serif text-lg font-bold text-brand-espresso">
                  2. Message Preview
                </h2>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs text-brand-gold-dark hover:text-brand-maroon flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message Preview Box */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-md font-mono text-[11px] leading-relaxed text-brand-espresso/90 whitespace-pre-wrap max-h-80 overflow-y-auto select-all">
                {checkoutResult.rawMessage}
              </div>

              {/* Validation Warning if WhatsApp Phone is missing */}
              {checkoutResult.error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start space-x-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Configuration Setup Notice:</p>
                    <p className="mt-0.5">{checkoutResult.error}</p>
                    <p className="mt-1 text-[11px] text-amber-800">
                      Configure <code>whatsapp_phone_number</code> in <code>data/site-settings.csv</code> to enable direct checkout.
                    </p>
                  </div>
                </div>
              )}

              {/* WhatsApp Checkout CTA */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={!checkoutResult.url}
                className={`w-full py-4 px-6 rounded text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2.5 shadow-md transition-all ${
                  checkoutResult.url
                    ? "bg-[#25D366] text-white hover:bg-[#1EBE5D] cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Submit Order via WhatsApp</span>
              </button>

              {/* Important Static Limitation Disclaimer */}
              <div className="pt-2 text-[11px] leading-relaxed text-brand-espresso/60 space-y-1.5">
                <p>
                  <strong>How it works:</strong> Clicking the button opens WhatsApp with your precomposed order inquiry. Our jewellery curator will confirm current piece availability, calculate exact shipping to your location, and provide payment details directly.
                </p>
                <p className="italic">
                  * No order is charged or confirmed until agreed upon with RAJISHINE in WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
