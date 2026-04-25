import React from 'react';
import { motion } from 'framer-motion';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ' +
  'transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-0 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary:
    'bg-indigo-500/90 hover:bg-indigo-400 text-white shadow-glow border border-white/10',
  subtle:
    'bg-white/5 hover:bg-white/10 text-white border border-white/10',
  danger:
    'bg-rose-500/90 hover:bg-rose-400 text-white border border-white/10'
};

export default function Button({
  asChild = false,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const Comp = asChild ? 'span' : motion.button;
  const v = variants[variant] ?? variants.primary;

  return (
    <Comp
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${v} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}

