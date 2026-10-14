"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { CanvasLayoutItem } from "./CanvasPanel";

interface PropertiesPanelProps {
  selectedItem: CanvasLayoutItem | null;
  onUpdateItem: (updated: CanvasLayoutItem) => void;
  onDeselect?: () => void;
}

/**
 * ==============================================================================
 * 🎓 Beginner Guide: Panel 3 (Properties Panel)
 * ==============================================================================
 * 
 * 1. WHAT IS THIS PANEL?
 *    This panel lets users customize and style any component selected on the Canvas.
 *    Even if a user knows ZERO JSON or coding, they can visually:
 *    - Edit text, headings, buttons, prices, and image URLs.
 *    - Pick background colors and text colors with instant visual swatches.
 *    - Adjust border-radius (corners), padding (spacing), font-size, and text alignment.
 *    - Configure click actions / URLs (e.g. navigation links).
 *    - Adjust the 100-column grid width (25%, 33%, 50%, 100%).
 * 
 * 2. TWO EDIT MODES:
 *    - 📝 Values Tab: Visual, beginner-friendly form controls.
 *    - 💻 JSON Tab: Raw SDUI schema editor with live syntax validation for advanced users.
 * 
 * 3. REAL-TIME SYNC:
 *    Every change updates the component state in Redux / Canvas, and immediately
 *    reflects live in Panel 4 (Live Phone / Desktop Preview).
 * ==============================================================================
 */

