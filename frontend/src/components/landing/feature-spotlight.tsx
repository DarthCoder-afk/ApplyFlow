'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FeatureSpotlightItem } from './data/features-data';
import FeatureMock from './feature-mock';

type FeatureSpotlightProps = {
  feature: FeatureSpotlightItem;
  index: number;
  reverse?: boolean;
  variant: 'light' ;
};

export default function FeatureSpotlight({
  feature,
  index,
  reverse = false,
  variant = 'light',
}: FeatureSpotlightProps) {
    const sectionBg = 'bg-[#FAF9F6] text-slate-900';
    const eyebrow = 'border-slate-200 bg-white text-slate-600';
    const body = 'text-slate-600';
    const bulletIcon = 'text-cyan-600';
    const cta = 'text-cyan-700 hover:text-cyan-600';

  return (
    <section className={`w-full ${sectionBg}`}>
      <div
        className={`mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-2 ${
          reverse ? 'md:[direction:rtl]' : ''
        }`}
      >
        <motion.div
          className="md:[direction:ltr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <p
            className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${eyebrow}`}
          >
            {feature.eyebrow}
          </p>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">{feature.title}</h2>
          <p className={`mt-4 max-w-lg ${body}`}>{feature.description}</p>

          <ul className="mt-6 space-y-3">
            {feature.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <Check className={`mt-0.5 h-5 w-5 shrink-0 ${bulletIcon}`} />
                <span className={body}>{bullet}</span>
              </li>
            ))}
          </ul>

          <Link href="/register" className={`mt-8 inline-flex font-medium ${cta}`}>
            Start tracking →
          </Link>
        </motion.div>

        <motion.div
          className="md:[direction:ltr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FeatureMock icon={feature.icon} variant={variant} />
        </motion.div>
      </div>
    </section>
  );
}
