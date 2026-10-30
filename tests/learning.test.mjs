import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { emptyStore, createProfile, readStore, saveAttempt, STORE_KEY } from '../src/utils/learningStore.js';
import { LESSONS, BASIC_TOPICS, lessonContent, makeQuestions } from '../src/data/learningData.js';
import { rangeFor } from '../vite.config.js';

const result=(correct,extra={})=>({correct,total:5,wrongIds:correct<5?['b']:[],correctIds:['a'],...extra});
test('A failed attempt is saved without awarding mastery or stars',()=>{
  const next=saveAttempt(emptyStore(),'child-1','ustun-01',result(3),100);
  const r=next.profiles['child-1'].records['ustun-01'];
  assert.equal(r.mastered,false);assert.equal(r.last.correct,3);assert.equal(next.profiles['child-1'].stars,0);assert.deepEqual(r.pending,['b']);assert.equal(r.reviewAt,100);
});
test('Mastery requires 80%, and repeat passes never duplicate stars',()=>{
  let next=saveAttempt(emptyStore(),'child-1','ustun-01',result(4),100);
  assert.equal(next.profiles['child-1'].stars,3);assert.equal(next.profiles['child-1'].records['ustun-01'].mastered,true);
  next=saveAttempt(next,'child-1','ustun-01',result(5),200);
  assert.equal(next.profiles['child-1'].stars,3);assert.equal(next.profiles['child-1'].records['ustun-01'].attempts,2);
});
test('Failed retries preserve earlier mastery but update pending review',()=>{
  let next=saveAttempt(emptyStore(),'adult','ustun-01',result(5),100);
  next=saveAttempt(next,'adult','ustun-01',result(0,{correctIds:[],wrongIds:['a','b']}),200);
  assert.equal(next.profiles.adult.records['ustun-01'].mastered,true);assert.equal(next.profiles.adult.records['ustun-01'].best,1);
  assert.deepEqual(next.profiles.adult.records['ustun-01'].pending,['a','b']);
  next=saveAttempt(next,'adult','ustun-01',result(5,{correctIds:['a','b'],wrongIds:[]}),300);
  assert.deepEqual(next.profiles.adult.records['ustun-01'].pending,[]);
});
test('Adult and sibling profiles do not share attempts or awards',()=>{
  const base=emptyStore();base.profiles['child-2']=createProfile('child-2','Second','kid');
  const next=saveAttempt(base,'child-1','ustun-01',result(5));
  assert.deepEqual(next.profiles.adult.records,{});assert.deepEqual(next.profiles['child-2'].records,{});assert.deepEqual(base.profiles['child-1'].records,{});
});
test('Stored reader settings and profile restore, corrupted JSON recovers',()=>{
  const base=emptyStore();base.reader={page:18,bookmarks:[18,18,900,2]};base.activeChildId='unknown';
  const restored=readStore({getItem:k=>k===STORE_KEY?JSON.stringify(base):null});
  assert.equal(restored.reader.page,18);assert.deepEqual(restored.reader.bookmarks,[18,2]);assert.equal(restored.activeChildId,'child-1');
  assert.equal(readStore({getItem:()=>'{broken'}).reader.page,1);
});
test('Legacy completions are retained as history without fabricating mastery',()=>{
  const next=readStore({getItem:k=>k==='kid_completed_topics'?'["letters"]':null});
  assert.deepEqual(next.legacy.topics,['letters']);assert.deepEqual(next.profiles['child-1'].records,{});
});
test('Each quiz uses stable IDs with exactly one correct option',()=>{
  const pages=JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
  for(const l of LESSONS){const items=lessonContent(l,pages);const qs=makeQuestions(items);assert.equal(qs.length,5);for(const q of qs){assert.equal(q.options.filter(o=>o.id===q.correctId).length,1);assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);}}
});
test('Fetha, Kesra and Damme use original page mappings rather than filename arithmetic',()=>{
  const pages=JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
  for(const [id,file] of [['ustun-01','arp02_1.mp3'],['esre-01','arp02_3.mp3'],['otre-01','arp02_5.mp3']])assert.ok(lessonContent(LESSONS.find(l=>l.id===id),pages)[0].audio.endsWith(file));
  const cezim=lessonContent(LESSONS.find(l=>l.id==='cezim-01'),pages)[0];assert.ok(cezim.bounds);assert.equal(cezim.char,undefined);
});
test('Media ranges support open and suffix requests, rejecting invalid ranges',()=>{
  assert.deepEqual(rangeFor('bytes=0-99',1000),{start:0,end:99});assert.deepEqual(rangeFor('bytes=900-',1000),{start:900,end:999});assert.deepEqual(rangeFor('bytes=-100',1000),{start:900,end:999});assert.equal(rangeFor('bytes=1200-',1000),null);assert.equal(rangeFor('bytes=100-50',1000),null);assert.equal(rangeFor('bytes=a-b',1000),null);
});
test('The long-He lesson preserves its rule page and separate practice-page source',()=>{
  const pages=JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
  const l=LESSONS.find(l=>l.id==='uzun-he-01');assert.equal(l.page,38);
  assert.ok(lessonContent(l,pages).every(s=>s.page===39));
});
test('Basic knowledge links all seven topics to the correct language-specific source areas',()=>{
  const pages=JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
  assert.equal(BASIC_TOPICS.reduce((s,t)=>s+t.count,0),32);
  for(const t of BASIC_TOPICS)for(const [page,file] of [[t.page,t.file],[t.pageDe,t.fileDe]])assert.ok(pages[page-1].hotspots.some(h=>h.audio_file===file));
});
