"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";
import { formatInr, calculateLineTotal } from "@/lib/pricing/format";
import { trackBeginCheckout } from "@/lib/analytics";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isHydrated || !isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-heading"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-brand-ivory text-brand-espresso shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-brand-champagne/40 bg-white">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-brand-gold-dark" />
              <h2 id="cart-heading" className="font-serif text-xl tracking-wide font-semibold">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 -mr-2 text-brand-espresso/70 hover:text-brand-espresso hover:bg-brand-champagne/20 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-brand-champagne/30 overscroll-contain">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-champagne/30 flex items-center justify-center text-brand-gold-dark mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="font-serif text-lg font-medium text-brand-espresso mb-1">
                  Your bag is empty
                </h3>
                <p className="text-sm text-brand-espresso/70 max-w-xs mb-6">
                  Explore our handcrafted bridal and temple jewellery to begin curating your collection.
                </p>
                <Link
                  href="/collections/new-arrivals"
                  onClick={closeCart}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-espresso text-brand-ivory text-sm tracking-widest uppercase font-medium rounded hover:bg-brand-maroon transition-colors"
                >
                  <span>Explore Jewels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const lineTotal = calculateLineTotal(item.unitPrice, item.quantity);
                const isMax = item.quantity >= item.maxAvailableStock;

                return (
                  <div key={item.lineId} className="py-4 flex space-x-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 bg-brand-champagne/20 rounded overflow-hidden flex-shrink-0 border border-brand-champagne/40">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-semibold text-brand-espresso line-clamp-1">
                            {item.productName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.lineId)}
                            className="text-brand-espresso/40 hover:text-brand-maroon transition-colors p-1"
                            title="Remove item"
                            aria-label={`Remove ${item.productName} in ${item.color}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-brand-gold-dark font-medium mt-0.5">
                          ID: {item.productId} • Color: {item.color}
                        </p>
                        <div className="mt-1 flex items-baseline space-x-2">
                          <span className="text-sm font-semibold text-brand-maroon">
                            {formatInr(item.unitPrice)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.unitPrice && (
                            <span className="text-xs text-brand-espresso/40 line-through">
                              {formatInr(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-brand-champagne/60 rounded bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="p-1 hover:bg-brand-champagne/20 text-brand-espresso/80 disabled:opacity-30"
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
                            className="p-1 hover:bg-brand-champagne/20 text-brand-espresso/80 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-brand-espresso">
                            {formatInr(lineTotal)}
                          </span>
                        </div>
                      </div>

                      {isMax && (
                        <p className="text-[10px] text-amber-700 mt-1">
                          Max available stock ({item.maxAvailableStock}) reached
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="border-t border-brand-champagne/40 bg-white px-6 py-5 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-brand-espresso/70">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span className="font-semibold text-brand-espresso">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-brand-espresso/60">
                  <span>Estimated Shipping</span>
                  <span className="italic">To be confirmed via WhatsApp</span>
                </div>
                <div className="pt-2 border-t border-brand-champagne/30 flex justify-between text-base font-serif font-bold text-brand-espresso">
                  <span>Estimated Total</span>
                  <span className="text-brand-maroon">{formatInr(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => {
                    trackBeginCheckout(items, subtotal);
                    closeCart();
                  }}
                  className="w-full py-3.5 px-4 bg-brand-maroon text-brand-ivory text-sm tracking-widest uppercase font-medium rounded shadow flex items-center justify-center space-x-2 hover:bg-brand-maroon-dark transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Proceed to WhatsApp Order</span>
                </Link>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-brand-espresso/50 hover:text-brand-maroon underline"
                  >
                    Clear Cart
                  </button>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-brand-gold-dark hover:underline font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
