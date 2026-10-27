# RAJISHINE Data & Content Management Guide

Welcome to the content repository for **RAJISHINE**. This website is a static storefront where product inventory, collections, categories, homepage sections, customer reviews, and site settings are managed directly through CSV spreadsheets committed to GitHub.

---

## 📁 Spreadsheets Overview

| File | Purpose | Mandatory? |
|---|---|---|
| `products.csv` | Master product catalogue (1 row = 1 product) | **Yes** |
| `product-images.csv` | Advanced image-to-color mapping (for multi-image variants) | Optional |
| `categories.csv` | Category names, URL slugs, and featured banner images | Recommended |
| `collections.csv` | Curated collections (e.g. Bridal Edit, Festive Favourites) | Recommended |
| `homepage.csv` | Homepage banners, sections, headlines, and display ordering | **Yes** |
| `reviews.csv` | Genuine customer reviews & testimonials | Optional |
| `site-settings.csv` | Brand name, WhatsApp phone number, contact email, etc. | **Yes** |

---

## 🚀 Spreadsheet Editing Workflow

You do **not** need to touch any code (TypeScript, HTML, or CSS) to manage the catalogue.

1. **Open or Import in Google Sheets or Excel**:
   - Open `data/products.csv` (or the relevant CSV file).
   - In Excel: Go to `Data > From Text/CSV`, set Encoding to **65001 : Unicode (UTF-8)**, and ensure the `product_id` column is treated as **Text** so leading zeroes (if any) are never removed.
2. **Add or Edit Rows**:
   - Follow the column schemas described below.
   - Use semicolons (`;`) to separate list items inside a column (e.g., colors, quantities, image paths, product IDs).
3. **Save and Export as UTF-8 CSV**:
   - In Google Sheets: `File > Download > Comma-separated values (.csv)`.
   - In Excel: `File > Save As > CSV UTF-8 (Comma delimited) (*.csv)`.
   - Ensure the filename matches exactly (e.g., `products.csv`).
4. **Add Image Files**:
   - Place images into `public/images/products/<PRODUCT_ID>/` (e.g., `public/images/products/RJS00009/gold.webp`).
5. **Commit and Push to GitHub**:
   - Commit the updated CSV files and image assets to GitHub (`git add . && git commit -m "Add new bridal choker" && git push`).
6. **Automatic Deployment**:
   - Vercel automatically runs catalogue validation, builds the static website, and deploys it live to `rajishine.com`.

---

## 📋 Column Specifications

### `products.csv`

| Column | Type | Rules & Example |
|---|---|---|
| `product_id` | Text | **Must match `^RJS[0-9]{5}$`** (e.g. `RJS00001`). Globally unique. |
| `product_name` | Text | Display name (e.g. `Temple Necklace`). |
| `category` | Text | Dynamic category (e.g. `Necklaces`, `Bridal Jewellery`). If a new category is entered, the website automatically creates category navigation and pages. |
| `description` | Text | Editorial product description. Enclose in quotes if it contains commas. |
| `images` | Semicolon list | Root-relative image paths (e.g. `/images/products/RJS00001/gold-front.webp;/images/products/RJS00001/gold-detail.webp`). Must exist in `public/`. |
| `product_price` | Number | Regular price in INR (e.g. `2499`). |
| `discounted_price`| Number | Optional discounted price (e.g. `1999`). Must be strictly lower than `product_price`. Leave blank if no discount. |
| `quantity` | Semicolon list | Available stock per color (e.g. `5;2` or `12`). `0` indicates sold out. Count must match `color`. |
| `color` | Semicolon list | Color variant names (e.g. `Gold;Antique Gold` or `Ruby Red;Emerald Green`). Count must match `quantity`. |

### Advanced Image Manifest (`product-images.csv`)

When a single color has multiple photos (e.g. front angle, detail clasp, back angle), use `product-images.csv` instead of trying to squeeze multiple images into the simple positional format:

```csv
product_id,color,image_path,sort_order,is_primary
RJS00003,Ruby Red,/images/products/RJS00003/red-front.webp,1,true
RJS00003,Ruby Red,/images/products/RJS00003/red-detail.webp,2,false
RJS00003,Emerald Green,/images/products/RJS00003/green-front.webp,1,true
RJS00003,Emerald Green,/images/products/RJS00003/green-detail.webp,2,false
```

---

## 🔒 Accidental Error Protection

The storefront includes automated validation that checks your spreadsheets before building:
- Prevents duplicate product IDs.
- Prevents broken or missing image links.
- Ensures color and quantity counts match.
- Ensures discounts are valid numbers lower than the base price.
- Ensures all product IDs in collections exist in `products.csv`.

To test your spreadsheets locally before pushing:
```bash
npm run validate
```
