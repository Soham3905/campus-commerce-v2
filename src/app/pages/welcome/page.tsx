"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import ThemeSlider from "@/components/ThemeSlider";
import FourPanelWorkspace from "@/components/workspace/FourPanelWorkspace";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  openSlider,
  validateThemesBackend,
  setIsThemeExisted,
} from "@/store/slices/themeSlice";

/**
 * ==============================================================================
 * Route: /pages/welcome (Theme Studio 4-Panel Workspace)
 * ==============================================================================
 * Flow:
 * 1. User selects theme and clicks "Apply Theme" in ThemeSlider -> Forms Redux cluster and sets isThemeExisted = true.
 * 2. 4-Panel Workshop is unlocked and rendered.
 * 3. Users can change themes at any time from within the 4-panel workshop toolbar.
 * ==============================================================================
 */
export default function WelcomePage() {
  const dispatch = useAppDispatch();
  const {
    isValidating,
    hasAppliedTheme,
    isThemeExisted,
    appliedThemeCluster,
    activeThemeId,
    availableThemes,
  } = useAppSelector((state) => state.theme);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if a theme has been applied / already exists
  const isThemeSelected = isThemeExisted || hasAppliedTheme || appliedThemeCluster !== null;

  const activeTheme = availableThemes.find((t) => t.id === activeThemeId) || availableThemes[0];

  // On initial mount: if theme exists in storage, restore it; otherwise auto-open Theme Slider
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedExisted =
        localStorage.getItem("campus_theme_existed") === "true" ||
        localStorage.getItem("campus_theme_applied") === "true";

      if (persistedExisted) {
        dispatch(setIsThemeExisted(true));
      } else if (!isThemeSelected) {
        // Automatically prompt the user to select a theme
        handleOpenThemeSlider();
      }
    }
  }, [dispatch, isThemeSelected]);

  // Check 1: Validate themes on the backend before opening the ThemeSlider
  const handleOpenThemeSlider = async () => {
    try {
      await dispatch(validateThemesBackend()).unwrap();
    } catch (e) {
      console.warn("Backend validation note:", e);
    }
    dispatch(openSlider());
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-800 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* 1. Global Top Header */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* 2. Main Layout (Sidebar + Content) */}
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar
          activeItem="welcome"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content: 4 Panels Workspace (when theme selected) OR Prompt to Select Theme */}
        {isThemeSelected ? (
          <main className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
            <FourPanelWorkspace
              activeThemeName={activeTheme?.name || "Theme 1"}
              activeThemeId={activeThemeId}
            />
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 w-full bg-[#f4f5f7]">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs max-w-md w-full text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-2xl shadow-2xs">
                🎨
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  Select a Theme to Begin
                </h1>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Please choose and apply a theme from the Theme Studio to start building your theme page.
                </p>
              </div>

              <button
                type="button"
                disabled={isValidating}
                onClick={() => handleOpenThemeSlider()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-98 transition shadow-xs cursor-pointer"
              >
                {isValidating ? "⚙️ Validating Themes..." : "🎨 Select Theme"}
              </button>
            </div>
          </main>
        )}
      </div>

      {/* 3. Theme Selection Modal */}
      <ThemeSlider />
    </div>
  );
}
