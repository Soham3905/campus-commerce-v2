/**
 * ==============================================================================
 * 🎓 Beginner Guide: Master SDUI Theme Registry
 * ==============================================================================
 * 
 * 1. What is this file?
 *    Think of this file as the central library or catalog for our entire UI system.
 *    Our app has 35 building blocks called "SDUI Components" (such as Button, Title,
 *    Image, ProductCard, etc.).
 *
 * 2. How do the 35 Theme JSON files work?
 *    Each component has its own JSON file (e.g., `titleThemes.json`, `buttonThemes.json`).
 *    Inside each JSON file, there are 3 theme variations:
 *    - `theme1`: Classic Campus Teal (our default brand style)
 *    - `theme2`: Clean Minimalist White (modern bright style)
 *    - `theme3`: Obsidian Dark Mode (sleek dark mode)
 *
 * 3. What does each theme variation have?
 *    - `id`: "theme1", "theme2", or "theme3"
 *    - `name`: Name of the component (e.g. "Title", "Button")
 *    - `previewColor`: The color badge shown in the theme picker
 *    - `config`: The default configuration, including `containerStyle` and default `data`
 *      (e.g., "Title" for a title, "Button" for a button, or empty imageUrl for images).
 *
 * 4. What is `getAllDefaultComponents(themeId)`?
 *    A simple helper function. When you give it a theme ID (like "theme1"), it collects
 *    all 35 components and returns them ready to be displayed in our "Components" preview tab!
 * ==============================================================================
 */

import type { SDUINode } from "../types";

// Theme JSON Imports
import headerThemes from "./headerThemes.json";
import headerButtonThemes from "./headerButtonThemes.json";
import navBarThemes from "./navBarThemes.json";
import footerThemes from "./footerThemes.json";
import homeThemes from "./homeThemes.json";
import pageThemes from "./pageThemes.json";
import boxThemes from "./boxThemes.json";
import iframeThemes from "./iframeThemes.json";
import heroBannerThemes from "./heroBannerThemes.json";
import carouselThemes from "./carouselThemes.json";
import countDownTimerThemes from "./countDownTimerThemes.json";
import couponCodeThemes from "./couponCodeThemes.json";
import productCardThemes from "./productCardThemes.json";
import productListThemes from "./productListThemes.json";
import categoryGridThemes from "./categoryGridThemes.json";
import categoryItemThemes from "./categoryItemThemes.json";
import searchBarThemes from "./searchBarThemes.json";
import storyRowThemes from "./storyRowThemes.json";
import storyCircleThemes from "./storyCircleThemes.json";
import buttonThemes from "./buttonThemes.json";
import shareButtonThemes from "./shareButtonThemes.json";
import badgeThemes from "./badgeThemes.json";
import priceBlockThemes from "./priceBlockThemes.json";
import offerTextThemes from "./offerTextThemes.json";
import deliveryInfoThemes from "./deliveryInfoThemes.json";
import ratingThemes from "./ratingThemes.json";
import scoreThemes from "./scoreThemes.json";
import reviewCountThemes from "./reviewCountThemes.json";
import labelThemes from "./labelThemes.json";
import sponsoredThemes from "./sponsoredThemes.json";
import iconThemes from "./iconThemes.json";
import titleThemes from "./titleThemes.json";
import descriptionThemes from "./descriptionThemes.json";
import textThemes from "./textThemes.json";
import imageThemes from "./imageThemes.json";

// Export Individual Theme Objects
export {
  headerThemes,
  headerButtonThemes,
  navBarThemes,
  footerThemes,
  homeThemes,
  pageThemes,
  boxThemes,
  iframeThemes,
  heroBannerThemes,
  carouselThemes,
  countDownTimerThemes,
  couponCodeThemes,
  productCardThemes,
  productListThemes,
  categoryGridThemes,
  categoryItemThemes,
  searchBarThemes,
  storyRowThemes,
  storyCircleThemes,
  buttonThemes,
  shareButtonThemes,
  badgeThemes,
  priceBlockThemes,
  offerTextThemes,
  deliveryInfoThemes,
  ratingThemes,
  scoreThemes,
  reviewCountThemes,
  labelThemes,
  sponsoredThemes,
  iconThemes,
  titleThemes,
  descriptionThemes,
  textThemes,
  imageThemes,
};

export interface ThemePreset {
  id: string;
  name: string;
  previewColor: string;
  accentColor: string;
  description: string;
}

export const AVAILABLE_THEMES: ThemePreset[] = [
  {
    id: "theme1",
    name: "Theme 1 (Classic Campus Teal)",
    previewColor: "#0D3540",
    accentColor: "#10B981",
    description: "Original campus emerald & teal palette",
  },
  {
    id: "theme2",
    name: "Theme 2 (Clean Minimalist White)",
    previewColor: "#FFFFFF",
    accentColor: "#4F46E5",
    description: "Bright modern white storefront with slate accents",
  },
  {
    id: "theme3",
    name: "Theme 3 (Obsidian Dark Mode / Emerald)",
    previewColor: "#0F172A",
    accentColor: "#38BDF8",
    description: "Sleek dark theme with cyber slate contrast",
  },
];

