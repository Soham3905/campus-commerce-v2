"use client";

import React, { useState, useEffect } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CountDownTimerRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CountDownTimer" component in the SDUI tree.
 * Displays an active ticking countdown timer until a target date.
 * Label and text wrap naturally like Text component onto the next line
 * and overflow in the y-direction (no horizontal scrolling in x).
 */
export default function CountDownTimerRenderer({
  data = {},
  style = {},
  onClick,
  onExpire,
}: BaseRendererProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

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
    maxWidth,
    margin,
    whiteSpace,
    textOverflow,
    ...cleanStyle
  } = (style || {}) as any;

  useEffect(() => {
    const updateCountdown = () => {
      // Use targetDate or default to 3 days in the future
      const targetTime = data?.targetDate
        ? new Date(data.targetDate).getTime()
        : Date.now() + 1000 * 60 * 60 * 72;

      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft(data?.expiredText || "Offer Expired");
        if (onExpire && diff <= 0) {
          onExpire();
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, "0");

      if (data?.showDays === "true" || days > 0) {
        setTimeLeft(`${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
      } else {
        setTimeLeft(`${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data?.targetDate, data?.showDays, data?.expiredText, onExpire]);

  const textColor = cleanStyle.color || "#0D3540";

  return (
    <div
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "safe center" as any,
        justifyContent: "safe center" as any,
        textAlign: "center",
        gap: cleanStyle.gap || "4px",
        padding: cleanStyle.padding || "10px 16px",
        borderRadius: cleanStyle.borderRadius || "12px",
        border: cleanStyle.border || "1px solid #99F6E4",
        backgroundColor: cleanStyle.backgroundColor || "#F0FDFA",
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
      {data?.label ? (
        <span
          style={{
            display: "block",
            width: "100%",
            color: textColor,
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: "1.3",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {data.label}
        </span>
      ) : null}
      <div
        style={{
          display: "block",
          width: "100%",
          fontSize: cleanStyle.fontSize || "16px",
          fontWeight: "700",
          color: textColor,
          fontFamily:
            cleanStyle.fontFamily ||
            "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          letterSpacing: "0.04em",
          lineHeight: "1.3",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {timeLeft || "00h 00m 00s"}
      </div>
    </div>
  );
}
