import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HomepageSection } from "@/types/catalogue";

interface HeroBannerProps {
  section: HomepageSection;
}

export function HeroBanner({ section }: HeroBannerProps) {
  return (
    <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-center bg-brand-espresso overflow-hidden">
      {/* Background Image (Desktop & Mobile) */}
      <div className="absolute inset-0 z-0">
        <picture>
          {section.mobileImagePath && (
            <source media="(max-width: 768px)" srcSet={section.mobileImagePath} />
          )}
          <Image
            src={section.imagePath || "/images/homepage/hero-bridal.webp"}
            alt={section.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-85"
          />
        </picture>
        {/* Luxury Vignette & Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/40 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-espresso/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-ivory space-y-6 pt-12 pb-20">
        <div className="inline-block">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-gold-light font-medium py-1 px-3 border border-brand-gold-light/40 rounded-full backdrop-blur-xs">
            Artisanal Indian Jewellery
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
          {section.title}
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-brand-ivory/90 max-w-2xl mx-auto font-light leading-relaxed">
          {section.subtitle}
        </p>

        {section.ctaLabel && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={section.ctaUrl || "/categories/bridal-jewellery"}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded shadow-luxury hover:bg-brand-maroon-dark transition-all transform hover:-translate-y-0.5"
            >
              <span>{section.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/collections/new-arrivals"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-md text-brand-ivory border border-white/20 text-xs uppercase tracking-widest font-semibold rounded hover:bg-white/20 transition-all"
            >
              <span>View New Arrivals</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
