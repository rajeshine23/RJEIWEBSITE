import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategorySlug,
  getSiteSettings,
} from "@/lib/data/catalogue";
import { CategoryProductGrid } from "@/features/catalogue/CategoryProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const settings = getSiteSettings();

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.categoryName} Jewellery Collection | ${settings.brandName}`,
    description: `Discover handcrafted Indian ${category.categoryName.toLowerCase()} designed for bridal celebrations, weddings, and festive luxury.`,
    openGraph: {
      title: `${category.categoryName} Collection | ${settings.brandName}`,
      description: `Explore our editorial collection of ${category.categoryName.toLowerCase()}.`,
      images: [category.imagePath],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategorySlug(slug);

  return (
    <CategoryProductGrid
      category={category}
      initialProducts={products}
    />
  );
}
