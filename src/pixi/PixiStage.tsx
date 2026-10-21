import { Application } from 'pixi.js'
import { useEffect, useRef } from 'react'

export interface Scene {
  resize(width: number, height: number): void
  update(dtMs: number): void
  destroy(): void
}

interface Props<S extends Scene> {
  create: (app: Application) => S
  onReady?: (scene: S) => void
  className?: string
}

let fontsReady: Promise<unknown> | null = null
function loadFonts() {
  fontsReady ??= Promise.all([document.fonts.load('700 64px Fredoka'), document.fonts.load('600 64px Fredoka')]).catch(() => {})
  return fontsReady
}

/** Mounts a transparent Pixi canvas that fills its parent and runs one scene. */
export function PixiStage<S extends Scene>({ create, onReady, className }: Props<S>) {
  const host = useRef<HTMLDivElement>(null)
  const createRef = useRef(create)
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    const el = host.current!
    const app = new Application()
    let scene: S | null = null
    let disposed = false
    let initialised = false

    void (async () => {
      await loadFonts()
      await app.init({
        resizeTo: el,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        preference: 'webgl',
      })
      initialised = true
      if (disposed) {
        app.destroy({ removeView: true }, { children: true, texture: true })
        return
      }
      el.appendChild(app.canvas)
      scene = createRef.current(app)
      scene.resize(app.screen.width, app.screen.height)
      app.renderer.on('resize', (w: number, h: number) => scene?.resize(w, h))
      app.ticker.add((ticker) => scene?.update(Math.min(ticker.deltaMS, 50)))
      readyRef.current?.(scene)
    })()

    return () => {
      disposed = true
      scene?.destroy()
      scene = null
      if (initialised) app.destroy({ removeView: true }, { children: true, texture: true })
    }
  }, [])

  return <div ref={host} className={className ?? 'pixi-stage'} />
}
