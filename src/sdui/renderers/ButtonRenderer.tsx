"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Button" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    height,
    minHeight,
    flex,
    flexShrink,
    whiteSpace,
    textOverflow,
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
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: cleanStyle.padding || "4px 12px",
        borderRadius: cleanStyle.borderRadius || "12px",
        border: cleanStyle.border || "none",
        fontSize: cleanStyle.fontSize || "14px",
        fontWeight: cleanStyle.fontWeight || "600",
        letterSpacing: cleanStyle.letterSpacing || "0.01em",
        cursor: "pointer",
        boxSizing: "border-box",
        overflow: "hidden",
        ...cleanStyle,
      }}
    >
      <span
        className="no-scrollbar"
        style={{
          display: "block",
          width: "100%",
          maxHeight: "100%",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
          lineHeight: "18px",
          textAlign: "center",
        }}
      >
        {data?.label || data?.text || "Button"}
      </span>
    </button>
  );
}
