"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ShareButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ShareButton" component in the SDUI tree.
 * Styled button with optional icon and share label.
 */
export default function ShareButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    display,
    alignItems,
    justifyContent,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <button
      type="button"
      onClick={onClick}
      className="no-scrollbar"
      style={{
        width: "100%",
        height: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: cleanStyle.gap || "6px",
        padding: cleanStyle.padding || "6px 12px",
        borderRadius: cleanStyle.borderRadius || "8px",
        fontSize: cleanStyle.fontSize || "12px",
        fontWeight: cleanStyle.fontWeight || "600",
        cursor: "pointer",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        border: cleanStyle.border || "1px solid #ddd",
        backgroundColor: cleanStyle.backgroundColor || "transparent",
        color: cleanStyle.color || "inherit",
        whiteSpace: "nowrap",
        ...cleanStyle,
      }}
    >
      {data?.icon && <span style={{ fontSize: "14px", lineHeight: 1 }}>{data.icon}</span>}
      {data?.label && <span>{data.label}</span>}
    </button>
  );
}
