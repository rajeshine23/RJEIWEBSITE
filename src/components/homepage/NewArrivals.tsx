import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/catalogue";
import { ProductCard } from "@/features/catalogue/ProductCard";

interface NewArrivalsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  ctaUrl?: string;
}

export function NewArrivals({
  products,
  title = "New Arrivals",
  subtitle = "Recently introduced handcrafted jewellery pieces fresh from our workshop",
  ctaUrl = "/collections/new-arrivals",
}: NewArrivalsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-brand-ivory border-b border-brand-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
              Fresh Creations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-brand-espresso/70 mt-1 max-w-lg">
              {subtitle}
            </p>
          </div>

          <Link
            href={ctaUrl}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-semibold text-brand-maroon hover:text-brand-maroon-dark group"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
