import path from "path";
import fs from "fs";
import {
  parseCsvFile,
  parseSemicolonList,
  parseSemicolonIntList,
  slugify,
} from "../csv/parser";
import {
  Product,
  ProductVariant,
  ProductImageManifestEntry,
  Category,
  Collection,
  HomepageSection,
  HomepageSectionType,
  CustomerReview,
  SiteSettings,
} from "@/types/catalogue";

const DATA_DIR = path.join(process.cwd(), "data");

export interface RawProductCsvRow {
  product_id: string;
  product_name: string;
  category: string;
  description: string;
  images: string;
  product_price: string;
  discounted_price?: string;
  quantity: string;
  color: string;
}

export interface RawManifestCsvRow {
  product_id: string;
  color: string;
  image_path: string;
  sort_order: string;
  is_primary: string;
}

export interface RawCategoryCsvRow {
  category_name: string;
  slug?: string;
  image_path?: string;
  display_order?: string;
  enabled?: string;
}

export interface RawCollectionCsvRow {
  collection_id: string;
  collection_name: string;
  slug?: string;
  description?: string;
  image_path?: string;
  product_ids: string;
  display_order?: string;
  show_on_homepage?: string;
}

export interface RawHomepageCsvRow {
  section_id: string;
  section_type: string;
  title?: string;
  subtitle?: string;
  image_path?: string;
  mobile_image_path?: string;
  cta_label?: string;
  cta_url?: string;
  display_order?: string;
  enabled?: string;
}

export interface RawReviewCsvRow {
  review_id: string;
  customer_display_name: string;
  review_text: string;
  product_id?: string;
  image_path?: string;
  source?: string;
  display_order?: string;
  enabled?: string;
}

export interface RawSiteSettingCsvRow {
  key: string;
  value: string;
}

/**
 * Loads the optional product-images manifest file if it exists.
 */
export function getProductImageManifest(): Map<string, ProductImageManifestEntry[]> {
  const manifestPath = path.join(DATA_DIR, "product-images.csv");
  const manifestMap = new Map<string, ProductImageManifestEntry[]>();

  if (!fs.existsSync(manifestPath)) {
    return manifestMap;
  }

  const rawRows = parseCsvFile<RawManifestCsvRow>(manifestPath);
  for (const row of rawRows) {
    const productId = row.product_id?.trim();
    if (!productId) continue;

    const entry: ProductImageManifestEntry = {
      productId,
      color: row.color?.trim() || "",
      imagePath: row.image_path?.trim() || "",
      sortOrder: parseInt(row.sort_order || "1", 10),
      isPrimary: (row.is_primary || "").toLowerCase() === "true",
    };

    const existing = manifestMap.get(productId) || [];
    existing.push(entry);
    manifestMap.set(productId, existing);
  }

  // Sort entries for each product by sortOrder
  manifestMap.forEach((entries) => {
    entries.sort((a, b) => a.sortOrder - b.sortOrder);
  });

  return manifestMap;
}

/**
 * Loads and constructs all products with complete variant and image mappings.
 */
export function getAllProducts(): Product[] {
  const productsPath = path.join(DATA_DIR, "products.csv");
  if (!fs.existsSync(productsPath)) {
    return [];
  }

  const rawRows = parseCsvFile<RawProductCsvRow>(productsPath);
  const manifestMap = getProductImageManifest();

  return rawRows.map((row) => {
    const productId = row.product_id?.trim();
    const productName = row.product_name?.trim();
    const category = row.category?.trim();
    const categorySlug = slugify(category);
    const description = row.description?.trim() || "";
    
    const rawImages = parseSemicolonList(row.images);
    const productPrice = parseFloat(row.product_price);
    const rawDiscount = row.discounted_price?.trim();
    const discountedPrice = rawDiscount ? parseFloat(rawDiscount) : undefined;
    
    const quantities = parseSemicolonIntList(row.quantity);
    const colors = parseSemicolonList(row.color);

    const hasManifest = manifestMap.has(productId);
    const manifestEntries = manifestMap.get(productId) || [];

    // Build variants
    const variants: ProductVariant[] = colors.map((colorName, idx) => {
      const qty = quantities[idx] !== undefined ? quantities[idx] : 0;
      
      let variantImages: string[] = [];
      let primaryImage = "";

      if (hasManifest) {
        // Authoritative mapping from manifest
        const colorEntries = manifestEntries.filter(
          (m) => m.color.toLowerCase() === colorName.toLowerCase()
        );
        if (colorEntries.length > 0) {
          variantImages = colorEntries.map((m) => m.imagePath);
          const explicitPrimary = colorEntries.find((m) => m.isPrimary);
          primaryImage = explicitPrimary ? explicitPrimary.imagePath : colorEntries[0].imagePath;
        } else {
          // Fallback to default product images if color not in manifest
          variantImages = rawImages.length > 0 ? [rawImages[0]] : [];
          primaryImage = variantImages[0] || "";
        }
      } else {
        // Simple positional mapping
        if (colors.length === 1) {
          // If only 1 color, all images belong to this color
          variantImages = [...rawImages];
          primaryImage = rawImages[0] || "";
        } else {
          // Positional: images[idx] corresponds to colors[idx]
          const assignedImg = rawImages[idx] || rawImages[0] || "";
          variantImages = assignedImg ? [assignedImg] : [];
          primaryImage = assignedImg;
        }
      }

      return {
        color: colorName,
        quantity: Math.max(0, qty),
        isAvailable: qty > 0,
        images: variantImages,
        primaryImage,
      };
    });

    const totalStock = variants.reduce((sum, v) => sum + v.quantity, 0);
    const primaryImage =
      variants[0]?.primaryImage || rawImages[0] || "/images/placeholder-jewellery.webp";

    return {
      productId,
      productName,
      category,
      categorySlug,
      description,
      images: rawImages,
      productPrice,
      discountedPrice,
      quantities,
      colors,
      variants,
      totalStock,
      inStock: totalStock > 0,
      primaryImage,
    };
  });
}

