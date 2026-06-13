'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import bookingService from '@/services/booking.service';
import paymentService from '@/services/payment.service';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  ArrowLeft,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

// Load Stripe publishable key outside component to prevent multiple initializations
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function CheckoutPage() {
  const { bookingId } = useParams() as { bookingId: string };
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const orbitRef = React.useRef<HTMLDivElement>(null);

  // 1. Fetch booking details
  const {
    data: booking,
    isLoading: isBookingLoading,
    error: bookingError,
  } = useQuery({
    queryKey: ['booking-detail', bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId && isAuthenticated,
  });

  // 2. Fetch payment intent client secret once booking is loaded and pending
  const {
    data: paymentIntent,
    isLoading: isPaymentLoading,
    error: paymentError,
  } = useQuery({
    queryKey: ['payment-intent', bookingId],
    queryFn: () => paymentService.createPaymentIntent(bookingId),
    enabled: !!booking && booking.status === 'PENDING' && isAuthenticated,
  });

  const isLoading = isBookingLoading || isPaymentLoading;

  // GSAP animation for floating orb
  useEffect(() => {
    if (!booking || isLoading || !orbitRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(orbitRef.current, {
        y: '+=20',
        x: '-=15',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, pageContainerRef);
    return () => ctx.revert();
  }, [booking, isLoading]);

  // If already paid/confirmed, redirect to status page
  useEffect(() => {
    if (booking && booking.status !== 'PENDING') {
      router.push(`/checkout/${bookingId}/status`);
    }
  }, [booking, bookingId, router]);

  // Authentication protection
  if (!isAuthenticated) {
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
            Please log in to make payments on bookings.
          </p>
          <Link
            href="/login"
            className="block w-full py-2.5 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Loading States
  if (isLoading) {
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
            Configuring Checkout Session...
          </p>
        </div>
      </div>
    );
  }

  // Error States
  if (bookingError || paymentError || !booking || !paymentIntent) {
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
        <div className="relative z-10 text-center space-y-6 max-w-md p-8 rounded-[32px] bg-[#0d1425]/30 border border-slate-900 backdrop-blur-3xl shadow-2xl">
          <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-white">Checkout Initialization Failed</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            There was an issue initializing your transaction. The slot may have expired or is already
            paid.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="w-full h-11 bg-[#0d1425] border border-slate-800 hover:border-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  // Stripe options appearance configuration
  const elementsOptions = {
    clientSecret: paymentIntent.clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#10b981', // Emerald primary
        colorBackground: '#0d1425',
        colorText: '#ffffff',
        colorTextPlaceholder: '#4b5563',
        colorDanger: '#f43f5e',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
      rules: {
        '.Input': {
          border: '1px solid #1e293b',
          boxShadow: 'none',
          backgroundColor: '#050811',
        },
        '.Input:focus': {
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.05)',
        },
      },
    },
  };

  const formattedDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Pending Date';

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

      {/* Floating Animated Neon Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-400 transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Booking Overview Card (Left - 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 space-y-6 shadow-xl">
              <div className="border-b border-slate-900/60 pb-3 flex items-center justify-between">
                <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                  Booking Details
                </h2>
                <span className="text-[8px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full select-none">
                  Unpaid
                </span>
              </div>

              {/* Booking Info Blocks */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <Trophy className="h-2.5 w-2.5" />
                    {booking.turf?.name || 'Selected Arena'}
                  </span>
                  <p className="text-xs font-black text-white truncate max-w-[220px]">
                    {booking.turf?.name || 'Arena Detail'}
                  </p>
                </div>

                <div className="h-[1px] bg-slate-900/60 w-full" />

                <div className="space-y-3.5 text-xs font-bold text-slate-400">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-slate-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black text-slate-505 uppercase tracking-wider leading-none">
                        Game Date
                      </p>
                      <p className="text-white font-semibold mt-1">
                        {booking.slot?.date
                          ? new Date(booking.slot.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-slate-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black text-slate-505 uppercase tracking-wider leading-none">
                        Scheduled Slot
                      </p>
                      <p className="text-white font-semibold mt-1">
                        {booking.slot
                          ? `${booking.slot.startTime} - ${booking.slot.endTime}`
                          : 'Pending Slot'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4.5 w-4.5 text-slate-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black text-slate-505 uppercase tracking-wider leading-none">
                        Location
                      </p>
                      <p className="text-white font-semibold mt-1 truncate max-w-[200px]">
                        {booking.turf?.address}, {booking.turf?.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-900/60 w-full" />

                {/* Amount info */}
                <div className="bg-[#050811]/60 p-4 rounded-2xl border border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest">
                      Total Cost
                    </span>
                    <p className="text-lg font-black text-emerald-400 tracking-tight">
                      ৳{booking.totalAmount}
                    </p>
                  </div>
                  <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-950/80 border border-slate-900 px-2 py-1 rounded-md shadow-sm">
                    Guaranteed Rate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Checkout Form (Right - 3 Columns) */}
          <div className="lg:col-span-3 bg-[#0d1425]/20 backdrop-blur-2xl rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-2">
                <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
                Stripe Secure Payment
              </h2>
            </div>

            {/* Elements container */}
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm
                amount={paymentIntent.amount}
                currency={paymentIntent.currency}
                bookingId={bookingId}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
