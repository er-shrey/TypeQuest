export type Ease = (t: number) => number

export const ease = {
  linear: (t: number) => t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inCubic: (t: number) => t * t * t,
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  outElastic: (t: number) =>
    t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
}

interface Tween {
  elapsed: number
  duration: number
  update: (t: number) => void
  ease: Ease
  resolve: () => void
}

/** Minimal tween runner driven by the Pixi ticker. */
export class Tweens {
  private list: Tween[] = []

  to(duration: number, update: (t: number) => void, easing: Ease = ease.outCubic): Promise<void> {
    return new Promise((resolve) => {
      this.list.push({ elapsed: 0, duration: Math.max(1, duration), update, ease: easing, resolve })
    })
  }

  wait(ms: number): Promise<void> {
    return this.to(ms, () => {})
  }

  update(dtMs: number) {
    const done: Tween[] = []
    for (const tw of this.list) {
      tw.elapsed += dtMs
      const t = Math.min(1, tw.elapsed / tw.duration)
      tw.update(tw.ease(t))
      if (t >= 1) done.push(tw)
    }
    if (done.length) {
      this.list = this.list.filter((tw) => !done.includes(tw))
      done.forEach((tw) => tw.resolve())
    }
  }
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
