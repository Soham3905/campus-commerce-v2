"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: RatingRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Rating" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function RatingRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>
      {children}
    </div>
  );
}
