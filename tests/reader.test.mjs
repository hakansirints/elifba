import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreReader, searchReaderPages } from '../src/utils/readerTools.js';
import { emptyStore, readStore, STORE_KEY } from '../src/utils/learningStore.js';

test('Reader notes, bookmarks and preferences survive saving and restoring the learning store', () => {
  const store = emptyStore();
  store.reader = { ...store.reader, page: 53, bookmarks: [53, 14], notes: { 53: 'Bu duayı tekrar et.' }, preferences: { ...store.reader.preferences, theme: 'sepia', spread: true, speed: .75, brightness: .85 } };
  assert.deepEqual(readStore({ getItem: key => key === STORE_KEY ? JSON.stringify(store) : null }).reader, store.reader);
});
test('Legacy reader data receives defaults; malformed positions, notes and preferences are bounded', () => {
  const restored = restoreReader({ page: 5.9, bookmarks: [1, 1, 75, '2'], notes: { 0: 'invalid', 12: 'x'.repeat(11000), 99: 'invalid', 13: 4 }, preferences: { theme: 'invalid', speed: 99, brightness: .1 } });
  assert.equal(restored.page, 5);
  assert.deepEqual(restored.bookmarks, [1]);
  assert.deepEqual(Object.keys(restored.notes), ['12']);
  assert.equal(restored.notes[12].length, 10000);
  assert.deepEqual(restored.preferences, { theme: 'aqua', spread: false, speed: 1, brightness: .7, activitiesEnabled: null });
  assert.equal(restoreReader({ page: 1000 }).page, 74);
  assert.deepEqual(restoreReader({ page: 14, bookmarks: [14] }).notes, {});
});
test('Book search handles Turkish letters, Arabic vowel marks, German accents and page numbers', () => {
  const pages = [{ page_number: 14, text: 'Kur’an HARFLERİ' }, { page_number: 53, text: 'Kunût Duâları · بِسْمِ' }, { page_number: 65, text: 'für dich' }];
  assert.deepEqual(searchReaderPages(pages, 'harfleri').map(p => p.page_number), [14]);
  assert.deepEqual(searchReaderPages(pages, 'kunut').map(p => p.page_number), [53]);
  assert.deepEqual(searchReaderPages(pages, 'بسم').map(p => p.page_number), [53]);
  assert.deepEqual(searchReaderPages(pages, 'fur').map(p => p.page_number), [65]);
  assert.deepEqual(searchReaderPages(pages, '53').map(p => p.page_number), [53]);
  assert.deepEqual(searchReaderPages(pages, '  '), []);
});


test('All three color modes survive restore, and legacy light migrates to aqua', () => {
  for (const theme of ['sepia','aqua','dark']) {
    const store=emptyStore(); store.theme=theme; store.reader.preferences.theme=theme;
    const restored=readStore({getItem:()=>JSON.stringify(store)});
    assert.equal(restored.theme,theme); assert.equal(restored.reader.preferences.theme,theme);
  }
  const store=emptyStore(); store.theme='light'; store.reader.preferences.theme='light';
  const restored=readStore({getItem:()=>JSON.stringify(store)});
  assert.equal(restored.theme,'aqua'); assert.equal(restored.reader.preferences.theme,'aqua');
});
