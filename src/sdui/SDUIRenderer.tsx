"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { DeviceType, SDUINode, SDUIAction, SDUIActions } from "./types";
import { fullPageJSON } from "./landingSchema";
import useSwipe from "./hooks/useSwipe";

// -----------------------------------------------------------------------------
// Import all 35 SDUI Component Renderers
// -----------------------------------------------------------------------------
import HeaderRenderer from "./renderers/HeaderRenderer";
import HeaderButtonRenderer from "./renderers/HeaderButtonRenderer";
import ProductCardRenderer from "./renderers/ProductCardRenderer";
import ImageRenderer from "./renderers/ImageRenderer";
import TitleRenderer from "./renderers/TitleRenderer";
import DescriptionRenderer from "./renderers/DescriptionRenderer";
import BadgeRenderer from "./renderers/BadgeRenderer";
import ScoreRenderer from "./renderers/ScoreRenderer";
import ReviewCountRenderer from "./renderers/ReviewCountRenderer";
import RatingRenderer from "./renderers/RatingRenderer";
import PriceBlockRenderer from "./renderers/PriceBlockRenderer";
import OfferTextRenderer from "./renderers/OfferTextRenderer";
import DeliveryInfoRenderer from "./renderers/DeliveryInfoRenderer";
import ButtonRenderer from "./renderers/ButtonRenderer";
import ShareButtonRenderer from "./renderers/ShareButtonRenderer";
import SearchBarRenderer from "./renderers/SearchBarRenderer";
import CategoryItemRenderer from "./renderers/CategoryItemRenderer";
import LabelRenderer from "./renderers/LabelRenderer";
import SponsoredRenderer from "./renderers/SponsoredRenderer";
import IconRenderer from "./renderers/IconRenderer";
import TextRenderer from "./renderers/TextRenderer";
import BoxRenderer from "./renderers/BoxRenderer";
import CategoryGridRenderer from "./renderers/CategoryGridRenderer";
import HeroBannerRenderer from "./renderers/HeroBannerRenderer";
import CarouselRenderer from "./renderers/CarouselRenderer";
import ProductListRenderer from "./renderers/ProductListRenderer";
import CountDownTimerRenderer from "./renderers/CountDownTimerRenderer";
import CouponCodeRenderer from "./renderers/CouponCodeRenderer";
import StoryRowRenderer from "./renderers/StoryRowRenderer";
import StoryCircleRenderer from "./renderers/StoryCircleRenderer";
import NavBarRenderer from "./renderers/NavBarRenderer";
import FooterRenderer from "./renderers/FooterRenderer";
import IFrameRenderer from "./renderers/IFrameRenderer";
import HomeRenderer from "./renderers/HomeRenderer";
import PageRenderer from "./renderers/PageRenderer";

/**
 * Helper to build lightweight dummy page schemas for bottom tab bar navigation
 */
const createDummyPage = (titleText: string, routeName: string): SDUINode => {
  const navBar = JSON.parse(JSON.stringify(fullPageJSON.children?.[1] || {}));

  if (navBar.data && navBar.data.items) {
    navBar.data.items.forEach((item: any) => {
      item.isActive = item.actions?.onTap?.route === routeName ? "true" : "false";
    });
  }

  return {
    type: "Home",
    children: [
      {
        type: "Page",
        children: [
          {
            type: "Title",
            placement: {
              mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 5 },
              tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 5 },
              desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 5 },
            },
            data: { text: titleText },
          },
        ],
      },
      navBar,
    ],
  };
};

const PageRoutes: Record<string, SDUINode> = {
  home: fullPageJSON,
  categories: createDummyPage("Categories Page 🗂️", "categories"),
  cart: createDummyPage("Cart Page 🛒", "cart"),
  account: createDummyPage("Account Page 👤", "account"),
};

const pageChildren = fullPageJSON?.children?.[0]?.children || [];

const TEMPLATES: Record<string, SDUINode> = {
  "Full Page": fullPageJSON,
  Header: pageChildren[0],
  "Search Bar": pageChildren[1],
  StoryRow: pageChildren[2],
  "Category Grid": pageChildren[3],
  "Carousel Only": pageChildren[4],
  HeroBanner: pageChildren[5],
  CouponCode: pageChildren[6],
  CountDownTimer: pageChildren[7],
  "Product List": pageChildren[8],
  "Product Grid": pageChildren[9],
  Footer: pageChildren[10],
  Navbar: fullPageJSON?.children?.[1] as SDUINode,
};

