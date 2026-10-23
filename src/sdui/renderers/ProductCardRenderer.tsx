"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ProductCardRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ProductCard" component in the SDUI tree.
 * Displays product image, brand/title, pricing, ratings, badges, and actions.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ProductCardRenderer({ children, style = {} }: BaseRendererProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        position: "relative",
        border: "1px solid #E4E7E4",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "14px",
        transition: "all 0.2s ease",
        boxShadow: isHovered
          ? "0 8px 24px rgba(16, 31, 38, 0.08)"
          : (style.boxShadow || "0 1px 3px rgba(16, 31, 38, 0.04)"),
        transform: isHovered ? "translateY(-2px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
