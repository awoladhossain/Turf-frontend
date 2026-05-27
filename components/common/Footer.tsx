'use client';

import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Trophy, Heart } from 'lucide-react';
import Link from 'next/link';
import InstagramIcon from '@iconify-react/line-md/instagram';
import TwitterFilledIcon from '@iconify-react/line-md/twitter-filled';
import FacebookIcon from '@iconify-react/line-md/facebook';
import Magnetic from '@/components/ui/Magnetic';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-slate-900 bg-[#050811] text-slate-450 font-jakarta relative overflow-hidden select-none">
      
      {/* 🌌 Deep Space Glowing Backdrop */}
      <div className="absolute bottom-0 right-10 w-[250px] h-[250px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* --- BRAND SECTION --- */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer w-fit">
              <div className="bg-gradient-to-br from-emerald-600 to-[#1e6b3e] p-2 rounded-full border border-emerald-500/10 shadow-sm">
                <Trophy className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Turf
                <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.25)]">
                  Book
                </span>
              </span>
            </Link>
            
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
              আপনার পছন্দের টার্ফ খুঁজে বের করুন এবং বুক করুন খুব সহজে। আমরা দিচ্ছি ঢাকা শহরের সেরা
              খেলার মাঠ ও প্রফেশনাল এক্সপেরিয়েন্সের নিশ্চয়তা।
            </p>

            {/* Micro-Physics Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: <FacebookIcon className="h-3.5 w-3.5" />, href: '#' },
                { icon: <InstagramIcon className="h-3.5 w-3.5" />, href: '#' },
                { icon: <TwitterFilledIcon className="h-3.5 w-3.5" />, href: '#' },
              ].map((social, index) => (
                <Magnetic key={index} range={15} actionStrength={0.25}>
                  <Link
                    href={social.href}
                    className="p-2 bg-[#0d1425]/20 border border-slate-900 rounded-full text-slate-500 hover:text-white hover:border-emerald-500/20 hover:bg-[#0d1425]/40 transition-all duration-300 flex items-center justify-center"
                  >
                    {social.icon}
                  </Link>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* --- QUICK NAVIGATION LINKS --- */}
          <div>
            <h3 className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-4.5">
              Quick Nav
            </h3>
            
            <ul className="space-y-2.5 text-[11px] sm:text-xs font-semibold text-slate-450">
              {[
                { label: 'সব টার্ফ খুঁজুন', path: '/turfs' },
                { label: 'এক্সক্লুসিভ অফার', path: '/offers' },
                { label: 'আমাদের সম্পর্কে', path: '/about' },
                { label: 'যোগাযোগ করুন', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Magnetic range={10} actionStrength={0.15}>
                    <Link
                      href={link.path}
                      className="hover:text-emerald-400 transition-colors duration-200 block w-fit"
                    >
                      {link.label}
                    </Link>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>

          {/* --- CUSTOMER SUPPORT --- */}
          <div>
            <h3 className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-4.5">
              Support
            </h3>
            
            <ul className="space-y-2.5 text-[11px] sm:text-xs font-semibold text-slate-450">
              {[
                { label: 'সাধারণ জিজ্ঞাসা (FAQ)', path: '/faq' },
                { label: 'প্রাইভেসি পলিসি', path: '/privacy' },
                { label: 'শর্তাবলী ও নিয়ম', path: '/terms' },
                { label: 'রিফান্ড পলিসি', path: '/refund' },
              ].map((link, index) => (
                <li key={index}>
                  <Magnetic range={10} actionStrength={0.15}>
                    <Link
                      href={link.path}
                      className="hover:text-emerald-400 transition-colors duration-200 block w-fit"
                    >
                      {link.label}
                    </Link>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>

          {/* --- CONTACT INFO PANEL --- */}
          <div>
            <h3 className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-4.5">
              Contact
            </h3>
            
            <ul className="space-y-3.5 text-[11px] sm:text-xs font-semibold text-slate-450">
              <li className="flex items-center gap-2.5 group">
                <div className="p-1.5 bg-[#050811] border border-slate-950 rounded-full text-emerald-400 flex items-center justify-center">
                  <Mail className="h-3 w-3" />
                </div>
                <span className="group-hover:text-slate-200 transition-colors duration-250">
                  support@turfbook.com
                </span>
              </li>
              
              <li className="flex items-center gap-2.5 group">
                <div className="p-1.5 bg-[#050811] border border-slate-950 rounded-full text-emerald-400 flex items-center justify-center">
                  <Phone className="h-3 w-3" />
                </div>
                <span className="group-hover:text-slate-200 transition-colors duration-250">
                  +880 1612 011970
                </span>
              </li>
              
              <li className="flex items-center gap-2.5 group">
                <div className="p-1.5 bg-[#050811] border border-slate-950 rounded-full text-emerald-400 flex items-center justify-center">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="group-hover:text-slate-200 transition-colors duration-250">
                  বনানী, ঢাকা, বাংলাদেশ
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- BOTTOM RIGHTS & COPYRIGHT BLOCK --- */}
        <div className="mt-14 pt-6.5 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
          <p>© {currentYear} TurfBook. সর্বস্বত্ব সংরক্ষিত।</p>
          
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-550">
            <span>Built for Next-Gen Players</span>
            <Heart className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500 animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
}
