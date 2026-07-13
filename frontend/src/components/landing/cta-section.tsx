import Link from 'next/link';
import FadeUp from '../animations/fade-up';

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f8f9fa] text-[#212529]">
      <div className="relative mx-auto w-full max-w-4xl px-6 py-24 text-center">
        <FadeUp delay={0.05}>
          <p className="mb-4 inline-flex items-center rounded-full border border-[#dee2e6] bg-white text-[#6c757d] px-3 py-1 text-xs uppercase tracking-wider">
            Get started today
          </p>
        </FadeUp>

        <FadeUp delay={0.12}>
          <h2 className="text-3xl font-bold md:text-4xl">
            Land your next role{' '}
            <span className="bg-gradient-to-r gradient from-[#212529] to-[#343a40] bg-clip-text text-transparent">
              faster
            </span>{' '}
            with Job Tracker
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mx-auto mt-4 max-w-2xl text-[#6c757d]">
            Track applications, monitor progress, and stay organized — free.
          </p>
        </FadeUp>

        <FadeUp delay={0.28}>
          <Link
            href="/register"
            className="inline-flex rounded-lg bg-[#212529] px-6 py-3 font-medium text-white transition hover:bg-[#343a40] mt-4"
          >
            Get Started — It&apos;s free
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
