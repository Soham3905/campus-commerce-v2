"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: SearchBarRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "SearchBar" component in the SDUI tree as a self-contained atom.
 *
 * Sizing & Responsiveness:
 * - Designed to occupy 1 row (36px height) and 8 columns on the canvas grid by default.
 * - Fluidly scales with responsive columns (Desktop: 8 cols, Tablet: 8 cols, Mobile: 8 cols).
 * - Adapts cleanly when resized in the visual editor.
 * - Leaf atom component: does not accept or render child nodes.
 */
export default function SearchBarRenderer({
  data = {},
  style = {},
  onClick,
}: BaseRendererProps) {
  const [query, setQuery] = useState("");

  // Clean layout properties: strip conflicting or rigid layout constraints so
  // the search bar fluidly conforms to its assigned grid container
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const icon = data?.icon !== undefined ? data.icon : "🔍";
  const placeholder = data?.placeholder || "Search products, brands and more";

  return (
    <div
      onClick={onClick}
      role="search"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minHeight: "36px",
        padding: "0 12px",
        borderRadius: "12px",
        border: "1px solid #E4E7E4",
        backgroundColor: "#FFFFFF",
        color: "#101F26",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        ...cleanStyle,
      }}
    >
      {icon ? (
        <span
          style={{
            marginRight: "8px",
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {icon}
        </span>
      ) : null}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          flex: 1,
          width: "100%",
          minWidth: 0,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          color: "inherit",
          fontSize: cleanStyle.fontSize || "13px",
          fontFamily: "inherit",
          caretColor: cleanStyle.caretColor || "#C4185F",
          padding: 0,
          margin: 0,
        }}
      />

      {query ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuery("");
          }}
          aria-label="Clear search"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            padding: "0 2px",
            marginLeft: "6px",
            cursor: "pointer",
            color: "#9CA3AF",
            fontSize: "12px",
            lineHeight: 1,
            flexShrink: 0,
          }}
          title="Clear"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
