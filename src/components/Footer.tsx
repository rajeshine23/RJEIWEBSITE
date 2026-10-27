import React from "react";
import Link from "next/link";
import { MessageCircle, Mail, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/icons/Instagram";
import { Category, Collection, SiteSettings } from "@/types/catalogue";

interface FooterProps {
  categories: Category[];
  collections: Collection[];
  settings: SiteSettings;
}

export function Footer({ categories, collections, settings }: FooterProps) {
  const cleanPhone = settings.whatsappPhoneNumber?.replace(/[^0-9]/g, "");

  return (
    <footer className="bg-brand-espresso text-brand-ivory border-t border-brand-champagne/20">
      {/* Trust Badges Bar */}
      <div className="border-b border-brand-champagne/10 py-8 bg-brand-espresso/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <Sparkles className="w-6 h-6 text-brand-gold-light mb-2" />
              <h4 className="font-serif text-base font-medium">Artisanal Craftsmanship</h4>
              <p className="text-xs text-brand-ivory/60 mt-1 max-w-xs">
                Handcrafted South Indian temple, kundan, and bridal ornaments with antique elegance.
              </p>
            </div>
            <div className="flex flex-col items-center p-3">
              <MessageCircle className="w-6 h-6 text-brand-gold-light mb-2" />
              <h4 className="font-serif text-base font-medium">Personal WhatsApp Concierge</h4>
              <p className="text-xs text-brand-ivory/60 mt-1 max-w-xs">
                Direct styling assistance, custom trousseau advice, and order confirmation.
              </p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Truck className="w-6 h-6 text-brand-gold-light mb-2" />
              <h4 className="font-serif text-base font-medium">Worldwide Insured Packing</h4>
              <p className="text-xs text-brand-ivory/60 mt-1 max-w-xs">
                Securely packed and dispatched across India and to Indian diaspora families globally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-brand-ivory block uppercase">
                {settings.brandName}
              </span>
              <span className="text-[9px] tracking-[0.3em] font-medium text-brand-gold-light uppercase block">
                Indian Fine Jewellery
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-brand-ivory/70 max-w-sm">
              {settings.defaultSeoDescription}
            </p>
            <div className="pt-2 flex items-center space-x-4">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-brand-champagne/10 hover:bg-brand-gold hover:text-brand-espresso transition-colors"
                  aria-label="Follow RAJISHINE on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-brand-champagne/10 hover:bg-emerald-600 hover:text-white transition-colors"
                  aria-label="Chat with RAJISHINE on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-2 rounded-full bg-brand-champagne/10 hover:bg-brand-gold hover:text-brand-espresso transition-colors"
                  aria-label="Email RAJISHINE"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-serif text-sm tracking-wider uppercase text-brand-gold-light font-semibold mb-3">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-brand-ivory/70">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-brand-ivory transition-colors"
                  >
                    {cat.categoryName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h5 className="font-serif text-sm tracking-wider uppercase text-brand-gold-light font-semibold mb-3">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-brand-ivory/70">
              {collections.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={`/collections/${col.slug}`}
                    className="hover:text-brand-ivory transition-colors"
                  >
                    {col.collectionName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Workflow & Policies */}
          <div>
            <h5 className="font-serif text-sm tracking-wider uppercase text-brand-gold-light font-semibold mb-3">
              Storefront Info
            </h5>
            <ul className="space-y-2 text-xs text-brand-ivory/70">
              <li>
                <Link href="/about" className="hover:text-brand-ivory transition-colors">
                  Our Heritage & Craft
                </Link>
              </li>
              <li>
                <Link href="/how-to-order" className="hover:text-brand-ivory transition-colors">
                  How WhatsApp Orders Work
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-brand-ivory transition-colors">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-ivory transition-colors">
                  Jewellery Care & FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="mt-12 pt-6 border-t border-brand-champagne/10 text-[11px] leading-relaxed text-brand-ivory/50">
          <p>
            <strong className="text-brand-ivory/80">Order Process Notice:</strong>{" "}
            {settings.shippingDisclaimer} Clicking checkout opens an official precomposed order message in WhatsApp.
            Orders are reviewed for inventory availability and confirmed directly with you before payment or shipment.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-ivory/40">
          <p>{settings.footerCopyright}</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
