"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: HomeRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Home" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HomeRenderer({ children, style = {} }: BaseRendererProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        ...style
      }}
    >
      {children}
    </div>
  );
}
