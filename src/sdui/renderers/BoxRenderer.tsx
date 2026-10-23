"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: BoxRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Box" container component in the SDUI tree.
 * Supports row, column, or grid layouts for nesting child components.
 * Receives standard props: { children, style, data, actions, onClick }
 */
export default function BoxRenderer({
  children,
  style = {},
  onClick,
}: BaseRendererProps) {
  // Clean rigid dimensions from style so the box conforms fluidly to the grid
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const childrenCount = React.Children.count(children);

  if (childrenCount === 0) {
    return (
      <div
        onClick={onClick}
        role="region"
        aria-label="Box Container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "72px",
          backgroundColor: cleanStyle.backgroundColor || "transparent",
          borderRadius: cleanStyle.borderRadius || "12px",
          border: cleanStyle.border || "1px dashed #CBD5E1",
          color: "#64748B",
          padding: "16px",
          boxSizing: "border-box",
          fontSize: "12px",
          gap: "4px",
          userSelect: "none",
          ...cleanStyle,
        }}
      >
        <span style={{ fontSize: "16px" }}>📦</span>
        <span style={{ fontWeight: 600 }}>Box is empty</span>
        <span style={{ fontSize: "11px", opacity: 0.7 }}>Add or drag components inside</span>
      </div>
    );
  }

  const isGrid = cleanStyle.display === "grid";

  return (
    <div
      onClick={onClick}
      role="region"
      aria-label="Box Container"
      className="no-scrollbar"
      style={{
        display: cleanStyle.display || "flex",
        flexDirection: isGrid ? undefined : cleanStyle.flexDirection || "column",
        gap: cleanStyle.gap || "12px",
        width: "100%",
        height: "100%",
        minHeight: "40px",
        boxSizing: "border-box",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        ...cleanStyle,
      }}
    >
      {children}
    </div>
  );
}
