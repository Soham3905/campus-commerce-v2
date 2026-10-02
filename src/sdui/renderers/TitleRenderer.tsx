"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: TitleRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Title" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function TitleRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <h3 style={{ fontSize: "16px", fontWeight: "700", color: style.color || "inherit", margin: 0, ...style }}>
      {data?.text}
    </h3>
  );
}
