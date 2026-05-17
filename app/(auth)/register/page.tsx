'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
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
      // ডামি সাকসেস লজিক
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
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden font-jakarta">
      {/* --- Premium Pitch Geometric Background Line Art --- */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-slate-200/60 rounded-full" />
        <div className="absolute top-1/4 -left-12 w-[300px] h-[400px] border border-slate-200/50 rounded-r-3xl" />
        <div className="absolute top-1/4 -right-12 w-[300px] h-[400px] border border-slate-200/50 rounded-l-3xl" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-200/40 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-slate-200/40 to-transparent" />
      </div>

      {/* --- Main Registration Card --- */}
      <div className="relative w-full max-w-[460px] bg-white p-8 sm:p-10 rounded-[28px] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
        {/* Brand & Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#1e6b3e] p-2 rounded-xl shadow-md shadow-emerald-900/10">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Turf<span className="text-[#1e6b3e]">Book</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join our community to book your next match.</p>
        </div>

        {/* Google Sign-up Button */}
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 bg-white hover:bg-slate-50 active:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
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

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full h-px bg-slate-200/70" />
          <span className="relative bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-widest">
            or
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#1e6b3e] transition-colors" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-[#1e6b3e] focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all text-sm font-medium text-slate-800"
              required
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#1e6b3e] transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-[#1e6b3e] focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all text-sm font-medium text-slate-800"
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#1e6b3e] transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-[#1e6b3e] focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all text-sm font-medium text-slate-800"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#1e6b3e] transition-colors" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-[#1e6b3e] focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all text-sm font-medium text-slate-800"
              required
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5 px-0.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-slate-300 text-[#1e6b3e] focus:ring-[#1e6b3e] h-3.5 w-3.5 transition-all cursor-pointer"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-500 font-medium leading-relaxed cursor-pointer select-none"
            >
              I agree to the{' '}
              <Link href="#" className="text-[#1e6b3e] font-bold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-[#1e6b3e] font-bold hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <Button
            disabled={loading}
            className="w-full h-11 bg-[#1e6b3e] hover:bg-[#16522f] text-white hover:text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-900/10 mt-3 active:scale-[0.99] cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </Button>
        </form>

        {/* Bottom Login Link */}
        <p className="text-center text-xs text-slate-500 font-medium mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#1e6b3e] font-bold hover:text-[#16522f] hover:underline ml-0.5 transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* Bottom Corner Decorative Football Graphics */}
        <div className="absolute bottom-[-15px] left-[-15px] opacity-[0.07] pointer-events-none">
          <svg
            width="70"
            height="70"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-slate-900"
          >
            <circle cx="50" cy="50" r="45" />
            <polygon points="50,30 65,42 59,60 41,60 35,42" />
            <line x1="50" y1="30" x2="50" y2="5" />
            <line x1="65" y1="42" x2="90" y2="35" />
            <line x1="59" y1="60" x2="75" y2="85" />
            <line x1="41" y1="60" x2="25" y2="85" />
            <line x1="35" y1="42" x2="10" y2="35" />
          </svg>
        </div>
      </div>
    </div>
  );
}
