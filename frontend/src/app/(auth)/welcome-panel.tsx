'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const highlights = [
  'Track every application in one place',
  'Monitor interviews and offers',
  'Stay organized without spreadsheets',
];

type AuthWelcomePanelProps = {
  mode?: 'login' | 'register';
};

const content = {
  login: {
    title: 'Welcome back!',
    gradient: 'Your applications are waiting.',
    description:
      'Log in to manage your pipeline, update statuses, and keep momentum in your job search.',
    highlights: [
      'Track every application in one place',
      'Monitor interviews and offers',
      'Stay organized without spreadsheets',
    ],
  },
  register: {
    title: 'Start tracking',
    gradient: 'your job search today.',
    description:
      'Create a free account and keep every application organized — no more messy spreadsheets.',
    highlights: [
      'Save and organize job leads',
      'Track status from Applied to Offer',
      'Notes and follow-ups in one place',
    ],
  },
};

export default function AuthWelcomePanel({ mode = 'login' }: AuthWelcomePanelProps) {
  const copy = content[mode];

  return (
    <div className="flex flex-col justify-center space-y-8 lg:pr-10">
      <div className="space-y-4 text-center md:text-left">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" />
          Your career workspace
        </p>
        <motion.h1
          className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {copy.title}
          <span className="mt-2 block bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {copy.gradient}
          </span>
        </motion.h1>

        <motion.p
          className="max-w-md leading-7 text-slate-600"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {copy.description}
        </motion.p>
      </div>

      <ul className="mx-auto max-w-md space-y-3 md:mx-0">
        {highlights.map((item, index) => (
          <motion.li
            key={item}
            className="flex items-start gap-3 text-sm text-slate-600"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + index * 0.08 }}
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100">
              <Check className="h-3 w-3 text-emerald-700" />
            </span>
            {copy.highlights[index]}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
