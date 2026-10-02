"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SDUIRenderer from "@/sdui/SDUIRenderer";
import { fullPageJSON } from "@/sdui/landingSchema";
import { applyThemeToSchema } from "@/sdui/themes/themeApplier";
import { validateAndSanitize } from "@/sdui/validators/validator";
import type { DeviceType } from "@/sdui/types";

/**
 * ==============================================================================
 * Route: /landing-content (Embedded Iframe Source Page for SDUI Landing Page)
 * ==============================================================================
 * Beginner Note:
 * This page is a standalone, lightweight page designed to be embedded inside an
 * <iframe> on the /pages/landing route.
 *
 * Responsiveness Highlights:
 * 1. Checks its current window/iframe width dynamically:
 *    - < 640px  -> Sets device mode to "mobile"  (matches Phone Mockup 375px)
 *    - < 1024px -> Sets device mode to "tablet"  (matches Tablet Mockup 778px)
 *    - >= 1024px -> Sets device mode to "desktop" (matches Desktop Browser Mockup)
 * 2. Accepts ?device=phone|tablet|desktop and ?theme=landing_schema|clean_white|black_minimal.
 * 3. Mounts <SDUIRenderer customSchema={themedSchema} hideEditor={true} /> so the landing page
 *    displays edge-to-edge cleanly with zero clutter, responding live to theme switching.
 */

function LandingContentInner() {
  const searchParams = useSearchParams();
  const requestedDevice = searchParams.get("device") as DeviceType | null;
  const requestedTheme = searchParams.get("theme") || "landing_schema";

  const [deviceMode, setDeviceMode] = useState<DeviceType>(
    requestedDevice || "desktop"
  );

  // Compute the themed schema dynamically and sanitize suspicious components
  const themedSchema = useMemo(() => {
    const rawThemed = applyThemeToSchema(fullPageJSON, requestedTheme);
    const { sanitizedSchema, errors } = validateAndSanitize(rawThemed);
    if (errors.length > 0) {
      console.warn("[SDUI Security Guard] Sanitized suspicious nodes:", errors);
    }
    return sanitizedSchema;
  }, [requestedTheme]);

  // Auto-detect viewport width inside the iframe
  useEffect(() => {
    // If a specific device query parameter was passed, prioritize it
    if (requestedDevice && ["mobile", "tablet", "desktop"].includes(requestedDevice)) {
      setDeviceMode(requestedDevice);
      return;
    }

    const updateDeviceFromWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceMode("mobile");
      } else if (width < 1024) {
        setDeviceMode("tablet");
      } else {
        setDeviceMode("desktop");
      }
    };

    updateDeviceFromWidth();
    window.addEventListener("resize", updateDeviceFromWidth);
    return () => window.removeEventListener("resize", updateDeviceFromWidth);
  }, [requestedDevice]);

  // Theme-aware page background
  const pageBgClass =
    requestedTheme === "black_minimal"
      ? "bg-[#090D16] text-slate-100"
      : requestedTheme === "clean_white"
      ? "bg-white text-zinc-900"
      : "bg-[#FAFAF8] text-zinc-900";

  return (
    <main className={`min-h-screen w-full font-sans selection:bg-emerald-600 selection:text-white no-scrollbar transition-colors duration-200 ${pageBgClass}`}>
      <SDUIRenderer
        customSchema={themedSchema}
        hideEditor={true}
        defaultDevice={deviceMode}
        autoDetectDevice={!requestedDevice}
      />
    </main>
  );
}

export default function LandingContentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white text-xs font-semibold text-zinc-400">
          Loading Campus Commerce Landing Page...
        </div>
      }
    >
      <LandingContentInner />
    </Suspense>
  );
}
