"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CategoryGridRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CategoryGrid" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function CategoryGridRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gap: "12px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflowX: "auto",
        scrollbarWidth: "none",
        ...style
      }}
    >
      {children}
    </div>
  );
}
