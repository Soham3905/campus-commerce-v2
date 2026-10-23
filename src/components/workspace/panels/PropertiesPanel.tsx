"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { CanvasLayoutItem } from "./CanvasPanel";
import {
  getAllowedChildrenForType,
  syncChildrenLayoutItems,
  getDefaultPlacement,
  DEVICE_CONFIGS,
} from "./CanvasPanel";
import type { DeviceType, GridPlacement } from "@/sdui/types";
import { ALL_RULES } from "@/sdui/validators/rules";
import { validate } from "@/sdui/validators/validator";

export interface PropertiesPanelProps {
  selectedItem: CanvasLayoutItem | null;
  onUpdateItem: (updated: CanvasLayoutItem) => void;
  onDeselect?: () => void;
  onSelectItem?: (id: string | null) => void;
  onAddChild?: (targetNodeId: string, childType: string) => void;
  onDeleteChild?: (targetNodeId: string) => void;
  device?: DeviceType;
}

// Preset color palette for quick styling
const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Dark Slate", value: "#0f172a" },
  { label: "Zinc 900", value: "#18181b" },
  { label: "Emerald", value: "#059669" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Amber", value: "#d97706" },
  { label: "Rose", value: "#e11d48" },
  { label: "Transparent", value: "transparent" },
];

const TEXT_COLOR_PRESETS = [
  { label: "Dark", value: "#18181b" },
  { label: "White", value: "#ffffff" },
  { label: "Muted", value: "#71717a" },
  { label: "Emerald", value: "#059669" },
  { label: "Blue", value: "#2563eb" },
  { label: "Amber", value: "#d97706" },
];

