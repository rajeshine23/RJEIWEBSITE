import React from "react";
import { Sparkles, ShieldCheck, MessageCircle, HeartHandshake } from "lucide-react";

interface ValuePropsProps {
  title?: string;
  subtitle?: string;
}

export function ValuePropositions({
  title = "Why Patrons Choose RAJISHINE",
  subtitle = "Heirloom aesthetics backed by personalized boutique service",
}: ValuePropsProps) {
  const items = [
    {
      icon: Sparkles,
      title: "Authentic Indian Artistry",
      desc: "Inspired by centuries-old Chola temple art, royal Mughal kundan, and sacred filigree traditions.",
    },
    {
      icon: ShieldCheck,
      title: "Premium Bridal Finish",
      desc: "Hypoallergenic alloys, micro-plated antique gold, and handset stones designed to shine throughout your festivities.",
    },
    {
      icon: MessageCircle,
      title: "Direct WhatsApp Service",
      desc: "Connect one-on-one with our styling concierge to match jewellery to your saree or lehenga.",
    },
    {
      icon: HeartHandshake,
      title: "Worldwide Care & Packing",
      desc: "Securely cushioned luxury packaging sent reliably across India and internationally to NRI celebrations.",
    },
  ];

  return (
    <section className="py-20 bg-brand-ivory border-b border-brand-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Our Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-brand-champagne/40 rounded p-6 text-center space-y-3 hover:shadow-editorial transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-brand-champagne/20 flex items-center justify-center text-brand-gold-dark mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-semibold text-brand-espresso">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-brand-espresso/70">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
