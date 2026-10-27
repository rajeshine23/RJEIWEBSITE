import React from "react";
import Link from "next/link";
import { MessageCircle, CheckCircle, Package, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `How WhatsApp Ordering Works | ${settings.brandName}`,
    description: "Simple guide to ordering handcrafted jewellery via WhatsApp with RAJISHINE.",
  };
}

export default function HowToOrderPage() {
  const settings = getSiteSettings();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Simple &amp; Personal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
            How to Order via WhatsApp
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 max-w-lg mx-auto">
            We provide a boutique bespoke shopping experience without impersonal automated checkouts.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-lg border border-brand-champagne/40 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-brand-maroon text-brand-ivory flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-brand-espresso">
                Browse &amp; Add Jewellery to Your Bag
              </h2>
              <p className="text-xs leading-relaxed text-brand-espresso/70">
                Explore our necklaces, bangles, bridal sets, and earrings. Choose your preferred colour variants and quantities, then add them to your shopping bag.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-lg border border-brand-champagne/40 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold-dark text-brand-ivory flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-brand-espresso">
                Review &amp; Open WhatsApp Desk
              </h2>
              <p className="text-xs leading-relaxed text-brand-espresso/70">
                On the checkout page, enter your delivery city or address (optional) and click <strong>Submit Order via WhatsApp</strong>. This automatically opens WhatsApp on your phone or computer with your items, product IDs, colours, and estimated prices neatly organized.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-lg border border-brand-champagne/40 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-brand-espresso">
                Personal Confirmation &amp; Dispatch
              </h2>
              <p className="text-xs leading-relaxed text-brand-espresso/70">
                Our concierge verifies immediate piece availability, calculates exact insured courier shipping to your pin code, answers any styling questions, and provides secure direct payment options (UPI, Net Banking, or International Wire).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-brand-champagne/20 border border-brand-champagne/60 rounded-lg p-6 text-xs text-brand-espresso/80 space-y-2">
          <p className="font-bold text-brand-espresso">Important Notice regarding Static Storefront:</p>
          <p>
            No transaction is finalized on this website. An order request is created when you send your message in WhatsApp. This ensures you never pay for an item that is in the process of being restocked.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-maroon text-brand-ivory text-xs uppercase tracking-widest font-semibold rounded hover:bg-brand-maroon-dark"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
