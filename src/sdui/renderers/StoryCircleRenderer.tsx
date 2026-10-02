"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: StoryCircleRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "StoryCircle" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function StoryCircleRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          padding: "2px",
          border: "2px solid #e1306c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          ...style
        }}
      >
        <img
          src={data?.imageUrl}
          alt={data?.label || "Story"}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
        />
      </div>
      <span style={{ fontSize: "11px", fontWeight: "500", color: style?.color || "inherit" }}>
        {data?.label}
      </span>
    </div>
  );
}
