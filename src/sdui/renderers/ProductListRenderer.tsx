"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ProductListRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ProductList" component in the SDUI tree.
 * Displays child `ProductCard` components in a single-row horizontal scrollable track.
 *
 * Responsiveness & Layout:
 * - Fluid width conforming to parent container or grid columns.
 * - Prevents child card squishing using flexShrink: 0.
 * - Smooth horizontal scrolling without scrollbars on mobile, tablet, and desktop.
 * - Displays a gentle, helpful dashed placeholder if empty.
 * - Optional section title support if data.title is provided.
 */
export default function ProductListRenderer({
  data = {},
  children,
  style = {},
  onClick,
}: BaseRendererProps) {
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

  const childrenArray = React.Children.toArray(children);

  // Friendly placeholder when no product cards exist yet
  if (childrenArray.length === 0) {
    return (
      <div
        onClick={onClick}
        role="region"
        aria-label="Product List"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "120px",
          backgroundColor: cleanStyle.backgroundColor || "#FAFAFA",
          borderRadius: cleanStyle.borderRadius || "16px",
          border: "1px dashed #CBD5E1",
          color: "#64748B",
          padding: "16px",
          boxSizing: "border-box",
          fontSize: "13px",
          gap: "8px",
          userSelect: "none",
          ...cleanStyle,
        }}
      >
        <span style={{ fontSize: "18px" }}>🛍️</span>
        <span style={{ fontWeight: 600 }}>Product List is empty</span>
        <span style={{ fontSize: "11px", opacity: 0.7 }}>— Add ProductCard to start</span>
      </div>
    );
  }

  // Horizontal scroll track
  const scrollTrack = (
    <div
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: cleanStyle.gap || "14px",
        width: "100%",
        padding: cleanStyle.padding || "8px",
        backgroundColor: cleanStyle.backgroundColor || "transparent",
        boxSizing: "border-box",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        ...cleanStyle,
      }}
    >
      {childrenArray.map((child, idx) => {
        const childNodeWidth =
          (child as any)?.props?.node?.containerStyle?.width;
        const effectiveWidth =
          childNodeWidth && childNodeWidth !== "100%"
            ? childNodeWidth
            : "clamp(236px, 74vw, 268px)";

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flexShrink: 0,
              boxSizing: "border-box",
              width: effectiveWidth,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );

  // If a section title is defined in data, render it cleanly above the track
  if (data?.title) {
    return (
      <div
        onClick={onClick}
        role="region"
        aria-label={data.title}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#101F26",
            margin: "0 0 0 8px",
            letterSpacing: "-0.01em",
          }}
        >
          {data.title}
        </h3>
        {scrollTrack}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="region"
      aria-label="Product List"
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {scrollTrack}
    </div>
  );
}

