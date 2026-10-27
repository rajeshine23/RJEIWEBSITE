export interface ProductVariant {
  color: string;
  quantity: number;
  isAvailable: boolean;
  images: string[];
  primaryImage: string;
}

export interface Product {
  productId: string;
  productName: string;
  category: string;
  categorySlug: string;
  description: string;
  images: string[];
  productPrice: number;
  discountedPrice?: number;
  quantities: number[];
  colors: string[];
  variants: ProductVariant[];
  totalStock: number;
  inStock: boolean;
  primaryImage: string;
}

export interface ProductImageManifestEntry {
  productId: string;
  color: string;
  imagePath: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Category {
  categoryName: string;
  slug: string;
  imagePath: string;
  displayOrder: number;
  enabled: boolean;
  productCount: number;
}

export interface Collection {
  collectionId: string;
  collectionName: string;
  slug: string;
  description: string;
  imagePath: string;
  productIds: string[];
  displayOrder: number;
  showOnHomepage: boolean;
  productCount?: number;
}

export type HomepageSectionType =
  | "announcement_bar"
  | "hero_banner"
  | "shop_by_category"
  | "featured_collections"
  | "new_arrivals"
  | "best_sellers"
  | "brand_story"
  | "value_propositions"
  | "social_gallery"
  | "reviews"
  | "reviews_section"
  | "closing_cta";

export interface HomepageSection {
  sectionId: string;
  sectionType: HomepageSectionType;
  title: string;
  subtitle: string;
  imagePath: string;
  mobileImagePath: string;
  ctaLabel: string;
  ctaUrl: string;
  displayOrder: number;
  enabled: boolean;
}

export interface CustomerReview {
  reviewId: string;
  customerDisplayName: string;
  reviewText: string;
  productId?: string;
  imagePath?: string;
  source: string;
  displayOrder: number;
  enabled: boolean;
}

export interface SiteSettings {
  brandName: string;
  siteUrl: string;
  currency: string;
  whatsappCountryCode: string;
  whatsappPhoneNumber: string;
  announcementText: string;
  instagramUrl: string;
  contactEmail: string;
  footerCopyright: string;
  defaultSeoDescription: string;
  socialShareImage: string;
  shippingDisclaimer: string;
  [key: string]: string;
}

export interface CartLineItem {
  lineId: string; // `${productId}:::${color}`
  productId: string;
  productName: string;
  color: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  maxAvailableStock: number;
  category: string;
}

export interface OrderCustomerInfo {
  customerName?: string;
  deliveryCity?: string;
  deliveryPincode?: string;
  deliveryAddress?: string;
  notes?: string;
}
