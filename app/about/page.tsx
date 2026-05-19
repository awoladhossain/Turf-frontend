'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Star, Target, Trophy, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#090d16] font-jakarta text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 🌌 ব্যাকগ্রাউন্ড সাইבר গ্রিড ও লাইট অরবিটস */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.12] pointer-events-none" />

      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* --- ১. হিরো সেকশন (Hero Banner) --- */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
          >
            <Trophy className="h-3.5 w-3.5" />
            Our Mission & Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
          >
            Revolutionizing How Dhaka <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Plays Sports
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            টার্ফবুক (TurfBook) শুধুমাত্র একটি স্লট বুকিং সিস্টেম নয়; এটি ঢাকার ক্রীড়াপ্রেমীদের একটি
            আধুনিক কমিউনিটি। মাঠ খোঁজা থেকে শুরু করে বুকিং কনফার্মেশন—সবকিছুকে আমরা নিয়ে এসেছি আপনার
            আঙুলের ডগায়।
          </motion.p>
        </div>

        {/* --- ২. ডায়নামিক লাইভ স্ট্যাটস গ্রিড (Stats Showcase) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/40 backdrop-blur-md p-6 rounded-[24px] border border-slate-800/80 shadow-2xl"
        >
          {[
            {
              icon: <Users className="text-emerald-400" />,
              value: '১০,০০০+',
              label: 'সক্রিয় খেলোয়াড়',
            },
            {
              icon: <Trophy className="text-teal-400" />,
              value: '৫০+',
              label: 'প্রিমিয়াম পার্টনার টার্ফ',
            },
            {
              icon: <Zap className="text-amber-400" />,
              value: '১ মিনিট',
              label: 'ইনস্ট্যান্ট বুকিং স্পীড',
            },
            { icon: <Star className="text-purple-400" />, value: '৪.৯', label: 'গড় ইউজার রেটিং' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 space-y-2 border-r last:border-r-0 border-slate-800/60 col-span-1"
            >
              <div className="mx-auto w-fit p-2 bg-slate-950 rounded-xl border border-slate-800">
                {stat.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {stat.value}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* --- ৩. আমাদের লক্ষ্য ও কোর ভ্যালুজ (Core Values) --- */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why Athletes Choose Us
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              আমরা প্লেয়ারদের অভিজ্ঞতাকে সর্বোচ্চ অগ্রাধিকার দিই
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
                title: '১০০% ভেরিফাইড স্লট',
                desc: 'ডাবল বুকিং এড়াতে আমাদের রয়েছে অ্যাডভান্সড কনকারেন্সি লক মেকানিজম, যা আপনার সিলেক্ট করা স্লটটিকে সাথে সাথে লক করে ফেলে।',
              },
              {
                icon: <Target className="h-5 w-5 text-teal-400" />,
                title: 'সহজ নেভিগেশন ও ফিল্টার',
                desc: 'লোকেশন, খেলার ধরন, বাজেট এবং মাঠের সাইজ অনুযায়ী নিমিষেই ফিল্টার করে আপনার জন্য পারফেক্ট খেলার ভেন্যু খুঁজে বের করুন।',
              },
              {
                icon: <Zap className="h-5 w-5 text-amber-400" />,
                title: 'ইনস্ট্যান্ট রিফান্ড পলিসি',
                desc: 'কোনো কারণে ম্যাচ বাতিল করতে হলে আমাদের রয়েছে সহজ ও সচ্ছল রিফান্ড গাইডলাইন, যা সরাসরি আপনার ওয়ালেটে জমা হয়ে যাবে।',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 p-6 rounded-[22px] border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl w-fit mb-5">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{value.title}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- ৪. স্টোরি সেকশন উইথ ইমেজ প্লেসহোল্ডার (Our Journey) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-900/20 p-8 rounded-[32px] border border-slate-900">
          <div className="space-y-5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-l-2 border-emerald-500 pl-3">
              The Journey Behind
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">How TurfBook Started</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              আমরা যখন নিজেরা ঢাকার বিভিন্ন মাঠে ফুটবল খেলতে যেতাম, প্রায়ই দেখা যেত ফোন করে স্লট বুক
              করার পরেও মাঠে গিয়ে অন্য টিম খেলছে। এই ডাবল-বুকিং এবং মাঠ বুক করার প্রাচীন হ্যাসেল
              থেকে মুক্তি পেতেই জন্ম নেয় TurfBook।
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              আজ আমরা ঢাকার শীর্ষ ৫০টিরও বেশি এরেনার অফিশিয়াল ডিজিটাল বুকিং পার্টনার। আমাদের লক্ষ্য
              পুরো বাংলাদেশের খেলাধুলার অবকাঠামোকে সম্পূর্ণ অটোমেটেড ও স্মার্ট করে তোলা।
            </p>
          </div>

          {/* গ্লসি মডার্ন ইমেজ বক্স */}
          <div className="relative h-64 sm:h-80 w-full rounded-[24px] overflow-hidden border border-slate-800 shadow-xl group bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
              alt="Players on turf"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
