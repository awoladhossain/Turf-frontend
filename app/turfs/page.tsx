'use client';

import { Button } from '@/components/ui/button';
import {
  Calendar,
  Check,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Trophy,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

// ডামি টার্ফ ডাটা - রিয়ালিস্টিক প্রফেশনাল ভাইব
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

  // 🛠️ রিয়াল-টাইম ফিল্টারিং লজিক (যা আগের কোডে ভাঙা ছিল)
  const filteredTurfs = useMemo(() => {
    return DUMMY_TURFS.filter((turf) => {
      const matchesSport =
        selectedSport === 'All' || turf.sport.toLowerCase().includes(selectedSport.toLowerCase());
      const matchesPrice = turf.pricePerHour <= priceRange;
      const matchesSearch =
        turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSport && matchesPrice && matchesSearch;
    });
  }, [selectedSport, priceRange, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#f8fafc] font-jakarta py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pitch Mesh Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-900" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-900" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* --- Top Header & Search Control Row --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Explore <span className="text-[#1e6b3e]">Arenas</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              ঢাকা শহরের টপ-রেটেড ফুটবল এবং ক্রিকেট মাঠগুলো বুক করুন নিমিষেই।
            </p>
          </div>

          {/* Real-time Search Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#1e6b3e] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মাঠের নাম বা লোকেশন খুঁজুন..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-[#1e6b3e] focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 w-full sm:w-auto rounded-xl border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              Sort: Popular
            </Button>
          </div>
        </div>

        {/* --- Main Dashboard Body --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* --- Left Premium Filter Sidebar --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[22px] border border-slate-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6 sticky top-24">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-[#1e6b3e]">
                <Filter className="h-4 w-4" />
              </div>
              <h2 className="font-bold text-slate-800 text-sm tracking-tight">Advanced Filter</h2>
            </div>

            {/* Sport Selector */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Select Discipline
              </label>
              <div className="flex flex-col gap-1.5">
                {['All', 'Football', 'Cricket'].map((sport) => {
                  const isSelected = selectedSport === sport;
                  return (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`group h-10 px-3.5 w-full rounded-xl text-left text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e6b3e] text-white shadow-md shadow-emerald-900/10'
                          : 'text-slate-600 bg-transparent hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span>{sport}</span>
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Slider Block */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Max Budget / Hr
                </label>
                <span className="text-xs font-black text-[#1e6b3e] bg-emerald-50/80 border border-emerald-100/50 px-2.5 py-0.5 rounded-lg">
                  ৳{priceRange}
                </span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="1500"
                  max="5000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#1e6b3e] h-1.5 bg-slate-100 rounded-lg cursor-pointer transition-all"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-extrabold tracking-tight">
                <span>৳1,500</span>
                <span>৳5,000</span>
              </div>
            </div>
          </div>

          {/* --- Right Dynamic Turf Card Grid --- */}
          <div className="lg:col-span-3">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTurfs.length > 0 ? (
                  filteredTurfs.map((turf, index) => (
                    <motion.div
                      key={turf.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group bg-white rounded-[22px] border border-slate-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgba(30,107,62,0.04)] overflow-hidden flex flex-col justify-between transition-all duration-300"
                    >
                      {/* Image Header wrapper Container */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={turf.image}
                          alt={turf.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Status Dark Gradient Shading Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                        {/* Premium Status Badge */}
                        <div
                          className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-sm border ${
                            turf.availableToday
                              ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/10'
                              : 'bg-slate-500 text-white border-slate-400'
                          }`}
                        >
                          {turf.availableToday ? '● Available' : 'Fully Booked'}
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-white/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-black text-slate-800 shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 stroke-amber-400" />
                          <span>{turf.rating}</span>
                        </div>
                      </div>

                      {/* Content Wrap Box */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                        <div className="space-y-2">
                          {/* Top Tags line */}
                          <div className="flex items-center gap-2 text-[10px] font-black text-[#1e6b3e] uppercase tracking-widest bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100/50">
                            <Trophy className="h-3 w-3" />
                            <span>{turf.sport}</span>
                            <span className="text-emerald-300">•</span>
                            <span>{turf.size}</span>
                          </div>

                          {/* Arena Name */}
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1e6b3e] transition-colors line-clamp-1 tracking-tight">
                            {turf.name}
                          </h3>

                          {/* Location Pin info */}
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                            <span className="line-clamp-1">{turf.location}</span>
                          </div>
                        </div>

                        {/* Middle Line Spacer separator */}
                        <div className="h-px bg-slate-100/80 w-full" />

                        {/* Price & Action Interactive Row */}
                        <div className="flex items-center justify-between pt-0.5">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Rate Per Hour
                            </p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                              ৳{turf.pricePerHour}
                            </p>
                          </div>

                          <Link href={`/turfs/${turf.id}`}>
                            <Button className="h-10 bg-[#1e6b3e] hover:bg-[#16522f] text-white hover:text-white text-xs font-bold px-4.5 rounded-xl shadow-md shadow-emerald-900/5 transition-all active:scale-[0.97] cursor-pointer flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Book Slot
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  /* Smooth Empty Search Fallback State UI */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full bg-white border border-dashed border-slate-200 rounded-[22px] p-12 text-center flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      No arenas match your filters
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs">
                      অন্য কোনো খেলা বা প্রাইস বাজেট বাড়িয়ে সার্চ করে ট্রাই করুন।
                    </p>
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
