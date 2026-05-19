'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Languages, Menu, Trophy, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hydration mismatch এড়াতে এবং স্ক্রোল ট্র্যাকিংয়ের জন্য
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (!mounted) return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'bg-[#090d16]/70 backdrop-blur-xl border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Logo Section (Glowing Cyber Vibe) --- */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-emerald-500 to-[#1e6b3e] p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Turf
            <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              Book
            </span>
          </span>
        </Link>

        {/* --- Desktop Navigation (Inline Chips) --- */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/50 border border-slate-800/60 p-1.5 rounded-full backdrop-blur-md">
          {[
            { id: 'find_turf', path: '/turfs' },
            { id: 'offers', path: '/offers' },
            { id: 'about', path: '/about' },
          ].map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                className="relative px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full cursor-pointer overflow-hidden"
              >
                {/* অ্যাক্টিভ ট্যাবের ব্যাকগ্রাউন্ড গ্লো অ্যানিমেশন */}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {t(`navbar.${item.id}`)}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* --- Action Buttons (Premium Steel Controls) --- */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="hidden sm:flex h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-emerald-400" />
            {i18n.language === 'en' ? 'বাংলা' : 'English'}
          </Button>

          <div className="hidden sm:block h-5 w-px bg-slate-800" />

          {/* User Authentication Actions */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                className="h-10 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-2 px-4 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
              >
                <UserCircle className="h-4 w-4 text-slate-500 group-hover:text-white" />
                {t('navbar.login')}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="h-10 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl px-5 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-950/50 border border-emerald-500/20 active:scale-95 transition-all cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburg Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
