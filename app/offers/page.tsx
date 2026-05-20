'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock, Copy, Ticket } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DUMMY_OFFERS = [
  {
    id: 1,
    title: 'Midnight Madness',
    description:
      'রাত ১০টার পরের যেকোনো স্লট বুকিংয়ে ফ্ল্যাট ৩০% ডিসকাউন্ট! বন্ধুদের নিয়ে চলে আসুন লেট-নাইট ম্যাচের রোমাঞ্চ নিতে।',
    discount: '30% OFF',
    code: 'MIDNIGHT30',
    validUntil: 'May 31, 2026',
    tag: '⚡ Best Value',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 2,
    title: 'Weekend Kickoff',
    description:
      'শুক্রবার এবং শনিবারের যেকোনো ফুটবল বা ক্রিকেট স্লট বুকিংয়ে পেয়ে যান ৫০০ টাকা সোজা ক্যাশব্যাক।',
    discount: '৳500 FLAT',
    code: 'WEEKEND500',
    validUntil: 'June 05, 2026',
    tag: '🔥 Popular',
    color: 'from-amber-500 to-rose-500',
  },
  {
    id: 3,
    title: 'First Match Special',
    description:
      'টার্ফবুক অ্যাপে আপনার প্রথম বুকিং? প্রমো কোডটি ব্যবহার করুন এবং প্রথম ম্যাচের ভাড়ায় লুফে নিন ১৫% ছাড়।',
    discount: '15% OFF',
    code: 'PLAYFREE15',
    validUntil: 'Dec 31, 2026',
    tag: '🎉 New Player',
    color: 'from-blue-500 to-indigo-500',
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied!`);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#090d16] font-jakarta text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 🌌 মডার্ন সাইরেন ব্যাকগ্রাউন্ড গ্রিড */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.12] pointer-events-none" />

      {/* গ্লোয়িং সাইবার অরবিট */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* --- হেডার সেকশন --- */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
          >
            <Ticket className="h-3.5 w-3.5" />
            Exclusive Deals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            Active{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Promos & Offers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xs sm:text-sm font-medium"
          >
            আপনার পছন্দের মাঠের ম্যাচ বুকিং খরচ কমিয়ে আনুন। প্রমো কোড কপি করুন এবং স্লট বুক করার সময়
            ব্যবহার করুন!
          </motion.p>
        </div>

        {/* --- অফার কার্ড গ্রিড --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {DUMMY_OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative bg-slate-900/40 backdrop-blur-xl rounded-[24px] border border-slate-800/80 p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-700 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* টপ ট্যাগ ও ডিসকাউন্ট ভ্যালু */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-400">
                    {offer.tag}
                  </span>
                  <div
                    className={`text-xl font-black bg-gradient-to-r ${offer.color} bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(52,211,153,0.1)]`}
                  >
                    {offer.discount}
                  </div>
                </div>

                {/* অফার টাইটেল ও ডেসক্রিপশন */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </div>

              {/* কুপন কোড ও মেয়াদ সেকশন */}
              <div className="space-y-4 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-600" />
                    Limited Time Offer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-600" />
                    Expires: {offer.validUntil}
                  </span>
                </div>

                {/* ক্লিকেবল কপি কোড কন্টেইনার */}
                <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl">
                  <div className="flex-1 font-mono text-center text-sm font-bold tracking-widest text-emerald-400 bg-emerald-500/5 py-2 rounded-lg border border-emerald-500/10">
                    {offer.code}
                  </div>
                  <Button
                    onClick={() => handleCopyCode(offer.code)}
                    className="h-9 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- নো অফার ফাউন্ড / নোটিশ বাটন (Future API Hook) --- */}
        <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
          💡 নতুন প্রোমো কোড বা ক্লাব মেম্বারশিপ অফারগুলো সবার আগে পেতে আমাদের সাথেই থাকুন।
        </div>
      </div>
    </div>
  );
}
