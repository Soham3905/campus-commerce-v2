"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export type SidebarItem =
  | "home"
  | "orders"
  | "products"
  | "customers"
  | "content"
  | "finances"
  | "analytics"
  | "marketing"
  | "discount";

interface SidebarProps {
  activeItem: SidebarItem;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

/**
 * ==============================================================================
 * Component: Sidebar (Left Navigation Sidebar)
 * ==============================================================================
 * Beginner Note:
 * Highlights whichever navigation link matches the current page (e.g. "home" for /dashboard,
 * or "products" for /pages/product).
 */
export function Sidebar({
  activeItem,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-14 left-0 z-30 w-60 border-r border-zinc-200 bg-[#f8f9fa] p-4 transition-transform duration-200 md:static md:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } flex flex-col justify-between overflow-y-auto shrink-0`}
      >
        <div className="space-y-6">
          {/* Primary Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {/* 1. Home Link -> /dashboard */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                activeItem === "home"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60"
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>

            {/* 2. Orders Link -> /pages/orders */}
            <Link
              href="/pages/orders"
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeItem === "orders"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span>📋</span>
                <span>Orders</span>
              </div>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                12
              </span>
            </Link>

            {/* 3. Products Link -> /pages/product */}
            <div>
              <Link
                href="/pages/product"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                  activeItem === "products"
                    ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                    : "text-zinc-600 hover:bg-zinc-200/60"
                }`}
              >
                <span>🏷️</span>
                <span>Products</span>
              </Link>

              {/* Submenus under Products (visible on products page) */}
              {activeItem === "products" && (
                <div className="ml-8 mt-1.5 space-y-1.5 text-[11px] font-medium text-zinc-500 animate-fade-in">
                  <div className="cursor-pointer hover:text-zinc-900 transition">Collection</div>
                  <div className="cursor-pointer hover:text-zinc-900 transition">Inventory</div>
                  <div className="cursor-pointer hover:text-zinc-900 transition">Purchase orders</div>
                  <div className="cursor-pointer hover:text-zinc-900 transition">Transfers</div>
                  <div className="cursor-pointer hover:text-zinc-900 transition">Gift Cards</div>
                </div>
              )}
            </div>

            {/* 4. Customers -> /pages/customers */}
            <Link
              href="/pages/customers"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                activeItem === "customers"
                  ? "bg-white font-bold text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60"
              }`}
            >
              <span>👥</span>
              <span>Customers</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200/60 transition">
              <span>📁</span>
              <span>Content</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200/60 transition">
              <span>💲</span>
              <span>Finances</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200/60 transition">
              <span>📊</span>
              <span>Analytics</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200/60 transition">
              <span>📢</span>
              <span>Marketing</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200/60 transition">
              <span>🏷️</span>
              <span>Discount</span>
            </Link>
          </nav>

          {/* Sales Channel Section */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-3 uppercase tracking-wider">
              <span>Sales Channel</span>
              <span>›</span>
            </div>
            <div className="space-y-0.5 pt-1 text-xs font-medium text-zinc-600">
              <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-zinc-200/60 cursor-pointer transition">
                <span>🌐</span>
                <span>Online store</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-zinc-200/60 cursor-pointer transition">
                <span>💳</span>
                <span>Point of sale</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-zinc-200/60 cursor-pointer transition">
                <span>🛍️</span>
                <span>Shop</span>
              </div>
            </div>
          </div>

          {/* Apps Section */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-3 uppercase tracking-wider">
              <span>Apps</span>
              <span>›</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer transition">
              <span>➕</span>
              <span>Add apps</span>
            </div>
          </div>
        </div>

        {/* Settings & Logout at bottom */}
        <div className="border-t border-zinc-200 pt-3 mt-4 space-y-1">
          <button
            onClick={() => alert("Store Settings")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-200/60 transition"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              dispatch(logout());
              router.replace("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:text-rose-600 transition cursor-pointer"
          >
            <span>🚪</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
