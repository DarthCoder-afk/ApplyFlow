'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-6">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={faq.question} className="py-5">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 text-left font-medium text-slate-900"
            >
              {faq.question}
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition duration-300 ${
                  isOpen
                    ? 'rotate-180 bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
