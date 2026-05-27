'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, Shield, Calendar, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Magnetic from '@/components/ui/Magnetic';

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, isUpdatingProfile, isFetchingMe } = useAuth();
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Refs for entrance and spotlight animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Sync profile values on load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Entrance animations
  useEffect(() => {
    if (!isAuthenticated) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(cardRef.current, { opacity: 0, y: 30, scale: 0.98 });
      gsap.set('.profile-field', { opacity: 0, x: -15 });

      // Animate card
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Stagger animate fields
      gsap.to('.profile-field', {
        opacity: 1,
        x: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.2,
      });

      // Background floating glow
      gsap.to(orbitRef.current, {
        y: '+=20',
        x: '-=15',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, [isAuthenticated]);

  // Spotlight mouse tracker
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
      ease: 'power3.out',
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
  };

  // Sleek rotating loader during initial profile fetch
  if (isFetchingMe && !user) {
    return (
      <div 
        ref={pageContainerRef}
        onMouseMove={handleMouseMove}
        className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050811] text-white p-4 font-jakarta relative overflow-hidden"
        style={{
          '--spotlight-x': '50%',
          '--spotlight-y': '50%'
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.12] pointer-events-none" />
        
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Redirect unauthorized users
  if (!isAuthenticated || !user) {
    return (
      <div 
        ref={pageContainerRef}
        onMouseMove={handleMouseMove}
        className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050811] text-white p-4 font-jakarta relative overflow-hidden"
        style={{
          '--spotlight-x': '50%',
          '--spotlight-y': '50%'
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.12] pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-6 max-w-sm p-8 rounded-3xl bg-[#0d1425]/30 border border-slate-900 backdrop-blur-3xl shadow-2xl">
          <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-white">Access Denied</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            You must be logged in to access the profile dashboard area.
          </p>
          <Magnetic range={15} actionStrength={0.2}>
            <Button
              onClick={() => router.push('/login')}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg shadow-emerald-950/40"
            >
              Sign In
            </Button>
          </Magnetic>
        </div>
      </div>
    );
  }

  // Format Account Registration Date
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown Date';

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      {/* 🌌 High-Performance Grid & Spotlight */}
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

      {/* Floating neon glow */}
      <div
        ref={orbitRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#1e6b3e]/6 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header section */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            My Account Profile
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Manage your personal settings, contact details, and account preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Premium User Badge Card */}
          <div ref={cardRef} className="lg:col-span-1 bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 space-y-6 shadow-xl will-change-transform">
            
            {/* Centered Avatar */}
            <div className="text-center space-y-4">
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-600 to-[#1e6b3e] flex items-center justify-center text-3xl font-black text-white uppercase shadow-lg mx-auto border border-emerald-500/20">
                {user.name ? user.name.charAt(0) : 'U'}
                <div className="absolute -bottom-1 -right-1 bg-[#050811] p-1 rounded-full border border-slate-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-950/20" />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black text-white truncate max-w-[200px] mx-auto">{user.name}</h2>
                <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="h-[1px] bg-slate-900/80 w-full" />

            {/* Quick Details List */}
            <div className="space-y-4 text-xs font-bold text-slate-400">
              
              <div className="profile-field flex items-center justify-between py-1 border-b border-slate-900/50">
                <span className="flex items-center gap-2 text-slate-500">
                  <Shield className="h-4 w-4 text-slate-650" />
                  Account Role
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                  {user.role}
                </span>
              </div>

              <div className="profile-field flex items-center justify-between py-1 border-b border-slate-900/50">
                <span className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-slate-650" />
                  Verification
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="profile-field flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4 text-slate-650" />
                  Joined TurfBook
                </span>
                <span className="text-slate-300 font-semibold">
                  {registrationDate}
                </span>
              </div>

            </div>

          </div>

          {/* Right Column: Edit Profile Credentials Form */}
          <div className="lg:col-span-2 bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="border-b border-slate-900/80 pb-3">
              <h2 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                Personal Details
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              {/* Full Name field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-xs font-semibold text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Email Address field (Disabled) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Email Address (Unchangeable)
                </label>
                <div className="relative opacity-65">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/20 outline-none text-xs font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Number field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800/80 bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-xs font-semibold text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2">
                <Magnetic range={20} actionStrength={0.25}>
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="h-11 px-8 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 border border-emerald-500/10 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Saving Details...' : 'Save Settings'}
                  </Button>
                </Magnetic>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
