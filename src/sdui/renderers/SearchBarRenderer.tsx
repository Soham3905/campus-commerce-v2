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
    <div style={{ padding: "5px", ...style }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "8px" }}>{data?.icon || "🔍"}</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={data?.placeholder || "Search..."}
          style={{ fontSize: "14px", width: "100%", border: "none", outline: "none" }}
        />
      </div>
    </div>
  );
}
