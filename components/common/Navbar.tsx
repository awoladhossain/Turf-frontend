'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Languages, Menu, Trophy, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Magnetic from '@/components/ui/Magnetic';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
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
      className={`sticky top-0 z-50 w-full border-b transition-all duration-350 select-none ${
        scrolled
          ? 'bg-[#050811]/60 backdrop-blur-xl border-slate-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.4)] h-16'
          : 'bg-transparent border-transparent h-20'
      }`}
    >
      <div className="max-w-6xl mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* --- Logo Section (Perfect Circular Glowing Badge) --- */}
        <Magnetic range={25} actionStrength={0.2}>
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" data-cursor-text="HOME">
            <div className="bg-gradient-to-br from-emerald-600 to-[#1e6b3e] p-2 rounded-full group-hover:rotate-6 transition-transform duration-350 shadow-sm shadow-emerald-950/50 border border-emerald-500/10 flex items-center justify-center">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-white">
              Turf
              <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.25)]">
                Book
              </span>
            </span>
          </Link>
        </Magnetic>

        {/* --- Desktop Navigation (Sleek High-Tech Deck) --- */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0d1425]/20 border border-slate-900 p-1 rounded-full backdrop-blur-md">
          {[
            { id: 'find_turf', path: '/turfs' },
            { id: 'offers', path: '/offers' },
            { id: 'about', path: '/about' },
          ].map((item) => {
            const isActive = pathname === item.path;
            return (
              <Magnetic key={item.id} range={20} actionStrength={0.25}>
                <Link
                  href={item.path}
                  className="relative px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-full cursor-pointer overflow-hidden"
                  data-cursor-text={item.id === 'find_turf' ? 'PLAY' : item.id.toUpperCase()}
                >
                  {/* Staggered active overlay with spring motion */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${isActive ? 'text-emerald-400 font-black' : 'text-slate-500 hover:text-slate-350'}`}
                  >
                    {t(`navbar.${item.id}`)}
                  </span>
                </Link>
              </Magnetic>
            );
          })}
        </nav>

        {/* --- Action Buttons (Compact Glass Controls) --- */}
        <div className="flex items-center gap-3.5">
          {/* Language Switcher */}
          <Magnetic range={20} actionStrength={0.2}>
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-slate-900 bg-[#0d1425]/20 hover:bg-slate-900/60 font-black text-[9px] uppercase tracking-widest text-slate-400 hover:text-white transition-all cursor-pointer"
              data-cursor-text="LANG"
            >
              <Languages className="h-3.5 w-3.5 text-emerald-400" />
              <span>{i18n.language === 'en' ? 'বাংলা' : 'English'}</span>
            </Button>
          </Magnetic>

          <div className="hidden sm:block h-4 w-px bg-slate-900" />

          {/* User Auth Actions */}
          <div className="flex items-center gap-2">
            <Magnetic range={20} actionStrength={0.2}>
              <Link href="/login" className="hidden sm:block" data-cursor-text="LOGIN">
                <Button
                  variant="ghost"
                  className="h-9 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1.5 px-3.5 hover:bg-slate-900/40 rounded-lg transition-all cursor-pointer"
                >
                  <UserCircle className="h-3.5 w-3.5 text-slate-550" />
                  <span>{t('navbar.login')}</span>
                </Button>
              </Link>
            </Magnetic>

            <Magnetic range={25} actionStrength={0.25}>
              <Link href="/register" data-cursor-text="JOIN">
                <Button className="h-9 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-lg px-4.5 font-black text-[10px] uppercase tracking-wider shadow-sm border border-emerald-500/10 active:scale-95 transition-all cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </Magnetic>
          </div>

          {/* Mobile Hamburg Menu */}
          <Magnetic range={15} actionStrength={0.2}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-lg border border-slate-900 bg-[#0d1425]/20 text-slate-400 hover:text-white hover:bg-slate-900/40 cursor-pointer flex items-center justify-center"
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>
          </Magnetic>
        </div>

      </div>
    </header>
  );
}
