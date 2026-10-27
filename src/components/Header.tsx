"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import { Category, Collection } from "@/types/catalogue";
import { trackCategorySelect, trackCollectionSelect } from "@/lib/analytics";

interface HeaderProps {
  categories: Category[];
  collections: Collection[];
  brandName?: string;
}

export function Header({ categories, collections, brandName = "RAJISHINE" }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, openCart, isHydrated } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-champagne/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-espresso hover:text-brand-maroon focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-brand-espresso hover:text-brand-maroon focus:outline-none ml-1"
              aria-label="Search catalogue"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left Nav */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-brand-espresso/80">
            <Link
              href="/"
              className={`hover:text-brand-maroon transition-colors ${
                pathname === "/" ? "text-brand-maroon font-semibold" : ""
              }`}
            >
              Home
            </Link>

            {/* Dynamic Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-brand-maroon transition-colors py-2 focus:outline-none"
                aria-expanded={categoriesDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full w-56 bg-brand-ivory border border-brand-champagne/60 shadow-editorial rounded py-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={() => trackCategorySelect(cat.categoryName, cat.slug)}
                      className="block px-4 py-2.5 text-xs tracking-wider text-brand-espresso hover:bg-brand-champagne/30 hover:text-brand-maroon transition-colors"
                    >
                      {cat.categoryName} ({cat.productCount})
                    </Link>
                  ))}
                  <div className="border-t border-brand-champagne/40 my-1"></div>
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-xs tracking-wider font-semibold text-brand-gold-dark hover:bg-brand-champagne/30"
                  >
                    View All Categories →
                  </Link>
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsDropdownOpen(true)}
              onMouseLeave={() => setCollectionsDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-brand-maroon transition-colors py-2 focus:outline-none"
                aria-expanded={collectionsDropdownOpen}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {collectionsDropdownOpen && (
                <div className="absolute left-0 top-full w-60 bg-brand-ivory border border-brand-champagne/60 shadow-editorial rounded py-2 z-50">
                  {collections.map((col) => (
                    <Link
                      key={col.slug}
                      href={`/collections/${col.slug}`}
                      onClick={() => trackCollectionSelect(col.collectionName, col.slug)}
                      className="block px-4 py-2.5 text-xs tracking-wider text-brand-espresso hover:bg-brand-champagne/30 hover:text-brand-maroon transition-colors"
                    >
                      {col.collectionName}
                    </Link>
                  ))}
                  <div className="border-t border-brand-champagne/40 my-1"></div>
                  <Link
                    href="/collections"
                    className="block px-4 py-2 text-xs tracking-wider font-semibold text-brand-gold-dark hover:bg-brand-champagne/30"
                  >
                    Browse All Collections →
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/collections/new-arrivals"
              className="hover:text-brand-maroon transition-colors"
            >
              New In
            </Link>
          </nav>

          {/* Center Brand Wordmark / Logo */}
          <div className="flex-1 lg:flex-initial text-center">
            <Link href="/" className="inline-block focus:outline-none group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-brand-espresso group-hover:text-brand-maroon transition-colors uppercase block">
                {brandName}
              </span>
              <span className="text-[9px] tracking-[0.3em] font-medium text-brand-gold-dark uppercase block -mt-1">
                Indian Fine Jewellery
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex items-center text-xs tracking-wider uppercase text-brand-espresso/70 hover:text-brand-maroon transition-colors space-x-1"
              aria-label="Search jewellery"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-brand-espresso hover:text-brand-maroon transition-colors focus:outline-none"
              aria-label={`Shopping cart containing ${itemCount} items`}
            >
              <ShoppingBag className="w-6 h-6" />
              {isHydrated && itemCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-brand-maroon rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="py-3 px-4 border-t border-brand-champagne/40 bg-white/90">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center">
              <Search className="w-4 h-4 text-brand-espresso/50 mr-2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search necklaces, jhumkas, bridal sets, or product IDs (e.g. RJS00001)..."
                className="w-full text-sm bg-transparent border-none focus:outline-none text-brand-espresso placeholder:text-brand-espresso/40"
                autoFocus
              />
              <button
                type="submit"
                className="ml-2 px-3 py-1 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-wider rounded hover:bg-brand-maroon"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2 p-1 text-brand-espresso/50 hover:text-brand-espresso"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-champagne/40 bg-brand-ivory px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-brand-champagne/60 rounded px-3 py-2">
            <Search className="w-4 h-4 text-brand-espresso/50 mr-2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full text-sm bg-transparent border-none focus:outline-none text-brand-espresso"
            />
          </form>

          <div className="space-y-1 text-sm uppercase tracking-wider text-brand-espresso">
            <Link
              href="/"
              className="block py-2.5 border-b border-brand-champagne/20 font-medium"
            >
              Home
            </Link>

            <div className="py-2 border-b border-brand-champagne/20">
              <span className="text-xs font-semibold text-brand-gold-dark block mb-2">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-2 pl-2 text-xs">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="py-1 text-brand-espresso/80 hover:text-brand-maroon"
                  >
                    {cat.categoryName}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2 border-b border-brand-champagne/20">
              <span className="text-xs font-semibold text-brand-gold-dark block mb-2">
                Collections
              </span>
              <div className="grid grid-cols-2 gap-2 pl-2 text-xs">
                {collections.map((col) => (
                  <Link
                    key={col.slug}
                    href={`/collections/${col.slug}`}
                    className="py-1 text-brand-espresso/80 hover:text-brand-maroon"
                  >
                    {col.collectionName}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className="block py-2.5 border-b border-brand-champagne/20 font-medium"
            >
              Our Story
            </Link>

            <Link
              href="/checkout"
              className="block py-2.5 font-medium text-brand-maroon"
            >
              WhatsApp Order Desk →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
