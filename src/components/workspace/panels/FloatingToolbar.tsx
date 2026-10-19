"use client";

import React, { useState, useEffect } from "react";

export interface FloatingToolbarProps {
  title: string;
  type: string;
  isRoot?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  allowedChildren?: string[];
  positionBelow?: boolean;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  onAddChild?: (childType: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

/**
 * ==============================================================================
 * FloatingToolbar: Squarespace-inspired Component Action Bar
 * ==============================================================================
 * - Clean white background with subtle border and crisp shadow
 * - Functional directional controls: Up, Down, Left, Right
 * - Fast child addition dropdown (when allowed)
 * - Duplicate and Delete actions
 * - Automatically positions above or below to avoid canvas clipping
 * ==============================================================================
 */
export default function FloatingToolbar({
  title,
  type,
  isRoot = false,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  allowedChildren = [],
  positionBelow = false,
  onMove,
  onAddChild,
  onDuplicate,
  onDelete,
}: FloatingToolbarProps) {
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showAddDropdown) return;
    const close = () => setShowAddDropdown(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showAddDropdown]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={`absolute ${
        positionBelow ? "top-full mt-2" : "-top-11"
      } left-0 z-[100] flex items-center gap-1 bg-white text-zinc-800 px-2 py-1 rounded-xl shadow-lg border border-zinc-200/90 text-xs whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150`}
    >
      {/* 1. Component Title & Type */}
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 border-r border-zinc-200">
        <span className="font-bold text-zinc-900 text-[11px]">{title || type}</span>
      </div>

      {/* 2. Directional Controls (Move Up, Down, Left, Right) */}
      <div className="flex items-center gap-0.5 px-1 border-r border-zinc-200">
        {/* Move Left */}
        <button
          type="button"
          disabled={!canMoveLeft}
          onClick={() => onMove("left")}
          title="Move Left"
          className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Move Right */}
        <button
          type="button"
          disabled={!canMoveRight}
          onClick={() => onMove("right")}
          title="Move Right"
          className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Move Up */}
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={() => onMove("up")}
          title="Move Up"
          className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        {/* Move Down */}
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={() => onMove("down")}
          title="Move Down"
          className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 3. Add Child Dropdown (Only when children allowed) */}
      {allowedChildren.length > 0 && onAddChild && (
        <div className="relative px-1 border-r border-zinc-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddDropdown((prev) => !prev);
            }}
            title="Add Child Component"
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[11px] transition cursor-pointer shadow-2xs"
          >
            <span>+ Add</span>
            <span className="text-[8px] opacity-80">{showAddDropdown ? "▲" : "▼"}</span>
          </button>

          {showAddDropdown && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full left-0 mt-1.5 z-60 w-44 max-h-52 overflow-y-auto rounded-xl bg-white border border-zinc-200 shadow-xl py-1 text-xs animate-in fade-in"
            >
              <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                Allowed Children ({allowedChildren.length})
              </div>
              {allowedChildren.map((childType) => (
                <button
                  key={childType}
                  type="button"
                  onClick={() => {
                    onAddChild(childType);
                    setShowAddDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 flex items-center justify-between text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition text-[11px] cursor-pointer"
                >
                  <span>{childType}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Duplicate Action */}
      <button
        type="button"
        onClick={onDuplicate}
        title="Duplicate"
        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 transition cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>

      {/* 6. Delete Action */}
      <button
        type="button"
        onClick={onDelete}
        title="Delete"
        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
