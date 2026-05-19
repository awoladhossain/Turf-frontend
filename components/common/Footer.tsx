'use client';

import {   Mail, MapPin, Phone, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InstagramIcon from '@iconify-react/line-md/instagram';
import TwitterFilledIcon from '@iconify-react/line-md/twitter-filled';
import FacebookIcon from '@iconify-react/line-md/facebook';
export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-slate-900 bg-[#05070f] text-slate-400 font-jakarta relative overflow-hidden">
      {/* ফুটারেও হালকা ব্যাকগ্রাউন্ড গ্লো এর ছোঁয়া */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* --- ব্র্যান্ড সেকশন --- */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-emerald-500 to-[#1e6b3e] p-2 rounded-xl border border-emerald-400/20 shadow-md shadow-emerald-950/50">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Turf
                <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                  Book
                </span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              আপনার পছন্দের টার্ফ খুঁজে বের করুন এবং বুক করুন খুব সহজে। আমরা দিচ্ছি ঢাকা শহরের সেরা
              খেলার মাঠ ও প্রফেশনাল এক্সপেরিয়েন্সের নিশ্চয়তা।
            </p>

            {/* মডার্ন সোশ্যাল লিংকস */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <FacebookIcon className="h-4 w-4" />, href: '#' },
                { icon: <InstagramIcon className="h-4 w-4" />, href: '#' },
                { icon: <TwitterFilledIcon className="h-4 w-4" />, href: '#' },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(52,211,153,0.1)] transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* --- দ্রুত লিঙ্কসমূহ --- */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5 border-l-2 border-emerald-500 pl-3">
              দ্রুত লিঙ্ক
            </h3>
            <ul className="space-y-3 text-xs font-semibold">
              {[
                { label: 'সব টার্ফ খুঁজুন', path: '/turfs' },
                { label: 'এক্সক্লুসিভ অফার', path: '/offers' },
                { label: 'আমাদের সম্পর্কে', path: '/about' },
                { label: 'যোগাযোগ করুন', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="hover:text-emerald-400 transition-colors duration-200 block w-fit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- কাস্টমার সাপোর্ট --- */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5 border-l-2 border-emerald-500 pl-3">
              সাপোর্ট
            </h3>
            <ul className="space-y-3 text-xs font-semibold">
              {[
                { label: 'সাধারণ জিজ্ঞাসা (FAQ)', path: '/faq' },
                { label: 'প্রাইভেসি পলিসি', path: '/privacy' },
                { label: 'শর্তাবলী ও নিয়ম', path: '/terms' },
                { label: 'রিফান্ড পলিসি', path: '/refund' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="hover:text-emerald-400 transition-colors duration-200 block w-fit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- অফিসিয়াল ইনফো --- */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5 border-l-2 border-emerald-500 pl-3">
              যোগাযোগ
            </h3>
            <ul className="space-y-4 text-xs font-semibold">
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="group-hover:text-slate-200 transition-colors">
                  support@turfbook.com
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="group-hover:text-slate-200 transition-colors">
                  +880 1612 011970
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span className="group-hover:text-slate-200 transition-colors">
                  বনানী, ঢাকা, বাংলাদেশ
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- নিচের কপিরাইট লাইন --- */}
        <div className="mt-16 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© {currentYear} TurfBook. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4 text-[10px] uppercase tracking-wider font-bold">
            <span className="text-slate-600">Built for Next-Gen Players</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
