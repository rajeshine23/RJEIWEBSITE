"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import { formatInr, calculateLineTotal, calculateCartSavings } from "@/lib/pricing/format";
import { trackBeginCheckout } from "@/lib/analytics";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const savings = calculateCartSavings(items);

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Your Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            Shopping Bag ({itemCount})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-brand-champagne/40 rounded-lg p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-champagne/20 flex items-center justify-center text-brand-gold-dark mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-brand-espresso mb-2">
              Your shopping bag is currently empty
            </h2>
            <p className="text-sm text-brand-espresso/70 mb-6">
              Discover our exquisite temple, bridal, and festive jewellery creations.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-maroon-dark transition-colors"
            >
              <span>Explore Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Table / Cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-brand-champagne/40 rounded-lg divide-y divide-brand-champagne/30 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-brand-ivory/50 flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-brand-espresso/70">
                  <span>Product Details</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear your entire bag?")) {
                        clearCart();
                      }
                    }}
                    className="text-brand-espresso/50 hover:text-brand-maroon underline"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => {
                  const lineTotal = calculateLineTotal(item.unitPrice, item.quantity);
                  const isMax = item.quantity >= item.maxAvailableStock;

                  return (
                    <div key={item.lineId} className="p-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start sm:items-center">
                      <div className="relative w-24 h-28 bg-brand-champagne/20 rounded border border-brand-champagne/40 overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-gold-dark">
                          {item.category} • SKU: {item.productId}
                        </span>
                        <h3 className="font-serif text-base font-semibold text-brand-espresso">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-brand-espresso/70 font-medium">
                          Colour: <span className="text-brand-espresso font-semibold">{item.color}</span>
                        </p>
                        <div className="flex items-baseline space-x-2 pt-1">
                          <span className="text-sm font-bold text-brand-maroon">
                            {formatInr(item.unitPrice)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.unitPrice && (
                            <span className="text-xs text-brand-espresso/40 line-through">
                              {formatInr(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto space-y-2">
                        <div className="flex items-center border border-brand-champagne/60 rounded bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="p-1.5 text-brand-espresso hover:bg-brand-champagne/20"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-brand-espresso">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            disabled={isMax}
                            className="p-1.5 text-brand-espresso hover:bg-brand-champagne/20 disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-brand-espresso">
                            {formatInr(lineTotal)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          className="text-brand-espresso/40 hover:text-brand-maroon p-1 text-xs flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/categories"
                  className="text-xs uppercase tracking-wider font-semibold text-brand-gold-dark hover:underline flex items-center space-x-1"
                >
                  <span>← Continue Browsing Jewellery</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="bg-white border border-brand-champagne/40 rounded-lg p-6 shadow-sm h-fit space-y-6">
              <h2 className="font-serif text-lg font-bold text-brand-espresso border-b border-brand-champagne/30 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-espresso/70">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-brand-espresso">{formatInr(subtotal)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-700 text-xs">
                    <span>Configured Savings</span>
                    <span className="font-semibold">-{formatInr(savings)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-brand-espresso/60">
                  <span>Estimated Shipping</span>
                  <span className="italic">To be confirmed</span>
                </div>

                <div className="border-t border-brand-champagne/30 pt-3 flex justify-between font-serif text-lg font-bold text-brand-espresso">
                  <span>Estimated Total</span>
                  <span className="text-brand-maroon">{formatInr(subtotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-ivory/80 rounded border border-brand-champagne/40 text-xs text-brand-espresso/70 space-y-1">
                <p className="font-semibold text-brand-espresso">Direct WhatsApp Ordering</p>
                <p>
                  No online card payment required. Clicking proceed prepares a precomposed WhatsApp message to confirm piece availability and dispatch.
                </p>
              </div>

              <Link
                href="/checkout"
                onClick={() => trackBeginCheckout(items, subtotal)}
                className="w-full py-4 px-6 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded shadow flex items-center justify-center space-x-2 hover:bg-brand-maroon-dark transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Proceed to WhatsApp Checkout</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
