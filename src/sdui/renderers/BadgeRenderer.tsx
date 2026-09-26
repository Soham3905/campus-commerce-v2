"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: BadgeRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Badge" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function BadgeRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <span
      style={{
        backgroundColor: "#cc0c39",
        color: "white",
        padding: "4px 10px",
        fontSize: "11px",
        fontWeight: "bold",
        borderRadius: "16px",
        display: "inline-block",
        ...style
      }}
    >
      {data?.text}
    </span>
  );
}
