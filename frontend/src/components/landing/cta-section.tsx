import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import FadeUp from '../animations/fade-up';

export default function CtaSection() {
  return (
    <section className="relative mx-auto mb-8 w-[calc(100%-2rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/15">
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="relative mx-auto w-full max-w-4xl px-6 py-20 text-center sm:py-24">
        <FadeUp delay={0.05}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Get started today
          </p>
        </FadeUp>

        <FadeUp delay={0.12}>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Your next role is closer than you think.
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Bring order to your search, keep the momentum, and make the next move with confidence.
          </p>
        </FadeUp>

        <FadeUp delay={0.28}>
          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
