"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import ThemeSlider from "@/components/ThemeSlider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSlider, validateThemesBackend } from "@/store/slices/themeSlice";

/**
 * Route: /pages/welcome (Welcome Page)
 * Simple and beginner-friendly:
 * 1. Shows a welcome popup on arrival.
 * 2. When user clicks "Proceed", it asks the backend to validate themes (Check 1).
 * 3. Then it opens the ThemeSlider modal.
 */
export default function WelcomePage() {
  const dispatch = useAppDispatch();
  const isValidating = useAppSelector((state) => state.theme.isValidating);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  // Listen for sidebar click on "Welcome" to re-open the welcome popup
  useEffect(() => {
    const handleReopen = () => setShowPopup(true);
    window.addEventListener("open-welcome-modal", handleReopen);
    return () => window.removeEventListener("open-welcome-modal", handleReopen);
  }, []);

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
      {/* Header */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Main Layout */}
      <div className="flex flex-1 relative">
        <Sidebar
          activeItem="welcome"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

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
            </div>
          </div>
        </main>
      </div>

      {/* 1. Welcome Popup */}
      {showPopup && (
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

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={isValidating}
                onClick={() => handleOpenThemeSlider(true)}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
              >
                {isValidating ? "Validating..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Theme Selection Popup */}
      <ThemeSlider />
    </div>
  );
}
