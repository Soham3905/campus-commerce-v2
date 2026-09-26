"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HeroBannerRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "HeroBanner" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HeroBannerRenderer({ data = {}, style = {}, children, onError }: BaseRendererProps) {
  return (
    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", ...style }}>
      <img
        src={data?.imageUrl}
        alt={data?.altText}
        onError={onError}
        style={{ width: "100%", height: style?.height || "400px", objectFit: "cover" }}
      />
      {/* Overlay Text */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          padding: "20px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
          color: "#fff"
        }}
      >
        {data?.title && <h2 style={{ margin: 0, fontSize: "20px" }}>{data.title}</h2>}
        {data?.subtitle && <p style={{ margin: "4px 0 0", fontSize: "14px", opacity: 0.9 }}>{data.subtitle}</p>}
        {children && <div style={{ marginTop: "10px" }}>{children}</div>}
      </div>
    </div>
  );
}
