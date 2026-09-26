"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: StoryRowRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "StoryRow" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function StoryRowRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "10px 4px",
        overflowX: "auto",
        backgroundColor: "#fff",
        scrollbarWidth: "none",
        borderBottom: "1px solid #efefef",
        borderRadius: "24px",
        ...style
      }}
    >
      {children}
    </div>
  );
}
