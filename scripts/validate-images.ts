import path from "path";
import fs from "fs";
import { parseCsvFile, parseSemicolonList } from "../src/lib/csv/parser";

interface ImageCheck {
  sourceFile: string;
  rowNumber?: number;
  entityId?: string;
  imagePath: string;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const DATA_DIR = path.join(process.cwd(), "data");

export function runImageValidation(): boolean {
  console.log("🖼️  Validating all referenced repository image paths in public/...");

  const checks: ImageCheck[] = [];
  const errors: string[] = [];

  // 1. products.csv images
  const productsPath = path.join(DATA_DIR, "products.csv");
  if (fs.existsSync(productsPath)) {
    const products = parseCsvFile<any>(productsPath);
    products.forEach((p, idx) => {
      const pid = p.product_id?.trim();
      const imgs = parseSemicolonList(p.images);
      imgs.forEach((img) => {
        checks.push({
          sourceFile: "products.csv",
          rowNumber: idx + 2,
          entityId: pid,
          imagePath: img,
        });
      });
    });
  }

  // 2. product-images.csv
  const manifestPath = path.join(DATA_DIR, "product-images.csv");
  if (fs.existsSync(manifestPath)) {
    const manifestRows = parseCsvFile<any>(manifestPath);
    manifestRows.forEach((m, idx) => {
      if (m.image_path) {
        checks.push({
          sourceFile: "product-images.csv",
          rowNumber: idx + 2,
          entityId: m.product_id?.trim(),
          imagePath: m.image_path.trim(),
        });
      }
    });
  }

  // 3. categories.csv
  const categoriesPath = path.join(DATA_DIR, "categories.csv");
  if (fs.existsSync(categoriesPath)) {
    const catRows = parseCsvFile<any>(categoriesPath);
    catRows.forEach((c, idx) => {
      if (c.image_path?.trim()) {
        checks.push({
          sourceFile: "categories.csv",
          rowNumber: idx + 2,
          entityId: c.category_name?.trim(),
          imagePath: c.image_path.trim(),
        });
      }
    });
  }

  // 4. collections.csv
  const collectionsPath = path.join(DATA_DIR, "collections.csv");
  if (fs.existsSync(collectionsPath)) {
    const colRows = parseCsvFile<any>(collectionsPath);
    colRows.forEach((c, idx) => {
      if (c.image_path?.trim()) {
        checks.push({
          sourceFile: "collections.csv",
          rowNumber: idx + 2,
          entityId: c.collection_id?.trim(),
          imagePath: c.image_path.trim(),
        });
      }
    });
  }

  // 5. homepage.csv
  const homepagePath = path.join(DATA_DIR, "homepage.csv");
  if (fs.existsSync(homepagePath)) {
    const homeRows = parseCsvFile<any>(homepagePath);
    homeRows.forEach((h, idx) => {
      if (h.image_path?.trim()) {
        checks.push({
          sourceFile: "homepage.csv",
          rowNumber: idx + 2,
          entityId: h.section_id?.trim(),
          imagePath: h.image_path.trim(),
        });
      }
      if (h.mobile_image_path?.trim()) {
        checks.push({
          sourceFile: "homepage.csv",
          rowNumber: idx + 2,
          entityId: h.section_id?.trim(),
          imagePath: h.mobile_image_path.trim(),
        });
      }
    });
  }

  // 6. reviews.csv
  const reviewsPath = path.join(DATA_DIR, "reviews.csv");
  if (fs.existsSync(reviewsPath)) {
    const revRows = parseCsvFile<any>(reviewsPath);
    revRows.forEach((r, idx) => {
      if (r.image_path?.trim()) {
        checks.push({
          sourceFile: "reviews.csv",
          rowNumber: idx + 2,
          entityId: r.review_id?.trim(),
          imagePath: r.image_path.trim(),
        });
      }
    });
  }

  // 7. site-settings.csv
  const settingsPath = path.join(DATA_DIR, "site-settings.csv");
  if (fs.existsSync(settingsPath)) {
    const settingRows = parseCsvFile<any>(settingsPath);
    settingRows.forEach((s, idx) => {
      if (s.key?.trim() === "social_share_image" && s.value?.trim()) {
        checks.push({
          sourceFile: "site-settings.csv",
          rowNumber: idx + 2,
          entityId: "social_share_image",
          imagePath: s.value.trim(),
        });
      }
    });
  }

  // Perform checks
  checks.forEach((item) => {
    // Only validate root-relative local paths
    if (item.imagePath.startsWith("/")) {
      const relativePathOnDisk = item.imagePath.replace(/^\//, "");
      const fullPath = path.join(PUBLIC_DIR, relativePathOnDisk);
      if (!fs.existsSync(fullPath)) {
        errors.push(
          `Missing image: '${item.imagePath}' referenced in ${item.sourceFile}${
            item.rowNumber ? ` (Line ${item.rowNumber})` : ""
          }${item.entityId ? ` [${item.entityId}]` : ""}`
        );
      }
    } else if (item.imagePath.startsWith("http://") || item.imagePath.startsWith("https://")) {
      errors.push(
        `External image URL forbidden: '${item.imagePath}' in ${item.sourceFile}. Repository-hosted images in public/ must be the authoritative source.`
      );
    }
  });

  if (errors.length > 0) {
    console.error(`\n❌ Image Validation Failed: ${errors.length} image path error(s):\n`);
    errors.forEach((err) => console.error(`  - ${err}`));
    return false;
  }

  console.log(`\n✅ Image validation PASSED. (${checks.length} referenced images verified on disk)\n`);
  return true;
}

if (process.argv[1] && process.argv[1].endsWith("validate-images.ts")) {
  const success = runImageValidation();
  if (!success) {
    process.exit(1);
  }
}
