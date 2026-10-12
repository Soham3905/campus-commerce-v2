"use client";

import React, { useState, useEffect } from "react";
import type { PhoneMockupProps } from "./types";

/**
 * PhoneMockup — Interactive smartphone device frame with realistic notch & status bar.
 */
export function PhoneMockup({
  src,
  title = "Phone Preview",
  iframeKey = 0,
  iframeRef,
  heightClassName = "h-[680px] sm:h-[620px]",
  className = "",
}: PhoneMockupProps) {
  const [currentTime, setCurrentTime] = useState<string>("9:41");

  // Keep phone status bar time synced with real current local time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full max-w-[390px] mx-auto flex flex-col items-center animate-fade-in transition-all px-0.5 sm:px-0 ${className}`}
    >
      {/* Phone Outer Shell */}
      <div className="w-full rounded-[36px] sm:rounded-[44px] bg-zinc-900 p-2 sm:p-3 shadow-2xl ring-1 ring-zinc-800">
        {/* Phone Bezel with Notch */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-black border border-zinc-800">
          {/* Status Bar + Dynamic Island / Center Camera Notch */}
          <div className="relative flex items-center justify-between bg-zinc-900 px-4 sm:px-6 pt-2 pb-1.5 text-[10px] font-bold text-zinc-300 select-none">
            <span suppressHydrationWarning>{currentTime}</span>

            {/* Realistic Center Camera & Speaker Notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center gap-1.5 rounded-full bg-black px-2.5 py-0.5 ring-1 ring-zinc-800/80">
              <span className="h-2 w-2 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <span className="h-0.5 w-0.5 rounded-full bg-blue-500"></span>
              </span>
              <span className="h-1 w-8 rounded-full bg-zinc-900"></span>
            </div>

            <div className="flex items-center gap-1">
              <span>5G</span>
              <span className="h-2 w-3.5 rounded-2xs border border-zinc-300 p-0.2 flex items-center">
                <span className="h-full w-full bg-zinc-300 rounded-3xs"></span>
              </span>
            </div>
          </div>

          {/* The Embedded Iframe */}
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={src}
            title={title}
            className={`w-full bg-white border-0 no-scrollbar ${heightClassName}`}
            style={{ scrollbarWidth: "none" }}
          />

          {/* Phone Bottom Home Indicator Bar */}
          <div className="bg-zinc-900 py-1.5 flex justify-center">
            <div className="h-1 w-24 sm:w-28 rounded-full bg-zinc-600"></div>
          </div>
        </div>
      </div>

      <span className="mt-2 text-[11px] sm:text-xs text-zinc-400 font-mono">
        Mobile Phone View • 375px
      </span>
    </div>
  );
}

export default PhoneMockup;
