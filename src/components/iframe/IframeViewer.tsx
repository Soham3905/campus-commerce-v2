"use client";

import React, { useState, useRef, useEffect } from "react";
import type { IframeViewerProps, ViewportMode } from "./types";
import { PhoneMockup } from "./PhoneMockup";
import { TabletMockup } from "./TabletMockup";
import { DesktopMockup } from "./DesktopMockup";
import { IframeToolbar } from "./IframeToolbar";

/**
 * IframeViewer — Universal reusable responsive iframe previewer.
 * Embeds any URL inside realistic Phone, Tablet, or Desktop device mockups.
 * Features an interactive editable address bar allowing live URL navigation.
 */
export function IframeViewer({
  src,
  title = "Iframe Preview",
  viewport: controlledViewport,
  onViewportChange,
  defaultViewport = "desktop",
  autoDetectViewport = true,
  showToolbar = true,
  extraToolbarActions,
  displayUrl,
  showAddressBar = true,
  isUrlEditable = true,
  onUrlChange,
  customAddressBar,
  customHeaderRight,
  newTabUrl,
  heightClassName,
  iframeKey: externalIframeKey,
  className = "",
}: IframeViewerProps) {
  // Uncontrolled viewport state
  const [internalViewport, setInternalViewport] = useState<ViewportMode>(defaultViewport);
  const [internalIframeKey, setInternalIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // User-edited URL state (entered in the desktop address bar)
  const [customUrl, setCustomUrl] = useState<string | null>(null);

  // When parent `src` changes (e.g. user clicked another theme in ThemeSlider), reset custom URL
  useEffect(() => {
    setCustomUrl(null);
  }, [src]);

  // Active URL loaded across all device mockups
  const activeSrc = customUrl || src;
  const activeDisplayUrl = customUrl || displayUrl || src;

  // Active viewport (controlled vs uncontrolled)
  const activeViewport = controlledViewport !== undefined ? controlledViewport : internalViewport;
  const combinedIframeKey = `${internalIframeKey}-${externalIframeKey ?? 0}`;

  // Auto-detect viewport from window width on mount if uncontrolled and enabled
  useEffect(() => {
    if (autoDetectViewport && controlledViewport === undefined && typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) {
        setInternalViewport("phone");
      } else if (width < 1024) {
        setInternalViewport("tablet");
      } else {
        setInternalViewport("desktop");
      }
    }
  }, [autoDetectViewport, controlledViewport]);

  const handleViewportChange = (mode: ViewportMode) => {
    if (onViewportChange) {
      onViewportChange(mode);
    }
    setInternalViewport(mode);
  };

  const handleReload = () => {
    setInternalIframeKey((prev) => prev + 1);
  };

  const handleUrlSubmit = (newUrl: string) => {
    const trimmed = newUrl.trim();
    if (trimmed) {
      setCustomUrl(trimmed);
      setInternalIframeKey((prev) => prev + 1);
      onUrlChange?.(trimmed);
    }
  };

  const handleResetUrl = () => {
    setCustomUrl(null);
    setInternalIframeKey((prev) => prev + 1);
  };

  return (
    <div className={`w-full flex flex-col space-y-4 ${className}`}>
      {/* Optional Top Toolbar */}
      {showToolbar && (
        <IframeToolbar
          viewport={activeViewport}
          onViewportChange={handleViewportChange}
          onReload={handleReload}
          src={activeSrc}
          newTabUrl={newTabUrl}
          extraActions={extraToolbarActions}
        />
      )}

      {/* Responsive Mockup Container */}
      <div className="w-full flex justify-center items-start">
        {activeViewport === "phone" && (
          <PhoneMockup
            src={activeSrc}
            title={`${title} (Phone)`}
            iframeKey={combinedIframeKey}
            iframeRef={iframeRef}
            heightClassName={heightClassName?.phone}
          />
        )}

        {activeViewport === "tablet" && (
          <TabletMockup
            src={activeSrc}
            title={`${title} (Tablet)`}
            iframeKey={combinedIframeKey}
            iframeRef={iframeRef}
            heightClassName={heightClassName?.tablet}
          />
        )}

        {activeViewport === "desktop" && (
          <DesktopMockup
            src={activeSrc}
            title={`${title} (Desktop)`}
            iframeKey={combinedIframeKey}
            iframeRef={iframeRef}
            displayUrl={activeDisplayUrl}
            showAddressBar={showAddressBar}
            isUrlEditable={isUrlEditable}
            onUrlSubmit={handleUrlSubmit}
            onResetUrl={handleResetUrl}
            customAddressBar={customAddressBar}
            customHeaderRight={customHeaderRight}
            onReload={handleReload}
            heightClassName={heightClassName?.desktop}
          />
        )}
      </div>
    </div>
  );
}

export default IframeViewer;
