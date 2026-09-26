"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Button" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "8px",
        background: "linear-gradient(135deg, #ffa41c, #ff8f00)",
        color: "#111",
        border: "none",
        borderRadius: "24px",
        fontSize: "14px",
        fontWeight: "800",
        cursor: "pointer",
        ...style
      }}
    >
      {data?.label || data?.text}
    </button>
  );
}
