'use client';

import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isVisible = false;

    // Check if device supports hover (coarse pointers like mobile don't need custom cursor)
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      cursor.style.display = 'none';
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        cursor.style.display = 'block';
        cursorX = mouseX;
        cursorY = mouseY;
        isVisible = true;
      }
    };

    const onMouseEnter = () => {
      cursor.style.display = 'block';
      isVisible = true;
    };

    const onMouseLeave = () => {
      cursor.style.display = 'none';
      isVisible = false;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    let animationId: number;
    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      // 0.15 creates a smooth follow delay
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      animationId = requestAnimationFrame(animateCursor);
    };

    animationId = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      className="hidden pointer-events-none md:block"
    />
  );
}
