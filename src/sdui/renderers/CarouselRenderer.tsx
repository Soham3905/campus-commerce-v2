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
export default function CarouselRenderer({ data = {}, children, style = {}, actions }: BaseRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const count = React.Children.count(children);
      if (prevIndex === count - 1) return data.infiniteLoop ? 0 : prevIndex;
      return prevIndex + 1;
    });
  }, [children, data.infiniteLoop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const count = React.Children.count(children);
      if (prevIndex === 0) return data.infiniteLoop ? count - 1 : prevIndex;
      return prevIndex - 1;
    });
  }, [children, data.infiniteLoop]);

  useEffect(() => {
    if (!data.autoPlay || !children) return;
    const interval = setInterval(() => {
      nextSlide();
    }, data.autoPlayInterval || 3000);
    return () => clearInterval(interval);
  }, [data.autoPlay, data.autoPlayInterval, children, nextSlide]);

  const minSwipeDistance = actions?.onSwipeLeft?.minSwipeDistance || actions?.onSwipeRight?.minSwipeDistance || data?.minSwipeDistance || 50;
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    minSwipeDistance
  });

  if (!children) return null;

  return (
    <div
      style={{ position: "relative", overflow: "hidden", borderRadius: "10px", userSelect: "none", ...style }}
      {...swipeHandlers}
    >
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: "100%" }}>{child}</div>
        ))}
      </div>
      {data.showDots && (
        <div style={{ position: "absolute", bottom: "10px", width: "100%", display: "flex", justifyContent: "center" }}>
          {React.Children.map(children, (_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: currentIndex === idx ? "#1b1919" : "rgba(100, 96, 96, 0.5)",
                cursor: "pointer",
                transition: "width 0.3s ease",
                margin: "0 3px"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
