"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: TextRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Text" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function TextRenderer({ data = {}, style = {} }: BaseRendererProps) {
  const {
    whiteSpace,
    textOverflow,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <span
      className="no-scrollbar"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        fontSize: "14px",
        color: cleanStyle.color || "inherit",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
        ...cleanStyle,
      }}
    >
      {data?.text}
    </span>
  );
}
