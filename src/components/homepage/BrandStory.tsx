import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface BrandStoryProps {
  title?: string;
  subtitle?: string;
  imagePath?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function BrandStory({
  title = "The RAJISHINE Legacy",
  subtitle = "Every RAJISHINE creation begins with a deep reverence for India’s glorious jewellery traditions. From antique temple kadas to royal kundan bridal sets, our artisans preserve heritage techniques while delivering modern comfort and supreme finish.",
  imagePath = "/images/homepage/brand-craft.webp",
  ctaLabel = "Our Story",
  ctaUrl = "/about",
}: BrandStoryProps) {
  return (
    <section className="py-24 bg-brand-ivory border-b border-brand-champagne/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded border border-brand-champagne/40 overflow-hidden shadow-luxury">
            <Image
              src={imagePath}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
              <Sparkles className="w-4 h-4 text-brand-gold-dark" />
              <span>Heirloom Devotion</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-espresso leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-brand-espresso/80 font-light">
              {subtitle}
            </p>

            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-maroon transition-colors"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
