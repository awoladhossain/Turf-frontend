'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, ShieldCheck, Trophy, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSport, setSelectedSport] = useState('Football');

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#090d16] overflow-hidden font-jakarta text-white">
      {/* 🌌 মডার্ন ডায়নামিক ব্যাকগ্রাউন্ড লাইট ও গ্লো ইফেক্ট */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />

      {/* অ্যানিমেটেড নিওন অরবিটস */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1e6b3e]/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"
      />

      {/* --- হিরো কন্টেন্ট র্যাপার --- */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-12 pt-12 pb-16">
        {/* টপ ফ্লোটিং ফ্ল্যাশ ব্যাজ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md shadow-lg shadow-emerald-950/50"
        >
          <Zap className="h-3.5 w-3.5 fill-emerald-400 animate-pulse" />
          Dhaka&apos;s Next-Gen Turf Booking Platform
        </motion.div>

        {/* মেইন টাইপোগ্রাফি */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.1] text-white"
          >
            Find Your Pitch, <br />
            Own Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#2ec46b] to-teal-400 drop-shadow-[0_4px_20px_rgba(46,196,107,0.15)]">
              Game Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            ঢাকা শহরের সেরা সব ভেরিফাইড ফুটবল এবং ক্রিকেট টার্ফ খুঁজুন, স্লট চেক করুন এবং কনফার্ম
            করুন মাত্র ১ মিনিটে।
            <span className="text-white font-bold"> নো টেনশন, জাস্ট প্লে!</span>
          </motion.p>
        </div>

        {/* --- প্রিমিয়াম ট্যাকটিক্যাল সার্চ বার (Glassmorphism Luxury Row) --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-full border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-4 sm:gap-2"
        >
          {/* লোকেশন ফিল্ড */}
          <div className="relative w-full sm:flex-1 group px-2">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="কোথায় খেলতে চান? (উদা: বনানী, মিরপুর...)"
              className="w-full h-12 pl-11 pr-4 bg-transparent outline-none text-sm font-semibold text-white placeholder-slate-500 focus:placeholder-slate-400 transition-all"
            />
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          {/* স্পোর্ট সিলেক্টর টগল */}
          <div className="relative w-full sm:w-44 px-4 h-12 flex items-center justify-between bg-slate-950/40 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-800 sm:border-0">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-slate-500" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-300 outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="Football" className="bg-[#090d16] text-white">
                  Football
                </option>
                <option value="Cricket" className="bg-[#090d16] text-white">
                  Cricket
                </option>
              </select>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          {/* ডেট চুজ ফিল্ড */}
          <div className="relative w-full sm:w-44 px-4 h-12 flex items-center gap-3 bg-slate-950/40 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-800 sm:border-0 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors">
            <Calendar className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-semibold">Today / Tomorrow</span>
          </div>

          {/* গ্লোয়িং সার্চ বাটন */}
          <Link href="/turfs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-13 sm:px-10 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl sm:rounded-full font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 border border-emerald-500/20">
              <Search className="h-4 w-4 stroke-[2.5]" />
              Find Arenas
            </Button>
          </Link>
        </motion.div>

        {/* --- কুইক সোশাল ট্রাস্ট / মেম্বারশিপ স্ট্যাটাস --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-6 text-slate-500 font-bold text-xs uppercase tracking-widest border-t border-slate-900/60 w-full max-w-3xl"
        >
          <div className="flex items-center gap-2.5 hover:text-slate-400 transition-colors">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <span>10K+ Active Players</span>
          </div>

          <div className="flex items-center gap-2.5 hover:text-slate-400 transition-colors">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
              <Trophy className="h-4 w-4 text-emerald-400" />
            </div>
            <span>50+ Top Arenas In Dhaka</span>
          </div>

          <div className="flex items-center gap-2.5 hover:text-slate-400 transition-colors">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <span>Instant Secure Lock</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
