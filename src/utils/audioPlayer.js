import { assetUrl } from './urls.js';
// Global Audio Manager with Sound Effects

let currentAudio = null;
let currentAudioUrl = null;
let playbackSpeed = 1.0;
let audioState = { status: 'idle', url: null, label: '' };
const audioListeners = new Set();
function publishAudio(next) { audioState = next; audioListeners.forEach(fn => fn()); }
export const subscribeAudio = (fn) => { audioListeners.add(fn); return () => audioListeners.delete(fn); };
export const getAudioSnapshot = () => audioState;

// Sound effects generator using Web Audio API
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic balloon pop sound (rubber rupture snap + explosive decompression air burst + low thump)
  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Air burst & rubber rupture: White noise passed through a resonant bandpass filter
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08); // 80ms buffer
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.07);
      filter.Q.setValueAtTime(1.4, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.08);

      // 2. Air cavity decompression thump (low-end punch)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(240, now);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.065);

      thudGain.gain.setValueAtTime(0.75, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);

      thudOsc.start(now);
      thudOsc.stop(now + 0.07);

      // 3. High sharp snap (membrane tearing instant)
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(1800, now);
      snapOsc.frequency.exponentialRampToValueAtTime(280, now + 0.025);

      snapGain.gain.setValueAtTime(0.5, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.03);
    } catch (e) {
      // ignore audio context errors
    }
  }

  // Cheer / Success chime
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.3, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // Gentle boing / try again sound
  playTryAgain() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Alias for error/wrong attempt sound
  playError() {
    this.playTryAgain();
  }

  // Star sound
  playFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const tone=this.ctx.createOscillator(),gain=this.ctx.createGain(),now=this.ctx.currentTime;
      tone.type='sine';tone.frequency.setValueAtTime(440,now);tone.frequency.exponentialRampToValueAtTime(620,now+.06);
      gain.gain.setValueAtTime(.045,now);gain.gain.exponentialRampToValueAtTime(.001,now+.08);
      tone.connect(gain);gain.connect(this.ctx.destination);tone.start(now);tone.stop(now+.08);
    } catch (e) {}
  }

  playStar() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [880, 1174.66, 1760].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.25, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch (e) {}
  }
}

export const sfx = new SoundFX();

export function playAudioFile(url, { onEnd, onError, speed = playbackSpeed, label = '', presentation = 'default', anchor = null, video = null } = {}) {
  if (!url) return null;

  // Stop previous audio
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
  }

  // Format url if relative
  const cleanUrl = assetUrl(url);

  const audio = new Audio(cleanUrl);
  audio.playbackRate = speed;
  currentAudio = audio;
  currentAudioUrl = cleanUrl;
  const context = { url: cleanUrl, label, presentation, anchor, speed, video };
  publishAudio({ ...context, status: 'loading', currentTime: 0, duration: 0 });
  window.dispatchEvent(new Event('elifba:audio-start'));
  audio.addEventListener('playing', () => {
    if (currentAudio === audio) publishAudio({ ...audioState, ...context, status: 'playing', speed: audio.playbackRate });
  });
  audio.addEventListener('pause', () => {
    if (currentAudio === audio && !audio.ended) publishAudio({ ...audioState, status: 'paused' });
  });
  const updateTime = () => {
    if (currentAudio === audio) publishAudio({ ...audioState, currentTime: audio.currentTime, duration: Number.isFinite(audio.duration) ? audio.duration : 0 });
  };
  audio.addEventListener('loadedmetadata', updateTime);
  audio.addEventListener('timeupdate', updateTime);
  const fail = (err) => {
    if (currentAudio !== audio) return;
    console.warn('Audio playback failed:', cleanUrl, err?.message || err?.target?.error?.code || 'media error');
    currentAudio = null; currentAudioUrl = null;
    publishAudio({ ...audioState, ...context, status: 'error' });
    if (onError) onError(err);
  };

  audio.addEventListener('ended', () => {
    if (currentAudio === audio) {
      currentAudio = null;
      currentAudioUrl = null;
      publishAudio({ status: 'idle', url: null, label: '' });
      if (onEnd) onEnd();
    }
  });

  audio.addEventListener('error', (err) => {
    fail(err);
  });

  audio.play().catch((err) => {
    fail(err);
  });

  return audio;
}

export function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
    currentAudioUrl = null;
  }
  publishAudio({ status: 'idle', url: null, label: '' });
}

export function getCurrentAudioUrl() {
  return currentAudioUrl;
}

export function toggleCurrentAudio() {
  if (!currentAudio) return;
  if (currentAudio.paused) currentAudio.play().catch(() => publishAudio({ ...audioState, status: 'error' }));
  else currentAudio.pause();
}

export function seekCurrentAudio(time) {
  if (!currentAudio || !Number.isFinite(currentAudio.duration) || !Number.isFinite(time)) return;
  currentAudio.currentTime = Math.max(0, Math.min(currentAudio.duration, time));
  publishAudio({ ...audioState, currentTime: currentAudio.currentTime });
}

export function setGlobalPlaybackSpeed(speed) {
  playbackSpeed = speed;
  if (currentAudio) {
    currentAudio.playbackRate = speed;
    publishAudio({ ...audioState, speed });
  }
}

export function getGlobalPlaybackSpeed() {
  return playbackSpeed;
}
