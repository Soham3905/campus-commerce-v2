"use client";

import React, { useState, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { getAllDefaultComponents, type DefaultComponentItem } from "@/sdui/themes";
import { setActiveDragPayload } from "../dragState";

/**
 * ==============================================================================
 * 🎓 Beginner Guide: Panel 1 (Components Toolbox)
 * ==============================================================================
 * 
 * 1. WHAT IS THIS PANEL?
 *    This is the "toolbox" or "drawer" of building blocks.
 *    It displays all 35 pre-styled SDUI components (e.g. Button, Header,
 *    ProductCard, HeroBanner) ready for the user to drag and drop onto Canvas (Panel 2).
 * 
 * 2. WHERE DO THE COMPONENTS COME FROM?
 *    They come directly from the user's Redux Theme Cluster:
 *    `state.theme.appliedThemeCluster.defaultComponents`
 *    Because the user selected and applied their theme earlier, all 35 components
 *    here are ALREADY styled with that theme's colors, borders, and fonts!
 * 
 * 3. HOW DOES DRAG & DROP WORK?
 *    When you drag a component, `handleDragStart` puts its blueprint (type, name, config)
 *    into the drag event. When you drop it onto Panel 2 (Canvas), the Canvas reads
 *    that blueprint and places it on the 12-column grid.
 * ==============================================================================
 */

// Simple visual emoji icons for each of the 35 SDUI components
const COMPONENT_ICONS: Record<string, string> = {
  // Typography
  Title: "🔤",
  Text: "📝",
  Description: "📄",
  Label: "🏷️",
  // Atoms
  Button: "🔘",
  HeaderButton: "🔲",
  Image: "🖼️",
  Icon: "✨",
  StoryCircle: "⭕",
  // Commerce
  Badge: "🎖️",
  PriceBlock: "💵",
  ProductCard: "🛍️",
  ProductList: "📋",
  DeliveryInfo: "🚚",
  Rating: "⭐",
  Score: "🎯",
  ReviewCount: "💬",
  ShareButton: "🔗",
  // Marketing
  HeroBanner: "🌟",
  CouponCode: "🎟️",
  CountDownTimer: "⏱️",
  OfferText: "💥",
  Sponsored: "📢",
  // Navigation
  SearchBar: "🔍",
  NavBar: "🧭",
  CategoryGrid: "⊞",
  CategoryItem: "▫️",
  // Layout
  Header: "🔝",
  Footer: "🔚",
  Carousel: "🎠",
  StoryRow: "🎞️",
  Box: "📦",
  IFrame: "🌐",
  Page: "📑",
  Home: "🏠",
};

export default function ToolboxPanel() {
  // ----------------------------------------------------------------------------
  // 1. Read from Redux Store: The user's applied theme cluster!
  // ----------------------------------------------------------------------------
  const { appliedThemeCluster, activeThemeId } = useAppSelector(
    (state) => state.theme
  );

  // ----------------------------------------------------------------------------
  // 2. Component State: Search keyword & active category filter pill
  // ----------------------------------------------------------------------------
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [draggingName, setDraggingName] = useState<string | null>(null);

  // ----------------------------------------------------------------------------
  // 3. Get the 35 Default Components from the Cluster
  // ----------------------------------------------------------------------------
  const defaultComponents: DefaultComponentItem[] = useMemo(() => {
    // If user's cluster exists and matches the active theme, use it directly!
    if (appliedThemeCluster?.defaultComponents?.length) {
      return appliedThemeCluster.defaultComponents;
    }
    // Safe fallback if cluster is still loading
    return getAllDefaultComponents(activeThemeId);
  }, [appliedThemeCluster, activeThemeId]);

  // ----------------------------------------------------------------------------
  // 4. Extract Category Tabs ("All", "Typography", "Atoms", etc.)
  // ----------------------------------------------------------------------------
  const categories = useMemo(() => {
    if (appliedThemeCluster?.categories?.length) {
      return ["All", ...appliedThemeCluster.categories];
    }
    const unique = Array.from(new Set(defaultComponents.map((c) => c.category)));
    return ["All", ...unique];
  }, [appliedThemeCluster, defaultComponents]);

  // ----------------------------------------------------------------------------
  // 5. Filter components based on Search input and Category pill
  // ----------------------------------------------------------------------------
  const filteredComponents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return defaultComponents.filter((comp) => {
      const matchesSearch =
        !query ||
        comp.name.toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query) ||
        comp.type.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === "All" || comp.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [defaultComponents, search, selectedCategory]);

  // ----------------------------------------------------------------------------
  // 6. Drag & Drop: When user picks up a component card
  // ----------------------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, comp: DefaultComponentItem) => {
    setDraggingName(comp.name);

    // Build the blueprint payload that Canvas (Panel 2) will receive
    const dragPayload = {
      source: "component-toolbox",
      id: `${comp.type.toLowerCase()}-${Date.now()}`,
      type: comp.type,
      name: comp.name,
      category: comp.category,
      config: comp.config,
      previewColor: comp.previewColor,
    };

    // Store in global drag state and in standard HTML5 dataTransfer
    setActiveDragPayload(dragPayload);
    e.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
    e.dataTransfer.setData("text/plain", comp.type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggingName(null);
    setActiveDragPayload(null);
  };

  // ----------------------------------------------------------------------------
  // 7. Click "+" button: Shortcut to append component directly to Canvas
  // ----------------------------------------------------------------------------
  const handleQuickAdd = (comp: DefaultComponentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("add-component-to-canvas", { detail: comp })
      );
    }
  };

  // ----------------------------------------------------------------------------
  // 8. Render the Panel
  // ----------------------------------------------------------------------------
  return (
    <div className="h-full flex flex-col rounded-xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden select-none">
      {/* A. Header */}
      <div className="h-10 shrink-0 px-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-zinc-600 text-xs">🧩</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 truncate">
            Components
          </h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600">
            {filteredComponents.length}
          </span>
          <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600">
            Panel 1
          </span>
        </div>
      </div>

      {/* B. Sub-header info: Active Theme Name */}
      <div className="px-3 py-1.5 border-b border-zinc-100 bg-zinc-50/40 flex items-center justify-between gap-2 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="text-zinc-400">⠿</span>
          <span>Drag onto Canvas</span>
        </span>
        <span className="truncate text-zinc-700 font-semibold">
          {appliedThemeCluster?.metadata?.name || activeThemeId}
        </span>
      </div>

      {/* C. Search Box */}
      <div className="p-2 border-b border-zinc-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 35 components..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/60 pl-7 pr-6 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
            🔍
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* D. Category Filter Pills */}
      <div className="px-2 py-1.5 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? "bg-zinc-900 text-white shadow-2xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* E. Component Cards Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredComponents.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            <span className="text-xl">🔍</span>
            <p className="text-xs font-semibold text-zinc-600 mt-1">No components found</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Try searching for another name</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredComponents.map((comp) => {
              const isDragging = draggingName === comp.name;
              const icon = COMPONENT_ICONS[comp.name] || "🧩";

              return (
                <div
                  key={comp.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, comp)}
                  onDragEnd={handleDragEnd}
                  title={`Drag ${comp.name} to Canvas`}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                    isDragging
                      ? "opacity-50 border-emerald-500 bg-emerald-50 scale-95"
                      : "border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 hover:shadow-xs active:scale-95"
                  }`}
                >
                  {/* Shortcut Button: Click '+' to add to canvas without dragging */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(comp, e)}
                    title={`Click to add ${comp.name} to Canvas`}
                    className="absolute top-1 left-1.5 h-4 w-4 rounded bg-zinc-200/90 hover:bg-zinc-900 hover:text-white text-[10px] font-bold flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-2xs"
                  >
                    +
                  </button>

                  {/* Drag Handle Indicator dots */}
                  <span className="absolute top-1 right-1.5 text-[8px] text-zinc-300 group-hover:text-zinc-500">
                    ⠿
                  </span>

                  {/* Component Icon */}
                  <div className="h-7 w-7 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition">
                    {icon}
                  </div>

                  {/* Component Name */}
                  <span className="mt-1 text-[11px] font-semibold text-zinc-700 group-hover:text-zinc-900 truncate w-full text-center">
                    {comp.name}
                  </span>

                  {/* Component Category */}
                  <span className="text-[9px] text-zinc-400 font-mono">
                    {comp.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
