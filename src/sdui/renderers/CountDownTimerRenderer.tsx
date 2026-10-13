"use client";

import React, { useState, useEffect } from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CountDownTimerRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "CountDownTimer" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function CountDownTimerRenderer({ data = {}, style = {}, onExpire }: BaseRendererProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

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

      if (data?.showDays === "true") {
        setTimeLeft(`${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
      } else {
        setTimeLeft(`${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data?.targetDate, data?.showDays, data?.expiredText, onExpire]);

  const textColor = style?.color || "#856404";

  return (
    <div
      style={{
        padding: "12px 20px",
        backgroundColor: "#fff3cd",
        borderRadius: "12px",
        border: "1px solid #ffeeba",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        ...style
      }}
    >
      {data?.label ? (
        <span
          style={{
            color: textColor,
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "4px"
          }}
        >
          {data.label}
        </span>
      ) : null}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: textColor,
          fontFamily: style?.fontFamily || "'IBM Plex Mono', monospace",
          letterSpacing: "0.04em"
        }}
      >
        {timeLeft || "00h 00m 00s"}
      </div>
    </div>
  );
}
