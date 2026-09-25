"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useAppSelector } from "@/store/hooks";

/**
 * Route: /dashboard (Home Page)
 * Beginner Note:
 * Protected route: checks if the user is authenticated via Redux auth state.
 * If not logged in, redirects immediately back to /login.
 */
export default function DashboardHomePage() {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 1. Read authentication state and user details from Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // 2. Protect route: redirect to /login if no active session is found
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("campus_user") : null;
    if (!isAuthenticated && !saved) {
      router.replace("/login");
    } else {
      setHasCheckedAuth(true);
    }
  }, [isAuthenticated, router]);

  // Don't render dashboard content until authentication is verified
  if (!hasCheckedAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-800 flex flex-col font-sans selection:bg-primary selection:text-white">
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex flex-1 relative">
        <Sidebar
          activeItem="home"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-6 lg:p-8 w-full space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Welcome, {user?.firstName ? `${user.firstName} ${user.lastName}` : "Alex Morgan"}!
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {user?.university || "Campus Commerce Dashboard"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs max-w-lg">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Redux Session Details
            </h2>
            <div className="text-xs text-zinc-700 space-y-2">
              <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                <span className="text-zinc-500">Email</span>
                <span className="font-semibold text-zinc-900">{user?.email || "student@campus.edu"}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                <span className="text-zinc-500">Role</span>
                <span className="font-semibold capitalize text-zinc-900">{user?.role || "Admin"}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                <span className="text-zinc-500">University</span>
                <span className="font-semibold text-zinc-900">{user?.university || "VNIT"}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-zinc-500">Status</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  ● Authenticated
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
