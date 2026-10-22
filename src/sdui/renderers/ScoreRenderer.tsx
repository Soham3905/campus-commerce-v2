"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ScoreRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Score" component in the SDUI tree.
 * Displays an amber star pill badge with score text and optional "out of".
 */
export default function ScoreRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
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

  const scoreVal = data?.text ?? data?.score ?? "4.5";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "inline-flex",
        alignItems: "center",
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
          fontSize: cleanStyle.fontSize || "11px",
          color: cleanStyle.color || "#e77600",
          fontWeight: cleanStyle.fontWeight || "700",
          backgroundColor: cleanStyle.backgroundColor || "rgba(231,118,0,0.1)",
          borderRadius: cleanStyle.borderRadius || "6px",
          padding: cleanStyle.padding || "2px 6px",
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          lineHeight: "1.2",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "12px", lineHeight: 1 }}>★</span>
        <span>{scoreVal}</span>
        {data?.["out of"] && (
          <span style={{ color: "#888", fontWeight: "600", fontSize: "10px", marginLeft: "2px" }}>
            / {data["out of"]}
          </span>
        )}
      </span>
    </div>
  );
}
