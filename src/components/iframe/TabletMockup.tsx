"use client";

import React from "react";
import type { TabletMockupProps } from "./types";

/**
 * TabletMockup — Sleek tablet mockup frame with camera dot bezel.
 */
export function TabletMockup({
  src,
  title = "Tablet Preview",
  iframeKey = 0,
  iframeRef,
  heightClassName = "h-[620px] sm:h-[660px]",
  className = "",
}: TabletMockupProps) {
  return (
    <div
      className={`w-full max-w-[778px] mx-auto flex flex-col items-center animate-fade-in transition-all px-0.5 sm:px-0 ${className}`}
    >
      <div className="w-full rounded-2xl sm:rounded-[32px] bg-zinc-900 p-2 sm:p-3.5 shadow-2xl ring-1 ring-zinc-800">
        {/* Tablet Bezel */}
        <div className="overflow-hidden rounded-xl sm:rounded-[24px] bg-white border border-zinc-800">
          {/* Tablet Top Camera Notch Dot */}
          <div className="bg-zinc-900 py-1.5 flex justify-center items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-800 border border-zinc-700"></span>
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
        </div>
      </div>

      <span className="mt-2 text-[11px] sm:text-xs text-zinc-400 font-mono">
        Tablet View • 778px
      </span>
    </div>
  );
}

export default TabletMockup;
