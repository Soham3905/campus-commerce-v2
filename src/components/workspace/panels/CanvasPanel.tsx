"use client";

import React, { useState, useEffect, useRef } from "react";
import type { DeviceType, GridPlacement, SDUINode } from "@/sdui/types";
import { ComponentMap } from "@/sdui/SDUIRenderer";
import { ALL_RULES } from "@/sdui/validators/rules";
import { getAllDefaultComponents } from "@/sdui/themes";
import { getActiveDragPayload } from "../dragState";
import FloatingToolbar from "./FloatingToolbar";

/**
 * ==============================================================================
 * 🎓 CanvasPanel: Step 4 (Fluid Drag & Resize Engine)
 * ==============================================================================
 * Beginner Guide:
 * - Drag anywhere on a block body to move it across columns and rows.
 * - Drag any of the 8 resize handles to resize the block.
 * - Positions snap smoothly and directly to grid cells in real time.
 * - Each block moves independently without shifting other blocks.
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// 1. Types & Interfaces
// -----------------------------------------------------------------------------

export interface CanvasLayoutItem {
  id: string;
  type: string;
  name: string;
  category: string;
  placement?: Partial<Record<DeviceType, GridPlacement>>;
  zIndex?: number;
  col?: number;
  colSpan?: number;
  row?: number;
  w?: number;
  h?: number;
  x?: number;
  config: SDUINode;
  children?: CanvasLayoutItem[];
}

export interface CanvasPanelProps {
  items: CanvasLayoutItem[];
  onItemsChange: (items: CanvasLayoutItem[]) => void;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  device?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
}

// Active pointer interaction state (for real-time dragging & resizing)
interface ActiveInteraction {
  itemId: string;
  mode: "move" | "resize";
  direction?: string;
  startX: number;
  startY: number;
  origPlacement: GridPlacement;
  currentPlacement: GridPlacement;
}

// -----------------------------------------------------------------------------
// 2. Viewport Configurations
// -----------------------------------------------------------------------------

interface DeviceConfig {
  label: string;
  columns: number;
  icon: string;
  widthPx: number;
}

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  desktop: {
    label: "Desktop",
    columns: 24,
    icon: "🖥️",
    widthPx: 1080,
  },
  tablet: {
    label: "Tablet",
    columns: 12,
    icon: "📱",
    widthPx: 720,
  },
  mobile: {
    label: "Mobile",
    columns: 8,
    icon: "📲",
    widthPx: 375,
  },
};

export const ROW_HEIGHT_PX = 36;
export const GRID_GAP_PX = 8;
export const DEFAULT_ROWS = 18;

// -----------------------------------------------------------------------------
// 3. Helper: Default Grid Placement for Components
// -----------------------------------------------------------------------------

export function getDefaultPlacement(type: string, device: DeviceType, startRow: number = 1): GridPlacement {
  const maxCols = device === "desktop" ? 24 : device === "tablet" ? 12 : 8;

  let colSpan = 10;
  let rowSpan = 2;

  switch (type) {
    case "Title":
      colSpan = Math.min(4, maxCols);
      rowSpan = 1;
      break;
    case "Description":
      colSpan = Math.min(6, maxCols);
      rowSpan = 2;
      break;
    case "Text":
      colSpan = Math.min(4, maxCols);
      rowSpan = 1;
      break;
    case "Button":
      colSpan = Math.min(3, maxCols);
      rowSpan = 1;
      break;
    case "HeaderButton":
      colSpan = Math.min(6, maxCols);
      rowSpan = 1;
      break;
    case "Header":
    case "StoryRow":
    case "Carousel":
    case "ProductList":
    case "ProductGrid":
    case "Footer":
    case "NavBar":
    case "Page":
    case "Home":
      colSpan = maxCols;
      rowSpan =
        type === "Header"
          ? 1
          : type === "StoryRow"
            ? 2
            : type === "Carousel"
              ? 5
              : type === "ProductList"
                ? 13
                : type === "ProductGrid"
                  ? 9
                  : type === "Footer"
                  ? 4
                  : 4;
      break;
    case "CategoryGrid":
      colSpan = maxCols;
      rowSpan = 2;
      break;
    case "Box":
      colSpan = maxCols;
      rowSpan = 3;
      break;
    case "SearchBar":
      colSpan = Math.min(8, maxCols);
      rowSpan = 1;
      break;
    case "CategoryItem":
      colSpan = Math.min(2, maxCols);
      rowSpan = 2;
      break;
    case "HeroBanner":
      colSpan = maxCols;
      rowSpan = 7;
      break;
    case "CouponCode":
      colSpan = Math.min(9, maxCols);
      rowSpan = 2;
      break;
    case "CountDownTimer":
      colSpan = Math.min(8, maxCols);
      rowSpan = 2;
      break;
    case "OfferText":
      colSpan = Math.min(6, maxCols);
      rowSpan = 1;
      break;
    case "Sponsored":
      colSpan = Math.min(3, maxCols);
      rowSpan = 1;
      break;
    case "ProductCard":
      colSpan = Math.min(8, maxCols);
      rowSpan = 11;
      break;
    case "Image":
      colSpan = Math.min(8, maxCols);
      rowSpan = 5;
      break;
    case "StoryCircle":
      colSpan = Math.min(3, maxCols);
      rowSpan = 2;
      break;
    case "Badge":
      colSpan = Math.min(2, maxCols);
      rowSpan = 1;
      break;
    case "Label":
      colSpan = Math.min(4, maxCols);
      rowSpan = 1;
      break;
    case "Icon":
      colSpan = Math.min(1, maxCols);
      rowSpan = 1;
      break;
    case "PriceBlock":
      colSpan = Math.min(7, maxCols);
      rowSpan = 1;
      break;
    case "DeliveryInfo":
      colSpan = Math.min(6, maxCols);
      rowSpan = 1;
      break;
    case "Rating":
      colSpan = Math.min(4, maxCols);
      rowSpan = 1;
      break;
    case "ReviewCount":
      colSpan = Math.min(3, maxCols);
      rowSpan = 1;
      break;
    case "ShareButton":
      colSpan = Math.min(3, maxCols);
      rowSpan = 1;
      break;
    case "Score":
      colSpan = Math.min(2, maxCols);
      rowSpan = 1;
      break;
    case "IFrame":
      colSpan = Math.min(12, maxCols);
      rowSpan = 6;
      break;
    default:
      colSpan = Math.min(8, maxCols);
      rowSpan = 3;
      break;
  }

  return {
    colStart: 1,
    colEnd: 1 + colSpan,
    rowStart: startRow,
    rowEnd: startRow + rowSpan,
  };
}

// -----------------------------------------------------------------------------
// 4. Helpers: Tree ID Assignment, Tree Manipulation & Interactive Rendering
// -----------------------------------------------------------------------------

/**
 * Ensures all nodes in the SDUI tree have a unique, stable string ID.
 */
let nextNodeId = 1;
export function ensureNodeIds(node: SDUINode, prefix = "node"): SDUINode {
  if (!node) return node;
  const nodeId =
    node.id ||
    `${prefix}-${node.type.toLowerCase()}-${Date.now().toString(36)}-${nextNodeId++}`;

  return {
    ...node,
    id: nodeId,
    children: Array.isArray(node.children)
      ? node.children.map((child, idx) => ensureNodeIds(child, `${nodeId}-c${idx}`))
      : undefined,
  };
}

/**
 * Converts nested SDUI node children into CanvasLayoutItem array for tree sync.
 */
export function syncChildrenLayoutItems(node: SDUINode): CanvasLayoutItem[] {
  if (!node.children || node.children.length === 0) return [];
  return node.children.map((child) => ({
    id: child.id || `${child.type.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`,
    type: child.type,
    name: child.type,
    category: ALL_RULES[child.type]?.category || "Component",
    config: child,
    children: syncChildrenLayoutItems(child),
  }));
}

/**
 * Recursively searches an SDUINode tree to find a node by its ID.
 */
export function findNodeInTree(root: SDUINode, id: string): SDUINode | null {
  if (!root) return null;
  if (root.id === id) return root;
  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Finds which root CanvasLayoutItem contains a given node ID in its config tree.
 */
export function findRootItemForNodeId(
  items: CanvasLayoutItem[],
  nodeId: string
): CanvasLayoutItem | null {
  for (const item of items) {
    if (item.id === nodeId || (item.config && findNodeInTree(item.config, nodeId))) {
      return item;
    }
  }
  return null;
}

/**
 * Recursively appends a new child node to a target node in the tree.
 */
export function addChildToNodeRecursive(
  root: SDUINode,
  targetId: string,
  newChild: SDUINode
): SDUINode {
  if (root.id === targetId) {
    const existing = Array.isArray(root.children) ? [...root.children] : [];
    return {
      ...root,
      children: [...existing, newChild],
    };
  }

  if (root.children && root.children.length > 0) {
    return {
      ...root,
      children: root.children.map((child) =>
        addChildToNodeRecursive(child, targetId, newChild)
      ),
    };
  }

  return root;
}

/**
 * Recursively duplicates a child node within its parent's children array.
 */
export function duplicateChildInTree(root: SDUINode, targetId: string): SDUINode {
  if (!root.children || root.children.length === 0) return root;

  const newChildren: SDUINode[] = [];
  for (const child of root.children) {
    newChildren.push(duplicateChildInTree(child, targetId));
    if (child.id === targetId) {
      const cloned = JSON.parse(JSON.stringify(child));
      delete cloned.id;
      const freshClone = ensureNodeIds(cloned, `${child.type.toLowerCase()}-copy`);
      newChildren.push(freshClone);
    }
  }

  return {
    ...root,
    children: newChildren,
  };
}

/**
 * Recursively deletes a child node from the tree.
 */
export function deleteChildFromTree(root: SDUINode, targetId: string): SDUINode {
  if (!root.children || root.children.length === 0) return root;

  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== targetId)
      .map((child) => deleteChildFromTree(child, targetId)),
  };
}

/**
 * Recursively updates a node anywhere inside an SDUINode tree.
 */
export function updateNodeInTree(root: SDUINode, updatedNode: SDUINode): SDUINode {
  if (root.id === updatedNode.id) {
    return {
      ...updatedNode,
      children: updatedNode.children !== undefined ? updatedNode.children : root.children,
    };
  }
  if (!root.children || root.children.length === 0) {
    return root;
  }
  return {
    ...root,
    children: root.children.map((child) => updateNodeInTree(child, updatedNode)),
  };
}

