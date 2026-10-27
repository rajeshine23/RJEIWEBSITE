import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllCollections, getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Curated Jewellery Collections | ${settings.brandName}`,
    description: "Explore signature bridal, temple, and festive jewellery edits from RAJISHINE.",
  };
}

export default function CollectionsIndexPage() {
  const collections = getAllCollections();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Signature Edits
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-espresso mt-1">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            Thematic selections curated for wedding celebrations, sacred ceremonies, and everyday heirloom luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group bg-white border border-brand-champagne/40 rounded-lg overflow-hidden hover:shadow-luxury transition-all flex flex-col sm:flex-row"
            >
              <div className="relative aspect-[4/3] sm:w-1/2 bg-brand-champagne/20 overflow-hidden flex-shrink-0">
                <Image
                  src={col.imagePath}
                  alt={col.collectionName}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-dark">
                    {col.productCount} {col.productCount === 1 ? "design" : "designs"}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-espresso group-hover:text-brand-maroon transition-colors mt-1">
                    {col.collectionName}
                  </h2>
                  <p className="text-xs leading-relaxed text-brand-espresso/70 mt-2 line-clamp-3">
                    {col.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-champagne/30 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                  <span>Explore Collection</span>
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
