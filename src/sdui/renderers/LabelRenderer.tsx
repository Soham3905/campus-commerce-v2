"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: LabelRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Label" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function LabelRenderer({ data = {}, style = {} }: BaseRendererProps) {
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
      className="no-scrollbar"
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        fontSize: "10px",
        fontWeight: "600",
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: cleanStyle.color || "#8D9A9D",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        ...cleanStyle,
      }}
    >
      {data?.text || "Label"}
    </span>
  );
}
