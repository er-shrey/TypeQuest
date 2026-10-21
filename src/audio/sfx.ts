// Sound effects synthesised with Web Audio: nothing to download, works offline,
// and starts instantly. Kept soft and short; no harsh "wrong" sounds (PRD FR-018).

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (!enabled) return null
  try {
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.gain.value = 0.35
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return { ctx, out: master! }
  } catch {
    return null
  }
}

/** Call from the first tap so later sounds aren't blocked by autoplay rules. */
export function unlockAudio() {
  audio()
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 1, endFreq?: number) {
  const a = audio()
  if (!a) return
  const t = a.ctx.currentTime + start
  const osc = a.ctx.createOscillator()
  const gain = a.ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(a.out)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

function noise(start: number, duration: number, volume: number, fromHz: number, toHz: number) {
  const a = audio()
  if (!a) return
  const t = a.ctx.currentTime + start
  const length = Math.floor(a.ctx.sampleRate * duration)
  const buffer = a.ctx.createBuffer(1, length, a.ctx.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) samples[i] = Math.random() * 2 - 1
  const src = a.ctx.createBufferSource()
  src.buffer = buffer
  const filter = a.ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(fromHz, t)
  filter.frequency.exponentialRampToValueAtTime(toHz, t + duration)
  const gain = a.ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + duration * 0.2)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  src.connect(filter).connect(gain).connect(a.out)
  src.start(t)
}

// Pentatonic scale, so any sequence of key presses sounds pleasant.
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51]

export const sfx = {
  /** Explore mode: a bubbly pop, pitched by key so the keyboard becomes an instrument. */
  pop(index: number) {
    const f = PENTATONIC[Math.abs(index) % PENTATONIC.length]
    tone(f, 0, 0.18, 'triangle', 0.8, f * 1.5)
    tone(f * 2, 0.02, 0.12, 'sine', 0.25)
  },
  /** Correct answer: a rising sparkle. */
  found() {
    ;[0, 2, 4, 5].forEach((n, i) => tone(PENTATONIC[n], i * 0.07, 0.25, 'triangle', 0.7))
    tone(PENTATONIC[7], 0.3, 0.4, 'sine', 0.3)
  },
  /** Wrong key: a soft, curious "boop?" — never a buzzer. */
  hmm() {
    tone(330, 0, 0.16, 'sine', 0.35, 290)
    tone(392, 0.12, 0.18, 'sine', 0.3, 420)
  },
  countdown(final = false) {
    tone(final ? 880 : 660, 0, final ? 0.45 : 0.2, 'triangle', 0.6)
  },
  launch() {
    noise(0, 2.6, 0.9, 200, 1400)
    tone(80, 0, 2.4, 'sawtooth', 0.15, 220)
  },
  reward() {
    ;[0, 2, 4, 7, 4, 7].forEach((n, i) => tone(PENTATONIC[n], i * 0.11, 0.3, 'triangle', 0.6))
  },
  firework() {
    noise(0, 0.5, 0.5, 3000, 400)
    tone(1200, 0, 0.3, 'sine', 0.2, 600)
  },
  tap() {
    tone(700, 0, 0.08, 'sine', 0.4, 900)
  },
}
