"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ReviewCountRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ReviewCount" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ReviewCountRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <span style={{ fontSize: "11px", color: "#007185", fontWeight: "500", ...style }}>
      ({data?.text} reviews)
    </span>
  );
}
