import React from "react";
import {
  getHomepageSections,
  getAllProducts,
  getAllCategories,
  getAllCollections,
  getAllReviews,
  getSiteSettings,
} from "@/lib/data/catalogue";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { CategoryTiles } from "@/components/homepage/CategoryTiles";
import { FeaturedCollections } from "@/components/homepage/FeaturedCollections";
import { NewArrivals } from "@/components/homepage/NewArrivals";
import { BrandStory } from "@/components/homepage/BrandStory";
import { ValuePropositions } from "@/components/homepage/ValuePropositions";
import { ReviewsSection } from "@/components/homepage/ReviewsSection";
import { SocialGallery } from "@/components/homepage/SocialGallery";
import { ClosingCta } from "@/components/homepage/ClosingCta";

export default function HomePage() {
  const sections = getHomepageSections();
  const products = getAllProducts();
  const categories = getAllCategories();
  const collections = getAllCollections();
  const reviews = getAllReviews();
  const settings = getSiteSettings();

  return (
    <div className="flex flex-col">
      {sections.map((section) => {
        switch (section.sectionType) {
          case "hero_banner":
            return <HeroBanner key={section.sectionId} section={section} />;

          case "shop_by_category":
            return (
              <CategoryTiles
                key={section.sectionId}
                categories={categories}
                title={section.title}
                subtitle={section.subtitle}
              />
            );

          case "featured_collections":
            return (
              <FeaturedCollections
                key={section.sectionId}
                collections={collections}
                title={section.title}
                subtitle={section.subtitle}
              />
            );

          case "new_arrivals":
            return (
              <NewArrivals
                key={section.sectionId}
                products={products}
                title={section.title}
                subtitle={section.subtitle}
                ctaUrl={section.ctaUrl}
              />
            );

          case "brand_story":
            return (
              <BrandStory
                key={section.sectionId}
                title={section.title}
                subtitle={section.subtitle}
                imagePath={section.imagePath}
                ctaLabel={section.ctaLabel}
                ctaUrl={section.ctaUrl}
              />
            );

          case "value_propositions":
            return (
              <ValuePropositions
                key={section.sectionId}
                title={section.title}
                subtitle={section.subtitle}
              />
            );

          case "reviews":
          case "reviews_section":
            return (
              <ReviewsSection
                key={section.sectionId}
                reviews={reviews}
                title={section.title}
                subtitle={section.subtitle}
              />
            );

          case "social_gallery":
            return (
              <SocialGallery
                key={section.sectionId}
                title={section.title}
                subtitle={section.subtitle}
                instagramUrl={settings.instagramUrl}
              />
            );

          case "closing_cta":
            return (
              <ClosingCta
                key={section.sectionId}
                title={section.title}
                subtitle={section.subtitle}
                ctaLabel={section.ctaLabel}
                ctaUrl={section.ctaUrl}
              />
            );

          case "announcement_bar":
            // Rendered in RootLayout
            return null;

          default:
            return null;
        }
      })}
    </div>
  );
}
