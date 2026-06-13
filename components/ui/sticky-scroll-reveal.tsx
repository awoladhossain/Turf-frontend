"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Detect when each card passes the center of the viewport
    const observerOptions = {
      root: null, // viewport
      rootMargin: "-35% 0px -45% 0px", // triggers when card is in the center-upper part of the screen
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setActiveCard(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each card element
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col lg:flex-row justify-center items-start space-y-10 lg:space-y-0 lg:space-x-12 xl:space-x-20 py-12 px-4 max-w-6xl mx-auto"
    >
      {/* Left side text cards */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {content.map((item, index) => {
          const isActive = activeCard === index;
          return (
            <div
              key={item.title + index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              data-index={index}
              className="min-h-[50vh] flex flex-col justify-center py-12 first:pt-0 last:pb-24"
            >
              <motion.div
                initial={{ opacity: 0.2, x: -10 }}
                animate={{
                  opacity: isActive ? 1 : 0.2,
                  x: isActive ? 0 : -10,
                  scale: isActive ? 1.02 : 1,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4 origin-left"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold whitespace-pre-line max-w-lg">
                  {item.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Right side sticky card */}
      <div className="sticky top-[22vh] hidden lg:block w-full lg:w-[480px] xl:w-[520px] aspect-[4/3] rounded-3xl border border-slate-900 bg-[#0d1425]/40 backdrop-blur-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Layered Content for Crossfade */}
        <div className="relative w-full h-full">
          {content.map((item, index) => {
            const isActive = activeCard === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.95,
                  zIndex: isActive ? 10 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {item.content}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
