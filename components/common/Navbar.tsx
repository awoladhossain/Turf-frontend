'use client';

import { Button } from '@/components/ui/button';
import { Languages, Menu, Trophy, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch এড়াতে useEffect ব্যবহার
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (!mounted) return null; // সার্ভার ও ক্লায়েন্ট রেন্ডার সেম রাখতে

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-6 mx-auto">
        {/* --- Logo Section --- */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-[#1e6b3e] p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md shadow-emerald-900/10">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Turf<span className="text-[#1e6b3e]">Book</span>
          </span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-1">
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
                className={`relative px-4 py-2 text-sm font-semibold transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'text-[#1e6b3e] bg-emerald-50/60'
                    : 'text-slate-600 hover:text-[#1e6b3e] hover:bg-slate-50'
                }`}
              >
                {t(`navbar.${item.id}`)}
              </Link>
            );
          })}
        </nav>

        {/* --- Action Buttons --- */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Button */}
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="hidden sm:flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white/50 hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-[#1e6b3e]" />
            {i18n.language === 'en' ? 'বাংলা' : 'English'}
          </Button>

          <div className="hidden sm:block h-5 w-px bg-slate-200" />

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                className="h-9 text-sm font-bold text-slate-600 hover:text-[#1e6b3e] flex items-center gap-2 px-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                <UserCircle className="h-4 w-4 text-slate-400" />
                {t('navbar.login')}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="h-9 bg-[#1e6b3e] hover:bg-[#16522f] text-white rounded-xl px-5 font-bold text-xs shadow-sm shadow-emerald-900/10 transition-all active:scale-[0.97] cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </Button>
        </div>
      </div>
    </header>
  );
}
