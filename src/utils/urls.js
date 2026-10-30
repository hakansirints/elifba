export const BASE = import.meta.env?.BASE_URL || '/';
export function assetUrl(value) {
  if (!value || /^(https?:|data:|blob:)/.test(value)) return value;
  const clean = value.replace(/^\/+/, '');
  if (BASE !== '/' && value.startsWith(BASE)) return value;
  return BASE + clean;
}
export function routeUrl(to) { return BASE === '/' ? to : BASE + '#' + to; }
