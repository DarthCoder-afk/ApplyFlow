import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import FadeUp from '../animations/fade-up';
import FloatingCharacter from '../animations/floating-character';

export default function HeroSection() {
  return (
    <>
      <section className="relative isolate w-full overflow-hidden bg-slate-50 text-slate-900">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_70%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_25%_30%,rgba(139,92,246,0.12),transparent_24%)]" />
        <div className="pointer-events-none absolute right-[-8rem] top-32 -z-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-7">
            <FadeUp delay={0.05}>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />A calmer way to job hunt
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
                Make every
                <span className="block bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  application count.
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Replace scattered spreadsheets with one focused workspace for opportunities,
                applications, interviews, and follow-ups.
              </p>
            </FadeUp>

            <FadeUp delay={0.28}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-medium text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                  Log in
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.34}>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {['No credit card', 'Free to get started', 'Built for focus'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.18} className="relative mx-auto w-full max-w-lg">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white sm:p-7">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Overview
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">Your momentum</h3>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    +3 this week
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">Applications</p>
                    <p className="mt-1 text-4xl font-semibold">24</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">Interviews</p>
                    <p className="mt-1 text-2xl font-semibold">5</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 p-4">
                    <p className="text-xs text-slate-300">Next up</p>
                    <p className="mt-1 text-sm font-medium">Design interview · Friday</p>
                  </div>
                </div>
              </div>
            </div>

            <FloatingCharacter variant="light" />

            <div className="absolute -left-5 bottom-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-600 shadow-lg">
              <span className="mr-1.5 text-base">🎯</span> Interview on Friday
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
