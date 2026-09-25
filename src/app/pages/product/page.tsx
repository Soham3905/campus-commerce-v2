"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

interface ProductRow {
  id: string;
  name: string;
  icon: string;
  status: "Active" | "Draft" | "Archived";
  inventory: string;
  colA: number;
  colB: number;
  category?: string;
  store: string;
}

const INITIAL_PRODUCTS: ProductRow[] = [
  {
    id: "1",
    name: "Coconut Bar shop",
    icon: "🧴",
    status: "Active",
    inventory: "0 In stock",
    colA: 1,
    colB: 3,
    store: "My store",
  },
  {
    id: "2",
    name: "Copy of custom notebook",
    icon: "📕",
    status: "Draft",
    inventory: "0 In stock for 24 variants",
    colA: 5,
    colB: 3,
    category: "Not book & note pad",
    store: "JS Mob",
  },
  {
    id: "3",
    name: "Custom handcraft note book",
    icon: "📦",
    status: "Active",
    inventory: "Inventory not tracked",
    colA: 4,
    colB: 3,
    category: "Mug",
    store: "My store",
  },
  {
    id: "4",
    name: "Example hat",
    icon: "🧢",
    status: "Archived",
    inventory: "5 In stock for 20 variants",
    colA: 1,
    colB: 3,
    category: "Clothing",
    store: "JS Mob",
  },
  {
    id: "5",
    name: "Handcrafted notebook",
    icon: "📷",
    status: "Active",
    inventory: "0 In stock",
    colA: 4,
    colB: 3,
    category: "Clothing",
    store: "JS Mob",
  },
  {
    id: "6",
    name: "Example hat",
    icon: "🧢",
    status: "Active",
    inventory: "Inventory not tracked",
    colA: 2,
    colB: 3,
    category: "Clothing",
    store: "My store",
  },
];

/**
 * ==============================================================================
 * Route: /pages/product
 * ==============================================================================
 * Beginner Note:
 * This page displays the Products Catalog with:
 * - Active "Products" menu in the sidebar.
 * - Yan Copilot restock recommendation card.
 * - 3-column metric cards.
 * - Interactive products table with row selection and tab filtering.
 * - Floating bulk action bar.
 */
