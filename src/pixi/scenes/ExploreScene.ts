import { Container, Sprite, Text, type Application } from 'pixi.js'
import type { Scene } from '../PixiStage'
import { Starfield } from '../drawings'
import { makeParticleTextures, Particles, RAINBOW, type ParticleTextures } from '../particles'
import { ease, lerp, Tweens } from '../tween'

interface Bubble {
  sprite: Sprite
  speed: number
  sway: number
  phase: number
}

/** Free exploration: every key makes something delightful appear. No right or wrong. */
export class ExploreScene implements Scene {
  private tweens = new Tweens()
  private textures: ParticleTextures
  private particles = new Particles()
  private stars: Starfield
  private glyphs = new Container()
  private bubbleLayer = new Container()
  private bubbles: Bubble[] = []
  private w = 0
  private h = 0
  private time = 0
  private reducedMotion = false

  private app: Application

  constructor(app: Application) {
    this.app = app
    this.textures = makeParticleTextures(app.renderer)
    this.stars = new Starfield(this.textures.dot, 90)
    app.stage.addChild(this.stars.container, this.bubbleLayer, this.glyphs, this.particles.container)
  }

  setReducedMotion(on: boolean) {
    this.reducedMotion = on
    this.particles.density = on ? 0.35 : 1
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    this.stars.resize(w, h)
    this.bubbles.forEach((b) => b.sprite.destroy())
    this.bubbles = []
    for (let i = 0; i < 14; i++) {
      const sprite = new Sprite(this.textures.puff)
      sprite.anchor.set(0.5)
      sprite.tint = RAINBOW[i % RAINBOW.length]
      sprite.alpha = 0.25
      sprite.scale.set(0.6 + Math.random() * 1.2)
      sprite.position.set(Math.random() * w, Math.random() * h)
      this.bubbleLayer.addChild(sprite)
      this.bubbles.push({ sprite, speed: 15 + Math.random() * 30, sway: 10 + Math.random() * 20, phase: Math.random() * 6 })
    }
  }

  /**
   * Shows a big, bouncy glyph. `column` (0–1) is where the key sits on the
   * keyboard, so letters appear above the key that made them.
   */
  showGlyph(label: string, column: number, colorIndex: number) {
    const color = RAINBOW[Math.abs(colorIndex) % RAINBOW.length]
    const size = Math.min(this.h * 0.36, this.w * 0.3)
    const text = new Text({
      text: label,
      style: {
        fontFamily: 'Fredoka',
        fontWeight: '700',
        fontSize: size,
        fill: color,
        stroke: { color: 0xffffff, width: size * 0.08, join: 'round' },
        dropShadow: { color: 0x1d2440, alpha: 0.5, distance: size * 0.04, blur: 4, angle: Math.PI / 2 },
      },
    })
    text.anchor.set(0.5)
    const margin = size * 0.5
    const x = lerp(margin, this.w - margin, column) + (Math.random() - 0.5) * size * 0.3
    const y = this.h * (0.45 + (Math.random() - 0.5) * 0.15)
    text.position.set(x, y)
    text.scale.set(0)
    text.rotation = (Math.random() - 0.5) * 0.4
    this.glyphs.addChild(text)
    while (this.glyphs.children.length > 10) this.glyphs.children[0].destroy()

    this.particles.burst({ x, y, count: 22, texture: this.textures.star, colors: [color, 0xffffff, 0xffe156], speed: [200, 600], gravity: 400, life: [600, 1100], scale: [0.4, 0.9], spin: true })

    void this.tweens.to(this.reducedMotion ? 250 : 700, (t) => !text.destroyed && text.scale.set(t), this.reducedMotion ? ease.outCubic : ease.outElastic).then(() =>
      this.tweens.to(1600, (t) => {
        if (text.destroyed) return
        text.y = y - t * this.h * 0.25
        text.alpha = t < 0.5 ? 1 : 1 - (t - 0.5) * 2
      }, ease.inCubic).then(() => {
        if (!text.destroyed) text.destroy()
      }),
    )
  }

  /** Space bar: a firework whooshes up and bursts. */
  firework() {
    const x = this.w * (0.2 + Math.random() * 0.6)
    const targetY = this.h * (0.2 + Math.random() * 0.25)
    const spark = new Sprite(this.textures.star)
    spark.anchor.set(0.5)
    spark.tint = 0xffe156
    spark.scale.set(0.6)
    spark.position.set(x, this.h)
    this.glyphs.addChild(spark)
    void this.tweens.to(600, (t) => {
      spark.y = lerp(this.h, targetY, t)
      if (Math.random() < 0.5) this.particles.burst({ x: spark.x, y: spark.y, count: 1, texture: this.textures.dot, colors: [0xffe156, 0xffb347], speed: [10, 40], gravity: 50, life: [300, 500], scale: [0.3, 0.5] })
    }, ease.outCubic).then(() => {
      spark.destroy()
      this.particles.burst({ x, y: targetY, count: 60, texture: this.textures.star, colors: RAINBOW, speed: [150, 550], gravity: 200, life: [900, 1500], scale: [0.3, 0.8], spin: true })
      this.particles.burst({ x, y: targetY, count: 25, texture: this.textures.dot, colors: [0xffffff], speed: [50, 300], gravity: 100, life: [500, 900], scale: [0.4, 0.8] })
    })
  }

  /** Any other key: a small sparkle so nothing feels broken. */
  sparkle(column: number) {
    const x = lerp(this.w * 0.1, this.w * 0.9, column)
    this.particles.burst({ x, y: this.h * 0.75, count: 14, texture: this.textures.dot, colors: RAINBOW, speed: [80, 260], angle: -Math.PI / 2, spread: 1, gravity: 150, life: [500, 900], scale: [0.4, 0.8] })
  }

  update(dtMs: number) {
    this.time += dtMs / 1000
    this.tweens.update(dtMs)
    this.stars.update(dtMs)
    this.particles.update(dtMs)
    for (const b of this.bubbles) {
      b.sprite.y -= b.speed * (dtMs / 1000)
      b.sprite.x += Math.sin(this.time + b.phase) * b.sway * (dtMs / 1000)
      if (b.sprite.y < -60) {
        b.sprite.y = this.h + 60
        b.sprite.x = Math.random() * this.w
      }
    }
  }

  destroy() {
    this.app.stage.removeChildren()
  }
}
