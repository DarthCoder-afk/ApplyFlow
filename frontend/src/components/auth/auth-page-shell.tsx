'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Bell, CalendarDays, Check } from 'lucide-react';

type AuthPageShellProps = {
  mode: 'login' | 'register';
  children: React.ReactNode;
};

const copy = {
  login: {
    title: 'Keep every opportunity moving forward.',
    description: 'Return to the jobs, applications, interviews, and follow-ups that keep your search moving.',
  },
  register: {
    title: 'A clearer home for your job search.',
    description: 'Give every opportunity a place, then focus on the next step with confidence.',
  },
};

export default function AuthPageShell({ mode, children }: AuthPageShellProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-auth="brand-copy"]', { y: 20, autoAlpha: 0, duration: .55 })
        .from('[data-auth="product"]', { y: 22, autoAlpha: 0, duration: .65 }, '-=.25')
        .from('[data-auth="card"]', { y: 16, autoAlpha: 0, duration: .55 }, '-=.5')
        .from('[data-auth="form-heading"]', { y: 12, autoAlpha: 0, duration: .4 }, '-=.3')
        .from('[data-auth="field"]', { y: 8, autoAlpha: 0, duration: .32, stagger: .07 }, '-=.15');
    });
  }, { scope: root });

  return (
    <div ref={root} className="grid w-full flex-1 items-center gap-10 py-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,.72fr)] lg:gap-16">
      <section className="order-2 hidden max-w-xl lg:order-1 lg:block">
        <div data-auth="brand-copy">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#dedcd5] bg-white px-3 py-1.5 text-xs font-medium text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-[#6657d9]" />Your job-search workspace</p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-.05em] text-slate-950">{copy[mode].title}</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">{copy[mode].description}</p>
        </div>
        <div data-auth="product" className="mt-10 max-w-lg rounded-[1.6rem] border border-[#e3e2dc] bg-white p-4 shadow-[0_28px_70px_-38px_rgba(15,23,42,.32)]">
            <div className="rounded-[1.15rem] bg-[#f7f7f5] p-4">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Image src="/applyflow-icon.svg" alt="" width={32} height={32} className="h-8 w-8" /><div><p className="text-xs font-semibold">ApplyFlow</p><p className="text-[10px] text-slate-500">Your search, organized</p></div></div><span className="rounded-full bg-[#eae8fb] px-2.5 py-1 text-[10px] font-semibold text-[#6657d9]">This week</span></div>
            <div className="mt-5 grid grid-cols-3 gap-2">{[['12','Applied'], ['3','Interviews'], ['1','Offer']].map(([value,label], index) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><span className={`block h-1 w-5 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-[#6657d9]' : 'bg-emerald-500'}`} /><p className="mt-3 text-lg font-semibold">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div>)}</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#6657d9]" /><div><p className="text-xs font-semibold">Design interview</p><p className="mt-1 text-[10px] text-slate-500">Lumen · Thursday, 2 PM</p></div></div></div><div className="rounded-xl bg-[#efedfB] p-3"><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[#6657d9]" /><div><p className="text-xs font-semibold">Follow-up ready</p><p className="mt-1 text-[10px] text-slate-500">Northstar · Today</p></div></div></div></div>
          </div>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-slate-500"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100"><Check className="h-3 w-3 text-emerald-700" /></span>Everything you need, without the spreadsheet.</p>
      </section>
      <section data-auth="card" className="order-1 mx-auto w-full max-w-[29rem] rounded-[1.45rem] border border-[#e3e2dc] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(15,23,42,.38)] sm:p-8 lg:order-2">
        {children}
      </section>
    </div>
  );
}
