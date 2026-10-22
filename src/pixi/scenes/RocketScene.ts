import { Container, Graphics, type Application } from 'pixi.js'
import type { Planet } from '../../engine/rewards'
import type { Scene } from '../PixiStage'
import { drawPlanet, drawRocket, Starfield, type RocketParts } from '../drawings'
import { GOLD, makeParticleTextures, Particles, RAINBOW, type ParticleTextures } from '../particles'
import { ease, lerp, Tweens } from '../tween'

const CELL_COLORS = [0xff5f7e, 0xffb347, 0xffe156, 0x7ee081, 0x5ec8ff, 0xb98cff]

/** Sky, rocket, fuel gauge and the launch sequence for the Rocket Launch game. */
export class RocketScene implements Scene {
  private tweens = new Tweens()
  private textures: ParticleTextures
  private particles = new Particles()
  private stars: Starfield
  private world = new Container()
  private ground = new Graphics()
  private gauge = new Graphics()
  private rocket: RocketParts
  private planetLayer = new Container()
  private planet: Container | null = null

  private w = 0
  private h = 0
  private scale = 1
  private padX = 0
  private padY = 0
  private filled = 0
  private time = 0
  private launching = false
  private engineOn = false
  private bob = true
  private flameTarget = 0
  private reducedMotion = false
  /** Height covered by the on-screen keyboard; the sky runs behind it. */
  private inset = 0
  private hills: [number, number] = [0x3b2f7a, 0x2a2160]

  private app: Application
  private cells: number

  constructor(app: Application, cells: number) {
    this.app = app
    this.cells = cells
    this.textures = makeParticleTextures(app.renderer)
    this.stars = new Starfield(this.textures.dot)
    this.rocket = drawRocket()
    this.world.addChild(this.ground, this.gauge)
    app.stage.addChild(this.stars.container, this.planetLayer, this.world, this.rocket.root, this.particles.container)
  }

  setReducedMotion(on: boolean) {
    this.reducedMotion = on
    this.particles.density = on ? 0.35 : 1
  }

  setHills(colors: [number, number]) {
    if (colors[0] === this.hills[0] && colors[1] === this.hills[1]) return
    this.hills = colors
    if (this.w > 0) this.drawGround()
  }

  setBottomInset(px: number) {
    this.inset = px
    if (this.w > 0 && !this.launching) this.resize(this.w, this.h)
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    this.stars.resize(w, h)
    const usable = h - this.inset
    this.scale = Math.min(usable * 0.62, w * 0.55) / 230
    this.padY = usable * 0.86
    this.padX = w < 700 ? w * 0.3 : w * 0.32
    if (!this.launching) this.placeRocketOnPad()
    this.drawGround()
    this.drawGauge()
  }

  private placeRocketOnPad() {
    this.rocket.root.scale.set(this.scale)
    this.rocket.root.rotation = 0
    this.rocket.root.position.set(this.padX, this.padY - 104 * this.scale)
  }

  private drawGround() {
    const { w } = this
    // Hills are shaped for the area above the keyboard and run down behind it.
    const h = this.h - this.inset
    const bottom = this.h
    const g = this.ground.clear()
    g.moveTo(0, h * 0.8)
      .bezierCurveTo(w * 0.2, h * 0.74, w * 0.35, h * 0.86, w * 0.55, h * 0.82)
      .bezierCurveTo(w * 0.75, h * 0.78, w * 0.9, h * 0.72, w, h * 0.78)
      .lineTo(w, bottom)
      .lineTo(0, bottom)
      .closePath()
      .fill({ color: this.hills[0], alpha: 0.9 })
    g.moveTo(0, h * 0.9)
      .bezierCurveTo(w * 0.3, h * 0.84, w * 0.6, h * 0.92, w, h * 0.86)
      .lineTo(w, bottom)
      .lineTo(0, bottom)
      .closePath()
      .fill(this.hills[1])
    // Launch pad
    const s = this.scale
    g.roundRect(this.padX - 80 * s, this.padY - 4 * s, 160 * s, 18 * s, 8 * s).fill(0x8a93b8)
    g.roundRect(this.padX - 60 * s, this.padY + 12 * s, 120 * s, 10 * s, 5 * s).fill(0x6b7299)
  }

