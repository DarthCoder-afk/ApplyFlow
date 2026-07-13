import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="w-full border-t border-[#dee2e6] bg-[#f8f9fa] text-[#212529]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="text-lg font-semibold">
            Job{' '}
            <span className="bg-gradient-to-r from-[#212529] to-[#343a40] bg-clip-text text-transparent">
              Tracker
            </span>
          </Link>
          <p className="mt-3 text-sm leading-6 text-[#6c757d]">
            Track applications, monitor progress, and stay organized — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-[#212529]">Account</p>
          <Link href="/login" className="text-[#6c757d] transition hover:text-[#212529]">
            Login
          </Link>
          <Link href="/register" className="text-[#6c757d] transition hover:text-[#212529]">
            Register
          </Link>
        </div>
      </div>

      <div className="border-t border-[#dee2e6]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-[#6c757d] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Job Tracker</p>
          <p>Built for job seekers who want clarity and momentum.</p>
        </div>
      </div>
    </footer>
  );
}
