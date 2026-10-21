import { useCallback, useEffect, useRef, useState } from 'react'
import { letterName, speak } from '../audio/speech'
import { sfx } from '../audio/sfx'
import { HomeButton } from '../components/common'
import { OnScreenKeyboard } from '../components/OnScreenKeyboard'
import { Pip, type PipMood } from '../components/Pip'
import { HINTS, ROCKET } from '../engine/config'
import { displayLetter } from '../engine/letters'
import { awardRound, nextPlanet, type RoundReward } from '../engine/rewards'
import { hintAfterMisses, recordTrial, startingHint } from '../engine/skills'
import { advance, getSkill, pickTarget, type Target } from '../engine/targets'
import { useKeyPresses, type KeyPress } from '../input/useKeyPresses'
import { PixiStage } from '../pixi/PixiStage'
import { RocketScene } from '../pixi/scenes/RocketScene'
import { getData, logActivity, updateProfile, type Profile } from '../storage/store'

type Phase = 'prompt' | 'found' | 'countdown' | 'flying' | 'reward'

interface Trial {
  target: Target
  start: number
  hint: number
  maxHint: number
  misses: number
  wrongKeys: string[]
  idleBumped: boolean
}

interface RoundEnd {
  reward: RoundReward
  newLetters: Target[]
}

function currentProfile(): Profile {
  const d = getData()
  return d.profiles[d.activeProfileId!]
}

function newTrial(previous: Target | null): Trial {
  const progress = currentProfile().progress
  const target = pickTarget(progress, previous)
  const hint = startingHint(progress.skills[`${target.letterCase}:${target.letter}`])
  return { target, start: hint, hint, maxHint: hint, misses: 0, wrongKeys: [], idleBumped: false }
}

function askFor(target: Target) {
  speak(`Can you find ${letterName(target.letter)}?`)
}

