import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-brand-ivory min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white border border-brand-champagne/40 rounded-lg p-10 text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-champagne/20 flex items-center justify-center text-brand-gold-dark mx-auto">
          <Compass className="w-8 h-8 opacity-70" />
        </div>

        <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold block">
          404 • Page Not Found
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">
          Piece Not Located
        </h1>

        <p className="text-xs leading-relaxed text-brand-espresso/70">
          The jewellery piece or page you are seeking may have moved to a new collection or is no longer listed.
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-maroon-dark transition-colors"
          >
            Return Home
          </Link>

          <Link
            href="/categories"
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-brand-champagne/60 text-brand-espresso text-xs uppercase tracking-widest font-semibold rounded hover:border-brand-gold flex items-center justify-center space-x-1"
          >
            <span>Explore Jewels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
