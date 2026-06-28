'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
  ChevronDown,
  Check,
  Sparkles,
  Clock,
  ArrowRight,
  Star,
  Flame,
  MessageSquare,
  CheckCircle2,
  Activity,
  Award,
  HelpCircle,
  TrendingUp,
  Map,
  ShieldAlert,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/ui/Magnetic';
import Image from 'next/image';
import { useSpotlight } from '@/hooks/useSpotlight';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Interactive Sports Types
type SportType = 'Football' | 'Cricket';

// Premium Featured Arenas
const FEATURED_ARENAS = [
  {
    id: 'chefs-table',
    name: "Chef's Table Courts",
    location: 'Gulshan, Dhaka',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviews: 142,
    price: '২,৫০০ BDT/hr',
    sports: ['Football', 'Cricket'],
    size: '7-a-side & 9-a-side',
    amenities: ['Floodlights', 'Cafe', 'Changing Rooms', 'Parking'],
    badge: 'Most Premium',
  },
  {
    id: 'jaff-arena',
    name: 'Jaff Arena',
    location: 'Dhanmondi, Dhaka',
    image:
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviews: 98,
    price: '২,২০০ BDT/hr',
    sports: ['Football'],
    size: '7-a-side',
    amenities: ['Premium Turf', 'Lounge', 'Water Station'],
    badge: "Players' Choice",
  },
  {
    id: 'mirpur-turf-city',
    name: 'Mirpur Turf City',
    location: 'Mirpur-11, Dhaka',
    image:
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviews: 114,
    price: '১,৮০০ BDT/hr',
    sports: ['Football', 'Cricket'],
    size: '7-a-side',
    amenities: ['Floodlights', 'Locker Rooms', 'Spectator Stand'],
    badge: 'Best Value',
  },
  {
    id: 'banani-fc-arena',
    name: 'Banani FC Arena',
    location: 'Banani, Dhaka',
    image:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviews: 86,
    price: '২,৬০০ BDT/hr',
    sports: ['Football'],
    size: '9-a-side',
    amenities: ['FIFA Approved Grass', 'Lounge', 'Shower Rooms'],
    badge: 'FIFA Standard',
  },
];

// Interactive Match Lobby Simulator Messages
const INITIAL_LOBBY_TEAMS = [
  {
    id: 1,
    captain: 'Rafsan Jamil',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80',
    teamName: 'Dhanmondi Falcons',
    arena: 'Jaff Arena',
    time: 'Tonight, 8:00 PM',
    slotsFilled: 5,
    slotsTotal: 7,
    roleNeeded: 'Midfielder needed',
    urgency: 'High',
  },
  {
    id: 2,
    captain: 'Tahmid Chowdhury',
    avatar:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80',
    teamName: 'Mirpur United FC',
    arena: 'Mirpur Turf City',
    time: 'Tomorrow, 6:30 PM',
    slotsFilled: 6,
    slotsTotal: 7,
    roleNeeded: 'Goalkeeper needed',
    urgency: 'Medium',
  },
  {
    id: 3,
    captain: 'Sarafat Kabir',
    avatar:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=80',
    teamName: 'Gulshan Rangers',
    arena: "Chef's Table Courts",
    time: 'Friday, 9:00 PM',
    slotsFilled: 4,
    slotsTotal: 9,
    roleNeeded: '2 Defenders & 1 Striker',
    urgency: 'Low',
  },
];

const NEIGHBORHOODS = [
  { name: 'Dhanmondi', count: 12, location: 'dhanmondi' },
  { name: 'Gulshan', count: 8, location: 'gulshan' },
  { name: 'Mirpur', count: 15, location: 'mirpur' },
  { name: 'Uttara', count: 10, location: 'uttara' },
  { name: 'Banani', count: 6, location: 'banani' },
  { name: 'Bashundhara', count: 9, location: 'bashundhara' },
];

