"use client";

import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveTheme,
  closeSlider,
  setPreviewTheme,
  setPreviewDevice,
  ThemeId,
} from "@/store/slices/themeSlice";
import { THEMES_REGISTRY } from "@/sdui/themeBundle";
import { getAllDefaultComponents } from "@/sdui/themes";
import SDUIRenderer from "@/sdui/SDUIRenderer";
import type { SDUINode } from "@/sdui/types";
import { IframeViewer } from "@/components/iframe";

/**
 * ==============================================================================
 * Component: ThemeSlider (Direct SDUI Theme & Component Studio)
 * ==============================================================================
 * Highlights:
 * 1. Opened after Check 1 (Backend Validation) verifies the themes.
 * 2. Displays theme cards with their validated status (Valid / Disabled).
 * 3. Enforces Check 2 (Frontend Guard) upon clicking "Apply Theme" / "Use Theme".
 * ==============================================================================
 */
export default function ThemeSlider() {
  const dispatch = useAppDispatch();
  const {
    availableThemes,
    activeThemeId,
    isSliderOpen,
    previewThemeId,
    previewDevice,
  } = useAppSelector((state) => state.theme);

  // Sub-tabs: "theme" (full page render) | "components" (real theme components list)
  const [previewSubTab, setPreviewSubTab] = useState<"theme" | "components">("theme");

  // Mobile navigation tab: "themes" list vs "preview" pane on small screens
  const [mobileTab, setMobileTab] = useState<"themes" | "preview">("themes");

  // 1. Search and category filter states for the components tab
  const [componentSearch, setComponentSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // 2. Identify which theme is currently selected for preview ("theme1", "theme2", or "theme3")
  const effectivePreviewId: ThemeId = (previewThemeId || activeThemeId || "theme1") as ThemeId;
  const activePreviewMeta = availableThemes.find((t) => t.id === effectivePreviewId) || availableThemes[0];
  const activeThemeSchema = THEMES_REGISTRY[effectivePreviewId] || THEMES_REGISTRY["theme1"];

  // 3. 🎓 Beginner Note: Retrieve all 35 default components styled for the selected theme
  // useMemo remembers the result and only recalculates when the preview theme changes!
  const allDefaultComponents = useMemo(() => {
    return getAllDefaultComponents(effectivePreviewId);
  }, [effectivePreviewId]);

  // 4. Collect unique categories (e.g. "Typography", "Atoms", "Commerce", "Layout") for filter pills
  const categories = useMemo(() => {
    const set = new Set(allDefaultComponents.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [allDefaultComponents]);

  // 5. Filter the 35 components based on search text and selected category pill
  const filteredComponents = useMemo(() => {
    const q = componentSearch.trim().toLowerCase();
    return allDefaultComponents.filter((comp) => {
      // Check if search matches component name, type, or category
      const matchesSearch =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.type.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q);
      
      // Check if category matches
      const matchesCategory =
        selectedCategory === "All" || comp.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allDefaultComponents, componentSearch, selectedCategory]);

  if (!isSliderOpen) return null;

  const handlePreview = (themeId: ThemeId) => {
    dispatch(setPreviewTheme(themeId));
    setMobileTab("preview");
  };

  // Check 2 (Frontend Guard): Activates the theme (blocked in Redux if disabled)
  const handleSelectTheme = (themeId: ThemeId) => {
    dispatch(setActiveTheme(themeId));
    dispatch(closeSlider());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 lg:p-6 transition-all duration-200">
      {/* Background click to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={() => dispatch(closeSlider())}
        aria-hidden="true"
      />

      {/* Main Studio Modal Dialog */}
      <div className="w-full max-w-6xl h-[92vh] bg-white rounded-xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out">
        {/* 1. Modal Top Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-zinc-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-zinc-900">Select Theme</h2>
            {activePreviewMeta && (
              <span className="hidden sm:inline text-xs text-zinc-500 font-medium">
                • Previewing {activePreviewMeta.name}
              </span>
            )}
            {activePreviewMeta?.isDisabled && (
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                ⚠️ Disabled by Backend
              </span>
            )}
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex sm:hidden items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMobileTab("themes")}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${mobileTab === "themes" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-600"
                }`}
            >
              🎨 Themes ({availableThemes.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${mobileTab === "preview" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-600"
                }`}
            >
              👁️ Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => dispatch(closeSlider())}
            className="text-zinc-400 hover:text-zinc-600 p-1.5 text-sm leading-none cursor-pointer rounded-md hover:bg-zinc-100"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* 2. Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Theme Cards List */}
          <div
            className={`w-full sm:w-72 lg:w-80 shrink-0 space-y-3.5 bg-zinc-50/50 border-r border-zinc-200 overflow-y-auto p-3.5 sm:p-5 ${mobileTab === "themes" ? "flex flex-col" : "hidden sm:flex sm:flex-col"
              }`}
          >
            {availableThemes.map((theme) => {
              const isActive = activeThemeId === theme.id;
              const isCurrentlyPreviewing = effectivePreviewId === theme.id;
              const isDisabled = theme.isDisabled;

              return (
                <div
                  key={theme.id}
                  className={`flex flex-col justify-between rounded-lg border bg-white p-3.5 transition ${
                    isCurrentlyPreviewing
                      ? "border-zinc-900 ring-2 ring-zinc-900/10 shadow-xs"
                      : isActive
                        ? "border-zinc-400 ring-1 ring-zinc-300"
                        : "border-zinc-200 hover:border-zinc-300"
                  } ${isDisabled ? "opacity-75 bg-zinc-50/60" : ""}`}
                >
                  {/* Preview Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handlePreview(theme.id)}
                    className={`w-full py-1.5 px-3 rounded-md text-xs font-medium border transition cursor-pointer mb-2.5 ${isCurrentlyPreviewing
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                      }`}
                  >
                    {isCurrentlyPreviewing ? "👁️ Previewing" : "Preview"}
                  </button>

                  {/* Visual Theme Palette Swatch */}
                  <div
                    className="h-11 rounded-lg border border-zinc-200/90 overflow-hidden mb-2.5 flex items-center justify-between px-3 shadow-2xs transition"
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-xs ring-1 ring-black/10 shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <span
                        className="text-xs font-semibold tracking-tight"
                        style={{ color: theme.id === "theme3" ? "#1C3829" : "#18181B" }}
                      >
                        {theme.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.headerBg }}
                        title="Header Color"
                      />
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.accentColor }}
                        title="Accent Color"
                      />
                    </div>
                  </div>

                  {/* Theme Name & Validation Badge */}
                  <div className="text-center mb-2.5 space-y-1">
                    <span className="text-xs font-semibold text-zinc-900 block">
                      {theme.name}
                    </span>
                    {isDisabled && (
                      <span className="inline-block text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-mono">
                        ⚠️ Validation failed
                      </span>
                    )}
                  </div>

                  {/* Select Theme Button (Enforcing Check 2) */}
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleSelectTheme(theme.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition shadow-2xs ${
                      isActive
                        ? "bg-zinc-900 text-white cursor-default"
                        : isDisabled
                        ? "bg-zinc-100 text-zinc-400 border border-dashed border-red-300 cursor-not-allowed"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 cursor-pointer"
                    }`}
                  >
                    {isActive
                      ? "✓ Active Theme"
                      : isDisabled
                      ? "⚠️ Disabled"
                      : "Use Theme"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Preview Area */}
          <div
            className={`flex-1 flex flex-col bg-zinc-100/60 overflow-hidden ${mobileTab === "preview" ? "flex" : "hidden sm:flex"
              }`}
          >
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-b border-zinc-200 shrink-0">
              {/* Mode Sub-Tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPreviewSubTab("theme")}
                  className={`px-2.5 sm:px-3 py-1 rounded transition cursor-pointer text-xs ${previewSubTab === "theme"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                  🌐 Theme
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewSubTab("components")}
                  className={`px-2.5 sm:px-3 py-1 rounded transition cursor-pointer text-xs ${previewSubTab === "components"
                      ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                  🧩 Components ({allDefaultComponents.length})
                </button>
              </div>

              {/* Controls: Device Mode Switcher & Prominent Apply Theme Button */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {previewSubTab === "theme" && (
                  <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
                    {(["desktop", "tablet", "phone"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => dispatch(setPreviewDevice(mode))}
                        className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium transition capitalize cursor-pointer ${previewDevice === mode
                            ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                            : "text-zinc-600 hover:text-zinc-900"
                          }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}

                {/* Prominent Apply Theme Button (Check 2: Frontend Guard) */}
                <button
                  type="button"
                  disabled={activePreviewMeta?.isDisabled}
                  onClick={() => {
                    if (!activePreviewMeta?.isDisabled) {
                      handleSelectTheme(effectivePreviewId);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold shadow-sm transition shrink-0 ${
                    activePreviewMeta?.isDisabled
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed border border-red-300"
                      : "bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white hover:shadow-md cursor-pointer"
                  }`}
                  title={
                    activePreviewMeta?.isDisabled
                      ? "Theme is disabled due to validation errors"
                      : "Apply and activate this theme"
                  }
                >
                  <span>
                    {activePreviewMeta?.isDisabled ? "Theme Disabled" : "Apply Theme"}
                  </span>
                </button>
              </div>
            </div>

            {/* Preview Panel Content */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-5 flex justify-center items-start">
              {/* 1. Theme Preview (Using modular IframeViewer from @/components/iframe) */}
              {previewSubTab === "theme" && (
                <div className="w-full flex justify-center">
                  <IframeViewer
                    src={`/landing-content?theme=${effectivePreviewId}&device=${previewDevice === "phone" ? "mobile" : previewDevice}`}
                    title={`${activePreviewMeta?.name || "Theme"} Live Preview`}
                    viewport={previewDevice}
                    onViewportChange={(mode) => dispatch(setPreviewDevice(mode))}
                    showToolbar={false}
                    displayUrl={`/landing-content?theme=${effectivePreviewId}`}
                    heightClassName={{
                      phone: "h-[540px] sm:h-[590px]",
                      tablet: "h-[540px] sm:h-[600px]",
                      desktop: "h-[560px] sm:h-[640px]",
                    }}
                  />
                </div>
              )}

              {/* 2. Direct All 35 Default Components Preview */}
              {previewSubTab === "components" && (
                <div className="w-full max-w-4xl space-y-4">
                  {/* Category Filter Pills & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                            selectedCategory === cat
                              ? "bg-zinc-900 text-white shadow-2xs"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70"
                          }`}
                        >
                          {cat}
                          <span className="ml-1 opacity-70 text-[10px]">
                            ({cat === "All" ? allDefaultComponents.length : allDefaultComponents.filter((c) => c.category === cat).length})
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-60">
                      <input
                        type="text"
                        value={componentSearch}
                        onChange={(e) => setComponentSearch(e.target.value)}
                        placeholder="Search 35 components..."
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                      />
                      {componentSearch && (
                        <button
                          type="button"
                          onClick={() => setComponentSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Components List or Empty State */}
                  {filteredComponents.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
                      <p className="text-sm font-semibold text-zinc-700">No components found</p>
                      <p className="text-xs text-zinc-500 mt-1">Try searching for a different component or category</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredComponents.map((comp, idx) => {
                        // Create clean node without placement coordinates
                        const cleanCompNode: SDUINode = { ...comp.config, placement: undefined };

                        return (
                          <div
                            key={comp.name}
                            className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs transition hover:shadow-xs"
                          >
                            {/* Component Header Strip */}
                            <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold text-zinc-900">
                                  {comp.name}
                                </span>
                                <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                                  {comp.category}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                #{idx + 1} of {filteredComponents.length}
                              </span>
                            </div>

                            {/* Direct SDUI Component Render Styled by Theme */}
                            <div
                              className="p-4 w-full flex justify-center overflow-x-auto"
                              style={{ backgroundColor: activePreviewMeta?.bgColor || "#FFFFFF" }}
                            >
                              <div className="w-full max-w-xl">
                                <SDUIRenderer
                                  customSchema={cleanCompNode}
                                  hideEditor={true}
                                  defaultDevice="desktop"
                                  autoDetectDevice={false}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
