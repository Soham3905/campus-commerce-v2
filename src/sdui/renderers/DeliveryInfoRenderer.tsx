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
export default function DeliveryInfoRenderer({ data = {}, style = {} }: BaseRendererProps) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data?.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });

  return (
    <p style={{ fontSize: "12px", color: "#333", ...style }}>
      🚚 <span style={{ fontWeight: "700" }}>{data?.prefix ?? "FREE delivery"}</span> {formatted}
    </p>
  );
}
