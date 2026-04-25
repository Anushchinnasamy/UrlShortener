import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ show, tone = 'info', title, message, onClose }) {
  const toneStyles =
    tone === 'success'
      ? 'border-emerald-400/30 bg-emerald-500/10'
      : tone === 'error'
        ? 'border-rose-400/30 bg-rose-500/10'
        : 'border-indigo-400/30 bg-indigo-500/10';

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`glass ${toneStyles} fixed right-4 top-4 z-50 w-[min(92vw,380px)] rounded-2xl p-4`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              {title ? <div className="text-sm font-semibold text-white">{title}</div> : null}
              {message ? <div className="mt-1 text-sm text-slate-200/90">{message}</div> : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

