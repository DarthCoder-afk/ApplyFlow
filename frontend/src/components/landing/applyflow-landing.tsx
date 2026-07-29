'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Bell, BriefcaseBusiness, CalendarDays, Check, ChevronRight, CircleCheck, FileText, MoreHorizontal, Search, Sparkles, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { name: 'Saved', count: 8, color: 'bg-slate-300' },
  { name: 'Applied', count: 12, color: 'bg-blue-500' },
  { name: 'Interview', count: 4, color: 'bg-violet-500' },
  { name: 'Offer', count: 1, color: 'bg-emerald-500' },
];

const workflow = [
  ['01', 'Save jobs worth your time', 'Keep the role, company, source, and first impressions together before a good listing disappears.', FileText],
  ['02', 'Move every application forward', 'A clear pipeline makes the next action obvious—from sending an application to following up.', Target],
  ['03', 'Walk into interviews prepared', 'Your interviews, notes, and reminders live beside the opportunity they belong to.', CalendarDays],
  ['04', 'See progress without the noise', 'A calm dashboard shows what is moving, what needs attention, and how far you have come.', CircleCheck],
] as const;

const capabilities = [
  ['Save', 'Jobs', BriefcaseBusiness],
  ['Track', 'Applications', FileText],
  ['Prepare', 'Interviews', CalendarDays],
  ['Plan', 'Calendar', Bell],
  ['Learn', 'Progress', Target],
] as const;

const focusAreas = [
  ['Jobs', 'Keep promising roles, sources, and notes in one deliberate shortlist.'],
  ['Applications', 'See exactly where each application stands, with no spreadsheet archaeology.'],
  ['Interviews', 'Make every conversation count with dates, preparation notes, and next steps.'],
  ['Progress', 'Understand your momentum at a glance and keep the search moving.'],
];

const dashboardViews = [
  { nav: 'Jobs', title: 'Saved jobs', description: 'A considered shortlist of your best opportunities', metrics: [['18', 'Saved roles', 'bg-slate-300'], ['6', 'New this week', 'bg-blue-500'], ['4', 'Closing soon', 'bg-amber-400']], chartTitle: 'Roles added', status: 'Curated', bars: [36, 55, 42, 72, 48, 84, 63] },
  { nav: 'Applications', title: 'Application pipeline', description: 'Every application, with a clear next step', metrics: [['12', 'Applied', 'bg-blue-500'], ['5', 'Awaiting reply', 'bg-violet-500'], ['3', 'Follow-ups due', 'bg-amber-400']], chartTitle: 'Applications sent', status: 'Moving', bars: [28, 62, 48, 78, 58, 88, 70] },
  { nav: 'Calendar', title: 'Interview schedule', description: 'Prepare for every conversation with context', metrics: [['4', 'Interviews', 'bg-violet-500'], ['2', 'This week', 'bg-blue-500'], ['1', 'Prep notes ready', 'bg-emerald-500']], chartTitle: 'Interview activity', status: 'Prepared', bars: [22, 42, 76, 52, 86, 63, 74] },
  { nav: 'Overview', title: 'Search overview', description: 'A focused view of your momentum', metrics: [['18', 'Active applications', 'bg-blue-500'], ['4', 'Interviews', 'bg-violet-500'], ['1', 'Offer', 'bg-emerald-500']], chartTitle: 'This week', status: 'On track', bars: [35, 58, 42, 74, 52, 88, 68] },
];

