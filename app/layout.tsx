import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Providers } from '@/providers';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// ফন্ট কনফিগারেশন
const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

// মেটাডাটা কনফিগারেশন
export const metadata: Metadata = {
  title: {
    default: 'TurfBook - Book Your Turf',
    template: '%s | TurfBook',
  },
  description: 'Football ও Cricket turf সহজেই বুক করুন। সেরা মাঠ, সেরা দাম।',
};

// এই ফাংশনটি অবশ্যই 'export default' হতে হবে
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col font-jakarta" 
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}