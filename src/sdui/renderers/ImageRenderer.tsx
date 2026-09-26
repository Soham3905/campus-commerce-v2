"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ImageRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Image" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ImageRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <img
        src={data?.imageUrl}
        alt={data?.altText}
        style={{ width: "100%", height: "180px", objectFit: "contain", ...style }}
      />
    </div>
  );
}
