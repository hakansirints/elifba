import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LETTERS, letterById, BOOK_ROWS, THICK_IDS, LISP_IDS, NON_JOIN_IDS, questionPool, makeSession, BOOK_PARTS, STEPS } from '../src/data/alphabetData.js';
import { emptyStore, readStore, STORE_KEY } from '../src/utils/learningStore.js';
import { rangeFor } from '../vite.config.js';
const pages = JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
test('The course has two parts and only the first topic on pages 14–16', () => {
  assert.equal(BOOK_PARTS.length,2); assert.equal(BOOK_PARTS[1].active,false);
  assert.deepEqual(STEPS.map(s => s.page),[14,15,15,16]);
  assert.equal(LETTERS.filter(l => l.kind !== 'ligature').length,28);
  assert.equal(letterById(28).kind,'ligature');
  assert.deepEqual(LETTERS.filter(l => l.kind === 'thick').map(l => l.id),THICK_IDS);
  assert.deepEqual(LETTERS.filter(l => l.lisp).map(l => l.id),LISP_IDS);
  assert.deepEqual(LETTERS.filter(l => l.nonJoin).map(l => l.id),NON_JOIN_IDS);
  assert.equal(letterById(17).lisp,true); assert.equal(letterById(17).kind,'thick');
  assert.equal(letterById(10).kind,'variable');
});
test('All alphabet recordings are mapped to the original page 14 hotspots', () => {
  for (const l of LETTERS) assert.ok(pages[13].hotspots.some(h => h.audio_path === l.audio),l.nameTr);
});
test('Page 16 practice preserves the printed grid with the known source audio correction', () => {
  const rows=[];
  for (const h of pages[15].hotspots.filter(h => h.audio_path?.includes('/arabic/')).sort((a,b)=>a.bounds.y-b.bounds.y)) {
    let row=rows.find(r => Math.abs(r.y-h.bounds.y)<.012);
    if(!row) rows.push(row={y:h.bounds.y,items:[]});
    row.items.push(h);
  }
  const recordings=rows.map(r => r.items.sort((a,b)=>b.bounds.x-a.bounds.x).map(h => h.audio_path));
  // The printed cell 6-F is Sad, but its old source hotspot points to Dad.
  // This teaching grid uses Sad's verified page-14 recording for that cell.
  assert.equal(recordings[5][5],letterById(15).audio);
  recordings[5][5]=letterById(14).audio;
  assert.deepEqual(BOOK_ROWS.map(row => row.map(id => letterById(id).audio)),recordings);
});
test('Questions have unique IDs, exactly one answer, and complete letter coverage', () => {
  for (const mode of ['name','recognize','listen','similar','groups','mixed']) {
    const pool=questionPool(mode);
    assert.equal(new Set(pool.map(q=>q.id)).size,pool.length);
    for(const q of pool) {
      assert.equal(q.options.filter(o=>o.id===q.correctId).length,1,q.id);
      assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length,q.id);
      assert.ok(letterById(q.letterId));
    }
  }
  for(const mode of ['name','recognize','listen']) assert.deepEqual(questionPool(mode).map(q=>q.letterId),LETTERS.map(l=>l.id));
});
test('A review session contains only pending questions and supports more than fifteen', () => {
  const ids=questionPool('mixed').slice(0,20).map(q=>q.id);
  assert.deepEqual(makeSession('mixed',ids).map(q=>q.id).sort(),[...ids].sort());
  assert.equal(makeSession('mixed',[]).length,0);
  assert.equal(makeSession('mixed').length,15);
});
test('Old adult and child content is retired while reader preferences survive', () => {
  const old={version:2,profiles:{adult:{records:{'harfler-01':{mastered:true}}},'child-1':{records:{}}},reader:{page:16,bookmarks:[14],notes:{14:'Not'}},lang:'de',lastVisit:{path:'/cocuk/oyunlar'}};
  const restored=readStore({getItem:k=>k===STORE_KEY?JSON.stringify(old):null});
  assert.equal(restored.profiles,undefined);
  assert.deepEqual(restored.reader.activityProgress,{completed:[],attempts:[]});
  assert.equal(restored.reader.notes[14],'Not'); assert.equal(restored.lang,'de');
  assert.equal(restored.lastVisit,null);
});
test('Book activity progress persists and malformed browser data is bounded', () => {
  const s=emptyStore(); s.reader.activityProgress={completed:['14:pairs'],attempts:[]};
  const restored=readStore({getItem:()=>JSON.stringify(s)});
  assert.deepEqual(restored.reader.activityProgress,s.reader.activityProgress);
  assert.deepEqual(readStore({getItem:()=>'{broken'}),emptyStore());
});
test('Media ranges still support open and suffix requests', () => {
  assert.deepEqual(rangeFor('bytes=0-99',1000),{start:0,end:99});
  assert.deepEqual(rangeFor('bytes=900-',1000),{start:900,end:999});
  assert.deepEqual(rangeFor('bytes=-100',1000),{start:900,end:999});
  assert.equal(rangeFor('bytes=1200-',1000),null);
});