/**
 * Execute SDUI Action (API Call, Clipboard copy, etc.)
 */
async function executeOptionAction(option: { action?: SDUIAction }) {
  const action = option.action;
  if (!action) return;

  if (action.type === "API_CALL" && action.endpoint) {
    console.log(`[API_CALL] ${action.actionName || "Action"} -> ${action.endpoint}`);
    try {
      const response = await fetch(action.endpoint);
      if (!response.ok) throw new Error("API call failed");
      const json = await response.json();
      console.log("[API_CALL] Response:", json);
    } catch (err: any) {
      console.error("[API_CALL] Error:", err.message);
    }
    return;
  }

  if (action.type === "COPY_TO_CLIPBOARD" && action.value) {
    console.log(`[COPY_TO_CLIPBOARD] Copied: ${action.value}`);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(action.value);
    }
  }
}

// -----------------------------------------------------------------------------
// Component Registry Map (Links JSON `type` string to React Component)
// -----------------------------------------------------------------------------
const ComponentMap: Record<string, React.ComponentType<any>> = {
  Home: HomeRenderer,
  Image: ImageRenderer,
  Title: TitleRenderer,
  Description: DescriptionRenderer,
  Header: HeaderRenderer,
  HeaderButton: HeaderButtonRenderer,
  CategoryItem: CategoryItemRenderer,
  SearchBar: SearchBarRenderer,
  ShareButton: ShareButtonRenderer,
  Rating: RatingRenderer,
  Score: ScoreRenderer,
  ReviewCount: ReviewCountRenderer,
  Badge: BadgeRenderer,
  PriceBlock: PriceBlockRenderer,
  OfferText: OfferTextRenderer,
  DeliveryInfo: DeliveryInfoRenderer,
  Button: ButtonRenderer,
  Label: LabelRenderer,
  Sponsored: SponsoredRenderer,
  Icon: IconRenderer,
  Box: BoxRenderer,
  Text: TextRenderer,
  ProductList: ProductListRenderer,
  Carousel: CarouselRenderer,
  CategoryGrid: CategoryGridRenderer,
  HeroBanner: HeroBannerRenderer,
  CountDownTimer: CountDownTimerRenderer,
  CouponCode: CouponCodeRenderer,
  ProductCard: ProductCardRenderer,
  Page: PageRenderer,
  IFrame: IFrameRenderer,
  StoryRow: StoryRowRenderer,
  StoryCircle: StoryCircleRenderer,
  NavBar: NavBarRenderer,
  Footer: FooterRenderer,
};

export interface SDUIRendererProps {
  customSchema?: SDUINode | null;
  hideEditor?: boolean;
  defaultDevice?: DeviceType;
  autoDetectDevice?: boolean;
}

/**
 * ==============================================================================
 * SDUI Renderer Main Engine & Studio
 * ==============================================================================
 * Beginner Note:
 * This component is the brain of the Server-Driven UI system.
 * It does three things:
 * 1. Takes schema JSON data (either default fullPageJSON or customized).
 * 2. Recursively walks the tree, matches each node's "type" to its React Component,
 *    and calculates its exact 100-column grid position for mobile, tablet, or desktop.
 * 3. Handles interactive modals (Bottom Sheet, Image Preview Modal, Context Menu).
 */
