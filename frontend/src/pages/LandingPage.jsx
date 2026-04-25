import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/motion/PageTransition.jsx';
import Button from '../components/ui/Button.jsx';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-balance text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Shorten, track, and manage your{' '}
            <span className="text-grad">links</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Shortly is a modern URL shortener that helps you create clean, trackable links. 
            Monitor clicks, manage your URLs, and keep everything organized in one beautiful dashboard.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate('/home')}
              className="px-8 py-3 text-base"
            >
              Get Started
            </Button>
            <Button
              variant="subtle"
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-base"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          className="mt-20 grid gap-6 sm:grid-cols-3"
        >
          <div className="glass rounded-2xl p-6 text-left">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-2xl">
              🔗
            </div>
            <h3 className="text-lg font-bold text-white">Shorten URLs</h3>
            <p className="mt-2 text-sm text-slate-400">
              Transform long, unwieldy URLs into clean, shareable short links in seconds.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/20 text-2xl">
              📊
            </div>
            <h3 className="text-lg font-bold text-white">Track Analytics</h3>
            <p className="mt-2 text-sm text-slate-400">
              Monitor click counts and engagement for every link you create.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-2xl">
              🔒
            </div>
            <h3 className="text-lg font-bold text-white">Secure & Private</h3>
            <p className="mt-2 text-sm text-slate-400">
              JWT authentication keeps your links private and your data secure.
            </p>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
          className="mt-20"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Built with modern technology
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚛️</span>
              <span>React</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span>Vite</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔐</span>
              <span>JWT Auth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <span>Spring Boot</span>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
