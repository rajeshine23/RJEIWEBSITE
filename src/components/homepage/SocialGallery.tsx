import React from "react";
import Image from "next/image";
import { InstagramIcon } from "@/components/icons/Instagram";

interface SocialGalleryProps {
  title?: string;
  subtitle?: string;
  instagramUrl?: string;
}

export function SocialGallery({
  title = "Follow Our World on Instagram",
  subtitle = "@raji_fashion_jewelry • Tag #RajiFashionJewelry to be featured",
  instagramUrl = "https://www.instagram.com/raji_fashion_jewelry",
}: SocialGalleryProps) {
  const images = [
    { src: "/images/homepage/social-1.webp", alt: "Bridal Grace Jewellery Moment" },
    { src: "/images/homepage/social-2.webp", alt: "Royal Temple Haram Ornament" },
    { src: "/images/homepage/social-3.webp", alt: "Pearl Jhumka Celebration" },
    { src: "/images/homepage/social-4.webp", alt: "Antique Gold Bangles Stack" },
  ];

  return (
    <section className="py-20 bg-white border-b border-brand-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-brand-gold-dark font-semibold mb-1">
            <InstagramIcon className="w-4 h-4 text-brand-gold-dark" />
            <span>Editorial Feed</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {images.map((img, idx) => (
            <a
              key={idx}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full aspect-square rounded-sm overflow-hidden bg-brand-champagne/20 block border border-brand-champagne/40 shadow-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-espresso/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2 p-4 text-center">
                <InstagramIcon className="w-8 h-8 text-brand-gold-light" />
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  View on Instagram
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