export interface DefaultComponentItem {
  id: string;
  name: string;
  type: string;
  category: "Typography" | "Atoms" | "Commerce" | "Marketing" | "Navigation" | "Layout";
  previewColor: string;
  config: SDUINode;
}

// Registry defining all 35 components with categories and their theme datasets
const ALL_35_COMPONENTS_MAP: Array<{
  name: string;
  category: "Typography" | "Atoms" | "Commerce" | "Marketing" | "Navigation" | "Layout";
  themeDataset: Record<string, any>;
}> = [
  // Typography
  { name: "Title", category: "Typography", themeDataset: titleThemes },
  { name: "Text", category: "Typography", themeDataset: textThemes },
  { name: "Description", category: "Typography", themeDataset: descriptionThemes },
  { name: "Label", category: "Typography", themeDataset: labelThemes },

  // Atoms
  { name: "Button", category: "Atoms", themeDataset: buttonThemes },
  { name: "HeaderButton", category: "Atoms", themeDataset: headerButtonThemes },
  { name: "Image", category: "Atoms", themeDataset: imageThemes },
  { name: "Icon", category: "Atoms", themeDataset: iconThemes },
  { name: "StoryCircle", category: "Atoms", themeDataset: storyCircleThemes },

  // Commerce
  { name: "Badge", category: "Commerce", themeDataset: badgeThemes },
  { name: "PriceBlock", category: "Commerce", themeDataset: priceBlockThemes },
  { name: "ProductCard", category: "Commerce", themeDataset: productCardThemes },
  { name: "ProductList", category: "Commerce", themeDataset: productListThemes },
  { name: "DeliveryInfo", category: "Commerce", themeDataset: deliveryInfoThemes },
  { name: "Rating", category: "Commerce", themeDataset: ratingThemes },
  { name: "Score", category: "Commerce", themeDataset: scoreThemes },
  { name: "ReviewCount", category: "Commerce", themeDataset: reviewCountThemes },
  { name: "ShareButton", category: "Commerce", themeDataset: shareButtonThemes },

  // Marketing
  { name: "HeroBanner", category: "Marketing", themeDataset: heroBannerThemes },
  { name: "CouponCode", category: "Marketing", themeDataset: couponCodeThemes },
  { name: "CountDownTimer", category: "Marketing", themeDataset: countDownTimerThemes },
  { name: "OfferText", category: "Marketing", themeDataset: offerTextThemes },
  { name: "Sponsored", category: "Marketing", themeDataset: sponsoredThemes },

  // Navigation
  { name: "SearchBar", category: "Navigation", themeDataset: searchBarThemes },
  { name: "NavBar", category: "Navigation", themeDataset: navBarThemes },
  { name: "CategoryGrid", category: "Navigation", themeDataset: categoryGridThemes },
  { name: "CategoryItem", category: "Navigation", themeDataset: categoryItemThemes },

  // Layout
  { name: "Header", category: "Layout", themeDataset: headerThemes },
  { name: "Footer", category: "Layout", themeDataset: footerThemes },
  { name: "Carousel", category: "Layout", themeDataset: carouselThemes },
  { name: "StoryRow", category: "Layout", themeDataset: storyRowThemes },
  { name: "Box", category: "Layout", themeDataset: boxThemes },
  { name: "IFrame", category: "Layout", themeDataset: iframeThemes },
  { name: "Page", category: "Layout", themeDataset: pageThemes },
  { name: "Home", category: "Layout", themeDataset: homeThemes },
];

/**
 * Normalizes theme identifier to "theme1", "theme2", or "theme3"
 */
function normalizeThemeKey(themeId?: string): "theme1" | "theme2" | "theme3" {
  if (!themeId) return "theme1";
  if (themeId === "theme2") return "theme2";
  if (themeId === "theme3") return "theme3";
  return "theme1";
}

/**
 * Returns all 35 default SDUI components styled for the specified theme
 */
export function getAllDefaultComponents(themeId: string = "theme1"): DefaultComponentItem[] {
  const normalizedKey = normalizeThemeKey(themeId);

  return ALL_35_COMPONENTS_MAP.map((item) => {
    const rawThemeData = item.themeDataset[normalizedKey] || item.themeDataset["theme1"] || {};
    const configNode: SDUINode = rawThemeData.config || { type: item.name, data: {} };

    return {
      id: item.name.toLowerCase(),
      name: item.name,
      type: item.name,
      category: item.category,
      previewColor: rawThemeData.previewColor || "#FFFFFF",
      config: configNode,
    };
  });
}