export default function PropertiesPanel({
  selectedItem,
  onUpdateItem,
  onDeselect,
  onSelectItem,
  onAddChild,
  onDeleteChild,
  device = "desktop",
}: PropertiesPanelProps) {
  // Mode Tab: "visual" | "json"
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");

  // Visual sub-tabs: "content" | "style" | "layout"
  const [activeSection, setActiveSection] = useState<"content" | "style" | "layout">("content");

  // Raw JSON state
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Custom property field inputs
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropVal, setNewPropVal] = useState("");
  const [showAddProp, setShowAddProp] = useState(false);
  const [showAddChildDropdown, setShowAddChildDropdown] = useState(false);

  // Validator rule for selected component
  const currentRule = useMemo(() => {
    if (!selectedItem) return null;
    return ALL_RULES[selectedItem.type] || null;
  }, [selectedItem?.type]);

  // Allowed children from validator rules
  const allowedChildren = useMemo(() => {
    if (!selectedItem) return [];
    return getAllowedChildrenForType(selectedItem.type);
  }, [selectedItem?.type]);

  // Children synced with SDUI config tree
  const childrenList = useMemo(() => {
    if (!selectedItem || !selectedItem.config) return [];
    return syncChildrenLayoutItems(selectedItem.config);
  }, [selectedItem?.config]);

  // Keep JSON editor in sync when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setJsonText(JSON.stringify(selectedItem.config, null, 2));
      setJsonError(null);
      setSaveSuccess(false);
      setShowAddProp(false);
      setShowAddChildDropdown(false);
    }
  }, [selectedItem?.id, selectedItem?.config]);

  // Current styles
  const currentStyles = selectedItem?.config?.containerStyle || {};

  // ---------------------------------------------------------------------------
  // Helper: Update Component Display Name
  // ---------------------------------------------------------------------------
  const handleNameChange = (name: string) => {
    if (!selectedItem) return;
    onUpdateItem({
      ...selectedItem,
      name,
    });
  };

  // ---------------------------------------------------------------------------
  // Helper: Update Data Field (e.g. title, price, imageUrl, label)
  // ---------------------------------------------------------------------------
  const handleDataChange = (key: string, value: any) => {
    if (!selectedItem) return;

    const currentData = selectedItem.config.data || {};
    const updatedConfig = {
      ...selectedItem.config,
      data: {
        ...currentData,
        [key]: value,
      },
    };

    onUpdateItem({
      ...selectedItem,
      config: updatedConfig,
    });
  };

  // ---------------------------------------------------------------------------
  // Helper: Remove Data Field
  // ---------------------------------------------------------------------------
  const handleRemoveDataField = (key: string) => {
    if (!selectedItem) return;

    const currentData = { ...(selectedItem.config.data || {}) };
    delete currentData[key];

    onUpdateItem({
      ...selectedItem,
      config: {
        ...selectedItem.config,
        data: currentData,
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Helper: Update Container Style
  // If setting a solid backgroundColor, also clear preset backgroundImage so color is visible
  // ---------------------------------------------------------------------------
  const handleStyleChange = (styleKey: string, value: string) => {
    if (!selectedItem) return;

    const currentStyle = selectedItem.config.containerStyle || {};
    const newStyle: Record<string, any> = {
      ...currentStyle,
      [styleKey]: value,
    };

    if (styleKey === "backgroundColor") {
      newStyle.backgroundImage = "none";
    }

    if (value === "") {
      delete newStyle[styleKey];
    }

    onUpdateItem({
      ...selectedItem,
      config: {
        ...selectedItem.config,
        containerStyle: newStyle,
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Helper: Update Breakpoint-Aware Grid Column Span
  // ---------------------------------------------------------------------------
  const activeDevice = device || "desktop";
  const maxCols = DEVICE_CONFIGS[activeDevice]?.columns || 24;

  const currentPlacement: GridPlacement = useMemo(() => {
    if (!selectedItem) return { colStart: 1, colEnd: 25, rowStart: 1, rowEnd: 4 };
    return (
      selectedItem.placement?.[activeDevice] ||
      getDefaultPlacement(selectedItem.type, activeDevice, 1)
    );
  }, [selectedItem, activeDevice]);

  const currentColSpan = Math.max(
    1,
    currentPlacement.colEnd - currentPlacement.colStart
  );

  const handleGridSpanChange = (span: number) => {
    if (!selectedItem || !selectedItem.placement) return;

    const clampedSpan = Math.max(1, Math.min(maxCols, span));
    const safeColStart = Math.min(currentPlacement.colStart, maxCols - clampedSpan + 1);

    const newPlacement: GridPlacement = {
      ...currentPlacement,
      colStart: safeColStart,
      colEnd: safeColStart + clampedSpan,
    };

    onUpdateItem({
      ...selectedItem,
      placement: {
        ...selectedItem.placement,
        [activeDevice]: newPlacement,
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Helper: Update Action Navigation / Tap Link
  // ---------------------------------------------------------------------------
  const getActionUrl = (action: any): string => {
    if (!action) return "";
    if (typeof action === "string") return action;
    return action.route || action.value || action.endpoint || "";
  };

  const handleActionChange = (actionType: string, url: string) => {
    if (!selectedItem) return;

    const currentActions = selectedItem.config.actions || {};
    onUpdateItem({
      ...selectedItem,
      config: {
        ...selectedItem.config,
        actions: {
          ...currentActions,
          [actionType]: url.trim()
            ? { type: "NAVIGATE", route: url.trim() }
            : undefined,
        },
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Helper: Add Custom Property
  // ---------------------------------------------------------------------------
  const handleAddCustomProperty = () => {
    if (!newPropKey.trim()) return;
    handleDataChange(newPropKey.trim(), newPropVal.trim());
    setNewPropKey("");
    setNewPropVal("");
    setShowAddProp(false);
  };

  // ---------------------------------------------------------------------------
  // Helper: Apply Raw JSON with Schema Validation
  // ---------------------------------------------------------------------------
  const handleApplyJson = () => {
    if (!selectedItem) return;

    try {
      const parsed = JSON.parse(jsonText);

      if (!parsed || typeof parsed !== "object") {
        setJsonError("Invalid JSON: Root must be an object");
        return;
      }

      const targetType = parsed.type || selectedItem.type;
      const rule = ALL_RULES[targetType];

      // Validate against registered SDUI rule
      if (rule) {
        const validation = validate(parsed, rule);
        if (!validation.isValid) {
          setJsonError(validation.errors.join("; "));
          return;
        }
      }

      // Valid: Commit change
      onUpdateItem({
        ...selectedItem,
        type: targetType,
        config: parsed,
      });

      setJsonError(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax");
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || "Cannot format: invalid JSON syntax");
    }
  };

  // Extract all content data keys (merging rule fields and existing config data)
  const dataKeys = useMemo(() => {
    if (!selectedItem) return [];
    const fromConfig = Object.keys(selectedItem.config.data || {});
    const fromRule = currentRule?.fields ? Object.keys(currentRule.fields) : [];
    return Array.from(new Set([...fromRule, ...fromConfig]));
  }, [selectedItem, currentRule]);

  // Current tap action URL
  const currentTapUrl = useMemo(() => {
    if (!selectedItem?.config?.actions) return "";
    return getActionUrl(selectedItem.config.actions.onTap);
  }, [selectedItem?.config?.actions]);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl border border-zinc-200/90 shadow-2xs overflow-hidden select-none">
      {/* 1. Header Bar */}
      <div className="shrink-0 h-11 border-b border-zinc-200/80 px-3 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-zinc-900 truncate">
            {selectedItem ? selectedItem.name || selectedItem.type : "Inspector"}
          </span>
          {selectedItem && (
            <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 shrink-0">
              {selectedItem.type}
            </span>
          )}
        </div>

        {selectedItem && onDeselect && (
          <button
            type="button"
            onClick={onDeselect}
            title="Deselect component"
            className="text-[11px] text-zinc-400 hover:text-zinc-800 transition px-1.5 py-0.5 rounded cursor-pointer"
          >
            ✕ Deselect
          </button>
        )}
      </div>

      {/* 2. Mode Selector: Visual Editor vs Raw JSON */}
      <div className="shrink-0 flex border-b border-zinc-200/70 px-3 pt-1.5 gap-3 bg-zinc-50/30">
        <button
          type="button"
          onClick={() => setActiveTab("visual")}
          className={`pb-1.5 text-xs font-semibold border-b-2 transition cursor-pointer ${activeTab === "visual"
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
        >
          Visual Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("json")}
          className={`pb-1.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${activeTab === "json"
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
        >
          <span>Raw JSON</span>
          {jsonError && (
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* 3. Panel Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {!selectedItem ? (
          /* Empty State */
          <div className="w-full h-full min-h-[220px] rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-2xl mb-1.5">🎯</span>
            <p className="text-xs font-bold text-zinc-700">No Component Selected</p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[180px]">
              Click any element on the canvas to configure its content, styling, and layout.
            </p>
          </div>
        ) : activeTab === "visual" ? (
          /* Visual Editor Mode */
          <div className="space-y-3.5">
            {/* Visual Sub-tabs: Content | Style | Layout */}
            <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-zinc-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveSection("content")}
                className={`py-1.5 rounded-md transition text-center cursor-pointer ${activeSection === "content"
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-800"
                  }`}
              >
                Content
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("style")}
                className={`py-1.5 rounded-md transition text-center cursor-pointer ${activeSection === "style"
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-800"
                  }`}
              >
                Style
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("layout")}
                className={`py-1.5 rounded-md transition text-center cursor-pointer ${activeSection === "layout"
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-800"
                  }`}
              >
                Layout
              </button>
            </div>

            {/* ============================================================== */}
            {/* SUB-SECTION 1: CONTENT                                         */}
            {/* ============================================================== */}
            {activeSection === "content" && (
              <div className="space-y-3">
                {/* Component Name */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Dynamic Content Properties */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Properties ({dataKeys.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddProp(!showAddProp)}
                      className="text-[10px] text-zinc-600 hover:text-zinc-900 font-semibold cursor-pointer"
                    >
                      {showAddProp ? "Cancel" : "+ Add Field"}
                    </button>
                  </div>

                  {/* Add Field Inline Form */}
                  {showAddProp && (
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                      <input
                        type="text"
                        placeholder="Field key (e.g. badge, author)"
                        value={newPropKey}
                        onChange={(e) => setNewPropKey(e.target.value)}
                        className="w-full rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Field value"
                        value={newPropVal}
                        onChange={(e) => setNewPropVal(e.target.value)}
                        className="w-full rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomProperty}
                        className="w-full py-1 rounded bg-zinc-900 text-white text-[11px] font-bold cursor-pointer hover:bg-zinc-800"
                      >
                        Add Field
                      </button>
                    </div>
                  )}

                  {/* Dynamic inputs */}
                  {dataKeys.map((key) => {
                    const rawVal = selectedItem.config?.data?.[key];
                    const val = rawVal !== undefined ? rawVal : "";
                    const lowerKey = key.toLowerCase();
                    const isLongText =
                      lowerKey.includes("description") ||
                      lowerKey.includes("details") ||
                      lowerKey.includes("reviewtext");
                    const isImage =
                      (lowerKey.includes("image") ||
                        lowerKey.includes("iconurl") ||
                        lowerKey.includes("banner") ||
                        lowerKey === "src") &&
                      selectedItem.type !== "IFrame";
                    const isPrice =
                      lowerKey === "sellingprice" ||
                      lowerKey === "mrp" ||
                      lowerKey.includes("price") ||
                      lowerKey.includes("mrp");
                    const isDiscount = lowerKey.includes("discount");
                    const isNumber =
                      !isPrice &&
                      !isDiscount &&
                      (typeof val === "number" ||
                        lowerKey.includes("rating") ||
                        lowerKey.includes("count") ||
                        lowerKey.includes("score") ||
                        lowerKey.includes("interval"));
                    const isBoolean =
                      typeof val === "boolean" ||
                      lowerKey.startsWith("show") ||
                      lowerKey.startsWith("is") ||
                      lowerKey.startsWith("has") ||
                      lowerKey === "autoplay" ||
                      lowerKey === "infiniteloop" ||
                      lowerKey.includes("fullscreen");

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-zinc-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveDataField(key)}
                            className="text-[10px] text-zinc-400 hover:text-red-500 cursor-pointer"
                            title="Remove field"
                          >
                            ✕
                          </button>
                        </div>

                        {isBoolean ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Boolean(val)}
                              onChange={(e) => handleDataChange(key, e.target.checked)}
                              className="h-4 w-4 rounded accent-zinc-900 cursor-pointer"
                            />
                            <span className="text-xs text-zinc-600">
                              {val ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        ) : isPrice ? (
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-xs font-semibold text-zinc-500 select-none pointer-events-none">
                              ₹
                            </span>
                            <input
                              type="text"
                              value={String(val ?? "").replace(/[^0-9.]/g, "")}
                              onChange={(e) =>
                                handleDataChange(
                                  key,
                                  e.target.value.replace(/[^0-9.]/g, "")
                                )
                              }
                              placeholder="0"
                              className="w-full rounded-lg border border-zinc-200 bg-white pl-6 pr-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                            />
                          </div>
                        ) : isDiscount ? (
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={String(val ?? "").replace(/[^0-9.]/g, "")}
                              onChange={(e) =>
                                handleDataChange(
                                  key,
                                  e.target.value.replace(/[^0-9.]/g, "")
                                )
                              }
                              placeholder="0"
                              className="w-full rounded-lg border border-zinc-200 bg-white pl-2.5 pr-7 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                            />
                            <span className="absolute right-2.5 text-xs font-semibold text-zinc-500 select-none pointer-events-none">
                              %
                            </span>
                          </div>
                        ) : isLongText ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => handleDataChange(key, e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                          />
                        ) : isNumber ? (
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) =>
                                handleDataChange(
                                  key,
                                  e.target.value === "" ? "" : Number(e.target.value)
                                )
                              }
                              className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                            />
                            {lowerKey.includes("interval") && (
                              <span className="absolute right-2.5 text-[11px] font-semibold text-zinc-400 pointer-events-none select-none">
                                ms
                              </span>
                            )}
                          </div>
                        ) : key === "sections" && Array.isArray(val) ? (
                          <div className="space-y-2 pt-1">
                            {val.map((section: any, sIdx: number) => (
                              <div
                                key={sIdx}
                                className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase">
                                    Section {sIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = val.filter(
                                        (_: any, idx: number) => idx !== sIdx
                                      );
                                      handleDataChange(key, updated);
                                    }}
                                    className="text-[10px] text-zinc-400 hover:text-red-500 cursor-pointer"
                                    title="Delete section"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div>
                                  <label className="text-[10px] text-zinc-600 font-medium block mb-0.5">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    value={section.title || ""}
                                    onChange={(e) => {
                                      const updated = val.map((s: any, idx: number) =>
                                        idx === sIdx ? { ...s, title: e.target.value } : s
                                      );
                                      handleDataChange(key, updated);
                                    }}
                                    placeholder="Section Title"
                                    className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                                  />
                                </div>
                                <div className="space-y-1 pt-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-semibold text-zinc-400 uppercase">
                                      Links ({section.links?.length || 0})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newLinks = [
                                          ...(section.links || []),
                                          { label: "New Link", url: "#" },
                                        ];
                                        const updated = val.map((s: any, idx: number) =>
                                          idx === sIdx ? { ...s, links: newLinks } : s
                                        );
                                        handleDataChange(key, updated);
                                      }}
                                      className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                                    >
                                      + Add Link
                                    </button>
                                  </div>
                                  {(section.links || []).map((link: any, lIdx: number) => (
                                    <div key={lIdx} className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={link.label || ""}
                                        onChange={(e) => {
                                          const newLinks = (section.links || []).map(
                                            (l: any, idx: number) =>
                                              idx === lIdx
                                                ? { ...l, label: e.target.value }
                                                : l
                                          );
                                          const updated = val.map((s: any, idx: number) =>
                                            idx === sIdx ? { ...s, links: newLinks } : s
                                          );
                                          handleDataChange(key, updated);
                                        }}
                                        placeholder="Label"
                                        className="w-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs text-zinc-800 focus:outline-none"
                                      />
                                      <input
                                        type="text"
                                        value={link.url || ""}
                                        onChange={(e) => {
                                          const newLinks = (section.links || []).map(
                                            (l: any, idx: number) =>
                                              idx === lIdx
                                                ? { ...l, url: e.target.value }
                                                : l
                                          );
                                          const updated = val.map((s: any, idx: number) =>
                                            idx === sIdx ? { ...s, links: newLinks } : s
                                          );
                                          handleDataChange(key, updated);
                                        }}
                                        placeholder="URL"
                                        className="w-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-mono text-zinc-800 focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newLinks = (section.links || []).filter(
                                            (_: any, idx: number) => idx !== lIdx
                                          );
                                          const updated = val.map((s: any, idx: number) =>
                                            idx === sIdx ? { ...s, links: newLinks } : s
                                          );
                                          handleDataChange(key, updated);
                                        }}
                                        className="text-zinc-400 hover:text-red-500 text-[10px] px-0.5 cursor-pointer"
                                        title="Remove link"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newSec = {
                                  title: "New Section",
                                  links: [{ label: "Link 1", url: "#" }],
                                };
                                handleDataChange(key, [...val, newSec]);
                              }}
                              className="w-full py-1 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 text-xs font-semibold cursor-pointer transition text-center"
                            >
                              + Add Section
                            </button>
                          </div>
                        ) : key === "items" && Array.isArray(val) && selectedItem.type === "NavBar" ? (
                          <div className="space-y-2 pt-1">
                            {val.map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-zinc-600 uppercase">
                                    Tab {iIdx + 1}: {item.icon} {item.label}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = val.filter((_: any, idx: number) => idx !== iIdx);
                                      handleDataChange(key, updated);
                                    }}
                                    className="text-[10px] text-zinc-400 hover:text-red-500 cursor-pointer"
                                    title="Delete tab"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div>
                                    <label className="text-[10px] text-zinc-500 font-medium block mb-0.5">Label</label>
                                    <input
                                      type="text"
                                      value={item.label || ""}
                                      onChange={(e) => {
                                        const updated = val.map((it: any, idx: number) =>
                                          idx === iIdx ? { ...it, label: e.target.value } : it
                                        );
                                        handleDataChange(key, updated);
                                      }}
                                      className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-zinc-500 font-medium block mb-0.5">Icon</label>
                                    <input
                                      type="text"
                                      value={item.icon || ""}
                                      onChange={(e) => {
                                        const updated = val.map((it: any, idx: number) =>
                                          idx === iIdx ? { ...it, icon: e.target.value } : it
                                        );
                                        handleDataChange(key, updated);
                                      }}
                                      className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newTab = { label: "New Tab", icon: "⭐", isActive: "false" };
                                handleDataChange(key, [...val, newTab]);
                              }}
                              className="w-full py-1 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 text-xs font-semibold cursor-pointer transition text-center"
                            >
                              + Add Navigation Tab
                            </button>
                          </div>
                        ) : typeof val === "object" && val !== null ? (
                          <textarea
                            rows={3}
                            value={typeof val === "string" ? val : JSON.stringify(val, null, 2)}
                            onChange={(e) => {
                              try {
                                handleDataChange(key, JSON.parse(e.target.value));
                              } catch {
                                // keep raw string while typing
                              }
                            }}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-400"
                          />
                        ) : (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={val}
                              placeholder={
                                selectedItem.type === "IFrame" && key === "src"
                                  ? "https://www.youtube.com/embed/... or map embed URL"
                                  : ""
                              }
                              onChange={(e) => handleDataChange(key, e.target.value)}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                            />
                            {selectedItem.type === "IFrame" && key === "src" && (
                              <div className="space-y-1 pt-0.5">
                                <span className="text-[10px] text-zinc-400 block font-medium">
                                  💡 Embed Presets:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {[
                                    {
                                      label: "🗺️ Campus Map",
                                      url: "https://www.openstreetmap.org/export/embed.html?bbox=79.049%2C21.121%2C79.056%2C21.128&layer=mapnik",
                                    },
                                    {
                                      label: "🎥 YouTube",
                                      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                                    },
                                    {
                                      label: "🌐 Wikipedia",
                                      url: "https://en.wikipedia.org/wiki/Visvesvaraya_National_Institute_of_Technology",
                                    },
                                  ].map((preset) => (
                                    <button
                                      key={preset.label}
                                      type="button"
                                      onClick={() => handleDataChange("src", preset.url)}
                                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition cursor-pointer"
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {isImage && val && typeof val === "string" && (
                              <div className="relative h-14 w-full rounded border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={val}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tap Action / Link Navigation */}
                <div className="pt-2 border-t border-zinc-100 space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-700 block">
                    Tap Action / URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /cart, https://..., tel:..."
                    value={currentTapUrl}
                    onChange={(e) => handleActionChange("onTap", e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Allowed Children Section */}
                {allowedChildren.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Children ({childrenList.length})
                      </span>
                      {onAddChild && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowAddChildDropdown(!showAddChildDropdown)}
                            className="text-[11px] text-zinc-700 hover:text-zinc-900 font-semibold cursor-pointer"
                          >
                            {showAddChildDropdown ? "Close" : "+ Add Child"}
                          </button>

                          {showAddChildDropdown && (
                            <div className="absolute right-0 top-full mt-1 z-50 w-44 max-h-48 overflow-y-auto rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl py-1 text-xs">
                              {allowedChildren.map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    if (onAddChild && selectedItem.id) {
                                      onAddChild(selectedItem.id, type);
                                    }
                                    setShowAddChildDropdown(false);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 flex items-center justify-between text-zinc-200 hover:text-white hover:bg-zinc-800 text-[11px] cursor-pointer"
                                >
                                  <span>{type}</span>
                                  <span className="text-emerald-400 font-semibold">+</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Children List */}
                    {childrenList.length > 0 && (
                      <div className="space-y-1">
                        {childrenList.map((ch, idx) => (
                          <div
                            key={ch.id || idx}
                            className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition text-xs"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectItem && ch.id) onSelectItem(ch.id);
                              }}
                              className="flex items-center gap-1.5 text-zinc-700 hover:text-blue-600 font-semibold text-[11px] cursor-pointer truncate text-left flex-1"
                            >
                              <span className="text-zinc-400">└</span>
                              <span className="font-bold">{ch.type}</span>
                              {Boolean(
                                ch.config?.data?.label ||
                                ch.config?.data?.title ||
                                ch.config?.data?.altText ||
                                ch.config?.data?.text ||
                                ch.config?.data?.sellingPrice ||
                                ch.config?.data?.score ||
                                ch.config?.data?.prefix ||
                                (ch.type === "ProductCard" && (
                                  ch.config?.children?.find((c: any) => c.type === "Title")?.data?.text ||
                                  ch.config?.children?.find((c: any) => c.type === "Image")?.data?.altText ||
                                  ch.config?.data?.id
                                ))
                              ) && (
                                <span className="text-zinc-400 font-normal truncate max-w-[130px]">
                                  (
                                  {(ch.config?.data?.icon ? `${ch.config.data.icon} ` : "") +
                                    (ch.config?.data?.label ||
                                      ch.config?.data?.title ||
                                      ch.config?.data?.altText ||
                                      ch.config?.data?.text ||
                                      ch.config?.data?.sellingPrice ||
                                      ch.config?.data?.score ||
                                      ch.config?.data?.prefix ||
                                      (ch.type === "ProductCard" && (
                                        ch.config?.children?.find((c: any) => c.type === "Title")?.data?.text ||
                                        ch.config?.children?.find((c: any) => c.type === "Image")?.data?.altText ||
                                        ch.config?.data?.id
                                      )) || "")}
                                  )
                                </span>
                              )}
                            </button>

                            {onDeleteChild && ch.id && (
                              <button
                                type="button"
                                onClick={() => onDeleteChild(ch.id)}
                                title="Delete child"
                                className="text-zinc-400 hover:text-red-500 text-[10px] px-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-SECTION 2: STYLE                                           */}
            {/* ============================================================== */}
            {activeSection === "style" && (
              <div className="space-y-3.5">
                {/* 1. Background Color */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Background Color
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {currentStyles.backgroundColor || "default"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="color"
                      value={
                        currentStyles.backgroundColor?.startsWith("#")
                          ? currentStyles.backgroundColor
                          : "#ffffff"
                      }
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="h-7 w-8 rounded border border-zinc-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={currentStyles.backgroundColor || ""}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      placeholder="#ffffff or transparent"
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800"
                    />
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex flex-wrap gap-1">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleStyleChange("backgroundColor", p.value)}
                        className={`h-5 px-1.5 rounded text-[9px] font-semibold border transition cursor-pointer flex items-center gap-1 ${currentStyles.backgroundColor === p.value
                            ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                            : "border-zinc-200 hover:border-zinc-400 bg-white"
                          }`}
                      >
                        <span
                          className="h-2 w-2 rounded-full border border-black/10"
                          style={{ backgroundColor: p.value }}
                        />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Text Color */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Text Color
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {currentStyles.color || "inherit"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="color"
                      value={
                        currentStyles.color?.startsWith("#")
                          ? currentStyles.color
                          : "#18181b"
                      }
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      className="h-7 w-8 rounded border border-zinc-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={currentStyles.color || ""}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      placeholder="#18181b or inherit"
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800"
                    />
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex flex-wrap gap-1">
                    {TEXT_COLOR_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleStyleChange("color", p.value)}
                        className={`h-5 px-1.5 rounded text-[9px] font-semibold border transition cursor-pointer flex items-center gap-1 ${currentStyles.color === p.value
                            ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                            : "border-zinc-200 hover:border-zinc-400 bg-white"
                          }`}
                      >
                        <span
                          className="h-2 w-2 rounded-full border border-black/10"
                          style={{ backgroundColor: p.value }}
                        />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Typography & Font Size */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Font Size
                  </label>
                  <div className="grid grid-cols-5 gap-1 mb-1.5">
                    {["12px", "14px", "16px", "20px", "24px"].map((fs) => (
                      <button
                        key={fs}
                        type="button"
                        onClick={() => handleStyleChange("fontSize", fs)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.fontSize === fs
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {fs}
                      </button>
                    ))}
                  </div>

                  {/* Font Weight */}
                  <label className="text-[11px] font-semibold text-zinc-700 block mt-2 mb-1">
                    Font Weight
                  </label>
                  <div className="grid grid-cols-5 gap-1 mb-1.5">
                    {[
                      { label: "400", val: "400" },
                      { label: "500", val: "500" },
                      { label: "600", val: "600" },
                      { label: "700", val: "700" },
                      { label: "800", val: "800" },
                    ].map((fw) => (
                      <button
                        key={fw.val}
                        type="button"
                        onClick={() => handleStyleChange("fontWeight", fw.val)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.fontWeight === fw.val
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {fw.label}
                      </button>
                    ))}
                  </div>

                  {/* Text Alignment */}
                  <label className="text-[11px] font-semibold text-zinc-700 block mt-2 mb-1">
                    Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {["left", "center", "right"].map((ta) => (
                      <button
                        key={ta}
                        type="button"
                        onClick={() => handleStyleChange("textAlign", ta)}
                        className={`py-1 rounded text-[10px] font-semibold capitalize transition cursor-pointer ${currentStyles.textAlign === ta
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {ta}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Padding & Margin */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Padding
                  </label>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[
                      { label: "0px", val: "0px" },
                      { label: "8px", val: "8px" },
                      { label: "16px", val: "16px" },
                      { label: "24px", val: "24px" },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => handleStyleChange("padding", p.val)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.padding === p.val
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Margin
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: "0px", val: "0px" },
                      { label: "4px", val: "4px" },
                      { label: "8px", val: "8px" },
                      { label: "16px", val: "16px" },
                    ].map((m) => (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => handleStyleChange("margin", m.val)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.margin === m.val
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Border Radius & Border */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Corner Radius
                  </label>
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {[
                      { label: "0", val: "0px" },
                      { label: "8px", val: "8px" },
                      { label: "16px", val: "16px" },
                      { label: "24px", val: "24px" },
                      { label: "Full", val: "9999px" },
                    ].map((r) => (
                      <button
                        key={r.val}
                        type="button"
                        onClick={() => handleStyleChange("borderRadius", r.val)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.borderRadius === r.val
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  {/* Border Width */}
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Border Width
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {["0px", "1px", "2px", "4px"].map((bw) => (
                      <button
                        key={bw}
                        type="button"
                        onClick={() => {
                          handleStyleChange("borderWidth", bw);
                          if (!currentStyles.borderStyle && bw !== "0px") {
                            handleStyleChange("borderStyle", "solid");
                          }
                        }}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.borderWidth === bw
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {bw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Elevation / Shadow */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Shadow
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: "None", val: "none" },
                      { label: "Soft", val: "0 1px 3px rgba(0,0,0,0.08)" },
                      { label: "Card", val: "0 4px 12px rgba(0,0,0,0.12)" },
                      { label: "Large", val: "0 10px 25px rgba(0,0,0,0.15)" },
                    ].map((sh) => (
                      <button
                        key={sh.label}
                        type="button"
                        onClick={() => handleStyleChange("boxShadow", sh.val)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.boxShadow === sh.val ||
                            (!currentStyles.boxShadow && sh.val === "none")
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Image Fit (If Image component or has image) */}
                {(selectedItem.type.toLowerCase().includes("image") ||
                  currentStyles.objectFit) && (
                    <div className="pt-2 border-t border-zinc-100">
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Image Object Fit
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {["cover", "contain", "fill"].map((fit) => (
                          <button
                            key={fit}
                            type="button"
                            onClick={() => handleStyleChange("objectFit", fit)}
                            className={`py-1 rounded text-[10px] font-semibold capitalize transition cursor-pointer ${currentStyles.objectFit === fit
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                              }`}
                          >
                            {fit}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-SECTION 3: LAYOUT                                          */}
            {/* ============================================================== */}
            {activeSection === "layout" && (
              <div className="space-y-3.5">
                {/* 1. Grid Column Span (Root Blocks) */}
                {selectedItem.placement?.[activeDevice] && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-zinc-700 capitalize">
                        {activeDevice} Grid Columns ({maxCols} Max)
                      </label>
                      <span className="text-xs font-mono font-bold text-zinc-900">
                        {currentColSpan} / {maxCols} Cols
                      </span>
                    </div>

                    {/* Presets based on device columns */}
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {[
                        { label: "25%", span: Math.max(1, Math.round(maxCols * 0.25)) },
                        {
                          label: maxCols === 24 ? "33%" : "50%",
                          span: maxCols === 24 ? 8 : Math.round(maxCols * 0.5),
                        },
                        {
                          label: maxCols === 24 ? "50%" : "75%",
                          span: maxCols === 24 ? 12 : Math.round(maxCols * 0.75),
                        },
                        { label: "100%", span: maxCols },
                      ].map((p) => {
                        const isActive = currentColSpan === p.span;
                        return (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => handleGridSpanChange(p.span)}
                            className={`py-1.5 text-center rounded text-[10px] font-semibold transition cursor-pointer ${isActive
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                              }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Stepper / Slider */}
                    <input
                      type="range"
                      min="1"
                      max={maxCols}
                      step="1"
                      value={currentColSpan}
                      onChange={(e) => handleGridSpanChange(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                  </div>
                )}

                {/* 2. CSS Width */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Width
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {currentStyles.width || "auto"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[
                      { label: "Auto", val: "auto" },
                      { label: "100%", val: "100%" },
                      { label: "280px", val: "280px" },
                      { label: "340px", val: "340px" },
                      { label: "400px", val: "400px" },
                      { label: "Custom", val: "" },
                    ].map((w) => {
                      const isActive =
                        currentStyles.width === w.val ||
                        (!currentStyles.width && w.val === "auto");
                      return (
                        <button
                          key={w.label}
                          type="button"
                          onClick={() =>
                            handleStyleChange("width", w.val === "auto" ? "" : w.val)
                          }
                          className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${isActive
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            }`}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. 280px, 100%, max-content"
                    value={currentStyles.width || ""}
                    onChange={(e) => handleStyleChange("width", e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800"
                  />
                </div>

                {/* 3. CSS Height */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Height
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {currentStyles.height || "auto"}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 mb-1.5">
                    {[
                      { label: "Auto", val: "auto" },
                      { label: "44px", val: "44px" },
                      { label: "120px", val: "120px" },
                      { label: "260px", val: "260px" },
                    ].map((h) => {
                      const isActive =
                        currentStyles.height === h.val ||
                        (!currentStyles.height && h.val === "auto");
                      return (
                        <button
                          key={h.label}
                          type="button"
                          onClick={() =>
                            handleStyleChange("height", h.val === "auto" ? "" : h.val)
                          }
                          className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${isActive
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            }`}
                        >
                          {h.label}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. 180px, auto..."
                    value={currentStyles.height || ""}
                    onChange={(e) => handleStyleChange("height", e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800"
                  />
                </div>

                {/* 4. Minimum Height */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Min Height
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 60px, 120px..."
                    value={currentStyles.minHeight || ""}
                    onChange={(e) => handleStyleChange("minHeight", e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800"
                  />
                </div>

                {/* 5. Flex Gap for Containers */}
                {childrenList.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100">
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Child Spacing (Gap)
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {["0px", "8px", "16px", "24px"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleStyleChange("gap", g)}
                          className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${currentStyles.gap === g
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Layout Direction for Containers */}
                {childrenList.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100">
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Layout Direction
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: "Vertical (Column)", val: "column" },
                        { label: "Horizontal (Row)", val: "row" },
                      ].map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => handleStyleChange("flexDirection", d.val)}
                          className={`py-1.5 rounded text-[10px] font-semibold transition cursor-pointer ${(currentStyles.flexDirection === d.val) ||
                              (!currentStyles.flexDirection && d.val === "column")
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* RAW JSON MODE                                                   */
          /* ============================================================== */
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                SDUI Schema JSON
              </span>
              <button
                type="button"
                onClick={handleFormatJson}
                className="text-[10px] text-zinc-600 hover:text-zinc-900 font-semibold cursor-pointer"
              >
                Format JSON
              </button>
            </div>

            {/* Error Banner */}
            {jsonError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono leading-relaxed">
                ⚠️ {jsonError}
              </div>
            )}

            {/* Success Banner */}
            {saveSuccess && (
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold text-center">
                ✓ JSON applied successfully!
              </div>
            )}

            {/* Code Textarea */}
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                if (jsonError) setJsonError(null);
              }}
              rows={16}
              className="w-full flex-1 rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 font-mono text-[11px] p-3 leading-relaxed focus:outline-none focus:ring-1 focus:ring-zinc-700 selection:bg-zinc-700 resize-none no-scrollbar"
              spellCheck={false}
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setJsonText(JSON.stringify(selectedItem.config, null, 2));
                  setJsonError(null);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-800 cursor-pointer"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleApplyJson}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                Apply JSON Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
