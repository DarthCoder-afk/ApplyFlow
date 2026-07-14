'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-200/80 bg-slate-50/85 shadow-sm backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <BriefcaseBusiness className="h-4 w-4" />
          </span>
          Job Tracker
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-950">Features</a>
          <a href="#get-started" className="transition hover:text-slate-950">Get started</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/80 hover:text-slate-950"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
