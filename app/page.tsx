'use client';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarIcon, MapPin, Search, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');

  return (
    <main className="relative min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center p-6 bg-[#f8fafc] overflow-hidden font-jakarta">
      {/* --- Premium Pitch Geometric Background Line Art --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-slate-900 rounded-full" />
        <div className="absolute top-1/4 -left-12 w-[400px] h-[500px] border-2 border-slate-900 rounded-r-[40px]" />
        <div className="absolute top-1/4 -right-12 w-[400px] h-[500px] border-2 border-slate-900 rounded-l-[40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-slate-900" />
      </div>

      {/* --- Hero Content Wrap --- */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-10 pt-8 pb-12">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-[#1e6b3e] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
          <Trophy className="h-3.5 w-3.5" />
          Dhaka&apos;s Premium Turf Booking Platform
        </div>

        {/* Main Hero Typography */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Find Your Pitch, <br className="hidden sm:inline" />
            Book Your{' '}
            <span className="text-[#1e6b3e] bg-gradient-to-r from-[#1e6b3e] to-emerald-500 bg-clip-text text-transparent">
              Game Time
            </span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            ঢাকা শহরের সেরা সব ফুটবল এবং ক্রিকেট টার্ফ খুঁজুন, স্লট চেক করুন এবং বুক করুন এক ক্লিকে।
            নো টেনশন, জাস্ট প্লে!
          </p>
        </div>

        {/* --- Premium Tactical Search Bar --- */}
        <div className="w-full max-w-3xl bg-white p-3 sm:p-4 rounded-2xl sm:rounded-full border border-slate-200/80 shadow-[0_10px_40px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-3">
          {/* Location Dropdown/Input Wrapper */}
          <div className="relative w-full sm:flex-1 group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#1e6b3e] transition-colors" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="কোথায় খেলতে চান? (उदा: বনানী, মিরপুর...)"
              className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-200" />

          {/* Dummy Sport Select Type */}
          <div className="relative w-full sm:w-48 group text-left px-4 h-12 flex items-center gap-3 cursor-pointer">
            <Trophy className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-500">Select Sport</span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-200" />

          {/* Dummy Date Select Type */}
          <div className="relative w-full sm:w-48 group text-left px-4 h-12 flex items-center gap-3 cursor-pointer">
            <Calendar className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-500">Choose Date</span>
          </div>

          {/* Search Button */}
          <Link href="/turfs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-12 sm:px-8 bg-[#1e6b3e] hover:bg-[#16522f] text-white rounded-xl sm:rounded-full font-bold text-sm transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
              <Search className="h-4 w-4" />
              Find Turf
            </Button>
          </Link>
        </div>

        {/* --- Quick Social Trust/Stats --- */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-slate-400 font-semibold text-xs uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#1e6b3e]" />
            <span>10k+ Active Players</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#1e6b3e]" />
            <span>50+ Top Arenas</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#1e6b3e]" />
            <span>Instant Booking</span>
          </div>
        </div>
      </div>
    </main>
  );
}
