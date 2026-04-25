import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.jsx';
import Button from '../ui/Button.jsx';
import { checkBackendHealth, getApiErrorMessage } from '../../services/apiClient.js';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  );
}

export default function AppShell({ children }) {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = React.useState('checking');
  const [statusError, setStatusError] = React.useState('');

  const refreshBackendStatus = React.useCallback(async () => {
    try {
      await checkBackendHealth();
      setBackendStatus('up');
      setStatusError('');
    } catch (err) {
      setBackendStatus('down');
      setStatusError(getApiErrorMessage(err));
    }
  }, []);

  React.useEffect(() => {
    refreshBackendStatus();
    const id = window.setInterval(refreshBackendStatus, 25000);
    return () => window.clearInterval(id);
  }, [refreshBackendStatus]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-48 right-[-120px] h-[460px] w-[460px] rounded-full bg-fuchsia-600/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 border border-white/10 shadow-glow"
              whileHover={{ rotate: 2, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg font-black text-grad">S</span>
            </motion.div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">Shortly</div>
              <div className="text-xs text-slate-400">Fast, clean, trackable links</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavItem to="/home">Home</NavItem>
            {isAuthed ? <NavItem to="/dashboard">Dashboard</NavItem> : null}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className={[
                'hidden rounded-full border px-3 py-1 text-xs md:inline-flex',
                backendStatus === 'up'
                  ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200'
                  : backendStatus === 'down'
                  ? 'border-rose-400/50 bg-rose-500/10 text-rose-200'
                  : 'border-amber-400/50 bg-amber-500/10 text-amber-200'
              ].join(' ')}
              title={statusError || 'Checks /actuator/health every 25 seconds'}
            >
              Backend: {backendStatus === 'up' ? 'Connected' : backendStatus === 'down' ? 'Down' : 'Checking'}
            </div>
            {isAuthed ? (
              <>
                <Button
                  variant="subtle"
                  onClick={() => navigate('/dashboard')}
                  className="hidden sm:inline-flex"
                >
                  Dashboard
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="subtle" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="hidden sm:inline-flex">
                  Create account
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 text-xs text-slate-500">
        Built for your Spring Boot URL Shortener API.
      </footer>
    </div>
  );
}

