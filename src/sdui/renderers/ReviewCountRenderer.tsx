"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ReviewCountRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ReviewCount" component in the SDUI tree.
 * Displays formatted review counts cleanly without duplicate parentheses.
 */
export default function ReviewCountRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    display,
    alignItems,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const rawText =
    data?.text !== undefined && data?.text !== null
      ? String(data.text).trim()
      : data?.count !== undefined && data?.count !== null
      ? String(data.count).trim()
      : "";

  const cleanNumber = rawText
    ? rawText.replace(/[()]/g, "").replace(/\s*reviews?/i, "").trim()
    : "120";

  const displayText = cleanNumber ? `(${cleanNumber} reviews)` : "";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        fontSize: cleanStyle.fontSize || "11px",
        color: cleanStyle.color || "#5E6E72",
        fontWeight: cleanStyle.fontWeight || "500",
        ...cleanStyle,
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>{displayText}</span>
    </div>
  );
}
