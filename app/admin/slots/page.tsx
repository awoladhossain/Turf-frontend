'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
  Trophy,
  MapPin,
  Loader2,
  ShieldAlert,
  Sliders,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Check,
  Minus,
  Plus,
} from 'lucide-react';

import { useSpotlight } from '@/hooks/useSpotlight';
import { useAuth } from '@/hooks/useAuth';
import turfService from '@/services/turf.service';
import adminService from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/Magnetic';

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AdminSlotsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isFetchingMe } = useAuth();

  const [days, setDays] = useState<number>(7);
  const [selectedTurfId, setSelectedTurfId] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Fetch all turfs for selection
  const { data: turfsData, isLoading: isTurfsLoading } = useQuery({
    queryKey: ['admin-slots-turfs'],
    queryFn: () => turfService.getAllTurfs({ limit: 100 }),
    enabled: isAuthenticated && user?.role === 'ADMIN',
  });

  const activeTurfs = useMemo(() => {
    return turfsData?.data?.filter((t) => t.isActive) || [];
  }, [turfsData]);

  // Entrance animations
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') return;

    const ctx = gsap.context(() => {
      gsap.set('.animate-item', { opacity: 0, y: 15 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      tl.to('.animate-item', {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
      });

      // Continuous float neon orb
      gsap.to(orbitRef.current, {
        y: '+=20',
        x: '-=10',
        scale: 1.05,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, [isAuthenticated, user, pageContainerRef]);

  // Mutations
  const generateAllMutation = useMutation({
    mutationFn: () => adminService.generateSlots(),
    onSuccess: () => {
      toast.success('Slots generated successfully for all active arenas! ⚡');
    },
    onError: (err: unknown) => {
      const error = err as AxiosErrorLike;
      const msg = error.response?.data?.message || 'Failed to generate bulk slots!';
      toast.error(msg);
    },
  });

  const cleanupMutation = useMutation({
    mutationFn: () => adminService.cleanUpOldSlots(),
    onSuccess: (data) => {
      toast.success(data.message || 'Cleaned up old slots successfully! 🧹');
    },
    onError: (err: unknown) => {
      const error = err as AxiosErrorLike;
      const msg = error.response?.data?.message || 'Failed to cleanup old slots!';
      toast.error(msg);
    },
  });

  const generateSpecificMutation = useMutation({
    mutationFn: ({ turfId, days }: { turfId: string; days?: number }) =>
      adminService.generateSlotsForTurf(turfId, days),
    onSuccess: (data) => {
      toast.success(data.message || 'Slots generated for this turf successfully! ⚽✨');
    },
    onError: (err: unknown) => {
      const error = err as AxiosErrorLike;
      const msg = error.response?.data?.message || 'Failed to generate slots for specific turf!';
      toast.error(msg);
    },
  });

  // Action handlers
  const handleGenerateAll = () => {
    generateAllMutation.mutate();
  };

  const handleCleanup = () => {
    if (
      window.confirm(
        'Are you sure you want to clean up expired unbooked slots? This optimizes database storage.'
      )
    ) {
      cleanupMutation.mutate();
    }
  };

  const handleGenerateSpecific = (e: React.FormEvent) => {
    e.preventDefault();
    const turfId = selectedTurfId || activeTurfs[0]?.id;
    if (!turfId) {
      toast.error('Please select a turf arena first.');
      return;
    }
    if (days < 1 || days > 30) {
      toast.error('Days must be between 1 and 30.');
      return;
    }
    generateSpecificMutation.mutate({ turfId, days });
  };

  // --- Auth Guards ---
  if (!isFetchingMe && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push(`/login?redirect=/admin/slots`);
    }
    return null;
  }

  if (!isFetchingMe && isAuthenticated && user?.role !== 'ADMIN') {
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

        <div
          ref={cardRef}
          className="relative z-10 text-center space-y-6 max-w-md p-8 sm:p-10 rounded-[32px] bg-[#0d1425]/30 border border-slate-800/80 backdrop-blur-3xl shadow-2xl"
        >
          <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Unauthorized action. Managing platform game slots and scheduling systems is strictly
            restricted to platform administrators.
          </p>

          <div className="pt-2 flex flex-col gap-3">
            <Magnetic range={15} actionStrength={0.2}>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg"
              >
                Back to Dashboard
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    );
  }

  if (isFetchingMe || !user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050811] text-white p-4">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  const currentTurfId = selectedTurfId || activeTurfs[0]?.id || '';
  const selectedTurfDetails = activeTurfs.find((t) => t.id === currentTurfId);

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      style={
        {
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* 🌌 Grid & Spotlight */}
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
            'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.03), transparent 50%)',
        }}
      />

      {/* Floating Animated Neon Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Back Link */}
        <div className="animate-item">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-400 transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-900 pb-5 space-y-2 animate-item">
          <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            <Sliders className="h-3 w-3 animate-pulse" />
            <span>Slots Administration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Slots Control Center
          </h1>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Generate scheduling calendars for active turf fields, optimize database space by purging
            expired slots, or customize generation duration per venue.
          </p>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* LEFT: Global Bulk Actions (2 Columns) */}
          <div className="lg:col-span-2 space-y-6 animate-item">
            {/* Card 1: Bulk Generator */}
            <div className="bg-[#0d1425]/30 backdrop-blur-3xl rounded-3xl border border-slate-800/80 p-6 space-y-5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar className="h-20 w-20 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Bulk Operation
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider pt-1">
                  Generate All Arena Slots
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                  Initializes time slots for <strong>all active sport arenas</strong> for the next 7
                  days based on their operating hours.
                </p>
              </div>

              <div className="pt-2">
                <Magnetic range={15} actionStrength={0.25}>
                  <Button
                    onClick={handleGenerateAll}
                    disabled={generateAllMutation.isPending}
                    className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {generateAllMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                        <span>Initializing slots...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-emerald-350" />
                        <span>Generate Bulk Slots</span>
                      </>
                    )}
                  </Button>
                </Magnetic>
              </div>
            </div>

            {/* Card 2: Garbage Cleanup */}
            <div className="bg-[#0d1425]/30 backdrop-blur-3xl rounded-3xl border border-slate-800/80 p-6 space-y-5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trash2 className="h-20 w-20 text-rose-500" />
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Database Optimizer
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider pt-1">
                  Purge Expired Slots
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                  Cleans up all unbooked slots in the past to free up database storage and maintain
                  fast query response times.
                </p>
              </div>

              <div className="pt-2">
                <Magnetic range={15} actionStrength={0.25}>
                  <Button
                    onClick={handleCleanup}
                    disabled={cleanupMutation.isPending}
                    className="w-full h-11 bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {cleanupMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                        <span>Optimizing Storage...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 text-rose-450" />
                        <span>Run Slot Garbage Collection</span>
                      </>
                    )}
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* RIGHT: Arena-Specific Selector (3 Columns) */}
          <div className="lg:col-span-3 animate-item">
            <div className="bg-[#0d1425]/30 backdrop-blur-3xl rounded-[32px] border border-slate-800/80 p-8 space-y-6 shadow-2xl">
              <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  Targeted Slot Provisioning
                </h3>
                <span className="text-[8px] font-black text-slate-400 bg-slate-950/80 border border-slate-900 px-2.5 py-1 rounded-full uppercase">
                  Single Arena
                </span>
              </div>

              {isTurfsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-6 w-6 text-emerald-450 animate-spin" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Loading active arenas list...
                  </p>
                </div>
              ) : activeTurfs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <AlertCircle className="h-8 w-8 text-slate-600" />
                  <p className="text-xs font-bold text-slate-400">
                    No active arenas registered in database.
                  </p>
                  <Link
                    href="/admin/turfs/create"
                    className="text-[10px] font-black uppercase text-emerald-400 hover:underline"
                  >
                    Create your first arena now
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleGenerateSpecific}
                  className="space-y-6 font-semibold text-slate-400 text-xs"
                >
                  {/* Select Turf */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-slate-550" />
                      Select Sport Arena
                    </label>
                    <div ref={dropdownRef} className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-[#070b14]/80 hover:border-slate-800 focus:border-emerald-500/40 outline-none transition-all text-white cursor-pointer flex items-center justify-between text-left"
                      >
                        <span className="truncate">
                          {selectedTurfDetails
                            ? `${selectedTurfDetails.name} (${selectedTurfDetails.city})`
                            : 'Select an Arena'}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 w-full mt-2 bg-[#080d1a]/95 backdrop-blur-md border border-slate-850 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-800"
                          >
                            {activeTurfs.map((turf) => (
                              <button
                                key={turf.id}
                                type="button"
                                onClick={() => {
                                  setSelectedTurfId(turf.id);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between hover:bg-slate-900/60 cursor-pointer ${
                                  currentTurfId === turf.id
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                    : 'text-slate-300 border border-transparent'
                                }`}
                              >
                                <span>
                                  {turf.name} ({turf.city})
                                </span>
                                {currentTurfId === turf.id && (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Selected Turf Meta Summary Card */}
                  {selectedTurfDetails && (
                    <div className="bg-[#050811]/60 p-4.5 rounded-2xl border border-slate-900 text-left space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                        <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          Arena Info Card
                        </span>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                          Active Status
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-650 shrink-0" />
                          <span className="text-white truncate max-w-[280px]">
                            {selectedTurfDetails.address}, {selectedTurfDetails.city}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-650 shrink-0" />
                          <span>
                            Operating Hours:{' '}
                            <strong className="text-white">
                              {selectedTurfDetails.openTime} - {selectedTurfDetails.closeTime}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-slate-655 shrink-0" />
                          <span>
                            Discipline:{' '}
                            <strong className="text-white">{selectedTurfDetails.sportType}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Days */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-550" />
                      Provisioning Duration (Days)
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setDays(Math.max(1, days - 1))}
                        className="h-11 w-12 flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-800 rounded-l-xl text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95 select-none"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        value={days}
                        min={1}
                        max={30}
                        onChange={(e) =>
                          setDays(Math.max(1, Math.min(30, Number(e.target.value) || 1)))
                        }
                        placeholder="e.g. 7"
                        className="flex-1 h-11 px-4 bg-slate-950/40 focus:bg-slate-950/60 border-y border-slate-850 focus:border-emerald-500/20 outline-none transition-all text-center text-white placeholder-slate-650 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setDays(Math.min(30, days + 1))}
                        className="h-11 w-12 flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-800 rounded-r-xl text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95 select-none"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 italic">
                      Maximum allowed provisioning duration is 30 days into the future.
                    </p>
                  </div>

                  {/* Specific Generation Button */}
                  <div className="pt-2">
                    <Magnetic range={20} actionStrength={0.2}>
                      <Button
                        type="submit"
                        disabled={generateSpecificMutation.isPending}
                        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg border border-emerald-500/10 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {generateSpecificMutation.isPending ? (
                          <>
                            <Loader2 className="h-4.5 w-4.5 animate-spin text-emerald-300" />
                            <span>Generating Slots...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4.5 w-4.5 text-emerald-200" />
                            <span>Provision Slots for selected Turf</span>
                          </>
                        )}
                      </Button>
                    </Magnetic>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
