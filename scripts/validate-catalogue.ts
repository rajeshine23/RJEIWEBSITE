import path from "path";
import fs from "fs";
import { parseCsvFile, parseSemicolonList, parseSemicolonIntList } from "../src/lib/csv/parser";
import { HomepageSectionType } from "../src/types/catalogue";

interface ValidationError {
  file: string;
  rowNumber?: number;
  id?: string;
  field?: string;
  message: string;
}

const errors: ValidationError[] = [];
const warnings: string[] = [];

const DATA_DIR = path.join(process.cwd(), "data");

function addError(error: ValidationError) {
  errors.push(error);
}

function addWarning(msg: string) {
  warnings.push(msg);
}

// 1. Validate products.csv
export function validateProducts(): Set<string> {
  const filePath = path.join(DATA_DIR, "products.csv");
  const fileName = "products.csv";
  const validProductIds = new Set<string>();

  if (!fs.existsSync(filePath)) {
    addError({ file: fileName, message: "File does not exist." });
    return validProductIds;
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    addError({ file: fileName, message: "File is empty." });
    return validProductIds;
  }

  const header = lines[0].trim();
  const expectedHeader = "product_id,product_name,category,description,images,product_price,discounted_price,quantity,color";
  if (header !== expectedHeader) {
    addError({
      file: fileName,
      rowNumber: 1,
      message: `Invalid CSV header.\nExpected: ${expectedHeader}\nReceived: ${header}`,
    });
  }

  let rows: any[] = [];
  try {
    rows = parseCsvFile(filePath);
  } catch (err: any) {
    addError({ file: fileName, message: `Failed to parse CSV: ${err.message}` });
    return validProductIds;
  }

  const productIdRegex = /^RJS[0-9]{5}$/;
  const seenIds = new Set<string>();

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +1 for 0-index, +1 for header
    const id = row.product_id?.trim();

    if (!id) {
      addError({ file: fileName, rowNumber: rowNum, message: "product_id is missing." });
      return;
    }

    if (!productIdRegex.test(id)) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id,
        field: "product_id",
        message: `product_id '${id}' must match pattern ^RJS[0-9]{5}$ (e.g. RJS00001).`,
      });
    }

    if (seenIds.has(id)) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id,
        field: "product_id",
        message: `Duplicate product_id '${id}' found. Product IDs must be globally unique.`,
      });
    } else {
      seenIds.add(id);
      validProductIds.add(id);
    }

    if (!row.product_name?.trim()) {
      addError({ file: fileName, rowNumber: rowNum, id, field: "product_name", message: "product_name is required." });
    }

    if (!row.category?.trim()) {
      addError({ file: fileName, rowNumber: rowNum, id, field: "category", message: "category is required." });
    }

    // Images
    const images = parseSemicolonList(row.images);
    if (images.length === 0) {
      addError({ file: fileName, rowNumber: rowNum, id, field: "images", message: "images column must contain at least one valid image path." });
    }

    // Prices
    const priceNum = parseFloat(row.product_price);
    if (isNaN(priceNum) || priceNum <= 0) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id,
        field: "product_price",
        message: `product_price must be a positive number. Got: '${row.product_price}'`,
      });
    }

    const discountStr = row.discounted_price?.trim();
    if (discountStr && discountStr.length > 0) {
      const discNum = parseFloat(discountStr);
      if (isNaN(discNum) || discNum <= 0) {
        addError({
          file: fileName,
          rowNumber: rowNum,
          id,
          field: "discounted_price",
          message: `discounted_price must be a positive number when provided. Got: '${discountStr}'`,
        });
      } else if (!isNaN(priceNum) && discNum >= priceNum) {
        addError({
          file: fileName,
          rowNumber: rowNum,
          id,
          field: "discounted_price",
          message: `discounted_price (₹${discNum}) must be strictly lower than regular product_price (₹${priceNum}).`,
        });
      }
    }

    // Quantities & Colors
    const colors = parseSemicolonList(row.color);
    const quantities = parseSemicolonIntList(row.quantity);

    if (colors.length === 0) {
      addError({ file: fileName, rowNumber: rowNum, id, field: "color", message: "At least one color must be specified." });
    }

    if (quantities.length === 0) {
      addError({ file: fileName, rowNumber: rowNum, id, field: "quantity", message: "At least one quantity must be specified." });
    }

    if (colors.length !== quantities.length) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id,
        message: `Mismatched counts: found ${colors.length} color(s) ('${colors.join("; ")}') but ${quantities.length} quantity value(s) ('${quantities.join("; ")}'). Counts must match exactly.`,
      });
    }

    // Positional image mapping ambiguity check (if no manifest file overrides this)
    const manifestPath = path.join(DATA_DIR, "product-images.csv");
    let hasManifestForProduct = false;
    if (fs.existsSync(manifestPath)) {
      const manifestRows = parseCsvFile<any>(manifestPath);
      hasManifestForProduct = manifestRows.some((m) => m.product_id?.trim() === id);
    }

    if (!hasManifestForProduct) {
      if (colors.length > 1 && images.length > 1 && images.length !== colors.length) {
        addError({
          file: fileName,
          rowNumber: rowNum,
          id,
          message: `Ambiguous image-to-color mapping: product has ${colors.length} colors and ${images.length} images. Use product-images.csv manifest to specify multi-image mapping per color or provide 1 image per color.`,
        });
      }
    }
  });

  return validProductIds;
}

