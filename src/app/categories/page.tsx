import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllCategories, getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Browse All Jewellery Categories | ${settings.brandName}`,
    description: "Explore all Indian jewellery categories: Necklaces, Bridal Sets, Earrings, and Bangles.",
  };
}

export default function AllCategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Handcrafted Treasures
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-espresso mt-1">
            Jewellery Categories
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            Browse our complete catalogue arranged by traditional ornament types.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-white border border-brand-champagne/40 rounded-lg overflow-hidden hover:shadow-editorial transition-all flex flex-col"
            >
              <div className="relative aspect-square w-full bg-brand-champagne/10 overflow-hidden">
                <Image
                  src={cat.imagePath}
                  alt={cat.categoryName}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-brand-espresso group-hover:text-brand-maroon transition-colors">
                    {cat.categoryName}
                  </h2>
                  <p className="text-xs text-brand-gold-dark font-medium mt-1">
                    {cat.productCount} {cat.productCount === 1 ? "design available" : "designs available"}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-champagne/30 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
