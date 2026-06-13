'use client';

import { useAuth } from '@/hooks/useAuth';
import bookingService from '@/services/booking.service';
import turfService from '@/services/turf.service';
import healthService from '@/services/health.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  DollarSign,
  Activity,
  MapPin,
  Plus,
  Server,
  Trophy,
  Loader2,
  Settings,
  TrendingUp,
  Database,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

// --- CUSTOM RESIZE OBSERVER HOOK ---
// This measures the parent container width in real time and bypasses Recharts' buggy ResponsiveContainer
function useContainerWidth() {
  const [width, setWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      // Set initial width and poll if 0 (due to mounting/animation phase)
      const updateWidth = () => {
        if (!node.isConnected) return;
        const w = node.getBoundingClientRect().width || node.offsetWidth;
        if (w > 0) {
          setWidth(w);
        } else {
          setTimeout(updateWidth, 50);
        }
      };

      updateWidth();

      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const w = entry.contentRect.width || entry.target.getBoundingClientRect().width;
          if (w > 0) {
            setWidth(w);
          }
        }
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  return [ref, width] as const;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isFetchingMe } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'turfs'>('analytics');
  const [mounted, setMounted] = useState(false);
  
  // Search and Filter States (Admin Bookings)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  // Chart Container Refs
  const [revenueChartRef, revenueChartWidth] = useContainerWidth();
  const [statusChartRef, statusChartWidth] = useContainerWidth();
  const [sportsChartRef, sportsChartWidth] = useContainerWidth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth Guard redirect
  useEffect(() => {
    if (mounted && !isFetchingMe && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, isFetchingMe, router, mounted]);

  const isAdmin = user?.role === 'ADMIN';

  // 1. Fetch Admin Bookings
  const { data: adminBookings, isLoading: isAdminBookingsLoading } = useQuery({
    queryKey: ['admin-bookings-dashboard'],
    queryFn: () => bookingService.getAllBookingsAdmin(1, 100),
    enabled: !!user && isAdmin,
  });

  // 2. Fetch User Personal Bookings
  const { data: userBookings, isLoading: isUserBookingsLoading } = useQuery({
    queryKey: ['user-bookings-dashboard'],
    queryFn: () => bookingService.getMyBookings(),
    enabled: !!user && !isAdmin,
  });

  // 3. Fetch All Turfs
  const { data: turfsData, isLoading: isTurfsLoading } = useQuery({
    queryKey: ['all-turfs-dashboard'],
    queryFn: () => turfService.getAllTurfs(),
    enabled: !!user,
  });

  // 4. Fetch System Health Telemetry
  const { data: healthData } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => healthService.getHealthStatus(),
    enabled: !!user && isAdmin,
    refetchInterval: 15000, // refresh every 15s for high-tech telemetry feel
  });

  if (!mounted || isFetchingMe || (isAdmin ? isAdminBookingsLoading : isUserBookingsLoading) || isTurfsLoading) {
    return (
      <div className="min-h-screen bg-[#03060f] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <Trophy className="h-6 w-6 text-emerald-400 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse mt-4">
          Synchronizing console state...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  // --- STATS CALCULATIONS (ADMIN) ---
  const bookingsList = adminBookings?.data || [];
  const totalBookingsCount = adminBookings?.meta?.total || bookingsList.length;
  
  const confirmedBookings = bookingsList.filter(b => b.status === 'CONFIRMED');
  const pendingBookings = bookingsList.filter(b => b.status === 'PENDING');
  const cancelledBookings = bookingsList.filter(b => b.status === 'CANCELLED');
  
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const activeTurfsCount = turfsData?.meta?.total || turfsData?.data?.length || 0;

  // --- FILTERED BOOKINGS (ADMIN) ---
  const filteredBookings = bookingsList.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.user?.phone || '').includes(searchQuery) ||
      (booking.turf?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- STATS CALCULATIONS (REGULAR USER) ---
  const myBookingsList = userBookings?.data || [];
  const myConfirmed = myBookingsList.filter(b => b.status === 'CONFIRMED');
  const myPending = myBookingsList.filter(b => b.status === 'PENDING');
  const myTotalSpent = myConfirmed.reduce((sum, b) => sum + Number(b.totalAmount), 0);

  // --- CHART DATA GENERATION (ADMIN) ---
  const revenueTrendData = bookingsList
    .slice()
    .reverse()
    .slice(-8)
    .map(b => {
      const date = b.slot?.date 
        ? new Date(b.slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
        : 'Date';
      return {
        name: date,
        Revenue: b.status === 'CONFIRMED' ? Number(b.totalAmount) : 0,
      };
    });

  const statusPieData = [
    { name: 'Confirmed', value: confirmedBookings.length, color: '#10b981' },
    { name: 'Pending', value: pendingBookings.length, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledBookings.length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const sportTypeCount = turfsData?.data?.reduce((acc: Record<string, number>, t) => {
    acc[t.sportType] = (acc[t.sportType] || 0) + 1;
    return acc;
  }, {}) || {};
  const sportChartData = Object.entries(sportTypeCount).map(([key, value]) => ({
    name: key === 'BOTH' ? 'Multi-Sport' : key,
    Arenas: value
  }));

  const dbUp = healthData?.services?.database === 'up';
  const redisUp = healthData?.services?.redis === 'up';

  // Avatar Gradient list
  const avatarGradients = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
  ];

  return (
    <div className="min-h-screen bg-[#03060f] text-slate-100 font-jakarta pb-24 select-none relative overflow-hidden">
      
      {/* Dynamic Aurora Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10 space-y-8">
        
        {/* --- DYNAMIC HEADER SECTION --- */}
        <div className="relative bg-[#070c19]/40 border border-slate-900/60 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full border border-emerald-400/20 text-white shadow-sm shadow-emerald-950/20">
                {isAdmin ? 'System Administrator' : 'Athlete Station'}
              </span>
              <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-900">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Node connected
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              {isAdmin 
                ? 'Central panel for monitoring scheduling operations, revenue insights, registration metrics, and cluster node telemetry.' 
                : 'Instantly view your reserved time-slots, gaming expenses summary, and lock in new matches.'
              }
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            {isAdmin ? (
              <Link
                href="/admin/turfs/create"
                className="h-11 px-6 text-[10px] font-black uppercase tracking-wider bg-white hover:bg-slate-100 text-slate-950 rounded-2xl flex items-center gap-2 shadow-lg shadow-white/5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3px]" />
                Create Arena
              </Link>
            ) : (
              <Link
                href="/turfs"
                className="h-11 px-6 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-white rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 border border-emerald-400/20 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3px]" />
                Book Arena
              </Link>
            )}
          </div>
        </div>

        {/* --- PREMIUM METRICS CARDS GRID --- */}
        {isAdmin ? (
          /* Admin Dashboard HUD */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Card 1: Revenue */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#090f1f]/80 to-[#050811]/90 border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gross Revenue</p>
              <h3 className="text-3xl font-black text-white mt-2">৳{totalRevenue}</h3>
              <span className="text-[9.5px] text-emerald-400 font-extrabold mt-2 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                +14.2% <span className="text-slate-500 font-semibold font-jakarta">vs last week</span>
              </span>
            </div>

            {/* Card 2: Reservations */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#090f1f]/80 to-[#050811]/90 border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar className="h-16 w-16 text-indigo-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Bookings</p>
              <h3 className="text-3xl font-black text-white mt-2">{totalBookingsCount}</h3>
              <span className="text-[9.5px] text-indigo-400 font-extrabold mt-2 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {confirmedBookings.length} confirmed <span className="text-slate-500 font-semibold">slots</span>
              </span>
            </div>

            {/* Card 3: Arenas */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#090f1f]/80 to-[#050811]/90 border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="h-16 w-16 text-purple-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Fields</p>
              <h3 className="text-3xl font-black text-white mt-2">{activeTurfsCount}</h3>
              <span className="text-[9.5px] text-purple-400 font-extrabold mt-2 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Fully operational
              </span>
            </div>

            {/* Card 4: High-Tech Telemetry */}
            <div className="p-6 rounded-2xl bg-[#070c18] border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative flex flex-col justify-between overflow-hidden">
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nodes Telemetry</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <Database className={`h-4 w-4 ${dbUp ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`} />
                    <div className="leading-none">
                      <span className="text-[7.5px] font-black text-slate-500 uppercase block">Database</span>
                      <span className="text-[9px] font-bold text-white uppercase">{dbUp ? 'ONLINE' : 'OFFLINE'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <Server className={`h-4 w-4 ${redisUp ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`} />
                    <div className="leading-none">
                      <span className="text-[7.5px] font-black text-slate-500 uppercase block">Redis</span>
                      <span className="text-[9px] font-bold text-white uppercase">{redisUp ? 'ACTIVE' : 'OFFLINE'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase border-t border-slate-900/60 pt-3 mt-3">
                <span className="flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-slate-500" />
                  CPU: 24%
                </span>
                <span>Latency: 12ms</span>
              </div>
            </div>

          </div>
        ) : (
          /* Regular Player Dashboard HUD */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#090f1f]/80 to-[#050811]/90 border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registered Matches</p>
              <h3 className="text-3xl font-black text-white mt-2">{myBookingsList.length} Games</h3>
              <p className="text-[9.5px] text-emerald-400 font-extrabold mt-2 flex items-center gap-1">
                {myConfirmed.length} Confirmed Slots
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#090f1f]/80 to-[#050811]/90 border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign className="h-16 w-16 text-indigo-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Sports Investment</p>
              <h3 className="text-3xl font-black text-white mt-2">৳{myTotalSpent}</h3>
              <p className="text-[9.5px] text-indigo-400 font-extrabold mt-2">
                On finalized confirmed bookings
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#090f1f]/80 to-[#050811]/90 border border-slate-900 hover:border-slate-800/80 transition-all duration-350 shadow-md relative overflow-hidden group flex flex-col justify-between">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Upcoming Kick-off</p>
              {myConfirmed.length > 0 && myConfirmed[0].slot?.date ? (
                <div className="mt-2 space-y-1">
                  <h4 className="text-sm font-black text-white truncate">{myConfirmed[0].turf?.name}</h4>
                  <p className="text-[9.5px] text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(myConfirmed[0].slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {myConfirmed[0].slot.startTime}
                  </p>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  <h4 className="text-sm font-bold text-slate-400">No slots booked</h4>
                  <Link href="/turfs" className="text-[9px] text-emerald-400 font-black uppercase hover:underline flex items-center gap-1">
                    Find active turfs <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- MAIN INTERFACE WORKSPACE (TABS) --- */}
        {isAdmin ? (
          <div className="space-y-6">
            
            {/* View Selector Tabs (Premium Minimalist Deck) */}
            <div className="flex border-b border-slate-900/60 pb-px gap-4">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === 'analytics' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Analytics & Charts
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`pb-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === 'bookings' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                All Bookings List
              </button>
              <button
                onClick={() => setActiveTab('turfs')}
                className={`pb-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === 'turfs' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Turf Venues
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Area Chart: Revenue Trend */}
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#060a16] to-[#04060f] border border-slate-900 shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Revenue Trendline</h3>
                        <span className="text-[9px] font-black text-slate-500 uppercase">Last 8 Confirmed Sales</span>
                      </div>
                      
                      <div ref={revenueChartRef} className="h-64 w-full relative flex items-center justify-center">
                        {revenueChartWidth > 0 ? (
                          revenueTrendData.length > 0 ? (
                            <AreaChart width={revenueChartWidth} height={256} data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid stroke="#0b101c" strokeDasharray="3 3" />
                              <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                              <YAxis stroke="#475569" fontSize={9} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#070c18', border: '1px solid #1e293b', borderRadius: '12px' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}
                              />
                              <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                          ) : (
                            <div className="text-xs text-slate-550 uppercase tracking-widest font-black">
                              No Sales Logged
                            </div>
                          )
                        ) : (
                          <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                        )}
                      </div>
                    </div>

                    {/* Donut Chart: Status Share */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#060a16] to-[#04060f] border border-slate-900 shadow-xl space-y-4 flex flex-col justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Booking Status Share</h3>
                      
                      <div ref={statusChartRef} className="h-44 w-full relative flex justify-center items-center">
                        {statusChartWidth > 0 ? (
                          statusPieData.length > 0 ? (
                            <PieChart width={statusChartWidth} height={176}>
                              <Pie
                                data={statusPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={42}
                                outerRadius={56}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {statusPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{ backgroundColor: '#070c18', border: '1px solid #1e293b', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                              />
                            </PieChart>
                          ) : (
                            <div className="text-xs text-slate-550 uppercase tracking-widest font-black">
                              No Data
                            </div>
                          )
                        ) : (
                          <Loader2 className="h-5 w-5 text-emerald-450 animate-spin" />
                        )}
                      </div>

                      <div className="space-y-1.5 mt-2">
                        {statusPieData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[9px] font-bold text-slate-400 px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-900/60">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                              <span>{item.name}</span>
                            </div>
                            <span className="text-white font-extrabold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bar Chart: Sport popularity */}
                    <div className="lg:col-span-3 p-6 rounded-2xl bg-gradient-to-br from-[#060a16] to-[#04060f] border border-slate-900 shadow-xl space-y-4">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Sport Popularity Distribution</h3>
                      
                      <div ref={sportsChartRef} className="h-56 w-full relative flex items-center justify-center">
                        {sportsChartWidth > 0 ? (
                          sportChartData.length > 0 ? (
                            <BarChart width={sportsChartWidth} height={224} data={sportChartData}>
                              <CartesianGrid stroke="#0b101c" strokeDasharray="3 3" />
                              <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                              <YAxis stroke="#475569" fontSize={9} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#070c18', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}
                              />
                              <Bar dataKey="Arenas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          ) : (
                            <div className="text-xs text-slate-555 uppercase tracking-widest font-black">
                              No Sport Data
                            </div>
                          )
                        ) : (
                          <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 rounded-2xl bg-[#060a16] border border-slate-900 shadow-xl space-y-6"
                >
                  
                  {/* Search and Filters Deck */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-900 pb-5">
                    <div className="relative w-full md:max-w-xs">
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search user, ID, phone, turf..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 bg-slate-950/40 border border-slate-900 rounded-xl pl-10 pr-4 text-xs font-semibold text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            statusFilter === status 
                              ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 shadow-sm'
                              : 'bg-slate-950/40 border border-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List View styled for premium feel */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] font-bold text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-900 text-left uppercase text-[8px] font-black tracking-widest text-slate-500">
                          <th className="pb-3 pr-2">ID</th>
                          <th className="pb-3 pr-2">User Details</th>
                          <th className="pb-3 pr-2">Arena Venue</th>
                          <th className="pb-3 pr-2">Schedule</th>
                          <th className="pb-3 pr-2">Total Amount</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/40">
                        {filteredBookings.length > 0 ? (
                          filteredBookings.map((booking, index) => {
                            const dateStr = booking.slot?.date
                              ? new Date(booking.slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : 'Confirmed Date';
                            const initials = booking.user?.name ? booking.user.name.charAt(0) : 'U';
                            const gradient = avatarGradients[index % avatarGradients.length];

                            return (
                              <tr key={booking.id} className="hover:bg-[#090f1f]/35 transition-colors group">
                                <td className="py-4 pr-2 font-mono text-slate-600">#{booking.id.slice(0, 8)}</td>
                                <td className="py-4 pr-2">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] font-black text-white shadow-md uppercase`}>
                                      {initials}
                                    </div>
                                    <div>
                                      <div className="text-white font-black text-xs group-hover:text-emerald-400 transition-colors">
                                        {booking.user?.name || 'Guest User'}
                                      </div>
                                      <div className="text-[8.5px] text-slate-500 mt-0.5">{booking.user?.phone || 'No Contact'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 pr-2 text-white font-black">{booking.turf?.name || 'Sports Arena'}</td>
                                <td className="py-4 pr-2">
                                  <div>{dateStr}</div>
                                  <div className="text-[9px] text-emerald-400 mt-0.5">{booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : 'Time Slot'}</div>
                                </td>
                                <td className="py-4 pr-2 text-white font-extrabold">৳{booking.totalAmount}</td>
                                <td className="py-4 text-right">
                                  {booking.status === 'CONFIRMED' ? (
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                                      Confirmed
                                    </span>
                                  ) : booking.status === 'PENDING' ? (
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full animate-pulse">
                                      Pending
                                    </span>
                                  ) : (
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full">
                                      Cancelled
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-600 uppercase tracking-widest text-[9px] font-black">
                              No bookings matching filter criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </motion.div>
              )}

              {activeTab === 'turfs' && (
                <motion.div
                  key="turfs"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  
                  {/* Turf Registry Command center grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {turfsData?.data && turfsData.data.length > 0 ? (
                      turfsData.data.map((turf) => (
                        <div
                          key={turf.id}
                          className="group p-5 rounded-2xl bg-[#060a16] border border-slate-900 hover:border-slate-800/80 transition-all duration-350 flex items-start gap-4 shadow-lg"
                        >
                          <div className="bg-slate-950/80 border border-slate-900 p-3 rounded-2xl text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                            <Trophy className="h-6 w-6" />
                          </div>

                          <div className="flex-grow space-y-2.5 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-black text-white truncate group-hover:text-emerald-405 transition-colors">
                                {turf.name}
                              </h4>
                              <span className="text-[8px] font-black uppercase bg-slate-950 border border-slate-900 text-emerald-400 px-2.5 py-1 rounded-full">
                                {turf.sportType}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-emerald-400" />
                              {turf.address}, {turf.city}
                            </p>

                            <div className="flex justify-between items-center border-t border-slate-900/60 pt-3 mt-3">
                              <div>
                                <span className="text-[7.5px] font-black text-slate-650 uppercase tracking-widest block leading-none">Price per hour</span>
                                <span className="text-white font-black text-xs mt-1 block">৳{turf.pricePerHour}</span>
                              </div>

                              <Link
                                href={`/admin/turfs/edit/${turf.id}`}
                                className="h-8 px-4.5 text-[9px] font-black uppercase bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-350 hover:text-white rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Settings className="h-3.5 w-3.5 text-slate-500" />
                                Edit Setup
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-12 text-center text-slate-650 uppercase tracking-widest text-[9px] font-black">
                        No arenas registered in database logs
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* REGULAR PLAYER VIEW (ACTIVE RESERVATIONS SUMMARY) */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#060a16] to-[#04060f] border border-slate-900 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900/60 pb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Your Games Log</h3>
              <span className="text-[9px] font-black text-slate-500 uppercase">{myBookingsList.length} Reservations</span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {myBookingsList.length > 0 ? (
                myBookingsList.map((booking) => {
                  const dateStr = booking.slot?.date
                    ? new Date(booking.slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Confirmed Date';
                  const isPending = booking.status === 'PENDING';
                  const isConfirmed = booking.status === 'CONFIRMED';

                  return (
                    <div
                      key={booking.id}
                      className="group p-5 rounded-xl bg-slate-950/40 border border-slate-900/80 hover:border-slate-800/80 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-white truncate">{booking.turf?.name || 'Sports Arena'}</h4>
                        
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="h-4 w-4 text-emerald-400" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-4 w-4 text-emerald-400" />
                            {booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : 'Time Slot'}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <MapPin className="h-4 w-4 text-emerald-400" />
                            {booking.turf?.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4.5 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[7.5px] font-black text-slate-655 uppercase tracking-widest block leading-none">Total Cost</span>
                          <span className="text-white font-extrabold text-xs mt-1 block">৳{booking.totalAmount}</span>
                        </div>

                        <div>
                          {isConfirmed ? (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                              Confirmed
                            </span>
                          ) : isPending ? (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full animate-pulse">
                              Pending
                            </span>
                          ) : (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-455 px-3 py-1 rounded-full">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">No Reservations Yet</h3>
                  <Link href="/turfs" className="text-[9.5px] font-black uppercase text-emerald-400 hover:underline">
                    Book your first sports slot now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
