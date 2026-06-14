'use client';

import { useSpotlight } from '@/hooks/useSpotlight';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/hooks/useAuth';
import bookingService from '@/services/booking.service';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/api.types';
import gsap from 'gsap';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  Clock,
  Trophy,
  Trash2,
  Loader2,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, isUpdatingProfile, isFetchingMe } = useAuth();
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Custom Cancellation Modal State
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Refs for entrance and spotlight animations
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Sync profile values on load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Read URL query parameters to toggle default tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab === 'bookings') {
        setActiveTab('bookings');
      }
    }
  }, []);

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

  // Fetch Booking History
  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getMyBookings(),
    enabled: activeTab === 'bookings' && isAuthenticated,
  });

  // Cancel Booking Mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Booking cancelled successfully! ❌');
      refetchBookings();
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to cancel booking. Try again!';
      toast.error(message);
    },
  });

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
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
        style={
          {
            '--spotlight-x': '50%',
            '--spotlight-y': '50%',
          } as React.CSSProperties
        }
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.12] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-450 animate-spin" />
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
        style={
          {
            '--spotlight-x': '50%',
            '--spotlight-y': '50%',
          } as React.CSSProperties
        }
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
            'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.05), transparent 50%)',
        }}
      />

      {/* Floating neon glow */}
      <div
        ref={orbitRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#1e6b3e]/6 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Header section */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            My Account Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Manage your personal settings, contact details, and view your game booking logs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: Premium User Badge Card */}
          <div
            ref={cardRef}
            className="lg:col-span-1 bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 space-y-6 shadow-xl will-change-transform"
          >
            {/* Centered Avatar */}
            <div className="text-center space-y-4">
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-600 to-[#1e6b3e] flex items-center justify-center text-3xl font-black text-white uppercase shadow-lg mx-auto border border-emerald-500/20">
                {user.name ? user.name.charAt(0) : 'U'}
                <div className="absolute -bottom-1 -right-1 bg-[#050811] p-1 rounded-full border border-slate-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-950/20" />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black text-white truncate max-w-[200px] mx-auto">
                  {user.name}
                </h2>
                <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-slate-900/80 w-full" />

            {/* Navigation tabs inside left column for better layout control */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-all duration-300 flex items-center gap-2.5 border ${
                  activeTab === 'profile'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-950/45'
                }`}
              >
                <User className="h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-all duration-300 flex items-center gap-2.5 border ${
                  activeTab === 'bookings'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-950/45'
                }`}
              >
                <Calendar className="h-4 w-4" />
                My Booking History
              </button>
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
                <span className="text-slate-300 font-semibold">{registrationDate}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Credentials Form OR Booking History */}
          <div className="lg:col-span-3 bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-6 shadow-xl min-h-[350px]">
            {activeTab === 'profile' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="border-b border-slate-900/80 pb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-emerald-400" />
                    Booking History
                  </h2>
                  <span className="text-[9px] font-black text-slate-500 uppercase">
                    {(bookingsData?.data?.length || 0) > 0 ? `${bookingsData?.data?.length} Reservations` : 'Empty Logs'}
                  </span>
                </div>

                {/* Booking History logs list */}
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin select-none">
                  {isBookingsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <Loader2 className="h-8 w-8 text-emerald-450 animate-spin" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
                        Retrieving reservations...
                      </p>
                    </div>
                  ) : !bookingsData || bookingsData.data.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="h-12 w-12 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center mx-auto text-slate-650">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs font-black text-slate-300">No Bookings Found</h3>
                        <p className="text-[10px] text-slate-500 font-semibold max-w-xs mx-auto">
                          You haven't reserved any sports arenas yet. Ready to start your first game?
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/turfs')}
                        className="h-9 px-5 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] text-white font-bold text-[10px] uppercase tracking-wider rounded-lg hover:from-emerald-500 cursor-pointer shadow-md"
                      >
                        Book an Arena
                      </button>
                    </div>
                  ) : (
                    bookingsData.data.map((booking) => {
                      const dateObj = booking.slot?.date ? new Date(booking.slot.date) : null;
                      const dayNum = dateObj ? dateObj.getDate() : '--';
                      const monthStr = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : 'Date';
                      const dayName = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }) : '';

                      const isPendingPayment = booking.status === 'PENDING';
                      const isConfirmed = booking.status === 'CONFIRMED';
                      const isCancelled = booking.status === 'CANCELLED';
                      const turfName = booking.turf?.name?.trim() || 'Sports Arena';

                      return (
                        <div
                          key={booking.id}
                          className="group p-5 rounded-2xl bg-gradient-to-br from-[#070b16] to-[#04060f] border border-slate-900/90 hover:border-slate-800/80 hover:bg-gradient-to-br hover:from-[#090f20] hover:to-[#050914] transition-all duration-300 flex flex-col sm:flex-row gap-4 relative shadow-lg shadow-slate-950/20"
                        >
                          {/* Accent left border based on status */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 ${
                            isConfirmed ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                            isPendingPayment ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' :
                            isCancelled ? 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' :
                            'bg-slate-700'
                          }`} />

                          {/* Left: Date Ticket */}
                          <div className="flex sm:flex-col items-center justify-center bg-slate-950/80 border border-slate-900 rounded-xl p-3 sm:w-16 sm:h-20 h-12 w-full shrink-0 gap-2 sm:gap-0.5 text-center shadow-inner group-hover:border-emerald-500/20 transition-all duration-300">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 leading-none sm:mb-1">{monthStr}</span>
                            <span className="text-xl sm:text-2xl font-black text-white leading-none">{dayNum}</span>
                            {dayName && <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider hidden sm:block">{dayName}</span>}
                          </div>

                          {/* Middle: Details */}
                          <div className="flex-grow space-y-2.5 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="space-y-0.5 min-w-0">
                                <h4 className="text-xs font-black text-white tracking-wide truncate group-hover:text-emerald-400 transition-colors duration-300">
                                  {turfName}
                                </h4>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                                  ID: #{booking.id.slice(0, 8)}
                                </span>
                              </div>

                              {/* Status Badge */}
                              {isConfirmed ? (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full select-none shadow-sm shadow-emerald-500/5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse" />
                                  Confirmed
                                </span>
                              ) : isPendingPayment ? (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full select-none shadow-sm shadow-amber-500/5 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-450 animate-ping" />
                                  Pending Payment
                                </span>
                              ) : isCancelled ? (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-455 px-2 py-0.5 rounded-full select-none shadow-sm shadow-rose-500/5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-455" />
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider bg-slate-800/80 border border-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full select-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                  Completed
                                </span>
                              )}
                            </div>

                            {/* Booking Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-400 border-t border-b border-slate-950/60 py-2.5 my-1">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                                <span>{booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : 'Time Slot'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <MapPin className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                                <span className="truncate" title={`${booking.turf?.address || ''}, ${booking.turf?.city || ''}`}>
                                  {booking.turf?.address || 'Mirpur, Dhaka'}
                                </span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between pt-1">
                              <div>
                                <span className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest block leading-none">Total Cost</span>
                                <span className="text-white font-black text-xs mt-1 block">৳{booking.totalAmount}</span>
                              </div>

                              <div className="flex gap-2 shrink-0">
                                {/* Pay Now Button */}
                                {isPendingPayment && (
                                  <Link
                                    href={`/checkout/${booking.id}`}
                                    className="h-7 px-3 text-[9px] font-black uppercase bg-emerald-500 hover:bg-emerald-450 border border-emerald-400/20 text-white rounded-lg flex items-center gap-1 shadow-sm transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                                  >
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Pay Now
                                  </Link>
                                )}

                                {/* Cancel Button */}
                                {(isConfirmed || isPendingPayment) && (
                                  <button
                                    type="button"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="h-7 px-2.5 text-[9px] font-black uppercase bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-lg hover:bg-rose-500/15 cursor-pointer flex items-center gap-1 transition-all shrink-0 hover:scale-105 active:scale-95"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Custom Booking Cancellation Confirmation Modal */}
      <AnimatePresence>
        {bookingToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingToCancel(null)}
              className="absolute inset-0 bg-[#050811]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-[#0d1425] border border-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden z-10"
            >
              {/* Radial gradient background accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="text-center space-y-4 relative z-10">
                <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto shadow-inner">
                  <Trash2 className="h-8 w-8 text-rose-400 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Cancel Reservation?
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Are you sure you want to cancel this booking? This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <button
                  onClick={() => setBookingToCancel(null)}
                  className="w-full h-11 bg-slate-950/80 border border-slate-900 hover:border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => {
                    cancelBookingMutation.mutate(bookingToCancel);
                    setBookingToCancel(null);
                  }}
                  disabled={cancelBookingMutation.isPending}
                  className="w-full h-11 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-rose-950/40 border border-rose-500/10 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {cancelBookingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Confirm Cancel'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
