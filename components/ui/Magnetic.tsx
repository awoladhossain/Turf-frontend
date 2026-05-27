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

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      // Distance between cursor and element center
      const distanceX = e.clientX - elCenterX;
      const distanceY = e.clientY - elCenterY;

      // Calculate absolute distance
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

    window.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (el) {
        el.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [range, actionStrength]);

  // Clone the child to inject ref, custom data attributes, and styles
  return React.cloneElement(children, {
    ref: containerRef,
    'data-magnetic': 'true',
    className: `${children.props.className || ''} will-change-transform`,
  });
}