  /** The fuel gauge geometry, shared by drawing and particle bursts. */
  private gaugeBox() {
    const s = this.scale
    const height = 200 * s
    const width = 44 * s
    const x = this.padX + 105 * s
    const y = this.padY - height - 10 * s
    return { x, y, width, height, s }
  }

  private cellCenter(i: number) {
    const { x, y, width, height } = this.gaugeBox()
    const cellH = (height - 8) / this.cells
    return { x: x + width / 2, y: y + height - 4 - cellH * (i + 0.5) }
  }

  private drawGauge() {
    const { x, y, width, height, s } = this.gaugeBox()
    const g = this.gauge.clear()
    g.roundRect(x - 6 * s, y - 6 * s, width + 12 * s, height + 12 * s, 18 * s).fill({ color: 0x1d2440, alpha: 0.85 })
    g.roundRect(x - 6 * s, y - 6 * s, width + 12 * s, height + 12 * s, 18 * s).stroke({ width: 3 * s, color: 0xb8c2e8 })
    const cellH = (height - 8) / this.cells
    for (let i = 0; i < this.cells; i++) {
      const cy = y + height - 4 - cellH * (i + 1)
      const on = i < this.filled
      g.roundRect(x + 4 * s, cy + 3 * s, width - 8 * s, cellH - 6 * s, 8 * s).fill(
        on ? { color: CELL_COLORS[i % CELL_COLORS.length] } : { color: 0x3a4573, alpha: 0.8 },
      )
      if (on) g.roundRect(x + 8 * s, cy + 6 * s, (width - 16 * s) * 0.35, cellH - 12 * s, 5 * s).fill({ color: 0xffffff, alpha: 0.35 })
    }
  }

  /** Tank size for this round: it grows with each galaxy and with difficulty. */
  setCells(n: number) {
    if (n === this.cells) return
    this.cells = n
    this.filled = Math.min(this.filled, n)
    this.drawGauge()
  }

  /** Restores the gauge after a reload mid-round, without effects. */
  setFilled(n: number) {
    this.filled = n
    this.drawGauge()
  }

  /** A correct key: fill one cell with a sparkle burst and a happy bounce. */
  fillCell() {
    const i = this.filled
    this.filled = Math.min(this.cells, this.filled + 1)
    this.drawGauge()
    const { x, y } = this.cellCenter(i)
    const color = CELL_COLORS[i % CELL_COLORS.length]
    this.particles.burst({ x, y, count: 26, texture: this.textures.star, colors: [color, ...GOLD], speed: [150, 520], gravity: 500, life: [700, 1200], scale: [0.4, 1], spin: true })
    this.particles.burst({ x, y, count: 12, texture: this.textures.dot, colors: [0xffffff], speed: [40, 160], gravity: 0, life: [400, 700], scale: [0.6, 1.2] })
    const ship = this.rocket.ship
    void this.tweens.to(500, (t) => {
      const k = Math.sin(t * Math.PI)
      ship.scale.set(1 - k * 0.08, 1 + k * 0.12)
      ship.y = -k * 26
    }, ease.linear)
    this.flameTarget = 0.5
    void this.tweens.wait(450).then(() => {
      if (!this.launching) this.flameTarget = 0
    })
  }

  /** A wrong key: a small curious wobble. Nothing is taken away. */
  wobble() {
    if (this.launching) return
    const ship = this.rocket.ship
    void this.tweens.to(600, (t) => {
      ship.rotation = Math.sin(t * Math.PI * 4) * 0.08 * (1 - t)
    }, ease.linear)
  }

