'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users, Zap, Star, ShieldCheck, Heart, ArrowUpRight, Flame, Clock } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/ui/Magnetic';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Minimalist Uniform Chronology Data
const TIMELINE_EVENTS = [
  {
    year: '2022',
    title: 'দ্য ফ্রিকশন (The Friction)',
    subtitle: 'A Late Night Double-Booking Chaos',
    desc: 'বনানীর একটি মাঠে ৭-এ-সাইড ম্যাচের জন্য আমরা বন্ধুরা জড়ো হয়েছিলাম। ৫ দিন আগে ফোনে মাঠ বুক করার পরেও বুকিং রেজিস্টারে নামের গোঁজামিলের কারণে অন্য টিম খেলছিল। এই প্রাচীন অ্যানালগ হ্যাসেল আমাদের ভাবিয়ে তোলে। সেই রাতেই জন্ম নেয় টার্ফবুক আইডিয়া।',
    icon: <Clock className="h-4 w-4 text-emerald-400" />
  },
  {
    year: '2023',
    title: 'দ্য জেনেসিস (The Genesis)',
    subtitle: 'Developing the Automated Concurrency Lock',
    desc: 'একটি ছোট কফি শপে শুরু হয় প্রথম কোড লাইন। ডাবল বুকিং চিরতরে বন্ধ করতে আমরা তৈরি করলাম অ্যাডভান্সড রিয়েল-টাইম স্লট লকিং মেকানিজম। ঢাকার ৫টি প্রিমিয়াম এরেনা যুক্ত করে খেলোয়াড়দের জন্য ইনস্ট্যান্ট বুকিং গেটওয়ে ওপেন করা হলো।',
    icon: <Zap className="h-4 w-4 text-emerald-400" />
  },
  {
    year: '2024',
    title: 'দ্য রেভোলিউশন (The Revolution)',
    subtitle: 'Onboarding 50+ Arenas and 10,000+ Players',
    desc: 'টার্ফবুক পরিণত হলো ঢাকার সবচেয়ে বিশ্বস্ত স্পোর্টস প্ল্যাটফর্মে। ধানমন্ডি, গুলশান, বনানী এবং মিরপুরের ৫০টিরও বেশি প্রিমিয়াম এরেনা যুক্ত হলো। ডাবল বুকিং এর হার নেমে আসলো শূন্যের কোঠায়। আমরা ঢাকার ক্রীড়াপ্রেমী খেলোয়াড়দের অফিসিয়াল বুকিং পার্টনার হলাম।',
    icon: <Trophy className="h-4 w-4 text-emerald-400" />
  },
  {
    year: '2025+',
    title: 'দ্য ফিউচার (The Horizon)',
    subtitle: 'Smart Portfolios and Matchmaking Ecosystems',
    desc: 'আমাদের লক্ষ্য শুধু মাঠ বুকিং নয়—আমরা গড়ছি বাংলাদেশের প্রথম কমপ্লিট স্পোর্টস ইকোসিস্টেম। অটোমেটেড ম্যাচমেকিং, মেম্বারশিপ ট্যুরস এবং প্লেয়ার কোয়ালিটি ড্যাশবোর্ড নিয়ে আসছি খুব শীঘ্রই। প্রতিটি প্লেয়ার পাবে তাদের নিজস্ব ম্যাচ অ্যানালিটিক্স।',
    icon: <Flame className="h-4 w-4 text-emerald-400" />
  }
];