function ProductBoard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-[0_22px_70px_-30px_rgba(15,23,42,.28)] ${compact ? 'text-xs' : ''}`}>
      <div className="flex h-11 items-center justify-between border-b border-slate-100 px-4">
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#6657d9]" /><span className="font-semibold text-slate-800">Applications</span></div>
        <MoreHorizontal className="h-4 w-4 text-slate-400" />
      </div>
      <div className="grid grid-cols-3 gap-2 bg-[#f8f8f6] p-3">
        {[
          ['Saved', 'Artemis', 'Product Designer'],
          ['Applied', 'Northstar', 'Product Designer'],
          ['Interview', 'Lumen', 'UX Designer'],
        ].map(([stage, company, role], index) => (
          <div key={stage} className="min-w-0">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">{stage}</p>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
              <div className={`h-1 w-8 rounded-full ${index === 0 ? 'bg-slate-300' : index === 1 ? 'bg-blue-500' : 'bg-violet-500'}`} />
              <p className="mt-3 truncate font-semibold text-slate-800">{company}</p>
              <p className="mt-1 truncate text-[10px] text-slate-500">{role}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400"><span>Today</span><span className="h-4 w-4 rounded-full bg-slate-100" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ApplyFlowLanding() {
  const root = useRef<HTMLDivElement>(null);
  const heroVisual = useRef<HTMLDivElement>(null);
  const [activeFocus, setActiveFocus] = useState(0);
  const dashboardView = dashboardViews[activeFocus];

  useGSAP(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('[data-hero="eyebrow"]', { y: 12, autoAlpha: 0, duration: .45 })
      .from('[data-hero="title"]', { y: 28, autoAlpha: 0, duration: .7 }, '-=.15')
      .from('[data-hero="copy"]', { y: 18, autoAlpha: 0, duration: .55 }, '-=.38')
      .from('[data-hero="actions"]', { y: 14, autoAlpha: 0, duration: .45 }, '-=.3')
      .from('[data-hero="board"]', { y: 28, scale: .97, autoAlpha: 0, duration: .85 }, '-=.7')
      .from('[data-hero="float"]', { y: 16, autoAlpha: 0, stagger: .13, duration: .5 }, '-=.5');

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element, index) => {
      gsap.from(element, { y: index % 2 ? 24 : 34, autoAlpha: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } });
    });

    gsap.to('[data-workflow-line]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '[data-workflow]', start: 'top 70%', end: 'bottom 65%', scrub: true } });

    const focusMedia = gsap.matchMedia();
    focusMedia.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: '[data-dashboard-story]',
        start: 'top top+=88',
        end: '+=1200',
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setActiveFocus(Math.min(3, Math.floor(self.progress * 4))),
      });
    });
    focusMedia.add('(max-width: 1023px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-focus-step]').forEach((step, index) => {
        ScrollTrigger.create({ trigger: step, start: 'top 54%', end: 'bottom 54%', onEnter: () => setActiveFocus(index), onEnterBack: () => setActiveFocus(index) });
      });
    });
  }, { scope: root });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!heroVisual.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = heroVisual.current.getBoundingClientRect();
    gsap.to(heroVisual.current, { x: (event.clientX - rect.left - rect.width / 2) * .018, y: (event.clientY - rect.top - rect.height / 2) * .018, duration: .5, ease: 'power2.out', overwrite: true });
  }

  return (
    <div ref={root} className="bg-[#fcfcfa] text-slate-900">
      <section className="relative overflow-hidden pt-28 sm:pt-36" onPointerMove={handlePointerMove} onPointerLeave={() => gsap.to(heroVisual.current, { x: 0, y: 0, duration: .7, ease: 'power3.out' })}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[linear-gradient(180deg,#f6f5f0_0%,#fcfcfa_86%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:pb-32">
          <div className="max-w-xl">
            <p data-hero="eyebrow" className="inline-flex items-center gap-2 rounded-full border border-[#dedcd5] bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-[#6657d9]" />A clearer job search</p>
            <h1 data-hero="title" className="mt-6 text-[2.9rem] font-semibold leading-[1.04] tracking-[-.055em] text-slate-950 sm:text-6xl">Organize every application.<br /><span className="text-[#6657d9]">Never lose track</span> of what&apos;s next.</h1>
            <p data-hero="copy" className="mt-6 max-w-lg text-[1.05rem] leading-8 text-slate-600">ApplyFlow gives every opportunity a home—from the job you saved to the interview you are preparing for—so your search feels focused, not frantic.</p>
            <div data-hero="actions" className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-[#1d1c25] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#302d41]">Get started free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link><a href="#workflow" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">See how it works</a></div>
            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><Check className="h-3.5 w-3.5 text-emerald-600" />Free to start. Built for your search.</p>
          </div>
          <div ref={heroVisual} className="relative mx-auto w-full max-w-2xl lg:pt-5">
            <div data-hero="board" className="rounded-[1.75rem] border border-slate-200/90 bg-white p-3 shadow-[0_30px_90px_-34px_rgba(15,23,42,.34)]"><div className="rounded-[1.2rem] bg-[#f6f6f4] p-4 sm:p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">Tuesday, October 24</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Good morning, Jordan</h2></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#ebe9fb] text-[#6657d9]"><Sparkles className="h-4 w-4" /></div></div><div className="grid gap-3 sm:grid-cols-3">{[['18','Active applications'],['3','Interviews this week'],['2','Follow-ups due']].map(([number,label], i) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><p className={`text-2xl font-semibold tracking-tight ${i === 1 ? 'text-[#6657d9]' : 'text-slate-900'}`}>{number}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{label}</p></div>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_.92fr]"><ProductBoard compact /><div className="rounded-[1.1rem] border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Next up</p><span className="text-[10px] font-medium text-[#6657d9]">View calendar</span></div><div className="mt-4 rounded-xl bg-[#f3f1fc] p-3"><div className="flex items-start gap-2"><CalendarDays className="mt-.5 h-4 w-4 shrink-0 text-[#6657d9]" /><div><p className="text-xs font-semibold">Design interview</p><p className="mt-1 text-[10px] text-slate-500">Lumen · Today at 2:00 PM</p></div></div></div><div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500"><span className="h-6 w-6 rounded-full bg-slate-200" />Prep notes ready</div></div></div></div></div>
            <div data-hero="float" className="absolute -left-6 bottom-8 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:block"><p className="text-[10px] font-medium text-slate-400">APPLICATION RATE</p><p className="mt-1 text-lg font-semibold">+24% <span className="text-xs font-medium text-emerald-600">this month</span></p></div>
            <div data-hero="float" className="absolute -right-3 top-14 hidden rounded-2xl border border-[#dcd8fa] bg-[#f8f7ff] px-3 py-2.5 shadow-lg sm:flex sm:items-center sm:gap-2"><Bell className="h-4 w-4 text-[#6657d9]" /><p className="text-xs font-medium">Follow up with Northstar</p></div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#e8e7e2] bg-[#f7f7f4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#6657d9]">One focused system</p>
            <p className="mt-3 max-w-md text-lg leading-7 tracking-tight text-slate-700">From the role you save to the offer you accept, each part of the search stays connected.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-x-8 lg:flex-nowrap lg:justify-between lg:gap-x-4">
            {capabilities.map(([verb, label, Icon], index) => <div key={label} className="flex items-center gap-4 lg:gap-3"><div className="flex items-center gap-2 whitespace-nowrap"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#e1dff0] bg-white text-[#6657d9]"><Icon className="h-3.5 w-3.5" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">{verb}</p><p className="mt-0.5 text-sm font-semibold text-slate-800">{label}</p></div></div>{index < capabilities.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-[#b9b4e8]" />}</div>)}
          </div>
        </div>
      </section>

      <section id="workflow" data-workflow className="mx-auto max-w-7xl px-6 py-28 sm:py-36"><div data-reveal className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#6657d9]">The workflow</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">A job search with a place for every next move.</h2><p className="mt-5 text-lg leading-8 text-slate-600">ApplyFlow turns the messy middle of searching into a simple, steady rhythm.</p></div><div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4"><div className="absolute left-[13%] right-[13%] top-[3.7rem] hidden h-px origin-left bg-[#a9a1ef] lg:block" data-workflow-line style={{ transform: 'scaleX(0)' }} />{workflow.map(([number, title, copy, Icon]) => <article data-reveal key={number} className="relative rounded-2xl border border-[#e5e4df] bg-white p-6 transition-shadow hover:shadow-[0_18px_50px_-30px_rgba(15,23,42,.4)]"><div className="flex items-center justify-between"><span className="text-xs font-semibold tracking-[.14em] text-[#6657d9]">{number}</span><div className="relative z-10 grid h-10 w-10 place-items-center rounded-xl bg-[#f1f0fb] text-[#6657d9]"><Icon className="h-4 w-4" /></div></div><h3 className="mt-10 text-lg font-semibold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p></article>)}</div></section>

      <section id="dashboard" className="border-y border-[#e8e7e2] bg-[#f4f3ef] py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#6657d9]">Your command center</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">Everything important, without the visual noise.</h2></div>
          <div data-dashboard-story className="mt-16 grid gap-10 lg:grid-cols-[.52fr_1fr] lg:items-center">
            <div className="space-y-3 lg:py-10">
              {focusAreas.map(([label, copy], index) => <button data-focus-step type="button" onClick={() => setActiveFocus(index)} key={label} className={`block w-full rounded-xl border p-5 text-left transition-colors ${activeFocus === index ? 'border-[#c9c4f2] bg-white shadow-sm' : 'border-transparent'}`}><p className={`text-sm font-semibold ${activeFocus === index ? 'text-[#6657d9]' : 'text-slate-500'}`}>{label}</p><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></button>)}
            </div>
            <div data-reveal>
              <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-[0_28px_70px_-35px_rgba(15,23,42,.35)]">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#1d1c25] text-white"><BriefcaseBusiness className="h-4 w-4" /></div><p className="text-sm font-semibold">ApplyFlow</p><div className="ml-auto flex gap-1"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="h-2 w-2 rounded-full bg-slate-200" /></div></div>
                <div className="mt-4 grid gap-4 sm:grid-cols-[9rem_1fr]">
                  <aside className="rounded-xl bg-[#f7f7f5] p-3"><p className="px-2 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Workspace</p>{['Overview', 'Jobs', 'Applications', 'Calendar'].map((item) => <p key={item} className={`mt-2 rounded-lg px-2 py-2 text-xs font-medium ${dashboardView.nav === item ? 'bg-white text-[#6657d9] shadow-sm' : 'text-slate-500'}`}>{item}</p>)}</aside>
                  <div>
                    <div className="flex items-start justify-between"><div><p className="text-lg font-semibold tracking-tight">{dashboardView.title}</p><p className="mt-1 text-xs text-slate-500">{dashboardView.description}</p></div><Search className="h-4 w-4 text-slate-400" /></div>
                    <div className="mt-4 grid grid-cols-3 gap-2">{dashboardView.metrics.map(([value, label, color]) => <div key={label} className="rounded-xl border border-slate-100 p-2.5"><span className={`block h-1 w-6 rounded-full ${color}`} /><p className="mt-3 text-lg font-semibold">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div>)}</div>
                    <div className="mt-4 rounded-xl border border-slate-100 p-3"><div className="flex justify-between"><p className="text-xs font-semibold">{dashboardView.chartTitle}</p><p className="text-[10px] text-emerald-600">{dashboardView.status}</p></div><div className="mt-4 flex h-16 items-end gap-1.5">{dashboardView.bars.map((height, index) => <span key={index} className="flex-1 rounded-t bg-[#dcd8fa] transition-[height] duration-500" style={{ height: `${height}%` }} />)}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 sm:py-36"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div data-reveal><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#6657d9]">Less stress, more clarity</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">A calmer way to keep showing up.</h2></div><div className="grid gap-px overflow-hidden rounded-2xl border border-[#e5e4df] bg-[#e5e4df] sm:grid-cols-2">{[['Never forget a follow-up','The next step sits beside the application—not buried in an inbox.'],['Know where every application stands','A considered pipeline replaces a dozen disconnected lists.'],['Prepare for interviews with context','Dates, roles, and notes stay together when it matters.'],['Recognize your momentum','Useful progress, presented quietly and clearly.']].map(([title, copy]) => <article data-reveal key={title} className="bg-[#fcfcfa] p-7"><ChevronRight className="h-4 w-4 text-[#6657d9]" /><h3 className="mt-8 font-semibold tracking-tight">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></article>)}</div></div></section>

      <section id="get-started" className="px-6 pb-8"><div data-reveal className="mx-auto max-w-7xl overflow-hidden rounded-[1.8rem] bg-[#1d1c25] px-6 py-20 text-center text-white sm:px-12 sm:py-24"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#bdb5ff]">Start with clarity</p><h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Your search deserves a system that keeps up.</h2><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">Bring every opportunity into one focused place—and make your next move with confidence.</p><Link href="/register" className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1d1c25] transition hover:-translate-y-0.5 hover:bg-[#f0efff]">Create your free workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link></div></section>
    </div>
  );
}
