import Link from 'next/link';
import FadeUp from '../animations/fade-up';
import FloatingCharacter from '../animations/floating-character';

export default function HeroSection() {
  return (
    <>
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <FadeUp delay={0.05}>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
              Job Tracker
            </p>
          </FadeUp>

          <FadeUp delay={0.12}>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Track Every Application.
              <span className="block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Land Your Next Role Faster.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="max-w-xl text-slate-300">
              Save jobs, track application status, and monitor progress with clear dashboards.
            </p>
          </FadeUp>

          <FadeUp delay={0.28}>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-600 px-5 py-3 font-medium transition hover:border-slate-400 hover:bg-slate-900/60"
              >
                Login
              </Link>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.18} className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Your Progress</h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                +3 this week
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-800 p-3">
                <p className="text-xs text-slate-400">Applications</p>
                <p className="text-xl font-bold">24</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-800 p-3">
                  <p className="text-xs text-slate-400">Interview</p>
                  <p className="text-lg font-semibold text-cyan-300">5</p>
                </div>
                <div className="rounded-xl bg-slate-800 p-3">
                  <p className="text-xs text-slate-400">Offer</p>
                  <p className="text-lg font-semibold text-violet-300">1</p>
                </div>
              </div>
            </div>
          </div>

          <FloatingCharacter />

          <div className="absolute -left-5 bottom-8 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-300 shadow">
            Interview on Friday 🎯
          </div>
        </FadeUp>
      </section>
    </>
  );
}
