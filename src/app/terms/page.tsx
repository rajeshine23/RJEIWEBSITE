import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Terms of Service | ${settings.brandName}`,
    description: "Terms and conditions governing order inquiries and storefront usage at RAJISHINE.",
  };
}

export default function TermsPage() {
  const settings = getSiteSettings();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Storefront Policy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
            Terms of Service
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg border border-brand-champagne/40 space-y-6 text-sm leading-relaxed text-brand-espresso/80">
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              1. Static Storefront Nature
            </h2>
            <p>
              This website serves as a digital catalogue for {settings.brandName}. Displayed stock levels and prices represent values at the time of the latest static build. Inventory availability is not guaranteed until verified and confirmed directly by our team via WhatsApp.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              2. Order Inquiries &amp; Quotations
            </h2>
            <p>
              Submitting an order request or clicking the WhatsApp checkout link does not create a binding sales contract or process financial transactions. A formal transaction occurs only after direct mutual agreement on availability, shipping fees, and payment receipt via official banking channels.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              3. Intellectual Property
            </h2>
            <p>
              All jewellery designs, photographs, brand identity marks, and editorial texts published on this domain are the intellectual property of {settings.brandName}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
