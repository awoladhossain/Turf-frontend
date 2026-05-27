'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { Lock, Mail, Trophy, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import Magnetic from '@/components/ui/Magnetic';

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Refs for GSAP animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const brandLogoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const formItemsRef = useRef<HTMLFormElement>(null);
  const bottomLinkRef = useRef<HTMLParagraphElement>(null);

  // Glowing background orbit ref
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- 1. Set initial opacity and y-states for GSAP staggered reveals ---
    gsap.set(cardRef.current, { opacity: 0, scale: 0.95, y: 30 });
    gsap.set(brandLogoRef.current, { opacity: 0, scale: 0.8, rotate: -15 });
    gsap.set([headingRef.current, googleBtnRef.current, dividerRef.current, bottomLinkRef.current], { 
      opacity: 0, 
      y: 15 
    });
    
    // Select form items (inputs, terms checkbox, register button)
    const formChildren = formItemsRef.current?.children;
    if (formChildren) {
      gsap.set(Array.from(formChildren), { opacity: 0, y: 15 });
    }

    // --- 2. Build luxury timeline entrance ---
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    tl.to(cardRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.1)' });
    
    // Brand logo spins into view
    tl.to(brandLogoRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.8');
    
    // Header reveal
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6');
    
    // Google Button reveal
    tl.to(googleBtnRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    
    // Divider
    tl.to(dividerRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');

    // Inputs stagger
    if (formChildren) {
      tl.to(Array.from(formChildren), {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.3');
    }

    // Signin footer link
    tl.to(bottomLinkRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');

    // Subtle breathing/floating glow animation
    gsap.to(orbitRef.current, {
      y: '-=20',
      x: '+=10',
      scale: 1.15,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });

  }, []);

  // --- 3. Spotlight coordinates tracker ---
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }

    setLoading(true);

    try {
      // 🛠️ Fixed TS Typing by providing phone, isVerified, and createdAt
      const dummyUser = {
        user: { 
          id: '2', 
          name: name, 
          email: email, 
          role: 'USER' as const,
          phone: '01712345678',
          isVerified: true,
          createdAt: new Date().toISOString()
        },
        accessToken: 'dummy-token-reg',
        refreshToken: 'dummy-refresh-reg',
      };

      dispatch(setCredentials(dummyUser));
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#050811] overflow-hidden font-jakarta text-white"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      {/* 🌌 High-Performance Grid & Spotlight (Matches page.tsx theme) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.22] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(500px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)'
        }}
      />

      {/* Glowing Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none will-change-transform"
      />

      {/* --- PREMIUM GLASSMORPHISM CARD --- */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[460px] bg-[#0d1425]/50 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-slate-800/80 shadow-[0_30px_70px_rgba(0,0,0,0.65)] overflow-hidden z-10 will-change-transform"
      >
        {/* Brand Header Section */}
        <div className="flex flex-col items-center text-center mb-7">
          <div ref={brandLogoRef} className="flex items-center gap-2.5 mb-3.5 will-change-transform">
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
              Create Account
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1.5 flex items-center justify-center gap-1">
              <span>Dhaka-র সেরা স্পোর্টস কমিউনিটিতে যোগ দিন।</span>
              <Sparkles className="h-3 w-3 text-emerald-400" />
            </p>
          </div>
        </div>

        {/* Google Continue Action Button */}
        <div ref={googleBtnRef} className="mb-6 will-change-transform">
          <Magnetic range={25} actionStrength={0.25}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 bg-slate-950/40 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider active:scale-95"
              data-cursor-text="GOOGLE"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          </Magnetic>
        </div>

        {/* Divider */}
        <div ref={dividerRef} className="relative flex items-center justify-center my-6 will-change-transform">
          <div className="absolute w-full h-px bg-slate-800/60" />
          <span className="relative bg-[#080d19] px-4 text-[10px] text-slate-500 uppercase tracking-widest font-black">
            or
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleRegister} ref={formItemsRef} className="space-y-4">
          {/* Full Name input field */}
          <div className="relative group will-change-transform">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

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

          {/* Create Password input field */}
          <div className="relative group will-change-transform">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

          {/* Confirm Password input field */}
          <div className="relative group will-change-transform">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

          {/* Terms Checklist */}
          <div className="flex items-start gap-2.5 px-0.5 pt-1 will-change-transform">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 accent-emerald-500 h-3.5 w-3.5 transition-all cursor-pointer rounded border-slate-800 bg-slate-950"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-400 font-semibold leading-relaxed cursor-pointer select-none hover:text-slate-300 transition-colors duration-300"
            >
              I agree to the{' '}
              <Link href="#" className="text-emerald-400 font-bold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-emerald-400 font-bold hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Glowing Submit Signup Button */}
          <div className="pt-2 will-change-transform">
            <Magnetic range={25} actionStrength={0.25}>
              <Button
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 border border-emerald-500/20 active:scale-95 cursor-pointer"
                data-cursor-text="JOIN"
              >
                {loading ? 'Creating Account...' : 'Get Started'}
              </Button>
            </Magnetic>
          </div>
        </form>

        {/* Footer Link */}
        <p ref={bottomLinkRef} className="text-center text-xs text-slate-400 font-semibold mt-6 will-change-transform">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-emerald-400 font-black hover:text-emerald-355 ml-1 transition-colors duration-300"
          >
            Sign in
          </Link>
        </p>

        {/* Decorative corner graphics */}
        <div className="absolute -bottom-4 -left-4 opacity-5 pointer-events-none text-white">
          <svg
            width="75"
            height="75"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="50" cy="50" r="45" />
            <polygon points="50,30 65,42 59,60 41,60 35,42" />
            <line x1="50" y1="30" x2="50" y2="5" />
            <line x1="65" y1="42" x2="90" y2="35" />
            <line x1="59" y1="60" x2="75" y2="85" />
          </svg>
        </div>

      </div>
    </div>
  );
}
