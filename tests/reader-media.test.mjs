import test from 'node:test';
import assert from 'node:assert/strict';
import { isQuickLetterAudio, clampPlayerPosition, placeReaderPlayer } from '../src/utils/readerMedia.js';

const intersects = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
test('Only individual Arabic practice areas suppress the player; translations and prayers keep it', () => {
  const small = { type:'audio',audio_path:'assets/audio/arabic/arp02_1.mp3',bounds:{width:.108,height:.06} };
  assert.equal(isQuickLetterAudio(small,18),true);
  assert.equal(isQuickLetterAudio({...small,audio_path:'assets/audio/german/almanca.mp3'},18),false);
  assert.equal(isQuickLetterAudio({...small,bounds:{width:.73,height:.15}},18),false);
  assert.equal(isQuickLetterAudio(small,54),false);
});
test('Automatic placement uses a free gutter and switches sides when a control blocks it', () => {
  const input = { viewport:{width:1280,height:800},size:{width:264,height:124},stage:{x:0,y:0,width:1280,height:800},book:{x:440,y:80,width:400,height:560},anchor:{x:480,y:200,width:300,height:80},obstacles:[] };
  const right = placeReaderPlayer(input);
  assert.ok(right.x >= 840);
  assert.equal(intersects({...right,...input.size},input.book),false);
  const blocked = {x:856,y:0,width:424,height:800};
  const left = placeReaderPlayer({...input,obstacles:[blocked]});
  assert.ok(left.x+input.size.width <= 440);
  assert.equal(intersects({...left,...input.size},blocked),false);
});
test('Narrow screens use the reserved gap above the reading tools without covering the page', () => {
  const book={x:21,y:80,width:348,height:488},dock={x:12,y:728,width:366,height:84,kind:'dock'},size={width:300,height:124};
  const point=placeReaderPlayer({viewport:{width:390,height:844},size,stage:{x:0,y:0,width:390,height:844},book,anchor:{x:50,y:200,width:290,height:100},obstacles:[dock]});
  assert.equal(intersects({...point,...size},book),false);
  assert.equal(intersects({...point,...size},dock),false);
});
test('Dragging keeps the player inside the visible viewport', () => {
  assert.deepEqual(clampPlayerPosition({x:-400,y:2000},{width:264,height:124},{width:390,height:844}),{x:12,y:708});
});
test('Audio metadata, pause, seek and speed changes preserve quiet presentation', async () => {
  const oldAudio=globalThis.Audio,oldWindow=globalThis.window;
  class TestAudio extends EventTarget {
    constructor(url){super();this.src=url;this.paused=true;this.ended=false;this.currentTime=0;this.duration=20;this.playbackRate=1;}
    play(){this.paused=false;this.dispatchEvent(new Event('playing'));return Promise.resolve();}
    pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}
  }
  globalThis.Audio=TestAudio;globalThis.window={dispatchEvent(){}};
  const manager=await import('../src/utils/audioPlayer.js');
  try {
    const audio=manager.playAudioFile('assets/audio/arabic/arp02.mp3',{presentation:'quiet',anchor:{page:14},label:'Bâ'});
    audio.currentTime=3;audio.dispatchEvent(new Event('timeupdate'));
    manager.toggleCurrentAudio();
    assert.equal(manager.getAudioSnapshot().presentation,'quiet');
    assert.equal(manager.getAudioSnapshot().status,'paused');
    assert.equal(manager.getAudioSnapshot().currentTime,3);
    manager.seekCurrentAudio(8);assert.equal(audio.currentTime,8);
    manager.setGlobalPlaybackSpeed(1.5);manager.toggleCurrentAudio();
    assert.equal(manager.getAudioSnapshot().speed,1.5);
    assert.equal(manager.getAudioSnapshot().presentation,'quiet');
  } finally {manager.stopCurrentAudio();globalThis.Audio=oldAudio;globalThis.window=oldWindow;}
});
