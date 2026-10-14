"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ALL_RULES } from "@/sdui/validators/rules";
import type { SDUINode } from "@/sdui/types";
import { getActiveDragPayload, setActiveDragPayload } from "../dragState";
import type { DefaultComponentItem } from "@/sdui/themes";

/**
 * ==============================================================================
 * 🎓 Beginner Guide: Panel 2 (Landing Page Canvas)
 * ==============================================================================
 * 
 * 1. WHAT IS THIS PANEL?
 *    This is the visual 100-Column Grid Canvas where you build your landing page.
 *    You can:
 *    - Drag components from Panel 1 (Toolbox) and insert them ANYWHERE
 *      (at the top, in the middle between elements, or at the bottom).
 *    - Drag components directly into containers (e.g. ProductCard inside ProductList,
 *      and Title / Description / PriceBlock / Button inside ProductCard) to any depth!
 *    - Reorder elements by dragging them or clicking ▲ / ▼.
 * 
 * 2. 100-COLUMN RESPONSIVE GRID & AUTOMATIC POSITION CALCULATION:
 *    - Every component has a column span (100%, 50%, 33%, or 25%).
 *    - When an element is added, moved, or resized, `recalculateGridPositions`
 *      automatically calculates `col` (0..99) and `row` (0, 1, 2...).
 *    - If two 50% blocks are adjacent, they share the same row (0..50 and 50..100)!
 *    - If an element exceeds 100 columns, it automatically wraps to the next row.
 * 
 * 3. VALIDATOR GUARD & DEBOUNCING:
 *    - Validates nesting against the official SDUI rulebook (`ALL_RULES`).
 *    - 🟢 GREEN BOX: Valid drop! Shows "✓ Allowed" badge.
 *    - 🔴 RED BOX: Invalid drop (e.g. Header inside Button)! Shows "✕ Blocked" badge.
 *    - DEBOUNCED: Checks are cached via `lastCheckedRef` to maintain smooth 60fps.
 * ==============================================================================
 */

export interface CanvasLayoutItem {
  id: string;
  type: string;
  name: string;
  category: string;
  col: number;      // 0 to 99 start column
  colSpan: number;  // 25, 33, 50, 100
  row: number;      // vertical row index
  x?: number;       // alias for col
  w?: number;       // alias for colSpan
  h?: number;       // height unit
  config: SDUINode;
  children: CanvasLayoutItem[];
}

export interface CanvasPanelProps {
  items: CanvasLayoutItem[];
  onItemsChange: (items: CanvasLayoutItem[]) => void;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
}

/**
 * Default 100-column span for each component type
 */
export function getDefault100ColSpan(type: string): number {
  switch (type) {
    // 100% Full Width Sections
    case "Header":
    case "Footer":
    case "NavBar":
    case "HeroBanner":
    case "Carousel":
    case "StoryRow":
    case "ProductList":
    case "CategoryGrid":
    case "Page":
    case "Home":
      return 100;

    // 50% Half Width Blocks
    case "ProductCard":
    case "Box":
    case "IFrame":
    case "CountDownTimer":
    case "CouponCode":
    case "SearchBar":
      return 50;

    // 33% Third Width Blocks
    case "PriceBlock":
    case "DeliveryInfo":
    case "OfferText":
    case "Title":
    case "Description":
    case "Text":
      return 33;

    // 25% Compact Atoms
    case "Button":
    case "HeaderButton":
    case "Badge":
    case "Rating":
    case "Score":
    case "ReviewCount":
    case "ShareButton":
    case "Sponsored":
    case "Icon":
    case "Image":
    case "StoryCircle":
    case "Label":
    case "CategoryItem":
      return 25;

    default:
      return 100;
  }
}

/**
 * Pure function: Automatically calculates row (0, 1, 2...) and col (0..99)
 * for a list of items on a 100-column grid.
 * If consecutive items fit within 100 columns, they stay on the same row!
 * If an item overflows 100 columns, it moves to the next row.
 */
