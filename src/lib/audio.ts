import { readSound, writeSound } from "./storage";

export type Sfx =
  | "tap"
  | "pick"
  | "remove"
  | "reject"
  | "tick"
  | "submit"
  | "win"
  | "lose"
  | "tie"
  | "perfect";

const midi = (note: number) => 440 * 2 ** ((note - 69) / 12);

const STEP_DURATION = 60 / 92 / 2;

const MELODY: readonly (readonly (number | null)[])[] = [
  [74, null, 77, null, 79, null, 74, null, 72, null, 69, null, 67, null, 69, null],
  [74, null, 77, 79, 81, null, 79, 77, 74, null, 72, 69, 67, null, 69, null],
  [72, null, 74, 77, 79, null, 77, 74, 72, null, 69, 67, 65, null, 67, null],
  [69, null, 72, 74, 77, 79, 81, 79, 77, 79, 74, 72, 69, null, 74, null],
];

const BASS = [50, 53, 55, 57] as const;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private playing = false;
  private bound = false;
  private enabled = readSound();

  get soundEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(next: boolean): void {
    if (this.enabled === next) return;
    this.enabled = next;
    writeSound(next);
    if (!next) {
      this.stopMusic();
    } else {
      this.unlock();
    }
  }

  unlock = (): void => {
    const ctx = this.ensure();
    if (!ctx) return;
    this.bindVisibility();
    if (ctx.state === "suspended") {
      void ctx.resume().then(() => {
        if (this.enabled) this.startMusic();
      });
    } else if (this.enabled) {
      this.startMusic();
    }
  };

  play(name: Sfx): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime + 0.012;

    switch (name) {
      case "tap":
        this.tone(660, t, 0.055, "triangle", 0.05);
        break;
      case "pick":
        this.pluck(midi(74), t, 0.075, 0.32);
        this.pluck(midi(81), t + 0.07, 0.06, 0.38);
        break;
      case "remove":
        this.tone(midi(67), t, 0.1, "triangle", 0.06, midi(62));
        break;
      case "reject":
        this.tone(150, t, 0.15, "square", 0.045, 96);
        this.tone(126, t + 0.08, 0.17, "square", 0.04, 82);
        this.noise(t, 0.12, 0.025, "lowpass", 550);
        break;
      case "tick":
        this.wood(t, 0.035, 1500);
        break;
      case "submit":
        [67, 74, 79].forEach((note, index) => {
          this.pluck(midi(note), t + index * 0.08, 0.07, 0.42);
        });
        break;
      case "win":
        [74, 77, 79, 81, 86].forEach((note, index) => {
          this.pluck(midi(note), t + index * 0.1, 0.095, 0.65);
        });
        this.noise(t + 0.4, 0.22, 0.018, "highpass", 4200);
        break;
      case "lose":
        [69, 65, 62, 50].forEach((note, index) => {
          this.pluck(midi(note), t + index * 0.15, 0.07, 0.7);
        });
        break;
      case "tie":
        this.pluck(midi(74), t, 0.075, 0.5);
        this.pluck(midi(81), t, 0.06, 0.5);
        this.pluck(midi(79), t + 0.14, 0.06, 0.5);
        break;
      case "perfect":
        [74, 77, 79, 81, 84, 86, 93].forEach((note, index) => {
          this.pluck(midi(note), t + index * 0.065, 0.085, 0.7);
        });
        this.noise(t + 0.2, 0.35, 0.02, "highpass", 3600);
        break;
    }
  }

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const ctx = new window.AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      const musicBus = ctx.createGain();
      musicBus.gain.value = 0.07;
      musicBus.connect(master);
      this.ctx = ctx;
      this.master = master;
      this.musicBus = musicBus;
      return ctx;
    } catch {
      return null;
    }
  }

  private bindVisibility(): void {
    if (this.bound) return;
    this.bound = true;
    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) {
        this.stopMusic();
        void this.ctx.suspend();
      } else {
        void this.ctx.resume();
        if (this.enabled) this.startMusic();
      }
    });
  }

  private startMusic(): void {
    if (!this.enabled || this.playing) return;
    const ctx = this.ensure();
    if (!ctx || ctx.state !== "running") return;
    this.playing = true;
    this.step = 0;
    this.nextTime = ctx.currentTime + 0.1;
    this.schedule();
    this.timer = window.setInterval(this.schedule, 120);
  }

  private stopMusic(): void {
    this.playing = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  private schedule = (): void => {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    while (this.nextTime < ctx.currentTime + 0.3) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += STEP_DURATION;
      this.step = (this.step + 1) % 64;
    }
  };

  private playStep(step: number, at: number): void {
    const bar = Math.floor(step / 16);
    const beat = step % 16;
    const note = MELODY[bar][beat];
    if (note !== null) this.pluck(midi(note), at, 0.075, 0.55, this.musicBus);
    if (beat === 0 || beat === 8) {
      this.bass(midi(BASS[bar]), at, 0.62, 0.085);
    }
    if (beat === 4 || beat === 12) this.wood(at, 0.028, 1000);
    if (beat === 14) this.wood(at + 0.02, 0.018, 1400);
    if (beat % 2 === 1) {
      this.noise(at, 0.035, 0.008, "highpass", 5200, 1, this.musicBus);
    }
  }

  private tone(
    freq: number,
    at: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    slideTo?: number,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(30, slideTo),
        at + duration,
      );
    }
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(envelope);
    envelope.connect(this.master);
    osc.start(at);
    osc.stop(at + duration + 0.03);
  }

  private pluck(
    freq: number,
    at: number,
    gain: number,
    duration: number,
    destination?: GainNode | null,
  ): void {
    const ctx = this.ctx;
    const bus = destination ?? this.master;
    if (!ctx || !bus) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const envelope = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, at);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3400, at);
    filter.frequency.exponentialRampToValueAtTime(760, at + duration);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(filter);
    filter.connect(envelope);
    envelope.connect(bus);
    osc.start(at);
    osc.stop(at + duration + 0.02);
  }

  private bass(
    freq: number,
    at: number,
    duration: number,
    gain: number,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus) return;
    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, at);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + 0.03);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(envelope);
    envelope.connect(this.musicBus);
    osc.start(at);
    osc.stop(at + duration + 0.03);
  }

  private wood(at: number, gain: number, frequency: number): void {
    this.tone(frequency, at, 0.035, "sine", gain);
    this.noise(at, 0.04, gain * 0.5, "bandpass", frequency, 1.6);
  }

  private noise(
    at: number,
    duration: number,
    gain: number,
    type: BiquadFilterType,
    frequency: number,
    q = 1,
    destination?: GainNode | null,
  ): void {
    const ctx = this.ctx;
    const bus = destination ?? this.master;
    if (!ctx || !bus) return;
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const envelope = ctx.createGain();
    envelope.gain.value = gain;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(bus);
    source.start(at);
  }
}

export const audio = new AudioEngine();
