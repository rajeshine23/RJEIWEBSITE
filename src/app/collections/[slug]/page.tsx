import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import {
  getAllCollections,
  getCollectionBySlug,
  getProductsForCollection,
  getSiteSettings,
} from "@/lib/data/catalogue";
import { ProductCard } from "@/features/catalogue/ProductCard";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const collections = getAllCollections();
  return collections.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const settings = getSiteSettings();

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${collection.collectionName} | Curated Collection | ${settings.brandName}`,
    description: collection.description,
    openGraph: {
      title: `${collection.collectionName} | ${settings.brandName}`,
      description: collection.description,
      images: [collection.imagePath],
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = getProductsForCollection(collection);

  return (
    <div className="bg-brand-ivory min-h-screen pb-20">
      {/* Editorial Header Banner */}
      <div className="relative w-full h-80 sm:h-96 bg-brand-espresso flex items-center justify-center overflow-hidden">
        <Image
          src={collection.imagePath}
          alt={collection.collectionName}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/40 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-brand-ivory space-y-3">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-brand-gold-light hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {collection.collectionName}
          </h1>
          <p className="text-xs sm:text-sm text-brand-ivory/80 max-w-xl mx-auto leading-relaxed">
            {collection.description}
          </p>
          <span className="inline-block text-[11px] uppercase tracking-wider text-brand-gold-light border border-brand-gold-light/40 px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? "Curated Piece" : "Curated Pieces"}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        {products.length === 0 ? (
          <div className="bg-white border border-brand-champagne/40 rounded-lg p-12 text-center max-w-md mx-auto shadow-sm">
            <h3 className="font-serif text-lg font-semibold text-brand-espresso mb-1">
              Collection in Preparation
            </h3>
            <p className="text-xs text-brand-espresso/70 mb-4">
              Products for this collection are currently being handcrafted in our workshop.
            </p>
            <Link
              href="/categories"
              className="px-4 py-2 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-wider rounded font-medium hover:bg-brand-maroon"
            >
              Explore Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
