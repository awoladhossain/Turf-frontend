'use client';

import { Button } from '@/components/ui/button';
import { Languages, Menu, Trophy, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch এড়াতে useEffect ব্যবহার
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (!mounted) return null; // সার্ভার ও ক্লায়েন্ট রেন্ডার সেম রাখতে

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md transition-all">
      <div className="container flex h-18 items-center justify-between px-6 mx-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-green-100">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Turf<span className="text-green-600">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {['find_turf', 'offers', 'about'].map((item) => (
            <Link
              key={item}
              href={`/${item === 'find_turf' ? 'turfs' : item}`}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
            >
              {t(`navbar.${item}`)}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider"
          >
            <Languages className="h-3.5 w-3.5 text-green-600" />
            {i18n.language === 'en' ? 'বাংলা' : 'English'}
          </Button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                className="text-sm font-bold text-slate-700 hover:text-green-600 flex items-center gap-2 px-4"
              >
                <UserCircle className="h-5 w-5 opacity-70" />
                {t('navbar.login')}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="bg-slate-900 hover:bg-green-600 text-white rounded-full px-6 font-bold shadow-md transition-all active:scale-95">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>
        </div>
      </div>
    </header>
  );
}
