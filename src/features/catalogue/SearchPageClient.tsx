"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import { Product } from "@/types/catalogue";
import { ProductCard } from "./ProductCard";

interface SearchPageClientProps {
  allProducts: Product[];
}

function SearchContent({ allProducts }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? searchParams.get("q") || "" : "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts;

    return allProducts.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.productId.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colors.some((c) => c.toLowerCase().includes(q))
    );
  }, [allProducts, query]);

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Search Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1">
            Jewellery Search
          </h1>
          <p className="text-xs text-brand-espresso/70 mt-1">
            Search by ornament name, collection, finish, or product ID.
          </p>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-brand-espresso/40 absolute left-3.5 top-3.5" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search temple necklaces, pearl jhumkas, etc..."
              className="w-full text-sm pl-10 pr-4 py-3 rounded-full border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-white shadow-sm"
              autoFocus
            />
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white border border-brand-champagne/40 rounded-lg p-12 text-center max-w-md mx-auto shadow-sm">
            <ShoppingBag className="w-10 h-10 text-brand-gold-dark mx-auto mb-3 opacity-60" />
            <h2 className="font-serif text-lg font-semibold text-brand-espresso mb-1">
              No matching pieces found
            </h2>
            <p className="text-xs text-brand-espresso/70 mb-4">
              We couldn&apos;t find any jewellery matching &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="px-4 py-2 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-wider rounded font-medium hover:bg-brand-maroon"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center text-xs text-brand-espresso/70">
              <span>
                Found <strong>{results.length}</strong> {results.length === 1 ? "design" : "designs"}
                {query && ` for "${query}"`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchPageClient({ allProducts }: SearchPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent allProducts={allProducts} />
    </Suspense>
  );
}
