"use client";

import { useState } from "react";

/**
 * ==============================================================================
 * Route: /dummy-content (Embedded Iframe Source Page)
 * ==============================================================================
 * Beginner Note:
 * This page is a standalone lightweight page designed to be embedded inside an
 * <iframe> on the /pages/dummy route.
 *
 * It simulates a live student noticeboard and marketplace feed for VNIT Campus
 * Commerce with interactive buttons, metric badges, and responsive cards.
 */
export default function DummyContentPage() {
  const [likeCount, setLikeCount] = useState(14);
  const [isLiked, setIsLiked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Sample dummy marketplace listings
  const items = [
    {
      id: 1,
      title: "Engineering Mechanics (B.Tech 1st Year)",
      category: "Books",
      price: "₹350",
      originalPrice: "₹750",
      seller: "Rohan S. • Mech Dept",
      condition: "Like New",
      badge: "53% OFF",
      icon: "📚",
    },
    {
      id: 2,
      title: "Arduino Uno R3 Starter Kit + Sensors",
      category: "Electronics",
      price: "₹850",
      originalPrice: "₹1,400",
      seller: "Ananya P. • ECE Dept",
      condition: "Excellent",
      badge: "Popular",
      icon: "⚡",
    },
    {
      id: 3,
      title: "Hercules 21-Speed Gear Bicycle",
      category: "Mobility",
      price: "₹2,600",
      originalPrice: "₹6,000",
      seller: "Vikram K. • Hostel 4",
      condition: "Good",
      badge: "Fast Deal",
      icon: "🚲",
    },
    {
      id: 4,
      title: "Casio Scientific Calculator fx-991CW",
      category: "Electronics",
      price: "₹700",
      originalPrice: "₹1,200",
      seller: "Sneha M. • CSE Dept",
      condition: "Mint",
      badge: "Verified",
      icon: "🔢",
    },
  ];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 p-2.5 sm:p-5 md:p-6 font-sans">
      {/* Top Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl sm:text-2xl">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-zinc-900">
                  VNIT Student Marketplace
                </h1>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-800">
                  Live Feed
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500">
                Peer-to-peer campus exchange • Verified VNIT student IDs only
              </p>
            </div>
          </div>

          {/* Interactive Like / Follow Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
              }}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 text-xs font-semibold transition active:scale-95 ${
                isLiked
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
              }`}
            >
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span>{likeCount} Saves</span>
            </button>

            <span className="rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono text-zinc-500">
              ⚡ Updated Now
            </span>
          </div>
        </div>

        {/* Quick Highlights / Metrics */}
        <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-zinc-100 pt-3 text-center">
          <div className="rounded-lg bg-zinc-50 p-1.5 sm:p-2">
            <span className="text-xs sm:text-sm font-bold text-zinc-900">48+</span>
            <p className="text-[9px] sm:text-xs text-zinc-500">Active Deals</p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-1.5 sm:p-2">
            <span className="text-xs sm:text-sm font-bold text-emerald-600">35%</span>
            <p className="text-[9px] sm:text-xs text-zinc-500">Avg Discount</p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-1.5 sm:p-2">
            <span className="text-xs sm:text-sm font-bold text-zinc-900">100%</span>
            <p className="text-[9px] sm:text-xs text-zinc-500">Handover</p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 shrink-0">
          Filter:
        </span>
        {["All", "Books", "Electronics", "Mobility"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition shrink-0 ${
              activeCategory === cat
                ? "bg-emerald-800 text-white font-semibold shadow-2xs"
                : "bg-white text-zinc-600 hover:bg-zinc-200/70 border border-zinc-200/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs hover:shadow-sm hover:border-zinc-300 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1">
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-zinc-400">{item.seller}</span>
                  </div>
                </div>

                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 shrink-0">
                  {item.badge}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-zinc-900">
                  {item.price}
                </span>
                <span className="text-[11px] text-zinc-400 line-through">
                  {item.originalPrice}
                </span>
              </div>

              <button
                onClick={() =>
                  alert(`Inquiring about: "${item.title}" with ${item.seller}`)
                }
                className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 active:scale-95 transition"
              >
                Inquire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info inside iframe */}
      <div className="mt-6 text-center text-[11px] text-zinc-400">
        Demo Iframe Page • Powered by Campus Commerce Next.js
      </div>
    </div>
  );
}
