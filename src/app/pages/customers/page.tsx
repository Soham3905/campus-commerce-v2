"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

/**
 * Route: /pages/customers (Customers Page)
 * Simple placeholder displaying the name of the page.
 */
export default function CustomersPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-800 flex flex-col font-sans selection:bg-primary selection:text-white">
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex flex-1 relative">
        <Sidebar
          activeItem="customers"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-6 lg:p-8 w-full space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Customers
          </h1>
          <p className="text-sm text-zinc-500">
            This is the Customers page.
          </p>
        </main>
      </div>
    </div>
  );
}
