"use client";

import React, { useState } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CouponCodeRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CouponCode" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function CouponCodeRenderer({ data = {}, style = {}, onCopy }: BaseRendererProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        border: "2px dashed #4caf50",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...style
      }}
    >
      <div>
        <h4 style={{ color: "#2e7d32", fontSize: "16px", margin: 0 }}>{data?.title}</h4>
        <p style={{ fontSize: "12px", color: "#555", margin: "4px 0 0 0" }}>{data?.description}</p>
      </div>
      <button
        onClick={handleCopy}
        style={{
          padding: "4px 10px",
          backgroundColor: copied ? "#81c784" : "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        {copied ? "Copied!" : (data?.copyLabel || "Copy Code")}
      </button>
    </div>
  );
}