/**
 * Finds the direct parent SDUINode of a target child node.
 */
export function findParentNodeInTree(root: SDUINode, targetId: string): SDUINode | null {
  if (!root.children || root.children.length === 0) return null;
  for (const child of root.children) {
    if (child.id === targetId) return root;
    const found = findParentNodeInTree(child, targetId);
    if (found) return found;
  }
  return null;
}

/**
 * Active pointer interaction state for resizing nested child components
 */
export interface ActiveChildResize {
  childId: string;
  rootItemId: string;
  direction: string;
  startX: number;
  startY: number;
  origWidthPx: number;
  origHeightPx: number;
  currentWidthPx: number;
  currentHeightPx: number;
}

/**
 * Calculates whether a root component needs more vertical rows
 * to accommodate its resized or expanded nested children without overflowing.
 */
export function calculateRequiredRootRows(
  rootItem: CanvasLayoutItem,
  device: DeviceType,
  totalColumns: number,
  overrideChildId?: string,
  overrideWidthPx?: number,
  overrideHeightPx?: number
): number {
  const currentPlace = rootItem.placement?.[device] || getDefaultPlacement(rootItem.type, device, 1);
  const rootColSpan = currentPlace.colEnd - currentPlace.colStart;
  const deviceWidth = DEVICE_CONFIGS[device].widthPx;
  const rootWidthPx = (deviceWidth / totalColumns) * rootColSpan;

  const children = rootItem.config?.children || [];
  if (children.length === 0) return currentPlace.rowEnd - currentPlace.rowStart;

  // Horizontal row containers: CategoryGrid and StoryRow layout children in a single horizontal track.
  // Adding children adds columns horizontally — it does not increase vertical rows.
  if (rootItem.type === "CategoryGrid" || rootItem.type === "StoryRow") {
    const defaultPlace = getDefaultPlacement(rootItem.type, device, 1);
    const minRows = defaultPlace.rowEnd - defaultPlace.rowStart;
    return Math.max(currentPlace.rowEnd - currentPlace.rowStart, minRows);
  }

  // Header container: children (SearchBar and HeaderButton) wrap when exceeding available width.
  // Each wrapped line occupies 1 canvas grid row.
  if (rootItem.type === "Header") {
    let currentLineWidth = 0;
    let lines = 1;
    const gap = 12;

    for (const ch of children) {
      let childWidth = 120; // default for HeaderButton
      if (ch.type === "SearchBar") {
        childWidth = 240; // default for SearchBar
      }
      if (ch.containerStyle?.width) {
        const parsed = parseInt(String(ch.containerStyle.width), 10);
        if (!isNaN(parsed) && parsed > 0) childWidth = parsed;
      } else if (ch.containerStyle?.minWidth) {
        const parsed = parseInt(String(ch.containerStyle.minWidth), 10);
        if (!isNaN(parsed) && parsed > 0) childWidth = parsed;
      }

      if (ch.id === overrideChildId && overrideWidthPx !== undefined) {
        childWidth = overrideWidthPx;
      }

      if (currentLineWidth > 0 && currentLineWidth + childWidth + gap > rootWidthPx) {
        lines++;
        currentLineWidth = childWidth;
      } else {
        currentLineWidth += (currentLineWidth > 0 ? gap : 0) + childWidth;
      }
    }

    const defaultPlace = getDefaultPlacement(rootItem.type, device, 1);
    const minRows = defaultPlace.rowEnd - defaultPlace.rowStart;
    return Math.max(lines, minRows);
  }

  // Footer container: occupies 4 canvas rows by default across all columns
  if (rootItem.type === "Footer") {
    const defaultPlace = getDefaultPlacement(rootItem.type, device, 1);
    const minRows = defaultPlace.rowEnd - defaultPlace.rowStart;
    return Math.max(currentPlace.rowEnd - currentPlace.rowStart, minRows);
  }

  // Carousel container: horizontally layered slides occupy 5 canvas rows by default across all columns
  if (rootItem.type === "Carousel") {
    const defaultPlace = getDefaultPlacement(rootItem.type, device, 1);
    const minRows = defaultPlace.rowEnd - defaultPlace.rowStart;
    return Math.max(currentPlace.rowEnd - currentPlace.rowStart, minRows);
  }

  if (rootItem.type === "ProductList") {
    let maxCardHeight = 524;

    for (const ch of children) {
      let cardHeight = 524;

      if (ch.containerStyle?.height) {
        const parsed = parseInt(String(ch.containerStyle.height), 10);
        if (!isNaN(parsed) && parsed > 0) cardHeight = parsed;
      }

      if (ch.id === overrideChildId && overrideHeightPx !== undefined) {
        cardHeight = overrideHeightPx;
      }

      if (cardHeight > maxCardHeight) maxCardHeight = cardHeight;
    }

    // ProductList is a single horizontal scroll track (does not wrap vertically)
    const totalNeededPx = maxCardHeight + 20;
    const neededRows = Math.ceil((totalNeededPx + GRID_GAP_PX) / (ROW_HEIGHT_PX + GRID_GAP_PX));
    return Math.max(currentPlace.rowEnd - currentPlace.rowStart, neededRows);
  }

  // ProductCard container: dynamically calculates vertical rows based on its actual children
  if (rootItem.type === "ProductCard") {
    let totalHeightPx = 28; // padding top (14px) + padding bottom (14px)
    for (const ch of children) {
      let h = 24;
      if (ch.type === "Image") h = 160;
      else if (ch.type === "Description") h = 36;
      else if (ch.type === "Button") h = 38;
      else if (ch.type === "ShareButton") h = 36; // stacked below Button
      else if (ch.type === "PriceBlock") h = 24;
      else if (ch.type === "Rating") h = 20;
      else if (ch.type === "Badge" || ch.type === "Label" || ch.type === "Sponsored") h = 18;
      else if (ch.type === "Title") h = 16;
      else if (ch.type === "OfferText" || ch.type === "DeliveryInfo") h = 16;

      if (ch.containerStyle?.height) {
        const parsed = parseInt(String(ch.containerStyle.height), 10);
        if (!isNaN(parsed) && parsed > 0) h = parsed;
      }
      if (ch.id === overrideChildId && overrideHeightPx !== undefined) {
        h = overrideHeightPx;
      }
      if (h > 0) {
        totalHeightPx += h + 6;
      }
    }
    const neededRows = Math.ceil((totalHeightPx + GRID_GAP_PX) / (ROW_HEIGHT_PX + GRID_GAP_PX));
    return Math.max(neededRows, 6);
  }

  // Generic container height check (e.g. Box, HeroBanner)
  const isRowLayout =
    rootItem.config?.containerStyle?.flexDirection === "row" ||
    rootItem.config?.containerStyle?.overflowX === "auto";

  let contentHeightPx = 0;
  if (isRowLayout) {
    let maxChildHeight = 0;
    for (const ch of children) {
      let h = 80;
      if (ch.containerStyle?.height) {
        const parsed = parseInt(String(ch.containerStyle.height), 10);
        if (!isNaN(parsed)) h = parsed;
      }
      if (ch.id === overrideChildId && overrideHeightPx !== undefined) {
        h = overrideHeightPx;
      }
      if (h > maxChildHeight) maxChildHeight = h;
    }
    contentHeightPx = maxChildHeight;
  } else {
    // Column or grid layout: stack children heights
    for (const ch of children) {
      let h = 60;
      if (ch.containerStyle?.height) {
        const parsed = parseInt(String(ch.containerStyle.height), 10);
        if (!isNaN(parsed)) h = parsed;
      }
      if (ch.id === overrideChildId && overrideHeightPx !== undefined) {
        h = overrideHeightPx;
      }
      contentHeightPx += h + 8;
    }
  }

  if (contentHeightPx > 0) {
    const totalNeededPx = contentHeightPx + 40;
    const neededRows = Math.ceil((totalNeededPx + GRID_GAP_PX) / (ROW_HEIGHT_PX + GRID_GAP_PX));
    return Math.max(currentPlace.rowEnd - currentPlace.rowStart, neededRows);
  }

  return currentPlace.rowEnd - currentPlace.rowStart;
}

/**
 * 8 Resize Handles rendered around a selected nested child component.
 */
interface ChildResizeHandlesProps {
  onStartResize: (e: React.PointerEvent, direction: string) => void;
}

function ChildResizeHandles({ onStartResize }: ChildResizeHandlesProps) {
  return (
    <>
      {/* 4 Corner Handles */}
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "nw")}
        title="Resize Top-Left"
        className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform"
      />
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "ne")}
        title="Resize Top-Right"
        className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform"
      />
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "sw")}
        title="Resize Bottom-Left"
        className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform"
      />
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "se")}
        title="Resize Bottom-Right"
        className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform"
      />

      {/* 4 Edge Handles */}
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "n")}
        title="Resize Top"
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ns-resize z-40 hover:scale-110 transition-transform"
      />
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "s")}
        title="Resize Bottom"
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2.5 w-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ns-resize z-40 hover:scale-110 transition-transform"
      />
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "w")}
        title="Resize Left"
        className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ew-resize z-40 hover:scale-110 transition-transform"
      />
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onPointerDown={(e) => onStartResize(e, "e")}
        title="Resize Right"
        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ew-resize z-40 hover:scale-110 transition-transform"
      />
    </>
  );
}

/**
 * Floating mini action bar for a selected nested child component.
 */
/**
 * Recursive SDUI Component Renderer with Interactive Child Selection & Resizing.
 */
interface RenderInteractiveNodeProps {
  node: SDUINode;
  rootItemId: string;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onAddChild: (targetNodeId: string, childType: string) => void;
  onDuplicateChild: (targetNodeId: string) => void;
  onDeleteChild: (targetNodeId: string) => void;
  onStartChildResize: (
    e: React.PointerEvent,
    node: SDUINode,
    rootItemId: string,
    direction: string
  ) => void;
  childResize: ActiveChildResize | null;
  isRoot?: boolean;
  items: CanvasLayoutItem[];
  device: DeviceType;
  onMoveItem?: (id: string, direction: "up" | "down" | "left" | "right") => void;
}

