"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CouponCodeRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CouponCode" component in the SDUI tree.
 * Displays coupon details with text that wraps naturally onto multiple lines
 * and overflows vertically (y-direction) rather than scrolling horizontally.
 */
export default function CouponCodeRenderer({
  data = {},
  style = {},
  onClick,
  onCopy,
}: BaseRendererProps) {
  const [copied, setCopied] = useState(false);

  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    display,
    alignItems,
    justifyContent,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    minWidth,
    maxWidth,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  const couponCode = data?.coupon || data?.couponCode || data?.code || "CAMPUS50";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
    }
    if (onCopy) {
      onCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "safe center" as any,
        justifyContent: "space-between",
        gap: cleanStyle.gap || "12px",
        padding: cleanStyle.padding || "10px 14px",
        borderRadius: cleanStyle.borderRadius || "12px",
        border: cleanStyle.border || "1.5px dashed #E9C489",
        backgroundColor: cleanStyle.backgroundColor || "#FFF3DF",
        color: cleanStyle.color || "#8A5209",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...cleanStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          minWidth: 0,
          flex: "1 1 auto",
        }}
      >
        {data?.title && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              lineHeight: "1.3",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
            {data.title}
          </span>
        )}
        {data?.description && (
          <span
            style={{
              fontSize: "11px",
              opacity: 0.85,
              lineHeight: "1.3",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
            {data.description}
          </span>
        )}
        {couponCode && (
          <div style={{ marginTop: "2px" }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: "rgba(0, 0, 0, 0.07)",
                display: "inline-block",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {couponCode}
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          padding: "6px 12px",
          backgroundColor: copied ? "#16a34a" : (cleanStyle.color || "#8A5209"),
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "11px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {copied ? "Copied!" : data?.copyLabel || "Copy"}
      </button>
    </div>
  );
}
