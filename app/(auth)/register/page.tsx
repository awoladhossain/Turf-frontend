'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { motion } from 'framer-motion';
import { Lock, Mail, Trophy, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }

    setLoading(true);

    try {
      // রিয়ালিস্টিক রেজিস্ট্রেশন সাকসেস ইমিটেশন
      const dummyUser = {
        user: { id: '2', name: name, email: email, role: 'user' },
        accessToken: 'dummy-token-reg',
        refreshToken: 'dummy-refresh-reg',
      };

      dispatch(setCredentials(dummyUser));
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#090d16] overflow-hidden font-jakarta text-white">
      {/* 🌌 মডার্ন ট্যাকটিক্যাল ব্যাকগ্রাউন্ড গ্রিড */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />

      {/* গ্লোয়িং সাইবার অরবিট */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1e6b3e]/20 blur-[130px] rounded-full pointer-events-none"
      />

      {/* --- মডার্ন প্রিমিয়াম গ্লাস-মরফিজম কার্ড --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-[460px] bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-[28px] border border-slate-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden z-10"
      >
        {/* ব্র্যান্ড হেডার সেকশন */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-emerald-500 to-[#1e6b3e] p-2 rounded-xl border border-emerald-400/20 shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Turf
              <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                Book
              </span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            Create Account
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-1.5">
            Dhaka-র সেরা স্পোর্টস কমিউনিটিতে যোগ দিন।
          </p>
        </div>

        {/* গুগল ওয়ান-ক্লিক সাইন-আপ বাটন */}
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-slate-950/40 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
        </div>

        {/* মডার্ন ডিভাইডার */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full h-px bg-slate-800/80" />
          <span className="relative bg-[#0d1322] px-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            or
          </span>
        </div>

        {/* রেজিস্ট্রেশন ফর্ম */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* নাম ইনপুট */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

          {/* ইমেইল ইনপুট */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

          {/* পাসওয়ার্ড ইনপুট */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

          {/* পাসওয়ার্ড কনফার্মেশন */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-white placeholder-slate-500"
              required
            />
          </div>

          {/* শর্তাবলী সম্মতি (Terms Checklist) */}
          <div className="flex items-start gap-2.5 px-0.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 accent-[#1e6b3e] h-3.5 w-3.5 transition-all cursor-pointer rounded border-slate-800 bg-slate-950"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-400 font-medium leading-relaxed cursor-pointer select-none hover:text-slate-300 transition-colors"
            >
              I agree to the{' '}
              <Link href="#" className="text-emerald-400 font-bold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-emerald-400 font-bold hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* গ্লোয়িং সাবমিট বোতাম */}
          <Button
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/50 mt-3 border border-emerald-500/20 active:scale-95 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </Button>
        </form>

        {/* বটম লগইন লিঙ্ক */}
        <p className="text-center text-xs text-slate-400 font-semibold mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-emerald-400 font-black hover:text-emerald-300 ml-1 transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* ট্যাকটিক্যাল ডেকোরেটিভ পিচ ব্যাকগ্রাউন্ড গ্রাফিক্স */}
        <div className="absolute -bottom-4 -left-4 opacity-5 pointer-events-none text-white">
          <svg
            width="75"
            height="75"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="50" cy="50" r="45" />
            <polygon points="50,30 65,42 59,60 41,60 35,42" />
            <line x1="50" y1="30" x2="50" y2="5" />
            <line x1="65" y1="42" x2="90" y2="35" />
            <line x1="59" y1="60" x2="75" y2="85" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
