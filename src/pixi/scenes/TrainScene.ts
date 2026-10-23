import { Container, Graphics, Sprite, Text, type Application } from 'pixi.js'
import type { Scene } from '../PixiStage'
import { makeParticleTextures, Particles, RAINBOW, type ParticleTextures } from '../particles'
import { ease, lerp, Tweens } from '../tween'

/** `next*` is the carriage to fill now: with its letter showing, faint, or hidden (spelling from memory). */
export type LetterState = 'blank' | 'ghost' | 'shown' | 'next' | 'nextGhost' | 'nextBlank' | 'done'

const CARRIAGE_COLORS = [0x5ec8ff, 0x7ee081, 0xffb347, 0xb98cff, 0xff7aa8]

interface Carriage {
  root: Container
  tile: Graphics
  glow: Graphics
  text: Text
  wheels: Graphics[]
  color: number
  state: LetterState
}

interface Cloud {
  sprite: Sprite
  speed: number
}

/** Daytime countryside with a train whose carriages each carry one letter. */
export class TrainScene implements Scene {
  private app: Application
  private tweens = new Tweens()
  private textures: ParticleTextures
  private particles = new Particles()
  private sky = new Container()
  private land = new Graphics()
  private station = new Container()
  private train = new Container()
  private carriages: Carriage[] = []
  private engine: { root: Container; wheels: Graphics[]; chimneyX: number; chimneyY: number } | null = null
  private clouds: Cloud[] = []
  private sun = new Graphics()

  private w = 0
  private h = 0
  private inset = 0
  private unit = 100
  private trackY = 0
  private time = 0
  private lastTrainX = 0
  private reducedMotion = false

  constructor(app: Application) {
    this.app = app
    this.textures = makeParticleTextures(app.renderer)
    app.stage.addChild(this.sky, this.land, this.station, this.train, this.particles.container)
  }

  setReducedMotion(on: boolean) {
    this.reducedMotion = on
    this.particles.density = on ? 0.35 : 1
  }

  setBottomInset(px: number) {
    this.inset = px
    if (this.w > 0) this.resize(this.w, this.h)
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    const usable = h - this.inset
    this.trackY = usable * 0.8
    this.drawSky()
    this.drawLand()
    this.layoutTrain()
  }

  private drawSky() {
    // Old clouds go; the sun is kept and redrawn.
    this.sky.removeChildren().forEach((c) => c !== this.sun && c.destroy())
    this.clouds = []
    const { w } = this
    const usable = this.h - this.inset
    this.sun.clear()
    const r = Math.min(w, usable) * 0.07
    for (let i = 4; i > 0; i--) this.sun.circle(0, 0, r * (1 + i * 0.22)).fill({ color: 0xfff3b0, alpha: 0.12 })
    this.sun.circle(0, 0, r).fill(0xffe156)
    this.sun.position.set(w * 0.88, usable * 0.16)
    this.sky.addChild(this.sun)
    for (let i = 0; i < 6; i++) {
      const sprite = new Sprite(this.textures.puff)
      sprite.anchor.set(0.5)
      sprite.tint = 0xffffff
      sprite.alpha = 0.95
      const s = 2.2 + Math.random() * 2.2
      sprite.scale.set(s * 1.6, s)
      sprite.position.set(Math.random() * w, usable * (0.08 + Math.random() * 0.3))
      this.sky.addChild(sprite)
      this.clouds.push({ sprite, speed: 6 + Math.random() * 10 })
    }
  }

  private drawLand() {
    const { w, h, trackY } = this
    const g = this.land.clear()
    // Far and near hills, then the grass the track runs on.
    g.moveTo(0, trackY * 0.82)
      .bezierCurveTo(w * 0.2, trackY * 0.62, w * 0.4, trackY * 0.74, w * 0.6, trackY * 0.66)
      .bezierCurveTo(w * 0.8, trackY * 0.58, w * 0.92, trackY * 0.7, w, trackY * 0.66)
      .lineTo(w, h).lineTo(0, h).closePath()
      .fill(0xa8e6a1)
    g.moveTo(0, trackY * 0.9)
      .bezierCurveTo(w * 0.3, trackY * 0.78, w * 0.6, trackY * 0.95, w, trackY * 0.84)
      .lineTo(w, h).lineTo(0, h).closePath()
      .fill(0x7ed37a)
    g.rect(0, trackY, w, h - trackY).fill(0x6cc46a)
    // Track: sleepers and two rails.
    const u = this.unit
    for (let x = -u * 0.2; x < w + u; x += u * 0.32) g.roundRect(x, trackY + u * 0.02, u * 0.16, u * 0.1, 3).fill(0x8d6e4f)
    g.rect(0, trackY, w, u * 0.035).fill(0x6b7299)
    g.rect(0, trackY + u * 0.08, w, u * 0.035).fill(0x6b7299)
    // A few flowers along the grass.
    for (let i = 0; i < 18; i++) {
      const fx = ((i * 97) % 100) / 100 * w
      const fy = trackY + u * 0.25 + ((i * 53) % 40) / 40 * Math.max(10, h - trackY - u * 0.3)
      const c = RAINBOW[i % RAINBOW.length]
      g.circle(fx, fy, u * 0.05).fill(c)
      g.circle(fx, fy, u * 0.02).fill(0xfff3b0)
    }
  }

