"use client";

import React from "react";
import Link from "next/link";
import type { IframeToolbarProps, ViewportMode } from "./types";

/**
 * IframeToolbar — Responsive switcher for desktop/tablet/phone modes, reload, and new tab.
 */
export function IframeToolbar({
  viewport,
  onViewportChange,
  onReload,
  src,
  newTabUrl,
  className = "",
  extraActions,
}: IframeToolbarProps) {
  const targetNewTabUrl = newTabUrl || src;

  return (
    <div
      className={`flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2 ${className}`}
    >
      {/* Device Mode Toggle Buttons */}
      <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50/70 p-0.5 shadow-2xs">
        <button
          type="button"
          onClick={() => onViewportChange("desktop")}
          className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
            viewport === "desktop"
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
          }`}
          title="Desktop View (Full Width)"
        >
          <span>🖥️</span>
          <span className="hidden md:inline">Desktop</span>
        </button>

        <button
          type="button"
          onClick={() => onViewportChange("tablet")}
          className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
            viewport === "tablet"
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
          }`}
          title="Tablet View (778px)"
        >
          <span>💻</span>
          <span className="hidden md:inline">Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => onViewportChange("phone")}
          className={`flex items-center gap-1 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition cursor-pointer ${
            viewport === "phone"
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
          }`}
          title="Mobile View (375px with Notch)"
        >
          <span>📱</span>
          <span className="hidden md:inline">Phone</span>
        </button>
      </div>

      {/* Utility Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={onReload}
          className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs transition active:scale-95 cursor-pointer"
          title="Reload Iframe"
        >
          <span>🔄</span>
          <span className="hidden sm:inline">Reload</span>
        </button>

        <Link
          href={targetNewTabUrl}
          target="_blank"
          className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-2xs transition"
          title="Open preview URL directly in new tab"
        >
          <span>↗️</span>
          <span className="hidden sm:inline">New Tab</span>
        </Link>

        {extraActions}
      </div>
    </div>
  );
}

export default IframeToolbar;
