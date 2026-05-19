'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Calendar, Filter, MapPin, Search, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const DUMMY_TURFS = [
  {
    id: 1,
    name: 'المدينة - Al Madina Sports Arena',
    location: 'Bashundhara R/A, Dhaka',
    sport: 'Football',
    size: '7-a-side',
    rating: 4.9,
    reviews: 124,
    pricePerHour: 3500,
    image:
      'https://images.unsplash.com/photo-1510563800743-aed2364902b8?auto=format&fit=crop&q=80&w=600',
    availableToday: true,
  },
  {
    id: 2,
    name: 'Dhaka Arena International',
    location: 'Mirpur 11, Dhaka',
    sport: 'Football',
    size: '5-a-side',
    rating: 4.7,
    reviews: 89,
    pricePerHour: 2800,
    image:
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=600',
    availableToday: true,
  },
  {
    id: 3,
    name: 'The Pavilion Turf & Lounge',
    location: 'Banani, Dhaka',
    sport: 'Cricket',
    size: 'Net Practice',
    rating: 4.8,
    reviews: 56,
    pricePerHour: 2200,
    image:
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600',
    availableToday: false,
  },
];

export default function TurfsPage() {
  const [selectedSport, setSelectedSport] = useState('All');
  const [priceRange, setPriceRange] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // 🛠️ কম্বাইন্ড ফিল্টারিং এবং সর্টিং লজিক
  const processedTurfs = useMemo(() => {
    let result = DUMMY_TURFS.filter((turf) => {
      const matchesSport =
        selectedSport === 'All' || turf.sport.toLowerCase() === selectedSport.toLowerCase();
      const matchesPrice = turf.pricePerHour <= priceRange;
      const matchesSearch =
        turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSport && matchesPrice && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedSport, priceRange, searchQuery, sortBy]);

  return (
    <div className="min-h-screen w-full bg-[#090d16] font-jakarta py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* 🌌 মডার্ন ব্যাকগ্রাউন্ড গ্রিড ও অরবিট গ্লো ইফেক্ট */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#1e6b3e]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* --- Header সেকশন --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit mb-3 border border-emerald-500/20">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Slot Hub
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl text-white">
              Explore{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Arenas
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              ঢাকা শহরের বেস্ট কন্ডিশন পিচগুলো ভেরিফাইড রিভিউ দেখে বুক করুন।
            </p>
          </div>

          {/* সার্চ ইনপুট */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="মাঠ বা লোকেশনের নাম লিখুন..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-800 bg-slate-950/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500 shadow-sm"
            />
          </div>
        </div>

        {/* --- মডার্ন সর্টিং সেকশন (চিপস ডিজাইন) --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
            Sort By
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'popular', label: '⭐ Top Rated' },
              { id: 'price-asc', label: '৳ Price: Low to High' },
              { id: 'price-desc', label: '৳ Price: High to Low' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-4 h-9 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  sortBy === option.id
                    ? 'bg-gradient-to-r from-emerald-600 to-[#1e6b3e] border-emerald-500/20 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- মেইন কন্টেন্ট লেআউট --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* --- বাম পাশের অ্যাডভান্সড ফিল্টার সাইডবার --- */}
          <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md p-6 rounded-[24px] border border-slate-800/80 shadow-xl space-y-6 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-4">
              <Filter className="h-4 w-4 text-emerald-400" />
              <h2 className="font-bold text-white text-sm tracking-tight">Filter Settings</h2>
            </div>

            {/* স্পোর্টস ডিসিপ্লিন */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                Discipline
              </label>
              <div className="grid grid-cols-1 gap-2">
                {['All', 'Football', 'Cricket'].map((sport) => {
                  const isSelected = selectedSport === sport;
                  return (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`h-11 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'text-slate-400 bg-slate-950/20 border-slate-800 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span>{sport} Arenas</span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* প্রাইস স্লাইডার */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Max Budget / Hr
                </label>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  ৳{priceRange}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>৳1,500</span>
                <span>৳5,000</span>
              </div>
            </div>
          </div>

          {/* --- ডান পাশের রি-ডিজাইন করা লাক্সারি টার্ফ কার্ড গ্রিড --- */}
          <div className="lg:col-span-3">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {processedTurfs.length > 0 ? (
                  processedTurfs.map((turf) => (
                    <motion.div
                      key={turf.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="group bg-slate-900/40 backdrop-blur-md rounded-[24px] border border-slate-800/80 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_20px_50px_rgba(30,107,62,0.08)] hover:border-slate-700 transition-all duration-300"
                    >
                      {/* ইমেজ এবং টপ ফ্ল্যাশের কন্টেইনার */}
                      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                        <img
                          src={turf.image}
                          alt={turf.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        {/* গ্লসি শ্যাডো ওভারলে */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                        {/* লাইভ এভেইলেবিলিটি পালস ব্যাজ */}
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/60 shadow-sm text-[10px] font-black uppercase tracking-wider">
                          <span
                            className={`h-2 w-2 rounded-full ${turf.availableToday ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}
                          />
                          <span
                            className={turf.availableToday ? 'text-emerald-400' : 'text-slate-400'}
                          >
                            {turf.availableToday ? 'Available Today' : 'Full'}
                          </span>
                        </div>

                        {/* প্রিমিয়াম রেটিং ট্যাগ */}
                        <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold text-white shadow-sm border border-slate-800">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{turf.rating}</span>
                        </div>
                      </div>

                      {/* কার্ড বডি কন্টেন্ট */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          {/* ক্যাটাগরি ও সাইজ চিপস */}
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                              <Trophy className="h-3 w-3" />
                              {turf.sport}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800/80">
                              {turf.size}
                            </span>
                          </div>

                          {/* মাঠের নাম */}
                          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1">
                            {turf.name}
                          </h3>

                          {/* লোকেশন পিন */}
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                            <span className="line-clamp-1">{turf.location}</span>
                          </div>
                        </div>

                        {/* ডিভাইডার লাইন */}
                        <div className="h-px bg-slate-800/60 w-full" />

                        {/* প্রাইস ও বুকিং অ্যাকশন রো */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                              Hourly Rate
                            </p>
                            <p className="text-2xl font-black text-white tracking-tight">
                              ৳{turf.pricePerHour}
                              <span className="text-xs text-slate-500 font-normal"> /hr</span>
                            </p>
                          </div>

                          <Link href={`/turfs/${turf.id}`}>
                            <Button className="h-11 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs px-5 rounded-xl shadow-md shadow-emerald-950/50 active:scale-95 border border-emerald-500/20 transition-all cursor-pointer flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Book Slot
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  /* মডার্ন এম্পটি স্টেট */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full bg-slate-900/20 border border-dashed border-slate-800 rounded-[24px] p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-sm"
                  >
                    <div className="p-4 bg-slate-900/60 text-slate-500 rounded-2xl border border-slate-800">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">No arenas found</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        আপনার ফিল্টার বা বাজেট কিছুটা বাড়িয়ে অন্য কোনো ক্যাটাগরিতে সার্চ করে
                        দেখুন।
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
