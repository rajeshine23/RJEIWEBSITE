import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Shipping & Returns | ${settings.brandName}`,
    description: "Shipping timelines, packing standards, and return guidelines for RAJISHINE jewellery.",
  };
}

export default function ShippingReturnsPage() {
  const settings = getSiteSettings();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Delivery &amp; Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
            Shipping &amp; Returns
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg border border-brand-champagne/40 space-y-6 text-sm leading-relaxed text-brand-espresso/80">
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              1. Domestic Shipping within India
            </h2>
            <p>
              All confirmed orders are packed in rigid, crush-proof jewellery boxes and dispatched via premium courier partners (Blue Dart, Delhivery, or Speed Post). Delivery typically occurs within 3 to 7 business days following dispatch, depending on your pin code.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              2. International Worldwide Shipping
            </h2>
            <p>
              We proudly ship our bridal and fashion jewellery to Indian diaspora patrons in the United States, United Kingdom, Canada, UAE, Australia, and worldwide. International shipping charges and customs procedures are quoted individually on WhatsApp based on package weight and country regulations.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              3. Shipping Charges
            </h2>
            <p>
              {settings.shippingDisclaimer}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              4. Transit Damage &amp; Returns Policy
            </h2>
            <p>
              Due to the delicate, handcrafted nature of festive jewellery, returns are accepted exclusively in the unlikely event of transit breakage or receiving a defect. We kindly request customers to record a continuous unboxing video upon receiving their parcel so our team can facilitate immediate replacement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
