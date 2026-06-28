'use client';

import { useSpotlight } from '@/hooks/useSpotlight';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';
import { Eye, EyeOff, Lock, Trophy, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isResettingPassword, isResetPasswordSuccess } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for GSAP animations
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const brandLogoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Reset Password | TurfBook';

    // GSAP Initial State
    gsap.set(cardRef.current, { opacity: 0, scale: 0.95, y: 30 });
    gsap.set(brandLogoRef.current, { opacity: 0, scale: 0.8, rotate: -15 });
    gsap.set([headingRef.current, formRef.current], { opacity: 0, y: 15 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.to(cardRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.1)' });
    tl.to(
      brandLogoRef.current,
      { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)' },
      '-=0.8'
    );
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6');
    tl.to(formRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

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

    if (!token) {
      return toast.error('Reset token is missing from URL!');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long!');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }

    resetPassword({ token, password });
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

          <div ref={headingRef} className="will-change-transform">
            <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
              Reset Password
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1.5 flex items-center justify-center gap-1">
              <span>আপনার নতুন পাসওয়ার্ড সেট করুন।</span>
              <Sparkles className="h-3 w-3 text-emerald-400" />
            </p>
          </div>
        </div>

        {!token ? (
          <div className="text-center py-4 flex flex-col items-center w-full">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-rose-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white mb-2">
              Invalid Token Link
            </h2>
            <p className="text-slate-400 text-sm font-semibold mb-8 max-w-xs leading-relaxed">
              The reset token is missing. Please make sure you clicked the full link sent in the
              email.
            </p>
            <div className="w-full">
              <Magnetic range={20} actionStrength={0.2}>
                <Link href="/forgot-password" passHref className="w-full block">
                  <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-emerald-500/20 cursor-pointer">
                    Request New Link
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        ) : isResetPasswordSuccess ? (
          <div className="text-center py-4 w-full">
            <h2 className="text-lg font-black tracking-tight text-emerald-400 mb-2">
              Password Resetting...
            </h2>
            <p className="text-slate-400 text-xs font-bold">Redirecting you to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
            {/* New Password input field */}
            <div className="relative group will-change-transform">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password (min 6 chars)"
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password input field */}
            <div className="relative group will-change-transform">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2 will-change-transform">
              <Magnetic range={25} actionStrength={0.25}>
                <Button
                  loading={isResettingPassword}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 border border-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  Reset Password
                </Button>
              </Magnetic>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050811] text-white">
          <svg className="animate-spin h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
