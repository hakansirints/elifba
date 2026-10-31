export const newMemoryGame = cards => ({cards,open:[],matched:[],turns:0,feedback:'ready'});

export function performMonteSwap(cards) {
  if (!cards || cards.length < 2) return cards;
  const next = [...cards];
  const len = next.length;
  const indices = Array.from({ length: len }, (_, i) => i);
  for (let i = len - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const pairCount = Math.floor(len / 2);
  for (let p = 0; p < pairCount; p++) {
    const i = indices[p * 2];
    const j = indices[p * 2 + 1];
    const temp = next[i];
    next[i] = next[j];
    next[j] = temp;
  }
  return next;
}

export function memoryReducer(state,action) {
  if(action.type==='restart')return newMemoryGame(action.cards);
  if(action.type==='shuffle')return {...state,cards:action.cards};
  if(action.type==='conceal')return state.feedback==='mismatch'?{...state,open:[],feedback:'ready'}:state;
  if(action.type!=='flip'||state.open.length===2||state.open.includes(action.key)||state.matched.includes(action.key))return state;
  const card=state.cards.find(c=>c.key===action.key);
  if(!card)return state;
  const open=[...state.open,action.key];
  if(open.length===1)return {...state,open,feedback:'pick'};
  const first=state.cards.find(c=>c.key===open[0]);
  if(first.letter.id!==card.letter.id)return {...state,open,turns:state.turns+1,feedback:'mismatch'};
  const matched=[...state.matched,...open];
  return {...state,open:[],matched,turns:state.turns+1,feedback:matched.length===state.cards.length?'complete':'match'};
}