// 2. Validate product-images.csv (advanced manifest)
export function validateProductManifest(validProductIds: Set<string>) {
  const filePath = path.join(DATA_DIR, "product-images.csv");
  const fileName = "product-images.csv";

  if (!fs.existsSync(filePath)) {
    return; // optional file
  }

  let rows: any[] = [];
  try {
    rows = parseCsvFile(filePath);
  } catch (err: any) {
    addError({ file: fileName, message: `Failed to parse CSV: ${err.message}` });
    return;
  }

  // Fetch product colors map
  const products = parseCsvFile<any>(path.join(DATA_DIR, "products.csv"));
  const productColorMap = new Map<string, string[]>();
  products.forEach((p) => {
    productColorMap.set(p.product_id?.trim(), parseSemicolonList(p.color));
  });

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const pid = row.product_id?.trim();
    const color = row.color?.trim();
    const imagePath = row.image_path?.trim();

    if (!pid || !validProductIds.has(pid)) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id: pid,
        field: "product_id",
        message: `Referenced product_id '${pid}' does not exist in products.csv.`,
      });
    }

    if (!color) {
      addError({ file: fileName, rowNumber: rowNum, id: pid, field: "color", message: "color is required." });
    } else if (pid && productColorMap.has(pid)) {
      const allowedColors = productColorMap.get(pid)!;
      const match = allowedColors.some((c) => c.toLowerCase() === color.toLowerCase());
      if (!match) {
        addError({
          file: fileName,
          rowNumber: rowNum,
          id: pid,
          field: "color",
          message: `Color '${color}' is not one of the declared colors for product ${pid} (${allowedColors.join(", ")}).`,
        });
      }
    }

    if (!imagePath) {
      addError({ file: fileName, rowNumber: rowNum, id: pid, field: "image_path", message: "image_path is required." });
    }
  });
}

// 3. Validate collections.csv
export function validateCollections(validProductIds: Set<string>) {
  const filePath = path.join(DATA_DIR, "collections.csv");
  const fileName = "collections.csv";

  if (!fs.existsSync(filePath)) {
    addError({ file: fileName, message: "File does not exist." });
    return;
  }

  let rows: any[] = [];
  try {
    rows = parseCsvFile(filePath);
  } catch (err: any) {
    addError({ file: fileName, message: `Failed to parse CSV: ${err.message}` });
    return;
  }

  const seenCollectionIds = new Set<string>();

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const cid = row.collection_id?.trim();
    const cname = row.collection_name?.trim();

    if (!cid) {
      addError({ file: fileName, rowNumber: rowNum, message: "collection_id is required." });
    } else if (seenCollectionIds.has(cid)) {
      addError({ file: fileName, rowNumber: rowNum, id: cid, message: `Duplicate collection_id '${cid}' found.` });
    } else {
      seenCollectionIds.add(cid);
    }

    if (!cname) {
      addError({ file: fileName, rowNumber: rowNum, id: cid, field: "collection_name", message: "collection_name is required." });
    }

    const pids = parseSemicolonList(row.product_ids);
    if (pids.length === 0) {
      addWarning(`Collection '${cid || cname}' has no product_ids listed.`);
    }

    pids.forEach((pid) => {
      if (!validProductIds.has(pid)) {
        addError({
          file: fileName,
          rowNumber: rowNum,
          id: cid,
          field: "product_ids",
          message: `Unknown product ID '${pid}' referenced in collection '${cid}'. Product does not exist in products.csv.`,
        });
      }
    });
  });
}

