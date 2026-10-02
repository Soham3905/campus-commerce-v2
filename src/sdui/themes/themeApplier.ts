import { SDUINode } from "../types";
import {
  homeThemes,
  headerThemes,
  searchBarThemes,
  storyRowThemes,
  categoryGridThemes,
  carouselThemes,
  heroBannerThemes,
  productCardThemes,
  productListThemes,
  buttonThemes,
  badgeThemes,
  boxThemes,
  footerThemes,
  navBarThemes,
} from "./index";

/**
 * ==============================================================================
 * Beginner Guide: How Theme Application Works
 * ==============================================================================
 * When a user picks a theme ("landing_schema", "clean_white", or "black_minimal"):
 * 1. Root & Page Styling: Sets the page background (white, dark slate, etc.).
 * 2. Section Replacement: Replaces each section (Header, Categories, Products, etc.)
 *    with the matching version from the theme JSON files.
 * 3. Text & Card Styling: Walks down every card, title, and button to ensure text
 *    colors have high contrast against the chosen background.
 * ==============================================================================
 */

// Simple color dictionary for text components in Dark and White modes
const TEXT_COLORS: Record<string, { dark: string; white: string }> = {
  Title: { dark: "#F8FAFC", white: "#0F172A" },
  Description: { dark: "#CBD5E1", white: "#334155" },
  PriceBlock: { dark: "#FFFFFF", white: "#0F172A" },
  Text: { dark: "#F8FAFC", white: "#0F172A" },
  Rating: { dark: "#94A3B8", white: "#64748B" },
  Score: { dark: "#94A3B8", white: "#64748B" },
  ReviewCount: { dark: "#38BDF8", white: "#2563EB" },
  DeliveryInfo: { dark: "#94A3B8", white: "#64748B" },
  OfferText: { dark: "#38BDF8", white: "#2563EB" },
  Label: { dark: "#F59E0B", white: "#64748B" },
  Sponsored: { dark: "#F59E0B", white: "#64748B" },
  StoryCircle: { dark: "#F8FAFC", white: "#0F172A" },
};

/**
 * Step 1: Recursively colors nested elements (cards, text, buttons)
 * so text is always readable (e.g. white text in dark mode).
 */
function applyThemeToSubtree(node: SDUINode, themeId: string) {
  if (!node || typeof node !== "object") return;

  const isDark = themeId === "black_minimal";
  const isWhite = themeId === "clean_white";

  // A. ProductCard styling (merges theme preset, preserves custom card styles)
  if (node.type === "ProductCard") {
    const cardTheme = (productCardThemes as any)[themeId]?.config;
    if (cardTheme?.containerStyle) {
      node.containerStyle = {
        ...cardTheme.containerStyle,
        ...node.containerStyle, // Local card style takes priority
        color: isDark ? "#F8FAFC" : isWhite ? "#0F172A" : (node.containerStyle?.color || cardTheme.containerStyle?.color),
      };
    }
    if (cardTheme?.data) {
      node.data = { ...cardTheme.data, ...node.data };
    }
  }

  // B. Badges and Buttons styling
  if (node.type === "Badge" || node.type === "Button") {
    const compTheme = (node.type === "Badge" ? badgeThemes : buttonThemes as any)[themeId]?.config;
    if (compTheme?.containerStyle) {
      node.containerStyle = { ...node.containerStyle, ...compTheme.containerStyle };
    }
  }

  // C. Text colors (look up from TEXT_COLORS table)
  const textColor = TEXT_COLORS[node.type];
  if (textColor) {
    const color = isDark ? textColor.dark : isWhite ? textColor.white : null;
    if (color) {
      node.containerStyle = { ...node.containerStyle, color };
    }
  }

  // D. Box containers in Dark mode (turn light backgrounds into dark slate)
  if (node.type === "Box" && isDark) {
    const bg = String(node.containerStyle?.backgroundColor || node.containerStyle?.background || "");
    if (bg.includes("#F8FAFC") || bg.includes("#FFFFFF") || bg.includes("#F6F6F4") || bg.includes("#FAFAF8")) {
      node.containerStyle = {
        ...node.containerStyle,
        backgroundColor: "#090D16",
        background: "#090D16",
        backgroundImage: "none",
        border: "1px solid #1E293B",
        color: "#F8FAFC",
      };
    }
  }

  // E. Image background in Dark mode
  if (node.type === "Image" && isDark) {
    const imgBg = node.containerStyle?.backgroundColor;
    if (imgBg === "#FAFAF8" || imgBg === "#FFFFFF" || imgBg === "#F6F6F4") {
      node.containerStyle = { ...node.containerStyle, backgroundColor: "#1E293B" };
    }
  }

  // Recursively process any nested children
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => applyThemeToSubtree(child, themeId));
  }
}

/**
 * Step 2: Builds the complete set of 11 page sections directly from theme JSON files.
 * Used if baseSchema is empty or missing.
 */
