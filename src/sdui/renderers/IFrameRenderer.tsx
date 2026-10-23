"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: IFrameRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "IFrame" component in the SDUI tree.
 * Embeds external web content, maps, interactive widgets, or media streams.
 *
 * Responsiveness & Layout:
 * - Fills 100% of the allocated grid cell or container fluidly.
 * - Respects container borderRadius and overflow: hidden.
 * - Displays a helpful, clickable placeholder state when no URL is provided.
 * - Uses border-box sizing and clean styles to prevent unwanted layout shifts.
 */
export default function IFrameRenderer({
  data = {},
  style = {},
  onClick,
}: BaseRendererProps) {
  const [loadError, setLoadError] = useState(false);

  // Clean rigid dimensions from container style so it conforms fluidly to its container
  const {
    flex,
    flexShrink,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const src = typeof data?.src === "string" ? data.src.trim() : "";

  // If no URL is configured, display an informative, accessible visual placeholder
  if (!src) {
    return (
      <div
        onClick={onClick}
        role="region"
        aria-label="Empty IFrame"
        style={{
          width: "100%",
          height: cleanStyle.height || "100%",
          minHeight: "160px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: cleanStyle.backgroundColor || "#F8FAFC",
          borderRadius: cleanStyle.borderRadius || "16px",
          border: cleanStyle.border || "1px dashed #CBD5E1",
          color: "#64748B",
          padding: "16px",
          boxSizing: "border-box",
          gap: "8px",
          textAlign: "center",
          userSelect: "none",
          ...cleanStyle,
        }}
      >
        <span style={{ fontSize: "24px" }}>🌐</span>
        <span style={{ fontWeight: 600, fontSize: "13px", color: "#334155" }}>
          {data?.title || "IFrame Component"}
        </span>
        <span style={{ fontSize: "11px", color: "#94A3B8", maxWidth: "260px" }}>
          Enter an embed URL in the Properties Panel to display external content.
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="region"
      aria-label={data?.title || "Embedded Frame"}
      style={{
        width: "100%",
        height: cleanStyle.height || "100%",
        minHeight: "140px",
        borderRadius: cleanStyle.borderRadius || "16px",
        overflow: "hidden",
        boxSizing: "border-box",
        backgroundColor: cleanStyle.backgroundColor || "#F8FAFC",
        position: "relative",
        ...cleanStyle,
      }}
    >
      <iframe
        src={src}
        title={data?.title || "Embedded Frame"}
        allowFullScreen={data?.allowFullScreen ?? true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        onError={() => setLoadError(true)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          borderRadius: "inherit",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