export default function SDUIRenderer({
  customSchema = null,
  hideEditor = false,
  defaultDevice = "desktop",
  autoDetectDevice = true,
}: SDUIRendererProps) {
  const [activeTab, setActiveTab] = useState("Full Page");
  const [jsonText, setJsonText] = useState(
    JSON.stringify(customSchema || TEMPLATES["Full Page"], null, 2)
  );
  const [schema, setSchema] = useState<SDUINode>(customSchema || TEMPLATES["Full Page"]);
  const [deviceView, setDeviceView] = useState<DeviceType>(defaultDevice);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState<any>(null);
  const [sheetData, setSheetData] = useState<any>(null);
  const [imageModal, setImageModal] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync customSchema when provided
  useEffect(() => {
    if (customSchema) {
      setSchema(customSchema);
      setJsonText(JSON.stringify(customSchema, null, 2));
    }
  }, [customSchema]);

  // Auto-detect device viewport if inside responsive iframe or browser window
  useEffect(() => {
    if (!autoDetectDevice || typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceView("mobile");
      } else if (width < 1024) {
        setDeviceView("tablet");
      } else {
        setDeviceView("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [autoDetectDevice]);

  const handleNavigate = (route?: string) => {
    if (!route) return;
    console.log(`[SDUI Navigate] -> ${route}`);
    const newPageSchema = PageRoutes[route];
    if (newPageSchema) {
      setSchema(newPageSchema);
      setJsonText(JSON.stringify(newPageSchema, null, 2));
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setSchema(parsed);
      setError("");
    } catch {
      setError("Invalid JSON format. Please verify syntax.");
    }
  };

  const loadTemplate = (tabName: string) => {
    setActiveTab(tabName);
    const newJson = TEMPLATES[tabName];
    if (newJson) {
      setJsonText(JSON.stringify(newJson, null, 2));
      setSchema(newJson);
      setError("");
    }
  };

  const closeMenu = () => setMenu(null);
  const closeSheet = () => setSheetData(null);
  const closeImageModal = () => setImageModal(null);

  const handleOptionSelect = async (option: any) => {
    try {
      const action = option.action || {};

      if (action.type === "OPEN_BOTTOM_SHEET") {
        closeMenu();
        closeImageModal();
        setSheetData({
          title: action.data?.title,
          options: action.data?.options || [],
        });
        return;
      }

      if (action.type === "SHOW_IMAGE_MODAL" || action.type === "SHOW_IMAGE_PREVIEW") {
        closeMenu();
        closeSheet();
        setImageModal({
          imageUrl: action.data?.imageUrl,
        });
        return;
      }

      await executeOptionAction(option);
      closeMenu();
      closeSheet();
      closeImageModal();
    } catch (err: any) {
      setError(err.message || "Action failed");
    }
  };

  // If hideEditor is true, render a clean, full-width canvas (ideal for iframes)
  if (hideEditor) {
    return (
      <div className="relative w-full min-h-screen bg-white">
        <Renderer
          schema={schema}
          deviceType={deviceView}
          openMenu={setMenu}
          openSheet={setSheetData}
          openImageModal={setImageModal}
          onNavigate={handleNavigate}
        />
        <ContextMenu data={menu} onClose={closeMenu} onSelect={handleOptionSelect} />
        <BottomSheet
          isOpen={!!sheetData}
          data={sheetData}
          onClose={closeSheet}
          onSelect={handleOptionSelect}
        />
        <ImagePreviewModal
          data={imageModal}
          onClose={closeImageModal}
        />
      </div>
    );
  }

  // Otherwise, render the complete Studio layout with JSON editor and device switcher
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* -- LEFT PANEL: JSON EDITOR -- */}
      {isSidebarOpen && (
        <div
          style={{
            width: "28%",
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #2a2a35",
            background: "#13131f",
            zIndex: 20,
          }}
        >
          {/* Editor Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "#1a1a24",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #2a2a35",
            }}
          >
            <h3 style={{ fontSize: "13px", color: "#cdd6f4", fontWeight: "700" }}>
              ⚙️ SDUI Studio
            </h3>
            <button
              onClick={handleApplyJson}
              style={{
                padding: "6px 14px",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px",
                border: "none",
              }}
            >
              Apply Changes
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              padding: "10px",
              background: "#1e1e2e",
              borderBottom: "1px solid #2a2a35",
              overflowX: "auto",
            }}
          >
            {Object.keys(TEMPLATES).map((tab) => (
              <button
                key={tab}
                onClick={() => loadTemplate(tab)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: activeTab === tab ? "#4f46e5" : "transparent",
                  color: activeTab === tab ? "#fff" : "#a6accd",
                  border: activeTab === tab ? "none" : "1px solid #444",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: "rgba(220,38,38,0.15)",
                borderLeft: "3px solid #dc2626",
                color: "#fca5a5",
                padding: "10px",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* Text Area */}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              color: "#89dceb",
              fontSize: "11px",
              fontFamily: "monospace",
              border: "none",
              outline: "none",
              resize: "none",
            }}
          />
        </div>
      )}

      {/* -- RIGHT PANEL: DEVICE PREVIEWER -- */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f1f5f9" }}>
        {/* Navigation Bar */}
        <div
          style={{
            padding: "10px 20px",
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#334155",
              }}
              title="Toggle JSON Studio Editor"
            >
              ☰
            </button>
            <span
              style={{
                color: "#64748b",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "700",
              }}
            >
              Live SDUI Preview
            </span>
          </div>

          {/* Device Toggle Buttons */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <DeviceButton
              label="📱 Mobile"
              active={deviceView === "mobile"}
              onClick={() => setDeviceView("mobile")}
            />
            <DeviceButton
              label="📟 Tablet"
              active={deviceView === "tablet"}
              onClick={() => setDeviceView("tablet")}
            />
            <DeviceButton
              label="💻 Desktop"
              active={deviceView === "desktop"}
              onClick={() => setDeviceView("desktop")}
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: deviceView === "desktop" ? "0px" : "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: deviceView === "mobile" ? "375px" : deviceView === "tablet" ? "778px" : "100%",
              height: deviceView === "desktop" ? "100%" : "auto",
              minHeight: "680px",
              position: "relative",
              overflow: "hidden",
              boxShadow: deviceView !== "desktop" ? "0 20px 25px -5px rgba(0, 0, 0, 0.15)" : "none",
              borderRadius: deviceView !== "desktop" ? "24px" : "0",
              border: deviceView !== "desktop" ? "1px solid #cbd5e1" : "none",
              backgroundColor: "#ffffff",
            }}
          >
            <Renderer
              schema={schema}
              deviceType={deviceView}
              openMenu={setMenu}
              openSheet={setSheetData}
              openImageModal={setImageModal}
              onNavigate={handleNavigate}
            />
            <ContextMenu data={menu} onClose={closeMenu} onSelect={handleOptionSelect} />
            <BottomSheet
              isOpen={!!sheetData}
              data={sheetData}
              onClose={closeSheet}
              onSelect={handleOptionSelect}
            />
            <ImagePreviewModal
              data={imageModal}
              onClose={closeImageModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-Components & Action Modals
// -----------------------------------------------------------------------------

const DeviceButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 12px",
      background: active ? "#ffffff" : "transparent",
      color: active ? "#0f172a" : "#64748b",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "11px",
      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
      transition: "all 0.15s ease",
    }}
  >
    {label}
  </button>
);

