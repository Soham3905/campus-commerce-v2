"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: DescriptionRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Description" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function DescriptionRenderer({ data = {}, style = {} }: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    display,
    WebkitLineClamp,
    WebkitBoxOrient,
    whiteSpace,
    textOverflow,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <p
      className="no-scrollbar"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        fontSize: "14px",
        lineHeight: "20px",
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
    </p>
  );
}
