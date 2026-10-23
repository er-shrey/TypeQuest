import { Container, Graphics, Sprite, type Texture } from 'pixi.js'
import type { Planet } from '../engine/rewards'

export interface RocketParts {
  root: Container
  /** Everything except the flame — bounced and wobbled. */
  ship: Container
  flame: Container
}

/** A friendly rocket, pointing up, centred on its body, roughly 220 units tall. */
export function drawRocket(): RocketParts {
  const root = new Container()
  const ship = new Container()
  const flame = new Container()

  const outer = new Graphics()
    .moveTo(-16, 0)
    .bezierCurveTo(-20, 34, -4, 70, 0, 100)
    .bezierCurveTo(4, 70, 20, 34, 16, 0)
    .closePath()
    .fill(0xff9f1c)
  const inner = new Graphics()
    .moveTo(-9, 0)
    .bezierCurveTo(-11, 22, -2, 46, 0, 64)
    .bezierCurveTo(2, 46, 11, 22, 9, 0)
    .closePath()
    .fill(0xffe156)
  flame.addChild(outer, inner)
  flame.position.set(0, 98)
  flame.scale.set(0.0)

  const fins = new Graphics()
    .poly([-26, 30, -60, 78, -58, 102, -24, 84]).fill(0xff5f7e)
    .poly([26, 30, 60, 78, 58, 102, 24, 84]).fill(0xff5f7e)
    .poly([-4, 60, 4, 60, 3, 104, -3, 104]).fill(0xe0436a)

  const body = new Graphics()
    .moveTo(0, -112)
    .bezierCurveTo(44, -80, 36, 40, 27, 92)
    .lineTo(-27, 92)
    .bezierCurveTo(-36, 40, -44, -80, 0, -112)
    .closePath()
    .fill(0xf6f7ff)
  const shade = new Graphics()
    .moveTo(14, -92)
    .bezierCurveTo(34, -60, 32, 40, 24, 90)
    .lineTo(15, 90)
    .bezierCurveTo(22, 40, 24, -50, 14, -92)
    .closePath()
    .fill({ color: 0xc9d1f5, alpha: 0.7 })
  const nose = new Graphics()
    .moveTo(0, -112)
    .bezierCurveTo(20, -98, 30, -78, 33, -62)
    .lineTo(-33, -62)
    .bezierCurveTo(-30, -78, -20, -98, 0, -112)
    .closePath()
    .fill(0xff5f7e)
  const band = new Graphics().roundRect(-31, 44, 62, 11, 5).fill(0xff5f7e)
  const nozzle = new Graphics().roundRect(-19, 88, 38, 14, 5).fill(0x8a93b8)

  // Window with Pip the guide peeking out.
  const win = new Graphics()
    .circle(0, -18, 24).fill(0xb8c2e8)
    .circle(0, -18, 19).fill(0x2b3a7a)
    .circle(0, -13, 14).fill(0x7ee081)
    .circle(-5, -16, 4).fill(0xffffff)
    .circle(5, -16, 4).fill(0xffffff)
    .circle(-4.5, -15.5, 2).fill(0x1d2440)
    .circle(5.5, -15.5, 2).fill(0x1d2440)
    .moveTo(5 * Math.cos(0.2), -10 + 5 * Math.sin(0.2))
    .arc(0, -10, 5, 0.2, Math.PI - 0.2).stroke({ width: 2, color: 0x1d2440 })
    .circle(-6, -26, 5).fill({ color: 0xffffff, alpha: 0.5 })

  ship.addChild(fins, body, shade, nose, band, nozzle, win)
  root.addChild(flame, ship)
  return { root, ship, flame }
}

