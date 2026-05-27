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
  Heart,
  Flame,
  Shield,
  MessageSquare,
  Send,
  Bell,
  CheckCircle2,
  ChevronRight,
  Activity,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/ui/Magnetic';

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
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviews: 142,
    price: "২,৫০০ BDT/hr",
    sports: ['Football', 'Cricket'],
    size: "7-a-side & 9-a-side",
    amenities: ["Floodlights", "Cafe", "Changing Rooms", "Parking"],
    badge: "Most Premium"
  },
  {
    id: 'jaff-arena',
    name: "Jaff Arena",
    location: "Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviews: 98,
    price: "২,২০০ BDT/hr",
    sports: ['Football'],
    size: "7-a-side",
    amenities: ["Premium Turf", "Lounge", "Water Station"],
    badge: "Players' Choice"
  },
  {
    id: 'mirpur-turf-city',
    name: "Mirpur Turf City",
    location: "Mirpur-11, Dhaka",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviews: 114,
    price: "১,৮০০ BDT/hr",
    sports: ['Football', 'Cricket'],
    size: "7-a-side",
    amenities: ["Floodlights", "Locker Rooms", "Spectator Stand"],
    badge: "Best Value"
  },
  {
    id: 'banani-fc-arena',
    name: "Banani FC Arena",
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviews: 86,
    price: "২,৬০০ BDT/hr",
    sports: ['Football'],
    size: "9-a-side",
    amenities: ["FIFA Approved Grass", "Lounge", "Shower Rooms"],
    badge: "FIFA Standard"
  }
];

