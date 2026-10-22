"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HeroBannerRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "HeroBanner" component in the SDUI tree as a self-contained banner
 * with cover image and overlaid title/subtitle. Does not contain children.
 */
export default function HeroBannerRenderer({
  data = {},
  style = {},
  onClick,
  onError,
}: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    display,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const imageUrl =
    data?.imageUrl ||
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: cleanStyle.borderRadius || "16px",
        overflow: "hidden",
        boxSizing: "border-box",
        ...cleanStyle,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={data?.altText || data?.title || "Hero Banner"}
        onError={onError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      {/* Overlay Text */}
      {(data?.title || data?.subtitle || data?.buttonText) && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px",
            background: "linear-gradient(transparent 0%, rgba(0,0,0,0.75) 100%)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {data?.title && (
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                lineHeight: "1.2",
              }}
            >
              {data.title}
            </h2>
          )}
          {data?.subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                opacity: 0.9,
                lineHeight: "1.3",
              }}
            >
              {data.subtitle}
            </p>
          )}
          {data?.buttonText && (
            <div style={{ marginTop: "6px" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  backgroundColor: "#ffffff",
                  color: "#101F26",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {data.buttonText}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
