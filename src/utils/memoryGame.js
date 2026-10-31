export const newMemoryGame = cards => ({cards,open:[],matched:[],turns:0,feedback:'ready'});
export function memoryReducer(state,action) {
  if(action.type==='restart')return newMemoryGame(action.cards);
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
