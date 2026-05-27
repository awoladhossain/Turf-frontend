'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Sparkles,
  Percent,
  Calculator,
  ShieldCheck,
  Flame,
  Gift,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Info,
  Share2,
  Tag,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/ui/Magnetic';
import { motion, AnimatePresence } from 'framer-motion';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Offer Type Definitions
interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  discountValue: number; // numeric percentage or flat value
  discountType: 'percentage' | 'flat';
  code: string;
  validUntil: string;
  tag: string;
  bgGradient: string;
}

// Premium Unified Coupon Data
const PREMIUM_OFFERS: Offer[] = [
  {
    id: 1,
    title: 'Midnight Madness',
    description: 'রাত ১০টার পরের যেকোনো স্লট বুকিংয়ে ফ্ল্যাট ৩০% ডিসকাউন্ট! বন্ধুদের নিয়ে চলে আসুন লেট-নাইট ম্যাচের রোমাঞ্চ নিতে।',
    discount: '30% OFF',
    discountValue: 0.30,
    discountType: 'percentage',
    code: 'MIDNIGHT30',
    validUntil: 'June 30, 2026',
    tag: '⚡ Best Value',
    bgGradient: 'from-purple-500/10 via-slate-900/10 to-emerald-500/5'
  },
  {
    id: 2,
    title: 'Weekend Kickoff',
    description: 'শুক্রবার এবং শনিবারের যেকোনো ফুটবল বা ক্রিকেট স্লট বুকিংয়ে পেয়ে যান ৫০০ টাকা সোজা ক্যাশব্যাক।',
    discount: '৳500 FLAT',
    discountValue: 500,
    discountType: 'flat',
    code: 'WEEKEND500',
    validUntil: 'July 15, 2026',
    tag: '🔥 Popular',
    bgGradient: 'from-emerald-500/10 via-slate-900/10 to-teal-500/5'
  },
  {
    id: 3,
    title: 'First Match Special',
    description: 'টার্ফবুক অ্যাপে আপনার প্রথম বুকিং? প্রমো কোডটি ব্যবহার করুন এবং প্রথম ম্যাচের ভাড়ায় লুফে নিন ১৫% ছাড়।',
    discount: '15% OFF',
    discountValue: 0.15,
    discountType: 'percentage',
    code: 'PLAYFREE15',
    validUntil: 'Dec 31, 2026',
    tag: '🎉 New Player',
    bgGradient: 'from-blue-500/10 via-slate-900/10 to-emerald-500/5'
  }
];

