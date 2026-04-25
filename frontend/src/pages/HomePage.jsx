import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Toast from '../components/ui/Toast.jsx';
import { getApiErrorMessage } from '../services/apiClient.js';
import { shortenUrl } from '../services/urlService.js';
import { upsertLink } from '../services/storage.js';
import { useAuth } from '../hooks/useAuth.jsx';

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function extractShortCode(shortUrl) {
  try {
    const u = new URL(shortUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'r' && parts[1]) return parts[1];
    return '';
  } catch {
    return '';
  }
}

export default function LandingPage() {
  const { isAuthed } = useAuth();

  const [url, setUrl] = React.useState('');
  const [shortUrlValue, setShortUrlValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [toast, setToast] = React.useState({ show: false, tone: 'info', title: '', message: '' });

  const canSubmit = isAuthed && url.trim().length > 0 && !loading;
  const urlError =
    url.trim().length === 0 ? '' : isValidUrl(url.trim()) ? '' : 'Please enter a valid http(s) URL';

  async function onShorten(e) {
    e.preventDefault();
    setError('');
    setShortUrlValue('');

    const value = url.trim();
    if (!isAuthed) {
      setError('Please login to shorten URLs.');
      return;
    }
    if (!isValidUrl(value)) {
      setError('Please enter a valid http(s) URL.');
      return;
    }

    setLoading(true);
    try {
      const data = await shortenUrl(value);
      const shortUrl = data?.shortUrl || '';
      setShortUrlValue(shortUrl);

      const shortCode = extractShortCode(shortUrl);
      if (shortCode) {
        upsertLink({
          shortCode,
          shortUrl,
          longUrl: value,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shortUrlValue);
      setToast({
        show: true,
        tone: 'success',
        title: 'Copied',
        message: 'Short URL copied to clipboard.'
      });
      window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
    } catch {
      setToast({
        show: true,
        tone: 'error',
        title: 'Copy failed',
        message: 'Your browser blocked clipboard access.'
      });
    }
  }

  return (
    <PageTransition>
      <Toast
        show={toast.show}
        tone={toast.tone}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl"
          >
            Shorten links with <span className="text-grad">style</span> and track clicks.
          </motion.h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-slate-300">
            Paste a long URL, generate a clean short link, and view analytics in your dashboard.
            Authentication keeps your links private.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-400">API</div>
              <div className="mt-1 font-semibold text-white/90">JWT-protected</div>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-400">UX</div>
              <div className="mt-1 font-semibold text-white/90">Framer Motion</div>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-400">Design</div>
              <div className="mt-1 font-semibold text-white/90">Glass + gradient</div>
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4">
              <div className="text-sm font-semibold text-white">Shorten a URL</div>
              <div className="mt-1 text-xs text-slate-400">
                {isAuthed ? 'JWT detected. You can shorten links.' : 'Login required for /api/shorten.'}
              </div>
            </div>

            <form onSubmit={onShorten} className="space-y-4">
              <Input
                label="Long URL"
                placeholder="https://example.com/very/long/link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={error || urlError}
                autoComplete="off"
                spellCheck={false}
              />

              <Button type="submit" disabled={!canSubmit || Boolean(urlError)} className="w-full">
                {loading ? (
                  <>
                    <Spinner />
                    Shortening…
                  </>
                ) : (
                  'Shorten'
                )}
              </Button>
            </form>

            {shortUrlValue ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">Short URL</div>
                    <a
                      href={shortUrlValue}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-sm font-semibold text-sky-200 hover:text-sky-100"
                    >
                      {shortUrlValue}
                    </a>
                  </div>
                  <Button variant="subtle" onClick={copyToClipboard}>
                    Copy
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

