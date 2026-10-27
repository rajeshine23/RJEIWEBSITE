"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Product, SiteSettings } from "@/types/catalogue";
import { formatInr, getDiscountPercentage } from "@/lib/pricing/format";
import { useCart } from "@/features/cart/CartContext";
import { trackProductView, trackWhatsAppCheckoutClick } from "@/lib/analytics";
import { buildWhatsAppCheckoutUrl } from "@/features/checkout/whatsapp";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  settings: SiteSettings;
}

export function ProductDetailClient({
  product,
  relatedProducts,
  settings,
}: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Find active variant
  const currentVariant =
    product.variants.find((v) => v.color.toLowerCase() === selectedColor.toLowerCase()) ||
    product.variants[0];

  const availableStock = currentVariant ? currentVariant.quantity : 0;
  const isAvailable = availableStock > 0;

  // Available images for the currently selected color
  const colorImages =
    currentVariant && currentVariant.images.length > 0
      ? currentVariant.images
      : product.images;

  // When color changes, reset image index and clamp quantity
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
    const variant = product.variants.find((v) => v.color.toLowerCase() === color.toLowerCase());
    const stock = variant ? variant.quantity : 0;
    if (quantity > stock) {
      setQuantity(Math.max(1, stock));
    }
  };

  useEffect(() => {
    trackProductView(product, selectedColor);
  }, [product, selectedColor]);

  const discountPercent = getDiscountPercentage(product.productPrice, product.discountedPrice);
  const effectivePrice = product.discountedPrice || product.productPrice;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const res = addItem(product, selectedColor, quantity);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const handleDirectWhatsAppOrder = () => {
    if (!isAvailable) return;

    const singleItem = {
      lineId: `${product.productId}:::${selectedColor}`,
      productId: product.productId,
      productName: product.productName,
      color: selectedColor,
      unitPrice: effectivePrice,
      originalPrice: product.discountedPrice ? product.productPrice : undefined,
      quantity,
      image: colorImages[activeImageIndex] || product.primaryImage,
      maxAvailableStock: availableStock,
      category: product.category,
    };

    const res = buildWhatsAppCheckoutUrl([singleItem], settings);
    if (res.url) {
      trackWhatsAppCheckoutClick(res.reference, [singleItem], effectivePrice * quantity);
      window.open(res.url, "_blank");
    } else if (res.error) {
      alert(res.error);
    }
  };

  return (
    <div className="bg-brand-ivory min-h-screen pb-16">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs tracking-wider uppercase text-brand-espresso/60 flex items-center space-x-2"
      >
        <Link href="/" className="hover:text-brand-maroon">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-brand-maroon">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-brand-espresso font-semibold truncate max-w-xs">
          {product.productName}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] w-full bg-white rounded border border-brand-champagne/40 overflow-hidden shadow-sm">
              <Image
                src={colorImages[activeImageIndex] || product.primaryImage}
                alt={`${product.productName} in ${selectedColor}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {discountPercent && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-maroon text-brand-ivory rounded shadow-sm">
                    Save {discountPercent}%
                  </span>
                </div>
              )}

              {!isAvailable && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-espresso/90 text-white rounded backdrop-blur-xs">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail carousel/row */}
            {colorImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {colorImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                      idx === activeImageIndex
                        ? "border-brand-maroon shadow-md"
                        : "border-brand-champagne/40 hover:border-brand-gold opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="flex flex-col justify-start space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold tracking-widest text-brand-gold-dark">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-brand-espresso/50 border border-brand-champagne/40 px-2 py-0.5 rounded">
                  SKU: {product.productId}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
                {product.productName}
              </h1>

              {/* Price section */}
              <div className="mt-3 flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-brand-maroon font-serif">
                  {formatInr(effectivePrice)}
                </span>
                {product.discountedPrice && (
                  <span className="text-base text-brand-espresso/40 line-through">
                    {formatInr(product.productPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs text-brand-maroon font-semibold">
                    ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-espresso/60 mt-0.5">
                All taxes included • Shipping calculated upon WhatsApp inquiry confirmation
              </p>
            </div>

            <div className="border-t border-brand-champagne/30 pt-4">
              <p className="text-sm leading-relaxed text-brand-espresso/80">
                {product.description}
              </p>
            </div>

            {/* Colour Selector */}
            <div className="space-y-2 border-t border-brand-champagne/30 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-brand-espresso">
                  Select Colour / Finish:
                </span>
                <span className="text-brand-gold-dark font-medium">{selectedColor}</span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {product.variants.map((v) => {
                  const isSelected = v.color.toLowerCase() === selectedColor.toLowerCase();
                  return (
                    <button
                      key={v.color}
                      type="button"
                      onClick={() => handleColorChange(v.color)}
                      className={`px-4 py-2 text-xs font-medium rounded border transition-all ${
                        isSelected
                          ? "border-brand-maroon bg-brand-maroon text-brand-ivory font-semibold shadow-sm"
                          : "border-brand-champagne/60 bg-white text-brand-espresso hover:border-brand-gold"
                      } ${!v.isAvailable ? "opacity-50 line-through" : ""}`}
                    >
                      {v.color} {!v.isAvailable && "(Sold Out)"}
                    </button>
                  );
                })}
              </div>

              {/* Stock availability note */}
              <div className="pt-1 text-xs">
                {isAvailable ? (
                  <span className="text-emerald-700 font-medium flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                    <span>In Stock ({availableStock} units currently available)</span>
                  </span>
                ) : (
                  <span className="text-amber-800 font-medium">
                    Currently sold out in this colour. Contact us on WhatsApp for pre-order.
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            {isAvailable && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-espresso block">
                  Quantity:
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-brand-champagne/60 rounded bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-sm text-brand-espresso hover:bg-brand-champagne/20 disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold text-brand-espresso">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                      disabled={quantity >= availableStock}
                      className="px-3 py-1.5 text-sm text-brand-espresso hover:bg-brand-champagne/20 disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-brand-espresso/60">
                    Subtotal: <strong>{formatInr(effectivePrice * quantity)}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full py-4 px-6 rounded font-medium text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-sm ${
                  !isAvailable
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : addedToast
                    ? "bg-emerald-700 text-white"
                    : "bg-brand-espresso text-brand-ivory hover:bg-brand-maroon"
                }`}
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag! View Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppOrder}
                disabled={!isAvailable}
                className={`w-full py-3.5 px-6 rounded font-medium text-xs uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${
                  !isAvailable
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-brand-maroon bg-white text-brand-maroon hover:bg-brand-maroon hover:text-white"
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="border border-brand-champagne/40 bg-white/60 rounded p-4 space-y-3 text-xs text-brand-espresso/80">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-brand-gold-dark flex-shrink-0" />
                <span><strong>Heirloom Finish:</strong> Handcrafted with premium bridal standards.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-brand-gold-dark flex-shrink-0" />
                <span><strong>Express Dispatch:</strong> Insured packaging sent directly to your doorstep.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <RotateCcw className="w-4 h-4 text-brand-gold-dark flex-shrink-0" />
                <span><strong>Personal Service:</strong> Chat directly with our jewellery curator for sizing.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-brand-champagne/40 pt-12">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
                Curated Companions
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-espresso mt-1">
                More from {product.category}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => {
                const relPrice = rel.discountedPrice || rel.productPrice;
                return (
                  <Link
                    key={rel.productId}
                    href={`/products/${rel.productId.toLowerCase()}`}
                    className="group bg-white border border-brand-champagne/40 rounded p-3 block hover:shadow-editorial transition-all"
                  >
                    <div className="relative aspect-[4/5] bg-brand-champagne/10 rounded overflow-hidden mb-3">
                      <Image
                        src={rel.primaryImage}
                        alt={rel.productName}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-brand-gold-dark">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-brand-espresso group-hover:text-brand-maroon transition-colors line-clamp-1">
                      {rel.productName}
                    </h4>
                    <p className="text-xs font-bold text-brand-maroon mt-1">
                      {formatInr(relPrice)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