export function recalculateGridPositions(items: CanvasLayoutItem[]): CanvasLayoutItem[] {
  let currentRow = 0;
  let currentCol = 0;

  return items.map((item) => {
    const span = item.colSpan || 100;

    // If item doesn't fit in the remaining columns of current row, wrap to new row
    if (currentCol + span > 100) {
      currentRow += 1;
      currentCol = 0;
    }

    const itemCol = currentCol;
    const itemRow = currentRow;

    // Advance current column
    currentCol += span;
    if (currentCol >= 100) {
      currentRow += 1;
      currentCol = 0;
    }

    return {
      ...item,
      row: itemRow,
      col: itemCol,
      x: itemCol,
      w: span,
      // Recursively calculate positions for children if any
      children: item.children && item.children.length > 0 ? recalculateGridPositions(item.children) : [],
    };
  });
}

/**
 * Pure function: Checks whether childType is legally allowed inside parentType
 * using the master SDUI rulebook (src/sdui/validators/rules)
 */
export function validateNesting(
  parentType: string,
  childType: string
): { isValid: boolean; message: string } {
  // 1. Root Canvas allows all top-level landing page components
  if (parentType === "root" || parentType === "Canvas" || parentType === "Home") {
    return {
      isValid: true,
      message: `Allowed: '${childType}' can be placed on Canvas root.`,
    };
  }

  // 2. Lookup rule in ALL_RULES
  const rule = ALL_RULES[parentType];
  if (!rule) {
    return {
      isValid: true,
      message: `Allowed: '${childType}' placed into '${parentType}'.`,
    };
  }

  const allowed = rule.allowedComponents;

  // Leaf components with [] cannot have any children
  if (Array.isArray(allowed) && allowed.length === 0) {
    return {
      isValid: false,
      message: `Blocked: '${parentType}' is a leaf component and cannot contain children.`,
    };
  }

  // Wildcard allowed
  if (Array.isArray(allowed) && allowed.includes("*")) {
    return {
      isValid: true,
      message: `Allowed: '${parentType}' accepts all component types.`,
    };
  }

  // Whitelist check
  if (Array.isArray(allowed) && allowed.includes(childType)) {
    return {
      isValid: true,
      message: `Allowed: '${childType}' is a valid child of '${parentType}'.`,
    };
  }

  const allowedList = Array.isArray(allowed) && allowed.length > 0 ? allowed.join(", ") : "None";
  return {
    isValid: false,
    message: `Blocked: '${childType}' cannot be nested inside '${parentType}'. Allowed: [${allowedList}].`,
  };
}

/**
 * Pure function: Inserts an item into the tree at targetParentId and targetIndex.
 */
export function insertItemInTree(
  tree: CanvasLayoutItem[],
  targetParentId: string | null,
  targetIndex: number,
  newItem: CanvasLayoutItem
): CanvasLayoutItem[] {
  if (targetParentId === null) {
    const updated = [...tree];
    const safeIndex = Math.max(0, Math.min(targetIndex, updated.length));
    updated.splice(safeIndex, 0, newItem);
    return recalculateGridPositions(updated);
  }

  const updateRecursive = (list: CanvasLayoutItem[]): CanvasLayoutItem[] => {
    return list.map((item) => {
      if (item.id === targetParentId) {
        const currentChildren = [...(item.children || [])];
        const safeIndex = Math.max(0, Math.min(targetIndex, currentChildren.length));
        currentChildren.splice(safeIndex, 0, newItem);
        return {
          ...item,
          children: recalculateGridPositions(currentChildren),
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateRecursive(item.children),
        };
      }
      return item;
    });
  };

  return recalculateGridPositions(updateRecursive(tree));
}

/**
 * Pure function: Moves an existing item to a new parent and index.
 */
export function moveItemInTree(
  tree: CanvasLayoutItem[],
  itemId: string,
  targetParentId: string | null,
  targetIndex: number
): CanvasLayoutItem[] {
  let extractedItem: CanvasLayoutItem | null = null;

  const removeRecursive = (list: CanvasLayoutItem[]): CanvasLayoutItem[] => {
    const result: CanvasLayoutItem[] = [];
    for (const item of list) {
      if (item.id === itemId) {
        extractedItem = item;
      } else {
        result.push({
          ...item,
          children: item.children ? removeRecursive(item.children) : [],
        });
      }
    }
    return result;
  };

  const treeWithoutItem = removeRecursive(tree);
  if (!extractedItem) return tree;

  return insertItemInTree(treeWithoutItem, targetParentId, targetIndex, extractedItem);
}

