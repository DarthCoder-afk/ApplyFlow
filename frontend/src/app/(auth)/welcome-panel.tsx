'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import FloatingCharacter from '@/src/components/animations/floating-character';

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
    bubble: 'Ready to pick up your job search? 🎯',
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
    bubble: 'Let’s get your job hunt organized! 🚀',
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
    <div className="flex flex-col justify-center space-y-8">
      <div className="relative flex justify-center md:justify-start">
        <FloatingCharacter variant="light" size="lg" />
        <motion.div
          className="absolute -bottom-2 left-1/2 max-w-[220px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm md:left-24 md:translate-x-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {copy.bubble}
        </motion.div>
      </div>

      <div className="space-y-4 text-center md:text-left">
        <motion.h1
          className="text-3xl font-bold leading-tight md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {copy.title}
          <span className="mt-2 block bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
            {copy.gradient}
          </span>
        </motion.h1>

        <motion.p
          className="max-w-md text-slate-600"
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
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
            {copy.highlights[index]}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