// Preset palette colors for fast one-click styling
const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Dark Slate", value: "#0f172a" },
  { label: "Zinc 900", value: "#18181b" },
  { label: "Emerald", value: "#059669" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Amber", value: "#d97706" },
  { label: "Rose Red", value: "#e11d48" },
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
}: PropertiesPanelProps) {
  // Mode Tab: "values" | "json"
  const [activeTab, setActiveTab] = useState<"values" | "json">("values");

  // Sub-section tab inside Values mode: "content" | "style" | "layout"
  const [activeSection, setActiveSection] = useState<"content" | "style" | "layout">("content");

  // Raw JSON editor state
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New custom property key & value state
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropVal, setNewPropVal] = useState("");
  const [showAddProp, setShowAddProp] = useState(false);

  // Keep JSON editor in sync when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setJsonText(JSON.stringify(selectedItem.config, null, 2));
      setJsonError(null);
      setSaveSuccess(false);
      setShowAddProp(false);
    }
  }, [selectedItem?.id, selectedItem?.config]);

  // ----------------------------------------------------------------------------
  // Helper 1: Update Data Field (e.g. title, price, imageUrl, label)
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Helper 2: Remove a Data Field
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Helper 3: Update Container Style (e.g. backgroundColor, color, borderRadius)
  // ----------------------------------------------------------------------------
  const handleStyleChange = (styleKey: string, value: string) => {
    if (!selectedItem) return;

    const currentStyle = selectedItem.config.containerStyle || {};
    const updatedConfig = {
      ...selectedItem.config,
      containerStyle: {
        ...currentStyle,
        [styleKey]: value,
      },
    };

    onUpdateItem({
      ...selectedItem,
      config: updatedConfig,
    });
  };

  // ----------------------------------------------------------------------------
  // Helper 4: Update 100-Column Grid Width (25%, 33%, 50%, 100%)
  // ----------------------------------------------------------------------------
  const handleWidthSpanChange = (span: number) => {
    if (!selectedItem) return;
    const clampedSpan = Math.max(1, Math.min(100, span));
    onUpdateItem({
      ...selectedItem,
      colSpan: clampedSpan,
      w: clampedSpan,
    });
  };

  // ----------------------------------------------------------------------------
  // Helper 5: Update Component Title / Display Name
  // ----------------------------------------------------------------------------
  const handleNameChange = (name: string) => {
    if (!selectedItem) return;
    onUpdateItem({
      ...selectedItem,
      name,
    });
  };

  // Helper: extract URL string from string or SDUIAction
  const getActionUrl = (action: any): string => {
    if (!action) return "";
    if (typeof action === "string") return action;
    return action.route || action.value || action.endpoint || "";
  };

  // ----------------------------------------------------------------------------
  // Helper 6: Update Action Link / URL (e.g. onTap navigation)
  // ----------------------------------------------------------------------------
  const handleActionChange = (actionType: string, url: string) => {
    if (!selectedItem) return;

    const currentActions = selectedItem.config.actions || {};
    onUpdateItem({
      ...selectedItem,
      config: {
        ...selectedItem.config,
        actions: {
          ...currentActions,
          [actionType]: url ? { type: "NAVIGATE", route: url } : undefined,
        },
      },
    });
  };

  // ----------------------------------------------------------------------------
  // Helper 7: Add a custom property without writing JSON
  // ----------------------------------------------------------------------------
  const handleAddCustomProperty = () => {
    if (!newPropKey.trim()) return;
    handleDataChange(newPropKey.trim(), newPropVal.trim());
    setNewPropKey("");
    setNewPropVal("");
    setShowAddProp(false);
  };

  // ----------------------------------------------------------------------------
  // Helper 8: Apply & Format Raw JSON
  // ----------------------------------------------------------------------------
  const handleApplyJson = () => {
    if (!selectedItem) return;

    try {
      const parsed = JSON.parse(jsonText);
      onUpdateItem({
        ...selectedItem,
        type: parsed.type || selectedItem.type,
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

  // Extract all data keys currently present
  const dataKeys = useMemo(() => {
    if (!selectedItem?.config?.data) return [];
    return Object.keys(selectedItem.config.data);
  }, [selectedItem?.config?.data]);

  const currentStyles = selectedItem?.config?.containerStyle || {};
  const currentActions = selectedItem?.config?.actions || {};

  return (
    <div className="h-full flex flex-col rounded-xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden select-none">
      {/* ====================================================================== */}
      {/* 1. Panel Header                                                        */}
      {/* ====================================================================== */}
      <div className="h-10 shrink-0 px-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-zinc-600 text-xs">⚙️</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 truncate">
            Properties
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedItem && (
            <button
              type="button"
              onClick={onDeselect}
              title="Deselect component"
              className="text-[10px] text-zinc-400 hover:text-zinc-700 transition px-1 rounded cursor-pointer"
            >
              ✕ Clear
            </button>
          )}
          <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600">
            Panel 3
          </span>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 2. Top Tabs: Values vs JSON                                            */}
      {/* ====================================================================== */}
      <div className="shrink-0 flex border-b border-zinc-100 px-3 pt-1.5 gap-2 bg-zinc-50/30">
        <button
          type="button"
          onClick={() => setActiveTab("values")}
          className={`pb-1.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "values"
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          📝 Visual Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("json")}
          className={`pb-1.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1 ${
            activeTab === "json"
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <span>💻 Raw JSON</span>
          {jsonError && (
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* ====================================================================== */}
      {/* 3. Panel Body                                                          */}
      {/* ====================================================================== */}
      <div className="flex-1 overflow-y-auto p-3">
        {!selectedItem ? (
          /* Empty State: No component selected */
          <div className="w-full h-full min-h-[240px] rounded-xl border-2 border-dashed border-zinc-200/90 bg-zinc-50/40 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-2.5">
              <span className="text-xl">👆</span>
            </div>
            <p className="text-xs font-semibold text-zinc-700">
              No Component Selected
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px] leading-relaxed">
              Click on any component on <strong>Panel 2 (Canvas)</strong> to edit its texts, colors, styling, and grid width here.
            </p>
          </div>
        ) : activeTab === "values" ? (
          /* ================================================================== */
          /* VALUES TAB: Visual Controls (No JSON Knowledge Needed!)             */
          /* ================================================================== */
          <div className="space-y-3.5">
            {/* Component Summary Pill */}
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/90 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">
                  {selectedItem.name || selectedItem.type}
                </span>
                <span className="text-[9px] text-zinc-400 font-mono">
                  Type: {selectedItem.type} • {selectedItem.category}
                </span>
              </div>
              <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[9px]">
                {selectedItem.colSpan || selectedItem.w || 100} / 100 Cols
              </span>
            </div>

            {/* Sub-Section Switcher (Content | Style | Layout) */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-zinc-100 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveSection("content")}
                className={`py-1 rounded-md transition text-center cursor-pointer ${
                  activeSection === "content"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                📄 Content
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("style")}
                className={`py-1 rounded-md transition text-center cursor-pointer ${
                  activeSection === "style"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                🎨 Style
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("layout")}
                className={`py-1 rounded-md transition text-center cursor-pointer ${
                  activeSection === "layout"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                📐 Layout
              </button>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* SUB-SECTION 1: CONTENT & DATA FIELDS                           */}
            {/* -------------------------------------------------------------- */}
            {activeSection === "content" && (
              <div className="space-y-3 animate-fade-in">
                {/* Component Name / Title */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                    Component Display Name
                  </label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Dynamic Data Fields (Renders ALL properties in config.data) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Content Properties ({dataKeys.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddProp(!showAddProp)}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                    >
                      {showAddProp ? "Cancel" : "+ Add Property"}
                    </button>
                  </div>

                  {/* Add Custom Property Form */}
                  {showAddProp && (
                    <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <div className="text-[10px] font-bold text-emerald-900">
                        Add New Property
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="Property name (e.g. discount)"
                          value={newPropKey}
                          onChange={(e) => setNewPropKey(e.target.value)}
                          className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 20% OFF)"
                          value={newPropVal}
                          onChange={(e) => setNewPropVal(e.target.value)}
                          className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomProperty}
                        className="w-full py-1 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                      >
                        Add to Component
                      </button>
                    </div>
                  )}

                  {dataKeys.length === 0 && !showAddProp && (
                    <div className="p-3 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 text-center">
                      <p className="text-[11px] text-zinc-500">
                        No content properties defined yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          handleDataChange("text", "Sample Text");
                        }}
                        className="mt-1.5 px-2.5 py-1 rounded bg-zinc-900 text-white text-[10px] font-semibold cursor-pointer"
                      >
                        + Add Default Text
                      </button>
                    </div>
                  )}

                  {/* Render all existing properties */}
                  {dataKeys.map((key) => {
                    const rawVal = selectedItem.config.data?.[key];
                    const strVal = typeof rawVal === "object" ? JSON.stringify(rawVal) : String(rawVal ?? "");
                    const isDescription = key.toLowerCase().includes("desc") || key.toLowerCase().includes("subtitle");
                    const isImage = key.toLowerCase().includes("image") || key.toLowerCase().includes("src");

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-zinc-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveDataField(key)}
                            title="Remove this property"
                            className="text-zinc-400 hover:text-red-500 text-[10px]"
                          >
                            ✕
                          </button>
                        </div>

                        {isDescription ? (
                          <textarea
                            rows={2}
                            value={strVal}
                            onChange={(e) => handleDataChange(key, e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={strVal}
                            onChange={(e) => handleDataChange(key, e.target.value)}
                            placeholder={`Enter ${key}...`}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                          />
                        )}

                        {/* Image Preview Thumbnail if URL */}
                        {isImage && strVal && (
                          <div className="mt-1 h-12 w-20 rounded border border-zinc-200 overflow-hidden bg-zinc-100 flex items-center justify-center">
                            <img
                              src={strVal}
                              alt="Preview"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Click / Navigation Action */}
                <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Tap Action / Link
                  </label>
                  <input
                    type="text"
                    value={getActionUrl(currentActions.onTap)}
                    onChange={(e) => handleActionChange("onTap", e.target.value)}
                    placeholder="e.g. /products/clothing or https://..."
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                  <span className="text-[9px] text-zinc-400 block">
                    Triggered when user clicks or taps this component.
                  </span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* SUB-SECTION 2: STYLE & APPEARANCE (Colors, Radius, Padding)    */}
            {/* -------------------------------------------------------------- */}
            {activeSection === "style" && (
              <div className="space-y-3.5 animate-fade-in">
                {/* 1. Background Color */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Background Color
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {currentStyles.backgroundColor || "default"}
                    </span>
                  </div>

                  {/* Color Swatch Picker */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="color"
                      value={
                        currentStyles.backgroundColor && currentStyles.backgroundColor.startsWith("#")
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
                        className={`h-5 px-1.5 rounded text-[9px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          currentStyles.backgroundColor === p.value
                            ? "border-zinc-900 ring-1 ring-zinc-900"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: p.value }}
                        ></span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Text Color */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Text Color
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {currentStyles.color || "inherit"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="color"
                      value={
                        currentStyles.color && currentStyles.color.startsWith("#")
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

                  <div className="flex flex-wrap gap-1">
                    {TEXT_COLOR_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleStyleChange("color", p.value)}
                        className={`h-5 px-1.5 rounded text-[9px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          currentStyles.color === p.value
                            ? "border-zinc-900 ring-1 ring-zinc-900"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: p.value }}
                        ></span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Border Radius (Corner Roundness) */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Corner Roundness
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {currentStyles.borderRadius || "default"}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: "Sharp", value: "0px" },
                      { label: "Rounded", value: "8px" },
                      { label: "Smooth", value: "16px" },
                      { label: "Pill", value: "9999px" },
                    ].map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => handleStyleChange("borderRadius", r.value)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                          currentStyles.borderRadius === r.value
                            ? "bg-zinc-900 text-white shadow-2xs"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Padding (Spacing inside component) */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Inner Padding
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {currentStyles.padding || "default"}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: "None", value: "0px" },
                      { label: "Compact", value: "8px" },
                      { label: "Normal", value: "16px" },
                      { label: "Spacious", value: "24px" },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleStyleChange("padding", p.value)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                          currentStyles.padding === p.value
                            ? "bg-zinc-900 text-white shadow-2xs"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Typography Size & Alignment */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Font Size &amp; Alignment
                  </label>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[
                      { label: "12px", value: "12px" },
                      { label: "14px", value: "14px" },
                      { label: "16px", value: "16px" },
                      { label: "20px", value: "20px" },
                    ].map((fs) => (
                      <button
                        key={fs.label}
                        type="button"
                        onClick={() => handleStyleChange("fontSize", fs.value)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                          currentStyles.fontSize === fs.value
                            ? "bg-zinc-900 text-white shadow-2xs"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {fs.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: "Left", value: "left" },
                      { label: "Center", value: "center" },
                      { label: "Right", value: "right" },
                    ].map((ta) => (
                      <button
                        key={ta.label}
                        type="button"
                        onClick={() => handleStyleChange("textAlign", ta.value)}
                        className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                          currentStyles.textAlign === ta.value
                            ? "bg-zinc-900 text-white shadow-2xs"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {ta.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* SUB-SECTION 3: LAYOUT & 100-COL GRID                           */}
            {/* -------------------------------------------------------------- */}
            {activeSection === "layout" && (
              <div className="space-y-3.5 animate-fade-in">
                {/* 100-Column Grid Width Span */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      100-Col Grid Width
                    </label>
                    <span className="text-xs font-mono font-bold text-zinc-900">
                      {selectedItem.colSpan || selectedItem.w || 100} Cols ({selectedItem.colSpan || selectedItem.w || 100}%)
                    </span>
                  </div>

                  {/* Preset Quick Width Buttons */}
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[
                      { label: "25% Quarter", span: 25 },
                      { label: "33% Third", span: 33 },
                      { label: "50% Half", span: 50 },
                      { label: "100% Full", span: 100 },
                    ].map((p) => {
                      const currentSpan = selectedItem.colSpan || selectedItem.w || 100;
                      const isActive = currentSpan === p.span;
                      return (
                        <button
                          key={p.span}
                          type="button"
                          onClick={() => handleWidthSpanChange(p.span)}
                          className={`py-1.5 px-1 text-center rounded text-[10px] font-semibold transition cursor-pointer ${
                            isActive
                              ? "bg-zinc-900 text-white shadow-2xs"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Range Slider for custom 1-100 span */}
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={selectedItem.colSpan || selectedItem.w || 100}
                    onChange={(e) => handleWidthSpanChange(Number(e.target.value))}
                    className="w-full accent-zinc-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-400 font-mono mt-0.5">
                    <span>1 col (1%)</span>
                    <span>50 cols (50%)</span>
                    <span>100 cols (100%)</span>
                  </div>
                </div>

                {/* 2. Component Height Dimension */}
                <div className="pt-2.5 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      Component Height
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {currentStyles.height || currentStyles.minHeight || "auto"}
                    </span>
                  </div>

                  {/* Preset Height Buttons */}
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {[
                      { label: "Auto (Fit)", value: "auto" },
                      { label: "44px (Compact)", value: "44px" },
                      { label: "80px (Card)", value: "80px" },
                      { label: "160px (Medium)", value: "160px" },
                      { label: "260px (Banner)", value: "260px" },
                      { label: "380px (Hero)", value: "380px" },
                    ].map((h) => {
                      const isActive =
                        currentStyles.height === h.value ||
                        (!currentStyles.height && h.value === "auto");
                      return (
                        <button
                          key={h.label}
                          type="button"
                          onClick={() => handleStyleChange("height", h.value === "auto" ? "" : h.value)}
                          className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                            isActive
                              ? "bg-zinc-900 text-white shadow-2xs"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {h.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Height Text Input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. 180px, 250px, auto..."
                      value={currentStyles.height || ""}
                      onChange={(e) => handleStyleChange("height", e.target.value)}
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                    {currentStyles.height && (
                      <button
                        type="button"
                        onClick={() => handleStyleChange("height", "")}
                        className="text-[10px] text-zinc-400 hover:text-red-500 px-1 cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Min Height & Custom Width Overrides */}
                <div className="pt-2.5 border-t border-zinc-100 space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-zinc-700">
                        Minimum Height (minHeight)
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {currentStyles.minHeight || "none"}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 60px, 120px..."
                      value={currentStyles.minHeight || ""}
                      onChange={(e) => handleStyleChange("minHeight", e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-zinc-700">
                        Custom Width (CSS Override)
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {currentStyles.width || "Default (Grid)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. 100%, 280px, auto..."
                        value={currentStyles.width || ""}
                        onChange={(e) => handleStyleChange("width", e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-400"
                      />
                      {currentStyles.width && (
                        <button
                          type="button"
                          onClick={() => handleStyleChange("width", "")}
                          className="text-[10px] text-zinc-400 hover:text-red-500 px-1 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid Coordinates Info Card */}
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Calculated Position
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-600">Row Number:</span>
                    <span className="font-mono font-bold text-zinc-900">
                      Row {(selectedItem.row || 0) + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-600">Column Range:</span>
                    <span className="font-mono font-bold text-zinc-900">
                      Col {selectedItem.col || 0} to {(selectedItem.col || 0) + (selectedItem.colSpan || 100)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================== */
          /* JSON TAB: Raw JSON Editor (For Advanced Users)                     */
          /* ================================================================== */
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                SDUI Schema JSON
              </span>
              <button
                type="button"
                onClick={handleFormatJson}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 font-semibold cursor-pointer"
              >
                Format JSON
              </button>
            </div>

            {/* Error Notification */}
            {jsonError && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono">
                ⚠️ {jsonError}
              </div>
            )}

            {/* Success Notification */}
            {saveSuccess && (
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold text-center">
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

            {/* Action Bar */}
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