/**
 * Pure function: Deletes an item by ID from anywhere in the tree.
 */
export function deleteItemInTree(tree: CanvasLayoutItem[], itemId: string): CanvasLayoutItem[] {
  const deleteRecursive = (list: CanvasLayoutItem[]): CanvasLayoutItem[] => {
    return list
      .filter((item) => item.id !== itemId)
      .map((item) => ({
        ...item,
        children: item.children ? deleteRecursive(item.children) : [],
      }));
  };

  return recalculateGridPositions(deleteRecursive(tree));
}

/**
 * Pure function: Updates an item's width colSpan (25, 33, 50, 100) and recalculates grid rows.
 */
export function updateSpanInTree(
  tree: CanvasLayoutItem[],
  itemId: string,
  newSpan: number
): CanvasLayoutItem[] {
  const updateRecursive = (list: CanvasLayoutItem[]): CanvasLayoutItem[] => {
    return list.map((item) => {
      if (item.id === itemId) {
        return { ...item, colSpan: newSpan, w: newSpan };
      }
      if (item.children && item.children.length > 0) {
        return { ...item, children: updateRecursive(item.children) };
      }
      return item;
    });
  };

  return recalculateGridPositions(updateRecursive(tree));
}

interface DragFeedbackState {
  targetId: string;
  targetName: string;
  draggedType: string;
  isValid: boolean;
  message: string;
  isInsertionSlot?: boolean;
}

