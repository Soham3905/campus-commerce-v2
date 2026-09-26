"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: NavBarRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "NavBar" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function NavBarRenderer({ data = {}, style = {}, onNavigate }: BaseRendererProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        ...style
      }}
    >
      {data?.items?.map((item: any, idx: number) => (
        <div
          key={idx}
          onClick={() => {
            if (item.actions?.onTap?.type === "NAVIGATE" && onNavigate) {
              onNavigate(item.actions.onTap.route);
            }
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            cursor: "pointer",
            color: (item.isActive === "true" || item.isActive === true) ? "#4f46e5" : "#6b7280"
          }}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          <span style={{ fontSize: "10px", fontWeight: "600" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