export function RocketGame({ profile, onHome, active, breakDue, onBreak }: {
  profile: Profile
  onHome: () => void
  active: boolean
  breakDue: boolean
  onBreak: () => void
}) {
  const scene = useRef<RocketScene | null>(null)
  const [trial, setTrial] = useState<Trial>(() => newTrial(null))
  const [phase, setPhase] = useState<Phase>('prompt')
  const [pip, setPip] = useState<PipMood>('happy')
  const [message, setMessage] = useState<string | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [roundEnd, setRoundEnd] = useState<RoundEnd | null>(null)
  const [flash, setFlash] = useState<{ code: string; kind: 'press' | 'wrong'; id: number } | null>(null)
  const [bubbleKey, setBubbleKey] = useState(0)
  const [nudge, setNudge] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const timers = useRef<number[]>([])
  const keyboardArea = useRef<HTMLDivElement>(null)
  const reducedMotion = profile.settings.reducedMotion

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const onReady = useCallback((s: RocketScene) => {
    scene.current = s
    s.setReducedMotion(reducedMotion)
    s.setFilled(currentProfile().rocketCells)
    s.setBottomInset(keyboardArea.current?.offsetHeight ?? 0)
    setSceneReady(true)
  }, [reducedMotion])

  useEffect(() => {
    scene.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  // The sky fills the screen; the scene keeps the rocket clear of the keyboard.
  useEffect(() => {
    const el = keyboardArea.current
    if (!el) return
    const observer = new ResizeObserver(() => scene.current?.setBottomInset(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Ask for each new target once it appears.
  useEffect(() => {
    if (phase !== 'prompt') return
    const t = setTimeout(() => askFor(trial.target), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbleKey, phase])

  // If nothing is pressed for a while, help a little more — once per trial.
  useEffect(() => {
    if (phase !== 'prompt' || !active || trial.idleBumped || trial.hint >= HINTS.max) return
    const t = setTimeout(() => {
      setTrial((tr) => ({ ...tr, hint: tr.hint + 1, maxHint: Math.max(tr.maxHint, tr.hint + 1), idleBumped: true }))
      setPip('curious')
      askFor(trial.target)
    }, HINTS.idleMs)
    return () => clearTimeout(t)
  }, [phase, active, trial, nudge])

  const nextTarget = () => {
    setTrial((tr) => newTrial(tr.target))
    setBubbleKey((k) => k + 1)
    setMessage(null)
    setPip('happy')
    setPhase('prompt')
  }

  const launch = async () => {
    setPhase('countdown')
    setMessage(null)
    for (const n of [3, 2, 1]) {
      setCount(n)
      sfx.countdown()
      speak(String(n))
      await new Promise((r) => later(900, () => r(null)))
    }
    setCount(null)
    setPhase('flying')
    setPip('cheer')
    sfx.countdown(true)
    sfx.launch()
    const planet = nextPlanet(currentProfile().rewards)
    await scene.current?.launch(planet)

    let end: RoundEnd | null = null
    updateProfile((p) => {
      const { rewards, reward } = awardRound(p.rewards)
      const update = advance(p.progress)
      end = { reward, newLetters: update.newLetters }
      return { ...p, rewards, progress: update.progress, rocketCells: 0 }
    })
    const result = end as RoundEnd | null
    if (!result) return
    const placeName = result.reward.kind === 'planet' ? result.reward.planet.name : 'a bonus star'
    logActivity({ at: Date.now(), kind: 'rocket', summary: `Rocket round finished — reached ${placeName}` })
    sfx.reward()
    speak(result.reward.kind === 'planet' ? `You made it to ${placeName}!` : 'You found a bonus star!')
    setRoundEnd(result)
    setPhase('reward')
  }

  // A full tank left over from an interrupted round: launch straight away.
  useEffect(() => {
    if (sceneReady && currentProfile().rocketCells >= ROCKET.cellsPerRound) {
      setPhase('found')
      later(600, () => void launch())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneReady])

  const flyAgain = async () => {
    sfx.tap()
    setRoundEnd(null)
    setPhase('found')
    await scene.current?.reset()
    nextTarget()
  }

  const onPress = (press: KeyPress) => {
    if (phase !== 'prompt' || press.repeat || !press.letter) return
    setNudge((n) => n + 1)

    if (press.letter === trial.target.letter) {
      const cells = currentProfile().rocketCells + 1
      updateProfile((p) => {
        const skill = getSkill(p.progress, trial.target.letter, trial.target.letterCase)
        const updated = recordTrial(skill, { ...trial.target, misses: trial.misses, wrongKeys: trial.wrongKeys, maxHint: trial.maxHint, at: Date.now() })
        return { ...p, rocketCells: cells, progress: { ...p.progress, skills: { ...p.progress.skills, [updated.id]: updated } } }
      })
      setFlash({ code: press.code, kind: 'press', id: Date.now() })
      scene.current?.fillCell()
      sfx.found()
      setPip('cheer')
      setMessage('You found it!')
      setPhase('found')
      if (cells >= ROCKET.cellsPerRound) later(900, () => void launch())
      else later(1100, nextTarget)
      return
    }

    // A gentle nudge, never a penalty. Fuel is never taken away.
    const misses = trial.misses + 1
    const hint = Math.max(trial.hint, hintAfterMisses(trial.start, misses))
    setTrial({ ...trial, misses, hint, maxHint: Math.max(trial.maxHint, hint), wrongKeys: [...trial.wrongKeys, press.letter] })
    setFlash({ code: press.code, kind: 'wrong', id: Date.now() })
    scene.current?.wobble()
    sfx.hmm()
    setPip('curious')
    setMessage(hint > trial.hint ? 'Look for the glowing key!' : "Hmm… let's look again!")
    if (hint >= 2 && trial.hint < 2) askFor(trial.target)
  }

  useKeyPresses(onPress, active)

  const shown = displayLetter(trial.target.letter, trial.target.letterCase)
  const reward = roundEnd?.reward

  return (
    <div className="game rocket">
      <div className="game-top">
        <HomeButton onClick={onHome} />
      </div>

      <PixiStage create={(app) => new RocketScene(app, ROCKET.cellsPerRound)} onReady={onReady} />

      {(phase === 'prompt' || phase === 'found') && (
        <div className="target-area">
          <button key={bubbleKey} className={`target-bubble ${phase === 'found' ? 'found' : ''}`} onClick={() => askFor(trial.target)} aria-label={`Find the letter ${trial.target.letter}. Tap to hear it again.`}>
            <span className="target-letter">{shown}</span>
            <span className="replay" aria-hidden="true">🔊</span>
          </button>
          <div className="pip-line">
            <Pip mood={pip} size={64} />
            {message && <span key={message + trial.misses} className="pip-message">{message}</span>}
          </div>
        </div>
      )}

      {count !== null && <div key={count} className="countdown">{count}</div>}

      {phase === 'reward' && reward && (
        <div className="reward-overlay">
          <div className="reward-card">
            {reward.kind === 'star' && <div className="bonus-star">⭐</div>}
            <h2>{reward.kind === 'planet' ? `You reached ${reward.planet.name}!` : 'Bonus star!'}</h2>
            <p>{reward.kind === 'planet' ? 'A new planet sticker for your collection.' : 'You have visited every planet!'}</p>
            {roundEnd!.newLetters.length > 0 && (
              <p className="new-letter">
                New letter to discover: <strong>{roundEnd!.newLetters.map((t) => displayLetter(t.letter, t.letterCase)).join(' ')}</strong>
              </p>
            )}
            <div className="reward-actions">
              {breakDue ? (
                <button className="big-btn primary" onClick={onBreak}>Time for a rest 😴</button>
              ) : (
                <>
                  <button className="big-btn primary" onClick={flyAgain}>Fly again 🚀</button>
                  <button className="big-btn" onClick={onHome}>Home</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div ref={keyboardArea} className={`game-bottom ${phase === 'prompt' || phase === 'found' ? '' : 'hidden'}`}>
        <OnScreenKeyboard target={phase === 'prompt' ? `Key${trial.target.letter}` : null} hint={trial.hint} flash={flash} />
      </div>
    </div>
  )
}
