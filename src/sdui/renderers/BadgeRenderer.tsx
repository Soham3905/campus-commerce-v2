"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: BadgeRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Badge" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function BadgeRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    height,
    minHeight,
    flex,
    flexShrink,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <span
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "0 9px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.01em",
        backgroundColor: cleanStyle.backgroundColor || "#FFF3DF",
        color: cleanStyle.color || "#8A5209",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        textAlign: "center",
        ...cleanStyle,
      }}
    >
      {data?.text || data?.label || "Badge"}
    </span>
  );
}