const useLongPress = (onLongPress: (e: any) => void, onClick?: (e: any) => void, ms = 600) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressStarted = useRef(false);

  const start = useCallback(
    (e: any) => {
      isLongPressStarted.current = false;
      timerRef.current = setTimeout(() => {
        isLongPressStarted.current = true;
        onLongPress(e);
      }, ms);
    },
    [onLongPress, ms]
  );

  const stop = useCallback(
    (e: any) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!isLongPressStarted.current && onClick) {
        onClick(e);
      }
    },
    [onClick]
  );

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};

const ActionWrapper = ({
  actions,
  children,
  style,
}: {
  actions?: SDUIActions;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const fetchingRef = useRef(false);
  const lastScrollTime = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const clientWidth = e.currentTarget.clientWidth;
    const scrollWidth = e.currentTarget.scrollWidth;

    if (actions?.onScroll) {
      const debounceTime = actions.onScroll.debounceDuration || 1000;
      const now = Date.now();
      if (now - lastScrollTime.current > debounceTime) {
        lastScrollTime.current = now;
        executeOptionAction({ action: actions.onScroll });
      }
    }

    if (actions?.onEndReached) {
      const nearEndThreshold = actions.onEndReached.nearEndThreshold || 50;
      const nearEnd = scrollLeft + clientWidth >= scrollWidth - nearEndThreshold;
      if (nearEnd && !fetchingRef.current) {
        fetchingRef.current = true;
        setIsFetching(true);
        executeOptionAction({ action: actions.onEndReached });
        setTimeout(() => {
          fetchingRef.current = false;
          setIsFetching(false);
        }, 2000);
      }
    }
  };

  if (actions?.onScroll || actions?.onEndReached) {
    return (
      <div
        onScroll={handleScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          ...style,
        }}
      >
        {children}
        {isFetching && (
          <div
            style={{
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#f8fafc",
              border: "1.5px dashed #cbd5e1",
              borderRadius: "16px",
              padding: "16px",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: "20px", animation: "spin 1s linear infinite" }}>⏳</div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
              Loading more deals...
            </span>
          </div>
        )}
      </div>
    );
  }

  return <div style={style}>{children}</div>;
};

