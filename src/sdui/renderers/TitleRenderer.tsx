"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: TitleRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Title" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function TitleRenderer({ data = {}, style = {} }: BaseRendererProps) {
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
    <h3
      className="no-scrollbar"
      style={{
        width: "100%",
        height: "100%",
        fontSize: "16px",
        fontWeight: "700",
        color: cleanStyle.color || "inherit",
        margin: 0,
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
    </h3>
  );
}
