import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Search,
  Sparkles,
  Target,
} from 'lucide-react';
import FaqAccordion from './faq-accordion';

const audience = ['Career changers', 'New graduates', 'Ambitious job seekers', 'Organized teams of one'];

const steps = [
  {
    icon: Search,
    title: 'Save opportunities',
    description: 'Capture promising roles before another browser tab disappears into the noise.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Track every move',
    description: 'Keep applications, interview stages, notes, and next steps in one clear workflow.',
  },
  {
    icon: Target,
    title: 'Learn and improve',
    description: 'See the patterns in your search, protect your momentum, and focus on what works.',
  },
];

const faqs = [
  {
    question: 'Is Job Tracker free to use?',
    answer: 'Yes. You can start organizing your job search for free, without a credit card.',
  },
  {
    question: 'Can I track different stages for every application?',
    answer: 'Yes. Move applications through saved, applied, interview, offer, rejected, and withdrawn stages as your search evolves.',
  },
  {
    question: 'Will it replace my existing job boards?',
    answer: 'Job Tracker works alongside job boards. Save the opportunities you find and use one place to manage the follow-through.',
  },
  {
    question: 'Can I add notes and follow-ups?',
    answer: 'Yes. Add context, interview notes, and reminders so every next step is easy to find when you need it.',
  },
];

export function TrustedBySection() {
  return (
    <section className="border-y border-slate-200 bg-white" aria-label="Built for job seekers">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Built for every kind of job search
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {audience.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-600"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardPreviewSection() {
  return (
    <section id="dashboard" className="bg-slate-950 py-24 text-white sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" /> Your command center
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            See the whole search without losing the details.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Start each day with a useful snapshot: where applications stand, what needs follow-up,
            and which opportunity deserves your attention next.
          </p>
          <div className="mt-8 space-y-4">
            {['One home for jobs, applications, and notes', 'Clear next steps that keep your search moving', 'A calm view of progress, even on busy weeks'].map(
              (item) => (
                <p key={item} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-300" />
                  {item}
                </p>
              )
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-cyan-950/30">
          <div className="overflow-hidden rounded-[1.4rem] bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Monday overview</p>
                <h3 className="mt-1 text-xl font-semibold">Good morning, Alex</h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['24', 'Active applications', 'text-white'],
                ['5', 'Interviews', 'text-cyan-300'],
                ['3', 'Follow-ups today', 'text-violet-300'],
              ].map(([value, label, color]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className={`text-2xl font-semibold ${color}`}>{value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Next up</p>
                <span className="rounded-full bg-violet-400/15 px-2.5 py-1 text-xs font-medium text-violet-200">Friday</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/15 text-cyan-300">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Product design interview</p>
                  <p className="mt-0.5 text-xs text-slate-400">Acme Co. · 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnalyticsPreviewSection() {
  const bars = [38, 52, 42, 76, 64, 92, 71];

  return (
    <section id="analytics" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="order-2 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-7 lg:order-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Search activity</p>
              <p className="mt-1 text-sm text-slate-500">A clearer view of your recent momentum</p>
            </div>
            <BarChart3 className="h-5 w-5 text-violet-600" />
          </div>
          <div className="mt-8 flex h-44 items-end gap-3 border-b border-slate-100 pb-3">
            {bars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-cyan-400"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] font-medium text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ['32', 'Applications'],
              ['7', 'Interviews'],
              ['22%', 'Response rate'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-semibold text-slate-900">{value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            Analytics that stays human
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Turn job-search effort into useful insight.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Notice your strongest sources, spot quiet weeks, and understand your application funnel without maintaining another spreadsheet.
          </p>
          <Link href="/register" className="mt-7 inline-flex items-center gap-2 font-medium text-slate-950 transition hover:text-violet-700">
            Start tracking your progress <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A simple system for a complicated search.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <span className="absolute right-6 top-6 text-sm font-semibold text-slate-300">0{index + 1}</span>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">FAQ</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Questions, answered.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-slate-600">
            Everything you need to know before bringing your job search into one focused workspace.
          </p>
        </div>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
