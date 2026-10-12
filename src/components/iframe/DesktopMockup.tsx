"use client";

import React, { useState, useEffect } from "react";
import type { DesktopMockupProps } from "./types";

/**
 * DesktopMockup — Full-width desktop browser window mockup with traffic controls & interactive address bar.
 */
export function DesktopMockup({
  src,
  title = "Desktop Preview",
  iframeKey = 0,
  iframeRef,
  displayUrl,
  showAddressBar = true,
  isUrlEditable = true,
  onUrlSubmit,
  onResetUrl,
  onReload,
  customAddressBar,
  customHeaderRight,
  heightClassName = "h-[720px] sm:h-[760px]",
  className = "",
}: DesktopMockupProps) {
  const targetUrl = displayUrl || src;
  const [inputUrl, setInputUrl] = useState(targetUrl);

  // Sync input value whenever targetUrl changes
  useEffect(() => {
    setInputUrl(targetUrl);
  }, [targetUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (trimmed && onUrlSubmit) {
      onUrlSubmit(trimmed);
    }
  };

  const handleReset = () => {
    setInputUrl(targetUrl);
    onResetUrl?.();
  };

  const isModified = inputUrl.trim() !== targetUrl.trim();

  return (
    <div
      className={`w-full flex flex-col rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white shadow-sm overflow-hidden animate-fade-in transition-all ${className}`}
    >
      {/* Browser Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-3 sm:px-4 py-2 sm:py-2.5 gap-2">
        {/* Window Control Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400"></span>
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400"></span>
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400"></span>
          {onReload && (
            <button
              type="button"
              onClick={onReload}
              className="text-xs text-zinc-400 hover:text-zinc-700 transition p-1 ml-1 shrink-0 cursor-pointer"
              title="Refresh iframe"
            >
              ↻
            </button>
          )}
        </div>

        {/* Address Bar: Custom slot, Interactive Editable Form, or Static Pill */}
        {customAddressBar ? (
          customAddressBar
        ) : showAddressBar ? (
          isUrlEditable ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] sm:text-xs text-zinc-700 font-mono max-w-sm sm:max-w-md w-full shadow-2xs focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-300 transition"
            >
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL (e.g. /landing-content?theme=theme1)"
                className="flex-1 bg-transparent border-0 outline-hidden font-mono text-[11px] sm:text-xs text-zinc-700 placeholder-zinc-400 truncate"
              />
              {isModified && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] text-zinc-400 hover:text-zinc-700 px-1 py-0.5 rounded hover:bg-zinc-100 cursor-pointer"
                    title="Reset to default URL"
                  >
                    ✕
                  </button>
                  <button
                    type="submit"
                    className="text-[10px] bg-zinc-900 text-white hover:bg-zinc-800 px-1.5 py-0.5 rounded font-semibold cursor-pointer shadow-2xs"
                    title="Navigate to URL (Press Enter)"
                  >
                    Go ↵
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] sm:text-xs text-zinc-500 font-mono max-w-xs sm:max-w-sm w-full shadow-2xs truncate">
              <span className="text-zinc-400 shrink-0">🔒</span>
              <span className="truncate">{targetUrl}</span>
            </div>
          )
        ) : null}

        {/* Header Right Action/Badge */}
        {customHeaderRight ? (
          <div className="shrink-0">{customHeaderRight}</div>
        ) : !onReload ? null : (
          <div className="w-5" />
        )}
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
  );
}

export default DesktopMockup;