  // ---------- the train ----------

  private wheel(x: number, y: number, r: number): Graphics {
    const g = new Graphics().circle(0, 0, r).fill(0x3a4573).circle(0, 0, r * 0.62).fill(0xb8c2e8)
    for (let i = 0; i < 3; i++) {
      const a = (Math.PI / 3) * i
      g.moveTo(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6).lineTo(-Math.cos(a) * r * 0.6, -Math.sin(a) * r * 0.6)
    }
    g.stroke({ width: r * 0.14, color: 0x3a4573 })
    g.circle(0, 0, r * 0.16).fill(0x3a4573)
    g.position.set(x, y)
    return g
  }

  private buildEngine(u: number) {
    const root = new Container()
    const g = new Graphics()
    // Cab at the back (left), boiler forward (right): the train drives to the right.
    g.roundRect(0, -u * 0.95, u * 0.62, u * 0.85, u * 0.1).fill(0xff5f7e)
    g.roundRect(-u * 0.04, -u * 1.05, u * 0.7, u * 0.16, u * 0.06).fill(0xe0436a)
    g.roundRect(u * 0.1, -u * 0.82, u * 0.42, u * 0.36, u * 0.08).fill(0xd8f1ff)
    g.roundRect(u * 0.55, -u * 0.62, u * 0.85, u * 0.52, u * 0.2).fill(0xff5f7e)
    g.circle(u * 1.38, -u * 0.36, u * 0.2).fill(0xffe156)
    g.circle(u * 1.38, -u * 0.36, u * 0.12).fill(0xfff8d6)
    g.roundRect(u * 1.0, -u * 0.95, u * 0.2, u * 0.36, u * 0.05).fill(0x3a4573)
    g.roundRect(u * 0.95, -u * 1.0, u * 0.3, u * 0.1, u * 0.04).fill(0x3a4573)
    g.roundRect(u * 0.55, -u * 0.18, u * 0.95, u * 0.1, u * 0.04).fill(0xe0436a)
    g.poly([u * 1.48, -u * 0.12, u * 1.68, u * 0.02, u * 1.48, u * 0.02]).fill(0x3a4573)
    // Pip at the window
    g.circle(u * 0.31, -u * 0.62, u * 0.13).fill(0x7ee081)
    g.circle(u * 0.27, -u * 0.65, u * 0.035).fill(0xffffff).circle(u * 0.36, -u * 0.65, u * 0.035).fill(0xffffff)
    g.circle(u * 0.275, -u * 0.645, u * 0.017).fill(0x1d2440).circle(u * 0.365, -u * 0.645, u * 0.017).fill(0x1d2440)
    g.moveTo(u * 0.36, -u * 0.58).arc(u * 0.31, -u * 0.6, u * 0.05, 0.3, Math.PI - 0.3).stroke({ width: u * 0.018, color: 0x1d2440 })
    root.addChild(g)
    const wheels = [this.wheel(u * 0.3, -u * 0.06, u * 0.16), this.wheel(u * 0.85, -u * 0.06, u * 0.13), this.wheel(u * 1.25, -u * 0.06, u * 0.13)]
    root.addChild(...wheels)
    return { root, wheels, chimneyX: u * 1.1, chimneyY: -u * 1.0 }
  }

