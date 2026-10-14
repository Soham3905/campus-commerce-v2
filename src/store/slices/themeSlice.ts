import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { SDUINode } from "@/sdui/types";
import { THEMES_REGISTRY, THEME_METADATA_LIST, ThemeMetadata } from "@/sdui/themeBundle";
import type { StrictThemeValidationResult } from "@/sdui/validators/validator";
import { getAllDefaultComponents, type DefaultComponentItem } from "@/sdui/themes";

/**
 * ==============================================================================
 * SDUI THEME REDUX SLICE WITH CLUSTER FORMATION
 * ==============================================================================
 * When the user selects & applies a theme:
 * 1. Forms a cluster in Redux:
 *    - actual theme selected & its complete SDUI schema
 *    - all 35 default SDUI components pre-styled for this theme
 *    - metadata, categories, timestamp
 * 2. Sets `isThemeExisted = true` & `hasAppliedTheme = true`
 * 3. Persists the cluster to localStorage so reloading or clicking "Welcome"
 *    skips the intro modal and directly navigates to the 4-panel workshop.
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

/**
 * Applied Theme Cluster stored in Redux when user clicks "Apply Theme"
 */
export interface AppliedThemeCluster {
  /** The theme identifier (e.g. "theme1", "theme2", "theme3") */
  themeId: ThemeId;
  /** Complete metadata (name, description, previewColor, accentColor) */
  metadata: ThemeItem;
  /** Full master landing page SDUI schema blueprint for this theme */
  schema: SDUINode;
  /** All 35 default SDUI components pre-configured and styled for this theme */
  defaultComponents: DefaultComponentItem[];
  /** Unique component categories available under this theme */
  categories: string[];
  /** ISO timestamp when the theme was applied */
  appliedAt: string;
  /** Boolean flag confirming theme exists and was applied */
  isThemeExisted: boolean;
  /** Optional user identity who applied it */
  appliedBy?: string;
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

  // Cluster & Check flags requested by user
  appliedThemeCluster: AppliedThemeCluster | null;
  isThemeExisted: boolean;
  hasAppliedTheme: boolean; // Backwards compatibility
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
  hasAppliedTheme: false,
  isThemeExisted: false,
  appliedThemeCluster: null,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /**
     * Forms the Theme Cluster in Redux when user clicks "Apply Theme"
     * Stores:
     * - selected theme & schema
     * - default 35 components styled for this theme
     * - isThemeExisted flag set to true
     * - persists in localStorage
     */
    setActiveTheme: (state, action: PayloadAction<ThemeId>) => {
      const themeId = action.payload;
      const themeInfo = state.availableThemes.find((t) => t.id === themeId);

      // Block disabled theme
      if (themeInfo?.isDisabled) {
        console.warn(`Cannot activate "${themeId}" because it has validation errors.`);
        return;
      }

      const activeThemeInfo = themeInfo || state.availableThemes[0];
      const defaultComponents = getAllDefaultComponents(themeId);
      const categories = Array.from(new Set(defaultComponents.map((c) => c.category)));

      // Form the Redux Cluster
      const cluster: AppliedThemeCluster = {
        themeId,
        metadata: activeThemeInfo,
        schema: THEMES_REGISTRY[themeId],
        defaultComponents,
        categories,
        appliedAt: new Date().toISOString(),
        isThemeExisted: true,
      };

      state.activeThemeId = themeId;
      state.activeSchema = THEMES_REGISTRY[themeId];
      state.appliedThemeCluster = cluster;
      state.isThemeExisted = true;
      state.hasAppliedTheme = true;
      state.isSliderOpen = false;
      state.previewThemeId = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("campus_active_theme", themeId);
          localStorage.setItem("campus_theme_existed", "true");
          localStorage.setItem("campus_theme_applied", "true");
          localStorage.setItem("campus_theme_cluster", JSON.stringify(cluster));
        } catch (e) {
          console.warn("localStorage persistence error:", e);
        }
      }
    },

    // Explicit alias for semantic clarity
    applyTheme: (state, action: PayloadAction<ThemeId>) => {
      themeSlice.caseReducers.setActiveTheme(state, action);
    },

    setIsThemeExisted: (state, action: PayloadAction<boolean>) => {
      state.isThemeExisted = action.payload;
      state.hasAppliedTheme = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("campus_theme_existed", String(action.payload));
          localStorage.setItem("campus_theme_applied", String(action.payload));
        } catch {
          // Ignore localStorage errors
        }
      }
    },

    setHasAppliedTheme: (state, action: PayloadAction<boolean>) => {
      state.hasAppliedTheme = action.payload;
      state.isThemeExisted = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("campus_theme_applied", String(action.payload));
          localStorage.setItem("campus_theme_existed", String(action.payload));
        } catch {
          // Ignore localStorage errors
        }
      }
    },

    // Reset cluster back to fresh first-time state
    resetThemeCluster: (state) => {
      state.appliedThemeCluster = null;
      state.isThemeExisted = false;
      state.hasAppliedTheme = false;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("campus_theme_cluster");
          localStorage.removeItem("campus_theme_existed");
          localStorage.removeItem("campus_theme_applied");
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

    // Rehydrate saved theme cluster on browser refresh
    rehydrateTheme: (state) => {
      if (typeof window !== "undefined") {
        try {
          // 1. Rehydrate complete cluster if present in localStorage
          const savedCluster = localStorage.getItem("campus_theme_cluster");
          if (savedCluster) {
            try {
              const parsed = JSON.parse(savedCluster) as AppliedThemeCluster;
              if (parsed && parsed.themeId) {
                state.appliedThemeCluster = parsed;
                state.activeThemeId = parsed.themeId;
                state.activeSchema = parsed.schema || THEMES_REGISTRY[parsed.themeId];
                state.isThemeExisted = true;
                state.hasAppliedTheme = true;
              }
            } catch (err) {
              console.warn("Failed to parse saved theme cluster:", err);
            }
          }

          // 2. Check active theme ID
          const storedTheme = localStorage.getItem("campus_active_theme") as ThemeId;
          if (storedTheme && state.availableThemes.some((t) => t.id === storedTheme && !t.isDisabled)) {
            state.activeThemeId = storedTheme;
            state.activeSchema = THEMES_REGISTRY[storedTheme];
          }

          // 3. Check existed / applied flags
          const existed =
            localStorage.getItem("campus_theme_existed") === "true" ||
            localStorage.getItem("campus_theme_applied") === "true";

          if (existed) {
            state.isThemeExisted = true;
            state.hasAppliedTheme = true;

            // If cluster is not yet created, build it on the fly
            if (!state.appliedThemeCluster) {
              const themeInfo =
                state.availableThemes.find((t) => t.id === state.activeThemeId) ||
                state.availableThemes[0];
              const defaultComponents = getAllDefaultComponents(state.activeThemeId);
              state.appliedThemeCluster = {
                themeId: state.activeThemeId,
                metadata: themeInfo,
                schema: state.activeSchema,
                defaultComponents,
                categories: Array.from(new Set(defaultComponents.map((c) => c.category))),
                appliedAt: new Date().toISOString(),
                isThemeExisted: true,
              };
            }
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
  applyTheme,
  setHasAppliedTheme,
  setIsThemeExisted,
  resetThemeCluster,
  openSlider,
  closeSlider,
  setPreviewTheme,
  setPreviewMode,
  setPreviewDevice,
  rehydrateTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