function RenderInteractiveNode({
  node,
  rootItemId,
  selectedItemId,
  onSelectItem,
  onAddChild,
  onDuplicateChild,
  onDeleteChild,
  onStartChildResize,
  childResize,
  isRoot = false,
  items,
  device,
  onMoveItem,
}: RenderInteractiveNodeProps): React.ReactNode {
  if (!node) return null;

  const RendererComponent = ComponentMap[node.type];
  if (!RendererComponent) {
    return (
      <div className="p-2 text-xs text-zinc-500 bg-zinc-50 rounded border border-zinc-200">
        {node.type}
      </div>
    );
  }

  // Render children recursively through RenderInteractiveNode
  const renderedChildren =
    node.children && node.children.length > 0
      ? node.children.map((child, idx) => (
        <RenderInteractiveNode
          key={child.id || idx}
          node={child}
          rootItemId={rootItemId}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
          onAddChild={onAddChild}
          onDuplicateChild={onDuplicateChild}
          onDeleteChild={onDeleteChild}
          onStartChildResize={onStartChildResize}
          childResize={childResize}
          isRoot={false}
          items={items}
          device={device}
          onMoveItem={onMoveItem}
        />
      ))
      : null;

  // Check if this specific node is currently being resized live
  const isThisResizing = childResize !== null && childResize.childId === node.id;
  const liveWidth = isThisResizing && childResize ? `${Math.round(childResize.currentWidthPx)}px` : undefined;
  const liveHeight = isThisResizing && childResize ? `${Math.round(childResize.currentHeightPx)}px` : undefined;

  // Effective container style: if live resizing, override width/height
  const effectiveContainerStyle = {
    ...node.containerStyle,
    ...(liveWidth ? { width: liveWidth } : {}),
    ...(liveHeight ? { height: liveHeight } : {}),
  };

  // The actual visual component
  const content = (
    <RendererComponent
      data={node.data || {}}
      style={{ width: "100%", height: "100%", ...effectiveContainerStyle }}
      actions={node.actions}
    >
      {renderedChildren}
    </RendererComponent>
  );

  // If this is the root node of the canvas block, return content directly
  // (Root selection is handled by the canvas block bounding box)
  if (isRoot) {
    return content;
  }

  // Nested Child: Wrap in interactive selection container
  const isSelected = selectedItemId === node.id;
  const allowedChildren = getAllowedChildrenForType(node.type);
  const canMove = isSelected && node.id ? getCanMoveDirections(items, node.id, device) : { canUp: false, canDown: false, canLeft: false, canRight: false };

  // Wrapper dimensions for nested child
  const wrapperStyle: React.CSSProperties = {
    ...(isRoot ? { width: "100%", height: "100%" } : {}),
    ...(node.containerStyle?.flex ? { flex: node.containerStyle.flex } : {}),
    ...(node.containerStyle?.flexGrow !== undefined ? { flexGrow: node.containerStyle.flexGrow } : {}),
    ...(node.containerStyle?.flexShrink !== undefined ? { flexShrink: node.containerStyle.flexShrink } : {}),
    ...(node.containerStyle?.minWidth ? { minWidth: node.containerStyle.minWidth } : {}),
    ...(node.containerStyle?.maxWidth ? { maxWidth: node.containerStyle.maxWidth } : {}),
    ...(node.containerStyle?.width ? { width: effectiveContainerStyle.width } : {}),
    ...(node.containerStyle?.height ? { height: effectiveContainerStyle.height } : {}),
    ...(liveWidth ? { width: liveWidth } : {}),
    ...(liveHeight ? { height: liveHeight } : {}),
  };

  return (
    <div
      data-node-id={node.id}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (node.id) onSelectItem(node.id);
      }}
      onPointerDown={(e) => {
        // Prevent pointer down from initiating root block move
        e.stopPropagation();
      }}
      style={wrapperStyle}
      className={`relative transition-all duration-150 ${isRoot ? "w-full h-full min-h-0" : ""} ${isSelected
          ? "ring-2 ring-blue-500 rounded-sm z-30 shadow-xs"
          : "hover:outline hover:outline-blue-400 hover:outline-dashed hover:outline-1 rounded-sm cursor-pointer"
        }`}
    >
      {/* Floating live dimension tooltip while resizing */}
      {isThisResizing && childResize && (
        <div className="absolute -top-7 left-0 z-50 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold shadow-md pointer-events-none whitespace-nowrap">
          {Math.round(childResize.currentWidthPx)}px × {Math.round(childResize.currentHeightPx)}px
        </div>
      )}

      {/* Floating Action Bar (Squarespace-style FloatingToolbar) */}
      {isSelected && !isThisResizing && (
        <FloatingToolbar
          title={node.type}
          type={node.type}
          isRoot={false}
          canMoveUp={canMove.canUp}
          canMoveDown={canMove.canDown}
          canMoveLeft={canMove.canLeft}
          canMoveRight={canMove.canRight}
          allowedChildren={allowedChildren}
          positionBelow={true}
          onMove={(dir) => onMoveItem && node.id && onMoveItem(node.id, dir)}
          onAddChild={(type) => onAddChild(node.id!, type)}
          onDuplicate={() => onDuplicateChild(node.id!)}
          onDelete={() => onDeleteChild(node.id!)}
        />
      )}

      {/* 8 Resize Handles around selected nested child */}
      {isSelected && (
        <ChildResizeHandles
          onStartResize={(e, dir) => onStartChildResize(e, node, rootItemId, dir)}
        />
      )}

      {content}
      {node.type === "IFrame" && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (node.id) onSelectItem(node.id);
          }}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 5. Helper Functions: Fluid Drag, Resize & Smart Grid Placement
// -----------------------------------------------------------------------------

/**
 * Checks whether two rectangular grid placements overlap each other.
 */
export function doPlacementsOverlap(a: GridPlacement, b: GridPlacement): boolean {
  return (
    a.colStart < b.colEnd &&
    a.colEnd > b.colStart &&
    a.rowStart < b.rowEnd &&
    a.rowEnd > b.rowStart
  );
}

/**
 * Finds all components in the layout that overlap with a proposed placement.
 */
export function findOverlappingComponents(
  items: CanvasLayoutItem[],
  targetPlacement: GridPlacement,
  excludeId: string,
  device: DeviceType
): CanvasLayoutItem[] {
  return items.filter((item) => {
    if (item.id === excludeId) return false;
    const place = item.placement?.[device] || getDefaultPlacement(item.type, device, 1);
    return doPlacementsOverlap(targetPlacement, place);
  });
}

/**
 * Calculates a live non-overlapping layout preview.
 * When a component is placed or moved, any overlapping components automatically
 * shift downwards to make space, preserving their horizontal alignment and dimensions.
 */
export function calculateLayoutPreview(
  items: CanvasLayoutItem[],
  activeItemId: string,
  proposedPlacement: GridPlacement,
  device: DeviceType
): Record<string, GridPlacement> {
  // 1. Initialize placements for all existing items + active item
  const placements: Record<string, GridPlacement> = {};
  for (const it of items) {
    placements[it.id] = {
      ...(it.placement?.[device] || getDefaultPlacement(it.type, device, 1)),
    };
  }
  placements[activeItemId] = { ...proposedPlacement };

  // 2. Cascade push downwards to resolve any overlaps
  let hasCollision = true;
  let passCount = 0;
  const maxPasses = (items.length + 2) * 3;

  while (hasCollision && passCount < maxPasses) {
    hasCollision = false;
    passCount++;

    for (const itemA of items) {
      const placeA = placements[itemA.id];
      if (!placeA) continue;

      // Check collision against active item (active item stays fixed, existing moves below)
      if (itemA.id !== activeItemId && placements[activeItemId]) {
        const placeActive = placements[activeItemId];
        if (doPlacementsOverlap(placeActive, placeA)) {
          hasCollision = true;
          const rowSpan = placeA.rowEnd - placeA.rowStart;
          const newRowStart = placeActive.rowEnd;
          placements[itemA.id] = {
            ...placeA,
            rowStart: newRowStart,
            rowEnd: newRowStart + rowSpan,
          };
        }
      }

      // Check collision between other items (the one lower down shifts below the upper one)
      for (const itemB of items) {
        if (itemA.id === itemB.id) continue;
        const currentPlaceA = placements[itemA.id];
        const currentPlaceB = placements[itemB.id];
        if (!currentPlaceA || !currentPlaceB) continue;

        if (doPlacementsOverlap(currentPlaceA, currentPlaceB)) {
          hasCollision = true;
          if (currentPlaceA.rowStart >= currentPlaceB.rowStart) {
            const rowSpanA = currentPlaceA.rowEnd - currentPlaceA.rowStart;
            const newRowStart = currentPlaceB.rowEnd;
            placements[itemA.id] = {
              ...currentPlaceA,
              rowStart: newRowStart,
              rowEnd: newRowStart + rowSpanA,
            };
          } else {
            const rowSpanB = currentPlaceB.rowEnd - currentPlaceB.rowStart;
            const newRowStart = currentPlaceA.rowEnd;
            placements[itemB.id] = {
              ...currentPlaceB,
              rowStart: newRowStart,
              rowEnd: newRowStart + rowSpanB,
            };
          }
        }
      }
    }
  }

  return placements;
}

/**
 * Determines which directional movements (Up, Down, Left, Right) are valid
 * for a selected component (root block or nested child).
 */
export function getCanMoveDirections(
  items: CanvasLayoutItem[],
  targetId: string,
  device: DeviceType
): { canUp: boolean; canDown: boolean; canLeft: boolean; canRight: boolean } {
  // 1. Check if target is a root-level item
  const rootItem = items.find((it) => it.id === targetId);
  if (rootItem) {
    const maxCols = DEVICE_CONFIGS[device].columns;
    const placement =
      rootItem.placement?.[device] ||
      getDefaultPlacement(rootItem.type, device, 1);

    return {
      canLeft: placement.colStart > 1,
      canRight: placement.colEnd <= maxCols,
      canUp: placement.rowStart > 1,
      canDown: true,
    };
  }

  // 2. Check if target is a nested child
  const parentRoot = findRootItemForNodeId(items, targetId);
  if (parentRoot) {
    const parentNode = findParentNodeInTree(parentRoot.config, targetId);
    if (parentNode && Array.isArray(parentNode.children)) {
      const idx = parentNode.children.findIndex((c) => c.id === targetId);
      if (idx !== -1) {
        return {
          canLeft: idx > 0,
          canUp: idx > 0,
          canRight: idx < parentNode.children.length - 1,
          canDown: idx < parentNode.children.length - 1,
        };
      }
    }
  }

  return { canUp: false, canDown: false, canLeft: false, canRight: false };
}

