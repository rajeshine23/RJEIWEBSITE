import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProducts,
  getProductById,
  getSiteSettings,
} from "@/lib/data/catalogue";
import { ProductDetailClient } from "@/features/catalogue/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    id: p.productId.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  const settings = getSiteSettings();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const price = product.discountedPrice || product.productPrice;

  return {
    title: `${product.productName} | ${product.category} | ${settings.brandName}`,
    description: product.description,
    openGraph: {
      title: `${product.productName} — ₹${price} | ${settings.brandName}`,
      description: product.description,
      images: [
        {
          url: product.primaryImage,
          width: 800,
          height: 1000,
          alt: product.productName,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProducts();
  const relatedProducts = allProducts.filter(
    (p) =>
      p.categorySlug === product.categorySlug &&
      p.productId.toLowerCase() !== product.productId.toLowerCase()
  );
  const settings = getSiteSettings();

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    image: product.images,
    description: product.description,
    sku: product.productId,
    brand: {
      "@type": "Brand",
      name: settings.brandName,
    },
    offers: {
      "@type": "Offer",
      url: `${settings.siteUrl}/products/${product.productId.toLowerCase()}`,
      priceCurrency: "INR",
      price: product.discountedPrice || product.productPrice,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        settings={settings}
      />
    </>
  );
}
