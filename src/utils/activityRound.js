export const newActivityRound = () => ({index:0,selected:null,checked:false,heard:false,firstTry:true,correct:0,done:false});

// Selection never grades an answer; only an explicit check can advance the lesson.
export function activityRoundReducer(state,action) {
  if(state.done)return state;
  if(action.type==='heard')return {...state,heard:true};
  if(action.type==='audioError')return {...state,heard:false};
  if(action.type==='choose')return state.checked||action.requiresAudio&&!state.heard?state:{...state,selected:action.id};
  if(action.type==='selectAndCheck') {
    if(state.done)return state;
    const isFirst = (state.selected===null && !state.checked) ? state.firstTry : state.firstTry;
    const isCorrect = action.id === action.target;
    return {
      ...state,
      selected: action.id,
      checked: true,
      firstTry: isCorrect ? isFirst : false,
      correct: state.correct + (isFirst && isCorrect ? 1 : 0)
    };
  }
  if(action.type==='check') {
    if(state.checked||state.selected===null||action.requiresAudio&&!state.heard)return state;
    return {...state,checked:true,correct:state.correct+(state.firstTry&&state.selected===action.target?1:0)};
  }
  if(action.type==='retry')return state.checked&&state.selected!==action.target?{...state,checked:false,selected:null,firstTry:false}:state;
  if(action.type==='next') {
    if(!state.checked||state.selected!==action.target)return state;
    return state.index===action.total-1?{...state,done:true}:{...newActivityRound(),index:state.index+1,correct:state.correct};
  }
  return state;
}
