'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-[#dee2e6] bg-[#f8f9fa]/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-[#212529]">
          Job{' '}
          <span className="bg-gradient-to-r from-[#212529] to-[#343a40] bg-clip-text text-transparent">
            Tracker
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#6c757d] transition hover:text-[#212529]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#212529] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#343a40]"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
