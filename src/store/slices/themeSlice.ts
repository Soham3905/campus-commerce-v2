import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { SDUINode } from "@/sdui/types";
import { THEMES_REGISTRY, THEME_METADATA_LIST, ThemeMetadata } from "@/sdui/themeBundle";
import type { StrictThemeValidationResult } from "@/sdui/validators/validator";

/**
 * ==============================================================================
 * SDUI THEME REDUX SLICE (Beginner-Friendly & Clean)
 * ==============================================================================
 * Manages the themes of our app:
 * 1. availableThemes: The 3 themes (theme1, theme2, theme3) with their validity status.
 * 2. activeThemeId: Which theme is currently active.
 * 3. validateThemesBackend: Async thunk that calls GET /api/themes/validate (Check 1).
 * 4. setActiveTheme: Switches the active theme, but blocks disabled themes (Check 2).
 * ==============================================================================
 */

export type ThemeId = "theme1" | "theme2" | "theme3";
export type PreviewMode = "full_theme" | "components";
export type PreviewDevice = "desktop" | "tablet" | "phone";

export interface ThemeItem extends ThemeMetadata {
  isValid: boolean;
  isDisabled: boolean;
  errors: string[];
}

export interface ThemeState {
  availableThemes: ThemeItem[];
  activeThemeId: ThemeId;
  activeSchema: SDUINode;
  isSliderOpen: boolean;
  previewThemeId: ThemeId | null;
  previewMode: PreviewMode;
  previewDevice: PreviewDevice;
  isValidating: boolean;
}

/**
 * Check 1: Fetch theme validation from backend API
 */
export const validateThemesBackend = createAsyncThunk(
  "theme/validateThemesBackend",
  async () => {
    const res = await fetch("/api/themes/validate");
    const data = await res.json();
    return data.results as Record<string, StrictThemeValidationResult>;
  }
);

// Initial list of themes (lightweight, no heavy startup checking)
const initialThemes: ThemeItem[] = THEME_METADATA_LIST.map((meta) => ({
  ...meta,
  isValid: true,
  isDisabled: false,
  errors: [],
}));

const initialState: ThemeState = {
  availableThemes: initialThemes,
  activeThemeId: "theme1",
  activeSchema: THEMES_REGISTRY["theme1"],
  isSliderOpen: false,
  previewThemeId: null,
  previewMode: "full_theme",
  previewDevice: "desktop",
  isValidating: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /**
     * Check 2 (Frontend Guard): Set active theme
     * If the theme is disabled, we block it from activating!
     */
    setActiveTheme: (state, action: PayloadAction<ThemeId>) => {
      const themeId = action.payload;
      const themeInfo = state.availableThemes.find((t) => t.id === themeId);

      // Block disabled theme
      if (themeInfo?.isDisabled) {
        console.warn(`Cannot activate "${themeId}" because it has validation errors.`);
        return;
      }

      state.activeThemeId = themeId;
      state.activeSchema = THEMES_REGISTRY[themeId];
      state.isSliderOpen = false;
      state.previewThemeId = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("campus_active_theme", themeId);
        } catch {
          // Ignore localStorage errors
        }
      }
    },

    // Drawer controls
    openSlider: (state, action: PayloadAction<ThemeId | undefined>) => {
      state.isSliderOpen = true;
      state.previewThemeId = action.payload || state.activeThemeId;
    },

    closeSlider: (state) => {
      state.isSliderOpen = false;
      state.previewThemeId = null;
    },

    setPreviewTheme: (state, action: PayloadAction<ThemeId>) => {
      state.previewThemeId = action.payload;
    },

    setPreviewMode: (state, action: PayloadAction<PreviewMode>) => {
      state.previewMode = action.payload;
    },

    setPreviewDevice: (state, action: PayloadAction<PreviewDevice>) => {
      state.previewDevice = action.payload;
    },

    // Rehydrate saved theme on browser refresh
    rehydrateTheme: (state) => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("campus_active_theme") as ThemeId;
          if (stored && state.availableThemes.some((t) => t.id === stored && !t.isDisabled)) {
            state.activeThemeId = stored;
            state.activeSchema = THEMES_REGISTRY[stored];
          }
        } catch {
          // Ignore localStorage errors
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateThemesBackend.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateThemesBackend.fulfilled, (state, action) => {
        state.isValidating = false;
        const results = action.payload;
        if (results) {
          state.availableThemes = state.availableThemes.map((theme) => {
            const val = results[theme.id];
            if (val) {
              return {
                ...theme,
                isValid: val.isValid,
                isDisabled: val.isDisabled,
                errors: val.errors || [],
              };
            }
            return theme;
          });
        }
      })
      .addCase(validateThemesBackend.rejected, (state) => {
        state.isValidating = false;
      });
  },
});

export const {
  setActiveTheme,
  openSlider,
  closeSlider,
  setPreviewTheme,
  setPreviewMode,
  setPreviewDevice,
  rehydrateTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
