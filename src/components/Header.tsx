"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

/**
 * ==============================================================================
 * Component: Header (Global Dark Top Bar)
 * ==============================================================================
 * Beginner Note:
 * This component renders the top navigation bar with the Campus Commerce logo,
 * search input with keyboard shortcut (⌘ K), and dynamically shows the
 * logged-in user retrieved from Redux state.
 */
export function Header({
  onToggleMobileSidebar,
  searchQuery = "",
  onSearchChange,
}: HeaderProps) {
  // Read user profile directly from Redux state
  const user = useAppSelector((state) => state.auth.user);
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-[#1a1b1d] px-4 sm:px-6 shadow-xs">
      {/* Left: Brand & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 md:hidden transition"
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        )}

        {/* Graduation Cap Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/40 bg-primary-light text-primary">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">Campus Commerce</span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              VNIT
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search"
            className="w-full rounded-lg border border-zinc-700/80 bg-[#25282c] py-1.5 pl-8 pr-12 text-xs text-white placeholder-zinc-400 outline-none focus:border-zinc-500 focus:bg-[#2b2e33] transition"
          />
          <span className="absolute left-2.5 top-2 text-zinc-400 text-xs">🔍</span>
          <kbd className="absolute right-2 top-1.5 rounded bg-zinc-700/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => alert("No unread notifications")}
          className="text-zinc-400 hover:text-white transition p-1"
          aria-label="Notifications"
        >
          🔔
        </button>

        <div
          onClick={() => {
            if (user) {
              alert(
                `Logged in as: ${user.firstName} ${user.lastName} (${user.role})\n` +
                `Email: ${user.email}\n` +
                `University: ${user.university}\n` +
                `SSO Token: ${user.ssoToken}\n` +
                `Guided Tooltips: ${user.showTooltip ? "Enabled" : "Disabled"}`
              );
            } else {
              alert("Logged in as Guest Admin");
            }
          }}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
          title="Click to view session details"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white ring-1 ring-emerald-500/40">
            {user?.firstName && user?.lastName
              ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
              : "AM"}
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <div className="flex items-center gap-1 font-semibold text-white">
              <span>
                {user ? `${user.firstName} ${user.lastName}` : "Alex Morgan"}
              </span>
              <span className="text-[9px] text-zinc-400">▼</span>
            </div>
            <div className="text-[10px] text-zinc-400 capitalize">
              {user?.role === "admin" ? "Store Admin" : (user?.role || "Store Admin")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
