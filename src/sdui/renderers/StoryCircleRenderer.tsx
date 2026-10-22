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

  const {
    height,
    minHeight,
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
      className="no-scrollbar"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        padding: "4px",
        transition: "transform 0.15s ease",
        ...cleanStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "auto 0",
          gap: "4px",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            maxWidth: "100%",
            maxHeight: "100%",
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
            }}
          />
        </div>
        {(data?.label || data?.text) && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              color: cleanStyle.color || "inherit",
              textAlign: "center",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              maxWidth: "100%",
              lineHeight: "1.2",
              whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
            }}
          >
            {data?.label || data?.text}
          </span>
        )}
      </div>
    </div>
  );
}