// 4. Validate homepage.csv
export function validateHomepage() {
  const filePath = path.join(DATA_DIR, "homepage.csv");
  const fileName = "homepage.csv";

  if (!fs.existsSync(filePath)) {
    addError({ file: fileName, message: "File does not exist." });
    return;
  }

  const validSectionTypes: HomepageSectionType[] = [
    "announcement_bar",
    "hero_banner",
    "shop_by_category",
    "featured_collections",
    "new_arrivals",
    "best_sellers",
    "brand_story",
    "value_propositions",
    "social_gallery",
    "reviews",
    "reviews_section",
    "closing_cta",
  ];

  let rows: any[] = [];
  try {
    rows = parseCsvFile(filePath);
  } catch (err: any) {
    addError({ file: fileName, message: `Failed to parse CSV: ${err.message}` });
    return;
  }

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const sid = row.section_id?.trim();
    const stype = row.section_type?.trim() as HomepageSectionType;

    if (!sid) {
      addError({ file: fileName, rowNumber: rowNum, message: "section_id is required." });
    }

    if (!stype || !validSectionTypes.includes(stype)) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id: sid,
        field: "section_type",
        message: `Invalid section_type '${stype}'. Allowed types: ${validSectionTypes.join(", ")}`,
      });
    }
  });
}

// 5. Validate reviews.csv
export function validateReviews(validProductIds: Set<string>) {
  const filePath = path.join(DATA_DIR, "reviews.csv");
  const fileName = "reviews.csv";

  if (!fs.existsSync(filePath)) {
    addWarning("reviews.csv does not exist. Customer reviews section will be omitted.");
    return;
  }

  let rows: any[] = [];
  try {
    rows = parseCsvFile(filePath);
  } catch (err: any) {
    addError({ file: fileName, message: `Failed to parse CSV: ${err.message}` });
    return;
  }

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const rid = row.review_id?.trim();
    const name = row.customer_display_name?.trim();
    const text = row.review_text?.trim();
    const pid = row.product_id?.trim();

    if (!rid) {
      addError({ file: fileName, rowNumber: rowNum, message: "review_id is required." });
    }
    if (!name) {
      addError({ file: fileName, rowNumber: rowNum, id: rid, field: "customer_display_name", message: "customer_display_name is required." });
    }
    if (!text) {
      addError({ file: fileName, rowNumber: rowNum, id: rid, field: "review_text", message: "review_text is required." });
    }
    if (pid && !validProductIds.has(pid)) {
      addError({
        file: fileName,
        rowNumber: rowNum,
        id: rid,
        field: "product_id",
        message: `Referenced product_id '${pid}' does not exist in products.csv.`,
      });
    }
  });
}

// 6. Validate site-settings.csv
export function validateSiteSettings() {
  const filePath = path.join(DATA_DIR, "site-settings.csv");
  const fileName = "site-settings.csv";

  if (!fs.existsSync(filePath)) {
    addError({ file: fileName, message: "File does not exist." });
    return;
  }

  let rows: any[] = [];
  try {
    rows = parseCsvFile(filePath);
  } catch (err: any) {
    addError({ file: fileName, message: `Failed to parse CSV: ${err.message}` });
    return;
  }

  const map = new Map<string, string>();
  rows.forEach((r) => map.set(r.key?.trim(), r.value !== undefined ? r.value.trim() : ""));

  const requiredKeys = ["brand_name", "site_url", "currency"];
  requiredKeys.forEach((key) => {
    if (!map.has(key) || !map.get(key)) {
      addError({
        file: fileName,
        message: `Missing required site setting: '${key}'.`,
      });
    }
  });

  if (!map.get("whatsapp_phone_number")) {
    addWarning(
      "whatsapp_phone_number is currently unconfigured or blank in site-settings.csv. Storefront will operate with checkout prompt disabled until configured."
    );
  }
}

export function runCatalogueValidation(): boolean {
  console.log("🔍 Validating RAJISHINE catalogue spreadsheets in data/...");

  const validProductIds = validateProducts();
  validateProductManifest(validProductIds);
  validateCollections(validProductIds);
  validateHomepage();
  validateReviews(validProductIds);
  validateSiteSettings();

  if (warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    warnings.forEach((w) => console.log(`  - ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\n❌ Validation Failed with ${errors.length} error(s):\n`);
    errors.forEach((e) => {
      const loc = [e.file, e.rowNumber ? `Line ${e.rowNumber}` : "", e.id ? `ID: ${e.id}` : "", e.field ? `Field: ${e.field}` : ""]
        .filter(Boolean)
        .join(" | ");
      console.error(`  [${loc}] => ${e.message}`);
    });
    return false;
  }

  console.log(`\n✅ Catalogue validation PASSED. (${validProductIds.size} products verified)\n`);
  return true;
}

if (process.argv[1] && process.argv[1].endsWith("validate-catalogue.ts")) {
  const success = runCatalogueValidation();
  if (!success) {
    process.exit(1);
  }
}
