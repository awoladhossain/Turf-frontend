'use client';

import { Mail, Phone, ScanFace, Spotlight, Trophy, X } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Turf<span className="text-green-600">Book</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              আপনার পছন্দের টার্ফ খুঁজে বের করুন এবং বুক করুন খুব সহজে। আমরা দিচ্ছি সেরা খেলার
              অভিজ্ঞতার নিশ্চয়তা।
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-green-600">
                <ScanFace className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-green-600">
                <Spotlight className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-green-600">
                <X className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/turfs"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  সব টার্ফ
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  অফারসমূহ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">সাপোর্ট</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  প্রাইভেসি পলিসি
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  শর্তাবলী
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                >
                  রিফান্ড পলিসি
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">যোগাযোগ করুন</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-green-600" />
                <span>support@turfbook.com</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-green-600" />
                <span>+880 1234 567890</span>
              </li>
              <li className="text-muted-foreground mt-2">বনানী, ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} TurfBook. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