function buildDefaultThemedSections(themeId: string): SDUINode[] {
  const header = (headerThemes as any)[themeId]?.config;
  const boxes = (boxThemes as any)[themeId]?.config;
  const productList = (productListThemes as any)[themeId]?.config;
  const cardConfig = (productCardThemes as any)[themeId]?.config;

  const sections: (SDUINode | null | undefined)[] = [
    header?.topHeader || header,                                // 1. Top Header
    header?.searchHeader,                                       // 2. Search & Cart Header
    (storyRowThemes as any)[themeId]?.config,                  // 3. Story Circles
    (categoryGridThemes as any)[themeId]?.config,              // 4. Categories Grid
    (carouselThemes as any)[themeId]?.config,                  // 5. Featured Carousel
    (heroBannerThemes as any)[themeId]?.config,                // 6. Hero Banner
    boxes?.couponBox,                                          // 7. Coupons Strip (Box)
    boxes?.timerBox,                                           // 8. Timers Strip (Box)
    productList ? {                                            // 9. Product List Carousel
      ...productList,
      children: [cardConfig, cardConfig ? { ...cardConfig, data: { id: "p2" } } : null].filter(Boolean),
    } : null,
    boxes?.productGridBox,                                     // 10. Product Cards (Box)
    (footerThemes as any)[themeId]?.config,                    // 11. Footer
  ];

  return sections.filter(Boolean).map((s) => JSON.parse(JSON.stringify(s)));
}

/**
 * Step 3: Given an existing section, finds and returns the themed version of it.
 */
function getThemedSection(section: SDUINode, themeId: string): SDUINode {
  const header = (headerThemes as any)[themeId]?.config;
  const boxes = (boxThemes as any)[themeId]?.config;

  // 1. Headers: choose topHeader or searchHeader based on children
  if (section.type === "Header") {
    const isSearch = section.children?.some((c) => c.type === "SearchBar");
    const config = isSearch ? header?.searchHeader : (header?.topHeader || header);
    if (config) {
      return { ...JSON.parse(JSON.stringify(config)), placement: config.placement || section.placement };
    }
  }

  // 2. Boxes: choose couponBox, timerBox, or productGridBox based on children
  if (section.type === "Box") {
    let boxConfig = null;
    if (section.children?.some((c) => c.type === "CouponCode")) boxConfig = boxes?.couponBox;
    else if (section.children?.some((c) => c.type === "CountDownTimer")) boxConfig = boxes?.timerBox;
    else if (section.children?.some((c) => c.type === "ProductCard")) boxConfig = boxes?.productGridBox;

    if (boxConfig) {
      return { ...JSON.parse(JSON.stringify(boxConfig)), placement: boxConfig.placement || section.placement };
    }
  }

  // 3. Single-component sections: mapped directly to their theme JSON
  const THEME_MAP: Record<string, any> = {
    SearchBar: searchBarThemes,
    StoryRow: storyRowThemes,
    CategoryGrid: categoryGridThemes,
    Carousel: carouselThemes,
    HeroBanner: heroBannerThemes,
    ProductList: productListThemes,
    Footer: footerThemes,
  };

  const registry = THEME_MAP[section.type];
  if (registry) {
    const config = registry[themeId]?.config;
    if (config) {
      return {
        ...section,
        ...JSON.parse(JSON.stringify(config)),
        placement: config.placement || section.placement,
        children: section.children?.length ? section.children : config.children,
      };
    }
  }

  return section;
}

/**
 * Step 4 (Main Function): Applies the chosen theme to any SDUI schema.
 */
export function applyThemeToSchema(baseSchema?: SDUINode | null, themeId: string = "landing_schema"): SDUINode {
  const activeTheme = themeId || "landing_schema";
  const homeConfig = (homeThemes as any)[activeTheme]?.config;

  // 1. Initialize root Home and Page container
  let themedSchema: SDUINode = baseSchema && baseSchema.type
    ? JSON.parse(JSON.stringify(baseSchema))
    : {
        ...(homeConfig ? JSON.parse(JSON.stringify(homeConfig)) : { type: "Home" }),
        children: [{ type: "Page", containerStyle: {}, children: [] }],
      };

  // 2. Style root container background
  if (homeConfig?.containerStyle) {
    themedSchema.containerStyle = { ...themedSchema.containerStyle, ...homeConfig.containerStyle };
  }

  // 3. Ensure Page container exists and has theme background
  if (!Array.isArray(themedSchema.children) || themedSchema.children.length === 0) {
    themedSchema.children = [{ type: "Page", containerStyle: {}, children: [] }];
  }
  const pageContainer = themedSchema.children[0];
  if (pageContainer?.containerStyle) {
    if (activeTheme === "clean_white") {
      pageContainer.containerStyle = { ...pageContainer.containerStyle, backgroundColor: "#FFFFFF", color: "#0F172A" };
    } else if (activeTheme === "black_minimal") {
      pageContainer.containerStyle = { ...pageContainer.containerStyle, backgroundColor: "#090D16", color: "#F8FAFC" };
    }
  }

  // 4. Assemble Page sections (either re-theme existing ones or build from theme JSONs)
  const existingSections = pageContainer?.children;
  pageContainer.children = Array.isArray(existingSections) && existingSections.length > 0
    ? existingSections.map((section) => getThemedSection(section, activeTheme))
    : buildDefaultThemedSections(activeTheme);

  // 5. Update bottom Navigation Bar
  const navConfig = (navBarThemes as any)[activeTheme]?.config;
  if (navConfig) {
    themedSchema.children[1] = {
      ...JSON.parse(JSON.stringify(navConfig)),
      placement: navConfig.placement || themedSchema.children[1]?.placement,
    };
  }

  // 6. Deep styling pass: ensure all text, badges, cards have proper colors & contrast
  applyThemeToSubtree(themedSchema, activeTheme);

  return themedSchema;
}
