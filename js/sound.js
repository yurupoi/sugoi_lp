/**
 * Gemini 3.8 Flash LP - Cybernetic Web Audio Synthesizer Engine
 * Pure Web Audio API implementation with zero external audio assets.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted for respectful UX
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playSuccess();
    }
    return this.isMuted;
  }

  // Crisp high-tech button click
  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {}
  }

  // Subtle hover tick
  playHover() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, t);

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
    } catch (e) {}
  }

  // Fast rhythmic data stream chirp (for token generation)
  playStreamToken() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Slight random pitch variation between 1200 and 1800 Hz
      const freq = 1200 + Math.random() * 600;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.018);
    } catch (e) {}
  }

  // Multimodal radar scan sweep
  playRadarScan() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.18);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.21);
    } catch (e) {}
  }

  // Success harmonic chord (C6 - E6 - G6)
  playSuccess() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [1046.5, 1318.51, 1567.98]; // C6, E6, G6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const delay = idx * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.09, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + delay);
        osc.stop(t + delay + 0.26);
      });
    } catch (e) {}
  }

  // Needle discovered affirmation chime
  playNeedleHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [880, 1174.66, 1760]; // A5, D6, A6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = idx * 0.04;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + delay);
        gain.gain.setValueAtTime(0.08, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0005, t + delay + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.36);
      });
    } catch (e) {}
  }
}

// Global instance
window.soundEngine = new SoundEngine();

// Auto bind sound triggers
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-sound]');
    if (el) {
      window.soundEngine.ensureContext();
      const soundType = el.getAttribute('data-sound');
      if (soundType === 'click') window.soundEngine.playClick();
      else if (soundType === 'scan') window.soundEngine.playRadarScan();
      else if (soundType === 'success') window.soundEngine.playSuccess();
    }
  });

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-sound-hover]');
    if (el) {
      window.soundEngine.playHover();
    }
  });
});
