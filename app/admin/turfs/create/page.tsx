'use client';
import { useSpotlight } from '@/hooks/useSpotlight';

import { Button } from '@/components/ui/button';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/hooks/useAuth';
import turfService from '@/services/turf.service';
import adminService from '@/services/admin.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  ChevronLeft,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
  MapPin,
  PenSquare,
  ShieldAlert,
  Sparkles,
  Trophy,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateTurfPage() {
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

  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Refs for animations
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Memoized local preview URLs
  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File "${file.name}" is larger than 5MB!`);
          return false;
        }
        return true;
      });
      setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 4));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // TanStack Mutation for turf creation + file uploading
  const createMutation = useMutation({
    mutationFn: async (newTurf: {
      name: string;
      description?: string;
      address: string;
      city: string;
      sportType: 'FOOTBALL' | 'CRICKET' | 'BOTH';
      pricePerHour: number;
      openTime: string;
      closeTime: string;
    }) => {
      // 1. Create the turf profile first
      const createdTurf = await turfService.createTurf(newTurf);

      // 2. Upload images sequentially if files were selected
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        for (let i = 0; i < selectedFiles.length; i++) {
          toast.loading(`Uploading arena showcase image ${i + 1}/${selectedFiles.length}...`, {
            id: `upload-${createdTurf.id}`,
          });
          await adminService.uploadTurfImage(createdTurf.id, selectedFiles[i]);
        }
        toast.dismiss(`upload-${createdTurf.id}`);
      }
      return createdTurf;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast.success('Arena profile deployed and images uploaded successfully! ⚽✨');
      router.push('/turfs');
    },
    onError: (err: unknown) => {
      toast.dismiss();
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Failed to create turf arena!';
      toast.error(msg);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Entrance animations
  useEffect(() => {
    // If not admin, we skip entrance animations for the form and focus on warnings
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

    if (!isAuthenticated || user?.role !== 'ADMIN') return;

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
  }, [isAuthenticated, user, pageContainerRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error('Name is required!');
    if (!address.trim()) return toast.error('Address is required!');
    if (!city.trim()) return toast.error('City is required!');
    if (pricePerHour <= 0) return toast.error('Price per hour must be positive!');

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      address: address.trim(),
      city: city.trim(),
      sportType,
      pricePerHour: Number(pricePerHour),
      openTime,
      closeTime,
    });
  };

  // --- protected State: Redirect Guest users ---
  if (!isFetchingMe && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push(`/login?redirect=/admin/turfs/create`);
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
          <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Unauthorized action. Creating sports arenas and managing platform inventory is strictly
            restricted to platform administrators.
          </p>

          <div className="pt-2 flex flex-col gap-3">
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
      </div>
    );
  }

  // --- Loader state during auth parsing ---
  if (isFetchingMe || !user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050811] text-white p-4">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
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
            href="/turfs"
            className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-400 transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Arenas Hub
          </Link>
        </div>

        {/* --- FORM CARD --- */}
        <div
          ref={cardRef}
          className="relative bg-[#0d1425]/40 backdrop-blur-3xl rounded-[32px] border border-slate-800/80 p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-slate-900 pb-5 space-y-2 animate-item">
            <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Admin Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create New Sport Arena
            </h1>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Add a verified turf to the TurfBook system. Slots for the first 7 days will be
              automatically initialized at midnight.
            </p>
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
                placeholder="e.g. Stadium MS Premium Turf"
                className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 focus:bg-slate-950/60 outline-none transition-all text-white placeholder-slate-650"
              />
            </div>

            {/* Row 2: Description */}
            <div className="space-y-2 animate-item">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <PenSquare className="h-3.5 w-3.5 text-slate-550" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Experience international standard football and cricket facilities in Dhaka..."
                className="w-full h-24 px-4 py-3 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 focus:bg-slate-950/60 outline-none transition-all text-white placeholder-slate-650 resize-none"
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
                  placeholder="e.g. Block-C, Mirpur 10"
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
                  placeholder="e.g. Dhaka"
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
                  Hourly Price (৳)
                </label>
                <input
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(Number(e.target.value))}
                  placeholder="e.g. 3200"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>
            </div>

            {/* Row 5: Open Time & Close Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-item">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-550" />
                  Opening Hours
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
                  Closing Hours
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  placeholder="e.g. 23:30"
                  className="w-full h-11 px-4 rounded-xl border border-slate-850 bg-slate-950/40 focus:border-amber-500/20 outline-none transition-all text-white placeholder-slate-650"
                />
              </div>
            </div>

            {/* Image Files Upload */}
            <div className="space-y-3 animate-item pt-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-550" />
                Arena Showcase Images
              </label>

              {/* Drag and Drop Container */}
              <div className="relative group border border-dashed border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 bg-slate-950/20 hover:bg-slate-950/40 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[140px] text-center">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <ImageIcon className="h-8 w-8 text-slate-500 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300 mb-2" />
                <span className="text-xs font-bold text-slate-350">
                  Drag & drop images here or{' '}
                  <span className="text-amber-400 group-hover:underline">browse</span>
                </span>
                <span className="text-[9px] text-slate-500 mt-1">
                  Supports PNG, JPEG, WEBP up to 5MB (Max 4 images)
                </span>
              </div>

              {/* File Preview list */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-slate-850 bg-slate-950/60 p-1.5 flex flex-col gap-1.5 animate-in fade-in zoom-in duration-300"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrls[idx]}
                          alt={file.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 border border-slate-800 text-rose-405 hover:bg-rose-950/80 hover:text-rose-400 hover:border-rose-900/40 flex items-center justify-center transition-all cursor-pointer z-10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="px-1 text-[8px] font-black text-slate-400 truncate uppercase tracking-wider">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-item">
              <Magnetic range={20} actionStrength={0.2}>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || isUploading}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-[#b57a07] hover:from-amber-400 hover:to-[#996403] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-950/30 border border-amber-500/10 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <span>
                    {createMutation.isPending || isUploading
                      ? 'Deploying Arena & Uploading Images...'
                      : 'Create Arena Profile'}
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
