import test from 'node:test';
import assert from 'node:assert/strict';
import { activitiesForPage, createPairs, createQuestions, createMiniLesson, restoreActivityProgress, finishActivity, BOOK_ROWS, BOOK_ROW_PAGES, MEMORY_LEVELS } from '../src/data/bookActivities.js';
import {activityRoundReducer,newActivityRound} from '../src/utils/activityRound.js';
import { memoryReducer, newMemoryGame } from '../src/utils/memoryGame.js';
import { SHAPE_GROUPS } from '../src/data/alphabetData.js';
import { readStore, emptyStore } from '../src/utils/learningStore.js';

test('Only pages 14–16 offer the appropriate pilot activities',()=>{
  for(let page=6;page<=74;page++)assert.equal(activitiesForPage(page).length,[14,15,16].includes(page)?4:0);
  assert.equal(activitiesForPage(14)[0].id,'recognize');
  assert.equal(activitiesForPage(15)[0].id,'similar');
  assert.equal(activitiesForPage(16)[0].id,'grid');
  assert.deepEqual(createQuestions(17,'listen'),[]);
});
test('Rounds have six distinct targets and one correct option; similar choices share a shape group',()=>{
  for(const page of [14,15,16])for(const mode of activitiesForPage(page).filter(a=>!['pairs','trace'].includes(a.id))){
    const qs=createQuestions(page,mode.id,()=>.4);
    assert.equal(qs.length,6);assert.equal(new Set(qs.map(q=>q.letter.id)).size,6);
    for(const q of qs){
      assert.equal(q.options.filter(l=>l.id===q.letter.id).length,1);
      assert.equal(new Set(q.options.map(l=>l.id)).size,q.options.length);
      if(mode.id==='similar')assert.ok(SHAPE_GROUPS.some(g=>q.options.every(l=>g.ids.includes(l.id))));
      if(mode.id==='grid')assert.ok(BOOK_ROWS.flat().includes(q.letter.id));
    }
  }
});
test('Mini lessons cover one selected book letter with recognition, listening and shape discrimination',()=>{
  for(let id=1;id<=29;id++){
    const qs=createMiniLesson(14,id,()=>.4);
    assert.deepEqual(qs.map(q=>q.kind),['recognize','listen','shape']);
    for(const q of qs){assert.equal(q.letter.id,id);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(l=>l.id)).size,4);assert.equal(q.options.filter(l=>l.id===id).length,1);}
  }
  assert.deepEqual(createMiniLesson(17,2),[]);
  assert.deepEqual(createMiniLesson(14,999),[]);
  assert.deepEqual(createQuestions(14,'trace'),[]);
});
test('A round requires explicit checking, enforces listening, supports retries and grades first attempts once',()=>{
  let s=newActivityRound();
  assert.equal(activityRoundReducer(s,{type:'check',target:2}),s);
  assert.equal(activityRoundReducer(s,{type:'choose',id:2,requiresAudio:true}),s);
  s=activityRoundReducer(s,{type:'heard'});
  s=activityRoundReducer(s,{type:'choose',id:3,requiresAudio:true});
  assert.equal(s.checked,false);assert.equal(s.correct,0);
  s=activityRoundReducer(s,{type:'check',target:2,requiresAudio:true});
  assert.equal(s.checked,true);assert.equal(activityRoundReducer(s,{type:'next',target:2,total:2}),s);
  assert.equal(activityRoundReducer(s,{type:'choose',id:2}),s);
  s=activityRoundReducer(s,{type:'retry',target:2});
  s=activityRoundReducer(s,{type:'choose',id:2});s=activityRoundReducer(s,{type:'check',target:2});
  assert.equal(s.correct,0);assert.equal(activityRoundReducer(s,{type:'check',target:2}),s);
  s=activityRoundReducer(s,{type:'next',target:2,total:2});assert.equal(s.index,1);assert.equal(s.heard,false);assert.equal(s.selected,null);
  s=activityRoundReducer(s,{type:'choose',id:4});s=activityRoundReducer(s,{type:'check',target:4});assert.equal(s.correct,1);
  s=activityRoundReducer(s,{type:'next',target:4,total:2});assert.equal(s.done,true);
  assert.equal(activityRoundReducer(s,{type:'choose',id:2}),s);
  let a=activityRoundReducer(newActivityRound(),{type:'heard'});a=activityRoundReducer(a,{type:'choose',id:2,requiresAudio:true});a=activityRoundReducer(a,{type:'audioError'});
  assert.equal(activityRoundReducer(a,{type:'check',target:2,requiresAudio:true}),a);
});
test('Memory decks offer 6, 8 or 10 unique letter pairs and default to twelve cards',()=>{
  assert.equal(createPairs(14).length,12);
  for(const page of [14,15,16])for(const count of MEMORY_LEVELS)for(const random of [()=>.1,()=>.7]){
    const cards=createPairs(page,random,count);assert.equal(cards.length,count*2);assert.equal(new Set(cards.map(c=>c.key)).size,count*2);
    const ids=[...new Set(cards.map(c=>c.letter.id))];assert.equal(ids.length,count);
    for(const id of ids)assert.equal(cards.filter(c=>c.letter.id===id).length,2);
    if(page===15)assert.ok(SHAPE_GROUPS.some(g=>g.ids.filter(id=>ids.includes(id)).length>=2));
  }
});
test('Memory locks a mismatched pair until conceal and prevents double flips and replayed matches',()=>{
  const cards=createPairs(14,()=>.4),first=cards[0],other=cards.find(c=>c.letter.id!==first.letter.id),mate=cards.find(c=>c.key!==first.key&&c.letter.id===first.letter.id);
  let s=newMemoryGame(cards);s=memoryReducer(s,{type:'flip',key:first.key});
  assert.equal(memoryReducer(s,{type:'flip',key:first.key}),s);
  assert.equal(memoryReducer(s,{type:'flip',key:'invalid'}),s);
  s=memoryReducer(s,{type:'flip',key:other.key});assert.equal(s.feedback,'mismatch');assert.equal(s.turns,1);
  assert.equal(memoryReducer(s,{type:'flip',key:mate.key}),s);
  s=memoryReducer(s,{type:'conceal'});assert.deepEqual(s.open,[]);
  s=memoryReducer(s,{type:'flip',key:first.key});s=memoryReducer(s,{type:'flip',key:mate.key});
  assert.equal(s.feedback,'match');assert.equal(s.matched.length,2);assert.equal(s.cards.length,cards.length);
  assert.equal(memoryReducer(s,{type:'flip',key:first.key}),s);
  for(const id of new Set(cards.map(c=>c.letter.id))){for(const c of cards.filter(c=>c.letter.id===id))s=memoryReducer(s,{type:'flip',key:c.key});}
  assert.equal(s.feedback,'complete');assert.equal(s.matched.length,cards.length);
  const restarted=memoryReducer(s,{type:'restart',cards:createPairs(16,()=>.7,10)});
  assert.equal(restarted.cards.length,20);assert.equal(restarted.turns,0);assert.deepEqual(restarted.matched,[]);
});
test('Compact book panels preserve all ten printed rows in order without dropping cells',()=>{
  assert.equal(BOOK_ROW_PAGES.length,5);assert.ok(BOOK_ROW_PAGES.every(p=>p.rows.length===2));
  assert.deepEqual(BOOK_ROW_PAGES.flatMap(p=>p.rows),BOOK_ROWS);
  assert.deepEqual(BOOK_ROW_PAGES.map(p=>p.start),[0,2,4,6,8]);
});
test('First entry stays undecided for old stores; both explicit preferences survive reload',()=>{
  assert.equal(readStore({getItem:()=>JSON.stringify({version:2,reader:{notes:{14:'Kalsın'},bookmarks:[14]}})}).reader.preferences.activitiesEnabled,null);
  for(const enabled of [true,false]){
    const store=emptyStore();store.reader.preferences.activitiesEnabled=enabled;
    const restored=readStore({getItem:()=>JSON.stringify(store)});
    assert.equal(restored.reader.preferences.activitiesEnabled,enabled);
    assert.equal(readStore({getItem:()=>JSON.stringify({...store,reader:{preferences:{activitiesEnabled:'true'}}})}).reader.preferences.activitiesEnabled,null);
  }
});
test('Completed activity IDs are unique; attempts are bounded, valid and survive store migration',()=>{
  let p={completed:[],attempts:[]};
  for(let n=0;n<35;n++)p=finishActivity(p,14,'pairs',{correct:3,total:3});
  assert.deepEqual(p.completed,['14:pairs']);assert.equal(p.attempts.length,30);
  const invalid=restoreActivityProgress({completed:['14:pairs','14:pairs','74:grid',null],attempts:[{}, {id:'14:pairs',correct:4,total:3,at:1}]});
  assert.deepEqual(invalid,{completed:['14:pairs'],attempts:[]});
  const store=emptyStore();store.reader.activityProgress=p;store.reader.notes={14:'Not'};store.reader.bookmarks=[16];
  const restored=readStore({getItem:()=>JSON.stringify(store)});
  assert.deepEqual(restored.reader.activityProgress,p);assert.equal(restored.reader.notes[14],'Not');assert.deepEqual(restored.reader.bookmarks,[16]);
});
