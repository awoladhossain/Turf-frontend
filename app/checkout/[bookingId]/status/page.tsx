'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import paymentService from '@/services/payment.service';
import bookingService from '@/services/booking.service';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useAuth } from '@/hooks/useAuth';
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Calendar,
  MapPin,
  Trophy,
  Loader2,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const { bookingId } = useParams() as { bookingId: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();

  const paymentIntentId = searchParams.get('payment_intent');

  // 1. Fetch booking details to display details on the status page
  const {
    data: booking,
    isLoading: isBookingLoading,
  } = useQuery({
    queryKey: ['booking-detail', bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId && isAuthenticated,
  });

  // 2. Call the verify endpoint to sync Stripe and verify payment status
  const {
    data: payment,
    isLoading: isVerifyLoading,
    error: verifyError,
    refetch: refetchVerification,
  } = useQuery({
    queryKey: ['payment-verification', bookingId, paymentIntentId],
    queryFn: () => paymentService.verifyPaymentStatus(bookingId),
    enabled: !!bookingId && isAuthenticated,
    retry: 1,
    refetchInterval: (query) => {
      const paymentData = query.state.data as any;
      if (paymentData && (paymentData.status === 'PROCESSING' || paymentData.status === 'INITIATED')) {
        return 2000; // Poll every 2 seconds if pending
      }
      return false;
    },
  });

  // Authentication check
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
            <XCircle className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-white">Access Denied</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Please sign in to verify booking payments.
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

  // Verification Processing UI (only if booking is not already confirmed)
  const isSuccess = payment?.status === 'PAID' || booking?.status === 'CONFIRMED' || booking?.status === 'COMPLETED';
  const isPending = !isSuccess && (payment?.status === 'PROCESSING' || payment?.status === 'INITIATED' || booking?.status === 'PENDING');

  if ((isBookingLoading || isVerifyLoading) && !isSuccess) {
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
          <Loader2 className="h-10 w-10 text-emerald-450 animate-spin" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
            Verifying payment with Stripe...
          </p>
        </div>
      </div>
    );
  }

  // Error/Degraded State (only if verification failed AND the booking is not confirmed)
  if (verifyError && !isSuccess) {
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
            <XCircle className="h-7 w-7 text-rose-450" />
          </div>
          <h2 className="text-xl font-black text-white">Verification Failed</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            We were unable to verify the status of your payment. If funds were deducted, please contact support with booking ID: <code className="text-emerald-450 text-[10px] select-all font-mono font-bold bg-slate-950 px-1 py-0.5 rounded">{bookingId}</code>.
          </p>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => refetchVerification()}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:from-emerald-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Verification</span>
            </button>
            <Link
              href="/profile?tab=bookings"
              className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors duration-300 text-center"
            >
              Go to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          background: isSuccess
            ? 'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.05), transparent 50%)'
            : 'radial-gradient(450px circle at var(--spotlight-x) var(--spotlight-y), rgba(239,68,68,0.04), transparent 50%)',
        }}
      />

      <div className="max-w-md mx-auto relative z-10 text-center">
        {/* Status Illustration Card */}
        <div className="bg-[#0d1425]/20 backdrop-blur-2xl rounded-[32px] border border-slate-900 p-8 space-y-6 shadow-2xl">
          {/* Dynamic Status Icon Header */}
          {isSuccess ? (
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Payment Successful!
              </h1>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed">
                Your arena booking is confirmed! We have reserved your chosen time slot. Get ready for the game!
              </p>
            </div>
          ) : isPending ? (
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto animate-pulse">
                <Clock className="h-8 w-8 text-amber-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Payment Processing
              </h1>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed">
                Stripe is processing your transaction. This might take a few moments. We will update the status automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-rose-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Payment Failed
              </h1>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed">
                {payment?.failureReason || 'Your transaction was declined by the card issuer. Please verify your details or use a different card.'}
              </p>
            </div>
          )}

          <div className="h-[1px] bg-slate-900/60 w-full" />

          {/* Receipt/Ticket Summary Block */}
          {booking && (
            <div className="bg-[#050811]/60 p-5 rounded-2xl border border-slate-900 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <Trophy className="h-2.5 w-2.5" />
                  {booking.turf?.name || 'Arena'}
                </span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                  Ticket Receipt
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-605 shrink-0" />
                  <div>
                    <span className="text-[8px] font-black text-slate-550 uppercase tracking-wider block">Game Date</span>
                    <span className="text-slate-205 font-semibold mt-0.5 block">
                      {booking.slot?.date
                        ? new Date(booking.slot.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Confirmed Date'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-605 shrink-0" />
                  <div>
                    <span className="text-[8px] font-black text-slate-550 uppercase tracking-wider block">Scheduled Slot</span>
                    <span className="text-slate-205 font-semibold mt-0.5 block">
                      {booking.slot
                        ? `${booking.slot.startTime} - ${booking.slot.endTime}`
                        : 'Confirmed Slot'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-slate-655 shrink-0" />
                  <div>
                    <span className="text-[8px] font-black text-slate-550 uppercase tracking-wider block">Location</span>
                    <span className="text-slate-205 font-semibold mt-0.5 block truncate max-w-[240px]">
                      {booking.turf?.address}, {booking.turf?.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-slate-900/60 w-full" />

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-550 font-black uppercase tracking-widest text-[8px]">Paid Amount</span>
                <span className="text-emerald-400 font-black text-sm">৳{booking.totalAmount}</span>
              </div>
            </div>
          )}

          {/* Action redirects */}
          <div className="pt-2 flex flex-col gap-3">
            {isSuccess ? (
              <Link
                href="/profile?tab=bookings"
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:from-emerald-500 hover:to-[#195933] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <FileText className="h-4 w-4" />
                <span>View My Bookings</span>
              </Link>
            ) : (
              <button
                onClick={() => router.push(`/checkout/${bookingId}`)}
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:from-emerald-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Checkout</span>
              </button>
            )}

            <button
              onClick={() => router.push('/turfs')}
              className="text-[10px] font-black text-slate-550 uppercase tracking-widest hover:text-white transition-colors duration-300 flex items-center justify-center gap-1 mx-auto"
            >
              <span>Back to Arenas Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
