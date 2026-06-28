'use client';

import { useSpotlight } from '@/hooks/useSpotlight';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';
import { Mail, Trophy, Sparkles, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgettingPassword, isForgotPasswordSuccess } = useAuth();
  const [email, setEmail] = useState('');

  // Refs for GSAP animations
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const brandLogoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomLinkRef = useRef<HTMLParagraphElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Forgot Password | TurfBook';

    // GSAP Initial State
    gsap.set(cardRef.current, { opacity: 0, scale: 0.95, y: 30 });
    gsap.set(brandLogoRef.current, { opacity: 0, scale: 0.8, rotate: -15 });
    gsap.set([headingRef.current, formRef.current, bottomLinkRef.current], { opacity: 0, y: 15 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.to(cardRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.1)' });
    tl.to(
      brandLogoRef.current,
      { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)' },
      '-=0.8'
    );
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6');
    tl.to(formRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
    tl.to(bottomLinkRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');

    gsap.to(orbitRef.current, {
      y: '+=20',
      x: '-=10',
      scale: 1.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    forgotPassword(email);
  };

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#050811] overflow-hidden font-jakarta text-white"
      style={
        {
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* 🌌 High-Performance Grid & Spotlight */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.22] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(500px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)',
        }}
      />

      {/* Glowing Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none will-change-transform"
      />

      {/* PREMIUM GLASSMORPHISM CARD */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[440px] bg-[#0d1425]/50 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-slate-800/80 shadow-[0_30px_70px_rgba(0,0,0,0.65)] overflow-hidden z-10 will-change-transform"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            ref={brandLogoRef}
            className="flex items-center gap-2.5 mb-3.5 will-change-transform"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-[#1e6b3e] p-2 rounded-xl border border-emerald-400/20 shadow-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Turf
              <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                Book
              </span>
            </span>
          </div>

          <div ref={headingRef} className="will-change-transform">
            <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
              Forgot Password?
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1.5 flex items-center justify-center gap-1">
              <span>পাসওয়ার্ড রিসেট লিংক পেতে আপনার ইমেইলটি দিন।</span>
              <Sparkles className="h-3 w-3 text-emerald-400" />
            </p>
          </div>
        </div>

        {isForgotPasswordSuccess ? (
          <div className="text-center py-4 flex flex-col items-center w-full">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative h-16 w-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-emerald-400">
                <Send className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white mb-2">Check Your Email</h2>
            <p className="text-slate-400 text-sm font-semibold mb-8 max-w-xs leading-relaxed">
              If that email exists in our system, we&apos;ve sent you instructions to reset your
              password.
            </p>
            <div className="w-full">
              <Magnetic range={20} actionStrength={0.2}>
                <Link href="/login" passHref className="w-full block">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-slate-950/40 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
            {/* Email input field */}
            <div className="relative group will-change-transform">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 will-change-transform">
              <Magnetic range={25} actionStrength={0.25}>
                <Button
                  loading={isForgettingPassword}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 border border-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  Send Reset Link
                </Button>
              </Magnetic>
            </div>
          </form>
        )}

        {/* Footer link to sign in */}
        {!isForgotPasswordSuccess && (
          <p
            ref={bottomLinkRef}
            className="text-center text-xs text-slate-400 font-semibold mt-6 will-change-transform flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
            Remembered password?{' '}
            <Link
              href="/login"
              className="text-emerald-400 font-black hover:text-emerald-355 transition-colors duration-300 ml-1"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
