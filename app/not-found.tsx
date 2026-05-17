import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-6 bg-[#f8fafc] overflow-hidden font-jakarta">
      {/* --- Full Pitch Background Overlay --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <div className="absolute inset-10 border-2 border-slate-900 rounded-2xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-slate-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-slate-900 rounded-full" />
      </div>

      <div className="relative w-full max-w-lg flex flex-col items-center text-center space-y-8">
        {/* --- Conceptual Sports Visual (The "404" Goalpost / Offside Card) --- */}
        <div className="relative flex items-center justify-center w-full h-48 select-none">
          {/* Big Bold Outlined 404 */}
          <h1 className="text-[13rem] font-black tracking-tighter text-slate-200/70 leading-none font-jakarta absolute z-0">
            404
          </h1>

          {/* Red Card / Offside Badge overlay */}
          <div className="absolute z-10 bg-rose-500 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-rose-500/20 rotate-[-6deg] -translate-y-12">
            Out of Bounds
          </div>

          {/* Minimalist Goal Post / Box Vector in code */}
          <div className="absolute bottom-0 w-64 h-24 border-2 border-b-0 border-dashed border-slate-300 rounded-t-xl flex items-end justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Empty Pitch
            </span>
          </div>
        </div>

        {/* --- Text Content --- */}
        <div className="space-y-3 max-w-md relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            You&apos;ve wandered offside!
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            The page or turf booking slot you are looking for isn&apos;t on our tactical sheet. It
            might have been moved or whistle blew early.
          </p>
        </div>

        {/* --- Premium Action Button --- */}
        <div className="w-full max-w-xs relative z-10 pt-2">
          <Link href="/">
            <Button className="group w-full h-12 bg-[#1e6b3e] hover:bg-[#16522f] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
              <MoveLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Return to Center Circle
            </Button>
          </Link>
        </div>

        {/* --- Subtle Bottom Coordinates --- */}
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pt-4">
          [ Sector: Lost_In_Play // Code: 404 ]
        </div>
      </div>
    </div>
  );
}
