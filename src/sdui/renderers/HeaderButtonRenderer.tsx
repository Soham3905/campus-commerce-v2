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
        padding: cleanStyle.padding || "4px 8px",
        border: cleanStyle.border || "none",
        backgroundColor: cleanStyle.backgroundColor || "transparent",
        color: cleanStyle.color || "inherit",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        boxSizing: "border-box",
        overflow: "hidden",
        ...cleanStyle,
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxHeight: "100%",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            margin: "auto 0",
            width: "100%",
            flexShrink: 0,
          }}
        >
          {data?.icon && <span style={{ flexShrink: 0 }}>{data.icon}</span>}
          {(data?.label || data?.text) && (
            <span
              style={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
                lineHeight: "16px",
                textAlign: "center",
              }}
            >
              {data?.label || data?.text}
            </span>
          )}
          {!data?.icon && !data?.label && !data?.text && "HeaderButton"}
        </div>
      </div>
    </button>
  );
}
