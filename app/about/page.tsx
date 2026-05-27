'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Users, 
  Zap, 
  Star, 
  ShieldCheck, 
  Heart, 
  ArrowUpRight, 
  Flame, 
  Clock,
  ChevronDown,
  HelpCircle,
  Sparkles,
  MapPin,
  Award,
  Calendar,
  MessageSquare,
  Cpu,
  Shield,
  Code,
  ChevronRight,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/ui/Magnetic';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Minimalist Uniform Chronology Data
const TIMELINE_EVENTS = [
  {
    year: '2022',
    title: 'দ্য ফ্রিকশন (The Friction)',
    subtitle: 'A Late Night Double-Booking Chaos',
    desc: 'বনানীর একটি মাঠে ৭-এ-সাইড ম্যাচের জন্য আমরা বন্ধুরা জড়ো হয়েছিলাম। ৫ দিন আগে ফোনে মাঠ বুক করার পরেও বুকিং রেজিস্টারে নামের গোঁজামিলের কারণে অন্য টিম খেলছিল। এই প্রাচীন অ্যানালগ হ্যাসেল আমাদের ভাবিয়ে তোলে। সেই রাতেই জন্ম নেয় টার্ফবুক আইডিয়া।',
    icon: <Clock className="h-4 w-4 text-emerald-400" />
  },
  {
    year: '2023',
    title: 'দ্য জেনেসিস (The Genesis)',
    subtitle: 'Developing the Automated Concurrency Lock',
    desc: 'একটি ছোট কফি শপে শুরু হয় প্রথম কোড লাইন। ডাবল বুকিং চিরতরে বন্ধ করতে আমরা তৈরি করলাম অ্যাডভান্সড রিয়েল-টাইম স্লট লকিং মেকানিজম। ঢাকার ৫টি প্রিমিয়াম এরেনা যুক্ত করে খেলোয়াড়দের জন্য ইনস্ট্যান্ট বুকিং গেটওয়ে ওপেন করা হলো।',
    icon: <Zap className="h-4 w-4 text-emerald-400" />
  },
  {
    year: '2024',
    title: 'দ্য রেভোলিউশন (The Revolution)',
    subtitle: 'Onboarding 50+ Arenas and 10,000+ Players',
    desc: 'টার্ফবুক পরিণত হলো ঢাকার সবচেয়ে বিশ্বস্ত স্পোর্টস প্ল্যাটফর্মে। ধানমন্ডি, গুলশান, বনানী এবং মিরপুরের ৫০টিরও বেশি প্রিমিয়াম এরেনা যুক্ত হলো। ডাবল বুকিং এর হার নেমে আসলো শূন্যের কোঠায়। আমরা ঢাকার ক্রীড়াপ্রেমী খেলোয়াড়দের অফিসিয়াল বুকিং পার্টনার হলাম।',
    icon: <Trophy className="h-4 w-4 text-emerald-400" />
  },
  {
    year: '2025+',
    title: 'দ্য ফিউচার (The Horizon)',
    subtitle: 'Smart Portfolios and Matchmaking Ecosystems',
    desc: 'আমাদের লক্ষ্য শুধু মাঠ বুকিং নয়—আমরা গড়ছি বাংলাদেশের প্রথম কমপ্লিট স্পোর্টস ইকোসিস্টেম। অটোমেটেড ম্যাচমেকিং, মেম্বারশিপ ট্যুরস এবং প্লেয়ার কোয়ালিটি ড্যাশবোর্ড নিয়ে আসছি খুব শীঘ্রই। প্রতিটি প্লেয়ার পাবে তাদের নিজস্ব ম্যাচ অ্যানালিটিক্স।',
    icon: <Flame className="h-4 w-4 text-emerald-400" />
  }
];

