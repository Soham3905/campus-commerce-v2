"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ToolboxPanel,
  CanvasPanel,
  PropertiesPanel,
  PreviewPanel,
  type CanvasLayoutItem,
} from "./panels";
import {
  syncChildrenLayoutItems,
  findNodeInTree,
  findRootItemForNodeId,
  addChildToNodeRecursive,
  deleteChildFromTree,
  updateNodeInTree,
  findParentNodeInTree,
  calculateRequiredRootRows,
  calculateLayoutPreview,
  createDefaultChildNode,
  ensureNodeIds,
  getAllowedChildrenForType,
  getDefaultPlacement,
  DEVICE_CONFIGS,
} from "./panels/CanvasPanel";
import { ALL_RULES } from "@/sdui/validators/rules";
import type { DeviceType, GridPlacement } from "@/sdui/types";
import { THEMES_REGISTRY } from "@/sdui/themeBundle";

interface FourPanelWorkspaceProps {
  activeThemeName?: string;
  activeThemeId?: string;
  onOpenThemeSlider?: () => void;
}

type MobileActivePanel = 1 | 2 | 3 | 4;

/**
 * Helper to convert an SDUI theme tree into initial canvas layout items
 */
function getInitialLayoutFromTheme(themeId: string): CanvasLayoutItem[] {
  const schema = THEMES_REGISTRY[themeId] || THEMES_REGISTRY["theme1"];
  if (!schema) return [];
  const pageNode =
    (Array.isArray(schema.children) && schema.children.find((c: any) => c.type === "Page")) ||
    schema;
  const blocks = Array.isArray(pageNode.children) ? pageNode.children : [];

  let currentRow = 1;
  return blocks.map((rawBlock: any, idx: number) => {
    const blockWithIds = ensureNodeIds(rawBlock, `block-${idx}`);
    const id = blockWithIds.id || `root-${blockWithIds.type.toLowerCase()}-${idx}`;
    const desktopDef = getDefaultPlacement(blockWithIds.type, "desktop", currentRow);
    const rowSpan = Math.max(1, desktopDef.rowEnd - desktopDef.rowStart);

    const placement: Record<DeviceType, GridPlacement> = {
      desktop: desktopDef,
      tablet: getDefaultPlacement(blockWithIds.type, "tablet", currentRow),
      mobile: getDefaultPlacement(blockWithIds.type, "mobile", currentRow),
    };
    currentRow += rowSpan;

    return {
      id,
      type: blockWithIds.type,
      name: blockWithIds.type,
      category: ALL_RULES[blockWithIds.type]?.category || "Component",
      placement,
      config: { ...blockWithIds, id },
      children: syncChildrenLayoutItems(blockWithIds),
      zIndex: idx + 1,
    };
  });
}

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
 * Recursively searches root items AND all nested child nodes
 * to return an editable CanvasLayoutItem reference for any selected component.
 */
