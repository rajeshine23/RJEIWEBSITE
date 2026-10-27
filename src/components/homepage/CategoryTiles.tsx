import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/catalogue";

interface CategoryTilesProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

export function CategoryTiles({
  categories,
  title = "Shop By Category",
  subtitle = "Sacred Indian aesthetics crafted for timeless elegance",
}: CategoryTilesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-brand-ivory border-b border-brand-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Curated Discovery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col bg-white border border-brand-champagne/40 rounded overflow-hidden hover:shadow-editorial transition-all"
            >
              <div className="relative aspect-square w-full bg-brand-champagne/10 overflow-hidden">
                <Image
                  src={cat.imagePath}
                  alt={cat.categoryName}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-semibold drop-shadow-sm">
                    {cat.categoryName}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-brand-gold-light mt-0.5">
                    <span>{cat.productCount} {cat.productCount === 1 ? "design" : "designs"}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
