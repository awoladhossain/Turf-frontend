'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Calendar, Filter, MapPin, Search, Star, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/ui/Magnetic';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DUMMY_TURFS = [
  {
    id: 1,
    name: 'المدينة - Al Madina Sports Arena',
    location: 'Bashundhara R/A, Dhaka',
    sport: 'Football',
    size: '7-a-side',
    rating: 4.9,
    reviews: 124,
    pricePerHour: 3500,
    image: 'https://images.unsplash.com/photo-1510563800743-aed2364902b8?auto=format&fit=crop&q=80&w=600',
    availableToday: true,
  },
  {
    id: 2,
    name: 'Dhaka Arena International',
    location: 'Mirpur 11, Dhaka',
    sport: 'Football',
    size: '5-a-side',
    rating: 4.7,
    reviews: 89,
    pricePerHour: 2800,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=600',
    availableToday: true,
  },
  {
    id: 3,
    name: 'The Pavilion Turf & Lounge',
    location: 'Banani, Dhaka',
    sport: 'Cricket',
    size: 'Net Practice',
    rating: 4.8,
    reviews: 56,
    pricePerHour: 2200,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600',
    availableToday: false,
  },
];

export default function TurfsPage() {
  const [selectedSport, setSelectedSport] = useState('All');
  const [priceRange, setPriceRange] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Animation Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const headerBadgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const sortingRef = useRef<HTMLDivElement>(null);
  const filterSidebarRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  
  // Background glow orbit
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- 1. Reset initial states ---
    gsap.set([headerBadgeRef.current, subtitleRef.current, searchInputRef.current, sortingRef.current, filterSidebarRef.current], { opacity: 0, y: 20 });
    gsap.set(".char-anim", { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
    
    // Stagger cards on load
    const cards = cardsGridRef.current?.querySelectorAll('.arena-card');
    if (cards) {
      gsap.set(Array.from(cards), { opacity: 0, y: 30 });
    }

    // --- 2. Build entrance timeline ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    tl.to(headerBadgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
    
    // Character split headers
    tl.to(".char-anim", {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.012,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.4');

    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
    tl.to(searchInputRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    tl.to(sortingRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    tl.to(filterSidebarRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');

    // Stagger cards in
    if (cards && cards.length > 0) {
      tl.to(Array.from(cards), {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.4');
    }

    // Glow Orbit float
    gsap.to(orbitRef.current, {
      y: '+=15',
      x: '-=15',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

  }, []);

  // Filter logic memoized
  const processedTurfs = useMemo(() => {
    let result = DUMMY_TURFS.filter((turf) => {
      const matchesSport =
        selectedSport === 'All' || turf.sport.toLowerCase() === selectedSport.toLowerCase();
      const matchesPrice = turf.pricePerHour <= priceRange;
      const matchesSearch =
        turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSport && matchesPrice && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedSport, priceRange, searchQuery, sortBy]);

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

  // 3D character text splitter
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
      className="min-h-screen w-full bg-[#050811] font-jakarta py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white select-none"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      {/* 🌌 High-Performance Grid & Spotlight (Matches page.tsx theme) */}
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
        className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* --- HEADER & SEARCH CONTROLS SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 border-b border-slate-900">
          <div className="space-y-4">
            <div ref={headerBadgeRef} className="will-change-transform w-fit">
              <Magnetic range={15} actionStrength={0.15}>
                <div 
                  className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md cursor-pointer hover:bg-emerald-500/15 transition-all duration-300 animate-pulse"
                  data-cursor-text="LIVE HUB"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Live Slot Hub</span>
                </div>
              </Magnetic>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform">
              <div>{render3DLetters("Explore ")}</div>
              <div className="mt-1">
                <span 
                  className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                  data-cursor-text="ARENAS"
                >
                  {render3DLetters("Verified Arenas", "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400")}
                </span>
              </div>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-slate-400 text-xs sm:text-sm font-semibold max-w-xl leading-relaxed will-change-transform"
            >
              ঢাকা শহরের বেস্ট কন্ডিশন পিচগুলো ভেরিফাইড রিভিউ দেখে বুক করুন। <span className="text-white">নো টেনশন, জাস্ট প্লে!</span>
            </p>
          </div>

          {/* Search box input */}
          <div 
            ref={searchInputRef}
            className="relative w-full md:w-72 group will-change-transform"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="মাঠ বা লোকেশনের নাম লিখুন..."
              className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-900 bg-[#0d1425]/20 backdrop-blur-md focus:border-emerald-500/25 outline-none transition-all text-xs font-semibold text-white placeholder-slate-550 shadow-inner"
            />
          </div>
        </div>

        {/* --- MINIMAL SORTING CONTAINER --- */}
        <div 
          ref={sortingRef}
          className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1425]/20 backdrop-blur-2xl p-4 rounded-2xl border border-slate-900/80 shadow-sm will-change-transform"
        >
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-wider">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-650" />
            <span>Sort By</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'popular', label: '⭐ Top Rated' },
              { id: 'price-asc', label: '৳ Price: Low to High' },
              { id: 'price-desc', label: '৳ Price: High to Low' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-3.5 h-8 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  sortBy === option.id
                    ? 'bg-gradient-to-r from-emerald-600 to-[#1e6b3e] border-emerald-500/20 text-white shadow-sm'
                    : 'bg-[#050811] border-slate-900 text-slate-500 hover:text-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- MAIN PAGE LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* --- ULTRA-SLEEK GLASS SIDEBAR FILTERS --- */}
          <div 
            ref={filterSidebarRef}
            className="lg:col-span-1 bg-[#0d1425]/20 backdrop-blur-2xl p-5 rounded-2xl border border-slate-900/80 shadow-sm space-y-6 lg:sticky lg:top-24 will-change-transform"
          >
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3.5">
              <Filter className="h-3.5 w-3.5 text-emerald-400" />
              <h2 className="font-black text-white text-xs uppercase tracking-wider">Filter Settings</h2>
            </div>

            {/* Sports Selector */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                Discipline
              </label>
              
              <div className="grid grid-cols-1 gap-1.5">
                {['All', 'Football', 'Cricket'].map((sport) => {
                  const isSelected = selectedSport === sport;
                  return (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`h-9 px-3.5 rounded-lg text-left text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'text-slate-400 bg-slate-950/20 border-slate-900 hover:bg-slate-900/40 hover:text-white'
                      }`}
                    >
                      <span>{sport} Arenas</span>
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Budget Selector */}
            <div className="space-y-3.5 pt-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Max Budget / Hr
                </label>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  ৳{priceRange}
                </span>
              </div>
              
              <input
                type="range"
                min="1500"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-850 rounded-lg cursor-pointer transition-all"
              />
              
              <div className="flex justify-between text-[8px] text-slate-550 font-bold tracking-wider">
                <span>৳1,500</span>
                <span>৳5,000</span>
              </div>
            </div>
          </div>

          {/* --- ARENAS LIST GRID --- */}
          <div className="lg:col-span-3">
            <div 
              ref={cardsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {processedTurfs.length > 0 ? (
                processedTurfs.map((turf) => (
                  <div
                    key={turf.id}
                    className="arena-card relative bg-[#0d1425]/20 backdrop-blur-2xl rounded-2xl border border-slate-900/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/15 transition-all duration-300 shadow-sm group will-change-transform"
                  >
                    {/* Arena Image Frame */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950 isolation-isolate">
                      <img
                        src={turf.image}
                        alt={turf.name}
                        className="h-full w-full object-cover will-change-transform transform-gpu group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent pointer-events-none" />

                      {/* Live availability label */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1 bg-[#050811] backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-850 shadow-sm text-[8px] font-black uppercase tracking-widest select-none">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${turf.availableToday ? 'bg-emerald-400 animate-pulse' : 'bg-slate-650'}`}
                        />
                        <span className={turf.availableToday ? 'text-emerald-400' : 'text-slate-500'}>
                          {turf.availableToday ? 'Available Today' : 'Full'}
                        </span>
                      </div>

                      {/* Star Rating Badge */}
                      <div className="absolute top-3.5 right-3.5 bg-[#050811] backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-white shadow-sm border border-slate-850 select-none">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{turf.rating}</span>
                      </div>
                    </div>

                    {/* Card Description Elements */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <Trophy className="h-2.5 w-2.5" />
                            {turf.sport}
                          </span>
                          
                          <span className="text-[8px] font-black text-slate-500 bg-[#050811] px-2 py-0.5 rounded-md border border-slate-850">
                            {turf.size}
                          </span>
                        </div>

                        <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1">
                          {turf.name}
                        </h3>

                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-650" />
                          <span className="line-clamp-1">{turf.location}</span>
                        </div>
                      </div>

                      <div className="h-[1px] bg-slate-900/60 w-full" />

                      {/* Pricing row & book CTAs */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-black text-slate-550 uppercase tracking-widest">
                            Hourly Rate
                          </p>
                          <p className="text-lg font-black text-white tracking-tight">
                            ৳{turf.pricePerHour}
                            <span className="text-[10px] text-slate-550 font-normal"> /hr</span>
                          </p>
                        </div>

                        <Magnetic range={15} actionStrength={0.2}>
                          <Link href={`/turfs/${turf.id}`}>
                            <Button className="h-9 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-[10px] uppercase tracking-wider px-4 rounded-lg shadow-sm active:scale-95 border border-emerald-500/10 transition-all duration-300 cursor-pointer flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Book Slot</span>
                            </Button>
                          </Link>
                        </Magnetic>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-[#0d1425]/10 border border-dashed border-slate-850/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
                  <div className="p-3.5 bg-[#050811] text-slate-600 rounded-full border border-slate-850">
                    <Search className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">No arenas found</h3>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                      আপনার ফিল্টার বা বাজেট কিছুটা বাড়িয়ে অন্য কোনো ক্যাটাগরিতে সার্চ করে দেখুন।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
