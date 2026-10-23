"use client";

import React, { useState, useEffect, useCallback } from "react";
import useSwipe from "../hooks/useSwipe";
import type { BaseRendererProps } from "../types";

/**
 * ==============================================================================
 * SDUI Renderer: CarouselRenderer
 * ==============================================================================
 * Beginner Note:
 * Renders the "Carousel" component in the SDUI tree.
 * Receives standard props: { children, style, data, actions, ... }
 */
export default function CarouselRenderer({
  data = {},
  children,
  style = {},
  actions,
  onClick,
}: BaseRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const childrenArray = React.Children.toArray(children);
  const totalCount = childrenArray.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (totalCount <= 1) return 0;
      if (prevIndex >= totalCount - 1) {
        return data.infiniteLoop !== false ? 0 : prevIndex;
      }
      return prevIndex + 1;
    });
  }, [totalCount, data.infiniteLoop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (totalCount <= 1) return 0;
      if (prevIndex <= 0) {
        return data.infiniteLoop !== false ? totalCount - 1 : 0;
      }
      return prevIndex - 1;
    });
  }, [totalCount, data.infiniteLoop]);

  useEffect(() => {
    if (!data.autoPlay || totalCount <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, data.autoPlayInterval || 4000);
    return () => clearInterval(interval);
  }, [data.autoPlay, data.autoPlayInterval, totalCount, nextSlide]);

  const minSwipeDistance =
    actions?.onSwipeLeft?.minSwipeDistance ||
    actions?.onSwipeRight?.minSwipeDistance ||
    data?.minSwipeDistance ||
    50;

  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    minSwipeDistance,
  });

  // Clean rigid dimensions from style so the carousel conforms fluidly to its container
  const {
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    scrollbarWidth,
    msOverflowStyle,
    ...cleanStyle
  } = (style || {}) as any;

  if (totalCount === 0) {
    return (
      <div
        onClick={onClick}
        role="region"
        aria-label="Image Carousel"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "180px",
          backgroundColor: cleanStyle.backgroundColor || "#F8FAFC",
          borderRadius: cleanStyle.borderRadius || "16px",
          border: cleanStyle.border || "2px dashed #CBD5E1",
          color: "#64748B",
          padding: "20px",
          boxSizing: "border-box",
          userSelect: "none",
          ...cleanStyle,
        }}
      >
        <span style={{ fontSize: "24px", marginBottom: "6px" }}>🖼️</span>
        <span style={{ fontSize: "13px", fontWeight: "600" }}>Carousel is empty</span>
        <span style={{ fontSize: "11px", opacity: 0.7 }}>Add Image slides to start</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="region"
      aria-label="Image Carousel"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "180px",
        backgroundColor: cleanStyle.backgroundColor || "#F8FAFC",
        borderRadius: cleanStyle.borderRadius || "16px",
        border: cleanStyle.border || "1px solid #E2E8F0",
        overflow: "hidden",
        boxSizing: "border-box",
        userSelect: "none",
        ...cleanStyle,
      }}
      {...swipeHandlers}
    >
      {/* 1. Sliding Track */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {childrenArray.map((child, idx) => (
          <div
            key={idx}
            style={{
              minWidth: "100%",
              width: "100%",
              height: "100%",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* 2. Left / Right Navigation Arrows */}
      {data?.showArrows !== false && totalCount > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous Slide"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#1E293B",
              fontSize: "18px",
              lineHeight: 1,
              zIndex: 10,
              transition: "transform 0.15s ease",
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next Slide"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#1E293B",
              fontSize: "18px",
              lineHeight: 1,
              zIndex: 10,
              transition: "transform 0.15s ease",
            }}
          >
            ›
          </button>
        </>
      )}

      {/* 3. Dot Indicators */}
      {data?.showDots !== false && totalCount > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            zIndex: 10,
            pointerEvents: "auto",
          }}
        >
          {childrenArray.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              style={{
                width: currentIndex === idx ? "20px" : "7px",
                height: "7px",
                borderRadius: "4px",
                backgroundColor:
                  currentIndex === idx
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.5)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.25s ease, background-color 0.25s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
