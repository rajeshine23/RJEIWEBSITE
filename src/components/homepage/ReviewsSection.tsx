import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { CustomerReview } from "@/types/catalogue";

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  title?: string;
  subtitle?: string;
}

export function ReviewsSection({
  reviews,
  title = "Patron Reflections",
  subtitle = "Warm words and celebrations from our jewellery patrons",
}: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-brand-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Client Words
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.reviewId}
              className="bg-brand-ivory/50 border border-brand-champagne/40 rounded-lg p-6 flex flex-col justify-between shadow-sm relative"
            >
              <Quote className="w-8 h-8 text-brand-gold-light/40 absolute top-4 right-4" />

              <p className="text-sm leading-relaxed text-brand-espresso/80 italic mb-6 relative z-10">
                &ldquo;{rev.reviewText}&rdquo;
              </p>

              <div className="flex items-center space-x-3 pt-4 border-t border-brand-champagne/30">
                {rev.imagePath && (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-brand-champagne/60 flex-shrink-0">
                    <Image
                      src={rev.imagePath}
                      alt={rev.customerDisplayName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-espresso">
                    {rev.customerDisplayName}
                  </h4>
                  <p className="text-[11px] text-brand-gold-dark font-medium">
                    {rev.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-[11px] text-brand-espresso/50">
          * Reviews shown during development reflect sample demonstration content and will be updated with verified customer feedback.
        </div>
      </div>
    </section>
  );
}
