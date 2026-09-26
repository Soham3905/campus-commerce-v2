"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: BoxRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Box" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function BoxRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
}