  /** Engine rumble, blast-off, star rush, and the new planet arriving. */
  async launch(planet: Planet) {
    this.launching = true
    this.bob = false
    const root = this.rocket.root
    const startY = root.y
    const shake = this.reducedMotion ? 0 : 4 * this.scale

    this.engineOn = true
    this.flameTarget = 0.9
    await this.tweens.to(900, (t) => {
      root.x = this.padX + (Math.random() - 0.5) * shake * t
    }, ease.linear)

    this.flameTarget = 1.4
    const worldStart = this.world.y
    await this.tweens.to(1500, (t) => {
      root.y = lerp(startY, -this.h * 0.4, t)
      root.x = this.padX + (Math.random() - 0.5) * shake * (1 - t)
      this.world.y = worldStart + this.h * t
      this.stars.rush = 1400 * t
    }, ease.inCubic)
    this.engineOn = false

    // Arrive at the planet.
    this.planet?.destroy({ children: true })
    const r = Math.min(this.w, this.h) * 0.2
    this.planet = drawPlanet(planet, r)
    this.planet.position.set(this.w * 0.55, -r * 2)
    this.planetLayer.addChild(this.planet)
    const p = this.planet
    await this.tweens.to(1200, (t) => {
      this.stars.rush = 1400 * (1 - t)
      p.y = lerp(-r * 2, this.h * 0.33, t)
    }, ease.outCubic)
    this.particles.burst({ x: p.x, y: p.y, count: 70, texture: this.textures.star, colors: RAINBOW, speed: [250, 750], gravity: 350, life: [900, 1600], scale: [0.5, 1.1], spin: true })

    // The rocket drops in to visit, tilted towards the planet.
    root.position.set(p.x - r * 1.9, this.h + 200)
    root.rotation = 0.35
    root.scale.set(this.scale * 0.7)
    this.flameTarget = 0.6
    this.engineOn = true
    await this.tweens.to(1000, (t) => {
      root.y = lerp(this.h + 200, this.h * 0.38, t)
    }, ease.outBack)
    this.engineOn = false
    this.flameTarget = 0.25
    this.bob = true
  }

  /** Back to the pad for another round. */
  async reset() {
    const p = this.planet
    const root = this.rocket.root
    this.flameTarget = 0
    const fromX = root.x
    const fromY = root.y
    const fromRot = root.rotation
    const fromScale = root.scale.x
    const worldFrom = this.world.y
    const padRocketY = this.padY - 104 * this.scale
    await this.tweens.to(1100, (t) => {
      if (p) p.y = lerp(this.h * 0.33, -this.h, t)
      this.world.y = lerp(worldFrom, 0, t)
      root.x = lerp(fromX, this.padX, t)
      root.y = lerp(fromY, padRocketY, t)
      root.rotation = lerp(fromRot, 0, t)
      root.scale.set(lerp(fromScale, this.scale, t))
    }, ease.inOutSine)
    p?.destroy({ children: true })
    this.planet = null
    this.filled = 0
    this.drawGauge()
    this.launching = false
  }

  update(dtMs: number) {
    this.time += dtMs / 1000
    this.tweens.update(dtMs)
    this.stars.update(dtMs)
    this.particles.update(dtMs)

    const flame = this.rocket.flame
    const current = flame.scale.y
    const next = current + (this.flameTarget - current) * Math.min(1, dtMs / 120)
    const flicker = this.flameTarget > 0 ? 1 + Math.sin(this.time * 40) * 0.08 : 1
    flame.scale.set(Math.max(0, next) * 0.9, Math.max(0, next) * flicker)

    if (this.bob && !this.launching) this.rocket.root.y = this.padY - 104 * this.scale + Math.sin(this.time * 2) * 3 * this.scale
    if (this.bob && this.launching && this.planet) this.rocket.root.y += Math.sin(this.time * 2) * 0.3

    if (this.engineOn && Math.random() < dtMs / 25) {
      const root = this.rocket.root
      const base = root.toGlobal({ x: 0, y: 120 })
      this.particles.burst({ x: base.x, y: base.y, count: 2, texture: this.textures.puff, colors: [0xffffff, 0xd8dcf0, 0xffd1a1], speed: [60, 220], angle: Math.PI / 2 + root.rotation, spread: 0.9, gravity: -30, life: [700, 1300], scale: [0.6, 1.2], endScale: 2.4, drag: 0.95 })
    }
  }

  destroy() {
    this.app.stage.removeChildren()
  }
}
