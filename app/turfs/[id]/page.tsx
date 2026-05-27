'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import turfService from '@/services/turf.service';
import { 
  MapPin, Clock, Trophy, Sparkles, Star, Calendar, 
  ChevronLeft, ArrowRight, ShieldAlert, BadgeInfo, DollarSign, PenSquare 
} from 'lucide-react';
import gsap from 'gsap';
import Magnetic from '@/components/ui/Magnetic';
import toast from 'react-hot-toast';

export default function TurfDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Form & Selection States
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');

  // Refs for animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const contentGridRef = useRef<HTMLDivElement>(null);
  const loginAlertRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // 1. Fetch live turf details (only if authenticated to comply with backend route restriction)
  const { data: turf, isLoading, error } = useQuery({
    queryKey: ['turf', id],
    queryFn: () => turfService.getTurfById(id),
    enabled: !!id && isAuthenticated,
    retry: 1,
  });

  // Generate date options for the next 7 days
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const isoDate = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      dates.push({
        iso: isoDate,
        dayName,
        dayNum,
        monthName,
        label: i === 0 ? 'Today' : `${dayName}, ${monthName} ${dayNum}`
      });
    }
    return dates;
  }, []);

  // Set default selected date to today on mount
  useEffect(() => {
    if (dateOptions.length > 0) {
      setSelectedDate(dateOptions[0].iso);
    }
  }, [dateOptions]);

  // Mock slot data based on turf operating hours
  const slots = useMemo(() => {
    if (!turf) return [];
    
    // Parse times (e.g. "06:00" and "23:30")
    const openHour = parseInt(turf.openTime.split(':')[0]) || 6;
    const closeHour = parseInt(turf.closeTime.split(':')[0]) || 23;
    
    const generatedSlots = [];
    let slotHour = openHour;
    
    while (slotHour < closeHour) {
      const startStr = `${String(slotHour).padStart(2, '0')}:00`;
      const endStr = `${String(slotHour + 1).padStart(2, '0')}:30`;
      const isBookedMock = (slotHour * 7) % 5 === 0; // Deterministic booked status for testing
      
      generatedSlots.push({
        id: `slot-${slotHour}`,
        startTime: startStr,
        endTime: endStr,
        isBooked: isBookedMock,
      });
      slotHour += 2; // 2 hour intervals
    }
    return generatedSlots;
  }, [turf]);

  // Setup GSAP entrance animations for details page
  useEffect(() => {
    if (!isAuthenticated) {
      // Animate the login warning card
      gsap.context(() => {
        gsap.set(loginAlertRef.current, { opacity: 0, scale: 0.95, y: 30 });
        gsap.to(loginAlertRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      }, pageContainerRef);
      return;
    }

    if (isLoading || !turf) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set('.animate-fade', { opacity: 0, y: 25 });
      
      // Stagger entrance timeline
      gsap.to('.animate-fade', {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Continuous float animation for floating orb
      gsap.to(orbitRef.current, {
        y: '+=20',
        x: '-=15',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, [isAuthenticated, isLoading, turf]);

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
      ease: 'power3.out'
    });
  };

  // Handle mock booking process
  const handleBooking = () => {
    if (!selectedSlotId) {
      toast.error('Please select a slot to book!');
      return;
    }
    toast.success('Successfully reserved slot! Proceeding to Payment... ⚽💳');
  };

  // Sport type display mapping helper
  const sportTypeDetails = useMemo(() => {
    if (!turf) return { label: 'Football', icon: Trophy };
    if (turf.sportType === 'CRICKET') return { label: 'Cricket', icon: Trophy };
    if (turf.sportType === 'BOTH') return { label: 'Football & Cricket', icon: Trophy };
    return { label: 'Football', icon: Trophy };
  }, [turf]);

  // Fallback high-quality image provider
  const displayImage = useMemo(() => {
    if (!turf) return '';
    const fallbackImage = turf.sportType === 'CRICKET'
      ? 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'
      : turf.sportType === 'BOTH'
      ? 'https://images.unsplash.com/photo-1510563800743-aed2364902b8?auto=format&fit=crop&q=80&w=800'
      : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800';

    return turf.images && turf.images.length > 0 && !turf.images[0].includes('example.com')
      ? turf.images[0]
      : fallbackImage;
  }, [turf]);

  const selectedSlotDetails = useMemo(() => {
    return slots.find(s => s.id === selectedSlotId);
  }, [selectedSlotId, slots]);

  // --- protected State for Unauthenticated Guest Users ---
  if (!isAuthenticated) {
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
        
        <div 
          ref={loginAlertRef}
          className="relative z-10 text-center space-y-6 max-w-md p-8 sm:p-10 rounded-[32px] bg-[#0d1425]/30 border border-slate-800/80 backdrop-blur-3xl shadow-2xl"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShieldAlert className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Authentication Required</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            To secure game bookings, slots must be associated with a TurfBook account. Please log in to view availability, pricing, and book your slots.
          </p>
          
          <div className="pt-2 flex flex-col gap-3">
            <Magnetic range={15} actionStrength={0.2}>
              <Button
                onClick={() => router.push(`/login?redirect=/turfs/${id}`)}
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg shadow-emerald-950/40"
              >
                Sign In to Account
              </Button>
            </Magnetic>
            
            <button
              onClick={() => router.push('/turfs')}
              className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors duration-300 flex items-center justify-center gap-1 cursor-pointer mx-auto mt-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to Turf Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Loader State ---
  if (isLoading) {
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
            Retrieving Arena details...
          </p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !turf) {
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
        
        <div className="relative z-10 text-center space-y-6 max-w-md p-8 rounded-[32px] bg-[#0d1425]/30 border border-slate-900 backdrop-blur-3xl shadow-2xl">
          <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <BadgeInfo className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-white">Arena Not Found</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            The requested arena profile could not be retrieved. It may have been unlisted or is currently undergoing maintenance.
          </p>
          <Magnetic range={15} actionStrength={0.2}>
            <Button
              onClick={() => router.push('/turfs')}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg"
            >
              Return to Hub
            </Button>
          </Magnetic>
        </div>
      </div>
    );
  }

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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Back Link */}
        <div className="animate-fade">
          <Link
            href="/turfs"
            className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-400 transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Arenas Hub
          </Link>
        </div>

        {/* Layout Grid */}
        <div ref={contentGridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (2 Cols): Details, Specs, Images */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Banner Section */}
            <div className="animate-fade relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-900 bg-slate-950 shadow-2xl">
              <img
                src={displayImage}
                alt={turf.name}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Rating & Sport Badges on Banner */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 backdrop-blur-md">
                      <Trophy className="h-3 w-3" />
                      {sportTypeDetails.label}
                    </span>
                    <span className="text-[8px] font-black text-slate-400 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
                      Active Arena
                    </span>
                  </div>
                  
                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                    {turf.name}
                  </h1>
                </div>

                <div className="bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 shadow-lg select-none">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <div className="text-right">
                    <p className="text-xs font-black text-white leading-none">4.9</p>
                    <p className="text-[8px] font-bold text-slate-500 leading-none mt-0.5">124 reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* General Description */}
            <div className="animate-fade bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                About The Arena
              </h2>
              <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-semibold">
                {turf.description || "Experience TurfBook premium sports complex in Dhaka. Our arena features state-of-the-art facilities, high-performance artificial shock-absorbent grass turf, and professional floodlights. Excellent location, ideal for friends, match practices, and club leagues."}
              </p>
              
              <div className="h-[1px] bg-slate-900/80 my-2" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4.5 w-4.5 text-slate-650 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-none">Address</p>
                    <p className="text-white font-semibold leading-relaxed mt-1">{turf.address}, {turf.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4.5 w-4.5 text-slate-650 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-none">Operational Hours</p>
                    <p className="text-white font-semibold leading-relaxed mt-1">{turf.openTime} AM - {turf.closeTime} PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Scheduler (Interactive Date & Slot Selection) */}
            <div className="animate-fade bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Select Booking Schedule
                </h2>
                <p className="text-[10px] text-slate-500 font-semibold">
                  Pick a convenient day and choose from available 2-hour game times.
                </p>
              </div>

              {/* Horizontal sliding date picker */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
                {dateOptions.map((opt) => {
                  const isSelected = selectedDate === opt.iso;
                  return (
                    <button
                      key={opt.iso}
                      onClick={() => {
                        setSelectedDate(opt.iso);
                        setSelectedSlotId(''); // Reset slot selection when date changes
                      }}
                      className={`flex-shrink-0 w-20 py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-br from-emerald-600 to-[#1e6b3e] border-emerald-500/20 text-white shadow-lg' 
                          : 'bg-[#050811] border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-wider opacity-70">{opt.dayName}</span>
                      <span className="text-base font-black leading-none">{opt.dayNum}</span>
                      <span className="text-[8px] font-bold opacity-60">{opt.monthName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Grid of slots */}
              <div className="space-y-3 pt-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                  Available Slots
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isBooked = slot.isBooked;

                    return (
                      <button
                        key={slot.id}
                        onClick={() => !isBooked && setSelectedSlotId(slot.id)}
                        disabled={isBooked}
                        className={`h-12 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                          isBooked 
                            ? 'bg-[#050811]/40 border-slate-950 text-slate-600 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-[#050811] border-slate-900 text-slate-350 hover:border-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="text-left leading-none">
                          <p className="text-xs font-black">{slot.startTime}</p>
                          <p className="text-[8px] font-bold opacity-60 mt-0.5">until {slot.endTime}</p>
                        </div>
                        
                        <span className={`h-1.5 w-1.5 rounded-full ${isBooked ? 'bg-slate-700' : isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Premium Booking Cart Summary */}
          <div className="lg:col-span-1 bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 space-y-6 shadow-xl lg:sticky lg:top-24 animate-fade">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                Booking Summary
              </h2>
            </div>

            {/* Cart overview details */}
            <div className="space-y-4 text-xs font-bold text-slate-400">
              
              <div className="flex justify-between items-start py-2 border-b border-slate-900/50">
                <span className="text-slate-500">Arena</span>
                <span className="text-white text-right font-black max-w-[150px] truncate">{turf.name}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-900/50">
                <span className="text-slate-500">Selected Date</span>
                <span className="text-slate-200 font-semibold">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  }) : 'Not Selected'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-900/50">
                <span className="text-slate-500">Slot Time</span>
                <span className="text-slate-200 font-semibold">
                  {selectedSlotDetails ? `${selectedSlotDetails.startTime} - ${selectedSlotDetails.endTime}` : 'Select a Slot'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-900/50">
                <span className="text-slate-500">Hourly Cost</span>
                <span className="text-white font-black">৳{turf.pricePerHour}</span>
              </div>

              {/* Coupon inputs */}
              <div className="space-y-2 pt-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                  Add Coupon Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. TURF20"
                    className="w-full h-9 pl-3 pr-16 rounded-lg border border-slate-850 bg-slate-950/40 focus:border-emerald-500/25 outline-none text-xs font-semibold text-white placeholder-slate-600"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 h-7 px-3 text-[8px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/15 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Notes Input field */}
              <div className="space-y-2 pt-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                  Additional Notes
                </label>
                <div className="relative">
                  <PenSquare className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need cricket bats / football kits"
                    className="w-full h-20 pl-9 pr-3 py-2 rounded-lg border border-slate-850 bg-slate-950/40 focus:border-emerald-500/25 outline-none text-xs font-semibold text-white placeholder-slate-650 resize-none"
                  />
                </div>
              </div>

              {/* Price Calculation Row */}
              <div className="bg-[#050811] p-4 rounded-2xl border border-slate-900 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-550 uppercase tracking-widest">
                      Total Budget
                    </p>
                    <p className="text-xl font-black text-white tracking-tight">
                      ৳{Number(turf.pricePerHour) * 1.5}
                      <span className="text-[9px] text-slate-500 font-normal"> / 2 hrs</span>
                    </p>
                  </div>

                  <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    1.5 Hours Slot
                  </span>
                </div>
              </div>

              {/* Checkout actions */}
              <div className="pt-2">
                <Magnetic range={20} actionStrength={0.25}>
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedSlotId}
                    className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg border border-emerald-500/10 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Book</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Magnetic>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
