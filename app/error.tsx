'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Jenkins বা অন্য কোনো প্রোডাকশন লগিং সিস্টেমে এরর ট্র্যাক করার জন্য
    console.error('Captured Runtime Error:', error);
  }, [error]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden font-jakarta">
      {/* Pitch Geometric Line Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-slate-200/60 rounded-full" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-[460px] bg-white p-8 sm:p-10 rounded-[28px] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center">
        {/* Warning Icon Graphic */}
        <div className="inline-flex bg-amber-50 p-4 rounded-2xl border border-amber-100 text-amber-600 mb-5 animate-pulse">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Something went wrong!</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          We encountered an unexpected error while processing your request. Don&apos;t worry, our
          team has been notified.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <Button
            onClick={() => reset()}
            className="h-11 bg-[#1e6b3e] hover:bg-[#16522f] text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Link href="/" className="w-full">
            <Button
              variant="outline"
              className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Technical Error Reference For Developers */}
        {error.digest && (
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-6">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
