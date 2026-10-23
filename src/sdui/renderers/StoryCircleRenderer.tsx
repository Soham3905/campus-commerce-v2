"use client";

import React, { useState } from "react";
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
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    whiteSpace,
    textOverflow,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const fallbackUrl =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  const ringColor =
    cleanStyle.borderColor ||
    cleanStyle["--story-ring"] ||
    cleanStyle["--ring-color"] ||
    "#123A44";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={data?.label || data?.text || "Story"}
      className="no-scrollbar"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        minHeight: "72px",
        cursor: "pointer",
        boxSizing: "border-box",
        padding: "2px 2px",
        userSelect: "none",
        ...cleanStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Circle Avatar: Always pinned at the top, NEVER clipped or pushed out of view */}
      <div
        style={{
          width: "48px",
          height: "48px",
          minWidth: "48px",
          minHeight: "48px",
          aspectRatio: "1/1",
          borderRadius: "50%",
          padding: "2px",
          border: `2px solid ${ringColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          flexShrink: 0,
          boxSizing: "border-box",
          transform: isHovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <img
          src={!hasError && data?.imageUrl ? data.imageUrl : fallbackUrl}
          alt={data?.label || data?.text || "Story"}
          onError={() => setHasError(true)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 2. Text Label: Pinned below avatar with scroll support for extra large text */}
      {(data?.label || data?.text) && (
        <div
          className="no-scrollbar"
          style={{
            width: "100%",
            height: "22px",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            marginTop: "2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            flexShrink: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              color: cleanStyle.color || "inherit",
              display: "block",
              textAlign: "center",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: "1.2",
              whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
            }}
          >
            {data?.label || data?.text}
          </span>
        </div>
      )}
    </div>
  );
}
