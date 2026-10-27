import React from "react";
import type { Metadata } from "next";
import { getAllProducts, getSiteSettings } from "@/lib/data/catalogue";
import { SearchPageClient } from "@/features/catalogue/SearchPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: `Search Catalogue | ${settings.brandName}`,
    description: "Search our fine handcrafted jewellery pieces.",
  };
}

export default function SearchPage() {
  const allProducts = getAllProducts();
  return <SearchPageClient allProducts={allProducts} />;
}
