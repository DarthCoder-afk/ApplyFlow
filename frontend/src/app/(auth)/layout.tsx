import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF9F6] text-slate-900">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <Link href="/" className="mb-8 text-lg font-semibold md:mb-12">
          Job{' '}
          <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
            Tracker
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
