"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: IFrameRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "IFrame" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function IFrameRenderer({ data = {}, style = {} }: BaseRendererProps) {
  if (!data?.src) return null;

  return (
    <iframe
      src={data.src}
      title={data.title || "Embedded Frame"}
      style={{
        width: "100%",
        height: style?.height || "100%",
        border: "none",
        display: "block",
        ...style
      }}
    />
  );
}
