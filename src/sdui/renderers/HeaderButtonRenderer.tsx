"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HeaderButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "HeaderButton" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HeaderButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
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
        gap: "6px",
        width: "100%",
        height: "100%",
        padding: "6px 12px",
        border: "none",
        backgroundColor: "transparent",
        color: cleanStyle.color || "inherit",
        fontSize: "12px",
        fontWeight: "600",
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
      {data?.icon && <span style={{ flexShrink: 0 }}>{data.icon}</span>}
      {(data?.label || data?.text) && (
        <span style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
          {data?.label || data?.text}
        </span>
      )}
      {!data?.icon && !data?.label && !data?.text && "HeaderButton"}
    </button>
  );
}
