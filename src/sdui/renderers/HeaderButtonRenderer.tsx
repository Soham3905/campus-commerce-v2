"use client";

import React from "react";
import type { BaseRendererProps } from "../types";
import { NavBarContext } from "./NavBarRenderer";

/**
 * ==============================================================================
 * SDUI Renderer: HeaderButtonRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "HeaderButton" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function HeaderButtonRenderer({ data = {}, style = {}, onClick }: BaseRendererProps) {
  const isInsideNavBar = React.useContext(NavBarContext);

  const {
    height,
    minHeight,
    flex,
    flexShrink,
    whiteSpace,
    textOverflow,
    overflow,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  const isActive = data?.isActive === "true" || data?.isActive === true;
  const activeColor = cleanStyle.activeColor || "#0D3540";
  const inactiveColor = cleanStyle.inactiveColor || cleanStyle.color || "#6B7280";
  const effectiveColor = cleanStyle.color
    ? cleanStyle.color
    : isActive
      ? activeColor
      : inactiveColor;

  const direction = cleanStyle.flexDirection || (isInsideNavBar ? "column" : "row");
  const isColumn = direction === "column";

  return (
    <button
      type="button"
      onClick={onClick}
      className="no-scrollbar"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: cleanStyle.padding || "4px 8px",
        border: cleanStyle.border || "none",
        backgroundColor: cleanStyle.backgroundColor || "transparent",
        color: effectiveColor,
        fontSize: cleanStyle.fontSize || "12px",
        fontWeight: cleanStyle.fontWeight || (isActive ? "700" : "600"),
        cursor: "pointer",
        boxSizing: "border-box",
        overflow: "hidden",
        ...cleanStyle,
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxHeight: "100%",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: direction,
            alignItems: "center",
            justifyContent: "center",
            gap: cleanStyle.gap || (isColumn ? "2px" : "6px"),
            margin: "auto 0",
            width: "100%",
            flexShrink: 0,
          }}
        >
          {data?.icon && (
            <span
              style={{
                flexShrink: 0,
                fontSize:
                  cleanStyle.iconSize ||
                  (isColumn ? "18px" : undefined),
                lineHeight: 1,
              }}
            >
              {data.icon}
            </span>
          )}
          {(data?.label || data?.text) && (
            <span
              style={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                whiteSpace: whiteSpace && whiteSpace !== "nowrap" ? whiteSpace : "normal",
                lineHeight: isColumn ? "14px" : "16px",
                fontSize: cleanStyle.fontSize || (isColumn ? "10px" : undefined),
                fontWeight: cleanStyle.fontWeight || (isActive ? "700" : "600"),
                textAlign: "center",
              }}
            >
              {data?.label || data?.text}
            </span>
          )}
          {!data?.icon && !data?.label && !data?.text && "HeaderButton"}
        </div>
      </div>
    </button>
  );
}
