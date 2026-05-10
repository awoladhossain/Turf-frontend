'use client';

import { Button } from '@/components/ui/button';
import '@/lib/i18n'; // i18n কনফিগারেশন ইমপোর্ট
import { Languages, Menu, Trophy, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  // ভাষা পরিবর্তন করার ফাংশন
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-green-600 p-1.5 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Turf<span className="text-green-600">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/turfs"
            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
          >
            {t('navbar.find_turf')}
          </Link>
          <Link
            href="/offers"
            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
          >
            {t('navbar.offers')}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
          >
            {t('navbar.about')}
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-xs font-semibold hover:bg-green-50 hover:text-green-600"
          >
            <Languages className="h-4 w-4" />
            {i18n.language === 'en' ? 'বাংলা' : 'EN'}
          </Button>
          <div className="h-6 w-[1px] bg-border hidden sm:block" /> {/* Divider */}
          <Link href="/login" className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <UserCircle className="h-4 w-4" />
              {t('navbar.login')}
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 hover:bg-green-700 text-sm font-medium px-5 cursor-pointer">
              Sign Up
            </Button>
          </Link>
          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
