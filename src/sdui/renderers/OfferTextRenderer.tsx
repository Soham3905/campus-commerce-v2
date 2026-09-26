"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: OfferTextRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "OfferText" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function OfferTextRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <p style={{ fontSize: "12px", color: "#007185", fontWeight: "500", margin: 0, display: "flex", alignItems: "center", ...style }}>
      🏷️ {data?.text}
    </p>
  );
}
