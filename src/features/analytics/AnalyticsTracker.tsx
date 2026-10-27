"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackPageView, initAnalytics } from "@/lib/analytics";

function PageViewListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const query = searchParams ? searchParams.toString() : "";
    const fullUrl = query ? `${pathname}?${query}` : pathname;
    trackPageView(fullUrl);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <>
      {/* Google Analytics 4 Script (only rendered if Measurement ID is supplied) */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                send_page_view: false // Handled manually by PageViewListener to avoid duplicates
              });
            `}
          </Script>
        </>
      )}

      {/* Route change tracker wrapped in Suspense for static generation */}
      <Suspense fallback={null}>
        <PageViewListener />
      </Suspense>
    </>
  );
}
