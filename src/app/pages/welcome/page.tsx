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
  setHasAppliedTheme,
  setIsThemeExisted,
} from "@/store/slices/themeSlice";

/**
 * ==============================================================================
 * Route: /pages/welcome (Welcome Page & Theme Studio Workspace)
 * ==============================================================================
 * Flow:
 * 1. Initial First-Time State: Shows welcome popup & starter card.
 * 2. User selects theme and clicks "Apply Theme" -> Forms Redux cluster and sets isThemeExisted = true.
 * 3. Once a theme exists:
 *    - The introductory welcome popup NEVER appears again.
 *    - Clicking "Welcome" in the navigation directly lands on the 4-Panel Workshop!
 * 4. Users can change themes at any time from within the 4-panel workshop toolbar.
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

  // On initial mount: only show the welcome popup if NO theme exists yet!
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

  // When a theme is selected, ensure the popup is immediately closed
  useEffect(() => {
    if (isThemeSelected) {
      setShowPopup(false);
    }
  }, [isThemeSelected]);

  // Check 1: Validate themes on the backend before opening the ThemeSlider
  const handleOpenThemeSlider = async (closeWelcomePopup: boolean = false) => {
    try {
      await dispatch(validateThemesBackend()).unwrap();
    } catch (e) {
      console.warn("Backend validation note:", e);
    }
    if (closeWelcomePopup) {
      setShowPopup(false);
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

        {/* Dynamic Content: 4 Panels Workspace (when theme existed) OR Starter Welcome Card (first time only) */}
        {isThemeSelected ? (
          <main className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
            <FourPanelWorkspace
              activeThemeName={activeTheme?.name || "Theme 1"}
              activeThemeId={activeThemeId}
              onOpenThemeSlider={() => handleOpenThemeSlider(false)}
            />
          </main>
        ) : (
          <main className="flex-1 p-6 lg:p-8 w-full space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs max-w-xl space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              Welcome
                </h1>
            <p className="text-sm text-zinc-600">
              Welcome to the website. Use the buttons below if you want to view the welcome message or select a theme again.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(true)}
                  className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 active:scale-95 transition shadow-2xs cursor-pointer"
                >
                  👋 View Welcome Message
                </button>

                <button
                  type="button"
                  disabled={isValidating}
                  onClick={() => handleOpenThemeSlider(false)}
                  className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-95 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  {isValidating ? "⚙️ Validating..." : "🎨 Select Theme"}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(setIsThemeExisted(true))}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 active:scale-95 transition cursor-pointer"
                >
                  Open 4 Panels &rarr;
                </button>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* 3. Welcome Popup Modal (Only shown first time before a theme is selected) */}
      {showPopup && !isThemeSelected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-overlay-in"
          onClick={() => !isValidating && setShowPopup(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl animate-pop-in space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-900">
                Welcome! 👋
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Thank you for visiting our website! We&apos;re glad to have you here. Before you get started, choose a theme that suits your style and personalize your experience.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="text-xs text-zinc-400 hover:text-zinc-700 font-medium cursor-pointer"
              >
                Dismiss
              </button>

              <button
                type="button"
                disabled={isValidating}
                onClick={() => handleOpenThemeSlider(true)}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
              >
                {isValidating ? "Validating..." : "Proceed & Choose Theme"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Theme Selection Popup (Opens when user clicks Proceed or Select Theme) */}
      <ThemeSlider />
    </div>
  );
}
