const TOKEN_KEY = 'us_jwt';
const LINKS_KEY = 'us_links_v1';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function loadLinks() {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLinks(links) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function upsertLink(newLink) {
  const links = loadLinks();
  const idx = links.findIndex((l) => l.shortCode === newLink.shortCode);
  const merged = idx >= 0 ? { ...links[idx], ...newLink } : newLink;
  const next = idx >= 0 ? links.map((l, i) => (i === idx ? merged : l)) : [merged, ...links];
  saveLinks(next);
  return next;
}

export function removeLink(shortCode) {
  const next = loadLinks().filter((l) => l.shortCode !== shortCode);
  saveLinks(next);
  return next;
}

