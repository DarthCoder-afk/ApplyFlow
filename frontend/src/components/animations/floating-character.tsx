"use client";

import { motion } from "framer-motion";

export default function FloatingCharacter() {
  return (
    <motion.div
      className="absolute -right-3 -top-5 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-2xl shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: 0.3 },
        scale: { duration: 0.5, delay: 0.3 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      👨‍💻
    </motion.div>
  );
}