"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SDUIRenderer from "@/sdui/SDUIRenderer";
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
 * 2. Also accepts an optional ?device=phone|tablet|desktop URL query parameter.
 * 3. Mounts <SDUIRenderer hideEditor={true} /> so the landing page displays edge-to-edge
 *    cleanly with zero clutter, exactly like a production marketplace app.
 */

function LandingContentInner() {
  const searchParams = useSearchParams();
  const requestedDevice = searchParams.get("device") as DeviceType | null;

  const [deviceMode, setDeviceMode] = useState<DeviceType>(
    requestedDevice || "desktop"
  );

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

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 font-sans selection:bg-emerald-600 selection:text-white no-scrollbar">
      <SDUIRenderer
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