// Mock Real-Time Claimed Feed Ticker Data
const MOCK_CLAIMED_DEALS = [
  { player: "Sadman S.", location: "Dhanmondi", deal: "MIDNIGHT30", time: "Just now" },
  { player: "Mahmudul H.", location: "Banani", deal: "WEEKEND500", time: "3 mins ago" },
  { player: "Rafsan J.", location: "Mirpur", deal: "PLAYFREE15", time: "12 mins ago" },
  { player: "Tahmid C.", location: "Gulshan", deal: "MIDNIGHT30", time: "25 mins ago" }
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PERCENTAGE' | 'FLAT'>('ALL');
  
  // Interactive Calculator State
  const [calcArena, setCalcArena] = useState<'gulshan' | 'dhanmondi' | 'mirpur'>('gulshan');
  const [calcHours, setCalcHours] = useState(1);
  const [calcCoupon, setCalcCoupon] = useState<string>('MIDNIGHT30');
  
  // Gamified Scratch Card State
  const [scratchState, setScratchState] = useState<'UNSCRATCHED' | 'SCRATCHING' | 'REVEALED'>('UNSCRATCHED');

  // Animation Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const offersGridRef = useRef<HTMLDivElement>(null);
  const infoNoticeRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // --- Real-time Claim Ticker Cycle ---
  const [tickerIndex, setTickerIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % MOCK_CLAIMED_DEALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // --- GSAP Entrances and Scroll Animations ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Cleans
      const elementsToClean = [];
      if (badgeRef.current) elementsToClean.push(badgeRef.current);
      if (subtitleRef.current) elementsToClean.push(subtitleRef.current);
      if (infoNoticeRef.current) elementsToClean.push(infoNoticeRef.current);

      if (elementsToClean.length > 0) {
        gsap.set(elementsToClean, { opacity: 0, y: 20 });
      }
      
      const charAnims = pageContainerRef.current?.querySelectorAll(".char-anim");
      if (charAnims && charAnims.length > 0) {
        gsap.set(charAnims, { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
      }
      
      const offerCards = offersGridRef.current?.children;
      if (offerCards) {
        gsap.set(Array.from(offerCards), { opacity: 0, y: 30 });
      }

      // 2. Main Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      if (badgeRef.current) {
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
      }
      
      if (charAnims && charAnims.length > 0) {
        tl.to(charAnims, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.012,
          duration: 0.8,
          ease: 'power4.out'
        }, '-=0.4');
      }

      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }

      // Voucher Card cascade trigger
      if (offerCards && offerCards.length > 0) {
        tl.to(Array.from(offerCards), {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out'
        }, '-=0.3');
      }

      if (infoNoticeRef.current) {
        tl.to(infoNoticeRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
      }

      // Float background neon orbit
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          y: '+=15',
          x: '-=15',
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Scroll triggered reveal for sandbox/calculator sections
      const sandboxReveal = pageContainerRef.current?.querySelectorAll(".scroll-reveal");
      if (sandboxReveal && sandboxReveal.length > 0) {
        gsap.fromTo(sandboxReveal,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".interactive-sandbox-section",
              start: "top 80%",
            }
          }
        );
      }

    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // --- Mouse Spotlight Coordinate Tracker ---
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

  const handleCopyCode = (code: string, e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied!`);

    const target = e.currentTarget;
    gsap.fromTo(target, 
      { scale: 0.95 }, 
      { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.4)' }
    );

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  // Gamified Scratch Interaction
  const handleScratchReveal = () => {
    if (scratchState !== 'UNSCRATCHED') return;

    setScratchState('SCRATCHING');
    setTimeout(() => {
      setScratchState('REVEALED');
      toast.success("💥 40% OFF Secret Voucher Revealed!", {
        icon: '🔥',
        duration: 4000
      });
    }, 1500);
  };

  // Title 3D letters split helper
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

  // --- Pricing Calculation Values ---
  const arenaPrices = {
    gulshan: { name: "Chef's Table Courts", rate: 2500 },
    dhanmondi: { name: "Jaff Arena", rate: 2200 },
    mirpur: { name: "Mirpur Turf City", rate: 1800 }
  };

  const activePromo = PREMIUM_OFFERS.find(o => o.code === calcCoupon) || (calcCoupon === 'SECRET40' ? {
    code: 'SECRET40',
    discountValue: 0.40,
    discountType: 'percentage' as const
  } : null);

  const originalPrice = arenaPrices[calcArena].rate * calcHours;
  let discountAmount = 0;
  if (activePromo) {
    if (activePromo.discountType === 'percentage') {
      discountAmount = originalPrice * activePromo.discountValue;
    } else {
      discountAmount = activePromo.discountValue;
    }
  }
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  // Tab Filtering
  const filteredOffers = PREMIUM_OFFERS.filter(offer => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PERCENTAGE') return offer.discountType === 'percentage';
    if (activeTab === 'FLAT') return offer.discountType === 'flat';
    return true;
  });

  return (
    <div 
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      
      {/* 🌌 High-Performance Grid and Spotlight Mask */}
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
          background: 'radial-gradient(550px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)'
        }}
      />

      {/* Glowing Neon Background Orbits */}
      <div
        ref={orbitRef}
        className="absolute top-10 left-1/3 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[125px] rounded-full pointer-events-none will-change-transform"
      />
      <div
        className="absolute bottom-20 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-teal-500/5 blur-[140px] rounded-full pointer-events-none"
      />

      <div className="max-w-5xl mx-auto space-y-24 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <header className="text-center space-y-5 max-w-2xl mx-auto flex flex-col items-center">
          
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div 
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="DEALS"
              >
                <Ticket className="h-3 w-3 text-emerald-450" />
                <span>Hot Play Vouchers</span>
              </div>
            </Magnetic>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform animate-none">
            <div>{render3DLetters("Active ")}</div>
            <div className="mt-1">
              <span 
                className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                data-cursor-text="PROMOS"
              >
                {render3DLetters("Promos & Offers", "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400")}
              </span>
            </div>
          </h1>

          <p 
            ref={subtitleRef}
            className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed font-medium will-change-transform"
          >
            আপনার পছন্দের মাঠে খেলার খরচ কমিয়ে আনুন। প্রমো কোড কপি করুন এবং স্লট বুক করার সময় কুপন হিসেবে ব্যবহার করুন! 
            <span className="text-white font-bold"> নো টেনশন, জাস্ট প্লে!</span>
          </p>

          {/* Social Proof Claim Ticker Feed */}
          <div className="h-9 overflow-hidden bg-[#0d1425]/30 border border-slate-900 rounded-full px-5 py-1.5 flex items-center justify-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider backdrop-blur-md">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            <div className="transition-all duration-500 transform font-mono">
              ⚡ <span className="text-white">{MOCK_CLAIMED_DEALS[tickerIndex].player}</span> from {MOCK_CLAIMED_DEALS[tickerIndex].location} claimed <span className="text-emerald-400 font-black">{MOCK_CLAIMED_DEALS[tickerIndex].deal}</span> ({MOCK_CLAIMED_DEALS[tickerIndex].time})
            </div>
          </div>
        </header>

        {/* ================= TAB SYSTEM & TICKETS GRID ================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 border-b border-slate-900/60 pb-5">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-black text-white">Voucher Feed</h3>
              <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">ক্লিক করে আপনার প্রয়োজনীয় প্রমো কোডটি কপি করুন</p>
            </div>

            {/* Filter tab buttons */}
            <div className="flex gap-1.5 bg-[#0d1425]/30 border border-slate-900 p-1 rounded-xl">
              {(['ALL', 'PERCENTAGE', 'FLAT'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black'
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {tab === 'PERCENTAGE' ? '% Discount' : tab === 'FLAT' ? 'Flat Cashback' : 'All Deals'}
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Ticket Stub Cards Grid */}
          <div 
            ref={offersGridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="relative bg-gradient-to-b from-[#0d1425]/35 to-[#080d19]/25 backdrop-blur-2xl rounded-2xl border border-slate-900/80 p-5 flex flex-col justify-between space-y-6 hover:border-emerald-500/20 hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)] transition-all duration-300 shadow-sm will-change-transform overflow-hidden group"
              >
                {/* Visual Premium Ticket Cutout Notches */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050811] border border-slate-900 z-20 group-hover:border-emerald-500/20 transition-colors duration-300" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050811] border border-slate-900 z-20 group-hover:border-emerald-500/20 transition-colors duration-300" />

                <div className="space-y-4">
                  {/* Top Header Tag Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-[#050811] px-2.5 py-1 rounded-md border border-slate-850 text-slate-500">
                      {offer.tag}
                    </span>
                    
                    <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.15)] flex items-center gap-1">
                      <span>{offer.discount}</span>
                      <Sparkles className="h-3 w-3 text-emerald-400 fill-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-200">
                      {offer.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed min-h-[55px]">
                      {offer.description}
                    </p>
                  </div>
                </div>

                {/* Voucher code bottomstub */}
                <div className="space-y-4 pt-4 border-t border-dashed border-slate-900/80">
                  <div className="flex items-center justify-between text-[8px] font-black text-slate-500 tracking-wider">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-650" />
                      LIMITED DEAL
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-650" />
                      EXP: {offer.validUntil}
                    </span>
                  </div>

                  {/* Copy Coupon Box */}
                  <div className="flex items-center gap-2 bg-[#050811] border border-slate-900 p-1.5 rounded-xl">
                    <div className="flex-1 font-mono text-center text-xs font-bold tracking-widest text-emerald-400 bg-emerald-500/5 py-1.5 rounded-lg border border-emerald-500/10">
                      {offer.code}
                    </div>
                    
                    <Magnetic range={15} actionStrength={0.2}>
                      <button
                        onClick={(e) => handleCopyCode(offer.code, e)}
                        className="h-8 px-4 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-350 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-slate-850"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400 stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-slate-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            ref={infoNoticeRef}
            className="bg-[#0d1425]/10 border border-dashed border-slate-850/60 rounded-xl p-4.5 text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider will-change-transform"
          >
            💡 নতুন প্রোমো কোড বা ক্লাব মেম্বারশিপ অফারগুলো সবার আগে পেতে আমাদের সাথেই থাকুন।
          </div>
        </section>

        {/* ================= INTERACTIVE PLAYGROUND SANDBOX SECTION ================= */}
        <section className="interactive-sandbox-section grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Gamified Scratch Card (Highly Unique!) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-500 flex flex-col justify-between space-y-6 scroll-reveal relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                <Gift className="h-3 w-3 text-emerald-400" />
                <span>Gamified Loyalty</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">Daily Secret Scratch Card</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-relaxed">
                টার্ফবুকের পক্ষ থেকে আপনার জন্য একটি সারপ্রাইজ উপহার! নিচের কার্ডটি স্ক্র্যাচ করে আজকের সিক্রেট ডিসকাউন্ট কুপনটি আনলক করুন।
              </p>
            </div>

            {/* Interactive Scratch Canvas widget */}
            <div 
              onClick={handleScratchReveal}
              className={`h-[160px] rounded-2xl border relative overflow-hidden flex flex-col items-center justify-center text-center p-4 transition-all duration-500 ${
                scratchState === 'UNSCRATCHED'
                  ? 'bg-gradient-to-br from-[#1e6b3e]/30 via-[#0f3d23]/20 to-[#050811] border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer shadow-lg'
                  : scratchState === 'SCRATCHING'
                  ? 'bg-[#050811] border-emerald-500/10 cursor-wait'
                  : 'bg-emerald-500/5 border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
              }`}
            >
              
              <AnimatePresence mode="wait">
                {scratchState === 'UNSCRATCHED' && (
                  <motion.div 
                    key="unscratched"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-2.5"
                  >
                    <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-full w-fit mx-auto animate-bounce">
                      <Gift className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">Tap to Scratch & Reveal</p>
                      <p className="text-[9px] text-slate-500 font-semibold mt-0.5">সিক্রেট প্রোমো কোড আনলক করতে এখানে ক্লিক করুন</p>
                    </div>
                  </motion.div>
                )}

                {scratchState === 'SCRATCHING' && (
                  <motion.div 
                    key="scratching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">Scratching digital foil...</p>
                  </motion.div>
                )}

                {scratchState === 'REVEALED' && (
                  <motion.div 
                    key="revealed"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="space-y-4 w-full"
                  >
                    <div className="flex items-center justify-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mx-auto animate-pulse">
                      <Sparkles className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                      <span>Unlocked 40% VIP Discount</span>
                    </div>

                    <div className="font-mono text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.06)]">
                      SECRET40
                    </div>

                    {/* Copy Revealed button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText('SECRET40');
                        toast.success('VIP Promo Code copied!');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-widest transition-all cursor-pointer mx-auto block active:scale-95"
                    >
                      Copy Secret Code
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">
              * দিনে ১ বার স্ক্র্যাচ করার সুযোগ পাবেন। কুপনটি আজকের জন্য ভ্যালিড।
            </div>
          </div>

          {/* Right Block: Interactive Pitch Pricing Calculator (Great Engineering!) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-b from-[#111a2d]/20 to-[#080d1a]/20 border border-slate-900 shadow-xl flex flex-col justify-between space-y-6 scroll-reveal relative overflow-hidden">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                <Calculator className="h-3.5 w-3.5 text-emerald-400" />
                <span>Savings Calculator</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">Dynamic Court Cost Estimator</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-relaxed">
                আপনার পছন্দের এরেনা, খেলার সময় এবং একটি প্রোমো কোড সিলেক্ট করে দেখুন মোট কত টাকা সেভ করতে পারছেন।
              </p>
            </div>

            {/* Calculator controls */}
            <div className="space-y-4 bg-[#050811]/60 p-4.5 rounded-2xl border border-slate-850">
              
              {/* Select Arena */}
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Select Arena</label>
                <div className="relative">
                  <select 
                    value={calcArena}
                    onChange={(e) => setCalcArena(e.target.value as any)}
                    className="w-full h-9 px-3 bg-[#050811] border border-slate-900 outline-none text-xs font-semibold text-white rounded-xl focus:border-emerald-500/25 appearance-none cursor-pointer"
                  >
                    <option value="gulshan">Chef's Table Courts (৳২,৫০০/hr)</option>
                    <option value="dhanmondi">Jaff Arena (৳২,২০০/hr)</option>
                    <option value="mirpur">Mirpur Turf City (৳১,৮০০/hr)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Slider for Hours */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Match Duration</span>
                  <span className="text-white font-mono">{calcHours} Hour{calcHours > 1 ? 's' : ''}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="4" 
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer bg-slate-900 h-1 rounded-full appearance-none"
                />
              </div>

              {/* Select Active Promo Code */}
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Select Voucher Code</label>
                <div className="relative">
                  <select 
                    value={calcCoupon}
                    onChange={(e) => setCalcCoupon(e.target.value)}
                    className="w-full h-9 px-3 bg-[#050811] border border-slate-900 outline-none text-xs font-semibold text-white rounded-xl focus:border-emerald-500/25 appearance-none cursor-pointer"
                  >
                    <option value="MIDNIGHT30">MIDNIGHT30 (30% OFF)</option>
                    <option value="WEEKEND500">WEEKEND500 (৳500 Cashback)</option>
                    <option value="PLAYFREE15">PLAYFREE15 (15% OFF)</option>
                    {scratchState === 'REVEALED' && (
                      <option value="SECRET40">SECRET40 (40% VIP OFF)</option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Bill Receipt breakdown */}
            <div className="bg-[#050811] p-4 rounded-xl border border-slate-850 space-y-2.5 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Original Booking cost:</span>
                <span className="text-white">৳{originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400/95 font-bold">
                <span>Estimated savings:</span>
                <span>- ৳{discountAmount.toLocaleString()}</span>
              </div>
              
              <div className="h-[1px] bg-slate-900 w-full" />
              
              <div className="flex justify-between text-xs font-black text-white">
                <span>Grand Total:</span>
                <span className="text-emerald-400">৳{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Instant checkout redirection button */}
            <Magnetic range={15} actionStrength={0.2}>
              <Link href="/turfs" className="block w-full" data-cursor-text="BOOK">
                <button className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md active:scale-97 cursor-pointer border border-emerald-500/10 flex items-center justify-center gap-1.5">
                  <span>Confirm and Book with Discount</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </Magnetic>

          </div>

        </section>

      </div>
    </div>
  );
}
