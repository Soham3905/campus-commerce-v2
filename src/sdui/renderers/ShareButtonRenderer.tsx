"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ShareButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ShareButton" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ShareButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid #ddd",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        ...style
      }}
    >
      {data?.icon && <span>{data.icon}</span>}
      {data?.label && <span>{data.label}</span>}
    </button>
  );
}