const ContextMenu = ({
  data,
  onClose,
  onSelect,
}: {
  data: any;
  onClose: () => void;
  onSelect: (opt: any) => void;
}) => {
  if (!data) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "12px", width: "200px", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "12px",
            borderBottom: "1px solid #f1f5f9",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          {data.title || "Actions"}
        </div>
        {data.options?.map((opt: any, i: number) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: i === data.options.length - 1 ? "none" : "1px solid #f8fafc",
              fontSize: "13px",
            }}
            onClick={() => onSelect(opt)}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BottomSheet = ({
  data,
  isOpen,
  onClose,
  onSelect,
}: {
  data: any;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (opt: any) => void;
}) => {
  if (!isOpen || !data) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          padding: "16px",
          animation: "slideUp 0.25s ease-out",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "4px",
            backgroundColor: "#cbd5e1",
            borderRadius: "2px",
            margin: "0 auto 12px",
          }}
        />
        <h3
          style={{
            textAlign: "center",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#1e293b",
          }}
        >
          {data.title || "Options"}
        </h3>

        <div style={{ display: "grid", gridAutoFlow: "column", gap: "10px" }}>
          {data.options?.map((option: any, idx: number) => (
            <div
              key={idx}
              onClick={() => {
                if (onSelect) onSelect(option);
                onClose();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  background: "#f1f5f9",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {option.icon}
              </div>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#475569" }}>
                {option.label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "8px",
            border: "none",
            background: "#f1f5f9",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ImagePreviewModal = ({
  data,
  onClose,
}: {
  data: any;
  onClose: () => void;
}) => {
  if (!data || !data.imageUrl) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        cursor: "pointer",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "280px",
          height: "280px",
          backgroundColor: "#000",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.imageUrl}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Recursive Component Dispatcher
// -----------------------------------------------------------------------------
interface RendererProps {
  schema: SDUINode;
  deviceType: DeviceType;
  openMenu: (data: any) => void;
  openSheet: (data: any) => void;
  openImageModal: (data: any) => void;
  onNavigate: (route?: string) => void;
}

const Renderer = ({
  schema,
  deviceType,
  openMenu,
  openSheet,
  openImageModal,
  onNavigate,
}: RendererProps) => {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (schema?.actions?.onMount) {
      executeOptionAction({ action: schema.actions.onMount });
    }
    return () => {
      if (schema?.actions?.onUnmount) {
        executeOptionAction({ action: schema.actions.onUnmount });
      }
    };
  }, [schema]);

  const handleError = () => {
    if (schema?.actions?.onError) {
      executeOptionAction({ action: schema.actions.onError });
    }
  };

  const handleExpire = () => {
    if (schema?.actions?.onExpire) {
      executeOptionAction({ action: schema.actions.onExpire });
    }
  };

  const handleCopy = () => {
    if (schema?.actions?.onCopy) {
      executeOptionAction({ action: schema.actions.onCopy });
    }
  };

  const longPressHandlers = useLongPress(() => {
    const lp = schema?.actions?.onLongPress;
    if (lp?.type === "SHOW_CONTEXT_MENU") {
      openMenu({
        title: lp.data?.title || "Actions",
        options: lp.data?.options || [],
        schema,
      });
    }
  });

  const handleTap = (e: React.MouseEvent) => {
    const tapAction = schema?.actions?.onTap;
    if (tapAction) {
      e.stopPropagation();
      if (tapAction.type === "OPEN_BOTTOM_SHEET") {
        openSheet({
          title: tapAction.data?.title,
          options: tapAction.data?.options || [],
          schema,
        });
      } else if (
        tapAction.type === "SHOW_IMAGE_MODAL" ||
        tapAction.type === "SHOW_IMAGE_PREVIEW"
      ) {
        if (openImageModal) {
          openImageModal({
            imageUrl: tapAction.data?.imageUrl || schema.data?.imageUrl,
          });
        }
      } else if (tapAction.type === "NAVIGATE") {
        if (onNavigate) {
          onNavigate(tapAction.route);
        }
      } else {
        executeOptionAction({ action: tapAction });
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (schema?.actions?.onHover) {
      executeOptionAction({ action: schema.actions.onHover });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (schema?.actions?.onHoverOut) {
      executeOptionAction({ action: schema.actions.onHoverOut });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (schema?.actions?.onChange) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      const debounceDuration = schema.actions.onChange.debounceDuration || 500;
      debounceTimer.current = setTimeout(() => {
        executeOptionAction({ action: schema.actions?.onChange });
      }, debounceDuration);
    }
  };

  const minSwipeDistance =
    schema?.actions?.onSwipeLeft?.minSwipeDistance ||
    schema?.actions?.onSwipeRight?.minSwipeDistance ||
    schema?.actions?.onSwipeUp?.minSwipeDistance ||
    schema?.actions?.onSwipeDown?.minSwipeDistance ||
    50;

  const swipeHandlers = useSwipe({
    onSwipeLeft: schema?.actions?.onSwipeLeft
      ? () => executeOptionAction({ action: schema.actions?.onSwipeLeft })
      : null,
    onSwipeRight: schema?.actions?.onSwipeRight
      ? () => executeOptionAction({ action: schema.actions?.onSwipeRight })
      : null,
    onSwipeUp: schema?.actions?.onSwipeUp
      ? () => executeOptionAction({ action: schema.actions?.onSwipeUp })
      : null,
    onSwipeDown: schema?.actions?.onSwipeDown
      ? () => executeOptionAction({ action: schema.actions?.onSwipeDown })
      : null,
    minSwipeDistance,
  });

  if (!schema) return null;

  const TargetComponent = ComponentMap[schema.type];
  if (!TargetComponent) {
    return <div style={{ color: "red", padding: "4px" }}>Unknown Component: {schema.type}</div>;
  }

  const hasSwipe =
    schema.actions?.onSwipeLeft ||
    schema.actions?.onSwipeRight ||
    schema.actions?.onSwipeUp ||
    schema.actions?.onSwipeDown;

  const interactionProps: any = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...(schema.actions?.onLongPress ? longPressHandlers : {}),
    ...(schema.actions?.onTap ? { onClick: handleTap } : {}),
    ...(schema.actions?.onChange ? { onChange: handleChange } : {}),
    ...(hasSwipe ? swipeHandlers : {}),
  };

  // ---------------------------------------------------------------------------
  // 100-Column Responsive Grid Calculator
  // ---------------------------------------------------------------------------
  let placementStyle: React.CSSProperties = {};
  if (schema.placement) {
    const coordinates = schema.placement[deviceType];
    if (coordinates) {
      // In CSS Grid, an explicit 100-track grid has line numbers 1 to 101.
      // colEnd: 100 stops at the start of column 100 (line 100).
      // Mapping colEnd === 100 to -1 (or 101) spans the full width to the right edge.
      const colEnd = coordinates.colEnd === 100 ? -1 : coordinates.colEnd;
      placementStyle = {
        ...placementStyle,
        gridColumn: `${coordinates.colStart} / ${colEnd}`,
        gridRow: `${coordinates.rowStart} / ${coordinates.rowEnd}`,
      };
    }
  }

  const stickyStyle: React.CSSProperties =
    schema.containerStyle?.position === "sticky"
      ? {
          position: "sticky",
          top: schema.containerStyle.top,
          bottom: schema.containerStyle.bottom,
          zIndex: schema.containerStyle.zIndex,
        }
      : {};

  return (
    <div style={{ ...placementStyle, ...stickyStyle }} {...interactionProps}>
      <ActionWrapper actions={schema.actions}>
        <TargetComponent
          data={schema.data}
          style={schema.containerStyle}
          actions={schema.actions}
          isHovered={isHovered}
          onError={handleError}
          onExpire={handleExpire}
          onCopy={handleCopy}
          onNavigate={onNavigate}
        >
          {schema.children &&
            schema.children.map((child: SDUINode, idx: number) => (
              <Renderer
                key={idx}
                schema={child}
                deviceType={deviceType}
                openMenu={openMenu}
                openSheet={openSheet}
                openImageModal={openImageModal}
                onNavigate={onNavigate}
              />
            ))}
        </TargetComponent>
      </ActionWrapper>
    </div>
  );
};
