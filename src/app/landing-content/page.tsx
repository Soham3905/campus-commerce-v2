"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SDUIRenderer from "@/sdui/SDUIRenderer";
import { THEMES_REGISTRY } from "@/sdui/themeBundle";
import { validateThemeStrict } from "@/sdui/validators/validator";
import type { DeviceType } from "@/sdui/types";

/**
 * ==============================================================================
 * Route: /landing-content (Embedded Iframe Source Page for SDUI Preview)
 * ==============================================================================
 * Beginner Note:
 * This page is embedded inside the preview <iframe> in our Theme Slider.
 *
 * How it works:
 * 1. Reads ?theme=theme1|theme2|theme3 from the URL.
 * 2. Runs strict validation on the schema.
 * 3. If valid, renders the theme using <SDUIRenderer />.
 * 4. If disabled/invalid, displays a friendly error notice and does not render.
 * ==============================================================================
 */

function LandingContentInner() {
  const searchParams = useSearchParams();
  const requestedDevice = searchParams.get("device") as DeviceType | null;
  const requestedTheme = searchParams.get("theme") || "theme1";

  const [deviceMode, setDeviceMode] = useState<DeviceType>(
    requestedDevice || "desktop"
  );

  // Look up the requested theme from our Theme Bundle
  const { schema, validation } = useMemo(() => {
    const rawSchema = THEMES_REGISTRY[requestedTheme] || THEMES_REGISTRY["theme1"];
    const valResult = validateThemeStrict(rawSchema, requestedTheme);
    return { schema: rawSchema, validation: valResult };
  }, [requestedTheme]);

  // Auto-detect viewport width inside the iframe
  useEffect(() => {
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

  // If the theme is disabled, show a simple error screen instead of rendering
  if (validation.isDisabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-zinc-50">
        <div className="max-w-md p-6 bg-white rounded-2xl border border-red-200 shadow-sm space-y-3">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-lg font-bold text-zinc-900">Theme Disabled</h2>
          <p className="text-xs text-zinc-500">
            Theme <span className="font-semibold text-zinc-800 font-mono">"{requestedTheme}"</span> has validation errors and is disabled.
          </p>
          <div className="bg-red-50 p-3 rounded-lg text-left text-xs text-red-700 font-mono space-y-1 max-h-40 overflow-y-auto">
            {validation.errors.map((err, i) => (
              <div key={i}>• {err}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Theme-aware page background
  const pageBgClass =
    requestedTheme === "theme3" || requestedTheme === "black_minimal"
      ? "bg-[#FBFBF9] text-zinc-900"
      : requestedTheme === "theme2" || requestedTheme === "clean_white"
      ? "bg-white text-zinc-900"
      : "bg-[#FAFAF8] text-zinc-900";

  return (
    <main
      className={`min-h-screen w-full font-sans selection:bg-emerald-600 selection:text-white no-scrollbar transition-colors duration-200 ${pageBgClass}`}
    >
      <SDUIRenderer
        customSchema={schema}
        hideEditor={true}
        defaultDevice={deviceMode}
        autoDetectDevice={!requestedDevice}
        className="min-h-screen"
      />
    </main>
  );
}

export default function LandingContentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white text-xs font-semibold text-zinc-400">
          Loading Campus Commerce Preview...
        </div>
      }
    >
      <LandingContentInner />
    </Suspense>
  );
}
