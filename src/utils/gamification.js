/**
 * Gamification engine: Leveling curves, Titles, Audio synthesis, and Streaks
 */

export function getLevelThreshold(level) {
  if (level <= 1) return 200;
  // Level threshold curve: 100 * (level^2 + level)
  return Math.round(100 * (level * level + level));
}

export function getLevelInfo(totalXP = 0) {
  const safeXP = Math.max(0, Math.floor(totalXP));
  
  let level = 1;
  let prevThreshold = 0;
  let nextThreshold = getLevelThreshold(1);

  while (safeXP >= nextThreshold && level < 100) {
    level++;
    prevThreshold = nextThreshold;
    nextThreshold = getLevelThreshold(level);
  }

  const xpInCurrentLevel = safeXP - prevThreshold;
  const xpNeededForNext = nextThreshold - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  let rankTitle = 'Novice Initiate';
  let badgeColor = '#94a3b8';

  if (level >= 10) {
    rankTitle = 'Legendary Architect';
    badgeColor = '#f59e0b';
  } else if (level >= 7) {
    rankTitle = 'Apex Grandmaster';
    badgeColor = '#ec4899';
  } else if (level >= 5) {
    rankTitle = 'Master Tactician';
    badgeColor = '#a855f7';
  } else if (level >= 3) {
    rankTitle = 'Cyber Vanguard';
    badgeColor = '#38bdf8';
  } else {
    rankTitle = 'Novice Scout';
    badgeColor = '#10b981';
  }

  return {
    level,
    totalXP: safeXP,
    prevThreshold,
    nextThreshold,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercent: Math.round(progressPercent),
    rankTitle,
    badgeColor
  };
}

/**
 * Web Audio API synthesizer for futuristic gamified sounds
 * Zero external audio assets required; safe in all modern browsers.
 */
class SoundEngine {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playQuestComplete() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Note 1: C5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: G5 chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.28);

      gain2.gain.setValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    } catch {
      // Audio autoplay policy catch
    }
  }

  playLevelUp() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // Audio policy catch
    }
  }

  playAchievementUnlocked() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5];

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    } catch {
      // Audio policy catch
    }
  }
}

export const sound = new SoundEngine();
