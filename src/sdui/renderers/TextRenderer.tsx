"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: TextRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Text" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function TextRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <span style={{ fontSize: "14px", color: style.color || "inherit", ...style }}>
      {data?.text}
    </span>
  );
}
