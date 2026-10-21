import { useCallback, useEffect, useRef, useState } from 'react'
import { digitName, letterName, speak } from '../audio/speech'
import { sfx } from '../audio/sfx'
import { HomeButton } from '../components/common'
import { keyColumn, OnScreenKeyboard } from '../components/OnScreenKeyboard'
import { INTRO_ORDER } from '../engine/letters'
import { useKeyPresses, type KeyPress } from '../input/useKeyPresses'
import { PixiStage } from '../pixi/PixiStage'
import { ExploreScene } from '../pixi/scenes/ExploreScene'
import { logActivity, type Profile } from '../storage/store'

/** Free exploration: no targets, no timer, nothing to get wrong (PRD FR-003). */
export function Explore({ profile, onHome, active }: { profile: Profile; onHome: () => void; active: boolean }) {
  const scene = useRef<ExploreScene | null>(null)
  const [flash, setFlash] = useState<{ code: string; kind: 'press'; id: number } | null>(null)
  const discovered = useRef(new Set<string>())
  const lastSpoken = useRef(0)
  const reducedMotion = profile.settings.reducedMotion

  const onReady = useCallback((s: ExploreScene) => {
    scene.current = s
    s.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    scene.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    const t = setTimeout(() => speak('Press any key!'), 300)
    const found = discovered.current
    return () => {
      clearTimeout(t)
      if (found.size > 0) logActivity({ at: Date.now(), kind: 'explore', summary: `Explored ${found.size} different keys` })
    }
  }, [])

  const onPress = (press: KeyPress) => {
    const s = scene.current
    if (!s) return
    // Holding a key down shouldn't flood the screen; one reaction per press.
    if (press.repeat) return
    const column = keyColumn(press.code)
    setFlash({ code: press.code, kind: 'press', id: Date.now() })
    const now = Date.now()
    const canSpeak = now - lastSpoken.current > 350

    if (press.letter) {
      const label = profile.progress.caseStage === 'lower' ? press.letter.toLowerCase() : press.letter
      const index = INTRO_ORDER.indexOf(press.letter as (typeof INTRO_ORDER)[number])
      s.showGlyph(label, column, index)
      sfx.pop(index)
      if (canSpeak) speak(letterName(press.letter))
      discovered.current.add(press.letter)
    } else if (press.digit) {
      s.showGlyph(press.digit, column, Number(press.digit))
      sfx.pop(Number(press.digit) + 3)
      if (canSpeak) speak(digitName(press.digit))
      discovered.current.add(press.digit)
    } else if (press.key === ' ') {
      s.firework()
      sfx.firework()
    } else {
      s.sparkle(column)
      sfx.tap()
    }
    if (canSpeak) lastSpoken.current = now
  }

  useKeyPresses(onPress, active)

  return (
    <div className="game explore">
      <div className="game-top">
        <HomeButton onClick={onHome} />
      </div>
      <PixiStage create={(app) => new ExploreScene(app)} onReady={onReady} />
      <div className="game-bottom">
        <OnScreenKeyboard showDigits flash={flash} />
      </div>
    </div>
  )
}
