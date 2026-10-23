"use client";

import React from "react";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: NavBarRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "NavBar" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export const NavBarContext = React.createContext<boolean>(false);

export default function NavBarRenderer({
  children,
  data = {},
  style = {},
  onClick,
  onNavigate,
}: BaseRendererProps) {
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const childrenArray = React.Children.toArray(children);
  const hasChildren = childrenArray.length > 0;
  const items = Array.isArray(data?.items) ? data.items : [];
  const hasItems = items.length > 0;

  // Empty state when no children and no items exist
  if (!hasChildren && !hasItems) {
    return (
      <nav
        onClick={onClick}
        role="navigation"
        aria-label="Navigation Bar"
        style={{
          position: cleanStyle.position || "sticky",
          bottom: cleanStyle.bottom !== undefined ? cleanStyle.bottom : 0,
          zIndex: cleanStyle.zIndex !== undefined ? cleanStyle.zIndex : 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "56px",
          backgroundColor: cleanStyle.backgroundColor || "#FFFFFF",
          borderTop: cleanStyle.borderTop || "1px solid #E5E7EB",
          borderRadius: cleanStyle.borderRadius || "0",
          color: "#64748B",
          padding: "8px 16px",
          boxSizing: "border-box",
          fontSize: "12px",
          gap: "6px",
          userSelect: "none",
          ...cleanStyle,
        }}
      >
        <span style={{ fontSize: "16px" }}>🧭</span>
        <span style={{ fontWeight: 600 }}>Navigation Bar is empty</span>
        <span style={{ fontSize: "11px", opacity: 0.7 }}>— Add HeaderButton to start</span>
      </nav>
    );
  }

  return (
    <NavBarContext.Provider value={true}>
      <nav
        onClick={onClick}
        role="navigation"
        aria-label="Navigation Bar"
        className="no-scrollbar"
        style={{
          position: cleanStyle.position || "sticky",
          bottom: cleanStyle.bottom !== undefined ? cleanStyle.bottom : 0,
          zIndex: cleanStyle.zIndex !== undefined ? cleanStyle.zIndex : 100,
          display: "flex",
          alignItems: "center",
          justifyContent: cleanStyle.justifyContent || "space-around",
          gap: cleanStyle.gap || "4px",
          width: "100%",
          height: "100%",
          minHeight: "56px",
          padding: cleanStyle.padding || "4px 8px",
          backgroundColor: cleanStyle.backgroundColor || "#FFFFFF",
          borderTop: cleanStyle.borderTop || "1px solid #E5E7EB",
          boxShadow: cleanStyle.boxShadow || "0 -1px 3px rgba(16, 31, 38, 0.05)",
          boxSizing: "border-box",
          overflow: cleanStyle.overflow || "visible",
          ...cleanStyle,
        }}
      >
        {hasChildren
          ? childrenArray.map((child, idx) => (
              <div
                key={idx}
                style={{
                  flex: "1 1 0",
                  minWidth: "48px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                {child}
              </div>
            ))
          : items.map((item: any, idx: number) => {
              const isActive =
                item.isActive === "true" || item.isActive === true;
              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.actions?.onTap?.type === "NAVIGATE" && onNavigate) {
                      onNavigate(item.actions.onTap.route);
                    }
                  }}
                  style={{
                    flex: "1 1 0",
                    minWidth: "48px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    cursor: "pointer",
                    color: isActive ? "#0D3540" : "#6B7280",
                    boxSizing: "border-box",
                    padding: "4px 2px",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: isActive ? "700" : "500",
                      lineHeight: "14px",
                      textAlign: "center",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
      </nav>
    </NavBarContext.Provider>
  );
}