export default function ProductPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "3", "5"]);
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Draft" | "Custom">("All");
  const [isCopilotVisible, setIsCopilotVisible] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle single row selection
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all visible rows
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  // Filter products by active tab & search query
  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    if (activeTab === "Active" && product.status !== "Active") return false;
    if (activeTab === "Draft" && product.status !== "Draft") return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-800 flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* 1. Global Dark Header Bar */}
      <Header
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Layout: Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Left Navigation Sidebar with "products" active */}
        <Sidebar
          activeItem="products"
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 w-full space-y-5 overflow-x-hidden">
          {/* Top Row: Title + Yan Copilot Card */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Products
              </h1>
            </div>

            {/* Yan Copilot Interactive Floating Widget */}
            {isCopilotVisible && (
              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-300/80 bg-white p-3 shadow-sm max-w-md w-full animate-fade-in ring-1 ring-emerald-500/10">
                {/* Yan Mascot Avatar */}
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-0.5">
                  <Image
                    src="/mascot_yan.png"
                    alt="Yan Copilot"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                {/* Copilot Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">Yan Copilot</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-600 leading-tight">
                    3 selected active items have 0 inventory. Create restock order?
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsCopilotVisible(false)}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => alert("Restock Draft Order created by Yan Copilot!")}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-95 transition"
                  >
                    Draft Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Metric Summary Cards: Single wide card divided into 3 columns */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-zinc-200 md:divide-x">
            {/* Metric 1 */}
            <div className="p-5">
              <span className="text-xs text-zinc-500 font-medium">Product by sell through rate</span>
              <div className="mt-2 text-2xl font-bold text-zinc-900">
                0% <span className="text-zinc-400 font-normal text-lg">-</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5">
              <span className="text-xs text-zinc-500 font-medium">Product by day of inventory remaining</span>
              <p className="mt-2 text-xs text-zinc-500">There was no data found in data inventory</p>
            </div>

            {/* Metric 3 */}
            <div className="p-5">
              <span className="text-xs text-zinc-500 font-medium">ABC product analysis</span>
              <p className="mt-2 text-xs text-zinc-500">There was no data found in data inventory</p>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden">
            {/* Filter Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 px-4 py-3 gap-3">
              {/* Tab options */}
              <div className="flex items-center gap-1.5">
                {(["All", "Active", "Draft", "Custom"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? "bg-zinc-100 text-zinc-900 shadow-2xs font-bold"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
                <button
                  onClick={() => alert("Create custom tab view")}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-400 hover:text-zinc-700"
                  aria-label="Add custom view"
                >
                  ➕
                </button>
              </div>

              {/* Action Icons on right */}
              <div className="flex items-center gap-3 text-zinc-400 text-xs">
                <button title="Search" className="hover:text-zinc-700 p-1">🔍</button>
                <button title="Filters" className="hover:text-zinc-700 p-1">⚙️</button>
                <button title="Sort" className="hover:text-zinc-700 p-1">⇅</button>
              </div>
            </div>

            {/* Table Selection Bar */}
            <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50/70 px-4 py-2.5 text-xs text-zinc-700 font-semibold">
              <input
                type="checkbox"
                id="master-select-all"
                checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-primary accent-[#1c3829]"
              />
              <label htmlFor="master-select-all" className="cursor-pointer select-none">
                {selectedIds.length} selected
              </label>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.map((product) => {
                    const isChecked = selectedIds.includes(product.id);
                    return (
                      <tr
                        key={product.id}
                        onClick={() => toggleSelectRow(product.id)}
                        className={`transition cursor-pointer hover:bg-zinc-50/80 ${
                          isChecked ? "bg-zinc-50/60" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="w-10 px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(product.id)}
                            className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-[#1c3829]"
                          />
                        </td>

                        {/* Product Icon & Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-lg shadow-2xs">
                              {product.icon}
                            </div>
                            <span className="font-semibold text-zinc-900">{product.name}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${
                              product.status === "Active"
                                ? "bg-emerald-100 text-emerald-800"
                                : product.status === "Draft"
                                ? "bg-zinc-200 text-zinc-700"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        {/* Inventory */}
                        <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap">
                          {product.inventory}
                        </td>

                        {/* Col A & Col B */}
                        <td className="px-4 py-3.5 text-zinc-600 font-mono">{product.colA}</td>
                        <td className="px-4 py-3.5 text-zinc-600 font-mono">{product.colB}</td>

                        {/* Category */}
                        <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap">
                          {product.category || "—"}
                        </td>

                        {/* Store Channel */}
                        <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap">
                          {product.store}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Floating Action Bar at bottom center */}
          {selectedIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full border border-zinc-200/90 bg-white/95 backdrop-blur-md px-5 py-2.5 shadow-xl ring-1 ring-black/5 text-xs font-semibold text-zinc-700 animate-fade-in">
              <button
                onClick={() => alert(`Bulk editing ${selectedIds.length} items`)}
                className="hover:text-zinc-900 transition"
              >
                Bulk edit
              </button>
              <span className="text-zinc-300">|</span>
              <button
                onClick={() => alert(`Set ${selectedIds.length} items as active`)}
                className="hover:text-zinc-900 transition"
              >
                Set as active
              </button>
              <span className="text-zinc-300">|</span>
              <button
                onClick={() => alert(`Set ${selectedIds.length} items as draft`)}
                className="hover:text-zinc-900 transition"
              >
                Set as draft
              </button>
              <span className="text-zinc-300">|</span>
              <button
                onClick={() => alert("More options")}
                className="hover:text-zinc-900 transition font-bold"
              >
                •••
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