const TESTIMONIALS = [
  {
    name: 'Tahmid Chowdhury',
    location: 'Dhanmondi',
    text: 'আগে মাঠে যেয়ে দেখতাম অন্য কেউ স্লট নিয়ে নিয়েছে বা ডাবল বুকিং হয়েছে। TurfBook-এ বুকিং দিলে সরাসরি স্লট লক হয়ে যায়। ঢাকার ফুটবলারদের জন্য এটা আশীর্বাদ!',
    avatar:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80',
    rating: 5,
  },
  {
    name: 'Nabil Ahmed',
    location: 'Gulshan',
    text: 'স্লট লকিং ফিচারটা আসলেই দারুণ! পেমেন্ট করার আগেই ৫ মিনিটের জন্য স্লটটা আমার নামে রিজার্ভ থাকে, ফলে অন্য কেউ বুক করতে পারে না। একদম সেফ প্রসেস।',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80',
    rating: 5,
  },
  {
    name: 'Sarafat Kabir',
    location: 'Mirpur',
    text: 'খুবই ইউজার-ফ্রেন্ডলি ইন্টারফেস। ম্যাচমেকিং লবির কারণে টিম মেম্বার কম থাকলেও যেকোনো মাঠে সহজেই প্লেয়ার ম্যানেজ করে খেলা যায়। খুবই হেল্পফুল ফিচার!',
    avatar:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=80',
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    question: 'টার্ফবুক দিয়ে কিভাবে মাঠ বুক করব?',
    answer:
      'খুবই সহজ! প্রথমে আপনার পছন্দের এলাকা ও খেলার ধরন সিলেক্ট করুন। এরপর পছন্দের টার্ফ এবং খেলার উপযোগী টাইম স্লট পছন্দ করে বুক বাটনে ক্লিক করুন। টাইম স্লটটি সাময়িকভাবে লক হওয়ার পর ৫ মিনিটের মধ্যে পেমেন্ট সম্পন্ন করলেই আপনার বুকিং কনফার্ম হয়ে যাবে।',
  },
  {
    question: 'ইনস্ট্যান্ট স্লট লকিং কিভাবে কাজ করে?',
    answer:
      'যখন আপনি একটি স্লট বুকিং করার প্রসেস শুরু করেন, আমাদের সিকিউর লকিং অ্যালগরিদম ঠিক সেই মিলিসেকেন্ডেই স্লটটি অন্য সকলের জন্য ৫ মিনিটের জন্য ব্লক বা লক করে দেয়। এই সময়ের মধ্যে আপনি নিশ্চিন্তে পেমেন্ট সম্পূর্ণ করতে পারবেন, ফলে কোনো ডাবল-বুকিং হওয়ার সম্ভাবনা নেই।',
  },
  {
    question: 'পেমেন্ট মেথডগুলো কি কি?',
    answer:
      'আমরা বাংলাদেশের শীর্ষস্থানীয় সব পেমেন্ট মেথড সাপোর্ট করি। আপনি বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket) এর পাশাপাশি যেকোনো ব্যাংক কার্ড ব্যবহার করে সহজেই পেমেন্ট সম্পন্ন করতে পারবেন।',
  },
  {
    question: 'বুকিং বাতিল বা রিফান্ড পলিসি কি?',
    answer:
      'প্রতিটি ভেন্যুর নিজস্ব ক্যান্সেলেশন পলিসি রয়েছে। সাধারণত খেলার নির্ধারিত সময়ের ২৪ ঘণ্টা পূর্বে বুকিং বাতিল করলে সম্পূর্ণ রিফান্ড পাওয়া যায়। আপনার ড্যাশবোর্ড থেকে সহজেই রিফান্ড রিকোয়েস্ট করতে পারবেন।',
  },
];

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportType>('Football');
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic Live State Variables
  const [liveReservations, setLiveReservations] = useState(4892);
  const [activeSportFilter, setActiveSportFilter] = useState<SportType | 'All'>('All');

  // Interactive Lock Simulator State
  const [lockState, setLockState] = useState<'IDLE' | 'LOCKING' | 'LOCKED'>('IDLE');
  const [lockTimeRemaining, setLockTimeRemaining] = useState(300); // 5 minutes in seconds
  const [lockTimerActive, setLockTimerActive] = useState(false);
  const lockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Interactive Lobby State
  const [lobbyTeams, setLobbyTeams] = useState(INITIAL_LOBBY_TEAMS);
  const [joinedLobbies, setJoinedLobbies] = useState<number[]>([]);

  // GSAP Refs for entrance triggers
  const { containerRef: pageContainerRef, handleMouseMove } = useSpotlight();
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const trustBadgeContainerRef = useRef<HTMLDivElement>(null);
  const locationChipsRef = useRef<HTMLDivElement>(null);

  // Glowing orbit refs
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);

  // Sport Dropdown Ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  const POPULAR_LOCATIONS = ['Banani', 'Mirpur', 'Dhanmondi', 'Gulshan'];

  // --- Dynamic Counter Logic ---
  useEffect(() => {
    const reservationsInterval = setInterval(() => {
      setLiveReservations((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 6000);

    return () => clearInterval(reservationsInterval);
  }, []);

  // --- Interactive Lock Simulator Countdown Logic ---
  useEffect(() => {
    if (lockTimerActive && lockTimeRemaining > 0) {
      lockIntervalRef.current = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            setLockTimerActive(false);
            setLockState('IDLE');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
    }

    return () => {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
    };
  }, [lockTimerActive, lockTimeRemaining]);

  const handleLockSimulation = () => {
    if (lockState === 'LOCKED') {
      setLockState('IDLE');
      setLockTimerActive(false);
      setLockTimeRemaining(300);
      return;
    }

    setLockState('LOCKING');
    setTimeout(() => {
      setLockState('LOCKED');
      setLockTimeRemaining(300);
      setLockTimerActive(true);
    }, 1000);
  };

  const formatLockTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleJoinLobby = (id: number) => {
    if (joinedLobbies.includes(id)) {
      setJoinedLobbies((prev) => prev.filter((item) => item !== id));
      setLobbyTeams((prev) =>
        prev.map((team) => {
          if (team.id === id) {
            return { ...team, slotsFilled: team.slotsFilled - 1 };
          }
          return team;
        })
      );
    } else {
      setJoinedLobbies((prev) => [...prev, id]);
      setLobbyTeams((prev) =>
        prev.map((team) => {
          if (team.id === id) {
            return { ...team, slotsFilled: team.slotsFilled + 1 };
          }
          return team;
        })
      );
    }
  };

  // --- GSAP Entrance & Scroll Triggers ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const ctx = gsap.context(() => {
      const elementsToClean = [];
      if (badgeRef.current) elementsToClean.push(badgeRef.current);
      if (titleRef.current) elementsToClean.push(titleRef.current);
      if (subtitleRef.current) elementsToClean.push(subtitleRef.current);
      if (searchBarRef.current) elementsToClean.push(searchBarRef.current);
      if (trustBadgeContainerRef.current) elementsToClean.push(trustBadgeContainerRef.current);
      if (locationChipsRef.current) elementsToClean.push(locationChipsRef.current);

      if (elementsToClean.length > 0) {
        gsap.set(elementsToClean, { opacity: 0, y: 20 });
      }
      if (orbit1Ref.current) gsap.set(orbit1Ref.current, { opacity: 0, scale: 0.95 });
      if (orbit2Ref.current) gsap.set(orbit2Ref.current, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

      const orbits = [];
      if (orbit1Ref.current) orbits.push(orbit1Ref.current);
      if (orbit2Ref.current) orbits.push(orbit2Ref.current);
      if (orbits.length > 0) {
        tl.to(orbits, {
          opacity: (index) => (index === 0 ? 0.35 : 0.2),
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
        });
      }

      if (badgeRef.current) {
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8');
      }

      if (titleRef.current) {
        tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6');
      }

      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
      }

      if (searchBarRef.current) {
        tl.to(
          searchBarRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.1)',
          },
          '-=0.3'
        );
      }

      if (locationChipsRef.current) {
        tl.to(locationChipsRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.4');
      }

      if (trustBadgeContainerRef.current) {
        tl.to(trustBadgeContainerRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
      }

      const sectionsToReveal = [
        '.how-it-works-section',
        '.concurrency-section',
        '.arenas-section',
        '.neighborhoods-section',
        '.lobby-section',
        '.stats-section',
        '.testimonials-section',
        '.faq-section',
        '.cta-banner-section',
      ];

      sectionsToReveal.forEach((selector) => {
        const targetElements = pageContainerRef.current?.querySelectorAll(
          `${selector} .scroll-reveal`
        );
        if (targetElements && targetElements.length > 0) {
          gsap.fromTo(
            targetElements,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: selector,
                start: 'top 85%',
              },
            }
          );
        }
      });
    }, pageContainerRef);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      ctx.revert();
    };
  }, []);

  const selectLocationChip = (location: string, e: React.MouseEvent<HTMLSpanElement>) => {
    setSearchLocation(location);
    const target = e.currentTarget;
    gsap.fromTo(target, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
  };

  const filteredArenas = FEATURED_ARENAS.filter((arena) => {
    if (activeSportFilter === 'All') return true;
    return arena.sports.includes(activeSportFilter);
  });

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#050811] font-jakarta text-white select-none overflow-hidden"
      style={
        {
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.14] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(650px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)',
        }}
      />

      {/* Floating neon orbits blur */}
      <div
        ref={orbit1Ref}
        className="absolute top-12 left-1/4 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none will-change-transform"
      />
      <div
        ref={orbit2Ref}
        className="absolute top-[550px] right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-[#1e6b3e]/6 blur-[150px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 relative z-10 py-16">
        {/* ================= HERO SECTION ================= */}
        <section className="flex flex-col items-center text-center space-y-10 pt-6 max-w-4xl mx-auto">
          {/* Top Live Badge */}
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={15} actionStrength={0.1}>
              <div
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md cursor-pointer hover:bg-emerald-500/15 transition-all duration-300 shadow-sm"
                data-cursor-text="DHAKA"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>{liveReservations.toLocaleString()} Bookings Secured in Dhaka</span>
                <Sparkles className="h-3.5 w-3.5 text-emerald-450 animate-pulse" />
              </div>
            </Magnetic>
          </div>

          {/* Headline - semantic & accessible without split spans, preventing clipping bugs */}
          <div className="space-y-5">
            <h1
              ref={titleRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white will-change-transform"
            >
              Find Your Pitch,
              <br />
              Own Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 via-emerald-350 to-teal-400 drop-shadow-[0_4px_20px_rgba(16,185,129,0.25)]">
                Game Time
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed will-change-transform"
            >
              ঢাকা শহরের সেরা সব ভেরিফাইড ফুটবল ও ক্রিকেট টার্ফ খুঁজুন এবং বুক করুন সহজেই।{' '}
              <span className="text-emerald-400 font-bold">
                স্লট বুকিংয়ে ডাবল-বুকিংয়ের কোনো ঝামেলা ছাড়াই!
              </span>
            </p>
          </div>

          {/* Search Engine Wrapper - Segmented Design (Like Airbnb/Playo) */}
          <div className="w-full max-w-3xl flex flex-col items-center space-y-4 pt-2">
            <div
              ref={searchBarRef}
              className="relative z-30 w-full bg-[#0d1425]/45 backdrop-blur-3xl p-2 rounded-3xl border border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col md:flex-row items-center justify-between hover:border-slate-800 focus-within:border-emerald-500/25 transition-all duration-300 will-change-transform"
            >
              {/* Segment 1: Location */}
              <div className="w-full md:w-1/2 flex items-center gap-3 px-4 py-2.5 rounded-2xl md:rounded-full hover:bg-slate-950/40 transition-colors duration-200 group">
                <MapPin className="h-5 w-5 text-slate-500 group-hover:text-emerald-450 transition-colors duration-200 flex-shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[9px] font-black text-emerald-450 uppercase tracking-widest">
                    Location
                  </span>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="কোথায় খেলতে চান? (উদা: বনানী)"
                    className="w-full bg-transparent outline-none text-xs font-bold text-white placeholder-slate-500 focus:placeholder-slate-450 mt-0.5"
                  />
                </div>
              </div>

              <div className="hidden md:block h-8 w-px bg-slate-800/80" />

              {/* Segment 2: Sport Selector */}
              <div
                ref={dropdownRef}
                className="w-full md:w-1/4 relative px-4 py-2.5 rounded-2xl md:rounded-full hover:bg-slate-950/40 transition-colors duration-200 cursor-pointer"
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-slate-500 flex-shrink-0" />
                    <div className="text-left">
                      <span className="block text-[9px] font-black text-emerald-450 uppercase tracking-widest">
                        Sport
                      </span>
                      <span className="block text-xs font-bold text-white mt-0.5">
                        {selectedSport}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isSportDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                <AnimatePresence>
                  {isSportDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-16 left-0 w-full bg-[#0b0f19] border border-slate-850 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl"
                    >
                      {[
                        { value: 'Football' as SportType, icon: '⚽' },
                        { value: 'Cricket' as SportType, icon: '🏏' },
                      ].map((sport) => (
                        <button
                          key={sport.value}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSport(sport.value);
                            setIsSportDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedSport === sport.value
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{sport.icon}</span>
                            <span>{sport.value}</span>
                          </span>
                          {selectedSport === sport.value && (
                            <Check className="h-4 w-4 text-emerald-450" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block h-8 w-px bg-slate-800/80" />

              {/* Segment 3: Date */}
              <div className="w-full md:w-1/4 flex items-center gap-3 px-4 py-2.5 rounded-2xl md:rounded-full hover:bg-slate-950/40 transition-colors duration-200 cursor-pointer">
                <Calendar className="h-5 w-5 text-slate-500 flex-shrink-0" />
                <div className="text-left">
                  <span className="block text-[9px] font-black text-emerald-450 uppercase tracking-widest">
                    Time
                  </span>
                  <span className="block text-xs font-bold text-white mt-0.5">
                    Today / Tomorrow
                  </span>
                </div>
              </div>

              {/* Search Button */}
              <div className="w-full md:w-auto p-1.5 md:p-0">
                <Magnetic range={15} actionStrength={0.2}>
                  <Link href="/turfs" className="w-full md:w-auto" data-cursor-text="PLAY">
                    <Button className="w-full md:w-auto h-12 md:h-12 px-8 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-2xl md:rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/10 active:scale-95">
                      <Search className="h-4 w-4 stroke-[2.5]" />
                      <span>Find Arenas</span>
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Chips tags */}
            <div
              ref={locationChipsRef}
              className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500 font-bold uppercase tracking-wider pt-2.5 will-change-transform"
            >
              <span className="mr-1 text-[10px]">Popular:</span>
              {POPULAR_LOCATIONS.map((loc) => (
                <span
                  key={loc}
                  onClick={(e) => selectLocationChip(loc, e)}
                  className={`px-4 py-1.5 rounded-full border text-[10px] font-black cursor-pointer transition-all duration-300 select-none ${
                    searchLocation === loc
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-sm scale-105'
                      : 'bg-[#0b101c]/20 border-slate-900 hover:border-slate-800 hover:text-slate-350'
                  }`}
                  data-cursor-text={loc.toUpperCase()}
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Social Badges with hover animations */}
          <div
            ref={trustBadgeContainerRef}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 pt-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-t border-slate-900/60 w-full max-w-2xl will-change-transform"
          >
            <div className="flex items-center gap-2.5 cursor-pointer hover:text-slate-350 transition-colors duration-300">
              <Users className="h-4.5 w-4.5 text-emerald-400" />
              <span>10K+ Active Players</span>
            </div>
            <div className="flex items-center gap-2.5 cursor-pointer hover:text-slate-350 transition-colors duration-300">
              <Trophy className="h-4.5 w-4.5 text-emerald-400" />
              <span>50+ Top Arenas In Dhaka</span>
            </div>
            <div className="flex items-center gap-2.5 cursor-pointer hover:text-slate-350 transition-colors duration-300">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>Instant Secure Lock</span>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS SECTION ================= */}
        <section className="how-it-works-section space-y-12 py-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <Play className="h-3 w-3 fill-emerald-450 text-emerald-450" />
              <span>Simple Booking Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              কিভাবে বুক করবেন?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              ৩টি সহজ পদক্ষেপে বুকিং সম্পন্ন করে খেলার স্লট কনফার্ম করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'মাঠ ও সময় খুঁজুন',
                desc: 'আপনার খেলার উপযোগী লোকেশন, পছন্দের খেলা (ফুটবল বা ক্রিকেট) এবং সময় সিলেক্ট করে মাঠ খুঁজুন।',
                color: 'from-emerald-500/10 to-teal-500/5',
              },
              {
                step: '02',
                title: 'স্লট লক করুন',
                desc: 'কাঙ্ক্ষিত স্লটটিতে ক্লিক করলে সেটি ৫ মিনিটের জন্য লক হয়ে যাবে। এই ৫ মিনিটে অন্য কেউ এটি নিতে পারবে না।',
                color: 'from-emerald-600/15 to-emerald-500/5',
              },
              {
                step: '03',
                title: 'মাঠে নামুন',
                desc: 'সহজ গেটওয়ে দিয়ে পেমেন্ট সম্পূর্ণ করে কনফার্মেশন রিসিভ করুন এবং ফ্রেন্ডসদের নিয়ে মাঠে চলে যান।',
                color: 'from-emerald-500/10 to-emerald-800/5',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`scroll-reveal relative p-8 rounded-3xl bg-gradient-to-b ${item.color} border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
              >
                <div className="absolute top-2 right-4 text-7xl font-black text-slate-900/20 font-mono select-none group-hover:text-emerald-500/10 transition-colors duration-300">
                  {item.step}
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors duration-250">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FEATURED ARENAS GRID SECTION ================= */}
        <section className="arenas-section space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 scroll-reveal">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                <Star className="h-3 w-3 fill-emerald-450 text-emerald-400" />
                <span>Handpicked Pitches</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                জনপ্রিয় প্রিমিয়াম মাঠসমূহ
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                ঢাকার সেরা সব হাই-কোয়ালিটি টার্ফ ভেন্যু বুকিং করুন মুহূর্তেই।
              </p>
            </div>

            {/* Premium Filter Pills */}
            <div className="flex gap-1.5 bg-[#0d1425]/40 border border-slate-900 p-1.5 rounded-2xl">
              {(['All', 'Football', 'Cricket'] as const).map((sport) => (
                <button
                  key={sport}
                  onClick={() => setActiveSportFilter(sport)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    activeSportFilter === sport
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Arenas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArenas.map((arena) => (
              <div
                key={arena.id}
                className="scroll-reveal group p-4 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-emerald-500/20 hover:bg-[#0d1425]/25 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-900 relative group">
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#050811]/90 backdrop-blur-md border border-slate-800 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded text-emerald-400 shadow-sm">
                      {arena.badge}
                    </div>

                    <Image
                      src={arena.image}
                      alt={arena.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-550 uppercase tracking-widest">
                      <span>{arena.location}</span>
                      <div className="flex items-center gap-0.5 text-emerald-450 font-black">
                        <Star className="h-3 w-3 fill-emerald-400 text-emerald-450" />
                        <span>{arena.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors duration-200 truncate">
                      {arena.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-900/60 pb-2">
                    <span>⚽ {arena.size}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/15">
                      {arena.price}
                    </span>
                  </div>

                  {/* Amenities List */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {arena.amenities.map((amenity, ai) => (
                      <span
                        key={ai}
                        className="text-[9px] font-bold text-slate-500 bg-[#050811]/50 border border-slate-900 px-2 py-0.5 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <Magnetic range={15} actionStrength={0.15}>
                  <Link href="/turfs" className="block pt-1" data-cursor-text="BOOK">
                    <button className="w-full py-3 bg-[#050811] border border-slate-900 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                      <span>Book Slot Now</span>
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-455" />
                    </button>
                  </Link>
                </Magnetic>
              </div>
            ))}
          </div>
        </section>

        {/* ================= BROWSE BY NEIGHBORHOODS ================= */}
        <section className="neighborhoods-section space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <Map className="h-3.5 w-3.5" />
              <span>Location Browser</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              এলাকা অনুযায়ী খুঁজুন
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              আপনার এরিয়াতে কোন কোন টার্ফ ভেন্যু আছে তা দেখে নিন এক নজরে।
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {NEIGHBORHOODS.map((area, index) => (
              <Link
                key={index}
                href={`/turfs?location=${area.location}`}
                className="scroll-reveal group block p-5 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-emerald-500/20 hover:bg-[#0d1425]/25 transition-all duration-300 text-center"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-900 flex items-center justify-center mx-auto group-hover:border-emerald-500/30 transition-all duration-300">
                    <MapPin className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors duration-200">
                      {area.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      {area.count} Pitches
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= REAL-TIME SLOT LOCKING EXPLANATION & SANDBOX ================= */}
        <section className="concurrency-section space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <Activity className="h-3.5 w-3.5 text-emerald-450 animate-pulse" />
              <span>Real-Time Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              ইনস্ট্যান্ট স্লট লকিং সিস্টেম
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              আমাদের প্ল্যাটফর্মে কোনো ডাবল বুকিং হওয়ার সুযোগ নেই। আপনি যখন একটি স্লট সিলেক্ট করেন,
              আমাদের রিয়েল-টাইম ইঞ্জিন স্লটটিকে সাথে সাথেই ব্লক করে দেয়।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Box: System Process */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-[#0d1425]/15 border border-slate-900 flex flex-col justify-between space-y-6 scroll-reveal relative overflow-hidden">
              <div className="absolute right-0 top-0 w-60 h-60 bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  হাউ ইট ওয়ার্কস: ডাবল বুকিং প্রতিরোধ
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  অনেকেই একই সময়ে একই টার্ফ বুক করার চেষ্টা করলে সাধারণত ডাবল বুকিং-এর ঘটনা ঘটে।
                  TurfBook এই সমস্যার সমাধানে ব্যবহার করে ডিরেক্ট ডেটাবেস রো-লকিং মেকানিজম।
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    {
                      title: '১. স্লট লক শুরু',
                      text: 'আপনি যখন স্লট নির্বাচন করবেন, আপনার জন্য ৫ মিনিটের একটি লক শুরু হবে।',
                    },
                    {
                      title: '২. সার্ভার লক',
                      text: 'এই সময়ের জন্য ওই মাঠের ডেটাবেস রোটি অন্য সকল ইউজারের বুকিং চেষ্টা ব্লক করে দিবে।',
                    },
                    {
                      title: '৩. পেমেন্ট ও কনফার্ম',
                      text: '৫ মিনিটের ভেতর পেমেন্ট সম্পন্ন করলেই বুকিং কনফার্ম, না করলে লক রিলিজ হয়ে যাবে।',
                    },
                  ].map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-455 flex items-center justify-center text-[10px] font-black font-mono flex-shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{step.title}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-900/60 text-center">
                <div className="space-y-1 p-3.5 bg-[#050811]/60 border border-slate-900 rounded-2xl">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    Lock Latency
                  </span>
                  <div className="text-base font-black text-emerald-450 font-mono">1.2ms</div>
                </div>
                <div className="space-y-1 p-3.5 bg-[#050811]/60 border border-slate-900 rounded-2xl">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    Accuracy
                  </span>
                  <div className="text-base font-black text-white font-mono">100%</div>
                </div>
                <div className="space-y-1 p-3.5 bg-[#050811]/60 border border-slate-900 rounded-2xl">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    Efficiency
                  </span>
                  <div className="text-base font-black text-emerald-450 font-mono">100% Thread</div>
                </div>
              </div>
            </div>

            {/* Right Box: Interactive Sandbox Simulator */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-b from-[#111a2d]/10 to-[#080d1a]/10 border border-emerald-500/20 shadow-xl flex flex-col justify-between space-y-6 scroll-reveal relative overflow-hidden">
              <div className="absolute inset-[1px] bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent rounded-[22px] pointer-events-none" />

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Sandbox Playground
                  </span>
                  <h3 className="text-lg font-bold text-white">লকিং স্যান্ডবক্স টেস্ট করুন</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <Zap className="h-4 w-4" />
                </div>
              </div>

              {/* Interactive Sandbox Canvas */}
              <div className="bg-[#050811]/80 border border-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[180px] relative">
                {lockState === 'IDLE' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#0d1425] border border-slate-900 rounded-full w-fit mx-auto text-slate-400">
                      <Clock className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">স্লট লকিং টেস্ট করুন</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[260px] mx-auto font-medium">
                        বাটনে ক্লিক করে লাইভ স্লট লকিং ও কাউন্টডাউন টাইমার পরীক্ষা করুন।
                      </p>
                    </div>
                  </div>
                )}

                {lockState === 'LOCKING' && (
                  <div className="space-y-3">
                    <div className="h-9 w-9 rounded-full border-2 border-emerald-500/20 border-t-emerald-455 animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-emerald-400">Acquiring Core Mutex...</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-1">
                        Checking slot availability...
                      </p>
                    </div>
                  </div>
                )}

                {lockState === 'LOCKED' && (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mx-auto animate-pulse">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Slot Securely Locked</span>
                    </div>

                    <div className="text-4xl font-mono font-black tracking-tight text-white">
                      {formatLockTime(lockTimeRemaining)}
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold max-w-[280px] mx-auto bg-[#050811] p-3 rounded-xl border border-slate-900">
                      🔒{' '}
                      <span className="font-mono text-emerald-450 font-bold">TBOOK-LOCK-8395X</span>{' '}
                      ইজ একটিভ। এই মাঠের স্লটটি এখন সবার জন্য ব্লকড রয়েছে।
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLockSimulation}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 active:scale-97 cursor-pointer border ${
                  lockState === 'LOCKED'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-450 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450 hover:bg-emerald-500/20'
                }`}
              >
                {lockState === 'LOCKED' ? 'Release Locked Slot' : 'Test Lock Concurrency'}
              </button>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE MATCH LOBBY ================= */}
        <section className="lobby-section space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <Users className="h-4 w-4" />
              <span>Interactive Matchmaking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              খেলোয়াড় ম্যাচমেকিং লবি
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              আপনার ফুটবল গ্রুপে প্লেয়ার কম? কিংবা আপনি একা খেলতে চান? টার্ফবুক লবিতে জয়েন করুন এবং
              নতুন প্লেয়ারদের সাথে ম্যাচ খেলুন।
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {lobbyTeams.map((team) => {
              const isJoined = joinedLobbies.includes(team.id);
              const progressPercentage = (team.slotsFilled / team.slotsTotal) * 100;

              return (
                <div
                  key={team.id}
                  className="scroll-reveal p-6 rounded-3xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left part: Profile and Team */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={team.avatar}
                      alt={team.captain}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover border border-slate-800 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-white">{team.teamName}</h4>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            team.urgency === 'High'
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-450'
                              : team.urgency === 'Medium'
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-450'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450'
                          }`}
                        >
                          {team.urgency} Urgency
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        📍 {team.arena} | ⏰ {team.time}
                      </p>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-2 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
                        ⚡ {team.roleNeeded}
                      </span>
                    </div>
                  </div>

                  {/* Central Progress indicator */}
                  <div className="flex-1 max-w-xs space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-550 uppercase tracking-widest">
                      <span>Lobby Capacity</span>
                      <span className="text-white font-mono">
                        {team.slotsFilled} / {team.slotsTotal} Players
                      </span>
                    </div>
                    <div className="h-2 bg-[#050811] rounded-full overflow-hidden border border-slate-900">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive CTA buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleJoinLobby(team.id)}
                      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-350 active:scale-95 cursor-pointer border ${
                        isJoined
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-[#050811] border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isJoined ? 'Joined ✔' : 'Join Match Lobby'}
                    </button>

                    <button className="p-3 bg-[#050811] border border-slate-900 hover:border-slate-800 text-slate-450 hover:text-white rounded-xl transition-colors duration-300 cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= PLATFORM IMPACT STATS ================= */}
        <section className="stats-section space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <Award className="h-3.5 w-3.5" />
              <span>Platform Statistics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              সংখ্যায় আমাদের প্ল্যাটফর্ম
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              আমরা ঢাকার খেলাধুলার বুকিং প্রসেস সম্পূর্ণ ডিজিটালাইজড করে তুলছি।
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="h-5 w-5 text-emerald-450" />,
                title: '১০০,০০০+',
                label: 'Matches Played',
                desc: 'সফলভাবে অনুষ্ঠিত ম্যাচ',
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-emerald-455" />,
                title: '১০০% সিকিউর',
                label: 'Payment Lock',
                desc: 'সহজ গেটওয়ে পেমেন্ট প্রসেস',
              },
              {
                icon: <Trophy className="h-5 w-5 text-emerald-450" />,
                title: '৫০+ এরেনা',
                label: 'Verified Partners',
                desc: 'গুলশান, মিরপুর ও ধানমন্ডির মাঠ',
              },
              {
                icon: <Zap className="h-5 w-5 text-emerald-455" />,
                title: '০% ডাবল বুকিং',
                label: 'Double-Booking Rate',
                desc: 'অটো স্লট লকিং প্রযুক্তির কারণে',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="scroll-reveal p-6 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-305 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-900 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {stat.title}
                    </h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        <section className="testimonials-section space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Customer Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              খেলোয়াড়দের মতামত
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              দেখে নিন আমাদের প্ল্যাটফর্ম ব্যবহার করে ঢাকার খেলোয়াড়রা কি বলছেন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, index) => (
              <div
                key={index}
                className="scroll-reveal p-6 rounded-3xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-emerald-450 text-emerald-450" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-900/60">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover border border-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-black text-white">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="faq-section space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              সাধারণ জিজ্ঞাসা
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              টার্ফবুক নিয়ে সাধারণ কিছু প্রশ্ন ও তার উত্তর।
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="scroll-reveal rounded-2xl bg-[#0d1425]/15 border border-slate-900 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-950/20 transition-all"
                >
                  <span className="text-sm font-black text-white">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-xs text-slate-400 font-semibold leading-relaxed border-t border-slate-950/20">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ================= HIGH CONVERSION CTA BANNER ================= */}
        <section className="cta-banner-section pt-4">
          <div className="scroll-reveal bg-gradient-to-b from-[#111a2d]/20 to-[#080d1a]/20 border border-emerald-500/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Flame className="h-3.5 w-3.5 fill-emerald-400 text-emerald-450 animate-bounce" />
              <span>Get in the Game</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Play Your Match?
            </h2>
            <p className="text-sm text-slate-400 font-medium max-w-xl leading-relaxed">
              ঢাকার যেকোনো টার্ফ আজই বুক করুন টার্ফবুকের সাথে। মাত্র কয়েক ক্লিকে আপনার টাইম স্লট লক
              করুন এবং টিম নিয়ে খেলতে নামুন!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
              <Magnetic range={15} actionStrength={0.2}>
                <Link href="/turfs" className="w-full sm:w-auto" data-cursor-text="PLAY">
                  <Button className="w-full sm:w-auto px-8 py-6 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/10 active:scale-95">
                    <span>Book Your Turf Now</span>
                    <ArrowRight className="h-4 w-4 text-white stroke-[2.5]" />
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
