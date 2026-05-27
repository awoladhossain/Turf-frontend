'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Search, ShieldCheck, Trophy, Users, Zap, ChevronDown, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Magnetic from '@/components/ui/Magnetic';

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);

  // GSAP Refs for entrance triggers
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const trustBadgeContainerRef = useRef<HTMLDivElement>(null);
  const locationChipsRef = useRef<HTMLDivElement>(null);
  
  // Glowing orbit refs
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);

  // Icon refs for hover animations
  const usersIconRef = useRef<HTMLDivElement>(null);
  const trophyIconRef = useRef<HTMLDivElement>(null);
  const shieldIconRef = useRef<HTMLDivElement>(null);

  // Sport Dropdown Ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Popular locations data
  const POPULAR_LOCATIONS = ['Banani', 'Mirpur', 'Dhanmondi', 'Gulshan'];

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // --- 1. Reset initial opacity before timeline triggers ---
    gsap.set([badgeRef.current, subtitleRef.current, searchBarRef.current, trustBadgeContainerRef.current, locationChipsRef.current], { 
      opacity: 0, 
      y: 20 
    });
    gsap.set([orbit1Ref.current, orbit2Ref.current], { opacity: 0, scale: 0.95 });
    
    // Hide letters initially for 3D stagger
    gsap.set(".char-anim", { opacity: 0, y: 30, rotateX: -30, transformOrigin: "top center" });

    // --- 2. Create high-end entrance timeline ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    // Background glows scale in
    tl.to([orbit1Ref.current, orbit2Ref.current], {
      opacity: (index) => (index === 0 ? 0.25 : 0.15),
      scale: 1,
      duration: 1.4,
      stagger: 0.2
    });

    // Staggered upward slide and fade-in reveals
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=1.0');
    
    // 3D Letter-by-Letter stagger cascade
    tl.to(".char-anim", {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.012,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.8');
    
    // Subtitle reveal
    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    
    // Search bar elastic pop-up
    tl.to(searchBarRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.8,
      ease: 'back.out(1.15)'
    }, '-=0.4');

    // Location chips fade in
    tl.to(locationChipsRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6');
    
    // Trust badges reveal
    tl.to(trustBadgeContainerRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

    // --- 3. Subtle floating animations for the orbits ---
    gsap.to(orbit1Ref.current, {
      y: '+=20',
      x: '-=15',
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(orbit2Ref.current, {
      y: '-=20',
      x: '+=15',
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- 4. Spotlight Mouse-Tracking Interactive Grid Physics ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mainContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Smoothly animate spotlight position coordinates via GSAP
    gsap.to(container, {
      '--spotlight-x': `${x}px`,
      '--spotlight-y': `${y}px`,
      duration: 0.5,
      ease: 'power3.out'
    });
  };

  // --- 5. Micro-physics Hover Animations for Trust Badge Icons ---
  const playIconAnimation = (ref: React.RefObject<HTMLDivElement | null>, type: 'spin' | 'bounce' | 'pulse') => {
    const el = ref.current;
    if (!el) return;

    if (type === 'spin') {
      gsap.to(el, { rotate: 360, duration: 0.6, ease: 'back.out(1.5)' });
    } else if (type === 'bounce') {
      gsap.to(el, { y: -5, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
    } else if (type === 'pulse') {
      gsap.to(el, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }
  };

  const resetIconAnimation = (ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotate: 0, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
  };

  // --- 6. Dynamic Click Animation for Location Selection Chips ---
  const selectLocationChip = (location: string, e: React.MouseEvent<HTMLSpanElement>) => {
    setSearchLocation(location);
    const target = e.currentTarget;
    gsap.fromTo(target, 
      { scale: 0.95 }, 
      { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.4)' }
    );
  };

  // Split title strings into character array to render 3D staggered letters
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
    <main 
      ref={mainContainerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#050811] overflow-hidden font-jakarta text-white select-none"
      style={{
        // Custom CSS variables for the mouse-tracking grid spotlight
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      
      {/* 🌌 High-End Spotlight Interactive Grid (Spotlight follows mouse) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.16] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
        style={{
          background: 'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.05), transparent 50%)'
        }}
      />

      {/* Floating Animated Neon Orbits */}
      <div
        ref={orbit1Ref}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#1e6b3e]/8 blur-[130px] rounded-full pointer-events-none will-change-transform"
      />
      <div
        ref={orbit2Ref}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none will-change-transform"
      />

      {/* --- HERO CONTENT WRAPPER --- */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-10 pt-8 pb-12">
        
        {/* Top Floating Badge */}
        <div ref={badgeRef} className="will-change-transform">
          <Magnetic range={20} actionStrength={0.15}>
            <div 
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
              data-cursor-text="DHAKA"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>14 Arenas Live Booking Now</span>
              <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </Magnetic>
        </div>
        <div className="space-y-5 max-w-4xl">
          <h1 
            ref={titleRef}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white will-change-transform"
          >
            <div>{render3DLetters("Find Your Pitch,")}</div>
            <div className="mt-1">
              {render3DLetters("Own Your ")}
              <span 
                className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                data-cursor-text="PLAY"
              >
                {render3DLetters("Game Time", "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400")}
              </span>
            </div>
          </h1>

          <p 
            ref={subtitleRef}
            className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed will-change-transform"
          >
            ঢাকা শহরের সেরা সব ভেরিফাইড ফুটবল এবং ক্রিকেট টার্ফ খুঁজুন, স্লট চেক করুন এবং কনফার্ম
            করুন মাত্র ১ মিনিটে।
            <span className="text-white font-bold"> নো টেনশন, জাস্ট প্লে!</span>
          </p>
        </div>

        {/* --- LUXURIOUS RE-ENGINEERED SEARCH BAR --- */}
        <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
          <div 
            ref={searchBarRef}
            className="relative z-30 w-full bg-[#0d1425]/40 backdrop-blur-2xl p-2 rounded-2xl sm:rounded-full border border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.55)] flex flex-col sm:flex-row items-center gap-3 sm:gap-1.5 hover:border-slate-800 focus-within:border-emerald-500/25 transition-all duration-300 will-change-transform"
          >
            {/* Location Field */}
            <div className="relative w-full sm:flex-1 group px-2">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="কোথায় খেলতে চান? (উদা: বনানী, মিরপুর...)"
                className="w-full h-10 pl-9 pr-3 bg-transparent outline-none text-xs font-semibold text-white placeholder-slate-500 focus:placeholder-slate-400 transition-all duration-300"
              />
            </div>

            <div className="hidden sm:block h-6 w-px bg-slate-800/40" />

            {/* Custom High-Fidelity Sports Dropdown Menu */}
            <div 
              ref={dropdownRef}
              className="relative w-full sm:w-40 px-3 h-10 flex items-center justify-between"
            >
              <button
                type="button"
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                className="flex items-center justify-between w-full h-full bg-slate-950/20 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-900 sm:border-0 px-3 sm:px-0 text-xs font-bold text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer"
                data-cursor-text={selectedSport.toUpperCase()}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-slate-500" />
                  <span>{selectedSport}</span>
                </div>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isSportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dynamic Dropdown Options List */}
              <AnimatePresence>
                {isSportDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-14 left-0 sm:left-1/2 sm:-translate-x-1/2 w-[180px] bg-[#0b0f19] border border-slate-850 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl"
                  >
                    {[
                      { value: 'Football', icon: '⚽' },
                      { value: 'Cricket', icon: '🏏' }
                    ].map((sport) => (
                      <button
                        key={sport.value}
                        type="button"
                        onClick={() => {
                          setSelectedSport(sport.value);
                          setIsSportDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-left transition-all duration-200 cursor-pointer ${
                          selectedSport === sport.value 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{sport.icon}</span>
                          <span>{sport.value}</span>
                        </span>
                        {selectedSport === sport.value && <Check className="h-3 w-3 text-emerald-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:block h-6 w-px bg-slate-800/40" />

            {/* Date Selection Box */}
            <div 
              className="relative w-full sm:w-36 px-3 h-10 flex items-center gap-2.5 bg-slate-950/20 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-900 sm:border-0 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors duration-300"
              data-cursor-text="TODAY"
            >
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-semibold text-left">Today / Tomorrow</span>
            </div>

            <div className="hidden sm:block h-6 w-px bg-slate-800/40" />

            {/* Search Button */}
            <Magnetic range={20} actionStrength={0.2}>
              <Link href="/turfs" className="w-full sm:w-auto" data-cursor-text="FIND">
                <Button className="w-full sm:w-auto h-10 sm:px-8 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl sm:rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-emerald-500/10">
                  <Search className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Find Arenas</span>
                </Button>
              </Link>
            </Magnetic>
          </div>

          {/* Quick-Select Location Chips (Luxury dynamic tags) */}
          <div 
            ref={locationChipsRef}
            className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-1.5 will-change-transform"
          >
            <span className="mr-1">Popular:</span>
            {POPULAR_LOCATIONS.map((loc) => (
              <span
                key={loc}
                onClick={(e) => selectLocationChip(loc, e)}
                className={`px-2.5 py-1 rounded-full border text-[9px] font-black cursor-pointer transition-all duration-300 select-none ${
                  searchLocation === loc 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-sm scale-105' 
                    : 'bg-[#0b101c]/20 border-slate-900 hover:border-slate-800 hover:text-slate-350'
                }`}
                data-cursor-text={loc.toUpperCase()}
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* --- RESTORED SOCIAL TRUST BADGES WITH INTERACTIVE GSAP MICRO-PHYSICS --- */}
        <div 
          ref={trustBadgeContainerRef}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-5 text-slate-550 font-bold text-[9px] uppercase tracking-widest border-t border-slate-900/50 w-full max-w-2xl will-change-transform"
        >
          {/* Badge 1: 10K+ Players */}
          <Magnetic range={15} actionStrength={0.15}>
            <div 
              className="flex items-center gap-2 hover:text-slate-200 transition-all duration-300 cursor-pointer group" 
              data-cursor-text="10K+"
              onMouseEnter={() => playIconAnimation(usersIconRef, 'spin')}
              onMouseLeave={() => resetIconAnimation(usersIconRef)}
            >
              <div 
                ref={usersIconRef}
                className="p-1.5 bg-[#050811] rounded-full border border-slate-900 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center"
              >
                <Users className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span>10K+ Active Players</span>
            </div>
          </Magnetic>

          {/* Badge 2: 50+ Top Arenas */}
          <Magnetic range={15} actionStrength={0.15}>
            <div 
              className="flex items-center gap-2 hover:text-slate-200 transition-all duration-300 cursor-pointer group" 
              data-cursor-text="ARENAS"
              onMouseEnter={() => playIconAnimation(trophyIconRef, 'bounce')}
              onMouseLeave={() => resetIconAnimation(trophyIconRef)}
            >
              <div 
                ref={trophyIconRef}
                className="p-1.5 bg-[#050811] rounded-full border border-slate-900 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center"
              >
                <Trophy className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span>50+ Top Arenas In Dhaka</span>
            </div>
          </Magnetic>

          {/* Badge 3: Instant Secure Lock */}
          <Magnetic range={15} actionStrength={0.15}>
            <div 
              className="flex items-center gap-2 hover:text-slate-200 transition-all duration-300 cursor-pointer group" 
              data-cursor-text="SECURE"
              onMouseEnter={() => playIconAnimation(shieldIconRef, 'pulse')}
              onMouseLeave={() => resetIconAnimation(shieldIconRef)}
            >
              <div 
                ref={shieldIconRef}
                className="p-1.5 bg-[#050811] rounded-full border border-slate-900 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span>Instant Secure Lock</span>
            </div>
          </Magnetic>
        </div>

      </div>
    </main>
  );
}
