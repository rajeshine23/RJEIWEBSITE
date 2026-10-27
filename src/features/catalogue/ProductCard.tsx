"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/catalogue";
import { formatInr, getDiscountPercentage } from "@/lib/pricing/format";
import { useCart } from "@/features/cart/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const displayedImage = currentVariant?.primaryImage || product.primaryImage;
  const isVariantInStock = currentVariant ? currentVariant.isAvailable : product.inStock;

  const discountPercent = getDiscountPercentage(product.productPrice, product.discountedPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isVariantInStock) return;

    const res = addItem(product, currentVariant.color, 1);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-brand-champagne/40 rounded-sm overflow-hidden hover:shadow-editorial transition-all duration-300">
      {/* Product Image & Badges */}
      <Link
        href={`/products/${product.productId.toLowerCase()}`}
        className="relative aspect-[4/5] w-full bg-brand-champagne/10 overflow-hidden block"
      >
        <Image
          src={displayedImage}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-maroon text-brand-ivory rounded shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {!isVariantInStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-espresso/80 text-white rounded backdrop-blur-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Product SKU badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-medium tracking-wider bg-white/80 backdrop-blur-xs text-brand-espresso rounded border border-brand-champagne/40">
            {product.productId}
          </span>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-brand-gold-dark block mb-1">
            {product.category}
          </span>
          <Link
            href={`/products/${product.productId.toLowerCase()}`}
            className="font-serif text-base font-semibold text-brand-espresso group-hover:text-brand-maroon transition-colors line-clamp-1"
          >
            {product.productName}
          </Link>
        </div>

        {/* Color Swatches */}
        {product.variants.length > 1 && (
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-[10px] uppercase tracking-wider text-brand-espresso/60 mr-1">
              Colors:
            </span>
            {product.variants.map((v, idx) => {
              const isSelected = idx === selectedVariantIndex;
              return (
                <button
                  key={v.color}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full border transition-all ${
                    isSelected
                      ? "border-brand-maroon bg-brand-maroon text-white font-semibold"
                      : "border-brand-champagne/60 bg-brand-ivory text-brand-espresso hover:border-brand-gold"
                  } ${!v.isAvailable ? "opacity-40 line-through" : ""}`}
                  title={`${v.color} (${v.isAvailable ? `${v.quantity} in stock` : "Sold Out"})`}
                >
                  {v.color}
                </button>
              );
            })}
          </div>
        )}

        {/* Pricing & Add Button */}
        <div className="pt-2 border-t border-brand-champagne/30 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-brand-maroon">
              {formatInr(product.discountedPrice || product.productPrice)}
            </span>
            {product.discountedPrice && (
              <span className="text-xs text-brand-espresso/40 line-through">
                {formatInr(product.productPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!isVariantInStock}
            className={`p-2 rounded text-xs font-medium tracking-wider uppercase transition-all flex items-center space-x-1 ${
              !isVariantInStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : addedToast
                ? "bg-emerald-700 text-white"
                : "bg-brand-espresso text-brand-ivory hover:bg-brand-maroon"
            }`}
            aria-label={`Add ${product.productName} to bag`}
          >
            {addedToast ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
