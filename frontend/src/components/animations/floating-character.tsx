'use client';

import { motion } from 'framer-motion';

type FloatingCharacterProps = {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'lg';
};

export default function FloatingCharacter({
  variant = 'dark',
  size = 'sm',
}: FloatingCharacterProps) {
  const shell =
    variant === 'light'
      ? 'border-slate-200 bg-white shadow-lg'
      : 'border-slate-700 bg-slate-900 shadow-lg';

  const emojiSize = size === 'lg' ? 'text-6xl' : 'text-2xl';
  const padding = size === 'lg' ? 'px-8 py-6' : 'px-4 py-2';

  return (
    <motion.div
      className={`rounded-full border ${shell} ${padding} ${emojiSize}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: 0.3 },
        scale: { duration: 0.5, delay: 0.3 },
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      👨‍💻
    </motion.div>
  );
}