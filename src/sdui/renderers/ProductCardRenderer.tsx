"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: ProductCardRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "ProductCard" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function ProductCardRenderer({ children, style = {} }: BaseRendererProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '14px',
        width: '280px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #E4E7E4',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...style
      }}
    >
      {children}

      {/* Floating Quick Add Pill on Hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '145px',
            left: '14px',
            right: '14px',
            zIndex: 10
          }}
        >
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              padding: '9px 14px',
              backgroundColor: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
            }}
          >
            <span>⚡</span>
            <span>Quick Add</span>
          </button>
        </div>
      )}
    </div>
  );
}
