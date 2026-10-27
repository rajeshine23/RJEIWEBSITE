import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, Shield, Heart } from "lucide-react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Our Heritage & Craft | ${settings.brandName}`,
    description: "Learn about the RAJISHINE philosophy of handcrafted South Indian temple, kundan, and bridal jewellery.",
  };
}

export default function AboutPage() {
  const settings = getSiteSettings();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Heirloom Artistry
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-espresso">
            The RAJISHINE Story
          </h1>
          <p className="text-sm text-brand-espresso/70 max-w-xl mx-auto leading-relaxed">
            Preserving classical Indian ornamentation for modern brides and festive celebrations across the globe.
          </p>
        </div>

        <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-brand-champagne/40 shadow-editorial">
          <Image
            src="/images/homepage/brand-craft.webp"
            alt="Artisanal Jewellery Crafting"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="prose prose-stone max-w-none text-brand-espresso/90 text-sm leading-relaxed space-y-6">
          <p>
            At <strong>{settings.brandName}</strong>, jewellery is more than adornment; it is an enduring repository of sacred tradition, emotional connection, and bridal memory. Inspired by the majestic temple sculptures of South India and the royal courtly grace of Mughal kundan workshops, our pieces bridge ancient legacy with contemporary wearable comfort.
          </p>
          <p>
            Every necklace, bangle, and jhumka begins with careful artistic composition. We select high-grade brass and copper bases, coated with refined micro-gold plating and antique lacquer that replicates the soft, luminous sheen of ancestral heirloom gold. Our faux rubies, emeralds, and freshwater pearls are set by hand with exacting precision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-6 bg-white rounded border border-brand-champagne/40 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-brand-gold-dark mx-auto" />
              <h3 className="font-serif font-bold text-brand-espresso text-base">Hand-Embossed Motifs</h3>
              <p className="text-xs text-brand-espresso/70">
                Laxmi temple icons, sacred peacocks, and floral arabesques sculpted in rich relief.
              </p>
            </div>
            <div className="p-6 bg-white rounded border border-brand-champagne/40 text-center space-y-2">
              <Shield className="w-6 h-6 text-brand-gold-dark mx-auto" />
              <h3 className="font-serif font-bold text-brand-espresso text-base">Boutique Inspection</h3>
              <p className="text-xs text-brand-espresso/70">
                Every clasp, drop, and link is individually checked before departure from our studio.
              </p>
            </div>
            <div className="p-6 bg-white rounded border border-brand-champagne/40 text-center space-y-2">
              <Heart className="w-6 h-6 text-brand-gold-dark mx-auto" />
              <h3 className="font-serif font-bold text-brand-espresso text-base">Concierge Ordering</h3>
              <p className="text-xs text-brand-espresso/70">
                Direct WhatsApp contact for colour matching, saree styling, and sizing consultations.
              </p>
            </div>
          </div>

          <p>
            Whether preparing for a grand wedding mandap or choosing a subtle festive touch for Diwali, we welcome you to the RAJISHINE family.
          </p>
        </div>

        <div className="text-center pt-8 border-t border-brand-champagne/30">
          <Link
            href="/checkout"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-maroon-dark transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Connect on WhatsApp</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
