import Link from 'next/link';
import FadeUp from '../animations/fade-up';

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F6] text-slate-900">
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-24 text-center">
        <FadeUp delay={0.05}>
          <p className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white text-slate-600 px-3 py-1 text-xs uppercase tracking-wider">
            Get started today
          </p>
        </FadeUp>

        <FadeUp delay={0.12}>
          <h2 className="text-3xl font-bold md:text-4xl">
            Land your next role{' '}
            <span className="bg-gradient-to-r gradient from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              faster
            </span>{' '}
            with Job Tracker
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Track applications, monitor progress, and stay organized — free.
          </p>
        </FadeUp>

        <FadeUp delay={0.28}>
          <Link
            href="/register"
            className="inline-flex rounded-lg bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 mt-4"
          >
            Get Started — It&apos;s free
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
