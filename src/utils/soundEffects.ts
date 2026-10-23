/**
 * Web Audio API synthesizer for sound effects.
 * Works reliably offline and in all modern browsers without needing external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Explicit user gesture unlock for browser audio policies (iOS/Android/Chrome)
  public unlockAudio() {
    this.initCtx();
  }

  // Play crisp, satisfying pop / chime when an answer is selected/submitted
  public playAnswerSubmitted() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Primary tone: bouncy rise from 587Hz (D5) to 880Hz (A5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.17);

      // Sparkle overtone: light triangle chime at 1174Hz (D6)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.03);

      gain2.gain.setValueAtTime(0.12, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now + 0.03);
      osc2.stop(now + 0.13);
    } catch {
      // safely ignore
    }
  }

  // Play a soft tick sound during question countdown
  public playTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isUrgent ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 440, this.ctx.currentTime);

      gain.gain.setValueAtTime(isUrgent ? 0.15 : 0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isUrgent ? 0.12 : 0.08));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // AudioContext can be blocked until user gesture, safely ignore
    }
  }

  // Play urgent loud alert beep for the final 5 seconds if answer is pending
  public playUrgentBeep(secondsLeft: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      // Rising pitch from 5s down to 1s: 700Hz, 800Hz, 900Hz, 1000Hz, 1150Hz
      const pitch = 650 + (5 - Math.max(1, secondsLeft)) * 120;
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // safely ignore
    }
  }

  // Play ascending upbeat chord when answer is correct
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.08);

        const startTime = this.ctx.currentTime + index * 0.08;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // safely ignore
    }
  }

  // Play soft low tone when answer is wrong
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {
      // safely ignore
    }
  }

  // Play fanfare / cheer for leaderboard or countdown
  public playCountdownBeep(isFinal: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFinal ? 880 : 440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.6 : 0.25));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (isFinal ? 0.65 : 0.3));
    } catch {
      // safely ignore
    }
  }

  // Play celebratory victory fanfare for podium
  public playPodiumFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [
        { f: 523.25, d: 0.15, t: 0.0 },  // C5
        { f: 659.25, d: 0.15, t: 0.15 }, // E5
        { f: 783.99, d: 0.15, t: 0.30 }, // G5
        { f: 1046.5, d: 0.45, t: 0.45 }, // C6
        { f: 880.00, d: 0.2,  t: 0.95 }, // A5
        { f: 1046.5, d: 0.6,  t: 1.15 }  // C6
      ];

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);

        const startTime = this.ctx.currentTime + n.t;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.d + 0.05);
      });
    } catch {
      // safely ignore
    }
  }

  // Play grand celebratory fanfare when quiz is finished
  public playQuizFinished() {
    this.playPodiumFanfare();
  }

  // Play short chime for sequential reveal step
  public playStepFanfare(step: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const baseFreq = step === 1 ? 523.25 : step === 2 ? 659.25 : 1046.5;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {
      // safely ignore
    }
  }
}

export const sound = new SoundEngine();
