import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
