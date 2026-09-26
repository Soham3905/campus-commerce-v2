"use client";

import { useRef } from "react";

/**
 * ==============================================================================
 * Hook: useSwipe (Touch & Mouse Drag Detection)
 * ==============================================================================
 * Beginner Note:
 * This custom hook listens to user touch gestures (on phones/tablets) and
 * mouse drag gestures (on desktops).
 *
 * When a user swipes left, right, up, or down across a banner or carousel by at
 * least `minSwipeDistance` pixels (default: 50px), it triggers the appropriate
 * callback function.
 */

export interface UseSwipeOptions {
  onSwipeLeft?: (() => void) | null;
  onSwipeRight?: (() => void) | null;
  onSwipeUp?: (() => void) | null;
  onSwipeDown?: (() => void) | null;
  minSwipeDistance?: number;
}

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
}

export default function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
}: UseSwipeOptions): SwipeHandlers {
  // Store start coordinates for touch gestures
  const touchStart = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  // Store start coordinates for mouse clicks/drags
  const mouseStart = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  // ---------------------------------------------------------------------------
  // Touch Handlers (Mobile & Tablet)
  // ---------------------------------------------------------------------------
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStart.current.x === null || touchStart.current.y === null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const distanceX = touchStart.current.x - endX;
    const distanceY = touchStart.current.y - endY;

    // Check if horizontal movement is greater than vertical movement
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance && onSwipeLeft) {
        onSwipeLeft();
      } else if (distanceX < -minSwipeDistance && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      // Vertical movement
      if (distanceY > minSwipeDistance && onSwipeUp) {
        onSwipeUp();
      } else if (distanceY < -minSwipeDistance && onSwipeDown) {
        onSwipeDown();
      }
    }

    // Reset touch start
    touchStart.current = { x: null, y: null };
  };

  // ---------------------------------------------------------------------------
  // Mouse Handlers (Desktop drag-swipe)
  // ---------------------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    mouseStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (mouseStart.current.x === null || mouseStart.current.y === null) return;

    const endX = e.clientX;
    const endY = e.clientY;

    const distanceX = mouseStart.current.x - endX;
    const distanceY = mouseStart.current.y - endY;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance && onSwipeLeft) {
        onSwipeLeft();
      } else if (distanceX < -minSwipeDistance && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      if (distanceY > minSwipeDistance && onSwipeUp) {
        onSwipeUp();
      } else if (distanceY < -minSwipeDistance && onSwipeDown) {
        onSwipeDown();
      }
    }

    // Reset mouse start
    mouseStart.current = { x: null, y: null };
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onDragStart: (e: React.DragEvent<HTMLElement>) => e.preventDefault(),
  };
}

export { useSwipe };
