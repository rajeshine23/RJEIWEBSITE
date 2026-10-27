import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Collection } from "@/types/catalogue";

interface FeaturedCollectionsProps {
  collections: Collection[];
  title?: string;
  subtitle?: string;
}

export function FeaturedCollections({
  collections,
  title = "Curated Collections",
  subtitle = "Themed edits tailored for bridal splendour and festive joy",
}: FeaturedCollectionsProps) {
  const visible = collections.filter((c) => c.showOnHomepage);
  if (visible.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-brand-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Signature Edits
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group flex flex-col bg-brand-ivory/40 border border-brand-champagne/40 rounded-sm overflow-hidden hover:shadow-editorial transition-all"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-champagne/20">
                <Image
                  src={col.imagePath}
                  alt={col.collectionName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-espresso group-hover:text-brand-maroon transition-colors">
                    {col.collectionName}
                  </h3>
                  <p className="text-xs text-brand-espresso/70 line-clamp-2 mt-1 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-champagne/30 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-gold-dark group-hover:text-brand-maroon">
                  <span>Explore Edit</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
