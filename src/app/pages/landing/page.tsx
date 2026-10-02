"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

type ViewportMode = "desktop" | "tablet" | "phone";

/**
 * ==============================================================================
 * Route: /pages/landing (Landing Page SDUI Viewer)
 * ==============================================================================
 * Beginner Note:
 * This page embeds "/landing-content" (the Server-Driven UI landing page)
 * inside a fully responsive <iframe>.
 *
 * Responsiveness Highlights:
 * 1. Auto-detects device screen width on initial load (Mobile, Tablet, or Desktop).
 * 2. Mobile Phone view features an interactive iPhone mockup with realistic notch.
 * 3. Tablet view features a sleek tablet bezel with top camera dot.
 * 4. Desktop view features a full-width browser window mockup with secure address bar.
 * 5. Passes ?device= query params so the SDUI 100-column grid renders the exact
 *    mobile, tablet, or desktop layout.
 */
export default function LandingPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedTheme, setSelectedTheme] = useState<string>("landing_schema");
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Automatically adjust default preview mode based on user's real screen width
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setViewport("phone");
      } else if (window.innerWidth < 1024) {
        setViewport("tablet");
      } else {
        setViewport("desktop");
      }
    }
  }, []);

  // Reload the iframe content
  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Default calculated URL based on device & selected theme
  const defaultUrl = `/landing-content?device=${viewport === "phone" ? "mobile" : viewport}&theme=${selectedTheme}`;

  // Custom user-entered URL state
  const [customUrl, setCustomUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>(defaultUrl);

  // Sync input when defaultUrl changes (if user hasn't typed a custom route)
  useEffect(() => {
    if (!customUrl) {
      setUrlInput(defaultUrl);
    }
  }, [defaultUrl, customUrl]);

  // The active URL rendered by the iframe
  const iframeSrc = customUrl || defaultUrl;

  // Handle URL form submit
  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = urlInput.trim();
    if (clean) {
      setCustomUrl(clean);
      setIframeKey((prev) => prev + 1);
    }
  };

  // Reset to default theme preview
  const handleResetUrl = () => {
    setCustomUrl("");
    setUrlInput(defaultUrl);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. Global Header Bar */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />


      {/* 2. Main Dashboard Layout (Sidebar + Content Area) */}
      <div className="flex flex-1 relative">
        <Sidebar
          activeItem="landing"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-2.5 sm:p-5 lg:p-6 w-full space-y-3 sm:space-y-4 overflow-x-hidden flex flex-col">
          {/* Header & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-xl border border-zinc-200/90 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-zinc-900">
                Landing Page
              </h1>
              {customUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-indigo-700 border border-indigo-200">
                  <span>Custom: {customUrl}</span>
                  <button
                    type="button"
                    onClick={handleResetUrl}
                    className="ml-0.5 text-indigo-400 hover:text-red-500 font-sans cursor-pointer font-bold"
                    title="Reset to default theme URL"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            {/* Viewport Switcher & Utilities */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
              {/* Theme Selector Toggle Buttons */}
              <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50/70 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSelectedTheme("landing_schema")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
                    selectedTheme === "landing_schema"
                      ? "bg-[#0D3540] text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                  }`}
                  title="Default Campus Teal Theme"
                >
                  <span>🎨</span>
                  <span className="hidden lg:inline">Teal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTheme("clean_white")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
                    selectedTheme === "clean_white"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                  }`}
                  title="Clean Minimalist White Theme"
                >
                  <span>⚪</span>
                  <span className="hidden lg:inline">White</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTheme("black_minimal")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
                    selectedTheme === "black_minimal"
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                  }`}
                  title="Obsidian Dark Mode Theme"
                >
                  <span>⚫</span>
                  <span className="hidden lg:inline">Dark</span>
                </button>
              </div>

              {/* Device Mode Toggle Buttons */}
              <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50/70 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
                    viewport === "desktop"
                      ? "bg-zinc-900 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                  }`}
                  title="Desktop View (Full Width)"
                >
                  <span>🖥️</span>
                  <span className="hidden md:inline">Desktop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
                    viewport === "tablet"
                      ? "bg-zinc-900 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                  }`}
                  title="Tablet View (778px)"
                >
                  <span>💻</span>
                  <span className="hidden md:inline">Tablet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewport("phone")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
                    viewport === "phone"
                      ? "bg-zinc-900 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                  }`}
                  title="Mobile View (375px with Notch)"
                >
                  <span>📱</span>
                  <span className="hidden md:inline">Phone</span>
                </button>
              </div>

              {/* Utility Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={handleReload}
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs transition active:scale-95 cursor-pointer"
                  title="Reload Iframe"
                >
                  <span>🔄</span>
                  <span className="hidden sm:inline">Reload</span>
                </button>

                <Link
                  href={iframeSrc}
                  target="_blank"
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs transition"
                  title="Open current preview URL directly in new tab"
                >
                  <span>↗️</span>
                  <span className="hidden sm:inline">New Tab</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* RESPONSIVE IFRAME CONTAINER                                        */}
          {/* ================================================================== */}
          <div className="flex-1 flex justify-center items-start min-h-[600px] sm:min-h-[750px] pb-4 sm:pb-6">
            {/* ---------------------------------------------------------------- */}
            {/* 1. PHONE VIEWPORT (Realistic Phone Mockup with Notch)             */}
            {/* ---------------------------------------------------------------- */}
            {viewport === "phone" && (
              <div className="w-full max-w-[390px] mx-auto flex flex-col items-center animate-fade-in transition-all px-0.5 sm:px-0">
                {/* Phone Outer Shell */}
                <div className="w-full rounded-[36px] sm:rounded-[44px] bg-zinc-900 p-2 sm:p-3 shadow-2xl ring-1 ring-zinc-800">
                  {/* Phone Bezel with Notch */}
                  <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-black border border-zinc-800">
                    {/* Status Bar + Dynamic Island / Center Camera Notch */}
                    <div className="relative flex items-center justify-between bg-zinc-900 px-4 sm:px-6 pt-2 pb-1.5 text-[10px] font-bold text-zinc-300 select-none">
                      <span>9:41</span>

                      {/* Realistic Center Camera & Speaker Notch */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center gap-1.5 rounded-full bg-black px-2.5 py-0.5 ring-1 ring-zinc-800/80">
                        <span className="h-2 w-2 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                          <span className="h-0.5 w-0.5 rounded-full bg-blue-500"></span>
                        </span>
                        <span className="h-1 w-8 rounded-full bg-zinc-900"></span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span>5G</span>
                        <span className="h-2 w-3.5 rounded-2xs border border-zinc-300 p-0.2 flex items-center">
                          <span className="h-full w-full bg-zinc-300 rounded-3xs"></span>
                        </span>
                      </div>
                    </div>

                    {/* The Iframe */}
                    <iframe
                      key={iframeKey}
                      ref={iframeRef}
                      src={iframeSrc}
                      title="Landing Page Phone Preview"
                      className="h-[680px] sm:h-[620px] w-full bg-white border-0 no-scrollbar"
                      style={{ scrollbarWidth: "none" }}
                    />

                    {/* Phone Bottom Home Indicator Bar */}
                    <div className="bg-zinc-900 py-1.5 flex justify-center">
                      <div className="h-1 w-24 sm:w-28 rounded-full bg-zinc-600"></div>
                    </div>
                  </div>
                </div>

                <span className="mt-2 text-[11px] sm:text-xs text-zinc-400 font-mono">
                  Mobile Phone View • 375px
                </span>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* 2. TABLET VIEWPORT (Sleek Tablet Mockup)                         */}
            {/* ---------------------------------------------------------------- */}
            {viewport === "tablet" && (
              <div className="w-full max-w-[778px] mx-auto flex flex-col items-center animate-fade-in transition-all px-0.5 sm:px-0">
                <div className="w-full rounded-2xl sm:rounded-[32px] bg-zinc-900 p-2 sm:p-3.5 shadow-2xl ring-1 ring-zinc-800">
                  {/* Tablet Bezel */}
                  <div className="overflow-hidden rounded-xl sm:rounded-[24px] bg-white border border-zinc-800">
                    {/* Tablet Top Camera Notch Dot */}
                    <div className="bg-zinc-900 py-1.5 flex justify-center items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-800 border border-zinc-700"></span>
                    </div>

                    {/* The Iframe */}
                    <iframe
                      key={iframeKey}
                      ref={iframeRef}
                      src={iframeSrc}
                      title="Landing Page Tablet Preview"
                      className="h-[620px] sm:h-[660px] w-full bg-white border-0 no-scrollbar"
                      style={{ scrollbarWidth: "none" }}
                    />
                  </div>
                </div>

                <span className="mt-2 text-[11px] sm:text-xs text-zinc-400 font-mono">
                  Tablet View • 778px
                </span>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* 3. DESKTOP VIEWPORT (Full Width Browser Window Mockup)           */}
            {/* ---------------------------------------------------------------- */}
            {viewport === "desktop" && (
              <div className="w-full flex flex-col rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white shadow-sm overflow-hidden animate-fade-in transition-all">
                {/* Browser-like Header Bar */}
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-3 sm:px-4 py-2 sm:py-2.5 gap-2">
                  {/* Window Control Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400"></span>
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400"></span>
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400"></span>
                  </div>

                  {/* Interactive Browser Address Bar */}
                  <form
                    onSubmit={handleUrlSubmit}
                    className="flex-1 max-w-sm sm:max-w-md mx-1 sm:mx-2"
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 sm:px-2.5 py-1 text-xs font-mono shadow-2xs focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Enter route (e.g. /landing-content, /pages/product)..."
                        className="w-full bg-transparent text-[11px] sm:text-xs font-mono outline-none text-zinc-800 placeholder:text-zinc-400"
                        list="preview-routes"
                      />
                      <datalist id="preview-routes">
                        <option value="/landing-content?theme=landing_schema">Teal Landing Page</option>
                        <option value="/landing-content?theme=clean_white">Clean White Landing Page</option>
                        <option value="/landing-content?theme=black_minimal">Obsidian Dark Landing Page</option>
                        <option value="/pages/product">Products Catalog</option>
                        <option value="/pages/orders">Orders Page</option>
                        <option value="/pages/customers">Customers Page</option>
                      </datalist>

                      {customUrl && (
                        <button
                          type="button"
                          onClick={handleResetUrl}
                          className="shrink-0 text-[10px] text-zinc-400 hover:text-red-500 font-sans px-1 rounded transition cursor-pointer"
                          title="Reset to default theme URL"
                        >
                          ✕ Reset
                        </button>
                      )}

                      <button
                        type="submit"
                        className="shrink-0 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-900 text-white text-[10px] font-sans font-semibold transition cursor-pointer"
                        title="Load URL"
                      >
                        Go ↵
                      </button>
                    </div>
                  </form>

                  {/* Quick Refresh Icon */}
                  <button
                    onClick={handleReload}
                    className="text-xs text-zinc-400 hover:text-zinc-700 transition p-1 shrink-0 cursor-pointer"
                    title="Refresh iframe"
                  >
                    ↻
                  </button>
                </div>

                {/* The Iframe */}
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={iframeSrc}
                  title="Landing Page Desktop Preview"
                  className="h-[720px] sm:h-[760px] w-full bg-white border-0 no-scrollbar"
                  style={{ scrollbarWidth: "none" }}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
