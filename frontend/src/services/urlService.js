import { api } from './apiClient.js';

export async function shortenUrl(longUrl) {
  const res = await api.post('/api/shorten', { url: longUrl });
  // { shortUrl }
  return res.data;
}

export async function getAnalytics(shortCode) {
  const res = await api.get(`/api/analytics/${encodeURIComponent(shortCode)}`);
  // { shortCode, longUrl, clickCount }
  return res.data;
}

