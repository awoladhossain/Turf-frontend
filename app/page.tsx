import { Button } from '@/components/ui/button'; // Shadcn Button
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900">
          Turf<span className="text-green-600">Book</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-[600px]">
          ঢাকা শহরের সেরা সব ফুটবল এবং ক্রিকেট টার্ফ বুক করুন এক ক্লিকে। এখনই শুরু করতে লগইন করুন।
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="px-8">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="px-8">
              Register
            </Button>
          </Link>
        </div>
      </div>

      {/* এখানে পরে আপনি টার্ফ লিস্ট বা ফিচার সেকশন যোগ করবেন */}
    </main>
  );
}
