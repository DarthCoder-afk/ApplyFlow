'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

export default function LandingNavbar() {
  const header = useRef<HTMLElement>(null);

  useGSAP(() => {
    const onScroll = () => {
      const compact = window.scrollY > 16;
      gsap.to(header.current, {
        backgroundColor: compact ? 'rgba(252, 252, 250, .88)' : 'rgba(252, 252, 250, 0)',
        boxShadow: compact ? '0 4px 20px rgba(15, 23, 42, .06)' : '0 0 0 rgba(15, 23, 42, 0)',
        borderColor: compact ? 'rgba(226, 225, 220, .95)' : 'rgba(226, 225, 220, 0)',
        duration: .28,
        overwrite: true,
      });
      gsap.to('[data-nav-inner]', { paddingTop: compact ? 11 : 16, paddingBottom: compact ? 11 : 16, duration: .28, overwrite: true });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, { scope: header });

  return (
    <header
      ref={header}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent backdrop-blur-xl"
    >
      <nav data-nav-inner className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-950"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <BriefcaseBusiness className="h-4 w-4" />
          </span>
          ApplyFlow
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          <a href="#features" className="transition hover:text-slate-950">
            Features
          </a>
          <a href="#workflow" className="transition hover:text-slate-950">
            Workflow
          </a>
          <a href="#dashboard" className="transition hover:text-slate-950">
            Dashboard
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/80 hover:text-slate-950"
          >
            Sign in
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
