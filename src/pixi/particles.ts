import { Container, Graphics, Sprite, Texture, type Renderer } from 'pixi.js'

export interface ParticleTextures {
  dot: Texture
  star: Texture
  puff: Texture
}

/** Draws the few particle shapes once and turns them into reusable textures. */
export function makeParticleTextures(renderer: Renderer): ParticleTextures {
  const dot = new Graphics()
  for (let r = 16; r > 0; r -= 2) dot.circle(0, 0, r).fill({ color: 0xffffff, alpha: 0.12 + (16 - r) * 0.05 })

  const star = new Graphics()
  const points: number[] = []
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 16 : 7
    const a = (Math.PI / 5) * i - Math.PI / 2
    points.push(Math.cos(a) * radius, Math.sin(a) * radius)
  }
  star.poly(points).fill(0xffffff)

  const puff = new Graphics()
  for (let r = 24; r > 0; r -= 3) puff.circle(0, 0, r).fill({ color: 0xffffff, alpha: 0.08 })

  const textures = {
    dot: renderer.generateTexture(dot),
    star: renderer.generateTexture(star),
    puff: renderer.generateTexture(puff),
  }
  dot.destroy()
  star.destroy()
  puff.destroy()
  return textures
}

interface Particle {
  sprite: Sprite
  vx: number
  vy: number
  gravity: number
  spin: number
  life: number
  maxLife: number
  startScale: number
  endScale: number
  drag: number
}

export interface BurstOptions {
  x: number
  y: number
  count: number
  texture: Texture
  colors: number[]
  speed?: [number, number]
  /** Direction in radians and spread around it; omit for all directions. */
  angle?: number
  spread?: number
  gravity?: number
  life?: [number, number]
  scale?: [number, number]
  endScale?: number
  drag?: number
  spin?: boolean
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export class Particles {
  readonly container = new Container()
  private items: Particle[] = []
  /** Lower particle counts in reduced-motion mode. */
  density = 1

  burst(o: BurstOptions) {
    const count = Math.max(1, Math.round(o.count * this.density))
    for (let i = 0; i < count; i++) {
      const sprite = new Sprite(o.texture)
      sprite.anchor.set(0.5)
      sprite.position.set(o.x, o.y)
      sprite.tint = o.colors[Math.floor(Math.random() * o.colors.length)]
      const angle = o.angle === undefined ? rand(0, Math.PI * 2) : o.angle + rand(-(o.spread ?? 0.5), o.spread ?? 0.5)
      const speed = rand(...(o.speed ?? [100, 400]))
      const life = rand(...(o.life ?? [600, 1100]))
      const startScale = rand(...(o.scale ?? [0.4, 0.9]))
      sprite.scale.set(startScale)
      sprite.rotation = rand(0, Math.PI * 2)
      this.container.addChild(sprite)
      this.items.push({
        sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: o.gravity ?? 300,
        spin: o.spin ? rand(-6, 6) : 0,
        life,
        maxLife: life,
        startScale,
        endScale: o.endScale ?? 0,
        drag: o.drag ?? 0.98,
      })
    }
  }

  update(dtMs: number) {
    const dt = dtMs / 1000
    for (const p of this.items) {
      p.life -= dtMs
      p.vx *= p.drag
      p.vy = p.vy * p.drag + p.gravity * dt
      p.sprite.x += p.vx * dt
      p.sprite.y += p.vy * dt
      p.sprite.rotation += p.spin * dt
      const t = 1 - Math.max(0, p.life) / p.maxLife
      p.sprite.alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3
      p.sprite.scale.set(p.startScale + (p.endScale * p.startScale - p.startScale) * t)
    }
    const dead = this.items.filter((p) => p.life <= 0)
    if (dead.length) {
      dead.forEach((p) => p.sprite.destroy())
      this.items = this.items.filter((p) => p.life > 0)
    }
  }
}

export const RAINBOW = [0xff5f7e, 0xffb347, 0xffe156, 0x7ee081, 0x5ec8ff, 0xb98cff]
export const GOLD = [0xffe156, 0xffc94d, 0xfff3b0, 0xffffff]