// Core Value Pillars
const CORE_PILLARS = [
  {
    icon: <Cpu className="h-6 w-6 text-emerald-400" />,
    title: '১০০% কনকারেন্সি লক ইঞ্জিন',
    subtitle: 'Zero Double-Booking Guarantee',
    desc: 'আমাদের ব্যাকএন্ডে প্রতি মিলি-সেকেন্ডে স্লটের অবস্থা পর্যবেক্ষণ করে। যখন আপনি একটি টার্ফ স্লট সিলেক্ট করেন, আমাদের রিয়েল-টাইম লক ইঞ্জিন মুহূর্তেই অন্য সবার জন্য স্লটটি ব্লক করে দেয়। ডাবল বুকিং হওয়ার কোনো সুযোগই নেই।'
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    title: 'প্রি-ভেটেড এরেনা ইকোসিস্টেম',
    subtitle: '100% Verified Quality Standards',
    desc: 'টার্ফবুকে তালিকাভুক্ত প্রতিটি মাঠ আমাদের ফিজিক্যাল ইন্সপেকশন টিমের দ্বারা ম্যানুয়ালি রিভিউ করা হয়। কৃত্রিম ঘাসের কোয়ালিটি, লাইটিং সিস্টেম, ওয়াশরুম এবং চেঞ্জিং এরিয়া যাচাই করার পরই কেবল মাঠটি লাইভ করা হয়।'
  },
  {
    icon: <Users className="h-6 w-6 text-emerald-400" />,
    title: 'কমিউনিটি ও প্লেয়ার ম্যাচমেকিং',
    subtitle: 'Connecting Solo Players & Teams',
    desc: 'টার্ফবুক কেবল মাঠ বুকিং অ্যাপ নয়, এটি একটি স্পোর্টস সোসাইটি। মাঠ বুকিংয়ের পাশাপাশি আপনি সোলো প্লেয়ার বা বিরোধী টিম খুঁজে পেতে পারেন আমাদের ইন-বিল্ট ম্যাচমেকিং ও ফ্রেন্ডস লবি ফিচারের মাধ্যমে।'
  }
];

// How It Works Step Flow
const STEP_FLOW = [
  {
    step: '০১',
    title: 'মাঠ ও স্লট নির্বাচন',
    desc: 'আপনার পছন্দের এরেনা, খেলার তারিখ, সাইড (৭-এ-সাইড / ৯-এ-সাইড) এবং আপনার জন্য সুবিধাজনক সময় সিলেক্ট করুন।'
  },
  {
    step: '০২',
    title: 'রিয়েল-টাইম কনফার্মেশন',
    desc: 'ইনস্ট্যান্ট রিয়েল-টাইম লকিং ইঞ্জিনের মাধ্যমে আপনার স্লট লক করে আমাদের নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে পেমেন্ট সম্পন্ন করুন।'
  },
  {
    step: '০৩',
    title: 'মাঠে নামুন ও খেলুন',
    desc: 'ইনস্ট্যান্ট বুকিং রিসিট ও গুগল ম্যাপস ডিরেকশনসহ সরাসরি এরেনায় প্রবেশ করুন। বুকিং ও ডাবল বুকিং নিয়ে নো টেনশন, জাস্ট প্লে!'
  }
];

// Team Members Data
const TEAM_MEMBERS = [
  {
    name: 'আওলাদ হোসেন (Awolad Hossain)',
    role: 'Co-Founder & Chief Visionary',
    bio: 'বনানীর মাঠে বুকিং ঝামেলার মুখোমুখি হয়ে টার্ফবুকের বীজ বুনেছিলেন। তিনি প্ল্যাটফর্মের ডিজাইন ল্যাঙ্গুয়েজ এবং ফিউচার ইকোসিস্টেম ডিরেকশনের মূল স্থপতি।',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    skills: ['Product Design', 'Growth Strategy', 'UX Vision'],
    github: '#',
    linkedin: '#'
  },
  {
    name: 'মাহমুদুল হাসান (Mahmudul Hasan)',
    role: 'Lead Concurrency Architect',
    bio: 'ডাবল-বুকিং চিরতরে বন্ধ করার জন্য রিয়েল-টাইম স্লট লকিং মেকানিজম এবং ব্যাকএন্ড কনকারেন্সি ডাটাবেস হ্যান্ডলারের নির্মাতা।',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    skills: ['Node.js', 'Distributed Locks', 'PostgreSQL'],
    github: '#',
    linkedin: '#'
  },
  {
    name: 'তাসিন আহমেদ (Tasin Ahmed)',
    role: 'VP of Venue Partnerships',
    bio: 'ঢাকার মিরপুর, উত্তরা ও গুলশানের শীর্ষ ৫০+ ভেন্যু ও মাঠ মালিকদের সাথে পার্টনারশিপ এবং অনবোর্ডিং প্রসেসের নেপথ্যের কারিগর।',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    skills: ['Negotiation', 'Operations', 'Client Relations'],
    github: '#',
    linkedin: '#'
  },
  {
    name: 'সাদমান সাকিব (Sadman Sakib)',
    role: 'Lead Frontend Engineer',
    bio: 'GSAP মসৃণ অ্যানিমেশন, থ্রিডি স্পটলাইট ইফেক্ট এবং টার্ফবুকের ফাস্ট-লোডিং রেসপন্সিভ ইন্টাফেসের মূল ইঞ্জিনিয়ার।',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    skills: ['React', 'GSAP Animations', 'CSS Architecture'],
    github: '#',
    linkedin: '#'
  }
];

