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
        src={data?.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png"}
        alt={data?.altText || "Image"}
        style={{ width: "100%", height: "180px", objectFit: "contain", ...style }}
      />
    </div>
  );
}
