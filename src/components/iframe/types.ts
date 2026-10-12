import type { RefObject, ReactNode } from "react";

export type ViewportMode = "desktop" | "tablet" | "phone";

export interface PhoneMockupProps {
  src: string;
  title?: string;
  iframeKey?: number | string;
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  heightClassName?: string;
  className?: string;
}

export interface TabletMockupProps {
  src: string;
  title?: string;
  iframeKey?: number | string;
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  heightClassName?: string;
  className?: string;
}

export interface DesktopMockupProps {
  src: string;
  title?: string;
  iframeKey?: number | string;
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  displayUrl?: string;
  showAddressBar?: boolean;
  isUrlEditable?: boolean;
  onUrlSubmit?: (url: string) => void;
  onResetUrl?: () => void;
  onReload?: () => void;
  customAddressBar?: ReactNode;
  customHeaderRight?: ReactNode;
  heightClassName?: string;
  className?: string;
}

export interface IframeToolbarProps {
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onReload: () => void;
  src: string;
  newTabUrl?: string;
  className?: string;
  extraActions?: ReactNode;
}

export interface IframeViewerProps {
  /** Target source URL loaded inside the iframe */
  src: string;
  /** Accessible title for screen readers */
  title?: string;
  /** Controlled viewport mode */
  viewport?: ViewportMode;
  /** Callback triggered when user toggles viewport (desktop/tablet/phone) */
  onViewportChange?: (mode: ViewportMode) => void;
  /** Uncontrolled initial viewport (defaults to "desktop" or auto-detected) */
  defaultViewport?: ViewportMode;
  /** Automatically detect user screen width to pick default mode */
  autoDetectViewport?: boolean;
  /** Whether to render top toolbar with device toggles, reload, and new tab */
  showToolbar?: boolean;
  /** Custom action buttons rendered in toolbar */
  extraToolbarActions?: ReactNode;
  /** URL text shown in Desktop address bar pill (defaults to `src`) */
  displayUrl?: string;
  /** Whether to show browser address bar pill in desktop mockup (defaults to true) */
  showAddressBar?: boolean;
  /** Whether the desktop browser address bar input is editable (defaults to true) */
  isUrlEditable?: boolean;
  /** Callback fired when user submits a new URL in the address bar */
  onUrlChange?: (newUrl: string) => void;
  /** Custom address bar element (replaces default pill if provided) */
  customAddressBar?: ReactNode;
  /** Custom right chrome element in desktop header */
  customHeaderRight?: ReactNode;
  /** URL opened when user clicks "New Tab" (defaults to `src`) */
  newTabUrl?: string;
  /** Custom heights for device mockups */
  heightClassName?: {
    phone?: string;
    tablet?: string;
    desktop?: string;
  };
  /** External key to trigger iframe reload */
  iframeKey?: number | string;
  /** Additional container styling */
  className?: string;
}