function findItemOrChild(
  items: CanvasLayoutItem[],
  id: string
): CanvasLayoutItem | null {
  for (const item of items) {
    // 1. Direct root match
    if (item.id === id) return item;

    // 2. Search inside SDUI node tree
    if (item.config) {
      const node = findNodeInTree(item.config, id);
      if (node) {
        return {
          id: node.id || id,
          type: node.type,
          name: node.type,
          category: ALL_RULES[node.type]?.category || "Component",
          config: node,
          children: syncChildrenLayoutItems(node),
        };
      }
    }

    // 3. Search inside children array if present
    if (item.children && item.children.length > 0) {
      const found = findItemRecursive(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Fallback helper to recursively update an item in a CanvasLayoutItem tree
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
 * - Panel 2 (CanvasPanel): Visual grid canvas with drop nesting, independent child
 *   selection, and child resizing with collision-free cascading.
 * - Panel 3 (PropertiesPanel): Edits selected component properties, values, CSS
 *   dimensions, and nested children.
 * - Panel 4 (PreviewPanel): Live responsive mobile & desktop landing page preview.
 * ==============================================================================
 */
export default function FourPanelWorkspace({
  activeThemeName = "Theme 1",
  activeThemeId = "theme1",
  onOpenThemeSlider,
}: FourPanelWorkspaceProps) {
  // Active responsive device breakpoint (desktop: 24, tablet: 12, mobile: 8 cols)
  const [device, setDevice] = useState<DeviceType>("desktop");

  // Mobile active tab (1: Components, 2: Canvas, 3: Props, 4: Preview)
  const [mobilePanel, setMobilePanel] = useState<MobileActivePanel>(2);

  // Toggle live phone preview on desktop screens
  const [showLivePreview, setShowLivePreview] = useState<boolean>(false);

  // Shared layout items placed on the canvas
  const [layoutItems, setLayoutItems] = useState<CanvasLayoutItem[]>([]);

  // Load from localStorage or initialize with active theme blocks
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = `campus_workspace_items_${activeThemeId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If cached layout has outdated narrow header (< 20 cols), upgrade to full width layout
          const hasNarrowHeader = parsed.some(
            (it: any) => it.type === "Header" && (it.placement?.desktop?.colEnd || 0) < 20
          );
          if (!hasNarrowHeader) {
            setLayoutItems(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to parse saved layout items", e);
      }
    }
    const initial = getInitialLayoutFromTheme(activeThemeId);
    if (initial.length > 0) {
      setLayoutItems(initial);
    }
  }, [activeThemeId]);

  // Persist layout items to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = `campus_workspace_items_${activeThemeId}`;
    localStorage.setItem(storageKey, JSON.stringify(layoutItems));
  }, [layoutItems, activeThemeId]);

  // History stacks for undo & redo
  const [history, setHistory] = useState<CanvasLayoutItem[][]>([]);
  const [future, setFuture] = useState<CanvasLayoutItem[][]>([]);

  // Helper to update layout while recording undo history
  const setLayoutItemsWithHistory = useCallback(
    (action: CanvasLayoutItem[] | ((prev: CanvasLayoutItem[]) => CanvasLayoutItem[])) => {
      setLayoutItems((current) => {
        const next = typeof action === "function" ? action(current) : action;
        if (next !== current) {
          setHistory((prevH) => [...prevH.slice(-30), current]);
          setFuture([]);
        }
        return next;
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    setHistory((prevH) => {
      if (prevH.length === 0) return prevH;
      const previous = prevH[prevH.length - 1];
      const newHistory = prevH.slice(0, prevH.length - 1);
      setLayoutItems((current) => {
        setFuture((prevF) => [current, ...prevF]);
        return previous;
      });
      return newHistory;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setFuture((prevF) => {
      if (prevF.length === 0) return prevF;
      const next = prevF[0];
      const newFuture = prevF.slice(1);
      setLayoutItems((current) => {
        setHistory((prevH) => [...prevH, current]);
        return next;
      });
      return newFuture;
    });
  }, []);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Selected item ID on the canvas (can be a root block or any nested child)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Toggle live preview panel
  const handleTogglePreview = useCallback(() => {
    setShowLivePreview((prev) => {
      const next = !prev;
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setMobilePanel(next ? 4 : 2);
      }
      return next;
    });
  }, []);

  // Close overlapping preview when user presses Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLivePreview) {
        setShowLivePreview(false);
        if (mobilePanel === 4) {
          setMobilePanel(2);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLivePreview, mobilePanel]);

  // Locate currently selected component anywhere in the tree
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return findItemOrChild(layoutItems, selectedItemId);
  }, [layoutItems, selectedItemId]);

  // Handler for selecting a component from Canvas
  const handleSelectItem = useCallback((id: string | null) => {
    setSelectedItemId(id);
    if (id && typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobilePanel(3);
    }
  }, []);

  // Handler for updating a component's values, styles, or JSON from PropertiesPanel
  const handleUpdateItem = useCallback(
    (updated: CanvasLayoutItem) => {
      setLayoutItemsWithHistory((prev) => {
        // 1. Check if updated item is a root-level component
        const isRoot = prev.some((it) => it.id === updated.id);

        if (isRoot) {
          const updatedConfig = updated.config;
          const rootItem = prev.find((it) => it.id === updated.id)!;

          // Check required rows
          const neededRows = calculateRequiredRootRows(
            { ...rootItem, config: updatedConfig },
            device,
            DEVICE_CONFIGS[device].columns
          );

          // Use updated placement if provided (e.g. from grid span change), otherwise current
          const targetPlacement =
            updated.placement?.[device] ||
            rootItem.placement?.[device] ||
            getDefaultPlacement(rootItem.type, device, 1);
          const currentRows = targetPlacement.rowEnd - targetPlacement.rowStart;
          const finalRows = Math.max(currentRows, neededRows);

          const finalPlacement: GridPlacement = {
            ...targetPlacement,
            rowEnd: targetPlacement.rowStart + finalRows,
          };

          const previewPlacements = calculateLayoutPreview(
            prev,
            rootItem.id,
            finalPlacement,
            device
          );

          return prev.map((item) => {
            const nextPlace =
              previewPlacements[item.id] ||
              item.placement?.[device] ||
              getDefaultPlacement(item.type, device, 1);

            if (item.id === updated.id) {
              return {
                ...item,
                ...updated,
                placement: {
                  ...item.placement,
                  ...updated.placement,
                  [device]: previewPlacements[item.id] || finalPlacement,
                },
                config: updatedConfig,
                children: syncChildrenLayoutItems(updatedConfig),
              };
            }
            return {
              ...item,
              placement: {
                ...item.placement,
                [device]: nextPlace,
              },
            };
          });
        }

        // 2. Updated item is a NESTED CHILD
        const rootItem = findRootItemForNodeId(prev, updated.id);
        if (!rootItem) {
          return updateItemRecursive(prev, updated);
        }

        // Update exact node inside rootItem.config
        const updatedConfig = updateNodeInTree(rootItem.config, updated.config);

        // Check if root container needs more vertical space
        const neededRows = calculateRequiredRootRows(
          { ...rootItem, config: updatedConfig },
          device,
          DEVICE_CONFIGS[device].columns
        );

        const currentPlace =
          rootItem.placement?.[device] ||
          getDefaultPlacement(rootItem.type, device, 1);
        const currentRows = currentPlace.rowEnd - currentPlace.rowStart;
        const finalRows = Math.max(currentRows, neededRows);

        let previewPlacements: Record<string, GridPlacement> = {};
        if (finalRows > currentRows) {
          const expandedPlacement: GridPlacement = {
            ...currentPlace,
            rowEnd: currentPlace.rowStart + finalRows,
          };
          previewPlacements = calculateLayoutPreview(
            prev,
            rootItem.id,
            expandedPlacement,
            device
          );
        }

        return prev.map((item) => {
          const nextPlace =
            previewPlacements[item.id] ||
            item.placement?.[device] ||
            getDefaultPlacement(item.type, device, 1);

          if (item.id === rootItem.id) {
            return {
              ...item,
              placement: {
                ...item.placement,
                [device]: nextPlace,
              },
              config: updatedConfig,
              children: syncChildrenLayoutItems(updatedConfig),
            };
          }
          return {
            ...item,
            placement: {
              ...item.placement,
              [device]: nextPlace,
            },
          };
        });
      });
    },
    [device]
  );

  // Handler for adding a child node to a component
  const handleAddChild = useCallback(
    (targetNodeId: string, childType: string) => {
      setLayoutItems((prev) => {
        const rootItem = findRootItemForNodeId(prev, targetNodeId);
        if (!rootItem) return prev;

        const targetNode =
          rootItem.id === targetNodeId
            ? rootItem.config
            : findNodeInTree(rootItem.config, targetNodeId);
        if (!targetNode) return prev;

        const allowed = getAllowedChildrenForType(targetNode.type);
        if (!allowed.includes(childType)) return prev;

        const newChildNode = ensureNodeIds(
          createDefaultChildNode(childType, activeThemeId),
          `${childType.toLowerCase()}-${Date.now().toString(36)}`
        );

        const updatedConfig =
          rootItem.id === targetNodeId
            ? {
                ...rootItem.config,
                children: [
                  ...(Array.isArray(rootItem.config.children)
                    ? rootItem.config.children
                    : []),
                  newChildNode,
                ],
              }
            : addChildToNodeRecursive(rootItem.config, targetNodeId, newChildNode);

        const neededRows = calculateRequiredRootRows(
          { ...rootItem, config: updatedConfig },
          device,
          DEVICE_CONFIGS[device].columns
        );

        const currentPlace =
          rootItem.placement?.[device] ||
          getDefaultPlacement(rootItem.type, device, 1);
        const currentRows = currentPlace.rowEnd - currentPlace.rowStart;
        const finalRows = Math.max(currentRows, neededRows);

        const expandedPlacement: GridPlacement = {
          ...currentPlace,
          rowEnd: currentPlace.rowStart + finalRows,
        };

        const previewPlacements = calculateLayoutPreview(
          prev,
          rootItem.id,
          expandedPlacement,
          device
        );

        setTimeout(() => {
          if (newChildNode.id) {
            setSelectedItemId(newChildNode.id);
          }
        }, 0);

        return prev.map((item) => {
          const nextPlace =
            previewPlacements[item.id] ||
            item.placement?.[device] ||
            getDefaultPlacement(item.type, device, 1);

          if (item.id === rootItem.id) {
            return {
              ...item,
              placement: {
                ...item.placement,
                [device]: nextPlace,
              },
              config: updatedConfig,
              children: syncChildrenLayoutItems(updatedConfig),
            };
          }
          return {
            ...item,
            placement: {
              ...item.placement,
              [device]: nextPlace,
            },
          };
        });
      });
    },
    [activeThemeId, device]
  );

  // Handler for deleting a component or child node
  const handleDeleteChild = useCallback((targetNodeId: string) => {
    setLayoutItems((prev) => {
      // If root item, remove from canvas
      if (prev.some((it) => it.id === targetNodeId)) {
        setSelectedItemId(null);
        return prev.filter((it) => it.id !== targetNodeId);
      }

      const rootItem = findRootItemForNodeId(prev, targetNodeId);
      if (!rootItem) return prev;

      const updatedConfig = deleteChildFromTree(rootItem.config, targetNodeId);
      const parentNode = findParentNodeInTree(rootItem.config, targetNodeId);
      setSelectedItemId(parentNode?.id || rootItem.id);

      return prev.map((item) => {
        if (item.id === rootItem.id) {
          return {
            ...item,
            config: updatedConfig,
            children: syncChildrenLayoutItems(updatedConfig),
          };
        }
        return item;
      });
    });
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

        {/* Right: Undo / Redo & Play / Live Preview Button */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo Group */}
          <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-zinc-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              title="Undo (Ctrl+Z)"
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-xs disabled:shadow-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2m0 0l-4-4m4 4l4-4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Y)"
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-xs disabled:shadow-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a5 5 0 00-5 5v2m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={handleTogglePreview}
            title={showLivePreview ? "Close Live Preview (Esc)" : "Play Live Preview"}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
              showLivePreview
                ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700 ring-2 ring-emerald-400/40"
                : "bg-zinc-900 text-white shadow-zinc-900/15 hover:bg-zinc-800"
            }`}
          >
            {/* Play Icon */}
            <svg
              className={`w-3.5 h-3.5 fill-current transition-transform duration-200 ${
                showLivePreview ? "scale-110" : ""
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="hidden sm:inline">
              {showLivePreview ? "Close Preview" : "Play Preview"}
            </span>
            <span className="sm:hidden">
              {showLivePreview ? "Close" : "Play"}
            </span>
            {showLivePreview && (
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* 2. Mobile Tab Switcher (< lg screens) */}
      <div className="lg:hidden shrink-0 border-b border-zinc-200 bg-white px-3 py-2">
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-zinc-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobilePanel(1)}
            className={`py-1.5 rounded-md transition text-center ${
              mobilePanel === 1
                ? "bg-white text-zinc-900 shadow-2xs font-bold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            1. Blocks
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel(2)}
            className={`py-1.5 rounded-md transition text-center ${
              mobilePanel === 2
                ? "bg-white text-zinc-900 shadow-2xs font-bold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            2. Canvas
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel(3)}
            className={`py-1.5 rounded-md transition text-center relative ${
              mobilePanel === 3
                ? "bg-white text-zinc-900 shadow-2xs font-bold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span>3. Props</span>
            {selectedItem && (
              <span className="inline-block ml-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setMobilePanel(4);
              setShowLivePreview(true);
            }}
            className={`py-1.5 rounded-md transition text-center flex items-center justify-center gap-1.5 ${
              mobilePanel === 4
                ? "bg-white text-zinc-900 shadow-2xs font-bold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>4. Preview</span>
          </button>
        </div>
      </div>

      {/* 3. Panels Container */}
      <div className="relative flex-1 flex flex-row gap-2.5 p-2.5 sm:p-3 overflow-hidden min-h-0">
        {/* Panel 1: Components (Toolbox) */}
        <div
          className={`h-full ${
            mobilePanel === 1 ? "flex flex-1" : "hidden"
          } lg:flex lg:w-56 xl:w-60 lg:shrink-0`}
        >
          <ToolboxPanel />
        </div>

        {/* Panel 2: Canvas Panel */}
        <div
          className={`h-full ${
            mobilePanel === 2 ? "flex flex-1" : "hidden"
          } lg:flex lg:flex-1 lg:min-w-0`}
        >
          <CanvasPanel
            items={layoutItems}
            onItemsChange={setLayoutItemsWithHistory}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
            device={device}
            onDeviceChange={setDevice}
          />
        </div>

        {/* Panel 3: Properties Panel */}
        <div
          className={`h-full ${
            mobilePanel === 3 ? "flex flex-1" : "hidden"
          } lg:flex lg:w-72 xl:w-80 lg:shrink-0`}
        >
          <PropertiesPanel
            selectedItem={selectedItem}
            onUpdateItem={handleUpdateItem}
            onDeselect={() => setSelectedItemId(null)}
            onSelectItem={handleSelectItem}
            onAddChild={handleAddChild}
            onDeleteChild={handleDeleteChild}
            device={device}
          />
        </div>

        {/* Panel 4: Overlapping Slide-over Live Preview Panel */}
        {(showLivePreview || mobilePanel === 4) && (
          <div
            className={`h-full z-40 ${
              mobilePanel === 4 ? "flex flex-1 lg:hidden" : "hidden"
            } ${
              showLivePreview
                ? "lg:flex lg:absolute lg:top-2.5 sm:lg:top-3 lg:right-2.5 sm:lg:right-3 lg:bottom-2.5 sm:lg:bottom-3 lg:w-[380px] xl:w-[410px] lg:max-w-[calc(100%-1.5rem)] lg:flex-col lg:shadow-2xl lg:rounded-xl lg:overflow-hidden lg:ring-1 lg:ring-black/10 animate-slide-in-right"
                : "lg:hidden"
            }`}
          >
            <PreviewPanel
              layoutItems={layoutItems}
              activeThemeId={activeThemeId}
              onClose={() => {
                setShowLivePreview(false);
                if (mobilePanel === 4) setMobilePanel(2);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