/** A planet with a little face — kids like their stickers to smile back. */
export function drawPlanet(planet: Planet, r: number): Container {
  const c = new Container()
  const g = new Graphics()
  const ring = (front: boolean) => {
    // Drawn in a tilted container; the front half is masked so it passes over the planet.
    const tilt = new Container()
    tilt.rotation = planet.ringTilt ?? 0
    const band = new Graphics().ellipse(0, 0, r * 1.6, r * 0.42).stroke({ width: r * 0.12, color: planet.accent, alpha: 0.9 })
    tilt.addChild(band)
    if (front) {
      const mask = new Graphics().rect(-r * 2, 0, r * 4, r).fill(0xffffff)
      tilt.addChild(mask)
      band.mask = mask
    }
    return tilt
  }
  if (planet.ring) c.addChild(ring(false))
  g.circle(0, 0, r).fill(planet.color)
  g.circle(-r * 0.45, r * 0.35, r * 0.16).fill({ color: planet.accent, alpha: 0.55 })
  g.circle(r * 0.5, -r * 0.4, r * 0.11).fill({ color: planet.accent, alpha: 0.55 })
  g.circle(r * 0.35, r * 0.55, r * 0.08).fill({ color: planet.accent, alpha: 0.55 })
  g.circle(-r * 0.35, -r * 0.4, r * 0.28).fill({ color: 0xffffff, alpha: 0.22 })
  // Face
  g.circle(-r * 0.25, -r * 0.05, r * 0.09).fill(0x1d2440)
  g.circle(r * 0.25, -r * 0.05, r * 0.09).fill(0x1d2440)
  g.circle(-r * 0.22, -r * 0.09, r * 0.03).fill(0xffffff)
  g.circle(r * 0.28, -r * 0.09, r * 0.03).fill(0xffffff)
  g.moveTo(r * 0.2 * Math.cos(0.25), r * 0.12 + r * 0.2 * Math.sin(0.25))
  g.arc(0, r * 0.12, r * 0.2, 0.25, Math.PI - 0.25).stroke({ width: r * 0.06, color: 0x1d2440, cap: 'round' })
  g.circle(-r * 0.48, r * 0.15, r * 0.1).fill({ color: 0xff7aa8, alpha: 0.45 })
  g.circle(r * 0.48, r * 0.15, r * 0.1).fill({ color: 0xff7aa8, alpha: 0.45 })
  c.addChild(g)
  if (planet.ring) c.addChild(ring(true))
  return c
}

interface Star {
  sprite: Sprite
  base: number
  phase: number
  speed: number
  depth: number
}

/** Twinkling stars in two depths; `rush` streaks them past during a launch. */
export class Starfield {
  readonly container = new Container()
  private stars: Star[] = []
  private width = 0
  private height = 0
  private time = 0
  /** Pixels per second the stars fall (0 = still). */
  rush = 0

  private texture: Texture
  private count: number

  constructor(texture: Texture, count = 140) {
    this.texture = texture
    this.count = count
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.stars.forEach((s) => s.sprite.destroy())
    this.stars = []
    for (let i = 0; i < this.count; i++) {
      const sprite = new Sprite(this.texture)
      sprite.anchor.set(0.5)
      const depth = Math.random() < 0.7 ? 0.5 : 1
      sprite.scale.set((0.08 + Math.random() * 0.12) * (depth === 1 ? 1.6 : 1))
      sprite.position.set(Math.random() * width, Math.random() * height)
      sprite.tint = Math.random() < 0.15 ? 0xffe9a8 : 0xffffff
      this.container.addChild(sprite)
      this.stars.push({ sprite, base: 0.4 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, speed: 0.8 + Math.random() * 2, depth })
    }
  }

  update(dtMs: number) {
    this.time += dtMs / 1000
    for (const s of this.stars) {
      s.sprite.alpha = s.base + Math.sin(this.time * s.speed + s.phase) * 0.3
      s.sprite.x -= 4 * s.depth * (dtMs / 1000)
      s.sprite.y += this.rush * s.depth * (dtMs / 1000)
      s.sprite.scale.y = s.sprite.scale.x * (1 + (this.rush / 120) * s.depth)
      if (s.sprite.y > this.height + 20) s.sprite.y -= this.height + 40
      if (s.sprite.x < -10) s.sprite.x += this.width + 20
    }
  }
}
