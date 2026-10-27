import { getSiteSettings } from "@/lib/data/catalogue";
import { CheckoutClient } from "@/features/checkout/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp Order Desk | RAJISHINE",
  description: "Review your jewellery bag and submit your direct order inquiry to RAJISHINE via WhatsApp.",
};

export default function CheckoutPage() {
  const settings = getSiteSettings();
  return <CheckoutClient settings={settings} />;
}
