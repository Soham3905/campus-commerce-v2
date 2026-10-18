"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { CanvasLayoutItem } from "./CanvasPanel";
import type { SDUINode } from "@/sdui/types";

interface PreviewPanelProps {
  layoutItems?: CanvasLayoutItem[];
  activeThemeId?: string;
  onClose?: () => void;
}

/**
 * ==============================================================================
 * 🎓 Beginner Guide: Panel 4 (Live Preview & Iframe Device Mockup)
 * ==============================================================================
 * 
 * 1. WHAT IS THIS PANEL?
 *    This panel renders the landing page you built on Panel 2 (Canvas) in REAL-TIME:
 *    - Mobile Phone View: Embedded inside a realistic smartphone iframe frame.
 *    - Desktop View: Click "Desktop View ↗" to open the full landing page in a
 *      dedicated browser tab with full monitor width!
 * 
 * 2. HOW THE IFRAME WORKS:
 *    - The phone frame embeds `/landing-content?mode=live&device=mobile`.
 *    - Whenever you drag, edit, or reorder blocks on the Canvas, `fullLandingSchema`
 *      is saved to `localStorage` and sent to the iframe via `postMessage`.
 *    - Both the phone iframe and any open desktop tabs update instantaneously!
 * ==============================================================================
 */
