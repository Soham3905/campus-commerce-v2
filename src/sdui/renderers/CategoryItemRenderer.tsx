"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CategoryItemRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the atomic "CategoryItem" component in the SDUI tree.
 *
 * Responsiveness & Layout:
 * - Pure leaf-atom component (no children).
 * - Occupies 2 columns and 2 rows on the canvas grid by default.
 * - Supports both Icon (emoji/string) and Image (URL), falling back gracefully.
 * - Displays a circular icon/image pill and full multiline category label.
 * - Uses `margin: auto 0` inner centering to prevent negative scroll clipping,
 *   allowing text to wrap fully and scroll cleanly from top to bottom.
 */
export default function CategoryItemRenderer({
  data = {},
  style = {},
  onClick,
}: BaseRendererProps) {
  const [hasImageError, setHasImageError] = useState(false);

  // Strip rigid dimensions so the component adapts responsively
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    whiteSpace,
    textOverflow,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const label = data?.label || data?.text || "Category";
  const imageUrl = data?.imageUrl || data?.image || "";
  const icon = data?.icon || "";

  // Check if an image is provided directly via imageUrl, or if icon is an image URL
  const effectiveImageUrl =
    imageUrl ||
    (typeof icon === "string" &&
      (icon.startsWith("http://") ||
        icon.startsWith("https://") ||
        icon.startsWith("/") ||
        icon.startsWith("data:image"))
      ? icon
      : "");

  const displayIcon = !effectiveImageUrl ? (icon || "📦") : null;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="no-scrollbar"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "4px",
        borderRadius: cleanStyle.borderRadius || "12px",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        cursor: "pointer",
        userSelect: "none",
        transition: "transform 0.15s ease",
        ...cleanStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "auto 0",
          gap: cleanStyle.gap || "4px",
          width: "100%",
          flexShrink: 0,
        }}
      >
        {/* Circular Icon / Image Pill */}
        <div
          style={{
            width: "36px",
            height: "36px",
            minWidth: "36px",
            minHeight: "36px",
            backgroundColor: cleanStyle.iconBackgroundColor || "#F3F4F6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            flexShrink: 0,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {effectiveImageUrl && !hasImageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={effectiveImageUrl}
              alt={label}
              onError={() => setHasImageError(true)}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <span>{displayIcon || icon || "📦"}</span>
          )}
        </div>

        {/* Category Label (Full multiline text wrap, no ellipsis truncation) */}
        <span
          style={{
            fontSize: cleanStyle.fontSize || "10px",
            fontWeight: cleanStyle.fontWeight || "600",
            color: cleanStyle.color || "#101F26",
            textAlign: "center",
            width: "100%",
            maxWidth: "100%",
            display: "block",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
            lineHeight: "13px",
            padding: "0 2px",
            boxSizing: "border-box",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
