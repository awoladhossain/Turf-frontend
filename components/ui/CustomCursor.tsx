'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isMagneticActive, setIsMagneticActive] = useState(false);

  useEffect(() => {
    // Mobile / touch devices check to prevent rendering custom cursor
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
      return;
    }

    const dot = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    // Set initial positions
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // Use gsap.quickTo for ultra-smooth high-performance tracking (60+ FPS, zero React re-renders)
    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });

    const xToFollower = gsap.quickTo(follower, 'x', { duration: 0.4, ease: 'power3.out' });
    const yToFollower = gsap.quickTo(follower, 'y', { duration: 0.4, ease: 'power3.out' });

    // Show cursor on first mouse move
    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        setIsVisible(true);
        gsap.to([dot, follower], { opacity: 1, duration: 0.3 });
      }

      xToDot(e.clientX);
      yToDot(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    const onMouseEnterWindow = () => {
      setIsVisible(true);
      gsap.to([dot, follower], { opacity: 1, duration: 0.3 });
    };

    const onMouseLeaveWindow = () => {
      setIsVisible(false);
      gsap.to([dot, follower], { opacity: 0, duration: 0.3 });
    };

    // Global listener for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find nearest interactive element (a, button, input, select, textarea or element with 'data-cursor')
      const interactiveEl = target.closest('a, button, input, select, textarea, [data-cursor], [data-magnetic]');

      if (interactiveEl) {
        setIsHovered(true);

        // Check if there is custom text to show
        const text = interactiveEl.getAttribute('data-cursor-text');
        if (text) {
          setCursorText(text);
          // Scale up follower to contain text
          gsap.to(follower, {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(16, 185, 129, 0.95)', // emerald-500
            borderColor: 'rgba(16, 185, 129, 1)',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(dot, { scale: 0, duration: 0.2 });
        } else {
          // Standard hover effect: scale up, make translucent emerald glow
          const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(interactiveEl.tagName);
          gsap.to(follower, {
            width: isInput ? 45 : 55,
            height: isInput ? 45 : 55,
            backgroundColor: 'rgba(52, 211, 153, 0.15)', // emerald-400 with opacity
            borderColor: 'rgba(52, 211, 153, 0.8)',
            borderWidth: '2px',
            backdropFilter: 'blur(2px)',
            boxShadow: '0 0 20px rgba(52, 211, 153, 0.4)',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 0.5,
            backgroundColor: '#34d399', // emerald-400
            duration: 0.3,
          });
        }

        // Magnetic check
        if (interactiveEl.hasAttribute('data-magnetic')) {
          setIsMagneticActive(true);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest('a, button, input, select, textarea, [data-cursor], [data-magnetic]');

      if (interactiveEl) {
        // Only reset if we are moving completely out of the interactive boundary
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !relatedTarget.closest('a, button, input, select, textarea, [data-cursor], [data-magnetic]')) {
          setIsHovered(false);
          setCursorText('');
          setIsMagneticActive(false);

          // Reset styles
          gsap.to(follower, {
            width: 32,
            height: 32,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: '1.5px',
            backdropFilter: 'blur(0px)',
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 1,
            backgroundColor: '#ffffff',
            duration: 0.3,
          });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseenter', onMouseEnterWindow);
    window.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Hide default cursor globally on desktop
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnterWindow);
      window.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isVisible]);

  return (
    <>

      {/* Follower Ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-[1.5px] border-white/30 pointer-events-none z-[9999] opacity-0 flex items-center justify-center transition-opacity duration-300"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, width, height, background-color, border-color, box-shadow',
        }}
      >
        <span
          ref={labelRef}
          className={`text-[9px] font-black tracking-widest text-[#090d16] uppercase select-none transition-all duration-200 ${
            cursorText ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          {cursorText}
        </span>
      </div>

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[10000] opacity-0 transition-opacity duration-300"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
