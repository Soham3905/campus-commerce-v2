"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: SponsoredRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Sponsored" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function SponsoredRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <span
      style={{
        color: "#888",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        ...style
      }}
    >
      {data?.text || 'Sponsored'}
    </span>
  );
}
