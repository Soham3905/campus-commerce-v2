"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: IconRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Icon" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function IconRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    flex,
    flexShrink,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  const isImageUrl =
    data?.imageUrl &&
    (data.imageUrl.startsWith("http://") ||
      data.imageUrl.startsWith("https://") ||
      data.imageUrl.startsWith("/") ||
      data.imageUrl.startsWith("data:image"));

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: cleanStyle.fontSize || "18px",
        color: cleanStyle.color || "inherit",
        cursor: "pointer",
        boxSizing: "border-box",
        overflow: "hidden",
        ...cleanStyle,
      }}
    >
      {isImageUrl ? (
        <img
          src={data.imageUrl}
          alt={data?.altText || "Icon"}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <span
          style={{
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data?.icon || data?.name || data?.text || "★"}
        </span>
      )}
    </div>
  );
}
