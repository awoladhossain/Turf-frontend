'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactElement<any>;
  range?: number; // Distance in pixels within which the magnetic effect triggers
  actionStrength?: number; // How strong the pull is (0 to 1)
}

export default function Magnetic({
  children,
  range = 45,
  actionStrength = 0.35,
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) return;

    const el = containerRef.current;
    if (!el) return;

    // Cache the page-relative coordinates of the element's center.
    // Document-relative coords are immune to scroll, so we don't need to listen to scroll events.
    let cachedCenterX = 0;
    let cachedCenterY = 0;
    let hasMeasured = false;

    const updateCachedPosition = () => {
      if (!el) return;
      // Temporarily clear GSAP transform to measure the original layout position
      const transform = el.style.transform;
      el.style.transform = 'none';
      const rect = el.getBoundingClientRect();
      el.style.transform = transform;

      cachedCenterX = rect.left + rect.width / 2 + window.scrollX;
      cachedCenterY = rect.top + rect.height / 2 + window.scrollY;
      hasMeasured = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMeasured) {
        updateCachedPosition();
      }

      // Calculate distance using page coordinates (immune to scrolling)
      const distanceX = e.pageX - cachedCenterX;
      const distanceY = e.pageY - cachedCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        // Inside active magnetic pull zone
        gsap.to(el, {
          x: distanceX * actionStrength,
          y: distanceY * actionStrength,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Outside the zone - snap back smoothly
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    const onMouseLeave = () => {
      // Snap back instantly on leave
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    const onMouseEnter = () => {
      updateCachedPosition();
    };

    window.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('resize', updateCachedPosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (el) {
        el.removeEventListener('mouseleave', onMouseLeave);
        el.removeEventListener('mouseenter', onMouseEnter);
      }
      window.removeEventListener('resize', updateCachedPosition);
    };
  }, [range, actionStrength]);

  // Clone the child to inject ref, custom data attributes, and styles
  return React.cloneElement(children, {
    ref: containerRef,
    'data-magnetic': 'true',
    className: `${children.props.className || ''} will-change-transform`,
  });
}

