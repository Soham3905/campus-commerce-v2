"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { IframeViewer, type ViewportMode } from "@/components/iframe";

/**
 * ==============================================================================
 * Route: /pages/dummy
 * ==============================================================================
 * Beginner Note:
 * This page embeds "/dummy-content" inside the modular <IframeViewer />.
 *
 * Responsiveness Highlights:
 * 1. Auto-detects device screen width on initial load (Mobile, Tablet, or Desktop).
 * 2. Mobile Phone view features an interactive iPhone mockup with realistic notch.
 * 3. Tablet view features a sleek tablet bezel with top camera.
 * 4. Desktop view features a full-width browser window mockup with address bar.
 * 5. Uses the shared @/components/iframe modular component folder.
 */
export default function DummyPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-800 flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* 1. Global Header Bar */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* 2. Main Dashboard Layout (Sidebar + Content Area) */}
      <div className="flex flex-1 relative">
        <Sidebar
          activeItem="dummy"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-2.5 sm:p-5 lg:p-6 w-full space-y-3 sm:space-y-4 overflow-x-hidden flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-xl border border-zinc-200/90 shadow-2xs">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-zinc-900">
                Dummy Page
              </h1>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-800">
                Iframe Embed
              </span>
            </div>
          </div>

          {/* Reusable Responsive Iframe Viewer */}
          <div className="flex-1 min-h-[600px] sm:min-h-[750px] pb-4 sm:pb-6">
            <IframeViewer
              src="/dummy-content"
              title="Dummy Content Preview"
              viewport={viewport}
              onViewportChange={setViewport}
              displayUrl="https://campus-commerce.vnit/dummy-content"
              showToolbar={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}


