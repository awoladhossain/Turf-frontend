'use client';

import { useSpotlight } from '@/hooks/useSpotlight';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';
import { ShieldCheck, AlertCircle, Loader2, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmailAsync } = useAuth();

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const verificationStarted = useRef(false);

  // Refs for GSAP animations
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const brandLogoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Verify Email | TurfBook';

    // GSAP Initial State
    gsap.set(cardRef.current, { opacity: 0, scale: 0.95, y: 30 });
    gsap.set(brandLogoRef.current, { opacity: 0, scale: 0.8, rotate: -15 });
    gsap.set(contentRef.current, { opacity: 0, y: 15 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.to(cardRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.1)' });
    tl.to(
      brandLogoRef.current,
      { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)' },
      '-=0.8'
    );
    tl.to(contentRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');

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

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided. Please check the link in your email.');
      return;
    }

    if (verificationStarted.current) return;
    verificationStarted.current = true;

    setStatus('loading');
    /* eslint-enable react-hooks/set-state-in-effect */

    // Call the verify-email API
    verifyEmailAsync(token)
      .then(() => {
        setStatus('success');
      })
      .catch((err: unknown) => {
        setStatus('error');
        let msg = 'Invalid or expired verification link.';
        if (err && typeof err === 'object' && 'response' in err) {
          const response = (err as { response?: { data?: { message?: string } } }).response;
          if (response?.data?.message) {
            msg = response.data.message;
          }
        }
        setErrorMessage(msg);
      });
  }, [token, verifyEmailAsync]);

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
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] blur-[130px] rounded-full pointer-events-none will-change-transform transition-colors duration-1000 ${
          status === 'success'
            ? 'bg-emerald-500/10'
            : status === 'error'
              ? 'bg-rose-500/10'
              : 'bg-blue-500/10'
        }`}
      />

      {/* PREMIUM CARD */}
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
        </div>

        {/* Dynamic Content based on Verification Status */}
        <div
          ref={contentRef}
          className="text-center will-change-transform flex flex-col items-center w-full"
        >
          {status === 'loading' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="relative h-16 w-16 text-emerald-400 animate-spin" />
              </div>
              <h2 className="text-xl font-black tracking-tight mb-2">Verifying Email...</h2>
              <p className="text-slate-400 text-sm font-semibold max-w-xs">
                মিনিটখানেক অপেক্ষা করুন, আপনার ইমেইলটি ভেরিফাই করা হচ্ছে।
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl" />
                <ShieldCheck className="relative h-16 w-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mb-2 flex items-center justify-center gap-1.5">
                <span>Verified Successfully!</span>
                <Sparkles className="h-4 w-4 text-emerald-450" />
              </h2>
              <p className="text-slate-400 text-sm font-semibold mb-8 max-w-xs leading-relaxed">
                আপনার ইমেইল ভেরিফিকেশন সফল হয়েছে। এখন আপনি যেকোনো সময় স্লট বুকিং করতে পারবেন।
              </p>
              <div className="w-full">
                <Magnetic range={20} actionStrength={0.25}>
                  <Link href="/login" passHref className="w-full block">
                    <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 border border-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer">
                      Sign In Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
                <AlertCircle className="relative h-16 w-16 text-rose-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
              </div>
              <h2 className="text-xl font-black tracking-tight mb-2 text-rose-500">
                Verification Failed
              </h2>
              <p className="text-slate-400 text-sm font-semibold mb-8 max-w-xs leading-relaxed">
                {errorMessage || 'ভেরিফিকেশন লিঙ্কটি সঠিক নয় অথবা এর মেয়াদ শেষ হয়ে গেছে।'}
              </p>
              <div className="w-full">
                <Magnetic range={20} actionStrength={0.2}>
                  <Link href="/login" passHref className="w-full block">
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-slate-950/40 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050811] text-white">
          <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
