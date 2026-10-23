"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: StoryRowRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "StoryRow" component in the SDUI tree.
 *
 * Responsiveness & Layout:
 * - Designed to occupy 2 rows (80px height) and all columns across the canvas grid.
 * - Displays child `StoryCircle` components in a single-row horizontal scrollable track.
 * - Prevents child circle distortion using flexShrink: 0 for each slide item.
 * - Smooth horizontal scrolling without scrollbars on mobile and desktop.
 */
export default function StoryRowRenderer({
  children,
  style = {},
  onClick,
}: BaseRendererProps) {
  // Clean rigid dimensions from style so the row conforms fluidly to its container
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

  if (childrenArray.length === 0) {
    return (
      <div
        onClick={onClick}
        role="region"
        aria-label="Story Row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "72px",
          backgroundColor: cleanStyle.backgroundColor || "transparent",
          borderRadius: cleanStyle.borderRadius || "16px",
          border: "1px dashed #CBD5E1",
          color: "#64748B",
          padding: "8px 12px",
          boxSizing: "border-box",
          fontSize: "12px",
          gap: "6px",
          userSelect: "none",
          ...cleanStyle,
        }}
      >
        <span style={{ fontSize: "16px" }}>⭕</span>
        <span style={{ fontWeight: 600 }}>Story Row is empty</span>
        <span style={{ fontSize: "11px", opacity: 0.7 }}>— Add StoryCircle to start</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="region"
      aria-label="Story Row"
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: cleanStyle.gap || "16px",
        width: "100%",
        height: "100%",
        minHeight: "72px",
        padding: cleanStyle.padding || "6px 12px",
        backgroundColor: cleanStyle.backgroundColor || "transparent",
        borderRadius: cleanStyle.borderRadius || "16px",
        boxSizing: "border-box",
        overflow: cleanStyle.overflow || "visible",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        ...cleanStyle,
      }}
    >
      {childrenArray.map((child, idx) => (
        <div
          key={idx}
          style={{
            flexShrink: 0,
            width: "72px",
            minHeight: "72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            boxSizing: "border-box",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
