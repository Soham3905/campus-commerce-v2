"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: DescriptionRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Description" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function DescriptionRenderer({ data = {}, style = {} }: BaseRendererProps) {
  return (
    <p
      style={{
        fontSize: "13px",
        color: style.color || "inherit",
        margin: 0,
        display: "-webkit-box",
        WebkitLineClamp: data?.maxLines ?? 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        ...style
      }}
    >
      {data?.text}
    </p>
  );
}
