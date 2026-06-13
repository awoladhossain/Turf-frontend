"use client";
import React, { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    // Detect when each card passes the center of the viewport
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Middle 10% of the screen
      threshold: 0,
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
    const cards = containerRef.current?.querySelectorAll(".journey-card");
    cards?.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col lg:flex-row justify-center items-start lg:space-x-12 xl:space-x-20 py-12 px-4 max-w-6xl mx-auto"
    >
      {/* Left side text cards */}
      <div className="w-full lg:w-1/2 flex flex-col space-y-[20vh] py-[10vh]">
        {content.map((item, index) => {
          const isActive = activeCard === index;
          return (
            <div
              key={item.title + index}
              data-index={index}
              className="journey-card min-h-[40vh] flex flex-col justify-center transition-all duration-500 ease-out origin-left"
              style={{
                opacity: isActive ? 1 : 0.15,
                transform: isActive ? "scale(1.03) translateX(0px)" : "scale(1) translateX(-15px)",
              }}
            >
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white transition-colors duration-500">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold whitespace-pre-line max-w-lg transition-colors duration-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right side sticky card container */}
      <div
        className={cn(
          "hidden lg:block sticky top-[22vh] w-full lg:w-[480px] xl:w-[520px] aspect-[4/3] rounded-3xl border border-slate-900 bg-[#0d1425]/40 backdrop-blur-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out",
          contentClassName
        )}
      >
        <div className="relative w-full h-full">
          {content.map((item, index) => {
            const isActive = activeCard === index;
            return (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform origin-center",
                  isActive
                    ? "opacity-100 scale-100 rotate-0 z-10"
                    : "opacity-0 scale-95 z-0 pointer-events-none"
                )}
              >
                {item.content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