// Interactive Match Lobby Simulator Messages
const INITIAL_LOBBY_TEAMS = [
  {
    id: 1,
    captain: "Rafsan Jamil",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80",
    teamName: "Dhanmondi Falcons",
    arena: "Jaff Arena",
    time: "Tonight, 8:00 PM",
    slotsFilled: 5,
    slotsTotal: 7,
    roleNeeded: "Midfielder needed",
    urgency: "High"
  },
  {
    id: 2,
    captain: "Tahmid Chowdhury",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80",
    teamName: "Mirpur United FC",
    arena: "Mirpur Turf City",
    time: "Tomorrow, 6:30 PM",
    slotsFilled: 6,
    slotsTotal: 7,
    roleNeeded: "Goalkeeper needed",
    urgency: "Medium"
  },
  {
    id: 3,
    captain: "Sarafat Kabir",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=80",
    teamName: "Gulshan Rangers",
    arena: "Chef's Table Courts",
    time: "Friday, 9:00 PM",
    slotsFilled: 4,
    slotsTotal: 9,
    roleNeeded: "2 Defenders & 1 Striker",
    urgency: "Low"
  }
];

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportType>('Football');
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);

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
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const trustBadgeContainerRef = useRef<HTMLDivElement>(null);
  const locationChipsRef = useRef<HTMLDivElement>(null);
  
  // Glowing orbit refs
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);

  // Icon refs for hover physics
  const usersIconRef = useRef<HTMLDivElement>(null);
  const trophyIconRef = useRef<HTMLDivElement>(null);
  const shieldIconRef = useRef<HTMLDivElement>(null);

  // Sport Dropdown Ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Popular locations data
  const POPULAR_LOCATIONS = ['Banani', 'Mirpur', 'Dhanmondi', 'Gulshan'];

  // --- Dynamic Counter Logic ---
  useEffect(() => {
    // Dynamic counter increment to simulate a real-time active sports ecosystem
    const reservationsInterval = setInterval(() => {
      setLiveReservations(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 6000);

    return () => clearInterval(reservationsInterval);
  }, []);

  // --- Interactive Lock Simulator Countdown Logic ---
  useEffect(() => {
    if (lockTimerActive && lockTimeRemaining > 0) {
      lockIntervalRef.current = setInterval(() => {
        setLockTimeRemaining(prev => {
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

  // Click handler to trigger simulated concurrency lock
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
    }, 1200);
  };

  const formatLockTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Join match lobby button interaction handler
  const handleJoinLobby = (id: number) => {
    if (joinedLobbies.includes(id)) {
      // Unjoin
      setJoinedLobbies(prev => prev.filter(item => item !== id));
      setLobbyTeams(prev => prev.map(team => {
        if (team.id === id) {
          return { ...team, slotsFilled: team.slotsFilled - 1 };
        }
        return team;
      }));
    } else {
      // Join
      setJoinedLobbies(prev => [...prev, id]);
      setLobbyTeams(prev => prev.map(team => {
        if (team.id === id) {
          return { ...team, slotsFilled: team.slotsFilled + 1 };
        }
        return team;
      }));
    }
  };

  // --- GSAP Entrance & Scroll Triggers ---
  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Create GSAP context for clean triggers
    const ctx = gsap.context(() => {
      // --- 1. Set clean initial states ---
      const elementsToClean = [];
      if (badgeRef.current) elementsToClean.push(badgeRef.current);
      if (subtitleRef.current) elementsToClean.push(subtitleRef.current);
      if (searchBarRef.current) elementsToClean.push(searchBarRef.current);
      if (trustBadgeContainerRef.current) elementsToClean.push(trustBadgeContainerRef.current);
      if (locationChipsRef.current) elementsToClean.push(locationChipsRef.current);

      if (elementsToClean.length > 0) {
        gsap.set(elementsToClean, { opacity: 0, y: 20 });
      }
      if (orbit1Ref.current) gsap.set(orbit1Ref.current, { opacity: 0, scale: 0.95 });
      if (orbit2Ref.current) gsap.set(orbit2Ref.current, { opacity: 0, scale: 0.95 });
      
      const charAnims = pageContainerRef.current?.querySelectorAll(".char-anim");
      if (charAnims && charAnims.length > 0) {
        gsap.set(charAnims, { opacity: 0, y: 30, rotateX: -30, transformOrigin: "top center" });
      }

      // --- 2. Entrance animation timeline ---
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      // Orbits scale in gently
      const orbits = [];
      if (orbit1Ref.current) orbits.push(orbit1Ref.current);
      if (orbit2Ref.current) orbits.push(orbit2Ref.current);
      if (orbits.length > 0) {
        tl.to(orbits, {
          opacity: (index) => (index === 0 ? 0.25 : 0.15),
          scale: 1,
          duration: 1.4,
          stagger: 0.2
        });
      }

      if (badgeRef.current) {
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=1.0');
      }
      
      // 3D character cascade reveal
      if (charAnims && charAnims.length > 0) {
        tl.to(charAnims, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.012,
          duration: 0.8,
          ease: 'power4.out'
        }, '-=0.8');
      }
      
      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
      }
      
      if (searchBarRef.current) {
        tl.to(searchBarRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: 'back.out(1.15)'
        }, '-=0.4');
      }

      if (locationChipsRef.current) {
        tl.to(locationChipsRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6');
      }
      
      if (trustBadgeContainerRef.current) {
        tl.to(trustBadgeContainerRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }

      // --- 3. Scroll Trigger Reveals for page sections ---
      const sectionsToReveal = [
        ".concurrency-section",
        ".arenas-section",
        ".lobby-section",
        ".stats-section",
        ".cta-banner-section"
      ];

      sectionsToReveal.forEach((selector) => {
        const targetElements = pageContainerRef.current?.querySelectorAll(`${selector} .scroll-reveal`);
        if (targetElements && targetElements.length > 0) {
          gsap.fromTo(targetElements,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: selector,
                start: "top 82%",
              }
            }
          );
        }
      });

      // --- 4. Floating animations for orbits ---
      if (orbit1Ref.current) {
        gsap.to(orbit1Ref.current, {
          y: '+=20',
          x: '-=15',
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (orbit2Ref.current) {
        gsap.to(orbit2Ref.current, {
          y: '-=20',
          x: '+=15',
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5
        });
      }
    }, pageContainerRef);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      ctx.revert();
    };
  }, []);

  // --- Spotlight Mouse-Tracking coordinates logic ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = pageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(container, {
      '--spotlight-x': `${x}px`,
      '--spotlight-y': `${y}px`,
      duration: 0.5,
      ease: 'power3.out'
    });
  };

  // --- Trust Badge physics hover animations ---
  const playIconAnimation = (ref: React.RefObject<HTMLDivElement | null>, type: 'spin' | 'bounce' | 'pulse') => {
    const el = ref.current;
    if (!el) return;

    if (type === 'spin') {
      gsap.to(el, { rotate: 360, duration: 0.6, ease: 'back.out(1.5)' });
    } else if (type === 'bounce') {
      gsap.to(el, { y: -5, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
    } else if (type === 'pulse') {
      gsap.to(el, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }
  };

  const resetIconAnimation = (ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotate: 0, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
  };

  // Location Selector elastic click animation
  const selectLocationChip = (location: string, e: React.MouseEvent<HTMLSpanElement>) => {
    setSearchLocation(location);
    const target = e.currentTarget;
    gsap.fromTo(target, 
      { scale: 0.95 }, 
      { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.4)' }
    );
  };

  // Split title string for premium 3D letters cascade
  const render3DLetters = (line: string, customClass: string = '') => {
    return line.split('').map((char, index) => (
      <span
        key={index}
        className={`char-anim inline-block hover:text-emerald-400 transition-all duration-200 cursor-default ${customClass}`}
        style={{ perspective: '1000px', display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // Filtered arenas logic
  const filteredArenas = FEATURED_ARENAS.filter(arena => {
    if (activeSportFilter === 'All') return true;
    return arena.sports.includes(activeSportFilter);
  });

  return (
    <div 
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#050811] font-jakarta text-white select-none overflow-hidden"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      
      {/* 🌌 High-Performance Spotlight Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.16] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
        style={{
          background: 'radial-gradient(550px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)'
        }}
      />

      {/* Floating neon orbits blur */}
      <div
        ref={orbit1Ref}
        className="absolute top-20 left-1/4 -translate-x-1/2 w-[450px] h-[450px] bg-[#1e6b3e]/8 blur-[130px] rounded-full pointer-events-none will-change-transform"
      />
      <div
        ref={orbit2Ref}
        className="absolute top-[600px] right-1/4 translate-x-1/2 w-[550px] h-[550px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10 py-16">
        
        {/* ================= HERO SECTION ================= */}
        <section className="flex flex-col items-center text-center space-y-10 pt-4 max-w-4xl mx-auto">
          
          {/* Top Live Badge */}
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div 
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="DHAKA"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>{liveReservations.toLocaleString()} Bookings Locked in Dhaka</span>
                <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </Magnetic>
          </div>

          <div className="space-y-5">
            <h1 
              ref={titleRef}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white will-change-transform"
            >
              <div>{render3DLetters("Find Your Pitch,")}</div>
              <div className="mt-1">
                {render3DLetters("Own Your ")}
                <span 
                  className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                  data-cursor-text="PLAY"
                >
                  {render3DLetters("Game Time", "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400")}
                </span>
              </div>
            </h1>

            <p 
              ref={subtitleRef}
              className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed will-change-transform"
            >
              ঢাকা শহরের সেরা সব ভেরিফাইড ফুটবল এবং ক্রিকেট টার্ফ খুঁজুন, রিয়েল-টাইম স্লট কনকারেন্সি লক চেক করুন এবং কনফার্ম করুন মাত্র ১ মিনিটে।
              <span className="text-white font-bold"> নো টেনশন, জাস্ট প্লে!</span>
            </p>
          </div>

          {/* Search Engine Wrapper */}
          <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
            <div 
              ref={searchBarRef}
              className="relative z-30 w-full bg-[#0d1425]/45 backdrop-blur-2xl p-2 rounded-2xl sm:rounded-full border border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.55)] flex flex-col sm:flex-row items-center gap-3 sm:gap-1.5 hover:border-slate-850 focus-within:border-emerald-500/25 transition-all duration-300 will-change-transform"
            >
              {/* Location Input */}
              <div className="relative w-full sm:flex-1 group px-2">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="কোথায় খেলতে চান? (উদা: বনানী, মিরপুর...)"
                  className="w-full h-10 pl-9 pr-3 bg-transparent outline-none text-xs font-semibold text-white placeholder-slate-500 focus:placeholder-slate-400 transition-all duration-300"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-800/40" />

              {/* Sports Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative w-full sm:w-40 px-3 h-10 flex items-center justify-between"
              >
                <button
                  type="button"
                  onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                  className="flex items-center justify-between w-full h-full bg-slate-950/20 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-900 sm:border-0 px-3 sm:px-0 text-xs font-bold text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  data-cursor-text={selectedSport.toUpperCase()}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-slate-500" />
                    <span>{selectedSport}</span>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isSportDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Options */}
                <AnimatePresence>
                  {isSportDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-14 left-0 sm:left-1/2 sm:-translate-x-1/2 w-[180px] bg-[#0b0f19] border border-slate-850 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-none"
                    >
                      {[
                        { value: 'Football' as SportType, icon: '⚽' },
                        { value: 'Cricket' as SportType, icon: '🏏' }
                      ].map((sport) => (
                        <button
                          key={sport.value}
                          type="button"
                          onClick={() => {
                            setSelectedSport(sport.value);
                            setIsSportDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-left transition-all duration-200 cursor-pointer ${
                            selectedSport === sport.value 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{sport.icon}</span>
                            <span>{sport.value}</span>
                          </span>
                          {selectedSport === sport.value && <Check className="h-3 w-3 text-emerald-400" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-800/40" />

              {/* Date Box */}
              <div 
                className="relative w-full sm:w-36 px-3 h-10 flex items-center gap-2.5 bg-slate-950/20 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-900 sm:border-0 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors duration-300"
                data-cursor-text="TODAY"
              >
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold text-left">Today / Tomorrow</span>
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-800/40" />

              {/* Find button */}
              <Magnetic range={20} actionStrength={0.2}>
                <Link href="/turfs" className="w-full sm:w-auto" data-cursor-text="FIND">
                  <Button className="w-full sm:w-auto h-10 sm:px-8 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl sm:rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-emerald-500/10">
                    <Search className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Find Arenas</span>
                  </Button>
                </Link>
              </Magnetic>
            </div>

            {/* Chips tags */}
            <div 
              ref={locationChipsRef}
              className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-550 font-bold uppercase tracking-wider pt-1.5 will-change-transform"
            >
              <span className="mr-1">Popular:</span>
              {POPULAR_LOCATIONS.map((loc) => (
                <span
                  key={loc}
                  onClick={(e) => selectLocationChip(loc, e)}
                  className={`px-2.5 py-1 rounded-full border text-[9px] font-black cursor-pointer transition-all duration-300 select-none ${
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
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-5 text-slate-500 font-bold text-[9px] uppercase tracking-widest border-t border-slate-900/50 w-full max-w-2xl will-change-transform"
          >
            <Magnetic range={15} actionStrength={0.15}>
              <div 
                className="flex items-center gap-2 hover:text-slate-200 transition-all duration-300 cursor-pointer group" 
                data-cursor-text="10K+"
                onMouseEnter={() => playIconAnimation(usersIconRef, 'spin')}
                onMouseLeave={() => resetIconAnimation(usersIconRef)}
              >
                <div 
                  ref={usersIconRef}
                  className="p-1.5 bg-[#050811] rounded-full border border-slate-900 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center"
                >
                  <Users className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>10K+ Active Players</span>
              </div>
            </Magnetic>

            <Magnetic range={15} actionStrength={0.15}>
              <div 
                className="flex items-center gap-2 hover:text-slate-200 transition-all duration-300 cursor-pointer group" 
                data-cursor-text="ARENAS"
                onMouseEnter={() => playIconAnimation(trophyIconRef, 'bounce')}
                onMouseLeave={() => resetIconAnimation(trophyIconRef)}
              >
                <div 
                  ref={trophyIconRef}
                  className="p-1.5 bg-[#050811] rounded-full border border-slate-900 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center"
                >
                  <Trophy className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>50+ Top Arenas In Dhaka</span>
              </div>
            </Magnetic>

            <Magnetic range={15} actionStrength={0.15}>
              <div 
                className="flex items-center gap-2 hover:text-slate-200 transition-all duration-300 cursor-pointer group" 
                data-cursor-text="SECURE"
                onMouseEnter={() => playIconAnimation(shieldIconRef, 'pulse')}
                onMouseLeave={() => resetIconAnimation(shieldIconRef)}
              >
                <div 
                  ref={shieldIconRef}
                  className="p-1.5 bg-[#050811] rounded-full border border-slate-900 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>Instant Secure Lock</span>
              </div>
            </Magnetic>
          </div>

        </section>

        {/* ================= LIVE CONCURRENCY MONITOR & SIMULATOR ================= */}
        <section className="concurrency-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Real-Time Engine Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Live Slot Concurrency Lock</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              আমাদের সিস্টেমে কোনো ফ্যান্টম বা ডাবল বুকিং নেই। ইন্টারেক্টিভ লকিং স্যান্ডবক্সে টেস্ট করে দেখুন কিভাবে স্লট লক হয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Box: Live Concurrency Stats Console */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0d1425]/15 border border-slate-900 hover:border-emerald-500/10 transition-all duration-500 flex flex-col justify-between space-y-6 scroll-reveal relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">TurfBook Core Engine Live</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 px-2 py-0.5 bg-[#050811] rounded border border-slate-850">v4.2.1-prod</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  High-Performance Real-Time Locking Engine
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-relaxed">
                  যখন একজন প্লেয়ার একটি স্লট সিলেক্ট করেন, আমাদের ডাটাবেস লেভেল কনকারেন্সি লকিং অ্যালগরিদম ঠিক সেই মিলিসেকেন্ডেই অন্য সকলের জন্য স্লটটি ব্লক করে দেয়। এটি পেমেন্ট সম্পন্ন করতে ৫ মিনিট সময় বরাদ্দ দেয়।
                </p>
              </div>

              {/* Visual Stats List */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-850/60">
                <div className="space-y-1 p-3.5 bg-[#050811]/60 border border-slate-850 rounded-xl">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Lock Latency</span>
                  <div className="text-base font-black text-emerald-400 font-mono">1.2ms</div>
                </div>
                <div className="space-y-1 p-3.5 bg-[#050811]/60 border border-slate-850 rounded-xl">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Locks Active</span>
                  <div className="text-base font-black text-white font-mono">148/min</div>
                </div>
                <div className="space-y-1 p-3.5 bg-[#050811]/60 border border-slate-850 rounded-xl">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Accuracy</span>
                  <div className="text-base font-black text-emerald-400 font-mono">100.0%</div>
                </div>
              </div>

              {/* Dynamic simulated system log console */}
              <div className="bg-[#050811] border border-slate-850 rounded-xl p-3.5 font-mono text-[9px] text-slate-500 space-y-1.5">
                <div className="flex items-center justify-between text-emerald-500/80">
                  <span>[SYS] Concurrency check: OK</span>
                  <span>100% thread efficiency</span>
                </div>
                <div className="truncate text-slate-550">[SYS] Slot locked: Jaff Arena Court A - 7:00 PM (Expiring in 5m)</div>
                <div className="truncate text-slate-600">[DB] Row lock transaction synced in Dhaka-North cluster</div>
              </div>
            </div>

            {/* Right Box: Interactive 5-Minute Lock Sandbox Simulator */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-b from-[#111a2d]/20 to-[#080d1a]/20 border border-emerald-500/20 shadow-xl flex flex-col justify-between space-y-6 scroll-reveal relative overflow-hidden">
              <div className="absolute inset-[1px] bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent rounded-[22px] pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Sandbox Playground</span>
                  <h3 className="text-base sm:text-lg font-bold text-white">Interactive Concurrency Test</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <Zap className="h-4 w-4" />
                </div>
              </div>

              {/* Interactive Sandbox Canvas */}
              <div className="bg-[#050811]/70 border border-slate-850 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4 min-h-[160px] relative">
                
                {lockState === 'IDLE' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-[#0d1425] border border-slate-850 rounded-full w-fit mx-auto text-slate-400 group-hover:scale-105 transition-transform duration-300">
                      <Clock className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Simulate a Slot Lock Reservation</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[280px]">নিচের বাটনে ক্লিক করে লাইভ স্লট লকিং ও কাউন্টডাউন টাইমার পরীক্ষা করুন।</p>
                    </div>
                  </div>
                )}

                {lockState === 'LOCKING' && (
                  <div className="space-y-3">
                    <div className="h-10 w-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-emerald-400">Acquiring Distributed Mutex...</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-1">Executing row concurrency query on server</p>
                    </div>
                  </div>
                )}

                {lockState === 'LOCKED' && (
                  <div className="space-y-3 w-full">
                    {/* Pulsing Lock Header */}
                    <div className="flex items-center justify-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mx-auto animate-pulse">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Slot Securely Locked</span>
                    </div>

                    <div className="text-4xl font-mono font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      {formatLockTime(lockTimeRemaining)}
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold max-w-[280px] mx-auto bg-[#050811] p-2.5 rounded-lg border border-slate-850">
                      🔒 <span className="font-mono text-emerald-400 font-bold">TBOOK-LOCK-8395X</span> is active. 
                      This court slot is now blocked for everyone else in Dhaka.
                    </div>
                  </div>
                )}

              </div>

              {/* Simulation Trigger Button */}
              <button
                onClick={handleLockSimulation}
                className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 active:scale-97 cursor-pointer border ${
                  lockState === 'LOCKED'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                }`}
              >
                {lockState === 'LOCKED' ? 'Release Locked Slot' : 'Test Lock Concurrency'}
              </button>

            </div>

          </div>
        </section>

        {/* ================= FEATURED ARENAS GRID SECTION ================= */}
        <section className="arenas-section space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 scroll-reveal">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                <span>Handpicked Pitches</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Featured Premium Arenas</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">ঢাকার সেরা সব হাই-কোয়ালিটি টার্ফ ভেন্যু বুকিং করুন মুহূর্তেই।</p>
            </div>

            {/* Premium Filter Pills */}
            <div className="flex gap-2 bg-[#0d1425]/30 border border-slate-900 p-1 rounded-xl">
              {(['All', 'Football', 'Cricket'] as const).map(sport => (
                <button
                  key={sport}
                  onClick={() => setActiveSportFilter(sport)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    activeSportFilter === sport
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Arenas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArenas.map((arena, i) => (
              <div 
                key={arena.id}
                className="scroll-reveal group p-4.5 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-emerald-500/20 hover:bg-[#0d1425]/30 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Aspect Ratio Image Wrapper */}
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-850 relative group">
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#050811]/80 backdrop-blur-md border border-slate-800 text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded text-emerald-400">
                      {arena.badge}
                    </div>
                    
                    <img 
                      src={arena.image} 
                      alt={arena.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Details Card info */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{arena.location}</span>
                      <div className="flex items-center gap-0.5 text-emerald-400">
                        <Star className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                        <span>{arena.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors duration-200 truncate">{arena.name}</h3>
                  </div>

                  {/* Size & Sports tags */}
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                    <span>⚽ {arena.size}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                      {arena.price}
                    </span>
                  </div>

                  {/* Amenities List */}
                  <div className="flex flex-wrap gap-1">
                    {arena.amenities.map((amenity, ai) => (
                      <span key={ai} className="text-[8px] font-bold text-slate-500 bg-[#050811] border border-slate-850 px-2 py-0.5 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instant CTA booking button */}
                <Magnetic range={15} actionStrength={0.2}>
                  <Link href="/turfs" className="block pt-1.5" data-cursor-text="BOOK">
                    <button className="w-full py-2.5 bg-[#050811] border border-slate-850 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-350 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5">
                      <span>Book Slot Now</span>
                      <ArrowRight className="h-3 w-3 text-emerald-400" />
                    </button>
                  </Link>
                </Magnetic>

              </div>
            ))}
          </div>
        </section>

        {/* ================= INTERACTIVE MATCH LOBBY & FRIENDS lobby ================= */}
        <section className="lobby-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Users className="h-3.5 w-3.5" />
              <span>Interactive Matchmaking</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Match Lobby & Solo Players</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              আপনার ফুটবল গ্রুপে প্লেয়ার কম? কিংবা আপনি একা খেলতে চান? টার্ফবুক লবিতে জয়েন করুন এবং ঢাকার মাঠে নতুন বন্ধুদের সাথে ম্যাচ খেলুন।
            </p>
          </div>

          {/* Lobby Table Cards */}
          <div className="max-w-4xl mx-auto space-y-4">
            {lobbyTeams.map((team) => {
              const isJoined = joinedLobbies.includes(team.id);
              const progressPercentage = (team.slotsFilled / team.slotsTotal) * 100;
              
              return (
                <div 
                  key={team.id}
                  className="scroll-reveal p-5 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
                >
                  {/* Left part: Profile and Team */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={team.avatar} 
                      alt={team.captain}
                      className="h-11 w-11 rounded-full object-cover border border-slate-800 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-white">{team.teamName}</h4>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          team.urgency === 'High' 
                            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                            : team.urgency === 'Medium'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        }`}>
                          {team.urgency} Urgency
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        📍 {team.arena} | ⏰ {team.time}
                      </p>
                      
                      {/* Sub-tag for skill needed */}
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 mt-2 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
                        ⚡ {team.roleNeeded}
                      </span>
                    </div>
                  </div>

                  {/* Central Progress indicator */}
                  <div className="flex-1 max-w-xs space-y-2">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Lobby Capacity</span>
                      <span className="text-white font-mono">{team.slotsFilled} / {team.slotsTotal} Players</span>
                    </div>
                    <div className="h-2 bg-[#050811] rounded-full overflow-hidden border border-slate-850">
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
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer border ${
                        isJoined
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-[#050811] border-slate-850 hover:border-slate-800 text-slate-350 hover:text-white'
                      }`}
                    >
                      {isJoined ? 'Joined ✔' : 'Join Match Lobby'}
                    </button>

                    <button className="p-2.5 bg-[#050811] border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors duration-300">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* ================= PLATFORM ANALYTICS DASHBOARD ================= */}
        <section className="stats-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Award className="h-3.5 w-3.5" />
              <span>Platform Statistics</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Our Platform Impact</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              আমরা ঢাকার খেলাধুলার ধরণ সম্পূর্ণ প্রযুক্তিগতভাবে বদলে দিচ্ছি। সংখ্যাগুলো তারই প্রমাণ।
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="h-5 w-5 text-emerald-400" />,
                title: "১০০,০০০+",
                label: "Matches Played",
                desc: "সফলভাবে অনুষ্ঠিত হয়েছে প্ল্যাটফর্মের মাধ্যমে"
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
                title: "১০০% সিকিউর",
                label: "Payment Lock",
                desc: "সহজ এবং তাৎক্ষণিক গেটওয়ে কনফার্মেশন"
              },
              {
                icon: <Trophy className="h-5 w-5 text-emerald-400" />,
                title: "৫০+ এরেনা",
                label: "Verified Partners",
                desc: "গুলশান, মিরপুর ও ধানমন্ডির প্রিমিয়াম ভেন্যু"
              },
              {
                icon: <Zap className="h-5 w-5 text-emerald-400" />,
                title: "০% ডাবল বুকিং",
                label: "Double-Booking Rate",
                desc: "অটোমেটেড স্লট লকিং অ্যালগরিদমের কারণে"
              }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="scroll-reveal p-5.5 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">{stat.title}</h4>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= HIGH CONVERSION CTA BANNER ================= */}
        <section className="cta-banner-section pt-4">
          <div className="scroll-reveal bg-[#0d1425]/15 border border-slate-900 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1e6b3e]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
              <Flame className="h-3 w-3 fill-emerald-400 text-emerald-400 animate-bounce" />
              <span>Get in the Game</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Dominate the Pitch?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl leading-relaxed">
              ঢাকার যেকোনো এরেনা আজই বুক করুন টার্ফবুকের সাথে। মাত্র ১ ক্লিকের লকিং ইঞ্জিন স্লট ডাবল বুকিং হওয়া প্রতিরোধ করবে। আপনার টিমকে নিয়ে মাঠে নামুন!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3.5 w-full sm:w-auto">
              <Magnetic range={20} actionStrength={0.25}>
                <Link href="/turfs" className="w-full sm:w-auto" data-cursor-text="PLAY">
                  <Button className="w-full sm:w-auto px-8 py-5.5 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/10 active:scale-95">
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
