import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Privacy Policy | ${settings.brandName}`,
    description: "Privacy policy and analytics disclosure for the RAJISHINE storefront.",
  };
}

export default function PrivacyPolicyPage() {
  const settings = getSiteSettings();

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Transparency
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
            Privacy Policy
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg border border-brand-champagne/40 space-y-6 text-sm leading-relaxed text-brand-espresso/80">
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              1. Overview
            </h2>
            <p>
              {settings.brandName} operates a static storefront where product catalogue data is pre-rendered at build time. We do not maintain user accounts, store personal delivery information in website databases, or operate online payment capture forms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              2. Analytics &amp; Privacy Safeguards
            </h2>
            <p>
              We utilize Google Analytics 4 (GA4) and PostHog to analyze aggregated website traffic, popular jewellery categories, and user experience trends.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-brand-espresso/70">
              <li>No customer phone numbers, delivery addresses, or personal names are transmitted to analytics providers.</li>
              <li>WhatsApp message contents and private chat text are never tracked by analytics.</li>
              <li>Session replay and intrusive keystroke logging are disabled by default.</li>
              <li>Users can grant or decline analytics cookies at any time via our Cookie Consent banner.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              3. WhatsApp Communications
            </h2>
            <p>
              When you submit an order inquiry via WhatsApp, your conversation is governed by WhatsApp&apos;s end-to-end encrypted messaging infrastructure. Your details are used solely to fulfill your order and answer inquiries.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso mb-2">
              4. Contact Us
            </h2>
            <p>
              For privacy-related questions or data deletion requests, email us at:{" "}
              <a href={`mailto:${settings.contactEmail}`} className="text-brand-maroon underline">
                {settings.contactEmail}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