  private buildCarriage(u: number, label: string, color: number): Carriage {
    const root = new Container()
    const base = new Graphics()
      .roundRect(0, -u * 0.36, u * 0.92, u * 0.28, u * 0.08).fill(color)
      .roundRect(u * 0.04, -u * 0.12, u * 0.84, u * 0.06, u * 0.03).fill(0x3a4573)
    // Coupling to the next carriage / engine.
    base.roundRect(u * 0.9, -u * 0.2, u * 0.12, u * 0.05, u * 0.02).fill(0x3a4573)
    const glow = new Graphics().roundRect(u * 0.02, -u * 1.0, u * 0.88, u * 0.68, u * 0.14).fill({ color: 0xffe156, alpha: 0.9 })
    glow.alpha = 0
    const tile = new Graphics()
    const text = new Text({
      text: label,
      style: { fontFamily: 'Fredoka', fontWeight: '700', fontSize: u * 0.48, fill: 0x24206a },
      resolution: Math.min(2, window.devicePixelRatio || 1) * 1.5,
    })
    text.anchor.set(0.5)
    text.position.set(u * 0.46, -u * 0.66)
    const wheels = [this.wheel(u * 0.22, -u * 0.06, u * 0.11), this.wheel(u * 0.7, -u * 0.06, u * 0.11)]
    root.addChild(glow, tile, base, text, ...wheels)
    return { root, tile, glow, text, wheels, color, state: 'blank' }
  }

  private drawTile(c: Carriage) {
    const u = this.unit
    const done = c.state === 'done'
    c.tile.clear()
      .roundRect(u * 0.08, -u * 0.94, u * 0.76, u * 0.56, u * 0.1)
      .fill(done ? c.color : 0xffffff)
      .roundRect(u * 0.08, -u * 0.94, u * 0.76, u * 0.56, u * 0.1)
      .stroke({ width: u * 0.03, color: done ? 0xffffff : 0xd9dcf0 })
    c.text.style.fill = done ? 0xffffff : 0x24206a
    c.text.alpha = c.state === 'blank' || c.state === 'nextBlank' ? 0 : c.state === 'ghost' || c.state === 'nextGhost' ? 0.3 : 1
    c.glow.alpha = c.state.startsWith('next') ? 1 : 0
  }

  private layoutTrain() {
    if (!this.carriages.length && !this.engine) return
    const n = this.carriages.length
    const u = this.unit
    const usable = this.h - this.inset
    const want = Math.min((this.w * 0.9) / (n * 1.04 + 1.75), usable * 0.32, 190)
    if (Math.abs(want - u) > 1) {
      // Rebuild at the new size, keeping each letter's state.
      const labels = this.carriages.map((c) => ({ label: c.text.text, state: c.state }))
      this.buildTrain(labels.map((l) => l.label))
      labels.forEach((l, i) => this.setLetterState(i, l.state))
      this.train.x = this.restX()
      this.lastTrainX = this.train.x
      return
    }
    this.train.y = this.trackY
  }

  private trainWidth() {
    return (this.carriages.length * 1.04 + 1.7) * this.unit
  }

  private restX() {
    return (this.w - this.trainWidth()) / 2
  }

  /** Builds a train for `labels`, one carriage per letter, parked off-screen to the left. */
  private buildTrain(labels: string[]) {
    this.train.removeChildren().forEach((c) => c.destroy({ children: true }))
    const usable = this.h - this.inset
    const n = labels.length
    this.unit = Math.min((this.w * 0.9) / (n * 1.04 + 1.75), usable * 0.32, 190)
    const u = this.unit
    this.drawLand()
    this.carriages = labels.map((label, i) => {
      const c = this.buildCarriage(u, label, CARRIAGE_COLORS[i % CARRIAGE_COLORS.length])
      c.root.x = i * u * 1.04
      this.train.addChild(c.root)
      this.drawTile(c)
      return c
    })
    this.engine = this.buildEngine(u)
    this.engine.root.x = n * u * 1.04
    this.train.addChild(this.engine.root)
    this.train.y = this.trackY
    this.train.x = -this.trainWidth() - 40
    this.lastTrainX = this.train.x
  }

  /** A new word's train rolls in from the left and stops in the middle. */
  async arrive(labels: string[], states: LetterState[]) {
    this.buildTrain(labels)
    states.forEach((s, i) => this.setLetterState(i, s))
    const from = this.train.x
    const to = this.restX()
    await this.tweens.to(this.reducedMotion ? 500 : 1300, (t) => {
      this.train.x = lerp(from, to, t)
    }, ease.outCubic)
  }

  setLetterState(i: number, state: LetterState) {
    const c = this.carriages[i]
    if (!c) return
    c.state = state
    this.drawTile(c)
  }

