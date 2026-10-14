"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ToolboxPanel,
  CanvasPanel,
  PropertiesPanel,
  PreviewPanel,
  type CanvasLayoutItem,
} from "./panels";

interface FourPanelWorkspaceProps {
  activeThemeName?: string;
  activeThemeId?: string;
  onOpenThemeSlider?: () => void;
}

type MobileActivePanel = 1 | 2 | 3 | 4;

/**
 * Helper to recursively find a component by its unique ID
 */
function findItemRecursive(
  items: CanvasLayoutItem[],
  id: string
): CanvasLayoutItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children && item.children.length > 0) {
      const found = findItemRecursive(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Helper to recursively update an item in the layout tree
 */
function updateItemRecursive(
  items: CanvasLayoutItem[],
  updated: CanvasLayoutItem
): CanvasLayoutItem[] {
  return items.map((item) => {
    if (item.id === updated.id) {
      return updated;
    }
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: updateItemRecursive(item.children, updated),
      };
    }
    return item;
  });
}

/**
 * ==============================================================================
 * Component: FourPanelWorkspace
 * ==============================================================================
 * Four-panel landing page builder workspace:
 * - Panel 1 (ToolboxPanel): Lists all SDUI components for the active theme.
 * - Panel 2 (CanvasPanel): 12-column grid canvas with drop nesting & validation.
 * - Panel 3 (PropertiesPanel): Edits selected component properties by values or JSON.
 * - Panel 4 (PreviewPanel): Live responsive mobile & desktop landing page preview.
 * ==============================================================================
 */
export default function FourPanelWorkspace({
  activeThemeName = "Theme 1",
  activeThemeId = "theme1",
  onOpenThemeSlider,
}: FourPanelWorkspaceProps) {
  // Mobile active tab (1: Components, 2: Canvas, 3: Props, 4: Preview)
  const [mobilePanel, setMobilePanel] = useState<MobileActivePanel>(2);

  // Shared layout items placed on the canvas
  const [layoutItems, setLayoutItems] = useState<CanvasLayoutItem[]>([]);

  // Selected item ID on the canvas for editing in Panel 3
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Locate currently selected component
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return findItemRecursive(layoutItems, selectedItemId);
  }, [layoutItems, selectedItemId]);

  // Handler for updating a component's values or JSON from PropertiesPanel
  const handleUpdateItem = useCallback((updated: CanvasLayoutItem) => {
    setLayoutItems((prev) => updateItemRecursive(prev, updated));
  }, []);

  // Handler for selecting a component from Canvas
  const handleSelectItem = useCallback((id: string | null) => {
    setSelectedItemId(id);
    // On small screens, automatically switch to Panel 3 (Props) when a component is clicked
    if (id && typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobilePanel(3);
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[#eef1f5] text-zinc-800">
      {/* 1. Simple Top Header Bar */}
      <header className="h-12 shrink-0 border-b border-zinc-200/90 bg-white px-3 sm:px-5 flex items-center justify-between gap-3 shadow-2xs">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition"
          >
            <span>&larr;</span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <span className="text-zinc-300 select-none">/</span>

          <span className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
            Landing Page Builder
          </span>

          <span className="text-zinc-300 select-none hidden sm:inline">/</span>

          {/* Active Theme Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>{activeThemeName}</span>
          </span>
        </div>

        {/* Right: Change Theme Button */}
        {onOpenThemeSlider && (
          <button
            type="button"
            onClick={onOpenThemeSlider}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:scale-95 transition shadow-2xs cursor-pointer"
          >
            <span>🎨</span>
            <span>Change Theme</span>
          </button>
        )}
      </header>

      {/* 2. Mobile Tab Switcher (< lg screens) */}
      <div className="lg:hidden shrink-0 border-b border-zinc-200 bg-white px-3 py-2">
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-zinc-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobilePanel(1)}
            className={`py-1 rounded-md transition text-center ${mobilePanel === 1
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
              }`}
          >
            1. Components
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel(2)}
            className={`py-1 rounded-md transition text-center ${mobilePanel === 2
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
              }`}
          >
            2. Canvas
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel(3)}
            className={`py-1 rounded-md transition text-center relative ${mobilePanel === 3
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
              }`}
          >
            <span>3. Props</span>
            {selectedItem && (
              <span className="inline-block ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel(4)}
            className={`py-1 rounded-md transition text-center ${mobilePanel === 4
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
              }`}
          >
            4. Preview
          </button>
        </div>
      </div>

      {/* 3. Four Panels Container */}
      <div className="flex-1 flex flex-row gap-2.5 p-2.5 sm:p-3 overflow-x-auto overflow-y-hidden min-h-0">
        {/* Panel 1: Components (Toolbox) */}
        <div
          className={`h-full ${mobilePanel === 1 ? "flex flex-1" : "hidden"
            } lg:flex lg:w-56 xl:w-60 lg:shrink-0`}
        >
          <ToolboxPanel />
        </div>

        {/* Panel 2: Form Canvas */}
        <div
          className={`h-full ${mobilePanel === 2 ? "flex flex-1" : "hidden"
            } lg:flex lg:flex-1 lg:min-w-[280px]`}
        >
          <CanvasPanel
            items={layoutItems}
            onItemsChange={setLayoutItems}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
          />
        </div>

        {/* Panel 3: Properties */}
        <div
          className={`h-full ${mobilePanel === 3 ? "flex flex-1" : "hidden"
            } lg:flex lg:w-64 xl:w-72 lg:shrink-0`}
        >
          <PropertiesPanel
            selectedItem={selectedItem}
            onUpdateItem={handleUpdateItem}
            onDeselect={() => setSelectedItemId(null)}
          />
        </div>

        {/* Panel 4: Live Preview */}
        <div
          className={`h-full ${mobilePanel === 4 ? "flex flex-1" : "hidden"
            } lg:flex lg:w-72 xl:w-80 2xl:w-96 lg:shrink-0`}
        >
          <PreviewPanel
            layoutItems={layoutItems}
            activeThemeId={activeThemeId}
          />
        </div>
      </div>
    </div>
  );
}