// Interactive Player Positions for Mock Card
type PositionKey = 'STRIKER' | 'MIDFIELDER' | 'DEFENDER' | 'GOALKEEPER';

const STATS_PRESETS: Record<PositionKey, {
  level: number;
  badge: string;
  overall: number;
  perk: string;
  stats: { name: string; value: number }[];
}> = {
  STRIKER: {
    level: 18,
    badge: 'Gold Tier Striker',
    overall: 89,
    perk: 'Lightning Finisher',
    stats: [
      { name: 'Pace', value: 94 },
      { name: 'Shooting', value: 92 },
      { name: 'Passing', value: 78 },
      { name: 'Dribbling', value: 88 },
      { name: 'Defense', value: 42 },
      { name: 'Physical', value: 80 }
    ]
  },
  MIDFIELDER: {
    level: 21,
    badge: 'Dhaka Playmaker',
    overall: 91,
    perk: 'Precision Visionary',
    stats: [
      { name: 'Pace', value: 82 },
      { name: 'Shooting', value: 78 },
      { name: 'Passing', value: 94 },
      { name: 'Dribbling', value: 91 },
      { name: 'Defense', value: 72 },
      { name: 'Physical', value: 84 }
    ]
  },
  DEFENDER: {
    level: 15,
    badge: 'Mirpur Wall',
    overall: 88,
    perk: 'Tactical Anchor',
    stats: [
      { name: 'Pace', value: 78 },
      { name: 'Shooting', value: 55 },
      { name: 'Passing', value: 72 },
      { name: 'Dribbling', value: 68 },
      { name: 'Defense', value: 93 },
      { name: 'Physical', value: 92 }
    ]
  },
  GOALKEEPER: {
    level: 19,
    badge: 'Banani Shield',
    overall: 90,
    perk: 'Cat-like Reflexes',
    stats: [
      { name: 'Pace', value: 62 },
      { name: 'Shooting', value: 45 },
      { name: 'Passing', value: 78 },
      { name: 'Dribbling', value: 65 },
      { name: 'Reflexes', value: 95 },
      { name: 'Positioning', value: 92 }
    ]
  }
};

// FAQ Data
const FAQ_ITEMS = [
  {
    question: 'টার্ফবুকে স্লট বুকিং করতে কোনো বাড়তি বা লুকানো চার্জ আছে কি?',
    answer: 'না, টার্ফবুকে কোনো অতিরিক্ত বা লুকানো ফি নেই। এরেনার প্রকৃত অফিশিয়াল রেটেই আপনি বুকিং করতে পারবেন। আমরা স্বচ্ছতায় বিশ্বাসী।'
  },
  {
    question: 'যদি বুকিং করার পর ভেন্যুর কারণে খেলা ব্যাহত বা বাতিল হয়, তবে কি রিফান্ড পাবো?',
    answer: 'হ্যাঁ, ভেন্যুজুড়ে কোনো টেকনিক্যাল প্রবলেম বা ডাবল বুকিং জনিত সমস্যা হলে আমরা ১০০% মানি-ব্যাক রিফান্ড গ্যারান্টি প্রদান করি। আমাদের ইনস্ট্যান্ট গেটওয়ে রিফান্ড ২৪ ঘণ্টার মধ্যে প্রসেস করা হয়।'
  },
  {
    question: 'খেলার কোনো স্লট বুকিং করার পর কি রিশেডিউল বা বাতিল করা সম্ভব?',
    answer: 'বুকিং রিশেডিউলিং পলিসি মূলত নির্দিষ্ট মাঠ কর্তৃপক্ষের উপর নির্ভর করে। তবে ম্যাচ শুরু হওয়ার অন্তত ১২ ঘণ্টা আগে সরাসরি আমাদের ড্যাশবোর্ড বা কাস্টমার সাপোর্টে যোগাযোগ করলে আমরা রিশেডিউলে সর্বাত্মক সহায়তা করি।'
  },
  {
    question: 'আমি কিভাবে আমার মাঠ বা টার্ফ এরেনাকে টার্ফবুকে পার্টনার হিসেবে নথিভুক্ত করতে পারি?',
    answer: 'আমাদের প্ল্যাটফর্মে এরেনা যুক্ত করা অত্যন্ত সহজ। ভেন্যু ওনাররা সরাসরি আমাদের ওনার ড্যাশবোর্ডে গিয়ে বা যোগাযোগ পৃষ্ঠার মাধ্যমে ভেন্যুর তথ্যাদি সাবমিট করলেই আমাদের টিম ভেরিফিকেশন সম্পন্ন করে ৪ ঘন্টার মধ্যে লাইভ করে দেয়।'
  }
];

