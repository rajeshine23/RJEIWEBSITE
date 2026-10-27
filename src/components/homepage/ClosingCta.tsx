import React from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

interface ClosingCtaProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function ClosingCta({
  title = "Ready for Your Special Day?",
  subtitle = "Connect directly with our jewellery concierge on WhatsApp to curate your bespoke trousseau or explore special bridal commissions.",
  ctaLabel = "Chat on WhatsApp",
  ctaUrl = "/checkout",
}: ClosingCtaProps) {
  return (
    <section className="py-20 bg-brand-maroon text-brand-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#FAF6EF_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold-light font-medium">
          Personal Trousseau Consultation
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-brand-ivory/80 max-w-2xl mx-auto font-light leading-relaxed">
          {subtitle}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaUrl}
            className="inline-flex items-center space-x-2.5 px-8 py-4 bg-brand-ivory text-brand-maroon text-xs uppercase tracking-widest font-bold rounded shadow-luxury hover:bg-brand-champagne transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>{ctaLabel}</span>
          </Link>

          <Link
            href="/categories"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-transparent border border-brand-ivory/40 text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-ivory/10 transition-all"
          >
            <span>Explore All Jewellery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