/**
 * Finds a product by its ID (e.g. RJS00001).
 */
export function getProductById(productId: string): Product | undefined {
  const products = getAllProducts();
  return products.find(
    (p) => p.productId.toLowerCase() === productId.trim().toLowerCase()
  );
}

/**
 * Retrieves all categories, dynamically merging categories.csv and products.csv.
 */
export function getAllCategories(): Category[] {
  const products = getAllProducts();
  const categoryCounts = new Map<string, number>();
  const categorySampleImages = new Map<string, string>();

  products.forEach((p) => {
    const cat = p.category;
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    if (!categorySampleImages.has(cat) && p.primaryImage) {
      categorySampleImages.set(cat, p.primaryImage);
    }
  });

  const categoriesPath = path.join(DATA_DIR, "categories.csv");
  const configuredCategories: Category[] = [];
  const handledNames = new Set<string>();

  if (fs.existsSync(categoriesPath)) {
    const rawRows = parseCsvFile<RawCategoryCsvRow>(categoriesPath);
    for (const row of rawRows) {
      const name = row.category_name?.trim();
      if (!name) continue;

      const slug = row.slug?.trim() || slugify(name);
      const enabled = (row.enabled || "true").toLowerCase() !== "false";
      const displayOrder = parseInt(row.display_order || "99", 10);
      const fallbackImage = categorySampleImages.get(name) || "/images/categories/default.webp";
      const imagePath = row.image_path?.trim() || fallbackImage;

      configuredCategories.push({
        categoryName: name,
        slug,
        imagePath,
        displayOrder,
        enabled,
        productCount: categoryCounts.get(name) || 0,
      });

      handledNames.add(name.toLowerCase());
    }
  }

  // Synthesize newly discovered categories from products.csv not in categories.csv
  categoryCounts.forEach((count, catName) => {
    if (!handledNames.has(catName.toLowerCase())) {
      configuredCategories.push({
        categoryName: catName,
        slug: slugify(catName),
        imagePath: categorySampleImages.get(catName) || "/images/categories/default.webp",
        displayOrder: 100,
        enabled: true,
        productCount: count,
      });
    }
  });

  return configuredCategories
    .filter((c) => c.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Retrieves a single category by slug.
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getAllCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Retrieves products belonging to a category slug.
 */
export function getProductsByCategorySlug(slug: string): Product[] {
  const products = getAllProducts();
  return products.filter((p) => p.categorySlug.toLowerCase() === slug.toLowerCase());
}

/**
 * Retrieves all collections from collections.csv.
 */
export function getAllCollections(): Collection[] {
  const collectionsPath = path.join(DATA_DIR, "collections.csv");
  if (!fs.existsSync(collectionsPath)) {
    return [];
  }

  const rawRows = parseCsvFile<RawCollectionCsvRow>(collectionsPath);
  const products = getAllProducts();
  const productMap = new Map(products.map((p) => [p.productId.toUpperCase(), p]));

  return rawRows
    .map((row) => {
      const collectionId = row.collection_id?.trim();
      const collectionName = row.collection_name?.trim();
      const slug = row.slug?.trim() || slugify(collectionName);
      const description = row.description?.trim() || "";
      const imagePath = row.image_path?.trim() || "/images/collections/default.webp";
      const productIds = parseSemicolonList(row.product_ids);
      const displayOrder = parseInt(row.display_order || "99", 10);
      const showOnHomepage = (row.show_on_homepage || "true").toLowerCase() === "true";

      // Filter to existing valid products
      const validProductCount = productIds.filter((id) =>
        productMap.has(id.toUpperCase())
      ).length;

      return {
        collectionId,
        collectionName,
        slug,
        description,
        imagePath,
        productIds,
        displayOrder,
        showOnHomepage,
        productCount: validProductCount,
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Retrieves a collection by its slug.
 */
export function getCollectionBySlug(slug: string): Collection | undefined {
  const collections = getAllCollections();
  return collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Retrieves products for a specific collection.
 */
export function getProductsForCollection(collection: Collection): Product[] {
  const allProducts = getAllProducts();
  const productMap = new Map(allProducts.map((p) => [p.productId.toUpperCase(), p]));
  const result: Product[] = [];

  for (const id of collection.productIds) {
    const product = productMap.get(id.toUpperCase());
    if (product) {
      result.push(product);
    }
  }

  return result;
}

/**
 * Retrieves homepage configuration sections from homepage.csv.
 */
export function getHomepageSections(): HomepageSection[] {
  const homepagePath = path.join(DATA_DIR, "homepage.csv");
  if (!fs.existsSync(homepagePath)) {
    return [];
  }

  const rawRows = parseCsvFile<RawHomepageCsvRow>(homepagePath);
  return rawRows
    .filter((row) => (row.enabled || "true").toLowerCase() === "true")
    .map((row) => ({
      sectionId: row.section_id?.trim(),
      sectionType: (row.section_type?.trim() as HomepageSectionType) || "hero_banner",
      title: row.title?.trim() || "",
      subtitle: row.subtitle?.trim() || "",
      imagePath: row.image_path?.trim() || "",
      mobileImagePath: row.mobile_image_path?.trim() || row.image_path?.trim() || "",
      ctaLabel: row.cta_label?.trim() || "",
      ctaUrl: row.cta_url?.trim() || "",
      displayOrder: parseInt(row.display_order || "99", 10),
      enabled: true,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Retrieves enabled customer reviews from reviews.csv.
 */
export function getAllReviews(): CustomerReview[] {
  const reviewsPath = path.join(DATA_DIR, "reviews.csv");
  if (!fs.existsSync(reviewsPath)) {
    return [];
  }

  const rawRows = parseCsvFile<RawReviewCsvRow>(reviewsPath);
  return rawRows
    .filter((row) => (row.enabled || "true").toLowerCase() === "true")
    .map((row) => ({
      reviewId: row.review_id?.trim(),
      customerDisplayName: row.customer_display_name?.trim(),
      reviewText: row.review_text?.trim(),
      productId: row.product_id?.trim() || undefined,
      imagePath: row.image_path?.trim() || undefined,
      source: row.source?.trim() || "Verified Buyer",
      displayOrder: parseInt(row.display_order || "99", 10),
      enabled: true,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Retrieves typed site settings from site-settings.csv.
 */
export function getSiteSettings(): SiteSettings {
  const settingsPath = path.join(DATA_DIR, "site-settings.csv");
  const defaultSettings: SiteSettings = {
    brandName: "RAJISHINE",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rajishine.com",
    currency: "INR",
    whatsappCountryCode: "+91",
    whatsappPhoneNumber: "",
    announcementText: "Welcome to RAJISHINE — Pure Elegance for Every Celebration",
    instagramUrl: "",
    contactEmail: "care@rajishine.com",
    footerCopyright: `© ${new Date().getFullYear()} RAJISHINE. All rights reserved.`,
    defaultSeoDescription:
      "RAJISHINE presents handcrafted Indian fashion and bridal jewellery. Explore temple necklaces, bridal sets, jhumkas, and bangles designed with timeless luxury.",
    socialShareImage: "/images/homepage/hero-bridal.webp",
    shippingDisclaimer:
      "Shipping charges and delivery timelines will be confirmed by RAJISHINE via WhatsApp before your order is finalized.",
  };

  if (!fs.existsSync(settingsPath)) {
    return defaultSettings;
  }

  const rawRows = parseCsvFile<RawSiteSettingCsvRow>(settingsPath);
  const result: Record<string, string> = { ...defaultSettings };

  for (const row of rawRows) {
    const key = row.key?.trim();
    const val = row.value !== undefined ? row.value.trim() : "";
    if (key) {
      result[key] = val;
    }
  }

  return {
    ...defaultSettings,
    brandName: result.brand_name || defaultSettings.brandName,
    siteUrl: result.site_url || defaultSettings.siteUrl,
    currency: result.currency || defaultSettings.currency,
    whatsappCountryCode: result.whatsapp_country_code || defaultSettings.whatsappCountryCode,
    whatsappPhoneNumber: result.whatsapp_phone_number || defaultSettings.whatsappPhoneNumber,
    announcementText: result.announcement_text ?? defaultSettings.announcementText,
    instagramUrl: result.instagram_url || defaultSettings.instagramUrl,
    contactEmail: result.contact_email || defaultSettings.contactEmail,
    footerCopyright: result.footer_copyright || defaultSettings.footerCopyright,
    defaultSeoDescription: result.default_seo_description || defaultSettings.defaultSeoDescription,
    socialShareImage: result.social_share_image || defaultSettings.socialShareImage,
    shippingDisclaimer: result.shipping_disclaimer || defaultSettings.shippingDisclaimer,
  };
}
