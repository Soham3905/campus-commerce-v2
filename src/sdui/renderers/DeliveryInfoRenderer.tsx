"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: DeliveryInfoRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "DeliveryInfo" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function DeliveryInfoRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    flex,
    flexShrink,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  const daysOffset =
    typeof data?.daysOffset === "number"
      ? data.daysOffset
      : parseInt(String(data?.daysOffset || "7"), 10) || 7;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysOffset);
  const formatted = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const prefix = data?.prefix ?? "FREE delivery";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: cleanStyle.gap || "4px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        fontSize: cleanStyle.fontSize || "12px",
        color: cleanStyle.color || "#5E6E72",
        lineHeight: "1.3",
        ...cleanStyle,
      }}
    >
      <span style={{ flexShrink: 0 }}>🚚</span>
      <span style={{ fontWeight: "700" }}>{prefix}</span>
      <span>{formatted}</span>
    </div>
  );
}
