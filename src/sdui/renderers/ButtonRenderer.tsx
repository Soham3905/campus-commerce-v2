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
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    whiteSpace,
    textOverflow,
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
        minHeight: "36px",
        padding: "0 16px",
        borderRadius: "12px",
        border: "none",
        fontSize: "14px",
        fontWeight: "600",
        letterSpacing: "0.01em",
        cursor: "pointer",
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
      {data?.label || data?.text || "Button"}
    </button>
  );
}
