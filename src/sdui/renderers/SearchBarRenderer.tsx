"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: SearchBarRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "SearchBar" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function SearchBarRenderer({ data, style }: BaseRendererProps) {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: "5px", boxSizing: "border-box", ...style, maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <span style={{ marginRight: "8px", flexShrink: 0 }}>{data?.icon || "🔍"}</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={data?.placeholder || "Search..."}
          style={{ fontSize: "14px", width: "100%", minWidth: 0, border: "none", outline: "none", background: "transparent" }}
        />
      </div>
    </div>
  );
}
