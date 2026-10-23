"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CategoryGridRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CategoryGrid" component in the SDUI tree.
 *
 * Responsiveness & Layout:
 * - Designed to occupy 2 rows (80px height) and all columns across the canvas grid.
 * - Displays child `CategoryItem` components in a single-row horizontal grid track.
 * - Uses `gridAutoColumns: "minmax(64px, 1fr)"` so items expand equally on Desktop
 *   and smoothly scroll horizontally on narrow Mobile screens without clipping.
 * - Centers child tiles vertically and horizontally within each track.
 */
export default function CategoryGridRenderer({
  children,
  style = {},
  onClick,
}: BaseRendererProps) {
  // Clean rigid dimensions from style so the grid conforms fluidly to its container
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <div
      onClick={onClick}
      role="region"
      aria-label="Category Navigation"
      className="no-scrollbar"
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "minmax(64px, 1fr)",
        alignItems: "center",
        justifyItems: "center",
        gap: cleanStyle.gap || "12px",
        width: "100%",
        height: "100%",
        minHeight: "80px",
        padding: cleanStyle.padding || "6px 12px",
        backgroundColor: cleanStyle.backgroundColor || "#FFFFFF",
        borderRadius: cleanStyle.borderRadius || "16px",
        border: cleanStyle.border || "1px solid #E4E7E4",
        boxShadow: cleanStyle.boxShadow || "0 1px 2px rgba(16,31,38,0.04)",
        boxSizing: "border-box",
        overflow: cleanStyle.overflow || "visible",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...cleanStyle,
      }}
    >
      {children}
    </div>
  );
}
