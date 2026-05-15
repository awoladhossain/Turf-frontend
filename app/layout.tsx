import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'TurfBook - Book Your Turf',
    template: '%s | TurfBook',
  },
  description: 'Football ও Cricket turf সহজেই বুক করুন। সেরা মাঠ, সেরা দাম।',
  keywords: ['turf booking', 'football', 'cricket', 'dhaka', 'bangladesh'],
  openGraph: {
    title: 'TurfBook',
    description: 'Book your favorite turf easily',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
