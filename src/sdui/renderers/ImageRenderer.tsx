"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ImageRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Image" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ImageRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const [hasError, setHasError] = useState(false);

  const {
    flex,
    flexShrink,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const fallbackUrl =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        width: "100%",
        height: cleanStyle.height || "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cleanStyle.backgroundColor || "#f8f9fa",
        borderRadius: cleanStyle.borderRadius || "12px",
        overflow: "hidden",
        boxSizing: "border-box",
        ...cleanStyle,
      }}
    >
      <img
        src={!hasError && data?.imageUrl ? data.imageUrl : fallbackUrl}
        alt={data?.altText || "Image"}
        onError={() => setHasError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: cleanStyle.objectFit || "cover",
          display: "block",
          borderRadius: "inherit",
        }}
      />
    </div>
  );
}
