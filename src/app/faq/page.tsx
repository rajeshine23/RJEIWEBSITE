import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Jewellery Care & FAQ | ${settings.brandName}`,
    description: "Frequently asked questions regarding jewellery materials, care guidelines, and ordering with RAJISHINE.",
  };
}

export default function FaqPage() {
  const faqs = [
    {
      q: "What materials are used in RAJISHINE jewellery?",
      a: "Our pieces are made from high-grade brass, copper, or mixed metal alloys, finished with micro gold-plating, antique gold lacquer, and embellished with simulated kundan stones, synthetic pearls, and cubic zirconia.",
    },
    {
      q: "How should I maintain and care for my fashion jewellery?",
      a: "Store pieces individually in ziplock pouches or cloth-lined boxes away from moisture. Avoid direct contact with perfumes, sanitizers, lotions, and water. Wipe gently with a soft dry cloth after wearing.",
    },
    {
      q: "Can I customize the colour or bead drops of a necklace set?",
      a: "Yes! Many of our temple harams and kundan chokers can be customized with green, ruby, or pearl drop beads. Reach out directly on WhatsApp to inquire about customization options for your wedding trousseau.",
    },
    {
      q: "How does payment work without an online card gateway?",
      a: "Once you submit your order request via WhatsApp, our team confirms the exact items and shipping charges. You can complete payment safely via Indian UPI (Google Pay, PhonePe, Paytm), IMPS/NEFT, or international bank transfer.",
    },
  ];

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Common Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
            Jewellery Care &amp; FAQ
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border border-brand-champagne/40 space-y-2 shadow-sm"
            >
              <h2 className="font-serif text-base font-bold text-brand-espresso">
                {f.q}
              </h2>
              <p className="text-xs leading-relaxed text-brand-espresso/70">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