  /** The right letter: colour fills the tile, sparkles, a bounce and a puff of smoke. */
  fill(i: number) {
    const c = this.carriages[i]
    if (!c) return
    this.setLetterState(i, 'done')
    const u = this.unit
    const gx = this.train.x + c.root.x + u * 0.46
    const gy = this.train.y - u * 0.66
    this.particles.burst({ x: gx, y: gy, count: 22, texture: this.textures.star, colors: [c.color, 0xffe156, 0xffffff], speed: [150, 480], gravity: 500, life: [600, 1100], scale: [0.35, 0.9], spin: true })
    const root = c.root
    void this.tweens.to(420, (t) => {
      root.y = -Math.sin(t * Math.PI) * u * 0.14
    }, ease.linear)
    this.puff(3)
  }

  wobble() {
    const t0 = this.train.x
    void this.tweens.to(500, (t) => {
      this.train.x = t0 + Math.sin(t * Math.PI * 5) * this.unit * 0.04 * (1 - t)
    }, ease.linear)
  }

  private puff(count: number) {
    if (!this.engine) return
    const u = this.unit
    const x = this.train.x + this.engine.root.x + this.engine.chimneyX
    const y = this.train.y + this.engine.chimneyY
    this.particles.burst({ x, y, count, texture: this.textures.puff, colors: [0xffffff, 0xf1f3fb], speed: [30, 90], angle: -Math.PI / 2 - 0.4, spread: 0.5, gravity: -40, life: [900, 1500], scale: [u / 120, u / 80], endScale: 2.6, drag: 0.97 })
  }

  /** Word done: the train chugs away to the right. */
  async depart() {
    const from = this.train.x
    const to = this.w + 60
    let next = 0
    await this.tweens.to(this.reducedMotion ? 600 : 1500, (t) => {
      this.train.x = lerp(from, to, t)
      if (t > next) {
        this.puff(2)
        next += 0.12
      }
    }, ease.inCubic)
  }

  /** End of a station: a little station building and flags appear by the track. */
  async showStation(name: string) {
    this.station.removeChildren().forEach((c) => c.destroy({ children: true }))
    const u = Math.min(this.unit, 150)
    const g = new Graphics()
      .roundRect(-u * 1.2, -u * 1.3, u * 2.4, u * 1.3, u * 0.12).fill(0xfff4e6)
      .poly([-u * 1.45, -u * 1.25, 0, -u * 1.95, u * 1.45, -u * 1.25]).fill(0xff7a59)
      .roundRect(-u * 0.3, -u * 0.8, u * 0.6, u * 0.8, u * 0.1).fill(0x8d6e4f)
      .roundRect(-u * 1.0, -u * 1.0, u * 0.45, u * 0.4, u * 0.08).fill(0x9fd8ff)
      .roundRect(u * 0.55, -u * 1.0, u * 0.45, u * 0.4, u * 0.08).fill(0x9fd8ff)
    const sign = new Text({ text: name, style: { fontFamily: 'Fredoka', fontWeight: '700', fontSize: u * 0.26, fill: 0x24206a } })
    sign.anchor.set(0.5)
    sign.position.set(0, -u * 1.48)
    this.station.addChild(g, sign)
    this.station.position.set(this.w * 0.5, this.trackY - this.unit * 0.05)
    this.station.scale.set(0)
    await this.tweens.to(700, (t) => this.station.scale.set(t), ease.outBack)
    this.particles.burst({ x: this.w * 0.5, y: this.trackY - u * 1.2, count: 60, texture: this.textures.star, colors: RAINBOW, speed: [250, 700], gravity: 400, life: [900, 1500], scale: [0.4, 1], spin: true })
  }

  async hideStation() {
    if (!this.station.children.length) return
    await this.tweens.to(400, (t) => this.station.scale.set(1 - t), ease.inCubic)
    this.station.removeChildren().forEach((c) => c.destroy({ children: true }))
  }

  update(dtMs: number) {
    this.time += dtMs / 1000
    this.tweens.update(dtMs)
    this.particles.update(dtMs)
    this.sun.rotation += dtMs / 20000
    for (const c of this.clouds) {
      c.sprite.x += c.speed * (dtMs / 1000)
      if (c.sprite.x > this.w + 150) c.sprite.x = -150
    }
    // Wheels turn with the distance travelled; the next tile breathes.
    const dx = this.train.x - this.lastTrainX
    this.lastTrainX = this.train.x
    const turn = (dx / Math.max(1, this.unit * 0.12))
    for (const c of this.carriages) {
      for (const wh of c.wheels) wh.rotation += turn
      if (c.state.startsWith('next')) c.glow.alpha = 0.55 + Math.sin(this.time * 6) * 0.45
    }
    this.engine?.wheels.forEach((wh) => (wh.rotation += turn))
    if (this.engine && Math.random() < dtMs / 900) this.puff(1)
  }

  destroy() {
    this.app.stage.removeChildren()
  }
}
