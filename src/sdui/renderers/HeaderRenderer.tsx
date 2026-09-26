"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HeaderRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Header" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HeaderRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, ...style }}>
      {children}
    </div>
  );
}
