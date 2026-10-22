"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: OfferTextRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "OfferText" component in the SDUI tree.
 * Displays a promotional offer tag with badge icon and wrapping offer text.
 * Extra text wraps onto next line (overflowing vertically if needed).
 */
export default function OfferTextRenderer({
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
        gap: cleanStyle.gap || "4px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        fontSize: cleanStyle.fontSize || "12px",
        color: cleanStyle.color || "#007185",
        fontWeight: cleanStyle.fontWeight || "600",
        lineHeight: "1.3",
        ...cleanStyle,
      }}
    >
      <span style={{ fontSize: "13px", lineHeight: 1, flexShrink: 0 }}>🏷️</span>
      <span
        style={{
          flex: "1 1 auto",
          minWidth: 0,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
          lineHeight: "1.3",
        }}
      >
        {data?.text || "Special Offer"}
      </span>
    </div>
  );
}
