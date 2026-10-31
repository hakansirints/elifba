import fs from 'node:fs';
import assert from 'node:assert/strict';
import { runtimeAssets } from './runtime-assets.mjs';
import { LETTERS, BOOK_ROWS, ACTIVITY_MODES, questionPool, THICK_IDS, LISP_IDS, NON_JOIN_IDS } from '../src/data/alphabetData.js';
const pages = JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
const files = runtimeAssets();
assert.equal(pages.length,74);
for (const {local_path} of files) assert.ok(fs.statSync(local_path).size > 0, local_path);
assert.equal(LETTERS.filter(l => l.kind !== 'ligature').length,28);
assert.equal(LETTERS.filter(l => l.kind === 'ligature').length,1);
assert.equal(THICK_IDS.length,7); assert.equal(LISP_IDS.length,3); assert.equal(NON_JOIN_IDS.length,6);
for (const l of LETTERS) {
  assert.ok(pages[13].hotspots.some(h => h.audio_path === l.audio), `Page 14 source: ${l.id}`);
  for (const lang of ['tr','de']) { assert.ok(l.shape[lang]); assert.ok(l.sound[lang]); }
}
assert.equal(BOOK_ROWS.length,10);
assert.ok(BOOK_ROWS.every(row => row.length === 6 && row.every(id => LETTERS.some(l => l.id === id))));
for (const mode of ACTIVITY_MODES) for (const q of questionPool(mode.id)) {
  assert.equal(q.options.filter(o => o.id === q.correctId).length,1,q.id);
  assert.equal(new Set(q.options.map(o => o.id)).size,q.options.length,q.id);
}
console.log(`Content OK: 28 letters + Lam-Alif, 60 book cells, ${questionPool('mixed').length} practice questions, ${files.length} source files.`);
