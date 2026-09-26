"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ProductListRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ProductList" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ProductListRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div style={{ display: "flex", gap: "8px", padding: "8px", width: "max-content", ...style }}>
      {React.Children.map(children, (child, idx) => (
        <div key={idx} style={{ display: "flex" }}>
          {child}
        </div>
      ))}
    </div>
  );
}
