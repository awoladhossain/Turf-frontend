'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Calendar, Clock, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import Magnetic from '@/components/ui/Magnetic';

// Premium Unified Coupon Data (Refactored to match modern minimal aesthetics)
const PREMIUM_OFFERS = [
  {
    id: 1,
    title: 'Midnight Madness',
    description: 'রাত ১০টার পরের যেকোনো স্লট বুকিংয়ে ফ্ল্যাট ৩০% ডিসকাউন্ট! বন্ধুদের নিয়ে চলে আসুন লেট-নাইট ম্যাচের রোমাঞ্চ নিতে।',
    discount: '30% OFF',
    code: 'MIDNIGHT30',
    validUntil: 'May 31, 2026',
    tag: '⚡ Best Value'
  },
  {
    id: 2,
    title: 'Weekend Kickoff',
    description: 'শুক্রবার এবং শনিবারের যেকোনো ফুটবল বা ক্রিকেট স্লট বুকিংয়ে পেয়ে যান ৫০০ টাকা সোজা ক্যাশব্যাক।',
    discount: '৳500 FLAT',
    code: 'WEEKEND500',
    validUntil: 'June 05, 2026',
    tag: '🔥 Popular'
  },
  {
    id: 3,
    title: 'First Match Special',
    description: 'টার্ফবুক অ্যাপে আপনার প্রথম বুকিং? প্রমো কোডটি ব্যবহার করুন এবং প্রথম ম্যাচের ভাড়ায় লুফে নিন ১৫% ছাড়।',
    discount: '15% OFF',
    code: 'PLAYFREE15',
    validUntil: 'Dec 31, 2026',
    tag: '🎉 New Player'
  }
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Refs for animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const offersGridRef = useRef<HTMLDivElement>(null);
  const footerNoticeRef = useRef<HTMLDivElement>(null);
  
  // Background glowing orbit
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- 1. Set initial states ---
    gsap.set([badgeRef.current, subtitleRef.current, footerNoticeRef.current], { opacity: 0, y: 20 });
    gsap.set(".char-anim", { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
    
    const offerCards = offersGridRef.current?.children;
    if (offerCards) {
      gsap.set(Array.from(offerCards), { opacity: 0, y: 30 });
    }

    // --- 2. Build entrance timeline ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
    
    // Character split titles
    tl.to(".char-anim", {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.012,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.4');

    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

    // Stagger voucher cards
    if (offerCards) {
      tl.to(Array.from(offerCards), {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.3');
    }

    tl.to(footerNoticeRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

    // Float background glows
    gsap.to(orbitRef.current, {
      y: '+=15',
      x: '-=15',
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

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
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
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
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-5 max-w-2xl mx-auto flex flex-col items-center">
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div 
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="DEALS"
              >
                <Ticket className="h-3 w-3" />
                <span>Exclusive Vouchers</span>
              </div>
            </Magnetic>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform">
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
            className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed font-semibold will-change-transform"
          >
            আপনার পছন্দের মাঠের ম্যাচ বুকিং খরচ কমিয়ে আনুন। প্রমো কোড কপি করুন এবং স্লট বুক করার সময়
            ব্যবহার করুন! <span className="text-white font-bold">নো টেনশন, জাস্ট প্লে!</span>
          </p>
        </div>

        {/* --- PREMIUM DIGITAL VOUCHER DECK --- */}
        <div 
          ref={offersGridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {PREMIUM_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="relative bg-[#0d1425]/20 backdrop-blur-2xl rounded-2xl border border-slate-900/80 p-5 flex flex-col justify-between space-y-5 hover:border-emerald-500/15 hover:bg-[#0d1425]/30 transition-all duration-300 shadow-sm will-change-transform"
            >
              <div className="space-y-3.5">
                {/* Top tags row */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-[#050811] px-2.5 py-1 rounded-md border border-slate-850 text-slate-500">
                    {offer.tag}
                  </span>
                  
                  <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.15)] flex items-center gap-1">
                    <span>{offer.discount}</span>
                    <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Offer descriptions */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight">
                    {offer.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </div>

              {/* Promo code actions */}
              <div className="space-y-3.5 pt-3 border-t border-slate-900/60">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-650" />
                    LIMITED OFFER
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-650" />
                    EXPIRES: {offer.validUntil}
                  </span>
                </div>

                {/* Coupon copy container */}
                <div className="flex items-center gap-2 bg-[#050811] border border-slate-900 p-1.5 rounded-xl">
                  <div className="flex-1 font-mono text-center text-xs sm:text-sm font-bold tracking-widest text-emerald-400 bg-emerald-500/5 py-1.5 rounded-lg border border-emerald-500/10">
                    {offer.code}
                  </div>
                  
                  <Magnetic range={15} actionStrength={0.2}>
                    <button
                      onClick={(e) => handleCopyCode(offer.code, e)}
                      className="h-8 px-4 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-350 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-slate-850"
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

        {/* Notice button footer */}
        <div 
          ref={footerNoticeRef}
          className="bg-[#0d1425]/10 border border-dashed border-slate-850/60 rounded-xl p-4.5 text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider will-change-transform"
        >
          💡 নতুন প্রোমো কোড বা ক্লাব মেম্বারশিপ অফারগুলো সবার আগে পেতে আমাদের সাথেই থাকুন।
        </div>

      </div>
    </div>
  );
}