export default function AboutPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const oathRef = useRef<HTMLDivElement>(null);
  
  // Background glows
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create GSAP context for proper cleanup of ScrollTriggers and timelines during route navigation
    const ctx = gsap.context(() => {
      // --- 1. Set initial clean states for elements ---
      gsap.set([badgeRef.current, subtitleRef.current, statsRef.current, oathRef.current], { opacity: 0, y: 20 });
      gsap.set(".char-anim", { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
      gsap.set(".timeline-node", { opacity: 0, y: 30 });

      // --- 2. Build elegant entrance timelines ---
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      // Staggered upward slide and fade-in reveals
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
      
      // Character cascade (Fast, fluid, premium stagger)
      tl.to(".char-anim", {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.012,
        duration: 0.8,
        ease: 'power4.out'
      }, '-=0.4');

      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      tl.to(statsRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

      // Stagger timeline card reveals as scroll approaches
      gsap.fromTo(".timeline-node", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 80%",
          }
        }
      );

      // Founders oath reveal on scroll
      gsap.fromTo(oathRef.current,
        { opacity: 0, scale: 0.98, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ".oath-section",
            start: "top 85%",
          }
        }
      );

      // Subtle background glowing float
      gsap.to(orbitRef.current, {
        y: '+=15',
        x: '-=10',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, pageContainerRef);

    return () => {
      ctx.revert(); // Cleanly kills all ScrollTriggers and reverts animations to prevent black screen bugs
    };
  }, []);

  // --- 3. Spotlight coordinates tracking ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = pageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(container, {
      '--spotlight-x': `${x}px`,
      '--spotlight-y': `${y}px`,
      duration: 0.5,
      ease: 'power3.out'
    });
  };

  // 3D character text splitter with custom support for gradient text classes
  const render3DLetters = (line: string, customClass: string = '') => {
    return line.split('').map((char, index) => (
      <span
        key={index}
        className={`char-anim inline-block hover:text-emerald-400 transition-all duration-200 cursor-default ${customClass}`}
        style={{ perspective: '1000px', display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div 
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      {/* 🌌 High-Performance Grid Spotlight Layer */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.16] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.05), transparent 50%)'
        }}
      />

      {/* Floating Animated Neon Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      {/* --- HERO CONTENT WRAPPER --- */}
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Intro Storytelling Headers */}
        <div className="text-center space-y-5 max-w-3xl mx-auto flex flex-col items-center">
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div 
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="SINCE 2022"
              >
                <Trophy className="h-3 w-3" />
                <span>Our Heritage & Legacy</span>
              </div>
            </Magnetic>
          </div>

          <h1 
            ref={titleRef}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform"
          >
            <div>{render3DLetters("Revolutionizing How")}</div>
            <div className="mt-1">
              {render3DLetters("Dhaka ")}
              <span 
                className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                data-cursor-text="SPORTS"
              >
                {render3DLetters("Plays Sports", "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400")}
              </span>
            </div>
          </h1>

          <p 
            ref={subtitleRef}
            className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-semibold will-change-transform"
          >
            টার্ফবুক (TurfBook) শুধুমাত্র একটি স্লট বুকিং সিস্টেম নয়; এটি ঢাকার ক্রীড়াপ্রেমীদের একটি
            আধুনিক ডিজিটাল ইকোসিস্টেম। মাঠ খোঁজা থেকে শুরু করে বুকিং কনফার্মেশন—সবকিছুকে আমরা নিয়ে এসেছি আপনার
            আঙুলের ডগায়। নো টেনশন, জাস্ট প্লে!
          </p>
        </div>

        {/* --- DYNAMIC METRICS BOARD (Sleek Clean Metric Cards) --- */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 will-change-transform"
        >
          {[
            {
              icon: <Users className="h-4.5 w-4.5 text-emerald-400" />,
              value: '১০,০০০+',
              label: 'Active Players',
              hoverText: 'PLAYERS'
            },
            {
              icon: <Trophy className="h-4.5 w-4.5 text-emerald-400" />,
              value: '৫০+',
              label: 'Verified Arenas',
              hoverText: 'ARENAS'
            },
            {
              icon: <Zap className="h-4.5 w-4.5 text-emerald-400" />,
              value: '১ মিনিট',
              label: 'Instant Booking',
              hoverText: 'SPEED'
            },
            { 
              icon: <Star className="h-4.5 w-4.5 text-emerald-400" />, 
              value: '৪.৯', 
              label: 'Average Rating',
              hoverText: 'RATING'
            },
          ].map((stat, i) => (
            <Magnetic key={i} range={15} actionStrength={0.15}>
              <div 
                className="text-center p-5 rounded-2xl bg-[#0d1425]/25 border border-slate-900 hover:border-emerald-500/20 group cursor-pointer transition-all duration-300 hover:bg-[#0d1425]/45"
                data-cursor-text={stat.hoverText}
              >
                <div className="mx-auto w-fit p-2 bg-[#050811] rounded-full border border-slate-850 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 mb-3.5 flex items-center justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white transition-colors duration-300">
                  {stat.value}
                </h3>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            </Magnetic>
          ))}
        </div>

        {/* --- THE LEGACY CHRONOLOGY (Minimal Vertical Timeline) --- */}
        <div className="timeline-container space-y-10 relative max-w-3xl mx-auto pt-6">
          {/* Vertical central pipeline (Uniform color) */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[1px] bg-slate-800/40 -translate-x-1/2 hidden md:block" />
          
          <div className="text-center space-y-1.5 pb-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Our Journey Chronicle</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">কিভাবে ফুটবলপ্রেমীদের একটি আইডিয়া বদলে দিল ঢাকার খেলার ধরণ</p>
          </div>

          <div className="space-y-10">
            {TIMELINE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index} 
                  className="timeline-node relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0 will-change-transform"
                >
                  
                  {/* Left / Right Card placement */}
                  <div className={`w-full md:w-[46%] ${isEven ? 'md:order-1' : 'md:order-2 md:text-left'}`}>
                    <div className="p-5.5 rounded-2xl bg-[#0d1425]/20 border border-slate-900/80 backdrop-blur-2xl shadow-sm space-y-3 hover:border-emerald-500/10 hover:bg-[#0d1425]/30 transition-all duration-300">
                      
                      {/* Timeline Card Header */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#050811] rounded-full border border-slate-850 flex items-center justify-center">
                          {event.icon}
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{event.year} Milestone</span>
                          <h3 className="text-sm font-black tracking-tight text-white">{event.title}</h3>
                        </div>
                      </div>

                      <div className="h-[1px] bg-slate-800/30 w-full" />
                      
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>

                  {/* Centered Timeline Node Dot */}
                  <div className="absolute left-6 md:left-1/2 top-7 md:top-1/2 w-6 h-6 rounded-full bg-[#050811] border border-slate-800 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none md:flex">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>

                  {/* Empty Spacer Column for layout balancing */}
                  <div className={`w-full md:w-[46%] hidden md:block ${isEven ? 'md:order-2' : 'md:order-1'}`} />

                </div>
              );
            })}
          </div>
        </div>

        {/* --- THE FOUNDERS' OATH / CORE VALUE BLOCK --- */}
        <div className="oath-section pt-8">
          <div 
            ref={oathRef}
            className="relative bg-[#0d1425]/20 backdrop-blur-2xl border border-slate-900 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm flex flex-col sm:flex-row items-center gap-8 overflow-hidden will-change-transform"
          >
            {/* Glowing Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-400 hidden sm:block" />

            {/* Avatar image size perfectly balanced */}
            <div className="relative h-20 w-20 rounded-full overflow-hidden border border-slate-850 flex-shrink-0 group bg-slate-900 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200"
                alt="Players on turf"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
              />
            </div>

            <div className="space-y-3.5 flex-grow">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <Heart className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                <span>The Founders&apos; Promise</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                Our Oath: ঢাকার খেলোয়াড়দের জন্য একটি নির্ভুল ডিজিটাল স্বর্গ
              </h2>
              
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed italic">
                &ldquo;টার্ফবুক শুধুমাত্র মাঠ বুকিং অ্যাপ নয়। আমরা যখন প্রথমবার ডাবল-বুকিং এর তিক্ত অভিজ্ঞতার মুখোমুখি হয়েছিলাম, তখনই ঠিক করেছিলাম—ঢাকার মাঠে কোন ফুটবল বা ক্রিকেট ম্যাচ যেন বুকিং জটিলতায় নষ্ট না হয়। প্রতিটি বুকিং যেন হয় রিলায়েবল ও ইনস্ট্যান্ট।&rdquo;
              </p>

              <div className="h-[1px] bg-slate-850 w-full" />
              
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <div>Awolad Hossain & Friends — Founders, TurfBook</div>
                
                <Magnetic range={15} actionStrength={0.25}>
                  <Link href="/turfs" className="text-emerald-400 flex items-center gap-0.5 group hover:text-emerald-350 transition-colors">
                    <span>Book Your Pitch Now</span>
                    <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </Magnetic>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
