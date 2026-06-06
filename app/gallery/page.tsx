'use client';
import { useSpotlight } from '@/hooks/useSpotlight';

import Magnetic from '@/components/ui/Magnetic';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Image as ImageIcon,
  MapPin,
  Share2,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Media Item Type
interface GalleryItem {
  id: number;
  title: string;
  category: 'CORPORATE' | 'LEAGUE' | 'CHAMPIONS' | 'SCENES';
  categoryLabel: string;
  image: string;
  date: string;
  venue: string;
  playersCount: string;
  description: string;
}

// Mock Gallery Data
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: 'Dhaka Corporate Futsal Cup 2026',
    category: 'CORPORATE',
    categoryLabel: 'Corporate Cups',
    image:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    date: 'May 15, 2026',
    venue: "Chef's Table Courts",
    playersCount: '32 Corporate Teams',
    description:
      'ঢাকার শীর্ষ ১৬টি টেক ও ফাইন্যান্স কোম্পানির অংশগ্রহণে অনুষ্ঠিত হয়ে গেল রোমাঞ্চকর কর্পোরেট টুর্নামেন্ট। ফাইনালে তুমুল প্রতিদ্বন্দ্বিতার পর ট্রফি ছিনিয়ে নেয় ড্যাফোডিল সলিউশন্স।',
  },
  {
    id: 2,
    title: 'Midnight Futsal Champion Celebration',
    category: 'CHAMPIONS',
    categoryLabel: 'Champions',
    image:
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
    date: 'May 22, 2026',
    venue: 'Jaff Arena',
    playersCount: 'Champions Moment',
    description:
      'লেট-নাইট মিডনাইট লিগের ট্রফি জয়ের পর চ্যাম্পিয়ন দলের আনন্দঘন মুহূর্ত। জ্যাফ অ্যারেনার গ্যালারি কাঁপানো করতালির মাধ্যমে টুর্নামেন্ট সম্পন্ন হয়।',
  },
  {
    id: 3,
    title: 'Banani Super League Match Action',
    category: 'LEAGUE',
    categoryLabel: 'Leagues',
    image:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800',
    date: 'May 10, 2026',
    venue: 'Banani FC Arena',
    playersCount: '7v7 League Match',
    description:
      'উত্তেজনাপূর্ণ গ্রুপ পর্বের ম্যাচে দুর্দান্ত গোলস্কোরিং ড্রিবল অ্যাকশন। ফিফা স্ট্যান্ডার্ড কৃত্রিম ঘাসের উপর খেলোয়াড়দের গতির ঝড় তোলার চিত্র।',
  },
  {
    id: 4,
    title: 'Mirpur Youth Derby Championship',
    category: 'LEAGUE',
    categoryLabel: 'Leagues',
    image:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800',
    date: 'April 28, 2026',
    venue: 'Mirpur Turf City',
    playersCount: '8 Local Clubs',
    description:
      'মিরপুর-১১ তে অনূর্ধ্ব-২১ ক্লাবের অংশগ্রহণে অনুষ্ঠিত ইয়ুথ ডার্বির চমৎকার ফুটবল মুহূর্ত। পুরো ঢাকা থেকে ১০০০-এর বেশি দর্শক মাঠে আসেন।',
  },
  {
    id: 5,
    title: 'Corporate Cricket Championship',
    category: 'CORPORATE',
    categoryLabel: 'Corporate Cups',
    image:
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
    date: 'May 02, 2026',
    venue: "Chef's Table Courts",
    playersCount: '24 Teams',
    description:
      'টার্ফ পিচে সংক্ষিপ্ত সংস্করণের কর্পোরেট ক্রিকেট টুর্নামেন্টের ধুন্ধুমার চার-ছক্কার আসর। দর্শকদের উত্তেজনা ও টিমগুলোর ট্রফি লড়াইয়ের দারুণ মুহূর্ত।',
  },
  {
    id: 6,
    title: 'Behind The Scenes: Night Turf Setup',
    category: 'SCENES',
    categoryLabel: 'Behind the Scenes',
    image:
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=800',
    date: 'Ongoing Events',
    venue: 'All Arenas',
    playersCount: 'Pitch Setup',
    description:
      'ম্যাচ শুরুর আগে ফ্লাডলাইটের সোনালী আলোয় ভেজা ঘাস এবং প্রস্তুত করা ফুটবল অ্যারেনা। প্লেয়ারদের সেরা অভিজ্ঞতা দিতে টার্ফবুকের অন-গ্রাউন্ড ক্রুদের আয়োজন।',
  },
];

