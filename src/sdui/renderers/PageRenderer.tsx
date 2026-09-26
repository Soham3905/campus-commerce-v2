"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: PageRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Page" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function PageRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(100, 1fr)",
        gridTemplateRows: "repeat(200, 10px)",
        gap: "0px",
        width: "100%",
        height: "100%",
        padding: "0px",
        margin: "0px",
        boxSizing: "border-box",
        ...style
      }}
    >
      {children}
    </div>
  );
}
