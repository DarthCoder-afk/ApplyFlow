import Link from 'next/link';
import FadeUp from '../animations/fade-up';
import FloatingCharacter from '../animations/floating-character';

export default function HeroSection() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#FAF9F6] text-slate-900">
        <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 pb-20 pt-28 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <FadeUp delay={0.05}>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white text-slate-600 px-3 py-1 text-xs uppercase tracking-wider">
                Job Tracker
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight md:text-5xl">
                Land your next role
                <span className="block bg-gradient-to-r gradient from-cyan-600 to-violet-600 bg-clip-text text-transparent">
                  faster.
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="max-w-xl text-slate-600">
                Track every application in one place — so you focus on applying, not juggling
                spreadsheets.
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
                  className="rounded-lg border border-slate-300 text-slate-700 px-5 py-3 font-medium transition hover:border-slate-400 hover:bg-white"
                >
                  Login
                </Link>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.18} className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Your Progress</h3>
                <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-600">
                  +3 this week
                </span>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Applications</p>
                  <p className="text-xl font-bold text-slate-900">24</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Interview</p>
                    <p className="text-lg font-semibold text-cyan-600">5</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Offer</p>
                    <p className="text-lg font-semibold text-cyan-600">1</p>
                  </div>
                </div>
              </div>
            </div>

            <FloatingCharacter />

            <div className="absolute -left-5 bottom-8 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-md">
              Interview on Friday 🎯
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
