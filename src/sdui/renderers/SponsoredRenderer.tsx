"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: SponsoredRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Sponsored" component in the SDUI tree.
 * Displays an uppercase sponsor disclosure tag that wraps like Text component
 * onto the next line without horizontal scrolling.
 */
export default function SponsoredRenderer({
  data = {},
  style = {},
  onClick,
}: BaseRendererProps) {
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
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "safe center" as any,
        justifyContent: "safe center" as any,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...cleanStyle,
      }}
    >
      <span
        style={{
          display: "block",
          width: "100%",
          color: cleanStyle.color || "#888888",
          fontSize: cleanStyle.fontSize || "11px",
          fontWeight: cleanStyle.fontWeight || "600",
          letterSpacing: cleanStyle.letterSpacing || "0.5px",
          textTransform: cleanStyle.textTransform || "uppercase",
          lineHeight: "1.3",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
        }}
      >
        {data?.text || "Sponsored"}
      </span>
    </div>
  );
}
