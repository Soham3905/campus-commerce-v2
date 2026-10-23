"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: FooterRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Footer" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function FooterRenderer({
  children,
  data = {},
  style = {},
  onClick,
}: BaseRendererProps) {
  // Clean rigid dimensions from style so the footer conforms fluidly to its container
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  return (
    <footer
      onClick={onClick}
      role="contentinfo"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "168px",
        padding: cleanStyle.padding || "20px",
        backgroundColor: cleanStyle.backgroundColor || "#0A2A31",
        borderRadius: cleanStyle.borderRadius || "12px",
        color: cleanStyle.color || "#CFDDDC",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...cleanStyle,
      }}
    >
      {/* 1. Footer Navigation Sections */}
      {data?.sections && Array.isArray(data.sections) && data.sections.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(130px, 1fr))`,
            gap: "16px",
            marginBottom: children || data?.copyrightText ? "16px" : 0,
          }}
        >
          {data.sections.map((section: any, i: number) => (
            <div key={i} style={{ minWidth: 0 }}>
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  color: cleanStyle.titleColor || "#FFFFFF",
                  letterSpacing: "0.02em",
                }}
              >
                {section.title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {section.links?.map((link: any, j: number) => (
                  <li key={j} style={{ fontSize: "12px", lineHeight: "16px" }}>
                    <a
                      href={link.url || "#"}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        opacity: 0.8,
                        transition: "opacity 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.8";
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 2. Optional Valid Children (e.g. Button, Text) */}
      {children && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            marginBottom: data?.copyrightText ? "12px" : 0,
          }}
        >
          {children}
        </div>
      )}

      {/* 3. Copyright Notice Divider */}
      {data?.copyrightText && (
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "12px",
            marginTop: "auto",
            textAlign: "center",
            fontSize: "11px",
            opacity: 0.65,
          }}
        >
          {data.copyrightText}
        </div>
      )}
    </footer>
  );
}
