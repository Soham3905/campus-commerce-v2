"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ScoreRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Score" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ScoreRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <span
      style={{
        fontSize: "10px",
        color: "#e77600",
        fontWeight: "bold",
        backgroundColor: "rgba(231,118,0,0.1)",
        borderRadius: "8px",
        padding: "2px 6px",
        display: "inline-flex",
        alignItems: "center",
        ...style
      }}
    >
      ★ {data?.text}
      {data?.["out of"] && (
        <span style={{ color: "#888", fontWeight: "bold", fontSize: "10px"}}>
          / {data["out of"]}
        </span>
      )}
    </span>
  );
}
