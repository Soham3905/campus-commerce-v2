import React from "react";

/**
 * ==============================================================================
 * SDUI (Server-Driven UI) Type Definitions
 * ==============================================================================
 * Beginner Note:
 * Server-Driven UI means the backend (or a JSON schema) dictates what components
 * appear on screen, where they are placed, and what data they contain.
 *
 * These TypeScript interfaces define the shape of that data so our code is safe,
 * reliable, and easy to understand.
 */

// -----------------------------------------------------------------------------
// 1. Device & Grid Placement Types
// -----------------------------------------------------------------------------

/** Supported viewport modes */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Grid coordinates on a virtual 100-column grid:
 * - colStart / colEnd: Column span (from 1 to 100)
 * - rowStart / rowEnd: Row span
 */
export interface GridPlacement {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

// -----------------------------------------------------------------------------
// 2. Action Types (User Interactions)
// -----------------------------------------------------------------------------

export interface SDUIAction {
  type:
    | "API_CALL"
    | "COPY_TO_CLIPBOARD"
    | "NAVIGATE"
    | "OPEN_BOTTOM_SHEET"
    | "SHOW_CONTEXT_MENU"
    | "SHOW_IMAGE_MODAL"
    | "SHOW_IMAGE_PREVIEW"
    | string;
  actionName?: string;
  endpoint?: string;
  value?: string;
  route?: string;
  debounceDuration?: number;
  minSwipeDistance?: number;
  nearEndThreshold?: number;
  data?: any;
}

export interface SDUIActions {
  onTap?: SDUIAction;
  onLongPress?: SDUIAction;
  onHover?: SDUIAction;
  onHoverOut?: SDUIAction;
  onMount?: SDUIAction;
  onUnmount?: SDUIAction;
  onScroll?: SDUIAction;
  onEndReached?: SDUIAction;
  onSwipeLeft?: SDUIAction;
  onSwipeRight?: SDUIAction;
  onSwipeUp?: SDUIAction;
  onSwipeDown?: SDUIAction;
  onDrag?: SDUIAction;
  onDrop?: SDUIAction;
  onFocus?: SDUIAction;
  onBlur?: SDUIAction;
  onSubmit?: SDUIAction;
  onChange?: SDUIAction;
  onError?: SDUIAction;
  onExpire?: SDUIAction;
  onCopy?: SDUIAction;
}

// -----------------------------------------------------------------------------
// 3. SDUI Node (The building block of the schema tree)
// -----------------------------------------------------------------------------

export interface SDUINode {
  type: string;
  containerStyle?: React.CSSProperties | Record<string, any>;
  placement?: Partial<Record<DeviceType, GridPlacement>>;
  actions?: SDUIActions;
  children?: SDUINode[];
  data?: any;
  statusCode?: number;
  statusMessage?: string;
}

// -----------------------------------------------------------------------------
// 4. Base Props for all 34 Renderers
// -----------------------------------------------------------------------------

/**
 * Standard props received by each individual component renderer
 * (e.g. HeaderRenderer, ProductCardRenderer, CategoryGridRenderer, etc.)
 */
export interface BaseRendererProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  data?: any;
  actions?: SDUIActions;
  isHovered?: boolean;
  onClick?: (e?: any) => void;
  onError?: () => void;
  onExpire?: () => void;
  onCopy?: () => void;
  onNavigate?: (route?: string) => void;
}
