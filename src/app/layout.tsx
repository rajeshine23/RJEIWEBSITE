import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import {
  getAllCategories,
  getAllCollections,
  getSiteSettings,
} from "@/lib/data/catalogue";
import { CartProvider } from "@/features/cart/CartContext";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsTracker } from "@/features/analytics/AnalyticsTracker";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    metadataBase: new URL(settings.siteUrl || "https://rajishine.com"),
    title: {
      default: `${settings.brandName} | Handcrafted Indian Fashion & Bridal Jewellery`,
      template: `%s | ${settings.brandName}`,
    },
    description: settings.defaultSeoDescription,
    keywords: [
      "Indian jewellery",
      "bridal jewellery",
      "temple necklace",
      "antique bangles",
      "kundan choker",
      "jhumkas",
      "chandbalis",
      "heritage jewellery India",
      "RAJISHINE",
    ],
    authors: [{ name: settings.brandName }],
    creator: settings.brandName,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: settings.siteUrl,
      title: `${settings.brandName} | Handcrafted Indian Fashion & Bridal Jewellery`,
      description: settings.defaultSeoDescription,
      siteName: settings.brandName,
      images: [
        {
          url: settings.socialShareImage,
          width: 1200,
          height: 630,
          alt: `${settings.brandName} Bridal Jewellery`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.brandName,
      description: settings.defaultSeoDescription,
      images: [settings.socialShareImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getAllCategories();
  const collections = getAllCollections();
  const settings = getSiteSettings();

  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-brand-ivory text-brand-espresso">
        <CartProvider>
          {/* Analytics & Consent */}
          <AnalyticsTracker />
          <CookieConsent />

          {/* Site Navigation & Banner */}
          <AnnouncementBar message={settings.announcementText} />
          <Header
            categories={categories}
            collections={collections}
            brandName={settings.brandName}
          />

          {/* Main View */}
          <main className="flex-1">{children}</main>

          {/* Footer & Interactive Slide-out Cart */}
          <Footer
            categories={categories}
            collections={collections}
            settings={settings}
          />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
