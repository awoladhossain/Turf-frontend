'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Jenkins, Sentry বা প্রোডাকশন লগিং সিস্টেমে ব্যাকএন্ড ট্র্যাকিংয়ের জন্য
    console.error('Captured Runtime Error:', error);
  }, [error]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#090d16] overflow-hidden font-jakarta text-white">
      {/* 🌌 ব্যাকগ্রাউন্ড মডার্ন সাইরেন গ্রিড এবং নিওন অ্যাম্বার গ্লো */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />

      {/* ডাইনামিক পালসিং এরর গ্লো */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"
      />

      {/* --- মডার্ন প্রিমিয়াম গ্লাস কার্ড --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-[460px] bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-[28px] border border-slate-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.4)] text-center z-10"
      >
        {/* গ্লোয়িং নিওন ওয়ার্নিং ব্যাজ */}
        <div className="inline-flex relative mb-6">
          <span className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-md animate-pulse" />
          <div className="relative bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30 text-amber-400">
            <AlertTriangle className="h-8 w-8 stroke-[2.5]" />
          </div>
        </div>

        {/* টাইপোগ্রাফি কন্টেন্ট */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          System Interrupted!
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-3 max-w-sm mx-auto font-medium leading-relaxed">
          অনাকাঙ্ক্ষিত একটি রানটাইম এরর এর কারণে সিস্টেম সাময়িকভাবে বাধাগ্রস্ত হয়েছে। আমাদের
          সেন্ট্রাল ডেভ-টিমকে অলরেডি নোটিফাই করা হয়েছে।
        </p>

        {/* --- ইন্টারেক্টিভ অ্যাকশন বাটনস --- */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button
            onClick={() => reset()}
            className="h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20 active:scale-95"
          >
            <RefreshCw className="h-4 w-4 stroke-[2.5]" />
            Try Again
          </Button>

          <Link href="/" className="w-full">
            <Button
              variant="ghost"
              className="w-full h-12 border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* --- ডেভেলপারদের জন্য টেকনিক্যাল ডাইজেস্ট (Logs) --- */}
        {error.digest ? (
          <div className="mt-8 pt-5 border-t border-slate-900 flex items-center justify-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <Terminal className="h-3.5 w-3.5 text-slate-600" />
            <span>Digest Code: {error.digest}</span>
          </div>
        ) : (
          <div className="mt-8 pt-5 border-t border-slate-900 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            [ Execution Status: Error_Caught_Safe ]
          </div>
        )}
      </motion.div>
    </div>
  );
}
