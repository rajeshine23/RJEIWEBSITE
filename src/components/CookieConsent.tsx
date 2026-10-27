"use client";

import React, { useState, useEffect } from "react";
import { setAnalyticsConsent, initAnalytics } from "@/lib/analytics";
import { Shield } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("rajishine_cookie_consent");
      if (!consent) {
        setShowBanner(true);
      } else if (consent === "granted") {
        initAnalytics();
      }
    } catch {
      // Ignore storage access error
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-brand-espresso text-brand-ivory p-4 rounded-lg shadow-luxury border border-brand-champagne/30 text-xs animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start space-x-3">
        <Shield className="w-5 h-5 text-brand-gold-light flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="leading-relaxed text-brand-ivory/80">
            We use privacy-respecting analytics (Google Analytics &amp; PostHog) to understand product interest and refine your shopping experience. No personal delivery or WhatsApp conversation data is ever tracked.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-1.5 bg-brand-gold-dark text-brand-ivory font-semibold rounded hover:bg-brand-gold transition-colors text-xs"
            >
              Accept Analytics
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="px-3 py-1.5 bg-transparent border border-brand-champagne/30 text-brand-ivory/70 rounded hover:text-brand-ivory hover:border-brand-champagne/60 transition-colors text-xs"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
