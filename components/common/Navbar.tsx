'use client';

import { Button } from '@/components/ui/button';
import { Menu, Trophy, UserCircle } from 'lucide-react'; // এই আইকনগুলো ১০০% কাজ করবে
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-green-600 p-1.5 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Turf<span className="text-green-600">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/turfs"
            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
          >
            সব টার্ফ
          </Link>
          <Link
            href="/offers"
            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
          >
            অফারসমূহ
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
          >
            আমাদের সম্পর্কে
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <UserCircle className="h-4 w-4" />
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 hover:bg-green-700 text-sm font-medium px-5 cursor-pointer">
              Sign Up
            </Button>
          </Link>

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
