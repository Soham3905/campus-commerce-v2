"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export type SidebarItem =
  | "home"
  | "welcome"
  | "orders"
  | "products"
  | "customers"
  | "content"
  | "finances"
  | "analytics"
  | "marketing"
  | "dummy";

interface SidebarProps {
  activeItem: SidebarItem;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

/**
 * ==============================================================================
 * Component: Sidebar (Responsive Navigation Drawer & Desktop Left Sidebar)
 * ==============================================================================
 * Responsiveness Highlights:
 * 1. Mobile Phone / Tablet:
 *    - Full-height slide-over drawer with backdrop overlay.
 * 2. Desktop:
 *    - Sticky left navigation bar with hamburger collapse toggle.
 *    - Smooth transition between full width (w-60) and compact icon-only rail (w-[68px]).
 */
export function Sidebar({
  activeItem,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Desktop Collapsed State (persisted in localStorage)
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cc_sidebar_collapsed");
      if (saved === "true") {
        setIsCollapsedDesktop(true);
      }
    }

    const handleToggle = () => {
      setIsCollapsedDesktop((prev) => {
        const next = !prev;
        localStorage.setItem("cc_sidebar_collapsed", String(next));
        return next;
      });
    };

    window.addEventListener("toggle-desktop-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-desktop-sidebar", handleToggle);
  }, []);

  const toggleDesktopCollapse = () => {
    setIsCollapsedDesktop((prev) => {
      const next = !prev;
      localStorage.setItem("cc_sidebar_collapsed", String(next));
      return next;
    });
  };

  // Lock body scroll and handle Escape key on mobile when sidebar is open
  useEffect(() => {
    if (!isOpenMobile) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMobile?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpenMobile, onCloseMobile]);

  return (
    <>
      {/* 1. Mobile Backdrop Overlay */}
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpenMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Sidebar Container */}
      <aside
        aria-label="Main Navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh max-w-[85vw] flex-col justify-between bg-[#f8f9fa] shadow-2xl transition-[width,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:static md:inset-auto md:z-20 md:h-[calc(100vh-3.5rem)] md:shrink-0 md:translate-x-0 md:border-r md:border-zinc-200 md:shadow-none md:sticky md:top-14 ${
          isOpenMobile ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"
        } ${isCollapsedDesktop ? "md:w-[68px]" : "md:w-60"}`}
      >
        {/* Mobile Header with Logo & Close Button (hidden on desktop) */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200/90 bg-white px-4 shrink-0 md:hidden">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 hover:opacity-90 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/40 bg-primary-light text-primary">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-zinc-900 tracking-tight">Campus Commerce</span>
              <span className="rounded bg-zinc-100 px-1 py-0.5 text-[9px] font-semibold text-zinc-600 border border-zinc-200">
                VNIT
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 active:scale-95 transition"
            aria-label="Close navigation menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Desktop Header Strip with Hamburger Icon Toggle */}
        <div className="hidden md:flex h-12 items-center px-3 border-b border-zinc-200/80 bg-zinc-50/70 justify-between shrink-0">
          {!isCollapsedDesktop && (
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1 select-none">
              Navigation
            </span>
          )}
          <button
            type="button"
            onClick={toggleDesktopCollapse}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 active:scale-95 transition cursor-pointer ${
              isCollapsedDesktop ? "mx-auto" : ""
            }`}
            title={isCollapsedDesktop ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsedDesktop ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-2.5 sm:p-3 space-y-5">
          {/* Primary Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {/* 1. Home Link */}
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              title={isCollapsedDesktop ? "Home" : undefined}
              className={`flex items-center rounded-xl transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              } ${
                activeItem === "home"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80"
              }`}
            >
              <span className="text-sm shrink-0">🏠</span>
              {!isCollapsedDesktop && <span>Home</span>}
            </Link>

            {/* 2. Welcome Link */}
            <Link
              href="/pages/welcome"
              onClick={onCloseMobile}
              title={isCollapsedDesktop ? "Welcome" : undefined}
              className={`flex items-center rounded-xl transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              } ${
                activeItem === "welcome"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80"
              }`}
            >
              <span className="text-sm shrink-0">✨</span>
              {!isCollapsedDesktop && <span>Welcome</span>}
            </Link>

            {/* 3. Orders Link */}
            <Link
              href="/pages/orders"
              onClick={onCloseMobile}
              title={isCollapsedDesktop ? "Orders (12)" : undefined}
              className={`flex items-center rounded-xl transition ${
                isCollapsedDesktop
                  ? "justify-center p-2.5 relative"
                  : "justify-between px-3 py-2.5"
              } ${
                activeItem === "orders"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm shrink-0">📋</span>
                {!isCollapsedDesktop && <span>Orders</span>}
              </div>
              {!isCollapsedDesktop ? (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                  12
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-600" />
              )}
            </Link>

            {/* 4. Products Link */}
            <div>
              <Link
                href="/pages/product"
                onClick={onCloseMobile}
                title={isCollapsedDesktop ? "Products" : undefined}
                className={`flex items-center rounded-xl transition ${
                  isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                }`}
              >
                <span className="text-sm shrink-0">🏷️</span>
                {!isCollapsedDesktop && <span>Products</span>}
              </Link>

              {/* Submenus under Products */}
              {activeItem === "products" && !isCollapsedDesktop && (
                <div className="ml-8 mt-1.5 space-y-1 text-[11px] font-medium text-zinc-500 animate-fade-in">
                  <div
                    onClick={onCloseMobile}
                    className="py-1.5 px-2 rounded-lg cursor-pointer hover:text-zinc-900 hover:bg-zinc-200/40 active:bg-zinc-200/70 transition"
                  >
                    Collection
                  </div>
                  <div
                    onClick={onCloseMobile}
                    className="py-1.5 px-2 rounded-lg cursor-pointer hover:text-zinc-900 hover:bg-zinc-200/40 active:bg-zinc-200/70 transition"
                  >
                    Inventory
                  </div>
                  <div
                    onClick={onCloseMobile}
                    className="py-1.5 px-2 rounded-lg cursor-pointer hover:text-zinc-900 hover:bg-zinc-200/40 active:bg-zinc-200/70 transition"
                  >
                    Purchase orders
                  </div>
                  <div
                    onClick={onCloseMobile}
                    className="py-1.5 px-2 rounded-lg cursor-pointer hover:text-zinc-900 hover:bg-zinc-200/40 active:bg-zinc-200/70 transition"
                  >
                    Transfers
                  </div>
                  <div
                    onClick={onCloseMobile}
                    className="py-1.5 px-2 rounded-lg cursor-pointer hover:text-zinc-900 hover:bg-zinc-200/40 active:bg-zinc-200/70 transition"
                  >
                    Gift Cards
                  </div>
                </div>
              )}
            </div>

            {/* 5. Customers Link */}
            <Link
              href="/pages/customers"
              onClick={onCloseMobile}
              title={isCollapsedDesktop ? "Customers" : undefined}
              className={`flex items-center rounded-xl transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              } ${
                activeItem === "customers"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80"
              }`}
            >
              <span className="text-sm shrink-0">👥</span>
              {!isCollapsedDesktop && <span>Customers</span>}
            </Link>

            {/* 6. Content Link */}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCloseMobile?.();
              }}
              title={isCollapsedDesktop ? "Content" : undefined}
              className={`flex items-center rounded-xl text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80 transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              }`}
            >
              <span className="text-sm shrink-0">📁</span>
              {!isCollapsedDesktop && <span>Content</span>}
            </Link>

            {/* 7. Finances Link */}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCloseMobile?.();
              }}
              title={isCollapsedDesktop ? "Finances" : undefined}
              className={`flex items-center rounded-xl text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80 transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              }`}
            >
              <span className="text-sm shrink-0">💲</span>
              {!isCollapsedDesktop && <span>Finances</span>}
            </Link>

            {/* 8. Analytics Link */}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCloseMobile?.();
              }}
              title={isCollapsedDesktop ? "Analytics" : undefined}
              className={`flex items-center rounded-xl text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80 transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              }`}
            >
              <span className="text-sm shrink-0">📊</span>
              {!isCollapsedDesktop && <span>Analytics</span>}
            </Link>

            {/* 9. Marketing Link */}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCloseMobile?.();
              }}
              title={isCollapsedDesktop ? "Marketing" : undefined}
              className={`flex items-center rounded-xl text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80 transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              }`}
            >
              <span className="text-sm shrink-0">📢</span>
              {!isCollapsedDesktop && <span>Marketing</span>}
            </Link>

            {/* 10. Dummy Link */}
            <Link
              href="/pages/dummy"
              onClick={onCloseMobile}
              title={isCollapsedDesktop ? "Dummy" : undefined}
              className={`flex items-center rounded-xl transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              } ${
                activeItem === "dummy"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200/80"
              }`}
            >
              <span className="text-sm shrink-0">📄</span>
              {!isCollapsedDesktop && <span>Dummy</span>}
            </Link>
          </nav>

          {/* Sales Channel Section */}
          <div className="space-y-1 text-xs">
            {!isCollapsedDesktop ? (
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-3 uppercase tracking-wider">
                <span>Sales Channel</span>
                <span>›</span>
              </div>
            ) : (
              <div className="border-t border-zinc-200/80 my-2" />
            )}
            <div className="space-y-0.5 pt-1 text-xs font-medium text-zinc-600">
              <div
                onClick={() => {
                  onCloseMobile?.();
                  alert("Online Store Channel");
                }}
                title={isCollapsedDesktop ? "Online store" : undefined}
                className={`flex items-center rounded-xl hover:bg-zinc-200/60 active:bg-zinc-200/80 cursor-pointer transition ${
                  isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                }`}
              >
                <span className="text-sm shrink-0">🌐</span>
                {!isCollapsedDesktop && <span>Online store</span>}
              </div>
              <div
                onClick={() => {
                  onCloseMobile?.();
                  alert("Point of Sale Channel");
                }}
                title={isCollapsedDesktop ? "Point of sale" : undefined}
                className={`flex items-center rounded-xl hover:bg-zinc-200/60 active:bg-zinc-200/80 cursor-pointer transition ${
                  isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                }`}
              >
                <span className="text-sm shrink-0">💳</span>
                {!isCollapsedDesktop && <span>Point of sale</span>}
              </div>
              <div
                onClick={() => {
                  onCloseMobile?.();
                  alert("Shop Channel");
                }}
                title={isCollapsedDesktop ? "Shop" : undefined}
                className={`flex items-center rounded-xl hover:bg-zinc-200/60 active:bg-zinc-200/80 cursor-pointer transition ${
                  isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                }`}
              >
                <span className="text-sm shrink-0">🛍️</span>
                {!isCollapsedDesktop && <span>Shop</span>}
              </div>
            </div>
          </div>

          {/* Apps Section */}
          <div className="space-y-1 text-xs">
            {!isCollapsedDesktop ? (
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-3 uppercase tracking-wider">
                <span>Apps</span>
                <span>›</span>
              </div>
            ) : (
              <div className="border-t border-zinc-200/80 my-2" />
            )}
            <div
              onClick={() => {
                onCloseMobile?.();
                alert("Add Apps Marketplace");
              }}
              title={isCollapsedDesktop ? "Add apps" : undefined}
              className={`flex items-center text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 active:bg-zinc-200/80 rounded-xl cursor-pointer transition ${
                isCollapsedDesktop ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
              }`}
            >
              <span className="text-sm shrink-0">➕</span>
              {!isCollapsedDesktop && <span>Add apps</span>}
            </div>
          </div>
        </div>

        {/* Footer Area: User Snippet, Settings & Logout */}
        <div className="border-t border-zinc-200/90 bg-white/60 md:bg-transparent p-2 sm:p-3 space-y-1.5 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {/* Mobile User Profile Card */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-200/50 md:hidden mb-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white ring-1 ring-emerald-500/30">
              {user?.firstName && user?.lastName
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : "AM"}
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-zinc-900 truncate leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : "Alex Morgan"}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {user?.university || "Campus Admin"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onCloseMobile?.();
              alert("Store Settings");
            }}
            title={isCollapsedDesktop ? "Settings" : undefined}
            className={`flex w-full items-center rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-200/60 active:bg-zinc-200/80 transition cursor-pointer ${
              isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            }`}
          >
            <span className="text-sm shrink-0">⚙️</span>
            {!isCollapsedDesktop && <span>Settings</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              onCloseMobile?.();
              dispatch(logout());
              router.replace("/login");
            }}
            title={isCollapsedDesktop ? "Log out" : undefined}
            className={`flex w-full items-center rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition cursor-pointer ${
              isCollapsedDesktop ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            }`}
          >
            <span className="text-sm shrink-0">🚪</span>
            {!isCollapsedDesktop && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
