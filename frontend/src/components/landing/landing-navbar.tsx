'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const header = useRef<HTMLElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useGSAP(() => {
    const menu = mobileMenu.current;
    if (!menu) return;

    if (menuOpen) {
      gsap.set(menu, { display: 'block' });
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(menu, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: .28 })
        .fromTo(menu.querySelectorAll('[data-menu-item]'), { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: .22, stagger: .045 }, '-=.12');
      return;
    }

    gsap.to(menu, { autoAlpha: 0, y: -8, duration: .2, ease: 'power2.in', onComplete: () => gsap.set(menu, { display: 'none' }) });
  }, { dependencies: [menuOpen], scope: header, revertOnUpdate: false });

  function closeMobileMenu() {
    setMenuOpen(false);
  }

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
          <Image src="/applyflow-icon.svg" alt="" width={36} height={36} className="h-9 w-9" />
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

        <div className="hidden items-center gap-3 lg:flex">
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
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 transition hover:border-slate-300 hover:bg-white lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>
      <div
        ref={mobileMenu}
        id="mobile-navigation"
        style={{ display: 'none' }}
        className="absolute left-4 right-4 top-full rounded-2xl border border-[#e3e2dc] bg-[#fcfcfa] p-3 shadow-[0_20px_45px_-28px_rgba(15,23,42,.35)] lg:hidden"
      >
        <div className="space-y-1">
          <a data-menu-item href="#features" onClick={closeMobileMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f3f1fc] hover:text-[#6657d9]">Features</a>
          <a data-menu-item href="#workflow" onClick={closeMobileMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f3f1fc] hover:text-[#6657d9]">Workflow</a>
          <a data-menu-item href="#dashboard" onClick={closeMobileMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f3f1fc] hover:text-[#6657d9]">Dashboard</a>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200 pt-3">
          <Link data-menu-item href="/login" onClick={closeMobileMenu} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">Sign in</Link>
          <Link data-menu-item href="/register" onClick={closeMobileMenu} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#1d1c25] text-sm font-semibold text-white transition hover:bg-[#302d41]">Get started <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </header>
  );
}