// Testimonials Data
const TESTIMONIALS = [
  {
    quote: "টার্ফবুকের আসার আগে ৫ বার ডাবল বুকিংয়ের শিকার হয়েছিলাম। ম্যাচ খেলতে গিয়ে দেখি অন্য টিম খেলছে। টার্ফবুক আসার পর এক ক্লিকে মাঠ লক করে নিশ্চিত মনে মাঠে যাই। এটা আমাদের ঢাকার স্পোর্টস লাইফ সহজ করে দিছে!",
    author: "রাফসান জামিল",
    team: "Captain, Dhanmondi Falcons FC",
    rating: 5,
    role: "Regular TurfBook User",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
  },
  {
    quote: "আমি যখন আমার মিরপুরের ভেন্যু টার্ফবুকে যুক্ত করলাম, আমাদের স্লট অকুপেন্সি ৩০% থেকে বেড়ে ৮০% এ দাঁড়িয়েছে। অটোমেটেড বুকিং ট্র্যাকারের কারণে আমাদের ভেন্যু স্টাফদের উপর চাপ নেই।",
    author: "তাহমিদ চৌধুরী",
    team: "Owner, Turf Arena Mirpur",
    rating: 5,
    role: "Venue Partner since 2024",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150"
  },
  {
    quote: "আমার ফ্রেন্ড গ্রুপে প্লেয়ার শর্ট পড়লে টার্ফবুকের লবি ফিচারের মাধ্যমে ইনস্ট্যান্ট খেলোয়াড় খুঁজে নেই। এই সামাজিক ও প্রযুক্তিগত চমৎকার ফিউশন ঢাকার ক্রীড়া বিপ্লব ডেকে আনছে!",
    author: "সারাফাত কবির",
    team: "Founder, Gulshan Rangers FC",
    rating: 5,
    role: "League Player since 2023",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150"
  }
];

