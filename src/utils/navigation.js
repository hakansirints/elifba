import { useSyncExternalStore } from 'react';
import { BASE, routeUrl } from './urls';
const getRoute = () => BASE !== '/' ? (location.hash.startsWith('#/') ? location.hash.slice(1) : '/') : location.pathname + location.search;

export function navigate(to, { replace = false } = {}) {
  if (to === getRoute()) return;
  history[replace ? 'replaceState' : 'pushState']({}, '', routeUrl(to));
  window.dispatchEvent(new Event('elifba:navigate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function subscribe(callback) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  window.addEventListener('elifba:navigate', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
    window.removeEventListener('elifba:navigate', callback);
  };
}
export function useRoute() {
  return useSyncExternalStore(subscribe, getRoute);
}
