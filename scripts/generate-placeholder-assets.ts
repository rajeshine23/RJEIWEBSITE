import fs from "fs";
import path from "path";
import sharp from "sharp";

interface ImageDef {
  filePath: string;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  tag?: string;
  bgColor?: string;
  accentColor?: string;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSvg(def: ImageDef): string {
  const bg = def.bgColor || "#FAF6EF";
  const accent = def.accentColor || "#B08D57";
  const maroon = "#641F2B";
  const espresso = "#30231E";
  const champagne = "#E8D8C5";

  const safeTitle = escapeXml(def.title);
  const safeSubtitle = escapeXml(def.subtitle);
  const safeTag = def.tag ? escapeXml(def.tag.toUpperCase()) : "";
  const fontSize = def.width > 800 ? 32 : 24;

  return `
  <svg width="${def.width}" height="${def.height}" viewBox="0 0 ${def.width} ${def.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="luxuryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="${champagne}" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4AF37" />
        <stop offset="50%" stop-color="${accent}" />
        <stop offset="100%" stop-color="#8C6D3B" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${def.width}" height="${def.height}" fill="url(#luxuryGrad)" />

    <!-- Ornate Border -->
    <rect x="20" y="20" width="${def.width - 40}" height="${def.height - 40}" 
          fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.5" />
    <rect x="28" y="28" width="${def.width - 56}" height="${def.height - 56}" 
          fill="none" stroke="${accent}" stroke-width="0.75" stroke-opacity="0.3" />

    <!-- Corner Filigree -->
    <path d="M 28 48 L 48 48 L 48 28" fill="none" stroke="${accent}" stroke-width="1.5" />
    <path d="M ${def.width - 28} 48 L ${def.width - 48} 48 L ${def.width - 48} 28" fill="none" stroke="${accent}" stroke-width="1.5" />
    <path d="M 28 ${def.height - 48} L 48 ${def.height - 48} L 48 ${def.height - 28}" fill="none" stroke="${accent}" stroke-width="1.5" />
    <path d="M ${def.width - 28} ${def.height - 48} L ${def.width - 48} ${def.height - 48} L ${def.width - 48} ${def.height - 28}" fill="none" stroke="${accent}" stroke-width="1.5" />

    <!-- Center Jewellery Mandala / Silhouette Motif -->
    <g transform="translate(${def.width / 2}, ${def.height * 0.42})">
      <circle r="70" fill="none" stroke="url(#goldGrad)" stroke-width="2" />
      <circle r="56" fill="none" stroke="${maroon}" stroke-width="1" stroke-dasharray="4,4" />
      <circle r="40" fill="none" stroke="${accent}" stroke-width="1.5" />
      <!-- Floral Petals -->
      <path d="M 0 -56 Q 16 -30 0 0 Q -16 -30 0 -56 Z" fill="${accent}" fill-opacity="0.2" />
      <path d="M 0 56 Q 16 30 0 0 Q -16 30 0 56 Z" fill="${accent}" fill-opacity="0.2" />
      <path d="M -56 0 Q -30 16 0 0 Q -30 -16 -56 0 Z" fill="${accent}" fill-opacity="0.2" />
      <path d="M 56 0 Q 30 16 0 0 Q 30 -16 56 0 Z" fill="${accent}" fill-opacity="0.2" />
      <!-- Center Gem -->
      <circle r="12" fill="${maroon}" />
      <circle r="6" fill="url(#goldGrad)" />
    </g>

    <!-- Tag -->
    ${
      safeTag
        ? `
      <text x="${def.width / 2}" y="${def.height * 0.68}" 
            text-anchor="middle" font-family="'Times New Roman', serif" 
            font-size="13" font-weight="600" letter-spacing="4" fill="${maroon}">
        ${safeTag}
      </text>
    `
        : ""
    }

    <!-- Title -->
    <text x="${def.width / 2}" y="${def.height * 0.74}" 
          text-anchor="middle" font-family="'Times New Roman', serif" 
          font-size="${fontSize}" font-weight="700" letter-spacing="1" fill="${espresso}">
      ${safeTitle}
    </text>

    <!-- Subtitle -->
    <text x="${def.width / 2}" y="${def.height * 0.80}" 
          text-anchor="middle" font-family="'Helvetica Neue', sans-serif" 
          font-size="14" font-weight="400" letter-spacing="2" fill="${accent}">
      ${safeSubtitle}
    </text>

    <!-- Brand Watermark -->
    <text x="${def.width / 2}" y="${def.height - 40}" 
          text-anchor="middle" font-family="'Times New Roman', serif" 
          font-size="11" letter-spacing="3" fill="${espresso}" opacity="0.6">
      RAJISHINE • EDITORIAL LUXURY
    </text>
  </svg>
  `;
}

async function generateAllAssets() {
  const images: ImageDef[] = [
    // Product RJS00001
    {
      filePath: "images/products/RJS00001/gold-front.webp",
      width: 800,
      height: 1000,
      title: "Temple Necklace",
      subtitle: "Gold • Heritage Front",
      tag: "Temple Collection",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },
    {
      filePath: "images/products/RJS00001/gold-detail.webp",
      width: 800,
      height: 1000,
      title: "Temple Necklace",
      subtitle: "Antique Gold • Close Detail",
      tag: "Craft Detail",
      bgColor: "#F5EFEB",
      accentColor: "#8C6D3B",
    },

    // Product RJS00002
    {
      filePath: "images/products/RJS00002/pearl.webp",
      width: 800,
      height: 1000,
      title: "Pearl Jhumkas",
      subtitle: "Pearl White • Traditional Drop",
      tag: "Earrings",
      bgColor: "#FAF8F5",
      accentColor: "#B08D57",
    },

    // Product RJS00003
    {
      filePath: "images/products/RJS00003/red-front.webp",
      width: 800,
      height: 1000,
      title: "Bridal Necklace Set",
      subtitle: "Ruby Red • Primary Front",
      tag: "Bridal Heritage",
      bgColor: "#F8F1EB",
      accentColor: "#641F2B",
    },
    {
      filePath: "images/products/RJS00003/red-detail.webp",
      width: 800,
      height: 1000,
      title: "Bridal Necklace Set",
      subtitle: "Ruby Red • Gem Detail Angle",
      tag: "Handcrafted",
      bgColor: "#F8F1EB",
      accentColor: "#641F2B",
    },
    {
      filePath: "images/products/RJS00003/green-front.webp",
      width: 800,
      height: 1000,
      title: "Bridal Necklace Set",
      subtitle: "Emerald Green • Primary Front",
      tag: "Bridal Heritage",
      bgColor: "#EDF5F0",
      accentColor: "#2D5A43",
    },
    {
      filePath: "images/products/RJS00003/green-detail.webp",
      width: 800,
      height: 1000,
      title: "Bridal Necklace Set",
      subtitle: "Emerald Green • Gem Detail Angle",
      tag: "Handcrafted",
      bgColor: "#EDF5F0",
      accentColor: "#2D5A43",
    },

    // Product RJS00004
    {
      filePath: "images/products/RJS00004/ruby.webp",
      width: 800,
      height: 1000,
      title: "Royal Kundan Choker",
      subtitle: "Ruby Crimson • Regal Finish",
      tag: "Necklaces",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },
    {
      filePath: "images/products/RJS00004/emerald.webp",
      width: 800,
      height: 1000,
      title: "Royal Kundan Choker",
      subtitle: "Emerald Green • Royal Finish",
      tag: "Necklaces",
      bgColor: "#FAF6EF",
      accentColor: "#2D5A43",
    },

    // Product RJS00005
    {
      filePath: "images/products/RJS00005/antique-gold.webp",
      width: 800,
      height: 1000,
      title: "Antique Temple Bangles",
      subtitle: "Antique Gold • Pair of 2",
      tag: "Bangles",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },
    {
      filePath: "images/products/RJS00005/rose-gold.webp",
      width: 800,
      height: 1000,
      title: "Antique Temple Bangles",
      subtitle: "Rose Gold • Pair of 2",
      tag: "Bangles",
      bgColor: "#F9ECE9",
      accentColor: "#A65B5B",
    },

    // Product RJS00006
    {
      filePath: "images/products/RJS00006/gold.webp",
      width: 800,
      height: 1000,
      title: "Chandbali Earrings",
      subtitle: "Kundan & Pearl Embellished",
      tag: "Earrings",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },

    // Product RJS00007
    {
      filePath: "images/products/RJS00007/gold.webp",
      width: 800,
      height: 1000,
      title: "Royal Heritage Maang Tikka",
      subtitle: "Traditional Bridal Hairpiece",
      tag: "Bridal Jewellery",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },

    // Product RJS00008
    {
      filePath: "images/products/RJS00008/gold.webp",
      width: 800,
      height: 1000,
      title: "Handcrafted Temple Kada",
      subtitle: "Embossed Goddess Motif",
      tag: "Bangles",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },

    // Categories
    {
      filePath: "images/categories/necklaces.webp",
      width: 600,
      height: 600,
      title: "Necklaces",
      subtitle: "Chokers, Temple & Harams",
      tag: "Category",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/categories/earrings.webp",
      width: 600,
      height: 600,
      title: "Earrings",
      subtitle: "Jhumkas, Chandbalis & Studs",
      tag: "Category",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/categories/bangles.webp",
      width: 600,
      height: 600,
      title: "Bangles",
      subtitle: "Antique Kadas & Sets",
      tag: "Category",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/categories/bridal-jewellery.webp",
      width: 600,
      height: 600,
      title: "Bridal Jewellery",
      subtitle: "Complete Heirloom Trousseau",
      tag: "Category",
      bgColor: "#F8F1EB",
    },
    {
      filePath: "images/categories/default.webp",
      width: 600,
      height: 600,
      title: "Fine Jewellery",
      subtitle: "Curated Selection",
      tag: "Category",
      bgColor: "#FAF6EF",
    },

    // Collections
    {
      filePath: "images/collections/bridal-edit.webp",
      width: 800,
      height: 600,
      title: "The Bridal Edit",
      subtitle: "Opulent statements for royal ceremonies",
      tag: "Curated Collection",
      bgColor: "#F8F1EB",
    },
    {
      filePath: "images/collections/royal-temple.webp",
      width: 800,
      height: 600,
      title: "Royal Temple Treasures",
      subtitle: "Sacred motifs crafted with antique devotion",
      tag: "Curated Collection",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/collections/festive-favourites.webp",
      width: 800,
      height: 600,
      title: "Festive Favourites",
      subtitle: "Dazzling accents for memorable celebrations",
      tag: "Curated Collection",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/collections/new-arrivals.webp",
      width: 800,
      height: 600,
      title: "New Arrivals",
      subtitle: "The latest handcrafted treasures",
      tag: "Curated Collection",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/collections/default.webp",
      width: 800,
      height: 600,
      title: "Signature Collection",
      subtitle: "Timeless Indian craftsmanship",
      tag: "Curated Collection",
      bgColor: "#FAF6EF",
    },

    // Homepage
    {
      filePath: "images/homepage/hero-bridal.webp",
      width: 1920,
      height: 800,
      title: "Timeless Bridal Opulence",
      subtitle: "Handcrafted Indian Jewellery For Your Most Cherished Moments",
      tag: "Festive & Bridal Campaign",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },
    {
      filePath: "images/homepage/hero-bridal-mobile.webp",
      width: 800,
      height: 1000,
      title: "Timeless Bridal Opulence",
      subtitle: "Handcrafted Indian Jewellery",
      tag: "Festive & Bridal Campaign",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },
    {
      filePath: "images/homepage/brand-craft.webp",
      width: 900,
      height: 600,
      title: "The Art of Indian Craftsmanship",
      subtitle: "Heirloom aesthetics refined for the modern bride",
      tag: "Heirloom Craft",
      bgColor: "#F5EFEB",
      accentColor: "#641F2B",
    },
    {
      filePath: "images/homepage/social-1.webp",
      width: 600,
      height: 600,
      title: "Bridal Grace",
      subtitle: "@rajishine.jewels",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/homepage/social-2.webp",
      width: 600,
      height: 600,
      title: "Royal Temple Haram",
      subtitle: "@rajishine.jewels",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/homepage/social-3.webp",
      width: 600,
      height: 600,
      title: "Pearl Jhumka Moments",
      subtitle: "@rajishine.jewels",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/homepage/social-4.webp",
      width: 600,
      height: 600,
      title: "Antique Bangles Stack",
      subtitle: "@rajishine.jewels",
      bgColor: "#FAF6EF",
    },

    // Reviews
    {
      filePath: "images/reviews/customer-1.webp",
      width: 400,
      height: 400,
      title: "Priya S.",
      subtitle: "Bengaluru, India",
      tag: "Sample Review Image",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/reviews/customer-2.webp",
      width: 400,
      height: 400,
      title: "Ananya M.",
      subtitle: "London, UK",
      tag: "Sample Review Image",
      bgColor: "#FAF6EF",
    },
    {
      filePath: "images/reviews/customer-3.webp",
      width: 400,
      height: 400,
      title: "Kavitha R.",
      subtitle: "Chennai, India",
      tag: "Sample Review Image",
      bgColor: "#FAF6EF",
    },

    // General placeholder
    {
      filePath: "images/placeholder-jewellery.webp",
      width: 800,
      height: 1000,
      title: "RAJISHINE",
      subtitle: "Indian Bridal & Fashion Jewellery",
      tag: "Heirloom Collection",
      bgColor: "#FAF6EF",
      accentColor: "#B08D57",
    },
  ];

  console.log(`Generating ${images.length} webp assets...`);

  for (const img of images) {
    const fullPath = path.join(PUBLIC_DIR, img.filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const svg = buildSvg(img);
    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(fullPath);
  }

  // Also write RAJISHINE SVG Logo
  const logoSvg = `
  <svg width="320" height="60" viewBox="0 0 320 60" xmlns="http://www.w3.org/2000/svg">
    <text x="160" y="36" text-anchor="middle" font-family="'Times New Roman', serif" font-size="28" font-weight="700" letter-spacing="6" fill="#30231E">
      RAJISHINE
    </text>
    <text x="160" y="52" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-size="9" font-weight="500" letter-spacing="4" fill="#B08D57">
      JEWELLERY • HEIRLOOM CRAFT
    </text>
  </svg>
  `;
  fs.writeFileSync(path.join(PUBLIC_DIR, "logo", "rajishine-logo.svg"), logoSvg.trim());

  // Favicon (32x32 WebP & ICO)
  const faviconSvg = `
  <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#641F2B" />
    <circle cx="32" cy="32" r="24" fill="none" stroke="#B08D57" stroke-width="2" />
    <text x="32" y="42" text-anchor="middle" font-family="'Times New Roman', serif" font-size="28" font-weight="bold" fill="#FAF6EF">R</text>
  </svg>
  `;
  const favBuffer = await sharp(Buffer.from(faviconSvg)).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), favBuffer);

  console.log("✅ All assets generated successfully!");
}

generateAllAssets().catch((err) => {
  console.error("Failed to generate assets:", err);
  process.exit(1);
});