export default function CanvasPanel({
  items,
  onItemsChange,
  selectedItemId,
  onSelectItem,
}: CanvasPanelProps) {
  // Visual drag feedback (green or red highlight & banner)
  const [dragFeedback, setDragFeedback] = useState<DragFeedbackState | null>(null);

  // Debounce cache ref to avoid 60+ redundant checks per second on mouse move
  const lastCheckedRef = useRef<{ targetId: string; draggedType: string } | null>(null);

  // ----------------------------------------------------------------------------
  // 1. Quick-Add from Panel 1 (Toolbox '+' button)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    const handleQuickAdd = (e: CustomEvent<DefaultComponentItem>) => {
      const comp = e.detail;
      if (!comp) return;

      const span = getDefault100ColSpan(comp.type);
      const newItem: CanvasLayoutItem = {
        id: `${comp.type.toLowerCase()}-${Date.now()}`,
        type: comp.type,
        name: comp.name,
        category: comp.category,
        col: 0,
        colSpan: span,
        row: items.length,
        x: 0,
        w: span,
        config: comp.config,
        children: [],
      };

      const updated = insertItemInTree(items, null, items.length, newItem);
      onItemsChange(updated);
      onSelectItem(newItem.id);
    };

    window.addEventListener("add-component-to-canvas" as any, handleQuickAdd as any);
    return () => {
      window.removeEventListener("add-component-to-canvas" as any, handleQuickAdd as any);
    };
  }, [items, onItemsChange, onSelectItem]);

  // ----------------------------------------------------------------------------
  // 2. Debounced Drag-Over Validation (Maintains 60fps)
  // ----------------------------------------------------------------------------
  const handleDragOver = useCallback(
    (
      e: React.DragEvent,
      targetId: string,
      parentType: string,
      parentName: string,
      isInsertionSlot: boolean = false
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const activePayload = getActiveDragPayload();
      const draggedType = activePayload?.type || "Component";

      // Debounce: Skip if already checked this exact target and component type
      if (
        lastCheckedRef.current?.targetId === targetId &&
        lastCheckedRef.current?.draggedType === draggedType
      ) {
        return;
      }

      const validation = validateNesting(parentType, draggedType);
      lastCheckedRef.current = { targetId, draggedType };

      setDragFeedback({
        targetId,
        targetName: parentName,
        draggedType,
        isValid: validation.isValid,
        message: isInsertionSlot
          ? `Insert '${draggedType}' at this position`
          : validation.message,
        isInsertionSlot,
      });
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (lastCheckedRef.current?.targetId === targetId) {
      lastCheckedRef.current = null;
      setDragFeedback(null);
    }
  }, []);

  // ----------------------------------------------------------------------------
  // 3. Drop Handler: Inserts at Top, Middle, Bottom, or Nests into Parent
  // ----------------------------------------------------------------------------
  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      targetParentId: string | null = null,
      parentType: string = "root",
      targetIndex: number = -1
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const payload = getActiveDragPayload();
      lastCheckedRef.current = null;
      setDragFeedback(null);

      if (!payload || !payload.type) return;

      // Validate: Reject drop if disallowed by rulebook!
      const validation = validateNesting(parentType, payload.type);
      if (!validation.isValid) {
        return;
      }

      // Case A: Moving an existing canvas component
      if (payload.isExisting && payload.itemId) {
        const updated = moveItemInTree(
          items,
          payload.itemId,
          targetParentId,
          targetIndex === -1 ? 9999 : targetIndex
        );
        onItemsChange(updated);
        onSelectItem(payload.itemId);
        setActiveDragPayload(null);
        return;
      }

      // Case B: Inserting a new component from Toolbox
      const span = getDefault100ColSpan(payload.type);
      const newItem: CanvasLayoutItem = {
        id: `${payload.type.toLowerCase()}-${Date.now()}`,
        type: payload.type,
        name: payload.name || payload.type,
        category: payload.category || "General",
        col: 0,
        colSpan: span,
        row: items.length,
        x: 0,
        w: span,
        config: payload.config || { type: payload.type, data: {} },
        children: [],
      };

      const updated = insertItemInTree(
        items,
        targetParentId,
        targetIndex === -1 ? (targetParentId === null ? items.length : 9999) : targetIndex,
        newItem
      );

      onItemsChange(updated);
      onSelectItem(newItem.id);
      setActiveDragPayload(null);
    },
    [items, onItemsChange, onSelectItem]
  );

  // ----------------------------------------------------------------------------
  // 4. Drag Start for existing canvas items (to allow reordering anywhere)
  // ----------------------------------------------------------------------------
  const handleDragStartExisting = (e: React.DragEvent, item: CanvasLayoutItem) => {
    e.stopPropagation();
    setActiveDragPayload({
      source: "canvas-item",
      id: item.id,
      itemId: item.id,
      isExisting: true,
      type: item.type,
      name: item.name,
      category: item.category,
      config: item.config,
    });
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  // ----------------------------------------------------------------------------
  // 5. Actions: Span toggle, Reorder, Delete, Clear
  // ----------------------------------------------------------------------------
  const handleSetSpan = (itemId: string, newSpan: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onItemsChange(updateSpanInTree(items, itemId, newSpan));
  };

  const handleMove = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onItemsChange(recalculateGridPositions(reordered));
  };

  const handleDelete = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onItemsChange(deleteItemInTree(items, itemId));
    if (selectedItemId === itemId) {
      onSelectItem(null);
    }
  };

  const handleClearCanvas = () => {
    if (items.length === 0) return;
    onItemsChange([]);
    onSelectItem(null);
  };

  // Convert colSpan to Tailwind width class for responsive display
  const getWidthClass = (span: number) => {
    if (span <= 25) return "w-full md:w-[calc(25%-8px)] min-w-[210px] flex-1";
    if (span <= 33) return "w-full md:w-[calc(33.333%-8px)] min-w-[210px] flex-1";
    if (span <= 50) return "w-full md:w-[calc(50%-8px)] min-w-[220px] flex-1";
    return "w-full";
  };

  // ----------------------------------------------------------------------------
  // 6. Recursive Component Card Renderer
  // ----------------------------------------------------------------------------
  const renderItemCard = (
    item: CanvasLayoutItem,
    index: number,
    parentId: string | null = null,
    parentType: string = "root",
    depth: number = 0
  ) => {
    const isSelected = selectedItemId === item.id;
    const isItemTarget = dragFeedback?.targetId === item.id;
    const widthClass = getWidthClass(item.colSpan);

    // Rule inspection: does this component allow children?
    const rule = ALL_RULES[item.type];
    const allowedList = rule?.allowedComponents;
    const canAcceptChildren = Array.isArray(allowedList) && allowedList.length > 0;

    const insertionBeforeId = `insert-before-${item.id}`;
    const isInsertionTarget = dragFeedback?.targetId === insertionBeforeId;

    return (
      <React.Fragment key={item.id}>
        {/* ==================================================================== */}
        {/* Insertion Slot Before Component (Allows dropping anywhere in middle)  */}
        {/* ==================================================================== */}
        <div
          onDragOver={(e) => handleDragOver(e, insertionBeforeId, parentType, item.name, true)}
          onDragLeave={(e) => handleDragLeave(e, insertionBeforeId)}
          onDrop={(e) => handleDrop(e, parentId, parentType, index)}
          className={`w-full transition-all duration-200 flex items-center justify-center my-0.5 ${
            isInsertionTarget
              ? "h-8 bg-emerald-100/80 border-2 border-dashed border-emerald-500 rounded-lg text-emerald-800 text-[11px] font-bold shadow-sm"
              : "h-2 hover:h-4 opacity-0 hover:opacity-100 hover:bg-emerald-50 rounded"
          }`}
        >
          {isInsertionTarget && (
            <span className="flex items-center gap-1">
              <span>➕</span>
              <span>Insert here before {item.name}</span>
            </span>
          )}
        </div>

        {/* ==================================================================== */}
        {/* Component Card                                                       */}
        {/* ==================================================================== */}
        <div
          draggable
          onDragStart={(e) => handleDragStartExisting(e, item)}
          onClick={(e) => {
            e.stopPropagation();
            onSelectItem(item.id);
          }}
          onDragOver={(e) => handleDragOver(e, item.id, item.type, item.name, false)}
          onDragLeave={(e) => handleDragLeave(e, item.id)}
          onDrop={(e) => handleDrop(e, item.id, item.type, -1)}
          className={`${widthClass} relative group rounded-xl border bg-white p-3 transition-all cursor-pointer shadow-2xs ${
            isSelected
              ? "border-zinc-900 ring-2 ring-zinc-900/15 shadow-sm"
              : "border-zinc-200/90 hover:border-zinc-400"
          } ${
            isItemTarget
              ? dragFeedback?.isValid
                ? "border-2 border-emerald-500 bg-emerald-50/70 ring-4 ring-emerald-400/20"
                : "border-2 border-red-500 bg-red-50/70 ring-4 ring-red-400/20"
              : ""
          }`}
        >
          {/* Floating Nesting Drag Feedback Banner */}
          {isItemTarget && dragFeedback && (
            <div
              className={`absolute -top-3 left-3 z-30 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md animate-pop-in ${
                dragFeedback.isValid ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              <span>{dragFeedback.isValid ? "✓" : "✕"}</span>
              <span>{dragFeedback.message}</span>
            </div>
          )}

          {/* Component Header Strip */}
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0 cursor-grab active:cursor-grabbing" title="Drag to reorder">
                🧩
              </span>
              <span className="text-xs font-bold text-zinc-900 truncate">
                {item.name}
              </span>
              <span className="rounded bg-zinc-100 text-zinc-600 text-[9px] font-semibold px-1.5 py-0.2 shrink-0">
                {item.category}
              </span>
              <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-mono px-1 py-0.2 shrink-0 hidden sm:inline">
                R{item.row + 1}:C{item.col}
              </span>
            </div>

            {/* Action Controls: Move Up/Down, Delete */}
            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={(e) => handleMove(index, "up", e)}
                disabled={index === 0}
                title="Move Up"
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer text-[10px]"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={(e) => handleMove(index, "down", e)}
                disabled={index === items.length - 1}
                title="Move Down"
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer text-[10px]"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={(e) => handleDelete(item.id, e)}
                title="Delete component"
                className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer text-xs"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* 100-Column Width Selector Pills (25%, 33%, 50%, 100%) */}
          <div className="flex flex-col gap-1.5 pt-1.5 border-t border-zinc-100 text-[10px]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-zinc-500 font-mono text-[9px] font-medium">
                {item.colSpan} / 100 Cols ({item.colSpan}%)
              </span>
              <div className="flex items-center gap-1">
                {[
                  { label: "25%", span: 25 },
                  { label: "33%", span: 33 },
                  { label: "50%", span: 50 },
                  { label: "100%", span: 100 },
                ].map((w) => (
                  <button
                    key={w.span}
                    type="button"
                    onClick={(e) => handleSetSpan(item.id, w.span, e)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition cursor-pointer ${
                      item.colSpan === w.span
                        ? "bg-zinc-900 text-white shadow-2xs"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Visual 100-Column Grid Allocation Bar */}
            <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, item.colSpan)}%` }}
              />
            </div>
          </div>

          {/* ================================================================== */}
          {/* Recursive Nested Children Area (if component can hold children)     */}
          {/* ================================================================== */}
          {canAcceptChildren && (
            <div className="mt-2.5 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  📦 Inner Components ({item.children?.length || 0}):
                </span>
                <span className="text-[9px] font-mono text-zinc-400 truncate max-w-[140px]">
                  {allowedList?.includes("*") ? "Allows All" : `Allows: ${allowedList?.slice(0, 3).join(", ")}`}
                </span>
              </div>

              {/* Render Nested Children Recursively */}
              <div className="space-y-1.5 pl-2 border-l-2 border-zinc-200">
                {item.children && item.children.length > 0 ? (
                  item.children.map((child, childIdx) =>
                    renderItemCard(child, childIdx, item.id, item.type, depth + 1)
                  )
                ) : (
                  /* Dedicated Dropzone inside empty container */
                  <div
                    onDragOver={(e) => handleDragOver(e, `${item.id}-inner-dropzone`, item.type, item.name, false)}
                    onDragLeave={(e) => handleDragLeave(e, `${item.id}-inner-dropzone`)}
                    onDrop={(e) => handleDrop(e, item.id, item.type, 0)}
                    className={`p-3 rounded-lg border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      dragFeedback?.targetId === `${item.id}-inner-dropzone`
                        ? dragFeedback.isValid
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-red-500 bg-red-50 text-red-800"
                        : "border-zinc-200 bg-zinc-50/70 text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {dragFeedback?.targetId === `${item.id}-inner-dropzone`
                        ? dragFeedback.isValid
                          ? `✓ Drop to place inside ${item.name}`
                          : "✕ Not allowed inside this component"
                        : `📥 Drop child components here`}
                    </span>
                    <span className="text-[9px] font-mono opacity-80">
                      {allowedList?.includes("*") ? "Accepts any component" : `Allowed: [${allowedList?.join(", ")}]`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  const isRootTarget = dragFeedback?.targetId === "canvas-root";
  const isTopSlotTarget = dragFeedback?.targetId === "insert-root-top";
  const isBottomSlotTarget = dragFeedback?.targetId === "insert-root-bottom";

  return (
    <div className="h-full flex flex-col rounded-xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* 1. Canvas Top Header Strip                                           */}
      {/* ==================================================================== */}
      <div className="h-10 shrink-0 px-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-zinc-600 text-xs">📝</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 truncate">
            Landing Page Canvas
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="rounded bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
            100 Cols
          </span>

          <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600">
            {items.length} {items.length === 1 ? "block" : "blocks"}
          </span>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCanvas}
              title="Clear all components from canvas"
              className="text-[10px] text-zinc-400 hover:text-red-600 font-medium px-1.5 py-0.5 rounded hover:bg-red-50 transition cursor-pointer"
            >
              Clear
            </button>
          )}

          <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600">
            Panel 2
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. Drag & Drop Helper Sub-header                                     */}
      {/* ==================================================================== */}
      <div className="px-3 py-1.5 border-b border-zinc-100 bg-zinc-50/40 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Drag components from Panel 1 or click &apos;+&apos;</span>
        <span className="font-mono text-zinc-400">Insert Anywhere • 100-Col Grid</span>
      </div>

      {/* ==================================================================== */}
      {/* 3. The 100-Column Canvas Drop Area                                   */}
      {/* ==================================================================== */}
      <div
        onDragOver={(e) => handleDragOver(e, "canvas-root", "root", "Canvas Root", false)}
        onDragLeave={(e) => handleDragLeave(e, "canvas-root")}
        onDrop={(e) => handleDrop(e, null, "root", -1)}
        onClick={() => onSelectItem(null)}
        className={`flex-1 p-3 overflow-y-auto transition-all relative ${
          isRootTarget
            ? dragFeedback?.isValid
              ? "bg-emerald-50/50 ring-2 ring-emerald-500/40"
              : "bg-red-50/50 ring-2 ring-red-500/40"
            : "bg-zinc-50/30"
        }`}
      >
        {/* Floating Root Drag Feedback Banner */}
        {isRootTarget && dragFeedback && (
          <div
            className={`sticky top-0 z-40 mb-2 py-1 px-3 rounded-lg text-xs font-bold shadow-sm flex items-center justify-between transition-all ${
              dragFeedback.isValid ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            <span>{dragFeedback.isValid ? "✓ Allowed" : "✕ Blocked"}</span>
            <span className="text-[11px] font-normal opacity-90 truncate ml-2">
              {dragFeedback.message}
            </span>
          </div>
        )}

        {/* Empty Canvas Placeholder */}
        {items.length === 0 ? (
          <div
            className={`w-full h-full min-h-[320px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${
              isRootTarget && dragFeedback?.isValid
                ? "border-emerald-500 bg-emerald-50/60"
                : "border-zinc-300 bg-white"
            }`}
          >
            <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3 shadow-2xs">
              <span className="text-xl">➕</span>
            </div>
            <p className="text-xs font-bold text-zinc-800">Landing Page Canvas is Empty</p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[260px] leading-relaxed">
              Drag components from <strong>Panel 1 (Components)</strong> and drop them here to build your landing page.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>100-Column Virtual Grid • Drop Anywhere &amp; Deep Nesting</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* ================================================================ */}
            {/* Top Insertion Zone: Insert at the very beginning of the page     */}
            {/* ================================================================ */}
            <div
              onDragOver={(e) => handleDragOver(e, "insert-root-top", "root", "Top of Page", true)}
              onDragLeave={(e) => handleDragLeave(e, "insert-root-top")}
              onDrop={(e) => handleDrop(e, null, "root", 0)}
              className={`w-full transition-all duration-200 flex items-center justify-center ${
                isTopSlotTarget
                  ? "h-9 bg-emerald-100/90 border-2 border-dashed border-emerald-600 rounded-lg text-emerald-800 text-[11px] font-bold shadow-sm"
                  : "h-2 hover:h-4 opacity-0 hover:opacity-100 hover:bg-emerald-50 rounded"
              }`}
            >
              {isTopSlotTarget && (
                <span className="flex items-center gap-1.5">
                  <span>⬆️</span>
                  <span>Insert at the very top of Landing Page</span>
                </span>
              )}
            </div>

            {/* Placed Components Flow */}
            <div className="flex flex-wrap gap-2.5 items-start">
              {items.map((item, index) => renderItemCard(item, index, null, "root", 0))}
            </div>

            {/* ================================================================ */}
            {/* Bottom Insertion Zone: Insert at the very end of the page        */}
            {/* ================================================================ */}
            <div
              onDragOver={(e) => handleDragOver(e, "insert-root-bottom", "root", "End of Page", true)}
              onDragLeave={(e) => handleDragLeave(e, "insert-root-bottom")}
              onDrop={(e) => handleDrop(e, null, "root", items.length)}
              className={`w-full transition-all duration-200 flex items-center justify-center mt-2 ${
                isBottomSlotTarget
                  ? "h-9 bg-emerald-100/90 border-2 border-dashed border-emerald-600 rounded-lg text-emerald-800 text-[11px] font-bold shadow-sm"
                  : "h-3 hover:h-6 opacity-0 hover:opacity-100 hover:bg-emerald-50 rounded"
              }`}
            >
              {isBottomSlotTarget && (
                <span className="flex items-center gap-1.5">
                  <span>⬇️</span>
                  <span>Insert at the bottom of Landing Page</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
