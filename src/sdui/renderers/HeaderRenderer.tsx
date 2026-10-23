"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HeaderRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Header" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HeaderRenderer({
  children,
  style = {},
  onClick,
}: BaseRendererProps) {
  // Clean rigid dimensions from style so the header conforms fluidly to its container
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
    <header
      onClick={onClick}
      role="banner"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: cleanStyle.justifyContent || "space-between",
        gap: cleanStyle.gap || "12px",
        width: "100%",
        minHeight: "36px",
        padding: cleanStyle.padding || "4px 16px",
        backgroundColor: cleanStyle.backgroundColor || "#0D3540",
        borderRadius: cleanStyle.borderRadius || "12px",
        boxSizing: "border-box",
        overflow: "visible",
        ...cleanStyle,
      }}
    >
      {children}
    </header>
  );
}
