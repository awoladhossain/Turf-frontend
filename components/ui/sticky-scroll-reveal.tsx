"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const stickyWrapperRef = useRef<HTMLDivElement>(null);
  const stickyCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const stickyWrapper = stickyWrapperRef.current;
    const stickyCard = stickyCardRef.current;

    if (!container || !stickyWrapper || !stickyCard) return;

    // Pin the card inside the wrapper using GSAP ScrollTrigger
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 20%",
      end: "bottom 70%",
      pin: stickyCard,
      anticipatePin: 1,
    });

    // Animate left-side cards and trigger active card change
    const cards = gsap.utils.toArray(".journey-card") as HTMLElement[];
    const tweens = cards.map((card, index) => {
      return gsap.fromTo(
        card,
        { opacity: 0.15, scale: 0.98, x: -15 },
        {
          opacity: 1,
          scale: 1.02,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
            onEnter: () => setActiveCard(index),
            onEnterBack: () => setActiveCard(index),
          },
        }
      );
    });

    // Refresh ScrollTrigger to ensure all dimensions are correctly calculated
    ScrollTrigger.refresh();

    return () => {
      pinTrigger.kill();
      tweens.forEach((t) => {
        t.kill();
        t.scrollTrigger?.kill();
      });
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col lg:flex-row justify-center items-start lg:space-x-12 xl:space-x-20 py-12 px-4 max-w-6xl mx-auto"
    >
      {/* Left side text cards */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {content.map((item, index) => {
          return (
            <div
              key={item.title + index}
              className="journey-card min-h-[50vh] flex flex-col justify-center py-16 first:pt-0 last:pb-24 origin-left"
            >
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold whitespace-pre-line max-w-lg">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right side sticky wrapper */}
      <div
        ref={stickyWrapperRef}
        className="hidden lg:block w-full lg:w-[480px] xl:w-[520px] self-stretch relative"
      >
        {/* Pinned Card */}
        <div
          ref={stickyCardRef}
          className="w-full aspect-[4/3] rounded-3xl border border-slate-900 bg-[#0d1425]/40 backdrop-blur-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
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
                      : "opacity-0 scale-95 -rotate-1 z-0 pointer-events-none"
                  )}
                >
                  {item.content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
