import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfa] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:py-7">
        <div data-auth="logo" className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <Image src="/applyflow-icon.svg" alt="" width={36} height={36} className="h-9 w-9" />
            ApplyFlow
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-[#6657d9]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}
