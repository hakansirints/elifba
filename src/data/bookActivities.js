import { LETTERS, SHAPE_GROUPS, BOOK_ROWS, shuffle } from './alphabetData.js';

export const PAGE_ACTIVITIES = {
  14: [{ id:'recognize', tr:'Mini Ders', de:'Mini-Lektion', hint:{tr:'Üç küçük adım: tanı, dinle, ayırt et.',de:'Drei kleine Schritte: erkennen, hören, unterscheiden.'} },
    {id:'listen',tr:'Dinle ve bul',de:'Hören und finden',hint:{tr:'Kaydı dinle, harfi seç.',de:'Die Aufnahme hören und den Buchstaben wählen.'}},
    {id:'pairs',tr:'Eşini bul',de:'Paare finden',hint:{tr:'Kartları çevir, harf çiftlerini keşfet!',de:'Karten umdrehen und Buchstabenpaare finden!'}},
    {id:'trace',tr:'Harf Atölyesi',de:'Buchstabenwerkstatt',hint:{tr:'Dinle, çiz ve harfi bul.',de:'Hören, zeichnen und den Buchstaben finden.'}}],
  15: [{id:'similar',tr:'Nokta dedektifi',de:'Punkte entdecken',hint:{tr:'Benzer gövdeleri ve noktaları karşılaştır.',de:'Ähnliche Formen und Punkte vergleichen.'}},
    {id:'listen',tr:'Dinle ve bul',de:'Hören und finden',hint:{tr:'Kaydı dinle, benzerlerinden ayır.',de:'Die gehörte Form unterscheiden.'}},
    {id:'pairs',tr:'Eşini bul',de:'Paare finden',hint:{tr:'Benzer harflerin eşlerini bul.',de:'Die Paare ähnlicher Buchstaben finden.'}},
    {id:'trace',tr:'Harf Atölyesi',de:'Buchstabenwerkstatt',hint:{tr:'Şekli incele, çiz ve benzerlerinden ayır.',de:'Die Form betrachten, zeichnen und unterscheiden.'}}],
  16: [{id:'grid',tr:'Tabloda harfi bul',de:'Im Buchstabenfeld finden',hint:{tr:'Kitaptaki sırayı izleyerek harfi bul.',de:'Den Buchstaben im Feld der Vorlage finden.'}},
    {id:'listen',tr:'Dinle ve bul',de:'Hören und finden',hint:{tr:'Kaynak seslerle kendini dene.',de:'Mit den Originalaufnahmen üben.'}},
    {id:'pairs',tr:'Eşini bul',de:'Paare finden',hint:{tr:'Yeni harf çiftleriyle yeniden oyna.',de:'Mit neuen Buchstabenpaaren spielen.'}},
    {id:'trace',tr:'Harf Atölyesi',de:'Buchstabenwerkstatt',hint:{tr:'Harfleri çizerek tekrar et.',de:'Die Buchstaben zeichnend wiederholen.'}}],
};
export const activitiesForPage = page => PAGE_ACTIVITIES[page] || [];
export const activityKey = (page, id) => `${page}:${id}`;
const validKeys = new Set(Object.entries(PAGE_ACTIVITIES).flatMap(([page, list]) => list.map(a=>activityKey(page,a.id))));
export function restoreActivityProgress(value) {
  return {
    completed:Array.isArray(value?.completed) ? [...new Set(value.completed.filter(id=>validKeys.has(id)))] : [],
    attempts:Array.isArray(value?.attempts) ? value.attempts.filter(a=>a && validKeys.has(a.id) && Number.isInteger(a.total) && a.total>0 && a.total<=60 && Number.isInteger(a.correct) && a.correct>=0 && a.correct<=a.total && Number.isFinite(a.at) && a.at>0).slice(-30).map(({id,correct,total,at})=>({id,correct,total,at})) : [],
  };
}
export function finishActivity(progress, page, id, result) {
  const prior=restoreActivityProgress(progress), key=activityKey(page,id);
  return restoreActivityProgress({completed:[...prior.completed,key],attempts:[...prior.attempts,{id:key,...result,at:Date.now()}]});
}
export function createQuestions(page, mode, random=Math.random) {
  if (!activitiesForPage(page).some(a=>a.id===mode) || ['pairs','trace'].includes(mode)) return [];
  const candidates=mode==='similar' ? LETTERS.filter(l=>SHAPE_GROUPS.some(g=>g.ids.length>1&&g.ids.length<6&&g.ids.includes(l.id))) : LETTERS;
  return shuffle(candidates,random).slice(0,6).map(letter=>{
    const group=SHAPE_GROUPS.find(g=>g.ids.includes(letter.id));
    const others=mode==='similar' ? LETTERS.filter(l=>group.ids.includes(l.id)&&l.id!==letter.id) : LETTERS.filter(l=>l.id!==letter.id);
    return {letter,options:shuffle([letter,...shuffle(others,random).slice(0,3)],random)};
  });
}
export function createMiniLesson(page,letterId=1,random=Math.random) {
  if(!activitiesForPage(page).length)return [];
  const letter=LETTERS.find(l=>l.id===letterId);
  if(!letter)return [];
  const group=SHAPE_GROUPS.find(g=>g.ids.includes(letter.id));
  const similar=LETTERS.filter(l=>group.ids.includes(l.id)&&l.id!==letter.id);
  const others=shuffle(LETTERS.filter(l=>l.id!==letter.id&&!similar.includes(l)),random);
  return ['recognize','listen','shape'].map(kind=>({letter,kind,options:shuffle([letter,...similar,...others].slice(0,4),random)}));
}
export const MEMORY_LEVELS = [6,8,10];
export function createPairs(page, random=Math.random, pairCount=6) {
  const count=MEMORY_LEVELS.includes(pairCount)?pairCount:6;
  const grouped=shuffle(SHAPE_GROUPS.filter(g=>g.ids.length>1&&g.ids.length<6),random).flatMap(g=>g.ids.map(id=>LETTERS.find(l=>l.id===id)));
  const letters=(page===15 ? grouped : shuffle(LETTERS,random)).slice(0,count);
  return shuffle(letters.flatMap(l=>[{key:`${l.id}-a`,letter:l},{key:`${l.id}-b`,letter:l}]),random);
}
export const BOOK_ROW_PAGES = Array.from({length:5},(_,index)=>({start:index*2,rows:BOOK_ROWS.slice(index*2,index*2+2)}));
export { BOOK_ROWS };
