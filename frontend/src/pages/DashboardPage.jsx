import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Toast from '../components/ui/Toast.jsx';
import { getApiErrorMessage } from '../services/apiClient.js';
import { getAnalytics } from '../services/urlService.js';
import { loadLinks, removeLink, saveLinks } from '../services/storage.js';

function sortLinks(links) {
  return [...links].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export default function DashboardPage() {
  const [links, setLinks] = React.useState(() => sortLinks(loadLinks()));
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, tone: 'info', title: '', message: '' });

  const totalClicks = links.reduce((acc, l) => acc + (Number(l.clickCount) || 0), 0);

  async function refreshAnalytics() {
    if (!links.length) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        links.map(async (l) => {
          const a = await getAnalytics(l.shortCode);
          return { shortCode: l.shortCode, analytics: a };
        })
      );

      const map = new Map();
      for (const r of results) {
        if (r.status === 'fulfilled') map.set(r.value.shortCode, r.value.analytics);
      }

      const next = links.map((l) => {
        const a = map.get(l.shortCode);
        if (!a) return l;
        return {
          ...l,
          longUrl: a.longUrl || l.longUrl,
          clickCount: a.clickCount ?? l.clickCount
        };
      });

      setLinks(sortLinks(next));
      saveLinks(next);
    } catch (err) {
      setToast({
        show: true,
        tone: 'error',
        title: 'Refresh failed',
        message: getApiErrorMessage(err)
      });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refreshAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setToast({
        show: true,
        tone: 'success',
        title: 'Copied',
        message: 'Short URL copied to clipboard.'
      });
      window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 1600);
    } catch {
      setToast({
        show: true,
        tone: 'error',
        title: 'Copy failed',
        message: 'Your browser blocked clipboard access.'
      });
    }
  }

  function onRemove(shortCode) {
    const next = removeLink(shortCode);
    setLinks(sortLinks(next));
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

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            Your recently shortened links (stored locally) + live analytics from `GET /api/analytics`.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="subtle" onClick={refreshAnalytics} disabled={loading || !links.length}>
            {loading ? (
              <>
                <Spinner />
                Refreshing…
              </>
            ) : (
              'Refresh analytics'
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-xs text-slate-400">Links</div>
          <div className="mt-2 text-3xl font-black text-white">{links.length}</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400">Total clicks</div>
          <div className="mt-2 text-3xl font-black text-white">{totalClicks}</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400">Status</div>
          <div className="mt-2 text-sm font-semibold text-white/90">
            {loading ? 'Syncing…' : 'Up to date'}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        {!links.length ? (
          <Card>
            <div className="text-sm font-semibold text-white">No links yet</div>
            <p className="mt-2 text-sm text-slate-300">
              Go to the home page, shorten a URL, then come back here to see analytics.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {links.map((l) => (
              <motion.div
                key={l.shortCode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={l.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-semibold text-sky-200 hover:text-sky-100"
                        title={l.shortUrl}
                      >
                        {l.shortUrl}
                      </a>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {l.shortCode}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {Number(l.clickCount) || 0} clicks
                      </span>
                    </div>
                    <div className="mt-2 truncate text-xs text-slate-400" title={l.longUrl}>
                      {l.longUrl}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button variant="subtle" onClick={() => copy(l.shortUrl)}>
                      Copy
                    </Button>
                    <Button variant="subtle" onClick={() => window.open(l.shortUrl, '_blank', 'noreferrer')}>
                      Open
                    </Button>
                    <Button variant="danger" onClick={() => onRemove(l.shortCode)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

