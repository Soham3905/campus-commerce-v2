import theme1Json from "./theme1.json";
import theme2Json from "./theme2.json";
import theme3Json from "./theme3.json";
import type { SDUINode } from "../types";

// Force fresh bundle reload

/**
 * ==============================================================================
 * SDUI THEME BUNDLE
 * ==============================================================================
 * Beginner Note:
 * Each theme is stored as its own complete, independent ~3,000-line JSON schema:
 * - theme1.json: Classic Campus Teal Brand theme (original default)
 * - theme2.json: Clean Minimalist White theme (clean light aesthetic & custom images)
 * - theme3.json: Obsidian Dark mode theme (cyber dark aesthetic & custom images)
 * ==============================================================================
 */

export interface ThemeMetadata {
  id: "theme1" | "theme2" | "theme3";
  name: string;
  badge: string;
  tagline: string;
  description: string;
  accentColor: string;
  bgColor: string;
  headerBg: string;
}

export const theme1 = theme1Json as unknown as SDUINode;
export const theme2 = theme2Json as unknown as SDUINode;
export const theme3 = theme3Json as unknown as SDUINode;

export const THEME_METADATA_LIST: ThemeMetadata[] = [
  {
    id: "theme1",
    name: "Theme 1",
    badge: "Teal Brand",
    tagline: "Classic Campus Teal",
    description: "Original campus commerce layout with deep teal headers, warm ivory tones, and classic item styling.",
    accentColor: "#0D3540",
    bgColor: "#F6F6F4",
    headerBg: "#0D3540",
  },
  {
    id: "theme2",
    name: "Theme 2",
    badge: "Clean White",
    tagline: "Minimalist Studio",
    description: "Sleek, high-key white aesthetic with royal blue accents, modern minimalist cards, and airy spacing.",
    accentColor: "#4F46E5",
    bgColor: "#FFFFFF",
    headerBg: "#FFFFFF",
  },
  {
    id: "theme3",
    name: "Theme 3",
    badge: "Campus Emerald",
    tagline: "VNIT Campus Brand",
    description: "Signature VNIT campus theme with deep forest green headers, vibrant emerald accents, and crisp styling from the auth portal.",
    accentColor: "#10B981",
    bgColor: "#FBFBF9",
    headerBg: "#1C3829",
  },
];

export const THEMES_REGISTRY: Record<string, SDUINode> = {
  theme1,
  theme2,
  theme3,
  landing_schema: theme1,
  clean_white: theme2,
  black_minimal: theme3,
};

export default THEMES_REGISTRY;
