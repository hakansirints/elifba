import { normalizeTheme } from './themes.js';
import { restoreReader } from './readerTools.js';
export const STORE_KEY = 'elifba:learning:v2';
export function emptyStore() {
  return {version:2,experienceVersion:'book-activities-v1',theme:'aqua',lang:'tr',reader:restoreReader(),lastVisit:null,effects:true};
}
export function readStore(storage) {
  const base=emptyStore();
  try {
    const saved=JSON.parse(storage.getItem(STORE_KEY));
    if(saved?.version!==2)return base;
    const reader=restoreReader(saved.reader);
    const theme=normalizeTheme(saved.reader?.preferences?.theme||saved.theme);
    reader.preferences.theme=theme;
    return {...base,theme,reader,lang:saved.lang==='de'?'de':'tr',effects:saved.effects!==false,
      lastVisit:/^\/e-kitap(\/sayfa\/\d+)?(\?|$)/.test(saved.lastVisit?.path||'')?saved.lastVisit:null};
  } catch {return base;}
}