export default function AboutPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const oathRef = useRef<HTMLDivElement>(null);
  
  // Background glow orbit
  const orbitRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedPosition, setSelectedPosition] = useState<PositionKey>('STRIKER');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Create GSAP context for proper cleanup of ScrollTriggers and timelines during route navigation
    const ctx = gsap.context(() => {
      // --- 1. Set initial clean states for elements ---
      const elementsToClean = [];
      if (badgeRef.current) elementsToClean.push(badgeRef.current);
      if (subtitleRef.current) elementsToClean.push(subtitleRef.current);
      if (statsRef.current) elementsToClean.push(statsRef.current);
      if (oathRef.current) elementsToClean.push(oathRef.current);

      if (elementsToClean.length > 0) {
        gsap.set(elementsToClean, { opacity: 0, y: 20 });
      }

      // Verify and set character animation class targets
      const charAnims = pageContainerRef.current?.querySelectorAll(".char-anim");
      if (charAnims && charAnims.length > 0) {
        gsap.set(charAnims, { opacity: 0, y: 35, rotateX: -30, transformOrigin: 'top center' });
      }

      const timelineNodes = pageContainerRef.current?.querySelectorAll(".timeline-node");
      if (timelineNodes && timelineNodes.length > 0) {
        gsap.set(timelineNodes, { opacity: 0, y: 30 });
      }

      const scrollFadeIns = pageContainerRef.current?.querySelectorAll(".scroll-fade-in");
      if (scrollFadeIns && scrollFadeIns.length > 0) {
        gsap.set(scrollFadeIns, { opacity: 0, y: 30 });
      }

      // --- 2. Build elegant entrance timelines ---
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

      // Staggered upward slide and fade-in reveals
      if (badgeRef.current) {
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 });
      }
      
      // Character cascade (Fast, fluid, premium stagger)
      if (charAnims && charAnims.length > 0) {
        tl.to(charAnims, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.012,
          duration: 0.8,
          ease: 'power4.out'
        }, '-=0.4');
      }

      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }
      if (statsRef.current) {
        tl.to(statsRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }

      // Set up ScrollTrigger animations dynamically for all elements with .scroll-fade-in, grouped by their section
      const sections = pageContainerRef.current?.querySelectorAll("section, .timeline-container, .oath-section");
      sections?.forEach((section) => {
        const elements = section.querySelectorAll(".scroll-fade-in");
        if (elements.length > 0) {
          gsap.fromTo(elements,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
              }
            }
          );
        }
      });

      // Stagger timeline card reveals as scroll approaches
      if (timelineNodes && timelineNodes.length > 0) {
        gsap.fromTo(timelineNodes, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ".timeline-container",
              start: "top 80%",
            }
          }
        );
      }

      // Founders oath reveal on scroll
      if (oathRef.current) {
        gsap.fromTo(oathRef.current,
          { opacity: 0, scale: 0.98, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ".oath-section",
              start: "top 85%",
            }
          }
        );
      }

      // Subtle background glowing float
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          y: '+=20',
          x: '-=15',
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    }, pageContainerRef);

    return () => {
      ctx.revert(); // Cleanly kills all ScrollTriggers and reverts animations to prevent black screen bugs
    };
  }, []);

  // --- 3. Spotlight coordinates tracking ---
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

  // 3D character text splitter with custom support for gradient text classes
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const activeStats = STATS_PRESETS[selectedPosition];

  return (
    <div 
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050811] font-jakarta text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%'
      } as React.CSSProperties}
    >
      {/* 🌌 High-Performance Grid Spotlight Layer */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111b2d_1px,transparent_1px),linear-gradient(to_bottom,#111b2d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.16] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 40%, transparent 95%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 50%)'
        }}
      />

      {/* Floating Animated Neon Orbit */}
      <div
        ref={orbitRef}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none will-change-transform"
      />

      {/* --- HERO CONTENT WRAPPER --- */}
      <div className="max-w-6xl mx-auto space-y-24 relative z-10">
        
        {/* Intro Storytelling Headers */}
        <div className="text-center space-y-5 max-w-3xl mx-auto flex flex-col items-center">
          <div ref={badgeRef} className="will-change-transform">
            <Magnetic range={20} actionStrength={0.15}>
              <div 
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4.5 py-2 rounded-full backdrop-blur-md shadow-sm cursor-pointer hover:bg-emerald-500/15 transition-all duration-300"
                data-cursor-text="SINCE 2022"
              >
                <Trophy className="h-3 w-3" />
                <span>Our Heritage & Legacy</span>
              </div>
            </Magnetic>
          </div>

          <h1 
            ref={titleRef}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white will-change-transform"
          >
            <div>{render3DLetters("Revolutionizing How")}</div>
            <div className="mt-1">
              {render3DLetters("Dhaka ")}
              <span 
                className="cursor-pointer drop-shadow-[0_4px_20px_rgba(52,211,153,0.25)]"
                data-cursor-text="SPORTS"
              >
                {render3DLetters("Plays Sports", "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400")}
              </span>
            </div>
          </h1>

          <p 
            ref={subtitleRef}
            className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-semibold will-change-transform"
          >
            টার্ফবুক (TurfBook) শুধুমাত্র একটি স্লট বুকিং সিস্টেম নয়; এটি ঢাকার ক্রীড়াপ্রেমীদের একটি
            আধুনিক ডিজিটাল ইকোসিস্টেম। মাঠ খোঁজা থেকে শুরু করে বুকিং কনফার্মেশন—সবকিছুকে আমরা নিয়ে এসেছি আপনার
            আঙুলের ডগায়। নো টেনশন, জাস্ট প্লে!
          </p>
        </div>

        {/* --- DYNAMIC METRICS BOARD (Sleek Clean Metric Cards) --- */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 will-change-transform"
        >
          {[
            {
              icon: <Users className="h-4.5 w-4.5 text-emerald-400" />,
              value: '১০,০০০+',
              label: 'Active Players',
              hoverText: 'PLAYERS'
            },
            {
              icon: <Trophy className="h-4.5 w-4.5 text-emerald-400" />,
              value: '৫০+',
              label: 'Verified Arenas',
              hoverText: 'ARENAS'
            },
            {
              icon: <Zap className="h-4.5 w-4.5 text-emerald-400" />,
              value: '১ মিনিট',
              label: 'Instant Booking',
              hoverText: 'SPEED'
            },
            { 
              icon: <Star className="h-4.5 w-4.5 text-emerald-400" />, 
              value: '৪.৯', 
              label: 'Average Rating',
              hoverText: 'RATING'
            },
          ].map((stat, i) => (
            <Magnetic key={i} range={15} actionStrength={0.15}>
              <div 
                className="text-center p-5 rounded-2xl bg-[#0d1425]/25 border border-slate-900 hover:border-emerald-500/20 group cursor-pointer transition-all duration-300 hover:bg-[#0d1425]/45"
                data-cursor-text={stat.hoverText}
              >
                <div className="mx-auto w-fit p-2 bg-[#050811] rounded-full border border-slate-850 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 mb-3.5 flex items-center justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white transition-colors duration-300">
                  {stat.value}
                </h3>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            </Magnetic>
          ))}
        </div>

        {/* --- OUR PILLARS SECTION (Philosophy & Core Values) --- */}
        <section className="philosophy-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-fade-in">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Shield className="h-3 w-3" />
              <span>Safety & Precision</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Our Core Philosophy</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              আমরা তিনটি মূল স্তম্ভের উপর ভিত্তি করে ঢাকার স্পোর্টস কমিউনিটিকে ডিজিটালাইজড করছি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_PILLARS.map((pillar, i) => (
              <div 
                key={i} 
                className="scroll-fade-in p-6 rounded-2xl bg-[#0d1425]/15 border border-slate-900/80 hover:border-emerald-500/20 hover:bg-[#0d1425]/30 transition-all duration-500 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{pillar.subtitle}</span>
                    <h3 className="text-base sm:text-lg font-black text-white">{pillar.title}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- HOW IT WORKS STEP FLOW SECTION --- */}
        <section className="steps-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-fade-in">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>Simplified Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">How TurfBook Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              ৩টি সহজ পদক্ষেপে ঢাকা শহরের যেকোনো প্রিমিয়াম মাঠে আপনার স্লট কনফার্ম করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector Line for Desktop */}
            <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 -translate-y-1/2 z-0 hidden md:block" />

            {STEP_FLOW.map((step, i) => (
              <div 
                key={i} 
                className="scroll-fade-in relative z-10 p-6 rounded-2xl bg-[#0d1425]/20 border border-slate-900 hover:border-emerald-500/10 hover:bg-[#0d1425]/25 transition-all duration-300 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-black text-emerald-500/25 font-mono">{step.step}</span>
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <h3 className="text-sm font-black text-white">{step.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- GAMIFIED SPORT-ID WIDGET (Unique interactive widget) --- */}
        <section className="gamification-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-fade-in">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Activity className="h-3 w-3" />
              <span>Future Ecosystem Preview</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Your Future TurfBook Career</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              আমরা তৈরি করছি দেশের প্রথম প্লেয়ার প্রোফাইল ড্যাশবোর্ড। আপনার পজিশন সিলেক্ট করে দেখুন ক্যারিয়ার কার্ড কেমন দেখাবে!
            </p>
          </div>

          <div className="scroll-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d1425]/15 border border-slate-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            {/* Glowing spotlight background behind the card */}
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Interactive Sandbox</span>
              <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                খেলুন, পয়েন্ট অর্জন করুন এবং ঢাকার মাঠে নিজেকে অনন্য প্রমাণ করুন
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                টার্ফবুকের ভবিষ্যৎ সংস্করণে প্রতিটি ম্যাচ খেলার পর ভেন্যু ও খেলোয়াড়দের ফিডব্যাকের মাধ্যমে আপনার প্রোফাইলের স্কিল পয়েন্ট বৃদ্ধি পাবে। আপনি ঢাকার সেরা স্ট্রাইকার নাকি অভেদ্য ডিফেন্ডার? তা দেখা যাবে সরাসরি আপনার টার্ফবুক স্পোর্টস আইডি-তে!
              </p>

              {/* Position Switcher Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(Object.keys(STATS_PRESETS) as PositionKey[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSelectedPosition(pos)}
                    className={`px-4 py-2 text-[10px] font-black rounded-lg border transition-all duration-300 ${
                      selectedPosition === pos
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-[#050811]/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-350'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Card Mock Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[310px] bg-gradient-to-b from-[#111a2d] to-[#080d1a] border border-emerald-500/30 rounded-3xl p-5.5 relative shadow-[0_20px_50px_rgba(5,8,17,0.8)] hover:border-emerald-500/50 transition-all duration-500 group select-none">
                
                {/* Holographic glowing borders */}
                <div className="absolute inset-[1px] bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent rounded-[22px] pointer-events-none" />

                {/* Header info */}
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-black px-2 py-0.5 bg-[#050811] border border-slate-800 rounded text-slate-400">
                      LVL {activeStats.level}
                    </span>
                    <span className="text-[8px] font-black tracking-widest text-emerald-400 uppercase">
                      {activeStats.badge}
                    </span>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                </div>

                {/* Player Visual Placeholder */}
                <div className="my-5 flex items-center gap-4 relative z-10">
                  <div className="relative h-16 w-16 rounded-full border border-emerald-500/20 bg-slate-900/60 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:border-emerald-500/40 transition-all duration-300">
                    <Users className="h-7 w-7 text-emerald-500/30" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight">Cap. Awolad Hossain</h4>
                    <p className="text-[10px] text-slate-500 font-bold tracking-wider mt-0.5">TurfBook Co-Founder</p>
                    <div className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1.5">
                      <Star className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                      <span>{activeStats.perk}</span>
                    </div>
                  </div>
                  
                  {/* Big Overall Rating on Right */}
                  <div className="ml-auto text-right">
                    <div className="text-3xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                      {activeStats.overall}
                    </div>
                    <div className="text-[8px] font-black text-slate-500 tracking-widest uppercase">OVR</div>
                  </div>
                </div>

                {/* Rating Stats Bars */}
                <div className="space-y-2.5 relative z-10 pt-2 border-t border-slate-850">
                  {activeStats.stats.map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{stat.name}</span>
                        <span className="text-white font-mono">{stat.value}</span>
                      </div>
                      <div className="h-1.5 bg-[#050811] rounded-full overflow-hidden border border-slate-850">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* --- THE LEGACY CHRONOLOGY (Minimal Vertical Timeline) --- */}
        <div className="timeline-container space-y-10 relative max-w-3xl mx-auto pt-6">
          {/* Vertical central pipeline (Uniform color) */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[1px] bg-slate-800/40 -translate-x-1/2 hidden md:block" />
          
          <div className="text-center space-y-1.5 pb-4 scroll-fade-in">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Our Journey Chronicle</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">কিভাবে ফুটবলপ্রেমীদের একটি আইডিয়া বদলে দিল ঢাকার খেলার ধরণ</p>
          </div>

          <div className="space-y-10">
            {TIMELINE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index} 
                  className="timeline-node relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0 will-change-transform"
                >
                  
                  {/* Left / Right Card placement */}
                  <div className={`w-full md:w-[46%] ${isEven ? 'md:order-1' : 'md:order-2 md:text-left'}`}>
                    <div className="p-5.5 rounded-2xl bg-[#0d1425]/20 border border-slate-900/80 backdrop-blur-2xl shadow-sm space-y-3 hover:border-emerald-500/10 hover:bg-[#0d1425]/30 transition-all duration-300">
                      
                      {/* Timeline Card Header */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#050811] rounded-full border border-slate-850 flex items-center justify-center">
                          {event.icon}
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{event.year} Milestone</span>
                          <h3 className="text-sm font-black tracking-tight text-white">{event.title}</h3>
                        </div>
                      </div>

                      <div className="h-[1px] bg-slate-800/30 w-full" />
                      
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>

                  {/* Centered Timeline Node Dot */}
                  <div className="absolute left-6 md:left-1/2 top-7 md:top-1/2 w-6 h-6 rounded-full bg-[#050811] border border-slate-800 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none md:flex">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>

                  {/* Empty Spacer Column for layout balancing */}
                  <div className={`w-full md:w-[46%] hidden md:block ${isEven ? 'md:order-2' : 'md:order-1'}`} />

                </div>
              );
            })}
          </div>
        </div>

        {/* --- MEET THE FOUNDERS & TEAM GRID --- */}
        <section className="team-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-fade-in">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Users className="h-3 w-3" />
              <span>The Builders</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Meet the Visionaries</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              যাদের অক্লান্ত পরিশ্রম ও প্রযুক্তির ফিউশনে পরিচালিত হচ্ছে ঢাকা শহরের সেরা স্পোর্টস হাব।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <div 
                key={i} 
                className="scroll-fade-in p-5 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-emerald-500/20 hover:bg-[#0d1425]/35 transition-all duration-300 group flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Profile Frame */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-850 group-hover:border-emerald-500/20 relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-60 z-10" />
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out grayscale group-hover:grayscale-0"
                    />
                  </div>
                  
                  {/* Text details */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors duration-200">{member.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{member.role}</p>
                  </div>
                  
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>

                {/* Bottom details & skills */}
                <div className="space-y-3.5 pt-3 border-t border-slate-850">
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, si) => (
                      <span key={si} className="text-[8px] font-bold text-slate-500 bg-[#050811] border border-slate-850 px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3.5 text-slate-500">
                    <a href={member.github} className="hover:text-emerald-400 transition-colors duration-200">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href={member.linkedin} className="hover:text-emerald-400 transition-colors duration-200">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* --- DHAKA CAPTAINS TESTIMONIALS SECTION --- */}
        <section className="testimonials-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-fade-in">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <MessageSquare className="h-3 w-3" />
              <span>Voice of the Pitch</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Dhaka Captains Speak</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              যাদের আস্থার ওপর ভর করে আমরা ডাবল বুকিংয়ের ঝামেলা দূর করে যাচ্ছি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div 
                key={i} 
                className="scroll-fade-in p-6 rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-emerald-500/10 hover:bg-[#0d1425]/25 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Star rating */}
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, si) => (
                      <Star key={si} className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Profile row */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-850">
                  <img 
                    src={t.avatar} 
                    alt={t.author}
                    className="h-10 w-10 rounded-full object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-black text-white">{t.author}</h4>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">{t.team}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ SECTION (Sleek Glassmorphic Accordion) --- */}
        <section className="faq-section space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto scroll-fade-in">
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <HelpCircle className="h-3 w-3" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              টার্ফবুক নিয়ে খেলোয়াড় এবং ভেন্যু মালিকদের মনের কিছু সাধারণ জিজ্ঞাসা।
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <div 
                key={i} 
                className="scroll-fade-in rounded-2xl bg-[#0d1425]/15 border border-slate-900 hover:border-slate-800 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-400 transition-colors duration-200 leading-snug">
                    {faq.question}
                  </h3>
                  <div className={`p-1.5 rounded-full border border-slate-850 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    openFaq === i ? 'rotate-185 bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'text-slate-400'
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Expandable Panel */}
                <div 
                  style={{ height: openFaq === i ? 'auto' : 0 }} 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <div className="px-5 pb-5 pt-1 border-t border-slate-850/40">
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* --- THE FOUNDERS' OATH / CORE VALUE BLOCK --- */}
        <div className="oath-section pt-8">
          <div 
            ref={oathRef}
            className="relative bg-[#0d1425]/20 backdrop-blur-2xl border border-slate-900 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm flex flex-col sm:flex-row items-center gap-8 overflow-hidden will-change-transform"
          >
            {/* Glowing Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-400 hidden sm:block" />

            {/* Avatar image size perfectly balanced */}
            <div className="relative h-20 w-20 rounded-full overflow-hidden border border-slate-850 flex-shrink-0 group bg-slate-900 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200"
                alt="Players on turf"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
              />
            </div>

            <div className="space-y-3.5 flex-grow">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <Heart className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                <span>The Founders&apos; Promise</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                Our Oath: ঢাকার খেলোয়াড়দের জন্য একটি নির্ভুল ডিজিটাল স্বর্গ
              </h2>
              
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed italic">
                &ldquo;টার্ফবুক শুধুমাত্র মাঠ বুকিং অ্যাপ নয়। আমরা যখন প্রথমবার ডাবল-বুকিং এর তিক্ত অভিজ্ঞতার মুখোমুখি হয়েছিলাম, তখনই ঠিক করেছিলাম—ঢাকার মাঠে কোন ফুটবল বা ক্রিকেট ম্যাচ যেন বুকিং জটিলতায় নষ্ট না হয়। প্রতিটি বুকিং যেন হয় রিলায়েবল ও ইনস্ট্যান্ট।&rdquo;
              </p>

              <div className="h-[1px] bg-slate-850 w-full" />
              
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <div>Awolad Hossain & Friends — Founders, TurfBook</div>
                
                <Magnetic range={15} actionStrength={0.25}>
                  <Link href="/turfs" className="text-emerald-400 flex items-center gap-0.5 group hover:text-emerald-350 transition-colors">
                    <span>Book Your Pitch Now</span>
                    <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </Magnetic>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Minimal icons helper
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
