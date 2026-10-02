/**
 * Master SDUI Theme Registry
 * Exports individual JSON themes for all 35 SDUI components
 */

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

// Export Theme Objects
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
    id: 'landing_schema',
    name: 'Default Campus Teal',
    previewColor: '#0D3540',
    accentColor: '#10B981',
    description: 'Original campus emerald & teal palette'
  },
  {
    id: 'clean_white',
    name: 'Clean Minimalist White',
    previewColor: '#FFFFFF',
    accentColor: '#4F46E5',
    description: 'Bright modern white storefront with slate accents'
  },
  {
    id: 'black_minimal',
    name: 'Obsidian Dark Mode',
    previewColor: '#0F172A',
    accentColor: '#38BDF8',
    description: 'Sleek dark theme with cyber slate contrast'
  }
];
