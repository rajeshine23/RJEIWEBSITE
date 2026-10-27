"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Product, Category } from "@/types/catalogue";
import { ProductCard } from "./ProductCard";

interface CategoryProductGridProps {
  category: Category;
  initialProducts: Product[];
}

export function CategoryProductGrid({
  category,
  initialProducts,
}: CategoryProductGridProps) {
  const [sortOption, setSortOption] = useState<string>("featured");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.productId.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colors.some((c) => c.toLowerCase().includes(q))
      );
    }

    switch (sortOption) {
      case "price-asc":
        list.sort((a, b) => {
          const priceA = a.discountedPrice || a.productPrice;
          const priceB = b.discountedPrice || b.productPrice;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        list.sort((a, b) => {
          const priceA = a.discountedPrice || a.productPrice;
          const priceB = b.discountedPrice || b.productPrice;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        list.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      default:
        // Default catalogue order
        break;
    }

    return list;
  }, [initialProducts, searchTerm, sortOption]);

  return (
    <div className="bg-brand-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/categories"
            className="text-xs uppercase tracking-wider font-semibold text-brand-gold-dark hover:text-brand-maroon flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
            Collection • {category.productCount} {category.productCount === 1 ? "Item" : "Items"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-espresso mt-1">
            {category.categoryName}
          </h1>
        </div>

        {/* Filter & Sorting Controls */}
        <div className="bg-white border border-brand-champagne/40 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search within Category */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-espresso/40 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in this category..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded border border-brand-champagne/60 focus:outline-none focus:border-brand-gold bg-brand-ivory/20"
            />
          </div>

          {/* Sorter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-brand-espresso/60" />
            <label className="text-xs text-brand-espresso/70 uppercase tracking-wider font-medium">
              Sort by:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs border border-brand-champagne/60 rounded px-3 py-1.5 bg-white text-brand-espresso focus:outline-none focus:border-brand-gold cursor-pointer"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-brand-champagne/40 rounded-lg p-12 text-center max-w-md mx-auto shadow-sm">
            <h3 className="font-serif text-lg font-semibold text-brand-espresso mb-1">
              No jewels matched your search
            </h3>
            <p className="text-xs text-brand-espresso/70 mb-4">
              Try adjusting your search terms or view our full jewellery selection.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-wider rounded font-medium hover:bg-brand-maroon"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
