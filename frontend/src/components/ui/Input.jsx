import React from 'react';
import { motion } from 'framer-motion';

export default function Input({ label, hint, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <div className="mb-2 text-sm font-medium text-slate-200">{label}</div> : null}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className={[
          'block w-full rounded-xl bg-white/5 border border-white/10',
          'px-4 py-3 text-sm text-white placeholder:text-slate-400',
          'focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/30',
          error ? 'border-rose-400/50 focus:border-rose-300/60 focus:ring-rose-400/20' : ''
        ].join(' ')}
        {...props}
      />
      {error ? (
        <div className="mt-2 text-xs text-rose-300">{error}</div>
      ) : hint ? (
        <div className="mt-2 text-xs text-slate-400">{hint}</div>
      ) : null}
    </label>
  );
}

