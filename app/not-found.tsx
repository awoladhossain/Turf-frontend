'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertOctagon, HelpCircle, MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#090d16] overflow-hidden font-jakarta text-white">
      {/* 🌌 মডার্ন ব্যাকগ্রাউন্ড গ্রিড ও ডায়নামিক নিওন গ্লো */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />

      {/* নিওন রেড এবং গ্রিন ব্যাকগ্রাউন্ড গ্লো */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative w-full max-w-xl flex flex-col items-center text-center space-y-10 z-10">
        {/* --- ১. ভিজ্যুয়াল ৪MD৪ এবং নিওন রেড কার্ড --- */}
        <div className="relative flex items-center justify-center w-full h-56 select-none">
          {/* জায়ান্ট নিওন ৪MD৪ টেক্সট */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[12rem] sm:text-[15rem] font-black tracking-tighter text-slate-800/40 leading-none absolute z-0 drop-shadow-[0_0_80px_rgba(255,255,255,0.02)]"
          >
            404
          </motion.h1>

          {/* অ্যানিমেটেড রেড কার্ড / অফসাইড ব্যাজ */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: -40, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="absolute z-10 bg-gradient-to-br from-rose-500 to-rose-700 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest px-5 py-2 rounded-xl shadow-[0_15px_35px_rgba(244,63,94,0.3)] border border-rose-400/40 flex items-center gap-2"
          >
            <AlertOctagon className="h-4 w-4 animate-bounce" />
            Whistle Blown: Offside
          </motion.div>

          {/* ট্যাকটিক্যাল ড্যাশড বক্স (Empty Penalty Box) */}
          <div className="absolute bottom-4 w-72 h-28 border border-b-0 border-dashed border-slate-700/60 rounded-t-[20px] flex items-end justify-center bg-gradient-to-t from-slate-900/40 to-transparent">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <HelpCircle className="h-3 w-3" />
              Empty Pitch / Slot Expired
            </span>
          </div>
        </div>

        {/* --- ২. কন্টেন্ট ও মেসেজিং --- */}
        <div className="space-y-3 max-w-md">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-black tracking-tight"
          >
            You&apos;ve Wandered Out of Bounds!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed"
          >
            আপনি যে পেজ বা টার্ফ বুকিং স্লটটি খুঁজছেন, সেটি আমাদের কৌশলগত শিটে (Tactical Sheet) নেই।
            হয়তো স্লটটি অলরেডি বুক হয়ে গেছে অথবা রেফারির শেষ বাঁশি বেজে গেছে!
          </motion.p>
        </div>

        {/* --- ৩. প্রিমিয়াম গ্লোয়িং অ্যাকশন বাটন --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs pt-2"
        >
          <Link href="/">
            <Button className="group w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 border border-emerald-500/20">
              <MoveLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
              Return to Center Circle
            </Button>
          </Link>
        </motion.div>

        {/* --- ৪. সাইবার ফুটার স্থানাঙ্ক --- */}
        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest pt-4">
          [ SYSTEM_SECTOR: LOST_IN_PLAY // PROTOCOL: 404_MATCH_VOID ]
        </div>
      </div>
    </div>
  );
}
