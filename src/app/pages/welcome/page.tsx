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
 * 1. New visitors see the introductory Welcome Popup modal.
 * 2. User clicks "Proceed & Choose Theme" -> validates themes and opens ThemeSlider.
 * 3. User selects theme and clicks "Apply Theme" in ThemeSlider -> Forms Redux cluster and sets isThemeExisted = true.
 * 4. 4-Panel Workshop is unlocked and rendered.
 * 5. Users can change themes at any time from within the 4-panel workshop toolbar.
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
  const [showPopup, setShowPopup] = useState(false);

  // Check if a theme has been applied / already exists
  const isThemeSelected = isThemeExisted || hasAppliedTheme || appliedThemeCluster !== null;

  const activeTheme = availableThemes.find((t) => t.id === activeThemeId) || availableThemes[0];

  // On initial mount: if theme exists in storage, restore it; otherwise prompt with welcome popup!
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedExisted =
        localStorage.getItem("campus_theme_existed") === "true" ||
        localStorage.getItem("campus_theme_applied") === "true";

      if (persistedExisted) {
        dispatch(setIsThemeExisted(true));
        setShowPopup(false);
      } else if (!isThemeSelected) {
        setShowPopup(true);
      }
    }
  }, [dispatch, isThemeSelected]);

  // Listen for sidebar click on "Welcome" or custom event to re-open the welcome popup
  useEffect(() => {
    const handleReopen = () => setShowPopup(true);
    window.addEventListener("open-welcome-modal", handleReopen);
    return () => window.removeEventListener("open-welcome-modal", handleReopen);
  }, []);

  // When a theme is selected, ensure the popup is immediately closed
  useEffect(() => {
    if (isThemeSelected) {
      setShowPopup(false);
    }
  }, [isThemeSelected]);

  // Check 1: Validate themes on the backend before opening the ThemeSlider
  const handleOpenThemeSlider = async (closeWelcomePopup: boolean = false) => {
    if (closeWelcomePopup) {
      setShowPopup(false);
    }
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
              onOpenThemeSlider={() => handleOpenThemeSlider(false)}
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

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1 w-full">
                <button
                  type="button"
                  onClick={() => setShowPopup(true)}
                  className="w-full sm:flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 active:scale-98 transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  👋 View Welcome
                </button>

                <button
                  type="button"
                  disabled={isValidating}
                  onClick={() => handleOpenThemeSlider(false)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-98 transition shadow-xs cursor-pointer"
                >
                  {isValidating ? "⚙️ Validating..." : "🎨 Select Theme"}
                </button>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* 3. Welcome Popup Modal (Shown to new visitors or on request) */}
      {showPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-overlay-in"
          onClick={() => !isValidating && setShowPopup(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl animate-pop-in space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-lg">
                👋
              </div>
              <h2 className="text-base font-bold text-zinc-900">
                Welcome to Campus Commerce!
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Thank you for visiting! Before you get started, choose a theme from the Theme Studio to customize and start designing your store.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="text-xs text-zinc-400 hover:text-zinc-700 font-medium cursor-pointer py-2 px-1"
              >
                Dismiss
              </button>

              <button
                type="button"
                disabled={isValidating}
                onClick={() => handleOpenThemeSlider(true)}
                className="rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-98 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isValidating ? "Validating..." : "Proceed & Choose Theme →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Theme Selection Modal */}
      <ThemeSlider />
    </div>
  );
}
