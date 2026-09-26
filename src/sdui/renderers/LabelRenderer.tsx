"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: LabelRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Label" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function LabelRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", ...style }}>
      {children}
    </div>
  );
}
