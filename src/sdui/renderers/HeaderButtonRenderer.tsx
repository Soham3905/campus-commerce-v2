"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HeaderButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "HeaderButton" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HeaderButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 6,
        ...style
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 12 }}>
        {data?.icon} {data?.label}
      </span>
    </div>
  );
}
