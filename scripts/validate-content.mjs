import fs from 'node:fs';
import { runtimeAssets } from './runtime-assets.mjs';
import assert from 'node:assert/strict';
import { LESSONS, BASIC_TOPICS, lessonContent } from '../src/data/learningData.js';
import { ARABIC_LETTERS, VOWELS_DATA, VIDEOS_DATA } from '../src/data/curriculumData.js';
import { KID_TOPICS } from '../src/data/kidLessonsData.js';

const pages=JSON.parse(fs.readFileSync('data/pages_metadata.json','utf8'));
const inventory={files:runtimeAssets()};
const missing=new Set();
function check(file){if(!fs.existsSync(file)||!fs.statSync(file).isFile()||fs.statSync(file).size===0)missing.add(file);}
assert.equal(pages.length,74);
for(const file of inventory.files)check(file.local_path);
for(const p of pages.slice(5)){
  check(p.image);check(p.thumbnail);
  for(const h of p.hotspots){
    if(h.audio_path)check(h.audio_path);
    if(h.video_path)check(h.video_path);
    if(h.type==='goto_page')assert.ok(h.target_page>=1&&h.target_page<=74,`Invalid target on page ${p.page_number}`);
  }
}
function walk(value){
  if(Array.isArray(value))value.forEach(walk);
  else if(value&&typeof value==='object')Object.values(value).forEach(walk);
  else if(typeof value==='string'&&value.startsWith('assets/'))check(value);
}
walk({ARABIC_LETTERS,VOWELS_DATA,VIDEOS_DATA,KID_TOPICS});
const ids=new Set();
for(const lesson of LESSONS){
  assert.ok(!ids.has(lesson.id),`Duplicate lesson: ${lesson.id}`);ids.add(lesson.id);
  const samples=lessonContent(lesson,pages);
  assert.equal(samples.length,4,`Incomplete samples in ${lesson.id}`);
  assert.equal(new Set(samples.map(s=>s.id)).size,4);
  for(const s of samples){check(s.audio);if(s.bounds)assert.ok(pages[s.page-1].hotspots.some(h=>h.audio_path===s.audio&&h.id===s.id.split('-').at(-1)),`Source mismatch: ${s.id}`);}
}
assert.deepEqual([...missing],[],`Missing assets: ${[...missing].join(', ')}`);
for(const t of BASIC_TOPICS){for(const [page,file] of [[t.page,t.file],[t.pageDe,t.fileDe]])assert.ok(pages[page-1].hotspots.some(h=>h.audio_file===file),`Missing knowledge source: ${file}`);}
console.log(`Content OK: ${pages.length} pages, ${inventory.files.length} files, ${LESSONS.length} lessons and ${LESSONS.length*4} source-linked samples.`);
