export const READER_DEFAULTS = { theme: 'light', spread: false, speed: 1, brightness: 1 };
export function restoreReader(saved = {}, total = 74) {
  const preferences = saved.preferences || {};
  return {
    page: Math.max(1, Math.min(total, Math.trunc(Number(saved.page)) || 1)),
    bookmarks: [...new Set((Array.isArray(saved.bookmarks) ? saved.bookmarks : []).filter(n => Number.isInteger(n) && n >= 1 && n <= total))],
    notes: Object.fromEntries(Object.entries(saved.notes || {}).filter(([n, text]) => Number.isInteger(Number(n)) && Number(n) >= 1 && Number(n) <= total && typeof text === 'string').map(([n, text]) => [n, text.slice(0, 10000)])),
    preferences: {
      theme: ['light', 'sepia', 'dark'].includes(preferences.theme) ? preferences.theme : 'light',
      spread: preferences.spread === true,
      speed: [0.5, 0.75, 1, 1.25, 1.5, 2].includes(preferences.speed) ? preferences.speed : 1,
      brightness: Number.isFinite(preferences.brightness) ? Math.max(0.7, Math.min(1, preferences.brightness)) : 1,
    },
  };
}
export const normalizeReaderText = value => String(value).toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '').replace(/ı/g, 'i').replace(/\s+/g, ' ').trim();
export function searchReaderPages(pages, query) {
  const term = normalizeReaderText(query);
  if (!term) return [];
  return pages.filter(p => String(p.page_number) === term || normalizeReaderText(`${p.title || ''} ${p.text || ''}`).includes(term));
}
