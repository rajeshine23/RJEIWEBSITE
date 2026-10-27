import { describe, it, expect } from "vitest";
import {
  parseCsvString,
  parseSemicolonList,
  parseSemicolonIntList,
  slugify,
} from "@/lib/csv/parser";
import {
  getAllProducts,
  getAllCategories,
  getAllCollections,
  getProductById,
  getProductImageManifest,
} from "@/lib/data/catalogue";

describe("Catalogue Parser & Validation Suite", () => {
  it("parses single product with one image, one color, and one quantity", () => {
    const csv = `product_id,product_name,category,description,images,product_price,discounted_price,quantity,color
RJS00002,Pearl Jhumkas,Earrings,"Elegant pearl-look jhumka earrings","/images/products/RJS00002/pearl.webp",899,,"12","Pearl White"`;
    
    const rows = parseCsvString<any>(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].product_id).toBe("RJS00002");
    expect(parseSemicolonList(rows[0].color)).toEqual(["Pearl White"]);
    expect(parseSemicolonIntList(rows[0].quantity)).toEqual([12]);
    expect(parseSemicolonList(rows[0].images)).toEqual(["/images/products/RJS00002/pearl.webp"]);
  });

  it("handles multiple colors and matching quantities", () => {
    const csv = `product_id,product_name,category,description,images,product_price,discounted_price,quantity,color
RJS00001,Temple Necklace,Necklaces,"Traditional necklace","/images/products/RJS00001/gold.webp;/images/products/RJS00001/antique.webp",2499,1999,"5;2","Gold;Antique Gold"`;
    
    const rows = parseCsvString<any>(csv);
    const colors = parseSemicolonList(rows[0].color);
    const quantities = parseSemicolonIntList(rows[0].quantity);

    expect(colors).toHaveLength(2);
    expect(quantities).toHaveLength(2);
    expect(colors).toEqual(["Gold", "Antique Gold"]);
    expect(quantities).toEqual([5, 2]);
  });

  it("loads actual repository products and validates all required fields", () => {
    const products = getAllProducts();
    expect(products.length).toBeGreaterThan(0);

    const seenIds = new Set<string>();

    products.forEach((p) => {
      // product_id format: ^RJS[0-9]{5}$
      expect(p.productId).toMatch(/^RJS[0-9]{5}$/);
      expect(seenIds.has(p.productId)).toBe(false);
      seenIds.add(p.productId);

      expect(p.productName.length).toBeGreaterThan(0);
      expect(p.category.length).toBeGreaterThan(0);
      expect(p.productPrice).toBeGreaterThan(0);

      // Discounted price must be strictly lower than regular price if present
      if (p.discountedPrice) {
        expect(p.discountedPrice).toBeGreaterThan(0);
        expect(p.discountedPrice).toBeLessThan(p.productPrice);
      }

      // Colors and quantities parity
      expect(p.colors.length).toBe(p.quantities.length);
      expect(p.variants.length).toBe(p.colors.length);
    });
  });

  it("supports advanced image manifest overrides (multi-images per color)", () => {
    const manifest = getProductImageManifest();
    expect(manifest.has("RJS00003")).toBe(true);

    const rjs3 = getProductById("RJS00003");
    expect(rjs3).toBeDefined();

    // RJS00003 has 2 colors: Ruby Red and Emerald Green
    const rubyVariant = rjs3?.variants.find((v) => v.color === "Ruby Red");
    expect(rubyVariant).toBeDefined();
    expect(rubyVariant?.images.length).toBe(2);
    expect(rubyVariant?.primaryImage).toBe("/images/products/RJS00003/red-front.webp");
  });

  it("handles out-of-stock variants properly (quantity = 0)", () => {
    const rjs5 = getProductById("RJS00005");
    expect(rjs5).toBeDefined();

    const roseGold = rjs5?.variants.find((v) => v.color === "Rose Gold");
    expect(roseGold).toBeDefined();
    expect(roseGold?.quantity).toBe(0);
    expect(roseGold?.isAvailable).toBe(false);
  });

  it("dynamically creates categories from products.csv without hardcoding", () => {
    const categories = getAllCategories();
    expect(categories.length).toBeGreaterThan(0);

    const catNames = categories.map((c) => c.categoryName);
    expect(catNames).toContain("Necklaces");
    expect(catNames).toContain("Earrings");
    expect(catNames).toContain("Bangles");
    expect(catNames).toContain("Bridal Jewellery");

    categories.forEach((c) => {
      expect(c.slug).toBe(slugify(c.categoryName));
      expect(c.productCount).toBeGreaterThan(0);
    });
  });

  it("validates that all product_ids referenced in collections exist in products catalogue", () => {
    const collections = getAllCollections();
    const products = getAllProducts();
    const validIds = new Set(products.map((p) => p.productId));

    collections.forEach((col) => {
      col.productIds.forEach((pid) => {
        expect(validIds.has(pid)).toBe(true);
      });
    });
  });

  it("slugify function produces clean, URL-safe slugs", () => {
    expect(slugify("Bridal Jewellery")).toBe("bridal-jewellery");
    expect(slugify("Gold & Diamond Sets")).toBe("gold-and-diamond-sets");
    expect(slugify("  Earrings - Traditional  ")).toBe("earrings-traditional");
  });
});
