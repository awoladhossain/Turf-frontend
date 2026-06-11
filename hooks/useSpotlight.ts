'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function useSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setterRef = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a proxy object to handle the interpolation and directly set CSS variables on update.
    // This is extremely high-performance and avoids getBoundingClientRect/layout reflows.
    const proxy = { x: 0, y: 0 };

    const xTo = gsap.quickTo(proxy, 'x', {
      duration: 0.4,
      ease: 'power3.out',
      onUpdate: () => {
        container.style.setProperty('--spotlight-x', `${proxy.x}px`);
      },
    });

    const yTo = gsap.quickTo(proxy, 'y', {
      duration: 0.4,
      ease: 'power3.out',
      onUpdate: () => {
        container.style.setProperty('--spotlight-y', `${proxy.y}px`);
      },
    });

    setterRef.current = { x: xTo, y: yTo };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (setterRef.current) {
      // Use pageX/pageY coordinates relative to the page root.
      // This is fast and matches the top-left (0,0) of the full-page container.
      setterRef.current.x(e.pageX);
      setterRef.current.y(e.pageY);
    }
  };

  return { containerRef, handleMouseMove };
}