/**
 * Executes a directional movement (Up, Down, Left, Right) for a component.
 * - For root items: updates grid placement and cascades collisions via calculateLayoutPreview.
 * - For nested children: reorders the child among siblings in its parent node.
 */
export function moveComponentDirection(
  items: CanvasLayoutItem[],
  targetId: string,
  direction: "up" | "down" | "left" | "right",
  device: DeviceType
): CanvasLayoutItem[] {
  // ---------------------------------------------------------------------------
  // Case A: Root-Level Block Movement
  // ---------------------------------------------------------------------------
  const rootIndex = items.findIndex((it) => it.id === targetId);
  if (rootIndex !== -1) {
    const rootItem = items[rootIndex];
    const maxCols = DEVICE_CONFIGS[device].columns;
    const currentPlace =
      rootItem.placement?.[device] ||
      getDefaultPlacement(rootItem.type, device, 1);
    const colSpan = currentPlace.colEnd - currentPlace.colStart;
    const rowSpan = currentPlace.rowEnd - currentPlace.rowStart;

    let proposedPlacement: GridPlacement = { ...currentPlace };

    if (direction === "left") {
      if (currentPlace.colStart <= 1) return items;
      const newColStart = Math.max(1, currentPlace.colStart - 1);
      proposedPlacement = {
        ...currentPlace,
        colStart: newColStart,
        colEnd: newColStart + colSpan,
      };
    } else if (direction === "right") {
      if (currentPlace.colEnd > maxCols) return items;
      const newColEnd = Math.min(maxCols + 1, currentPlace.colEnd + 1);
      proposedPlacement = {
        ...currentPlace,
        colStart: newColEnd - colSpan,
        colEnd: newColEnd,
      };
    } else if (direction === "up") {
      if (currentPlace.rowStart <= 1) return items;
      // Find root items located above this one
      const itemsAbove = items.filter(
        (it) =>
          it.id !== targetId &&
          (it.placement?.[device]?.rowEnd ?? 0) <= currentPlace.rowStart
      );

      if (itemsAbove.length > 0) {
        // Swap vertical slot with closest item above
        const closestAbove = [...itemsAbove].sort(
          (a, b) =>
            (b.placement?.[device]?.rowEnd ?? 0) -
            (a.placement?.[device]?.rowEnd ?? 0)
        )[0];
        const abovePlacement =
          closestAbove.placement?.[device] ||
          getDefaultPlacement(closestAbove.type, device, 1);
        proposedPlacement = {
          ...currentPlace,
          rowStart: abovePlacement.rowStart,
          rowEnd: abovePlacement.rowStart + rowSpan,
        };
      } else {
        const newRowStart = Math.max(1, currentPlace.rowStart - 1);
        proposedPlacement = {
          ...currentPlace,
          rowStart: newRowStart,
          rowEnd: newRowStart + rowSpan,
        };
      }
    } else if (direction === "down") {
      // Find root items located below this one
      const itemsBelow = items.filter(
        (it) =>
          it.id !== targetId &&
          (it.placement?.[device]?.rowStart ?? 0) >= currentPlace.rowEnd
      );

      if (itemsBelow.length > 0) {
        const closestBelow = [...itemsBelow].sort(
          (a, b) =>
            (a.placement?.[device]?.rowStart ?? 0) -
            (b.placement?.[device]?.rowStart ?? 0)
        )[0];
        const belowPlacement =
          closestBelow.placement?.[device] ||
          getDefaultPlacement(closestBelow.type, device, 1);
        proposedPlacement = {
          ...currentPlace,
          rowStart: belowPlacement.rowEnd,
          rowEnd: belowPlacement.rowEnd + rowSpan,
        };
      } else {
        proposedPlacement = {
          ...currentPlace,
          rowStart: currentPlace.rowStart + 1,
          rowEnd: currentPlace.rowEnd + 1,
        };
      }
    }

    // Run collision cascading engine
    const previewPlacements = calculateLayoutPreview(
      items,
      rootItem.id,
      proposedPlacement,
      device
    );

    return items.map((it) => {
      const nextPlace =
        previewPlacements[it.id] ||
        it.placement?.[device] ||
        getDefaultPlacement(it.type, device, 1);
      return {
        ...it,
        placement: {
          ...it.placement,
          [device]: nextPlace,
        },
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Case B: Nested Child Component Reordering
  // ---------------------------------------------------------------------------
  const parentRoot = findRootItemForNodeId(items, targetId);
  if (!parentRoot) return items;

  const parentNode = findParentNodeInTree(parentRoot.config, targetId);
  if (!parentNode || !Array.isArray(parentNode.children)) return items;

  const siblings = [...parentNode.children];
  const idx = siblings.findIndex((c) => c.id === targetId);
  if (idx === -1) return items;

  if (direction === "up" || direction === "left") {
    if (idx === 0) return items;
    const temp = siblings[idx];
    siblings[idx] = siblings[idx - 1];
    siblings[idx - 1] = temp;
  } else if (direction === "down" || direction === "right") {
    if (idx === siblings.length - 1) return items;
    const temp = siblings[idx];
    siblings[idx] = siblings[idx + 1];
    siblings[idx + 1] = temp;
  }

  const updatedParent = {
    ...parentNode,
    children: siblings,
  };

  const updatedRootConfig = updateNodeInTree(parentRoot.config, updatedParent);

  return items.map((it) => {
    if (it.id === parentRoot.id) {
      return {
        ...it,
        config: updatedRootConfig,
        children: syncChildrenLayoutItems(updatedRootConfig),
      };
    }
    return it;
  });
}


/**
 * Automatically recalculates and reflows the layout for a target responsive breakpoint.
 * - Clamps widths and positions to the target device's column count (Desktop: 24, Tablet: 12, Mobile: 8).
 * - Accommodates nested children heights.
 * - Detects and resolves component collisions/overlaps by cascading them downward.
 * - Preserves visual reading order (top-to-bottom, left-to-right).
 * - Does NOT overwrite other device layouts (only updates item.placement[targetDevice]).
 */
export function recalculateLayoutForBreakpoint(
  items: CanvasLayoutItem[],
  targetDevice: DeviceType
): CanvasLayoutItem[] {
  if (!items || items.length === 0) return items;

  const maxCols = DEVICE_CONFIGS[targetDevice].columns;
  const placements: Record<string, GridPlacement> = {};

  // 1. Sort items according to their natural visual reading order
  // (primarily by desktop rowStart, secondarily by desktop colStart)
  const sortedItems = [...items].sort((a, b) => {
    const placeA = a.placement?.[targetDevice] || a.placement?.desktop;
    const placeB = b.placement?.[targetDevice] || b.placement?.desktop;
    const rowA = placeA?.rowStart ?? 1;
    const rowB = placeB?.rowStart ?? 1;
    if (rowA !== rowB) return rowA - rowB;
    const colA = a.placement?.desktop?.colStart ?? placeA?.colStart ?? 1;
    const colB = b.placement?.desktop?.colStart ?? placeB?.colStart ?? 1;
    return colA - colB;
  });

  // 2. Load initial placement for each item on targetDevice & clamp boundaries
  for (const item of sortedItems) {
    const desktopPlace = item.placement?.desktop;
    const existingPlace = item.placement?.[targetDevice];
    const rawPlace = existingPlace || desktopPlace || getDefaultPlacement(item.type, targetDevice, 1);

    // Calculate valid colSpan for target breakpoint
    let colSpan = Math.max(1, rawPlace.colEnd - rawPlace.colStart);
    if (colSpan > maxCols) {
      colSpan = maxCols;
    }

    // Preserve horizontal placement within the available grid columns
    const desiredColStart = existingPlace?.colStart ?? desktopPlace?.colStart ?? rawPlace.colStart;
    const colStart = Math.max(1, Math.min(maxCols - colSpan + 1, desiredColStart));
    const colEnd = colStart + colSpan;

    // Calculate rowSpan ensuring nested children fit
    const neededRows = calculateRequiredRootRows(item, targetDevice, maxCols);
    const rawRowSpan = Math.max(1, rawPlace.rowEnd - rawPlace.rowStart);
    const rowSpan = Math.max(rawRowSpan, neededRows);

    const rowStart = Math.max(1, rawPlace.rowStart);
    const rowEnd = rowStart + rowSpan;

    placements[item.id] = { colStart, colEnd, rowStart, rowEnd };
  }

  // 3. Cascade push downwards to resolve any overlaps
  let hasCollision = true;
  let passCount = 0;
  const maxPasses = (sortedItems.length + 2) * 4;

  while (hasCollision && passCount < maxPasses) {
    hasCollision = false;
    passCount++;

    for (let i = 0; i < sortedItems.length; i++) {
      const itemA = sortedItems[i];
      const placeA = placements[itemA.id];
      if (!placeA) continue;

      for (let j = i + 1; j < sortedItems.length; j++) {
        const itemB = sortedItems[j];
        const placeB = placements[itemB.id];
        if (!placeB) continue;

        if (doPlacementsOverlap(placeA, placeB)) {
          hasCollision = true;

          // Determine which item should shift below based on reading order
          const shiftBBelowA =
            placeB.rowStart > placeA.rowStart ||
            (placeB.rowStart === placeA.rowStart && placeB.colStart >= placeA.colStart);

          if (shiftBBelowA) {
            const rowSpanB = placeB.rowEnd - placeB.rowStart;
            const newRowStart = placeA.rowEnd;
            placements[itemB.id] = {
              ...placeB,
              rowStart: newRowStart,
              rowEnd: newRowStart + rowSpanB,
            };
          } else {
            const rowSpanA = placeA.rowEnd - placeA.rowStart;
            const newRowStart = placeB.rowEnd;
            placements[itemA.id] = {
              ...placeA,
              rowStart: newRowStart,
              rowEnd: newRowStart + rowSpanA,
            };
          }
        }
      }
    }
  }

  // 4. Return items preserving original array order, updating ONLY the targetDevice placement
  return items.map((item) => ({
    ...item,
    placement: {
      ...item.placement,
      [targetDevice]:
        placements[item.id] ||
        item.placement?.[targetDevice] ||
        getDefaultPlacement(item.type, targetDevice, 1),
    },
  }));
}

/**
 * Calculates new grid placement when dragging a block across columns & rows.
 * Clamps coordinates so the block stays within the canvas boundaries.
 */
function calculateMovedPlacement(
  orig: GridPlacement,
  deltaCols: number,
  deltaRows: number,
  maxCols: number,
  maxRows: number
): GridPlacement {
  const colSpan = orig.colEnd - orig.colStart;
  const rowSpan = orig.rowEnd - orig.rowStart;

  // Move by delta, and clamp inside grid limits (1 to maxCols, 1 to maxRows)
  const colStart = Math.max(1, Math.min(maxCols - colSpan + 1, orig.colStart + deltaCols));
  const rowStart = Math.max(1, Math.min(maxRows - rowSpan + 1, orig.rowStart + deltaRows));

  return {
    colStart,
    colEnd: colStart + colSpan,
    rowStart,
    rowEnd: rowStart + rowSpan,
  };
}

/**
 * Calculates new grid placement when dragging any of the 8 resize handles.
 * Clamps coordinates so block size never goes below 1x1 or outside canvas limits.
 */
function calculateResizedPlacement(
  orig: GridPlacement,
  direction: string,
  deltaCols: number,
  deltaRows: number,
  maxCols: number,
  maxRows: number
): GridPlacement {
  let { colStart, colEnd, rowStart, rowEnd } = orig;

  // Dragging right handle (East): change colEnd
  if (direction.includes("e")) {
    colEnd = Math.max(colStart + 1, Math.min(maxCols + 1, orig.colEnd + deltaCols));
  }
  // Dragging left handle (West): change colStart
  if (direction.includes("w")) {
    colStart = Math.max(1, Math.min(orig.colEnd - 1, orig.colStart + deltaCols));
  }
  // Dragging bottom handle (South): change rowEnd
  if (direction.includes("s")) {
    rowEnd = Math.max(rowStart + 1, Math.min(maxRows + 1, orig.rowEnd + deltaRows));
  }
  // Dragging top handle (North): change rowStart
  if (direction.includes("n")) {
    rowStart = Math.max(1, Math.min(orig.rowEnd - 1, orig.rowStart + deltaRows));
  }

  return { colStart, colEnd, rowStart, rowEnd };
}

/**
 * Reads allowed children from the validator rule for a given component type.
 * Returns an array of allowed component type names, or [] if it cannot have children.
 */
export function getAllowedChildrenForType(type: string): string[] {
  const rule = ALL_RULES[type];
  if (!rule) return [];

  const allowed = rule.allowedChildren || rule.allowedComponents;
  if (!Array.isArray(allowed) || allowed.length === 0) return [];

  // Wildcard "*" means any component can be added (except Page/Home containers)
  if (allowed.includes("*")) {
    return Object.keys(ALL_RULES).filter(
      (t) => t !== "Home" && t !== "Page" && t !== type
    );
  }

  return allowed;
}

/**
 * Creates a default child SDUINode with proper initial data and styling.
 */
export function createDefaultChildNode(
  childType: string,
  themeId: string = "theme1",
  parentType?: string
): SDUINode {
  const defaults = getAllDefaultComponents(themeId);
  const found = defaults.find((c) => c.type === childType);
  let baseNode: SDUINode =
    found && found.config
      ? JSON.parse(JSON.stringify(found.config))
      : { type: childType, data: {} };

  // When adding a ProductCard into a ProductList horizontal track,
  // enforce uniform card width and height matching theme1's product list cards
  if (childType === "ProductCard" && (parentType === "ProductList" || !parentType)) {
    baseNode = {
      ...baseNode,
      containerStyle: {
        ...(baseNode.containerStyle || {}),
        flex: "0 0 auto",
        width: "clamp(236px, 74vw, 268px)",
        height: "524px",
        minHeight: "524px",
        maxHeight: "524px",
        alignSelf: "stretch",
      },
    };
  }

  return baseNode;
}

// -----------------------------------------------------------------------------
// 6. Sub-Component: Selection Bounding Box & 8 Resize Handles
// -----------------------------------------------------------------------------

interface SelectionBoundingBoxProps {
  item: CanvasLayoutItem;
  device: DeviceType;
  items: CanvasLayoutItem[];
  isResizing?: boolean;
  onDelete: (id: string, e?: React.MouseEvent) => void;
  onDuplicate: (id: string, e?: React.MouseEvent) => void;
  onStartResize: (e: React.PointerEvent, direction: string) => void;
  onAddChild: (parentId: string, childType: string) => void;
  onMove: (id: string, direction: "up" | "down" | "left" | "right") => void;
}

function SelectionBoundingBox({
  item,
  device,
  items,
  isResizing = false,
  onDelete,
  onDuplicate,
  onStartResize,
  onAddChild,
  onMove,
}: SelectionBoundingBoxProps) {
  const allowedChildren = getAllowedChildrenForType(item.type);
  const currentPlacement =
    item.placement?.[device] ||
    getDefaultPlacement(item.type, device, 1);
  const positionBelow = currentPlacement.rowStart <= 3;
  const canMove = getCanMoveDirections(items, item.id, device);

  return (
    <>
      {/* 1. Floating Action Bar (Squarespace-style FloatingToolbar) */}
      {!isResizing && (
        <FloatingToolbar
          title={item.name}
          type={item.type}
          isRoot={true}
          canMoveUp={canMove.canUp}
          canMoveDown={canMove.canDown}
          canMoveLeft={canMove.canLeft}
          canMoveRight={canMove.canRight}
          allowedChildren={allowedChildren}
          positionBelow={positionBelow}
          onMove={(dir) => onMove(item.id, dir)}
          onAddChild={(childType) => onAddChild(item.id, childType)}
          onDuplicate={() => onDuplicate(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      )}

      {/* 2. Four Corner Handles */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "nw")}
        title="Resize Top-Left"
        className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-sm shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "ne")}
        title="Resize Top-Right"
        className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-sm shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "sw")}
        title="Resize Bottom-Left"
        className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-sm shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "se")}
        title="Resize Bottom-Right"
        className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-blue-600 rounded-sm shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform"
      />

      {/* 3. Four Edge Handles */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "n")}
        title="Resize Top"
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ns-resize z-40 hover:scale-110 transition-transform"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "s")}
        title="Resize Bottom"
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2.5 w-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ns-resize z-40 hover:scale-110 transition-transform"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "w")}
        title="Resize Left"
        className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ew-resize z-40 hover:scale-110 transition-transform"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onPointerDown={(e) => onStartResize(e, "e")}
        title="Resize Right"
        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-4 bg-white border-2 border-blue-600 rounded-xs shadow-xs cursor-ew-resize z-40 hover:scale-110 transition-transform"
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// 7. Main Component: CanvasPanel
// -----------------------------------------------------------------------------

