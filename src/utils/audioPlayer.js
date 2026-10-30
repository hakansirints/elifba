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

  // Pop sound for balloons
  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
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

  // Star sound
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
