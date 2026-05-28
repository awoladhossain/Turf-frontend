'use client';

import Magnetic from '@/components/ui/Magnetic';
import gsap from 'gsap';
import {
  Clock,
  Gamepad2,
  Maximize2,
  MessageSquare,
  Play,
  Send,
  Share2,
  Tv,
  Users,
  Volume2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Live Match Stream Type
interface LiveMatch {
  id: string;
  title: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  time: string;
  arena: string;
  sport: 'Football' | 'Cricket';
  spectators: number;
  videoUrl: string; // simulated or actual HLS
  status: 'LIVE' | 'UPCOMING';
  logoA: string;
  logoB: string;
}

// Dhaka Live Broadcasts Data
const LIVE_BROADCASTS: LiveMatch[] = [
  {
    id: 'match-8395',
    title: 'Dhaka Futsal League - Semi Final',
    teamA: 'Banani Falcons',
    teamB: 'Dhanmondi Tigers',
    scoreA: 3,
    scoreB: 2,
    time: '24:15',
    arena: 'Jaff Arena',
    sport: 'Football',
    spectators: 1840,
    videoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
    status: 'LIVE',
    logoA: 'BF',
    logoB: 'DT',
  },
  {
    id: 'match-4829',
    title: 'Corporate Cricket League Group B',
    teamA: 'Daffodil Tech',
    teamB: 'Brain Station 23',
    scoreA: 84,
    scoreB: 78,
    time: 'Over 12.4',
    arena: "Chef's Table Courts",
    sport: 'Cricket',
    spectators: 950,
    videoUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    status: 'LIVE',
    logoA: 'DT',
    logoB: 'BS',
  },
  {
    id: 'match-2947',
    title: 'Mirpur Elite Cup 2026',
    teamA: 'Mirpur United',
    teamB: 'Uttara Strikers',
    scoreA: 0,
    scoreB: 0,
    time: 'Starts at 9:00 PM',
    arena: 'Mirpur Turf City',
    sport: 'Football',
    spectators: 0,
    videoUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68',
    status: 'UPCOMING',
    logoA: 'MU',
    logoB: 'US',
  },
];

// Initial Chat messages
const INITIAL_CHAT_MESSAGES = [
  {
    id: 1,
    user: 'Rafsan',
    message: 'Wow, what a goal by Banani Falcons! ⚽',
    time: '18:40',
    isPremium: true,
  },
  {
    id: 2,
    user: 'Tasin',
    message: "Dhanmondi's goalkeeper made an absolute world-class save just now!",
    time: '18:41',
    isPremium: false,
  },
  {
    id: 3,
    user: 'Sadman',
    message: 'Go backend in Golang is keeping the stream latency next to zero! Super smooth.',
    time: '18:42',
    isPremium: true,
  },
  {
    id: 4,
    user: 'Mahmudul',
    message: 'Falcons defense is looking shaky tonight, Tigers can equalize anytime.',
    time: '18:43',
    isPremium: false,
  },
];

export default function LiveStreamPage() {
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch>(LIVE_BROADCASTS[0]);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [liveSpectators, setLiveSpectators] = useState(LIVE_BROADCASTS[0].spectators);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'STATS' | 'LINEUPS'>('CHAT');

  // Animation Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const mainStreamRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // --- Dynamic Live Ticker Counter Logic ---
  useEffect(() => {
    // Periodically update live spectators to match the interactive Golang streaming engine
    const interval = setInterval(() => {
      setLiveSpectators((prev) => prev + Math.floor(Math.random() * 9) - 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- Match Score and Timer Loop (Simulation) ---
  const [matchTime, setMatchTime] = useState(24);
  const [matchSeconds, setMatchSeconds] = useState(15);
  const [scoreA, setScoreA] = useState(3);
  const [scoreB, setScoreB] = useState(2);

  useEffect(() => {
    if (selectedMatch.id !== 'match-8395') return;

    const timer = setInterval(() => {
      setMatchSeconds((sec) => {
        if (sec >= 59) {
          setMatchTime((t) => t + 1);
          return 0;
        }
        return sec + 1;
      });
    }, 1000);

    // Occasional simulated goal scoring
    const goalSimulation = setInterval(() => {
      const luckyA = Math.random() > 0.85;
      const luckyB = Math.random() > 0.9;

      if (luckyA) {
        setScoreA((s) => s + 1);
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: 'TurfBook Broadcast',
            message: '🎉 GOOOAAALLL!!! Banani Falcons score again! What an unbelievable match!',
            time: `${matchTime}:${matchSeconds}`,
            isPremium: true,
          },
        ]);
        toast('⚽ GOAL! Banani Falcons scored!', { icon: '🔥', duration: 4000 });
      } else if (luckyB) {
        setScoreB((s) => s + 1);
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: 'TurfBook Broadcast',
            message: '🎉 GOOOAAALLL!!! Dhanmondi Tigers hit back! Equalizer in sight!',
            time: `${matchTime}:${matchSeconds}`,
            isPremium: true,
          },
        ]);
        toast('⚽ GOAL! Dhanmondi Tigers scored!', { icon: '🔥', duration: 4000 });
      }
    }, 28000);

    return () => {
      clearInterval(timer);
      clearInterval(goalSimulation);
    };
  }, [matchTime, matchSeconds, selectedMatch]);

  // Reset scoring values if changing current match
  useEffect(() => {
    if (selectedMatch.id === 'match-8395') {
      setScoreA(3);
      setScoreB(2);
      setLiveSpectators(1840);
    } else if (selectedMatch.id === 'match-4829') {
      setScoreA(84);
      setScoreB(78);
      setLiveSpectators(950);
    }
  }, [selectedMatch]);

  // --- GSAP Entrance Animation Setup ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elementsToClean = [];
      if (badgeRef.current) elementsToClean.push(badgeRef.current);
      if (subtitleRef.current) elementsToClean.push(subtitleRef.current);

      if (elementsToClean.length > 0) {
        gsap.set(elementsToClean, { opacity: 0, y: 20 });
      }

      const charAnims = pageContainerRef.current?.querySelectorAll('.char-anim');
      if (charAnims && charAnims.length > 0) {
        gsap.set(charAnims, { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
      }

      if (mainStreamRef.current) {
        gsap.set(mainStreamRef.current, { opacity: 0, y: 30 });
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      if (badgeRef.current) {
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
      }

      if (charAnims && charAnims.length > 0) {
        tl.to(
          charAnims,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.012,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.4',
        );
      }

      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }

      if (mainStreamRef.current) {
        tl.to(
          mainStreamRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.3',
        );
      }

      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          y: '+=20',
          x: '-=20',
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // --- Mouse Spotlight Coordinate Tracker ---
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
      ease: 'power3.out',
    });
  };

  // Submit chat message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      user: 'You',
      message: newMessage.trim(),
      time: `${matchTime}:${matchSeconds.toString().padStart(2, '0')}`,
      isPremium: true,
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessage('');

    // Trigger simulated quick opponent mock replies in 1.5 seconds!
    setTimeout(() => {
      const mockReplies = [
        'Defenders need to push higher!',
        'Golang live stream quality is absolute gold ⚡',
        'Who is playing Striker today? Dhanmondi Tigers are getting dominated.',
        'Crazy atmosphere at Jaff Arena tonight!',
      ];
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      const names = ['Aurnob', 'Niloy', 'Shuvo', 'Fahim'];
      const randomName = names[Math.floor(Math.random() * names.length)];

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: randomName,
          message: randomReply,
          time: `${matchTime}:${matchSeconds.toString().padStart(2, '0')}`,
          isPremium: false,
        },
      ]);
    }, 1500);
  };

  // Copy streaming share link
  const handleShareLink = () => {
    const link = `${window.location.origin}/live?match=${selectedMatch.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Stream link copied! Share it with your squad on Messenger / WhatsApp.', {
      duration: 4000,
      icon: '🔗',
    });
  };

  // Title split helper
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

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      style={
        {
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* 🌌 High-Performance Grid and Spotlight Mask */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.16] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(550px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)',
        }}
      />

      {/* Floating Neon Background Orbits */}
      <div
        ref={orbitRef}
        className="absolute top-10 left-1/3 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/5 blur-[125px] rounded-full pointer-events-none will-change-transform"
      />
      <div className="absolute bottom-20 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-teal-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* ================= HEADER SECTION ================= */}
        <header className="text-center space-y-5 max-w-2xl mx-auto flex flex-col items-center">
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="BROADCAST"
              >
                <Tv className="h-3 w-3 text-emerald-450" />
                <span>Live Arena Broadcast</span>
              </div>
            </Magnetic>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform">
            <div>{render3DLetters('Live Stream & ')}</div>
            <div className="mt-1">
              <span
                className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                data-cursor-text="STREAM"
              >
                {render3DLetters(
                  'Arena Broadcasting',
                  'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400',
                )}
              </span>
            </div>
          </h1>

          <p
            ref={subtitleRef}
            className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed font-medium will-change-transform"
          >
            টার্ফবুক অ্যারেনা থেকে সরাসরি সম্প্রচারিত হওয়া ফুটবল ও ক্রিকেট ম্যাচগুলো কোনো বাফারিং
            ছাড়াই উপভোগ করুন। আপনার বন্ধুদের সাথে লিংক শেয়ার করুন এবং লাইভ চ্যাট লবিতে আড্ডা দিন!
            <span className="text-white font-bold"> নো টেনশন, জাস্ট প্লে!</span>
          </p>
        </header>

        {/* ================= MAIN STREAM LAYOUT ================= */}
        <div ref={mainStreamRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Block: Sleek Video Player & Scoreboard (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col space-y-5">
            {/* 🖥️ High-End Video Player Console */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-900 shadow-2xl flex flex-col justify-between p-4 group">
              {/* Aspect Ratio Image Overlay placeholder (Simulated high-end stream stream) */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#050811]/40 group-hover:bg-[#050811]/10 transition-colors duration-300 pointer-events-none z-10" />
                <img
                  src={selectedMatch.videoUrl}
                  alt={selectedMatch.title}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* Player Top Interface: Live scoreboard overlay */}
              <div className="relative z-20 flex justify-between items-center w-full">
                {/* Blinking Live Badge */}
                {selectedMatch.status === 'LIVE' ? (
                  <div className="flex items-center gap-2 bg-rose-600 border border-rose-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    <span>LIVE BROADCAST</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-[#0d1425]/80 backdrop-blur-md border border-slate-800 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-slate-400">
                    <Clock className="h-3 w-3 text-emerald-450" />
                    <span>UPCOMING MATCH</span>
                  </div>
                )}

                {/* Scoreboard overlay */}
                {selectedMatch.status === 'LIVE' && (
                  <div className="flex items-center bg-[#050811]/90 backdrop-blur-md border border-slate-800 rounded-full px-4.5 py-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.5)] font-mono">
                    <div className="flex items-center gap-2 text-xs font-black text-white">
                      <span>{selectedMatch.teamA}</span>
                      <span className="bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded text-emerald-400">
                        {scoreA}
                      </span>
                      <span className="text-slate-600">:</span>
                      <span className="bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded text-emerald-400">
                        {scoreB}
                      </span>
                      <span>{selectedMatch.teamB}</span>
                    </div>

                    <div className="h-4 w-px bg-slate-800 mx-3" />

                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock
                        className="h-3 w-3 text-emerald-400 animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                      <span>
                        {selectedMatch.sport === 'Football'
                          ? `${matchTime.toString().padStart(2, '0')}:${matchSeconds.toString().padStart(2, '0')}`
                          : selectedMatch.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Player Center: Custom big Play overlay for Upcoming or idle stream */}
              {selectedMatch.status === 'UPCOMING' && (
                <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#050811]/70 backdrop-blur-md p-6 rounded-2xl max-w-sm mx-auto shadow-2xl border border-slate-850">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{selectedMatch.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Broadcast commences in Mirpur cluster tonight. Registered team squads have
                      locked in.
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-[#050811] border border-slate-800 text-[9px] font-black uppercase tracking-wider text-emerald-400 rounded-xl">
                    Notify Me When Live
                  </button>
                </div>
              )}

              {/* Player Bottom: Custom play controls hud */}
              <div className="relative z-20 flex justify-between items-center w-full bg-gradient-to-t from-[#050811] to-transparent p-3.5 pt-10 rounded-b-3xl">
                {/* Left controls */}
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-[#050811]/80 backdrop-blur-md border border-slate-850 hover:border-slate-800 text-emerald-400 rounded-lg transition-all">
                    <Play className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                  </button>

                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-[#050811]/80 backdrop-blur-md border border-slate-850 px-2.5 py-1.5 rounded-lg">
                    <Users className="h-3 w-3 text-emerald-400" />
                    <span>{liveSpectators.toLocaleString()} Watching</span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-[#050811]/80 backdrop-blur-md border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all">
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-2 bg-[#050811]/80 backdrop-blur-md border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all text-[9px] font-black uppercase tracking-wider px-2.5">
                    1080p HD
                  </button>
                  <button className="p-2 bg-[#050811]/80 backdrop-blur-md border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scorecard Ticker and Stats section */}
            <div className="p-5.5 rounded-3xl bg-[#0d1425]/15 border border-slate-900 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-850/65">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                    Dhaka Sports Broadcasting Service
                  </span>
                  <h3 className="text-sm font-black text-white">{selectedMatch.title}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    📍 Arena: {selectedMatch.arena} | Sport: {selectedMatch.sport}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleShareLink}
                    className="h-9 px-4 rounded-xl bg-[#050811] border border-slate-850 hover:border-emerald-500/20 text-slate-350 hover:text-white font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    data-cursor-text="SHARE"
                  >
                    <Share2 className="h-3.5 w-3.5 text-emerald-450" />
                    <span>Share Match Link</span>
                  </button>
                </div>
              </div>

              {/* Match description details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] sm:text-xs text-slate-400 font-semibold leading-relaxed pt-1">
                <div className="space-y-2">
                  <p>
                    🔥 <strong>Golang Concurrency Engine:</strong> এই লাইভ ব্রডকাস্টিং সার্ভারটি
                    গোলং এবং WebRTC প্রযুক্তি দ্বারা চালিত, যা লো-ল্যাটেন্সি রিয়েল-টাইম কন্টেন্ট
                    সম্প্রচার নিশ্চিত করে।
                  </p>
                  <p>
                    🏆 <strong>Dhaka Super League:</strong> টুর্নামেন্টে চ্যাম্পিয়ন দলের জন্য থাকছে
                    আকর্ষণীয় প্রাইজমানি এবং টার্ফবুক প্লেয়ার অফ দ্য ম্যাচ অনার।
                  </p>
                </div>

                {/* Simulated match events block */}
                <div className="bg-[#050811] p-4.5 rounded-2xl border border-slate-850 space-y-2.5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
                    Match Events Ticker
                  </span>
                  <div className="space-y-2 font-mono text-[9px]">
                    <div className="flex justify-between text-emerald-400">
                      <span>[24:10] Goal: Banani Falcons (3-2)</span>
                      <span>Sadman Sakib (Assist)</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>[18:00] Corner: Dhanmondi Tigers</span>
                      <span>Cleared by Defenders</span>
                    </div>
                    <div className="flex justify-between text-amber-500/90">
                      <span>[12:30] Foul: Yellow Card</span>
                      <span>Dhanmondi Tigers #10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Golang Sync Live Chat Lobby (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#0d1425]/15 border border-slate-900 rounded-3xl p-5.5 space-y-4 relative overflow-hidden h-[480px]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="space-y-3.5">
              {/* Tab options inside chat */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-850/65">
                <div className="flex items-center gap-1.5 text-xs font-black text-white">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>Match Chat Lobby</span>
                </div>

                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
                  Golang Synced
                </span>
              </div>
            </div>

            {/* Chat message listing window */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-850">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border space-y-1 transition-all ${
                    msg.user === 'You'
                      ? 'bg-emerald-500/5 border-emerald-500/20 shadow-sm'
                      : msg.user === 'TurfBook Broadcast'
                        ? 'bg-amber-500/5 border-amber-500/20 animate-pulse'
                        : 'bg-[#050811]/60 border-slate-850'
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <span
                      className={`font-black ${msg.isPremium ? 'text-emerald-400' : 'text-slate-350'}`}
                    >
                      {msg.user} {msg.isPremium && '⭐'}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p
                    className={`text-[10px] leading-relaxed font-semibold ${msg.user === 'TurfBook Broadcast' ? 'text-white font-bold' : 'text-slate-400'}`}
                  >
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Submit message input field */}
            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 bg-[#050811] p-1.5 rounded-xl border border-slate-850"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="চ্যাট এ আপনার বার্তা..."
                className="flex-grow bg-transparent outline-none text-[11px] font-semibold text-white px-2.5"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ================= ACTIVE DHAKA CHANNELS CAROUSEL ================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-widest border-b border-slate-900/60 pb-3">
            <Gamepad2 className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Active Broadcast Channels In Dhaka</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LIVE_BROADCASTS.map((broadcast) => {
              const isSelected = selectedMatch.id === broadcast.id;
              return (
                <div
                  key={broadcast.id}
                  onClick={() => setSelectedMatch(broadcast)}
                  className={`p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-emerald-500/5 border-emerald-500/20 shadow-md scale-102'
                      : 'bg-[#0d1425]/15 border-slate-900 hover:border-slate-800'
                  }`}
                >
                  {/* Aspect ratio thumb */}
                  <div className="aspect-[4/3] w-20 rounded-xl overflow-hidden bg-slate-900 relative flex-shrink-0">
                    <img
                      src={broadcast.videoUrl}
                      alt={broadcast.title}
                      className="w-full h-full object-cover"
                    />

                    {broadcast.status === 'LIVE' && (
                      <div className="absolute top-1 left-1 bg-rose-600 text-[6px] font-black uppercase px-1 py-0.5 rounded text-white animate-pulse">
                        LIVE
                      </div>
                    )}
                  </div>

                  {/* Broadcast Details details */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                      {broadcast.arena}
                    </span>
                    <h4 className="text-[11px] font-black text-white truncate">
                      {broadcast.title}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      {broadcast.status === 'LIVE' ? (
                        <>
                          <Users className="h-2.5 w-2.5 text-emerald-400" />
                          <span>{broadcast.spectators.toLocaleString()} Watching</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-2.5 w-2.5 text-slate-650" />
                          <span>Upcoming Stream</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
