import Link from 'next/link';
import FadeUp from '../animations/fade-up';
import FloatingCharacter from '../animations/floating-character';

export default function HeroSection() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#f8f9fa] text-slate-900">
        <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 pb-20 pt-28 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <FadeUp delay={0.05}>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white text-[#6c757d] px-3 py-1 text-xs uppercase tracking-wider">
                Job Tracker
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <h1 className="text-4xl font-bold text-[#212529] leading-tight md:text-5xl">
                Land your next role
                <span className="block bg-gradient-to-r gradient from-[#212529] to-[#343a40] bg-clip-text text-transparent">
                  faster.
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="max-w-xl text-[#6c757d]">
                Track every application in one place — so you focus on applying, not juggling
                spreadsheets.
              </p>
            </FadeUp>

            <FadeUp delay={0.28}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-lg bg-[#212529] px-5 py-3 font-medium text-white transition hover:bg-[#343a40]"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-[#dee2e6] text-[#495057] px-5 py-3 font-medium transition hover:border-[#ced4da] hover:bg-white"
                >
                  Login
                </Link>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.18} className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-[#dee2e6] bg-white p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[#212529]">Your Progress</h3>
                <span className="rounded-full bg-[#212529]/20 px-2 py-1 text-xs text-[#212529]">
                  +3 this week
                </span>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-[#f8f9fa] p-3">
                  <p className="text-xs text-[#6c757d]">Applications</p>
                  <p className="text-xl font-bold text-[#212529]">24</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f8f9fa] p-3">
                    <p className="text-xs text-[#6c757d]">Interview</p>
                    <p className="text-lg font-semibold text-[#212529]">5</p>
                  </div>
                  <div className="rounded-xl bg-[#f8f9fa] p-3">
                    <p className="text-xs text-[#6c757d]">Offer</p>
                    <p className="text-lg font-semibold text-[#212529]">1</p>
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
