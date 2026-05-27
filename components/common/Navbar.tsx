'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Menu, Trophy, UserCircle, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            {isAuthenticated && user ? (
              <div ref={dropdownRef} className="relative">
                <Magnetic range={15} actionStrength={0.25}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-[#0d1425]/40 hover:bg-slate-900/60 transition-all duration-300 text-xs font-bold text-slate-350 hover:text-white cursor-pointer select-none"
                    data-cursor-text="USER"
                  >
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-600 to-[#1e6b3e] flex items-center justify-center text-[10px] font-black text-white uppercase shadow-sm">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </Magnetic>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 bg-[#0c1324]/90 backdrop-blur-2xl border border-slate-800 rounded-2xl p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden font-jakarta"
                    >
                      {/* User Info Header */}
                      <div className="px-3 py-2 border-b border-slate-900/80 mb-1.5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Logged in as</p>
                        <p className="text-xs font-black text-white truncate mt-0.5">{user.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      {/* Dropdown Options */}
                      <div className="space-y-1">
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors duration-300 font-bold">
                            <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                            <span>{user.role === 'ADMIN' ? 'Admin Panel' : 'My Bookings'}</span>
                          </div>
                        </Link>

                        <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors duration-300 font-bold">
                            <UserCircle className="h-4 w-4 text-emerald-400" />
                            <span>My Profile</span>
                          </div>
                        </Link>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors duration-300 font-bold cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Hamburg Menu */}
          <Magnetic range={15} actionStrength={0.2}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 rounded-lg border border-slate-900 bg-[#0d1425]/20 text-slate-400 hover:text-white hover:bg-slate-900/40 cursor-pointer flex items-center justify-center"
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>
          </Magnetic>
        </div>

      </div>

      {/* Mobile Menu Sliding Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden w-full bg-[#050811]/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-6 space-y-6 overflow-hidden z-40 relative"
          >
            {/* Navigation Links */}
            <div className="flex flex-col gap-2.5">
              {[
                { id: 'find_turf', path: '/turfs', label: 'Explore Arenas' },
                { id: 'offers', path: '/offers', label: 'Offers & Discounts' },
                { id: 'about', path: '/about', label: 'About Us' },
              ].map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`h-11 w-full px-4 rounded-xl border flex items-center transition-all text-xs font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-[1px] bg-slate-900 w-full" />

            {/* Action Buttons for Mobile */}
            <div className="flex flex-col gap-3">
              {/* Language switcher */}
              <button
                onClick={toggleLanguage}
                className="h-11 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-900 bg-[#0d1425]/20 hover:bg-slate-900/60 font-black text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <Languages className="h-4 w-4 text-emerald-450" />
                <span>{i18n.language === 'en' ? 'বাংলা' : 'English'}</span>
              </button>

              {/* Login/Signup or User Menu */}
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="px-2 py-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Logged in as</p>
                    <p className="text-xs font-black text-white truncate mt-0.5">{user.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 truncate">{user.email}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link href="/dashboard">
                      <div className="h-11 w-full px-4 rounded-xl border border-slate-900 bg-[#0d1425]/20 flex items-center gap-2.5 text-xs text-slate-400 hover:text-white font-bold">
                        <LayoutDashboard className="h-4 w-4 text-emerald-450" />
                        <span>{user.role === 'ADMIN' ? 'Admin Panel' : 'My Bookings'}</span>
                      </div>
                    </Link>

                    <Link href="/profile">
                      <div className="h-11 w-full px-4 rounded-xl border border-slate-900 bg-[#0d1425]/20 flex items-center gap-2.5 text-xs text-slate-400 hover:text-white font-bold">
                        <UserCircle className="h-4 w-4 text-emerald-450" />
                        <span>My Profile</span>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="h-11 w-full px-4 rounded-xl border border-rose-950/20 bg-rose-500/5 flex items-center gap-2.5 text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" className="w-full">
                    <button className="h-11 w-full text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white flex items-center justify-center gap-2 hover:bg-slate-900/40 rounded-xl transition-all cursor-pointer border border-slate-900">
                      <UserCircle className="h-4 w-4 text-slate-550" />
                      <span>Login</span>
                    </button>
                  </Link>

                  <Link href="/register" className="w-full">
                    <button className="h-11 w-full bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-sm border border-emerald-500/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
