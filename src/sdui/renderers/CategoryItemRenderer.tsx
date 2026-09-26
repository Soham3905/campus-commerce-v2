"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CategoryItemRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CategoryItem" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function CategoryItemRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        ...style
      }}
    >
      <div
        style={{
          width: "35px",
          height: "35px",
          backgroundColor: "#f0f2f5",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        {data?.icon}
      </div>
      <span
        style={{
          fontSize: "10px",
          fontWeight: "600",
          color: style?.color || "#444",
          cursor: "pointer",
          textAlign: "center",
          whiteSpace: "nowrap"
        }}
      >
        {data?.label}
      </span>
    </div>
  );
}