export default function PreviewPanel({
  layoutItems = [],
  activeThemeId = "theme1",
  onClose,
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("9:41");

  // Keep phone status bar time synced with real clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  // ----------------------------------------------------------------------------
  // 1. Convert Canvas Layout Items into Standard SDUI Schema Tree
  // ----------------------------------------------------------------------------
  const buildSDUINode = useCallback((item: CanvasLayoutItem): SDUINode => {
    const childrenNodes: SDUINode[] = [];
    if (item.children && item.children.length > 0) {
      childrenNodes.push(...item.children.map((child: CanvasLayoutItem) => buildSDUINode(child)));
    } else if (item.config.children && item.config.children.length > 0) {
      childrenNodes.push(...item.config.children);
    }

    const colSpan = item.colSpan || 100;
    const col = item.col || 0;
    const row = item.row || 0;

    return {
      ...item.config,
      type: item.type,
      data: item.config.data || {},
      containerStyle: {
        ...item.config.containerStyle,
        width: item.config.containerStyle?.width || (colSpan === 100 ? "100%" : `calc(${colSpan}% - 6px)`),
        ...(item.config.containerStyle?.height ? { height: item.config.containerStyle.height } : {}),
        ...(item.config.containerStyle?.minHeight ? { minHeight: item.config.containerStyle.minHeight } : {}),
      },
      placement: {
        mobile: {
          colStart: 1,
          colEnd: 101,
          rowStart: row + 1,
          rowEnd: row + 2,
        },
        desktop: {
          colStart: col + 1,
          colEnd: col + colSpan + 1,
          rowStart: row + 1,
          rowEnd: row + 2,
        },
      },
      ...(childrenNodes.length > 0 ? { children: childrenNodes } : {}),
    };
  }, []);

  // Reconstruct complete Landing Page schema
  const fullLandingSchema: SDUINode = useMemo(() => {
    return {
      type: "Home",
      containerStyle: {
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "12px",
        padding: "14px",
        backgroundColor: activeThemeId === "theme3" ? "#0F172A" : "#FFFFFF",
        color: activeThemeId === "theme3" ? "#FFFFFF" : "#18181B",
      },
      children: layoutItems.map(buildSDUINode),
    };
  }, [layoutItems, activeThemeId, buildSDUINode]);

  // ----------------------------------------------------------------------------
  // 2. Broadcast Live Schema to Iframe and LocalStorage in Real Time
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Save to localStorage for cross-tab sync (desktop new tab view)
      localStorage.setItem("campus_live_canvas_schema", JSON.stringify(fullLandingSchema));

      // 2. Send postMessage directly to embedded phone iframe
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "UPDATE_LIVE_SCHEMA",
            schema: fullLandingSchema,
          },
          "*"
        );
      }
    } catch (err) {
      console.warn("Live preview schema broadcast error:", err);
    }
  }, [fullLandingSchema]);

  // ----------------------------------------------------------------------------
  // 3. User Actions: Open Desktop View in New Tab & Refresh Iframe
  // ----------------------------------------------------------------------------
  const handleOpenDesktopTab = () => {
    if (typeof window !== "undefined") {
      window.open("/landing-content?mode=live&device=desktop", "_blank");
    }
  };

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden select-none">
      {/* ====================================================================== */}
      {/* 1. Panel Header Strip                                                  */}
      {/* ====================================================================== */}
      <div className="h-10 shrink-0 px-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-zinc-600 text-xs">📱</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 truncate">
            Live Preview
          </h2>
        </div>

        {/* Action Controls: Open in Desktop New Tab + Reload */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleRefreshIframe}
            title="Reload phone preview iframe"
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer text-xs"
          >
            🔄
          </button>

          <button
            type="button"
            onClick={handleOpenDesktopTab}
            title="Open landing page in full desktop browser tab"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50 active:scale-95 transition shadow-2xs cursor-pointer"
          >
            <span>🖥️</span>
            <span>Desktop ↗</span>
          </button>

          <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600">
            Panel 4
          </span>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close Preview Panel (Esc)"
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/80 transition cursor-pointer text-xs font-bold leading-none ml-1 flex items-center justify-center w-5 h-5 active:scale-95"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 2. Embedded Smartphone Mockup with Real Iframe                         */}
      {/* ====================================================================== */}
      <div className="flex-1 p-3 overflow-y-auto bg-zinc-100/70 flex flex-col items-center justify-center">
        {layoutItems.length === 0 ? (
          /* Empty Preview State */
          <div className="w-full h-full min-h-[320px] rounded-2xl border-2 border-dashed border-zinc-200/90 bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3 shadow-2xs">
              <span className="text-xl">📱</span>
            </div>
            <p className="text-xs font-bold text-zinc-800">
              Live Phone Iframe Ready
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[220px] leading-relaxed">
              Drag components from <strong>Panel 1</strong> onto <strong>Panel 2 (Canvas)</strong> to see your landing page appear inside this phone iframe!
            </p>
            <span className="mt-3 text-[10px] font-mono text-zinc-400 rounded-md bg-zinc-50 px-2 py-0.5 border border-zinc-200">
              Isolated Viewport • Real Touch &amp; Scroll
            </span>
          </div>
        ) : (
          /* Smartphone Device Mockup with Real Iframe inside */
          <div className="w-full max-w-[320px] my-auto flex flex-col items-center animate-fade-in">
            {/* Phone Outer Shell */}
            <div className="w-full rounded-[44px] bg-zinc-900 p-2 shadow-2xl ring-1 ring-zinc-800">
              {/* Phone Inner Bezel */}
              <div className="relative overflow-hidden rounded-[36px] bg-black border border-zinc-800 flex flex-col">
                {/* Status Bar + Dynamic Island Notch */}
                <div className="relative flex items-center justify-between bg-zinc-900 px-5 pt-2 pb-1.5 text-[10px] font-bold text-zinc-300 select-none">
                  <span suppressHydrationWarning>{currentTime}</span>

                  {/* Realistic Center Camera & Speaker Slit */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center gap-1.5 rounded-full bg-black px-2.5 py-0.5 ring-1 ring-zinc-800/80">
                    <span className="h-2 w-2 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <span className="h-0.5 w-0.5 rounded-full bg-blue-500"></span>
                    </span>
                    <span className="h-1 w-8 rounded-full bg-zinc-900"></span>
                  </div>

                  {/* 5G and Battery Icon */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px]">5G</span>
                    <span className="h-2 w-3.5 rounded-2xs border border-zinc-300 p-0.2 flex items-center">
                      <span className="h-full w-full bg-zinc-300 rounded-3xs"></span>
                    </span>
                  </div>
                </div>

                {/* The Embedded SDUI Live Preview Iframe */}
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src="/landing-content?mode=live&device=mobile"
                  title="Mobile Phone Live Preview"
                  className="w-full h-[470px] bg-white border-0 no-scrollbar transition-all"
                  style={{ scrollbarWidth: "none" }}
                  onLoad={() => {
                    // Send initial schema when iframe finishes loading
                    if (iframeRef.current?.contentWindow) {
                      iframeRef.current.contentWindow.postMessage(
                        {
                          type: "UPDATE_LIVE_SCHEMA",
                          schema: fullLandingSchema,
                        },
                        "*"
                      );
                    }
                  }}
                />

                {/* Bottom Home Indicator Bar */}
                <div className="bg-zinc-900 py-1.5 flex justify-center">
                  <div className="h-1 w-24 rounded-full bg-zinc-600"></div>
                </div>
              </div>
            </div>

            {/* Sub-label */}
            <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mobile Phone View (375px) • Live Iframe Sync</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
