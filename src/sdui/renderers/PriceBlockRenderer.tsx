"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: PriceBlockRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "PriceBlock" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function PriceBlockRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    display,
    alignItems,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  const rawSellingPrice =
    data?.sellingPrice !== undefined && data?.sellingPrice !== null
      ? String(data.sellingPrice).trim()
      : "";
  const displaySellingPrice = rawSellingPrice
    ? rawSellingPrice.startsWith("₹") ||
      rawSellingPrice.toLowerCase().startsWith("rs") ||
      rawSellingPrice.toLowerCase().startsWith("inr")
      ? rawSellingPrice
      : `₹${rawSellingPrice}`
    : "₹0";

  const rawMrp =
    data?.mrp !== undefined && data?.mrp !== null
      ? String(data.mrp).trim()
      : "";
  const displayMrp = rawMrp
    ? rawMrp.startsWith("₹") ||
      rawMrp.toLowerCase().startsWith("rs") ||
      rawMrp.toLowerCase().startsWith("inr")
      ? rawMrp
      : `₹${rawMrp}`
    : null;

  const rawDiscount =
    data?.discount !== undefined && data?.discount !== null
      ? String(data.discount).trim()
      : "";

  let discountText: string | null = null;
  if (rawDiscount) {
    const upper = rawDiscount.toUpperCase();
    if (upper.includes("OFF")) {
      discountText = rawDiscount;
    } else if (rawDiscount.includes("%")) {
      discountText = `${rawDiscount} OFF`;
    } else {
      discountText = `${rawDiscount}% OFF`;
    }
  }

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: cleanStyle.gap || "8px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...cleanStyle,
      }}
    >
      <span
        style={{
          fontSize: cleanStyle.fontSize || "18px",
          fontWeight: cleanStyle.fontWeight || "700",
          color: cleanStyle.color || "inherit",
          lineHeight: "1.2",
          whiteSpace: "nowrap",
        }}
      >
        {displaySellingPrice}
      </span>
      {displayMrp && (
        <span
          style={{
            fontSize: "11px",
            color: "#888",
            textDecoration: "line-through",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          M.R.P: {displayMrp}
        </span>
      )}
      {discountText && (
        <span
          style={{
            fontSize: "11px",
            color: "#16a34a",
            fontWeight: "700",
            backgroundColor: "rgba(22,163,74,0.12)",
            padding: "2px 6px",
            borderRadius: "4px",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          {discountText}
        </span>
      )}
    </div>
  );
}
