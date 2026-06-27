'use client';
import { useSpotlight } from '@/hooks/useSpotlight';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import turfService from '@/services/turf.service';
import adminService from '@/services/admin.service';
import {
  Trophy,
  Sparkles,
  ChevronLeft,
  ShieldAlert,
  MapPin,
  Clock,
  DollarSign,
  PenSquare,
  FileText,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from 'lucide-react';
import gsap from 'gsap';
import Magnetic from '@/components/ui/Magnetic';
import toast from 'react-hot-toast';

export default function EditTurfPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { isAuthenticated, user, isFetchingMe } = useAuth();
  const queryClient = useQueryClient();

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [sportType, setSportType] = useState<'FOOTBALL' | 'CRICKET' | 'BOTH'>('BOTH');
  const [pricePerHour, setPricePerHour] = useState<number>(1500);
  const [openTime, setOpenTime] = useState('06:00');
  const [closeTime, setCloseTime] = useState('23:00');

  // Refs for animations
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // 1. Fetch existing turf details
  const { data: turf, isLoading: isFetchingTurf } = useQuery({
    queryKey: ['turf-edit', id],
    queryFn: () => turfService.getTurfById(id),
    enabled: !!id && isAuthenticated && user?.role === 'ADMIN',
    retry: 1,
  });

  // Pre-fill form fields once data is fetched successfully
  useEffect(() => {
    if (turf) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setName(turf.name || '');
      setDescription(turf.description || '');
      setAddress(turf.address || '');
      setCity(turf.city || 'Dhaka');
      setSportType(turf.sportType || 'BOTH');
      setPricePerHour(Number(turf.pricePerHour) || 1500);
      setOpenTime(turf.openTime || '06:00');
      setCloseTime(turf.closeTime || '23:00');
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [turf]);

  // 2. TanStack Mutation: UPDATE (PATCH)
  const updateMutation = useMutation({
    mutationFn: (updatedFields: {
      name: string;
      description: string;
      address: string;
      city: string;
      sportType: 'FOOTBALL' | 'CRICKET' | 'BOTH';
      pricePerHour: number;
      openTime: string;
      closeTime: string;
    }) => turfService.updateTurf(id, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      queryClient.invalidateQueries({ queryKey: ['turf', id] });
      queryClient.invalidateQueries({ queryKey: ['turf-edit', id] });
      toast.success('Arena profile updated successfully! ⚽🔥');
      router.push(`/turfs/${id}`);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Failed to update turf arena!';
      toast.error(msg);
    },
  });

  // 3. TanStack Mutation: DELETE
  const deleteMutation = useMutation({
    mutationFn: () => turfService.deleteTurf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast.success('Arena has been successfully deactivated! 🔒');
      router.push('/turfs');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Failed to delete turf arena!';
      toast.error(msg);
    },
  });

  // 4. TanStack Mutations for Image upload/delete directly
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => adminService.uploadTurfImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      queryClient.invalidateQueries({ queryKey: ['turf', id] });
      queryClient.invalidateQueries({ queryKey: ['turf-edit', id] });
      toast.success('Showcase image uploaded successfully! 📸⚽');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Failed to upload image!';
      toast.error(msg);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageUrl: string) => adminService.deleteTurfImage(id, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      queryClient.invalidateQueries({ queryKey: ['turf', id] });
      queryClient.invalidateQueries({ queryKey: ['turf-edit', id] });
      toast.success('Showcase image removed successfully! 🗑️');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Failed to delete image!';
      toast.error(msg);
    },
  });

  // Entrance animations setup
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'ADMIN') {
      gsap.context(() => {
        gsap.set(cardRef.current, { opacity: 0, scale: 0.95, y: 30 });
        gsap.to(cardRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }, pageContainerRef);
      return;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN' || isFetchingTurf || !turf) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { opacity: 0, y: 40 });
      gsap.set('.animate-item', { opacity: 0, y: 15 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      tl.to(cardRef.current, { opacity: 1, y: 0, duration: 1 });

      tl.to(
        '.animate-item',
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
        },
        '-=0.5'
      );

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
  }, [isAuthenticated, user, isFetchingTurf, turf, pageContainerRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error('Name is required!');
    if (!description.trim() || description.length < 10) {
      return toast.error('Description must be at least 10 characters long!');
    }
    if (!address.trim()) return toast.error('Address is required!');
    if (!city.trim()) return toast.error('City is required!');
    if (pricePerHour < 100) return toast.error('Price per hour must be at least 100!');

    // Time regex validation matching class-validator
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(openTime)) {
      return toast.error('Opening time must be in HH:mm 24-hour format!');
    }
    if (!timeRegex.test(closeTime)) {
      return toast.error('Closing time must be in HH:mm 24-hour format!');
    }

    updateMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      sportType,
      pricePerHour: Number(pricePerHour),
      openTime,
      closeTime,
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you absolutely sure you want to deactivate this Arena? This action will set isActive to false.'
      )
    ) {
      deleteMutation.mutate();
    }
  };

  // --- protected State: Redirect Guest users ---
  if (!isFetchingMe && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push(`/login?redirect=/admin/turfs/edit/${id}`);
    }
    return null;
  }

  // --- protection: Authenticated but NOT Admin ---
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
          <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Unauthorized action. Managing platform inventories and editing turf profiles is strictly
            restricted to platform administrators.
          </p>
          <Magnetic range={15} actionStrength={0.2}>
            <Button
              onClick={() => router.push('/turfs')}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg"
            >
              Back to Arenas Hub
            </Button>
          </Magnetic>
        </div>
      </div>
    );
  }

  // --- Loader state during auth or turf fetching ---
  if (isFetchingMe || isFetchingTurf || !user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050811] text-white p-4">
        <div className="h-8 w-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
      </div>
    );
  }

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
            'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(245,158,11,0.03), transparent 50%)',
        }}
      />

      {/* Floating Animated Neon Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Back Link */}
        <div className="animate-item">
          <Link
            href={`/turfs/${id}`}
            className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-400 transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Arena Details
          </Link>
        </div>

        {/* --- FORM CARD --- */}
        <div
          ref={cardRef}
          className="relative bg-[#0d1425]/40 backdrop-blur-3xl rounded-[32px] border border-slate-800/80 p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-slate-900 pb-5 flex items-start justify-between gap-4 animate-item">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                <span>Admin Settings</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Modify Arena Details
              </h1>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Update verified info or suspend active slot listings for {turf?.name}.
              </p>
            </div>

            {/* Suspend / Delete action */}
            <Magnetic range={10} actionStrength={0.2}>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-450 hover:bg-rose-500/20 transition-all cursor-pointer active:scale-90"
                title="Deactivate Arena"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Magnetic>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 pt-6 font-semibold text-slate-400 text-xs"
          >
            {/* Row 1: Name */}
            <div className="space-y-2 animate-item">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-550" />
                Arena Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Stadium MS Premium Turf"
                className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
              />
            </div>

            {/* Row 2: Description */}
            <div className="space-y-2 animate-item">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <PenSquare className="h-3.5 w-3.5 text-slate-550" />
                Description (Min 10 characters)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Experience international standard football and cricket facilities in Dhaka."
                className="w-full h-24 px-4 py-3 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650 resize-none"
              />
            </div>

            {/* Row 3: Address & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-item">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-550" />
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Block-C, Mirpur 10"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-550" />
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>
            </div>

            {/* Row 4: Sport Type & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-item">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-slate-550" />
                  Discipline / Sport Type
                </label>
                <select
                  value={sportType}
                  onChange={(e) => setSportType(e.target.value as 'FOOTBALL' | 'CRICKET' | 'BOTH')}
                  className="w-full h-11 px-3 rounded-xl border border-slate-850 bg-[#070b14] focus:border-amber-500/20 outline-none transition-all text-white cursor-pointer"
                >
                  <option value="BOTH">Football & Cricket (BOTH)</option>
                  <option value="FOOTBALL">Football Only</option>
                  <option value="CRICKET">Cricket Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-slate-550" />
                  Hourly Price (৳) (Min 100)
                </label>
                <input
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(Number(e.target.value))}
                  placeholder="1500"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>
            </div>

            {/* Row 5: Open Time & Close Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-item">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-550" />
                  Opening Hours (HH:mm format)
                </label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  placeholder="e.g. 06:00"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-550" />
                  Closing Hours (HH:mm format)
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  placeholder="e.g. 23:00"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>
            </div>

            {/* Showcase Images Manager */}
            <div className="space-y-3 animate-item pt-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-550" />
                Manage Showcase Images
              </label>

              {/* Grid of uploaded images */}
              {turf.images && turf.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {turf.images.map((imageUrl: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-slate-850 bg-slate-950/60 p-1.5 flex flex-col gap-1"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={`Showcase ${idx + 1}`}
                          className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        {/* Delete image button overlay */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this showcase image from Cloudinary?')) {
                              deleteImageMutation.mutate(imageUrl);
                            }
                          }}
                          disabled={deleteImageMutation.isPending}
                          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 border border-slate-800 text-rose-405 hover:bg-rose-950/80 hover:text-rose-450 hover:border-rose-900/40 flex items-center justify-center transition-all cursor-pointer z-10 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="relative group border border-dashed border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 bg-slate-950/20 hover:bg-slate-950/40 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[120px] text-center">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('File size must be less than 5MB!');
                        return;
                      }
                      uploadImageMutation.mutate(file);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadImageMutation.isPending || deleteImageMutation.isPending}
                />
                {uploadImageMutation.isPending ? (
                  <>
                    <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
                    <span className="text-xs font-bold text-amber-400">
                      Uploading file to Cloudinary...
                    </span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-7 w-7 text-slate-500 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300 mb-2" />
                    <span className="text-xs font-bold text-slate-350">
                      Upload new image file to gallery
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">
                      Supports PNG, JPEG, WEBP up to 5MB (Direct cloud sync)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Submit & Suspended actions */}
            <div className="pt-4 animate-item flex flex-col sm:flex-row gap-3">
              <Magnetic range={20} actionStrength={0.25}>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-[#b57a07] hover:from-amber-400 hover:to-[#996403] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg border border-amber-500/10 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <span>
                    {updateMutation.isPending ? 'Saving Changes...' : 'Save Arena Settings'}
                  </span>
                </Button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
