import { restoreReader } from './readerTools.js';
export const STORE_KEY = 'elifba:learning:v2';
export const CONTENT_VERSION = 1;
export const createProfile = (id, name, kind) => ({ id, name, kind, records: {}, stars: 0 });
export function emptyStore() {
  return { version: 2, theme: 'light', lang: 'tr', activeChildId: 'child-1', profiles: {
    adult: createProfile('adult', 'Yetişkin', 'adult'),
    'child-1': createProfile('child-1', 'Gezgin 1', 'kid'),
  }, reader: restoreReader(), lastVisit: null, effects: true };
}
export function readStore(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORE_KEY));
    if (saved?.version === 2 && saved.profiles?.adult && Array.isArray(saved.reader?.bookmarks)) {
      const base = emptyStore();
      const profiles = Object.fromEntries(Object.entries(saved.profiles).filter(([id, p]) =>
        p && p.id === id && typeof p.name === 'string' && ['adult', 'kid'].includes(p.kind) && p.records && typeof p.records === 'object'
      ));
      if (!profiles.adult) return base;
      if (!Object.values(profiles).some(p => p.kind === 'kid')) profiles['child-1'] = base.profiles['child-1'];
      return { ...base, ...saved, theme: saved.theme === 'dark' ? 'dark' : 'light', lang: saved.lang === 'de' ? 'de' : 'tr', profiles,
        lastVisit: /^\/(e-kitap|yetiskin|cocuk)(\/|\?|$)/.test(saved.lastVisit?.path || '') ? saved.lastVisit : null,
        activeChildId: profiles[saved.activeChildId]?.kind === 'kid' ? saved.activeChildId : Object.values(profiles).find(p => p.kind === 'kid').id,
        reader: restoreReader(saved.reader)
      };
    }
    // Keep old self-assessment and achievements as history, not measured mastery.
    const base = emptyStore();
    const old = storage.getItem('memorized_duas');
    const oldTopics = storage.getItem('kid_completed_topics');
    if (old || oldTopics) {
      base.legacy = { memorized: JSON.parse(old || '[]'), topics: JSON.parse(oldTopics || '[]') };
      if (Array.isArray(base.legacy.memorized)) base.profiles.adult.memorized = base.legacy.memorized.filter(id=>typeof id==='string');
    }
    return base;
  } catch { return emptyStore(); }
}
export function saveAttempt(store, profileId, lessonId, result, now = Date.now()) {
  const profile = store.profiles[profileId];
  if (!profile || !result.total || result.correct < 0 || result.correct > result.total) return store;
  const prev = profile.records[lessonId] || {};
  const passed = result.correct / result.total >= 0.8;
  const firstMastery = passed && !prev.mastered;
  const mastered = Boolean(prev.mastered || passed);
  const pending = new Set(prev.pending || []);
  (result.correctIds || []).forEach(id => pending.delete(id));
  (result.wrongIds || []).forEach(id => pending.add(id));
  const record = { ...prev, contentVersion: CONTENT_VERSION, attempts: (prev.attempts || 0) + 1,
    best: Math.max(prev.best || 0, result.correct / result.total), mastered,
    last: { correct: result.correct, total: result.total, at: now }, pending: [...pending],
    reviewAt: now + (passed ? 86400000 : 0),
  };
  return { ...store, profiles: { ...store.profiles, [profileId]: { ...profile,
    stars: (profile.stars || 0) + (firstMastery && profile.kind === 'kid' ? 3 : 0),
    records: { ...profile.records, [lessonId]: record },
  } } };
}
