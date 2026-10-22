"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: RatingRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Rating" component in the SDUI tree as a self-contained atom
 * with an amber star score badge and optional review count.
 * Does not contain children.
 */
export default function RatingRenderer({ data = {}, style = {}, children, onClick }: BaseRendererProps) {
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

  const score = data?.score ?? data?.value ?? data?.text ?? "4.5";
  const rawCount = data?.reviewCount ?? data?.count ?? data?.reviews ?? "";
  const cleanCount = rawCount
    ? String(rawCount).replace(/[()]/g, "").replace(/\s*reviews?/i, "").trim()
    : "";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: cleanStyle.gap || "6px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...cleanStyle,
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "#e77600",
          fontWeight: "700",
          backgroundColor: "rgba(231,118,0,0.1)",
          borderRadius: "6px",
          padding: "2px 6px",
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          lineHeight: "1.2",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "12px", lineHeight: 1 }}>★</span>
        <span>{score}</span>
      </span>
      {cleanCount ? (
        <span
          style={{
            fontSize: cleanStyle.fontSize || "11px",
            color: cleanStyle.color || "#5E6E72",
            fontWeight: "500",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          ({cleanCount})
        </span>
      ) : children ? (
        children
      ) : null}
    </div>
  );
}
