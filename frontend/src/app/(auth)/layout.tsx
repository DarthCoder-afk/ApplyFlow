import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-300/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-7">
        <div className="mb-8 flex items-center justify-between md:mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            Job Tracker
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}
