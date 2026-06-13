'use client';

import { useAuth } from '@/hooks/useAuth';
import bookingService from '@/services/booking.service';
import turfService from '@/services/turf.service';
import healthService from '@/services/health.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Activity,
  Layers,
  MapPin,
  Plus,
  Server,
  Trophy,
  Users,
  Loader2,
  Settings,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Database,
  Grid,
} from 'lucide-react';
import {
  ResponsiveContainer,
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
  Legend,
} from 'recharts';

export default function DashboardPage() {
  const { user, isAuthenticated, isFetchingMe } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'turfs'>('analytics');

  // Auth Guard redirect
  useEffect(() => {
    if (!isFetchingMe && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, isFetchingMe, router]);

  const isAdmin = user?.role === 'ADMIN';

  // 1. Fetch Admin Bookings (large limit to calculate stats)
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
  const { data: healthData, isLoading: isHealthLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => healthService.getHealthStatus(),
    enabled: !!user && isAdmin,
    refetchInterval: 30000, // refresh every 30s
  });

  if (isFetchingMe || (isAdmin ? isAdminBookingsLoading : isUserBookingsLoading) || isTurfsLoading) {
    return (
      <div className="min-h-screen bg-[#03060f] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
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

  // --- STATS CALCULATIONS (REGULAR USER) ---
  const myBookingsList = userBookings?.data || [];
  const myConfirmed = myBookingsList.filter(b => b.status === 'CONFIRMED');
  const myPending = myBookingsList.filter(b => b.status === 'PENDING');
  const myTotalSpent = myConfirmed.reduce((sum, b) => sum + Number(b.totalAmount), 0);

  // --- CHART DATA GENERATION (ADMIN) ---
  // 1. Revenue & Bookings over time (last 7 bookings grouped by date)
  const revenueTrendData = bookingsList
    .slice()
    .reverse()
    .slice(-10) // last 10 entries
    .map(b => {
      const date = b.slot?.date 
        ? new Date(b.slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
        : 'Date';
      return {
        name: date,
        Revenue: b.status === 'CONFIRMED' ? Number(b.totalAmount) : 0,
        Booking: 1
      };
    });

  // 2. Booking status share
  const statusPieData = [
    { name: 'Confirmed', value: confirmedBookings.length, color: '#10b981' },
    { name: 'Pending', value: pendingBookings.length, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledBookings.length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // 3. Sport type distribution
  const sportTypeCount = turfsData?.data?.reduce((acc: Record<string, number>, t) => {
    acc[t.sportType] = (acc[t.sportType] || 0) + 1;
    return acc;
  }, {}) || {};
  const sportChartData = Object.entries(sportTypeCount).map(([key, value]) => ({
    name: key === 'BOTH' ? 'Multi-Sport' : key,
    Arenas: value
  }));

  // --- SYSTEM HEALTH DATA ---
  const dbUp = healthData?.services?.database === 'up';
  const redisUp = healthData?.services?.redis === 'up';

  return (
    <div className="min-h-screen bg-[#03060f] text-slate-100 font-jakarta pb-20 select-none">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 text-emerald-400">
                {isAdmin ? 'Admin Console' : 'Player Station'}
              </span>
              {isAdmin && (
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1.5">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-400">
              {isAdmin 
                ? 'Manage scheduling, payment receipts, venue analytics, and systems telemetry.' 
                : 'Check your match reservations, total bookings stats, and book new slots.'
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <Link
                href="/turfs"
                className="h-10 px-5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-500/10 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Book Arena
              </Link>
            ) : (
              <Link
                href="/admin/turfs/create"
                className="h-10 px-5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-500/10 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Create Turf
              </Link>
            )}
          </div>
        </div>

        {/* --- STATS OVERVIEW GRIDS --- */}
        {isAdmin ? (
          /* Admin Metrics */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Net Revenue</p>
              <h3 className="text-2xl font-black text-white mt-2">৳{totalRevenue}</h3>
              <p className="text-[9px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                From confirmed bookings
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Reservations</p>
              <h3 className="text-2xl font-black text-white mt-2">{totalBookingsCount}</h3>
              <p className="text-[9px] text-slate-500 font-semibold mt-1">
                Across all active arenas
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Venues</p>
              <h3 className="text-2xl font-black text-white mt-2">{activeTurfsCount}</h3>
              <p className="text-[9px] text-emerald-400 font-semibold mt-1">
                Active & bookable
              </p>
            </div>

            {/* Health status metrics card */}
            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Systems Status</p>
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                    <Database className={`h-3.5 w-3.5 ${dbUp ? 'text-emerald-400' : 'text-rose-450 animate-pulse'}`} />
                    <span className="text-[9px] font-black uppercase text-white">Database</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                    <Server className={`h-3.5 w-3.5 ${redisUp ? 'text-emerald-400' : 'text-rose-450 animate-pulse'}`} />
                    <span className="text-[9px] font-black uppercase text-white">Cache</span>
                  </div>
                </div>
              </div>
              <div className="text-[8px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Refreshes live
              </div>
            </div>
          </div>
        ) : (
          /* Regular Player Metrics */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Bookings</p>
              <h3 className="text-2xl font-black text-white mt-2">{myBookingsList.length} Games</h3>
              <p className="text-[9px] text-emerald-400 font-semibold mt-1">
                {myConfirmed.length} Confirmed | {myPending.length} Pending
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Spent</p>
              <h3 className="text-2xl font-black text-white mt-2">৳{myTotalSpent}</h3>
              <p className="text-[9px] text-slate-500 font-semibold mt-1">
                On successful bookings
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060a16]/60 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="h-16 w-16 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Next Booking</p>
              {myConfirmed.length > 0 && myConfirmed[0].slot?.date ? (
                <div className="mt-2.5 space-y-1">
                  <h4 className="text-xs font-black text-white truncate">{myConfirmed[0].turf?.name}</h4>
                  <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(myConfirmed[0].slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ) : (
                <div className="mt-2.5">
                  <h4 className="text-xs font-black text-slate-400">No upcoming games</h4>
                  <Link href="/turfs" className="text-[9px] text-emerald-400 font-bold hover:underline block mt-1">
                    Find available fields →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- DUAL PANEL ANALYTICS & LIST VIEWS --- */}
        {isAdmin ? (
          /* ADMIN LAYOUT PANEL */
          <div className="space-y-6">
            
            {/* View selectors tabs */}
            <div className="flex border-b border-slate-900/60 pb-px gap-4">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-2.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === 'analytics' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Analytics & Charts
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`pb-2.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === 'bookings' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                All Bookings List
              </button>
              <button
                onClick={() => setActiveTab('turfs')}
                className={`pb-2.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === 'turfs' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
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
                  {/* Recharts charts grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Area Chart: Revenue Trend */}
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-[#060a16]/80 to-[#04060f]/60 border border-slate-900 shadow-xl shadow-slate-950/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Revenue Trendline</h3>
                        <span className="text-[9px] font-black text-slate-500 uppercase">Recent bookings activity</span>
                      </div>
                      <div className="h-64 w-full">
                        {revenueTrendData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid stroke="#0e1628" strokeDasharray="3 3" />
                              <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                              <YAxis stroke="#475569" fontSize={9} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#070c18', border: '1px solid #1e293b', borderRadius: '12px' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}
                              />
                              <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest font-black">
                            No Sales Logged
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pie Chart: Status Share */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#060a16]/80 to-[#04060f]/60 border border-slate-900 shadow-xl shadow-slate-950/20 space-y-4 flex flex-col justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Booking Status Share</h3>
                      <div className="h-44 w-full flex justify-center items-center">
                        {statusPieData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={statusPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
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
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-xs text-slate-500 uppercase tracking-widest font-black">
                            No Status Data
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 mt-2">
                        {statusPieData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-2.5 py-1.5 bg-slate-950/40 rounded-lg border border-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span>{item.name}</span>
                            </div>
                            <span className="text-white font-extrabold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bar Chart: Sport type distribution */}
                    <div className="lg:col-span-3 p-5 rounded-2xl bg-gradient-to-br from-[#060a16]/80 to-[#04060f]/60 border border-slate-900 shadow-xl shadow-slate-950/20 space-y-4">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Sport Popularity Distribution</h3>
                      <div className="h-56 w-full">
                        {sportChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sportChartData}>
                              <CartesianGrid stroke="#0e1628" strokeDasharray="3 3" />
                              <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                              <YAxis stroke="#475569" fontSize={9} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#070c18', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}
                              />
                              <Bar dataKey="Arenas" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest font-black">
                            No Sport Distribution Available
                          </div>
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
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#060a16]/80 to-[#04060f]/60 border border-slate-900 shadow-xl shadow-slate-950/20"
                >
                  <div className="flex justify-between items-center border-b border-slate-900/60 pb-4 mb-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">All Reservations</h3>
                    <span className="text-[9px] font-black text-slate-500 uppercase">{bookingsList.length} Total Logs</span>
                  </div>

                  {/* Booking Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] font-bold text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-900 text-left uppercase text-[8px] font-black tracking-widest text-slate-500">
                          <th className="pb-3 pr-2">Booking ID</th>
                          <th className="pb-3 pr-2">User Details</th>
                          <th className="pb-3 pr-2">Arena Name</th>
                          <th className="pb-3 pr-2">Schedule</th>
                          <th className="pb-3 pr-2">Cost</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/40">
                        {bookingsList.length > 0 ? (
                          bookingsList.map((booking) => {
                            const dateStr = booking.slot?.date
                              ? new Date(booking.slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : 'Confirmed Date';
                            const phone = booking.user?.phone || 'No phone';

                            return (
                              <tr key={booking.id} className="hover:bg-slate-950/20 transition-colors">
                                <td className="py-3.5 pr-2 font-mono text-slate-500">#{booking.id.slice(0, 8)}</td>
                                <td className="py-3.5 pr-2">
                                  <div className="text-white font-black text-xs">{booking.user?.name || 'Guest User'}</div>
                                  <div className="text-[8px] text-slate-500 mt-0.5">{phone}</div>
                                </td>
                                <td className="py-3.5 pr-2 text-white font-black">{booking.turf?.name || 'Sports Arena'}</td>
                                <td className="py-3.5 pr-2">
                                  <div>{dateStr}</div>
                                  <div className="text-[9px] text-emerald-400 mt-0.5">{booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : 'Time slot'}</div>
                                </td>
                                <td className="py-3.5 pr-2 text-emerald-400 font-extrabold">৳{booking.totalAmount}</td>
                                <td className="py-3.5 text-right">
                                  {booking.status === 'CONFIRMED' ? (
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                                      Confirmed
                                    </span>
                                  ) : booking.status === 'PENDING' ? (
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">
                                      Pending
                                    </span>
                                  ) : (
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-455 px-2 py-0.5 rounded-md">
                                      Cancelled
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-slate-650 uppercase tracking-widest text-[9px] font-black">
                              No bookings found in database logs
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
                  <div className="flex justify-between items-center border-b border-slate-900/60 pb-4 mb-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Registered Arena Venues</h3>
                    <span className="text-[9px] font-black text-slate-500 uppercase">{activeTurfsCount} Total Arenas</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {turfsData?.data && turfsData.data.length > 0 ? (
                      turfsData.data.map((turf) => (
                        <div
                          key={turf.id}
                          className="group p-5 rounded-2xl bg-gradient-to-br from-[#060a16] to-[#04060f] border border-slate-900 hover:border-slate-800/80 transition-all duration-300 flex items-start gap-4 shadow-md"
                        >
                          <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-xl text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300">
                            <Trophy className="h-5 w-5" />
                          </div>

                          <div className="flex-grow space-y-1.5 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-black text-white truncate group-hover:text-emerald-400 transition-colors">
                                {turf.name}
                              </h4>
                              <span className="text-[8px] font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded-md">
                                {turf.sportType}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {turf.address}, {turf.city}
                            </p>

                            <div className="flex justify-between items-center border-t border-slate-950/60 pt-2.5 mt-2">
                              <div>
                                <span className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest block leading-none">Price per hour</span>
                                <span className="text-white font-black text-xs mt-1 block">৳{turf.pricePerHour}</span>
                              </div>

                              <div className="flex gap-2">
                                <Link
                                  href={`/admin/turfs/edit/${turf.id}`}
                                  className="h-7 px-3 text-[9px] font-black uppercase bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                                >
                                  <Settings className="h-3 w-3 text-slate-400" />
                                  Edit Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-10 text-center text-slate-650 uppercase tracking-widest text-[9px] font-black">
                        No arena venues registered in system
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* REGULAR PLAYER VIEW (ACTIVE RESERVATIONS SUMMARY) */
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#060a16]/80 to-[#04060f]/60 border border-slate-900 shadow-xl shadow-slate-950/20 space-y-6">
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
                      className="group p-4 rounded-xl bg-slate-950/40 border border-slate-900/80 hover:border-slate-800/80 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-white truncate">{booking.turf?.name || 'Sports Arena'}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-3.5 w-3.5 text-emerald-400" />
                            {booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : 'Time Slot'}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                            {booking.turf?.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest block leading-none">Total Cost</span>
                          <span className="text-white font-extrabold text-xs mt-1 block">৳{booking.totalAmount}</span>
                        </div>

                        <div>
                          {isConfirmed ? (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                              Confirmed
                            </span>
                          ) : isPending ? (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md animate-pulse">
                              Pending
                            </span>
                          ) : (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-455 px-2 py-0.5 rounded-md">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 space-y-4">
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
