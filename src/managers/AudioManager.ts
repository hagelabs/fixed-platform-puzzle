import { useGameStore } from './GameStateManager';

type Wave = OscillatorType;

class AudioManagerImpl {
  private ctx: AudioContext | null = null;
  private master!: GainNode;

  private ensure(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const Ctx =
        (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return false;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.4;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  private enabled(): boolean {
    return useGameStore.getState().audioEnabled;
  }

  private blip(freq: number, dur: number, type: Wave = 'sine', vol = 0.6, slideTo?: number) {
    if (!this.enabled() || !this.ensure() || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + dur);
    }
    g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    osc.connect(g).connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + dur + 0.02);
  }

  click(): void {
    this.blip(900, 0.06, 'square', 0.25);
  }

  pop(): void {
    this.blip(540, 0.18, 'sine', 0.55, 1100);
  }

  thud(): void {
    this.blip(180, 0.25, 'sawtooth', 0.4, 80);
  }

  win(): void {
    if (!this.enabled() || !this.ensure() || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      setTimeout(() => this.blip(f, 0.22, 'triangle', 0.5), i * 110);
    });
  }

  uiTap(): void {
    this.blip(700, 0.04, 'square', 0.18);
  }
}

export const AudioManager = new AudioManagerImpl();