export default function CanvasPanel({
  items,
  onItemsChange,
  selectedItemId,
  onSelectItem,
  device: externalDevice,
  onDeviceChange,
}: CanvasPanelProps) {
  const [internalDevice, setInternalDevice] = useState<DeviceType>("desktop");
  const device = externalDevice ?? internalDevice;
  const setDevice = (nextDev: DeviceType) => {
    setInternalDevice(nextDev);
    onDeviceChange?.(nextDev);
  };
  const [gridEnabled, setGridEnabled] = useState<boolean>(true);
  const [rowCount, setRowCount] = useState<number>(DEFAULT_ROWS);

  // Active Drag or Resize interaction state
  const interactionRef = useRef<ActiveInteraction | null>(null);
  const [interaction, setInteraction] = useState<ActiveInteraction | null>(null);

  // Active Child Resize interaction state
  const childResizeRef = useRef<ActiveChildResize | null>(null);
  const [childResize, setChildResize] = useState<ActiveChildResize | null>(null);

  // Live layout preview placements for all items while dragging
  const [layoutPreview, setLayoutPreview] = useState<Record<string, GridPlacement> | null>(null);
  const layoutPreviewRef = useRef<Record<string, GridPlacement> | null>(null);

  // Ghost preview block when dragging a new component from the toolbox
  const [toolboxDragPreview, setToolboxDragPreview] = useState<{
    type: string;
    name: string;
    placement: GridPlacement;
  } | null>(null);

  // Feature 2: Contextual Grid Visibility
  // Show grid lines ONLY when actively dragging or resizing
  const isDragging = interaction?.mode === "move" || toolboxDragPreview !== null;
  const isResizing = interaction?.mode === "resize" || childResize !== null;
  const showGrid = gridEnabled && (isDragging || isResizing);

  // Feature 1: Automatically recalculate layout when switching responsive breakpoints
  const prevDeviceRef = useRef<DeviceType>(device);

  const handleSwitchDevice = (nextDev: DeviceType) => {
    prevDeviceRef.current = nextDev;
    setDevice(nextDev);

    const reflowed = recalculateLayoutForBreakpoint(itemsRef.current, nextDev);
    const maxRow = Math.max(
      ...reflowed.map((it) => it.placement?.[nextDev]?.rowEnd || 1),
      DEFAULT_ROWS
    );
    if (maxRow > rowCount) {
      setRowCount(maxRow + 2);
    }
    onItemsChange(reflowed);
  };

  // If device is changed externally (e.g. from parent FourPanelWorkspace), automatically reflow
  useEffect(() => {
    if (prevDeviceRef.current !== device) {
      prevDeviceRef.current = device;
      const reflowed = recalculateLayoutForBreakpoint(itemsRef.current, device);
      const maxRow = Math.max(
        ...reflowed.map((it) => it.placement?.[device]?.rowEnd || 1),
        DEFAULT_ROWS
      );
      if (maxRow > rowCount) {
        setRowCount(maxRow + 2);
      }
      onItemsChange(reflowed);
    }
  }, [device, rowCount, onItemsChange]);

  // Prevents canvas background click from deselecting immediately after dragging or resizing
  const hasDraggedRef = useRef<boolean>(false);

  // Keep a ref to items so event listeners always access the freshest array
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Ensure all existing items and their nested nodes have unique IDs on mount
  useEffect(() => {
    let hasMissingIds = false;
    const sanitized = items.map((it) => {
      if (!it.config.id) {
        hasMissingIds = true;
      }
      const updatedConfig = ensureNodeIds(it.config, it.id);
      return {
        ...it,
        config: updatedConfig,
        children: syncChildrenLayoutItems(updatedConfig),
      };
    });
    if (hasMissingIds) {
      onItemsChange(sanitized);
    }
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const currentConfig = DEVICE_CONFIGS[device];
  const totalColumns = currentConfig.columns;

  // ---------------------------------------------------------------------------
  // Action Handlers: Delete, Duplicate, Layering
  // ---------------------------------------------------------------------------

  const handleDeleteItem = (id: string, e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    onItemsChange(itemsRef.current.filter((it) => it.id !== id));
    if (selectedItemId === id) {
      onSelectItem(null);
    }
  };

  const handleDuplicateItem = (id: string, e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    const target = itemsRef.current.find((it) => it.id === id);
    if (!target) return;

    const currentPlace =
      target.placement?.[device] ||
      getDefaultPlacement(target.type, device, 1);
    const rowSpan = currentPlace.rowEnd - currentPlace.rowStart;
    const newRowStart = currentPlace.rowEnd + 1;
    const newRowEnd = newRowStart + rowSpan;

    const duplicatedItem: CanvasLayoutItem = {
      ...target,
      id: `${target.type.toLowerCase()}-${Date.now()}`,
      placement: {
        ...target.placement,
        [device]: {
          ...currentPlace,
          rowStart: newRowStart,
          rowEnd: newRowEnd,
        },
      },
      zIndex: (target.zIndex ?? 1) + 1,
    };

    onItemsChange([...itemsRef.current, duplicatedItem]);
    onSelectItem(duplicatedItem.id);
  };

  const handleLayerChange = (id: string, delta: number, e?: React.MouseEvent) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    onItemsChange(
      itemsRef.current.map((it) => {
        if (it.id === id) {
          const nextZ = Math.max(1, (it.zIndex ?? 1) + delta);
          return { ...it, zIndex: nextZ };
        }
        return it;
      })
    );
  };

  const handleMoveItem = (
    id: string,
    direction: "up" | "down" | "left" | "right"
  ) => {
    const updated = moveComponentDirection(itemsRef.current, id, direction, device);
    onItemsChange(updated);
  };

  // ---------------------------------------------------------------------------
  // Task 2: Nested Child Actions (Add, Duplicate, Delete) with Dynamic Grid Updates
  // ---------------------------------------------------------------------------

  const handleAddChildToNode = (targetNodeId: string, childType: string) => {
    const rootItem = findRootItemForNodeId(itemsRef.current, targetNodeId);
    if (!rootItem) return;

    // Find the target node in tree (could be rootItem.config or a nested child)
    const targetNode =
      rootItem.id === targetNodeId
        ? rootItem.config
        : findNodeInTree(rootItem.config, targetNodeId);
    if (!targetNode) return;

    // Verify childType is allowed by validator rules
    const allowed = getAllowedChildrenForType(targetNode.type);
    if (!allowed.includes(childType)) return;

    // Create new child node
    const newChildNode = ensureNodeIds(
      createDefaultChildNode(childType, "theme1", targetNode.type),
      `${childType.toLowerCase()}-${Date.now().toString(36)}`
    );

    // Insert child into tree
    const updatedConfig =
      rootItem.id === targetNodeId
        ? {
          ...rootItem.config,
          children: [...(Array.isArray(rootItem.config.children) ? rootItem.config.children : []), newChildNode],
        }
        : addChildToNodeRecursive(rootItem.config, targetNodeId, newChildNode);

    // Calculate required root rows for newly added content
    const currentPlace =
      rootItem.placement?.[device] ||
      getDefaultPlacement(rootItem.type, device, 1);

    const neededRows = calculateRequiredRootRows(
      { ...rootItem, config: updatedConfig },
      device,
      totalColumns
    );
    const currentRows = currentPlace.rowEnd - currentPlace.rowStart;
    const finalRows = Math.max(currentRows, neededRows);

    const expandedPlacement: GridPlacement = {
      ...currentPlace,
      rowEnd: currentPlace.rowStart + finalRows,
    };

    // Cascade push downstream components to avoid overlaps
    const previewPlacements = calculateLayoutPreview(
      itemsRef.current,
      rootItem.id,
      expandedPlacement,
      device
    );

    // Auto-expand canvas rows if needed
    const maxRowEnd = Math.max(
      ...Object.values(previewPlacements).map((p) => p.rowEnd),
      DEFAULT_ROWS
    );
    if (maxRowEnd > rowCount) {
      setRowCount(maxRowEnd + 2);
    }

    // Update items state with non-overlapping placements and updated config
    const updatedItems = itemsRef.current.map((item) => {
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

    onItemsChange(updatedItems);
    if (newChildNode.id) {
      onSelectItem(newChildNode.id);
    }
  };

  const handleDuplicateChildInNode = (targetNodeId: string) => {
    const rootItem = findRootItemForNodeId(itemsRef.current, targetNodeId);
    if (!rootItem) return;

    // Duplicate child in tree
    const updatedConfig = duplicateChildInTree(rootItem.config, targetNodeId);

    // Calculate required root rows
    const currentPlace =
      rootItem.placement?.[device] ||
      getDefaultPlacement(rootItem.type, device, 1);

    const neededRows = calculateRequiredRootRows(
      { ...rootItem, config: updatedConfig },
      device,
      totalColumns
    );
    const currentRows = currentPlace.rowEnd - currentPlace.rowStart;
    const finalRows = Math.max(currentRows, neededRows);

    const expandedPlacement: GridPlacement = {
      ...currentPlace,
      rowEnd: currentPlace.rowStart + finalRows,
    };

    const previewPlacements = calculateLayoutPreview(
      itemsRef.current,
      rootItem.id,
      expandedPlacement,
      device
    );

    const maxRowEnd = Math.max(
      ...Object.values(previewPlacements).map((p) => p.rowEnd),
      DEFAULT_ROWS
    );
    if (maxRowEnd > rowCount) {
      setRowCount(maxRowEnd + 2);
    }

    const updatedItems = itemsRef.current.map((item) => {
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

    onItemsChange(updatedItems);
  };

  const handleDeleteChildInNode = (targetNodeId: string) => {
    const rootItem = findRootItemForNodeId(itemsRef.current, targetNodeId);
    if (!rootItem) return;

    // Remove child from tree
    const updatedConfig = deleteChildFromTree(rootItem.config, targetNodeId);

    const updatedItems = itemsRef.current.map((item) => {
      if (item.id === rootItem.id) {
        return {
          ...item,
          config: updatedConfig,
          children: syncChildrenLayoutItems(updatedConfig),
        };
      }
      return item;
    });

    onItemsChange(updatedItems);
    onSelectItem(rootItem.id);
  };

  // Add child to root item
  const handleAddChild = (parentId: string, childType: string) => {
    handleAddChildToNode(parentId, childType);
  };

  // ---------------------------------------------------------------------------
  // Step 4: Fluid Drag & Move Engine (Drag anywhere on block body)
  // ---------------------------------------------------------------------------

  const handleStartMove = (e: React.PointerEvent, item: CanvasLayoutItem) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onSelectItem(item.id);

    const currentPlace =
      item.placement?.[device] ||
      getDefaultPlacement(item.type, device, 1);

    const newInteraction: ActiveInteraction = {
      itemId: item.id,
      mode: "move",
      startX: e.clientX,
      startY: e.clientY,
      origPlacement: currentPlace,
      currentPlacement: currentPlace,
    };

    interactionRef.current = newInteraction;
    setInteraction(newInteraction);
  };

  // ---------------------------------------------------------------------------
  // Step 4: Fluid Resize Engine (Drag any of the 8 handles)
  // ---------------------------------------------------------------------------

  const handleStartResize = (e: React.PointerEvent, item: CanvasLayoutItem, direction: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const currentPlace =
      item.placement?.[device] ||
      getDefaultPlacement(item.type, device, 1);

    const newInteraction: ActiveInteraction = {
      itemId: item.id,
      mode: "resize",
      direction,
      startX: e.clientX,
      startY: e.clientY,
      origPlacement: currentPlace,
      currentPlacement: currentPlace,
    };

    interactionRef.current = newInteraction;
    setInteraction(newInteraction);
  };

  // ---------------------------------------------------------------------------
  // Step 5: Fluid Nested Child Resize Engine (Drag any of the 8 child handles)
  // ---------------------------------------------------------------------------

  const handleStartChildResize = (
    e: React.PointerEvent,
    node: SDUINode,
    rootItemId: string,
    direction: string
  ) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    // Identify the target element to get initial rendered dimensions
    const targetEl = (e.currentTarget as HTMLElement).closest("[data-node-id]") as HTMLElement | null;
    const rect = targetEl ? targetEl.getBoundingClientRect() : null;

    let origWidth = rect?.width || 280;
    let origHeight = rect?.height || 200;

    if (node.containerStyle?.width && typeof node.containerStyle.width === "string") {
      const p = parseInt(node.containerStyle.width, 10);
      if (!isNaN(p) && p > 0) origWidth = p;
    }
    if (node.containerStyle?.height && typeof node.containerStyle.height === "string") {
      const p = parseInt(node.containerStyle.height, 10);
      if (!isNaN(p) && p > 0) origHeight = p;
    }

    const newChildResize: ActiveChildResize = {
      childId: node.id!,
      rootItemId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      origWidthPx: origWidth,
      origHeightPx: origHeight,
      currentWidthPx: origWidth,
      currentHeightPx: origHeight,
    };

    childResizeRef.current = newChildResize;
    setChildResize(newChildResize);
  };

  // ---------------------------------------------------------------------------
  // Global PointerMove & PointerUp Effect (Real-time Grid & Child Snapping)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!interaction && !childResize) return;

    const handlePointerMove = (e: PointerEvent) => {
      // 1. Handle live nested child resizing
      if (childResizeRef.current) {
        const active = childResizeRef.current;
        const deltaX = e.clientX - active.startX;
        const deltaY = e.clientY - active.startY;

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasDraggedRef.current = true;
        }

        let nextWidth = active.origWidthPx;
        let nextHeight = active.origHeightPx;

        if (active.direction.includes("e")) {
          nextWidth = Math.max(60, active.origWidthPx + deltaX);
        } else if (active.direction.includes("w")) {
          nextWidth = Math.max(60, active.origWidthPx - deltaX);
        }

        if (active.direction.includes("s")) {
          nextHeight = Math.max(30, active.origHeightPx + deltaY);
        } else if (active.direction.includes("n")) {
          nextHeight = Math.max(30, active.origHeightPx - deltaY);
        }

        active.currentWidthPx = nextWidth;
        active.currentHeightPx = nextHeight;
        setChildResize({ ...active });

        // Calculate if root item needs to expand its rows on the canvas grid
        const rootItem = itemsRef.current.find((it) => it.id === active.rootItemId);
        if (rootItem) {
          const currentPlace = rootItem.placement?.[device] || getDefaultPlacement(rootItem.type, device, 1);
          const neededRowSpan = calculateRequiredRootRows(
            rootItem,
            device,
            totalColumns,
            active.childId,
            nextWidth,
            nextHeight
          );

          const currentRowSpan = currentPlace.rowEnd - currentPlace.rowStart;
          if (neededRowSpan > currentRowSpan) {
            const expandedPlacement: GridPlacement = {
              ...currentPlace,
              rowEnd: currentPlace.rowStart + neededRowSpan,
            };

            const preview = calculateLayoutPreview(
              itemsRef.current,
              rootItem.id,
              expandedPlacement,
              device
            );
            setLayoutPreview(preview);
            layoutPreviewRef.current = preview;

            const maxNeededRow = Math.max(
              ...Object.values(preview).map((p) => p.rowEnd),
              DEFAULT_ROWS
            );
            if (maxNeededRow > rowCount) {
              setRowCount(maxNeededRow + 2);
            }
          } else {
            setLayoutPreview(null);
            layoutPreviewRef.current = null;
          }
        }
        return;
      }

      // 2. Handle root component move or resize
      const active = interactionRef.current;
      if (!active || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const cellWidth = (rect.width - (totalColumns - 1) * GRID_GAP_PX) / totalColumns;
      const stepX = cellWidth + GRID_GAP_PX;
      const stepY = ROW_HEIGHT_PX + GRID_GAP_PX;

      const deltaX = e.clientX - active.startX;
      const deltaY = e.clientY - active.startY;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        hasDraggedRef.current = true;
      }

      const deltaCols = Math.round(deltaX / stepX);
      const deltaRows = Math.round(deltaY / stepY);

      let nextPlacement = active.origPlacement;

      if (active.mode === "move") {
        nextPlacement = calculateMovedPlacement(
          active.origPlacement,
          deltaCols,
          deltaRows,
          totalColumns,
          rowCount
        );

        // Smart Grid Placement: Calculate live layout preview resolving any overlaps
        const preview = calculateLayoutPreview(
          itemsRef.current,
          active.itemId,
          nextPlacement,
          device
        );
        setLayoutPreview(preview);
        layoutPreviewRef.current = preview;
      } else if (active.mode === "resize" && active.direction) {
        nextPlacement = calculateResizedPlacement(
          active.origPlacement,
          active.direction,
          deltaCols,
          deltaRows,
          totalColumns,
          rowCount
        );
      }

      // Synchronously update the ref so pointerup always has the latest coordinates
      active.currentPlacement = nextPlacement;
      // Update state for real-time UI rendering
      setInteraction({ ...active });
    };

    const handlePointerUp = () => {
      // 1. If child resize was active:
      if (childResizeRef.current) {
        const active = childResizeRef.current;
        const targetChildId = active.childId;
        const rootItemId = active.rootItemId;
        const rootItem = itemsRef.current.find((it) => it.id === rootItemId);

        if (rootItem) {
          const previewMap = layoutPreviewRef.current;

          // Update the child's containerStyle in the tree
          const updateStyleInTree = (node: SDUINode): SDUINode => {
            if (node.id === targetChildId) {
              const nextStyle: Record<string, any> = { ...(node.containerStyle || {}) };
              if (active.direction.includes("e") || active.direction.includes("w")) {
                nextStyle.width = `${Math.round(active.currentWidthPx)}px`;
              }
              if (active.direction.includes("s") || active.direction.includes("n")) {
                nextStyle.height = `${Math.round(active.currentHeightPx)}px`;
              }
              return {
                ...node,
                containerStyle: nextStyle,
              };
            }
            if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: node.children.map(updateStyleInTree),
              };
            }
            return node;
          };

          const updatedConfig = updateStyleInTree(rootItem.config);

          if (previewMap) {
            let maxRowNeeded = rowCount;
            Object.values(previewMap).forEach((p) => {
              if (p.rowEnd > maxRowNeeded) maxRowNeeded = p.rowEnd;
            });
            if (maxRowNeeded > rowCount) {
              setRowCount(maxRowNeeded + 2);
            }
          }

          onItemsChange(
            itemsRef.current.map((item) => {
              const nextPlacement =
                previewMap?.[item.id] ||
                item.placement?.[device] ||
                getDefaultPlacement(item.type, device, 1);

              if (item.id === rootItemId) {
                return {
                  ...item,
                  placement: {
                    ...item.placement,
                    [device]: nextPlacement,
                  },
                  config: updatedConfig,
                  children: syncChildrenLayoutItems(updatedConfig),
                };
              }

              return {
                ...item,
                placement: {
                  ...item.placement,
                  [device]: nextPlacement,
                },
              };
            })
          );
        }

        setChildResize(null);
        childResizeRef.current = null;
        setLayoutPreview(null);
        layoutPreviewRef.current = null;

        if (hasDraggedRef.current) {
          setTimeout(() => {
            hasDraggedRef.current = false;
          }, 80);
        }
        return;
      }

      // 2. Root interaction:
      const active = interactionRef.current;
      if (!active) return;

      const targetId = active.itemId;
      const previewMap = layoutPreviewRef.current;

      if (previewMap && active.mode === "move") {
        // Auto-expand section rowCount if items were pushed past current bottom
        let maxRowNeeded = rowCount;
        Object.values(previewMap).forEach((p) => {
          if (p.rowEnd > maxRowNeeded) maxRowNeeded = p.rowEnd;
        });
        if (maxRowNeeded > rowCount) {
          setRowCount(maxRowNeeded + 2);
        }

        // Commit all resolved preview coordinates
        onItemsChange(
          itemsRef.current.map((it) => ({
            ...it,
            placement: {
              ...it.placement,
              [device]: previewMap[it.id] || it.placement?.[device] || getDefaultPlacement(it.type, device, 1),
            },
          }))
        );
      } else {
        // Commit resize coordinates
        const finalPlacement = active.currentPlacement;
        onItemsChange(
          itemsRef.current.map((it) =>
            it.id === targetId
              ? {
                ...it,
                placement: {
                  ...it.placement,
                  [device]: finalPlacement,
                },
              }
              : it
          )
        );
      }

      setLayoutPreview(null);
      layoutPreviewRef.current = null;
      interactionRef.current = null;
      setInteraction(null);

      // Keep hasDragged true briefly so the mouseup click event doesn't deselect the block
      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 80);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [interaction, childResize, totalColumns, rowCount, device, onItemsChange]);

  // Cancel resize or move on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (childResizeRef.current) {
          setChildResize(null);
          childResizeRef.current = null;
          setLayoutPreview(null);
          layoutPreviewRef.current = null;
        }
        if (interactionRef.current) {
          setInteraction(null);
          interactionRef.current = null;
          setLayoutPreview(null);
          layoutPreviewRef.current = null;
        }
        setToolboxDragPreview(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ---------------------------------------------------------------------------
  // Quick Add & Drop from ToolboxPanel
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleQuickAdd = (e: CustomEvent<any>) => {
      const comp = e.detail;
      if (!comp) return;

      const nextRow = itemsRef.current.reduce((max, it) => {
        const p = it.placement?.[device];
        return Math.max(max, p?.rowEnd || 1);
      }, 1);

      const newItem: CanvasLayoutItem = {
        id: `${comp.type.toLowerCase()}-${Date.now()}`,
        type: comp.type,
        name: comp.name,
        category: comp.category,
        config: comp.config,
        placement: {
          desktop: getDefaultPlacement(comp.type, "desktop", nextRow),
          tablet: getDefaultPlacement(comp.type, "tablet", nextRow),
          mobile: getDefaultPlacement(comp.type, "mobile", nextRow),
        },
        zIndex: 1,
      };

      onItemsChange([...itemsRef.current, newItem]);
      onSelectItem(newItem.id);
    };

    window.addEventListener("add-component-to-canvas" as any, handleQuickAdd);
    return () => {
      window.removeEventListener("add-component-to-canvas" as any, handleQuickAdd);
    };
  }, [device, onItemsChange, onSelectItem]);

  // ---------------------------------------------------------------------------
  // Task 1: Smart Drag Over with Live Non-Overlapping Layout Preview
  // ---------------------------------------------------------------------------

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    let payload = getActiveDragPayload();
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData("application/json");
        if (raw) payload = JSON.parse(raw);
      } catch { }
    }

    if (!payload || !payload.type || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const cellWidth = (rect.width - (totalColumns - 1) * GRID_GAP_PX) / totalColumns;
    const cellHeight = ROW_HEIGHT_PX + GRID_GAP_PX;

    const dropCol = Math.max(1, Math.min(totalColumns, Math.floor(relX / (cellWidth + GRID_GAP_PX)) + 1));
    const dropRow = Math.max(1, Math.min(rowCount, Math.floor(relY / cellHeight) + 1));

    const defaultPlace = getDefaultPlacement(payload.type, device, dropRow);
    const colSpan = defaultPlace.colEnd - defaultPlace.colStart;
    const rowSpan = defaultPlace.rowEnd - defaultPlace.rowStart;
    const safeColEnd = Math.min(totalColumns + 1, dropCol + colSpan);
    const safeColStart = Math.max(1, safeColEnd - colSpan);

    const proposedPlacement: GridPlacement = {
      colStart: safeColStart,
      colEnd: safeColEnd,
      rowStart: dropRow,
      rowEnd: dropRow + rowSpan,
    };

    // Calculate smart collision layout preview
    const preview = calculateLayoutPreview(
      itemsRef.current,
      "__new_drag_item__",
      proposedPlacement,
      device
    );

    setLayoutPreview(preview);
    layoutPreviewRef.current = preview;

    setToolboxDragPreview({
      type: payload.type,
      name: payload.name || payload.type,
      placement: proposedPlacement,
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // If dragging leaves the canvas area, cancel preview and restore original layout
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setLayoutPreview(null);
      layoutPreviewRef.current = null;
      setToolboxDragPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    let payload = getActiveDragPayload();

    if (!payload) {
      try {
        const raw = e.dataTransfer.getData("application/json");
        if (raw) payload = JSON.parse(raw);
      } catch { }
    }

    if (!payload || !payload.type) {
      setLayoutPreview(null);
      layoutPreviewRef.current = null;
      setToolboxDragPreview(null);
      return;
    }

    const proposed = toolboxDragPreview?.placement || getDefaultPlacement(payload.type, device, 1);
    const finalPlacements = layoutPreviewRef.current || {};

    // 1. Shift existing items to their non-overlapping preview positions
    const updatedExistingItems = itemsRef.current.map((it) => ({
      ...it,
      placement: {
        ...it.placement,
        [device]: finalPlacements[it.id] || it.placement?.[device] || getDefaultPlacement(it.type, device, 1),
      },
    }));

    // 2. Create the newly placed item with IDs on all nested nodes
    const rawConfig = payload.config || { type: payload.type, data: {} };
    const configWithIds = ensureNodeIds(rawConfig, `${payload.type.toLowerCase()}-${Date.now()}`);

    const newItem: CanvasLayoutItem = {
      id: configWithIds.id || `${payload.type.toLowerCase()}-${Date.now()}`,
      type: payload.type,
      name: payload.name || payload.type,
      category: payload.category || "General",
      config: configWithIds,
      children: syncChildrenLayoutItems(configWithIds),
      placement: {
        desktop: getDefaultPlacement(payload.type, "desktop", proposed.rowStart),
        tablet: getDefaultPlacement(payload.type, "tablet", proposed.rowStart),
        mobile: getDefaultPlacement(payload.type, "mobile", proposed.rowStart),
        [device]: proposed,
      },
      zIndex: 1,
    };

    // Auto expand rowCount if pushed down past section
    let maxRowNeeded = rowCount;
    Object.values(finalPlacements).forEach((p) => {
      if (p.rowEnd > maxRowNeeded) maxRowNeeded = p.rowEnd;
    });
    if (proposed.rowEnd > maxRowNeeded) maxRowNeeded = proposed.rowEnd;
    if (maxRowNeeded > rowCount) {
      setRowCount(maxRowNeeded + 2);
    }

    onItemsChange([...updatedExistingItems, newItem]);
    onSelectItem(newItem.id);

    // Reset preview states
    setLayoutPreview(null);
    layoutPreviewRef.current = null;
    setToolboxDragPreview(null);
  };

  const handleAddRows = () => {
    setRowCount((prev) => Math.min(prev + 4, 60));
  };

  const handleRemoveRows = () => {
    setRowCount((prev) => Math.max(prev - 4, 10));
  };

  const handleClear = () => {
    if (itemsRef.current.length === 0) return;
    if (confirm("Clear all components from the canvas?")) {
      onItemsChange([]);
      onSelectItem(null);
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col rounded-xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* Top Toolbar: Viewport & Grid Controls                                */}
      {/* ==================================================================== */}
      <div className="h-11 shrink-0 px-3 border-b border-zinc-200/80 bg-zinc-50/70 flex items-center justify-between gap-2">
        {/* Left: Title */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-600 text-xs">🎨</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
            Canvas
          </h2>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center bg-zinc-200/70 p-0.5 rounded-lg text-xs">
          {(["desktop", "tablet", "mobile"] as DeviceType[]).map((dev) => {
            const conf = DEVICE_CONFIGS[dev];
            const isActive = device === dev;
            return (
              <button
                key={dev}
                type="button"
                onClick={() => handleSwitchDevice(dev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${isActive
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                  }`}
              >
                <span>{conf.icon}</span>
                <span className="hidden sm:inline">{conf.label}</span>
                <span className="text-[10px] opacity-70">({conf.columns})</span>
              </button>
            );
          })}
        </div>

        {/* Right: Grid Toggle & Clear */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setGridEnabled((v) => !v)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer border ${gridEnabled
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            title={gridEnabled ? "Grid appears during drag & resize interactions" : "Grid overlay disabled"}
          >
            <span>▦ Grid: {gridEnabled ? "On" : "Off"}</span>
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 rounded-md text-[11px] font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* Canvas Workspace Area                                                */}
      {/* ==================================================================== */}
      <div
        className="flex-1 overflow-auto bg-[#eef1f6] p-4 sm:p-8 flex flex-col items-center"
        onClick={() => {
          if (hasDraggedRef.current) return;
          onSelectItem(null);
        }}
      >
        {/* The Website Page Section Sheet */}
        <div
          style={{
            width: `${currentConfig.widthPx}px`,
            maxWidth: "100%",
            transition: "width 0.3s ease",
          }}
          className="relative bg-white rounded-xl border border-zinc-200/90 shadow-md shrink-0"
        >
          {/* Section Inner Content Container */}
          <div
            className="relative p-6"
            style={{
              minHeight: `${rowCount * (ROW_HEIGHT_PX + GRID_GAP_PX)}px`,
            }}
          >
            {/* 1. Squarespace Fluid Engine Rounded Cells Grid Overlay (Contextual: Shows only during drag/resize) */}
            {showGrid && (
              <div
                className="absolute inset-6 pointer-events-none grid transition-opacity duration-150 animate-in fade-in"
                style={{
                  gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
                  gridAutoRows: `${ROW_HEIGHT_PX}px`,
                  gap: `${GRID_GAP_PX}px`,
                }}
              >
                {Array.from({ length: rowCount * totalColumns }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[6px] border border-blue-200/60 bg-blue-50/20"
                  />
                ))}
              </div>
            )}

            {/* 2. Real SDUI Components Layer */}
            <div
              ref={gridRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative z-20 grid min-h-full"
              style={{
                gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
                gridAutoRows: `${ROW_HEIGHT_PX}px`,
                gap: `${GRID_GAP_PX}px`,
                minHeight: `${rowCount * (ROW_HEIGHT_PX + GRID_GAP_PX)}px`,
              }}
            >
              {/* Live Preview Ghost Box when dragging from Toolbox */}
              {toolboxDragPreview && (
                <div
                  style={{
                    gridColumn: `${toolboxDragPreview.placement.colStart} / ${toolboxDragPreview.placement.colEnd}`,
                    gridRow: `${toolboxDragPreview.placement.rowStart} / ${toolboxDragPreview.placement.rowEnd}`,
                  }}
                  className="rounded-lg border-2 border-dashed border-blue-500 bg-blue-500/10 text-blue-700 flex flex-col items-center justify-center p-2 text-xs font-semibold pointer-events-none z-30 shadow-xs animate-pulse select-none"
                >
                  <span className="text-xs font-bold">+ Insert {toolboxDragPreview.name}</span>
                  <span className="text-[10px] font-mono opacity-70">
                    Col {toolboxDragPreview.placement.colStart}–{toolboxDragPreview.placement.colEnd - 1} • Row {toolboxDragPreview.placement.rowStart}–{toolboxDragPreview.placement.rowEnd - 1}
                  </span>
                </div>
              )}

              {items.map((item) => {
                // If this item is being actively dragged or resized, use real-time coordinates
                const isInteractingThis = interaction?.itemId === item.id;
                const savedPlacement =
                  item.placement?.[device] ||
                  getDefaultPlacement(item.type, device, 1);
                const placement = isInteractingThis
                  ? interaction.currentPlacement
                  : layoutPreview?.[item.id] || savedPlacement;

                const isSelected = selectedItemId === item.id;
                const isChildSelected = Boolean(
                  selectedItemId &&
                  item.config &&
                  findParentNodeInTree(item.config, selectedItemId) !== null
                );

                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item.id);
                    }}
                    onPointerDown={(e) => handleStartMove(e, item)}
                    style={{
                      gridColumn: `${placement.colStart} / ${placement.colEnd}`,
                      gridRow: `${placement.rowStart} / ${placement.rowEnd}`,
                      zIndex: isSelected || isChildSelected || isInteractingThis ? 60 : item.zIndex ?? 1,
                    }}
                    className={`relative group flex flex-col justify-center select-none ${isInteractingThis
                        ? "ring-2 ring-blue-500 shadow-xl opacity-90 cursor-grabbing z-50"
                        : "transition-all duration-200 ease-out " +
                        (isSelected
                          ? "ring-2 ring-blue-500 rounded-sm shadow-xs cursor-grab"
                          : "hover:ring-1 hover:ring-blue-300/80 rounded-sm cursor-pointer")
                      }`}
                  >
                    {/* Floating coordinate tooltip while dragging or resizing */}
                    {isInteractingThis && (
                      <div className="absolute -top-7 left-2 z-50 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold shadow-md pointer-events-none whitespace-nowrap">
                        Col {placement.colStart} → {placement.colEnd - 1} • Row {placement.rowStart} → {placement.rowEnd - 1}
                      </div>
                    )}

                    {/* Real SDUI Component with Interactive Child Selection */}
                    <div className="w-full h-full min-h-0 relative">
                      <RenderInteractiveNode
                        node={item.config}
                        rootItemId={item.id}
                        selectedItemId={selectedItemId}
                        onSelectItem={onSelectItem}
                        onAddChild={handleAddChildToNode}
                        onDuplicateChild={handleDuplicateChildInNode}
                        onDeleteChild={handleDeleteChildInNode}
                        onStartChildResize={handleStartChildResize}
                        childResize={childResize}
                        isRoot={true}
                        items={items}
                        device={device}
                        onMoveItem={handleMoveItem}
                      />
                      {/* Overlay over iframes or during interactions to guarantee clicks & drags are received by canvas */}
                      {(item.type === "IFrame" || interaction !== null) && (
                        <div
                          className="absolute inset-0 z-20 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item.id);
                          }}
                          onPointerDown={(e) => handleStartMove(e, item)}
                        />
                      )}
                    </div>

                    {/* Step 3: Selection Bounding Box & 8 Resize Handles */}
                    {isSelected && interaction?.mode !== "move" && (
                      <SelectionBoundingBox
                        item={item}
                        device={device}
                        items={items}
                        isResizing={isInteractingThis && interaction?.mode === "resize"}
                        onDelete={handleDeleteItem}
                        onDuplicate={handleDuplicateItem}
                        onStartResize={(e, dir) => handleStartResize(e, item, dir)}
                        onAddChild={handleAddChild}
                        onMove={handleMoveItem}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Height Adjuster */}
          <div className="border-t border-zinc-100 bg-zinc-50/60 px-4 py-2 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono text-[11px]">
              Rows: <strong className="text-zinc-800">{rowCount}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRemoveRows}
                disabled={rowCount <= 10}
                title="Decrease section height (-4 rows)"
                className="px-2 py-0.5 rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 disabled:opacity-40 text-xs font-semibold cursor-pointer"
              >
                - Less Rows
              </button>
              <button
                type="button"
                onClick={handleAddRows}
                title="Increase section height (+4 rows)"
                className="px-2.5 py-0.5 rounded border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>+</span>
                <span>Add Rows</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