// Mock Upcoming Events
const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Dhaka Futsal League Season 4',
    venue: 'Jaff Arena',
    date: 'June 12, 2026',
    teamsRegistered: 8,
    teamsTotal: 12,
    prizePool: '৳৫০,০০০ BDT',
    entryFee: '৳৫,০০০',
  },
  {
    id: 2,
    title: 'Corporate Cricket Cup 2026',
    venue: "Chef's Table Courts",
    date: 'June 25, 2026',
    teamsRegistered: 14,
    teamsTotal: 24,
    prizePool: '৳১,০০,০০০ BDT',
    entryFee: '৳৮,০০০',
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<
    'ALL' | 'CORPORATE' | 'LEAGUE' | 'CHAMPIONS' | 'SCENES'
  >('ALL');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Refs for entrance triggers
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Register GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial setups
      const elementsToClean = [];
      if (badgeRef.current) elementsToClean.push(badgeRef.current);
      if (subtitleRef.current) elementsToClean.push(subtitleRef.current);

      if (elementsToClean.length > 0) {
        gsap.set(elementsToClean, { opacity: 0, y: 20 });
      }

      const charAnims = pageContainerRef.current?.querySelectorAll('.char-anim');
      if (charAnims && charAnims.length > 0) {
        gsap.set(charAnims, { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
      }

      const gridCards = gridRef.current?.children;
      if (gridCards) {
        gsap.set(Array.from(gridCards), { opacity: 0, y: 30 });
      }

      // 2. Entrance Timelines
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      if (badgeRef.current) {
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
      }

      if (charAnims && charAnims.length > 0) {
        tl.to(
          charAnims,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.012,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.4',
        );
      }

      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }

      if (gridCards && gridCards.length > 0) {
        tl.to(
          Array.from(gridCards),
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.3',
        );
      }

      // Neon orbit animations
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          y: '+=20',
          x: '-=20',
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Scroll triggers for upcoming events section
      const eventCards = pageContainerRef.current?.querySelectorAll('.event-reveal');
      if (eventCards && eventCards.length > 0) {
        gsap.fromTo(
          eventCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.upcoming-events-section',
              start: 'top 80%',
            },
          },
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);
;

  // Category filter
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  // Lightbox carousel navigation
  const handlePrevItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedItemIndex === null) return;
    const prevIndex = (selectedItemIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItemIndex(prevIndex);
  };

  const handleNextItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedItemIndex === null) return;
    const nextIndex = (selectedItemIndex + 1) % filteredItems.length;
    setSelectedItemIndex(nextIndex);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItemIndex === null) return;
      if (e.key === 'Escape') setSelectedItemIndex(null);
      if (e.key === 'ArrowLeft') handlePrevItem();
      if (e.key === 'ArrowRight') handleNextItem();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIndex, filteredItems]);

  const activeItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  // Title split helper
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
      style={
        {
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* 🌌 High-Performance Grid & Spotlight */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.16] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(550px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)',
        }}
      />

      {/* Floating Neon Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-10 left-1/3 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />
      <div className="absolute bottom-20 right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-[#1e6b3e]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-24 relative z-10">
        {/* ================= HEADER SECTION ================= */}
        <header className="text-center space-y-5 max-w-2xl mx-auto flex flex-col items-center">
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="EVENT MAP"
              >
                <ImageIcon className="h-3 w-3 text-emerald-450" />
                <span>Gallery & Moments</span>
              </div>
            </Magnetic>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform">
            <div>{render3DLetters('Match Gallery & ')}</div>
            <div className="mt-1">
              <span
                className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                data-cursor-text="EVENTS"
              >
                {render3DLetters(
                  'Dhaka Sports Events',
                  'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400',
                )}
              </span>
            </div>
          </h1>

          <p
            ref={subtitleRef}
            className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed font-medium will-change-transform"
          >
            টার্ফবুকের ভেন্যুগুলোতে হওয়া জমজমাট কর্পোরেট কাপ, মিডনাইট টুর্নামেন্ট ও ফুটবল
            চ্যাম্পিয়নদের রোমাঞ্চকর মুহূর্তগুলো এক নজরে দেখুন।
            <span className="text-white font-bold"> নো টেনশন, জাস্ট প্লে!</span>
          </p>
        </header>

        {/* ================= DYNAMIC CATEGORIES GRID ================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 border-b border-slate-900/60 pb-5">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-black text-white">Event Highlights</h3>
              <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">
                ফিল্টার সিলেক্ট করে বিভিন্ন ক্যাটাগরির ছবি দেখুন
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 justify-center bg-[#0d1425]/30 border border-slate-900 p-1 rounded-xl">
              {(['ALL', 'CORPORATE', 'LEAGUE', 'CHAMPIONS', 'SCENES'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black'
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {cat === 'ALL'
                    ? 'All Moments'
                    : cat === 'CORPORATE'
                      ? 'Corporate'
                      : cat === 'LEAGUE'
                        ? 'Leagues'
                        : cat === 'CHAMPIONS'
                          ? 'Champions'
                          : 'Behind Scenes'}
                </button>
              ))}
            </div>
          </div>

          {/* Staggered Photo Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemIndex(index)}
                className="group cursor-pointer rounded-2xl border border-slate-900/80 bg-[#0d1425]/15 p-3 flex flex-col justify-between space-y-3.5 hover:border-emerald-500/20 transition-all duration-300 overflow-hidden"
              >
                {/* Visual Image container with dynamic hover spotlight */}
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 relative group-hover:shadow-[0_8px_25px_rgba(16,185,129,0.05)] transition-shadow">
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-300 z-10" />

                  {/* Category Label badge */}
                  <span className="absolute top-3 left-3 bg-[#050811]/85 backdrop-blur-md border border-slate-800 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded text-emerald-400 z-20">
                    {item.categoryLabel}
                  </span>

                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />

                  {/* Interactive Quick View overlay */}
                  <div className="absolute inset-0 bg-[#050811]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                    <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-xl hover:bg-emerald-500/20 transition-all active:scale-95">
                      Quick View Moment
                    </span>
                  </div>
                </div>

                {/* Details Footer inside card */}
                <div className="space-y-1 px-1">
                  <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-2 w-2 text-slate-600" />
                      {item.venue}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors duration-200 truncate">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= INTERACTIVE LIGHTBOX MODAL ================= */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemIndex(null)}
              className="fixed inset-0 z-50 bg-[#050811]/90 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0c1324]/90 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl relative flex flex-col md:flex-row gap-6 overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                {/* Semicircle premium glowing background inside modal */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

                {/* Top close button */}
                <button
                  onClick={() => setSelectedItemIndex(null)}
                  className="absolute right-4 top-4 p-2 bg-[#050811] border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer z-30"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Left Part: Premium Media View */}
                <div className="md:flex-1 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-850">
                  <Image src={activeItem.image} alt={activeItem.title} fill sizes="(max-width: 768px) 100vw, 80vw" className="w-full h-full object-cover" />

                  {/* Symmetrical Left/Right Slider Controls */}
                  <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                    <button
                      onClick={handlePrevItem}
                      className="p-2.5 bg-[#050811]/80 backdrop-blur-md border border-slate-800 hover:border-emerald-500/30 text-slate-400 hover:text-white rounded-xl pointer-events-auto transition-all active:scale-90"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNextItem}
                      className="p-2.5 bg-[#050811]/80 backdrop-blur-md border border-slate-800 hover:border-emerald-500/30 text-slate-400 hover:text-white rounded-xl pointer-events-auto transition-all active:scale-90"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Right Part: Meta & Event Details */}
                <div className="md:w-80 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded">
                        {activeItem.categoryLabel}
                      </span>
                      <h3 className="text-base font-black text-white tracking-tight leading-snug mt-1">
                        {activeItem.title}
                      </h3>
                    </div>

                    {/* Metadata boxes */}
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400">
                      <div className="p-2.5 bg-[#050811] rounded-xl border border-slate-850 space-y-1">
                        <span className="text-[7px] text-slate-500 uppercase tracking-widest block">
                          Venue Arena
                        </span>
                        <span className="text-white truncate block">📍 {activeItem.venue}</span>
                      </div>
                      <div className="p-2.5 bg-[#050811] rounded-xl border border-slate-850 space-y-1">
                        <span className="text-[7px] text-slate-500 uppercase tracking-widest block">
                          Match Date
                        </span>
                        <span className="text-white block">📅 {activeItem.date}</span>
                      </div>
                    </div>

                    <p className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-relaxed">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Actions stub inside modal */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-850/60">
                    <div className="flex items-center justify-between text-[8px] font-black text-slate-500 tracking-wider">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-emerald-400" />
                        {activeItem.playersCount}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Award className="h-3 w-3" />
                        Verified Event
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Event link copied to clipboard!');
                        }}
                        className="p-2.5 bg-[#050811] border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>

                      <Magnetic range={10} actionStrength={0.25}>
                        <Link
                          href="/turfs"
                          className="flex-1"
                          onClick={() => setSelectedItemIndex(null)}
                        >
                          <button className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer border border-emerald-500/10 flex items-center justify-center gap-1.5">
                            <span>Book Venue Now</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </Link>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= UPCOMING DHAKA TOURNAMENTS TIMELINE ================= */}
        <section className="upcoming-events-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto event-reveal">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Flame className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400 animate-bounce" />
              <span>Dhaka Tournaments Timeline</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Upcoming Leagues & Tournaments
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              টার্ফবুক পার্টনার অ্যারেনাতে আয়োজিত হতে যাওয়া ঢাকা অঞ্চলের জনপ্রিয় টুর্নামেন্টগুলোতে
              আপনার ফুটবল ক্লাব নিয়ে এখনই অনবোর্ড হন।
            </p>
          </div>

          {/* Timeline registration cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {UPCOMING_EVENTS.map((evt) => {
              const regPercentage = (evt.teamsRegistered / evt.teamsTotal) * 100;
              return (
                <div
                  key={evt.id}
                  className="event-reveal p-6 rounded-3xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                          Active Registration
                        </span>
                        <h4 className="text-sm font-black text-white truncate mt-1">{evt.title}</h4>
                      </div>
                      <Trophy className="h-5 w-5 text-emerald-400" />
                    </div>

                    {/* Metadata metadata */}
                    <div className="space-y-2 text-[10px] text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>📍 Venue:</span>
                        <span className="text-white font-bold">{evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>📅 Match Date:</span>
                        <span className="text-white font-bold">{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>🏆 Prize Pool:</span>
                        <span className="text-emerald-400 font-bold">{evt.prizePool}</span>
                      </div>
                    </div>

                    {/* Progress tracking indicator */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Teams Registered</span>
                        <span className="text-white font-mono">
                          {evt.teamsRegistered} / {evt.teamsTotal} Slots
                        </span>
                      </div>
                      <div className="h-2 bg-[#050811] rounded-full overflow-hidden border border-slate-850">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${regPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Register team cta */}
                  <Magnetic range={15} actionStrength={0.2}>
                    <button
                      onClick={() => {
                        toast.success(
                          'Registration request sent! Our tournament operations team will contact you shortly.',
                          {
                            duration: 4000,
                          },
                        );
                      }}
                      className="w-full py-3 bg-[#050811] border border-slate-850 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-350 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>Register Football Team ({evt.entryFee})</span>
                      <ArrowRight className="h-3 w-3 text-emerald-400" />
                    </button>
                  </Magnetic>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
