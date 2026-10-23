import { useCallback, useEffect, useRef, useState } from 'react'
import { letterName, speak } from '../audio/speech'
import { sfx } from '../audio/sfx'
import { HomeButton } from '../components/common'
import { OnScreenKeyboard } from '../components/OnScreenKeyboard'
import { Pip, type PipMood } from '../components/Pip'
import { DIFFICULTY } from '../engine/config'
import type { CaseStage, LetterCase } from '../engine/letters'
import { recordTrial, startingHint } from '../engine/skills'
import { activeLetters, getSkill } from '../engine/targets'
import {
  displayWord,
  lineForStation,
  planStation,
  recordWord,
  TOTAL_STATIONS,
  wordInfo,
  wordMode,
  type WordMode,
} from '../engine/words'
import { useKeyPresses, type KeyPress } from '../input/useKeyPresses'
import { PixiStage } from '../pixi/PixiStage'
import { TrainScene, type LetterState } from '../pixi/scenes/TrainScene'
import { getData, logActivity, updateProfile, type Profile } from '../storage/store'

type Phase = 'arriving' | 'typing' | 'spelled' | 'leaving' | 'station'

interface WordTrial {
  word: string
  labels: string[]
  mode: WordMode
  index: number
  /** Wrong presses in the whole word, and on the current letter. */
  misses: number
  letterMisses: number
  wrongKeys: string[]
  /** Letters that had to be revealed or glowed while spelling from memory. */
  hints: number
  /** The current letter is showing faintly (a "Remember it" hint). */
  revealed: boolean
  /** On-screen keyboard help for the current letter: 0 none, 1 glow, 2 glow + arrow. */
  keyHint: number
  maxKeyHint: number
  /** Help given for pausing on this letter: 1 = first step, 2 = everything. */
  idleSteps: number
}

interface StationEnd {
  station: number
  words: string[]
  fresh: string[]
}

function currentProfile(): Profile {
  const d = getData()
  return d.profiles[d.activeProfileId!]
}

function letterCaseAt(caseStage: CaseStage, i: number): LetterCase {
  if (caseStage === 'upper') return 'upper'
  if (caseStage === 'lower') return 'lower'
  return i === 0 ? 'upper' : 'lower'
}

function statesFor(t: WordTrial): LetterState[] {
  return t.labels.map((_, i) => {
    if (i < t.index) return 'done'
    if (i === t.index) {
      if (t.mode === 'see' || i === 0) return 'next'
      return t.revealed ? 'nextGhost' : 'nextBlank'
    }
    // Spelling from memory: only the first letter is shown as a cue.
    return t.mode === 'see' ? 'shown' : i === 0 ? 'shown' : 'blank'
  })
}

function spokenWord(word: string) {
  return wordInfo(word).say ?? word.toLowerCase()
}

/** Word Train: type each word letter by letter; the train carries it to the next station. */
export function TrainGame({ profile, onHome, active, breakDue, onBreak }: {
  profile: Profile
  onHome: () => void
  active: boolean
  breakDue: boolean
  onBreak: () => void
}) {
  const scene = useRef<TrainScene | null>(null)
  const keyboardArea = useRef<HTMLDivElement>(null)
  const [trial, setTrialState] = useState<WordTrial | null>(null)
  const trialRef = useRef<WordTrial | null>(null)
  const [phase, setPhase] = useState<Phase>('arriving')
  const [pip, setPip] = useState<PipMood>('happy')
  const [message, setMessage] = useState<string | null>(null)
  const [flash, setFlash] = useState<{ code: string; kind: 'press' | 'wrong'; id: number } | null>(null)
  const [stationEnd, setStationEnd] = useState<StationEnd | null>(null)
  const [sceneReady, setSceneReady] = useState(false)
  const [nudge, setNudge] = useState(0)
  const timers = useRef<number[]>([])
  const pace = DIFFICULTY[profile.settings.difficulty]
  const caseStage = profile.progress.caseStage
  const station = profile.train.stationsDone + 1
  const { line } = lineForStation(station)

  const later = (ms: number) => new Promise<void>((r) => timers.current.push(window.setTimeout(r, ms)))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const setTrial = (t: WordTrial | null) => {
    trialRef.current = t
    setTrialState(t)
    if (t) statesFor(t).forEach((s, i) => scene.current?.setLetterState(i, s))
  }

  const onReady = useCallback((s: TrainScene) => {
    scene.current = s
    s.setReducedMotion(profile.settings.reducedMotion)
    s.setBottomInset(keyboardArea.current?.offsetHeight ?? 0)
    setSceneReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = keyboardArea.current
    if (!el) return
    const observer = new ResizeObserver(() => scene.current?.setBottomInset(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /** Makes sure a station is planned (or resumed after a reload). */
  const ensureStation = () => {
    const p = currentProfile()
    if (p.train.current && p.train.current.index < p.train.current.words.length) return
    const letters = new Set(activeLetters(p.progress, 'upper'))
    const words = planStation(p.train, p.train.stationsDone + 1, letters, DIFFICULTY[p.settings.difficulty].trainWords)
    const fresh = words.filter((x) => !p.train.words[x])
    updateProfile((q) => ({ ...q, train: { ...q.train, current: { words, index: 0, fresh } } }))
  }

  const keyHintFor = (word: string, i: number, mode: WordMode) => {
    if (mode === 'remember') return 0
    const p = currentProfile()
    const letterCase = letterCaseAt(p.progress.caseStage, i)
    return startingHint(p.progress.skills[`${letterCase}:${word[i]}`])
  }

  const startWord = async () => {
    const p = currentProfile()
    const cur = p.train.current!
    const word = cur.words[cur.index]
    const mode = wordMode(p.train.words[word], DIFFICULTY[p.settings.difficulty].rememberAfter)
    const labels = displayWord(word, p.progress.caseStage).split('')
    const t: WordTrial = { word, labels, mode, index: 0, misses: 0, letterMisses: 0, wrongKeys: [], hints: 0, revealed: false, keyHint: keyHintFor(word, 0, mode), maxKeyHint: 0, idleSteps: 0 }
    t.maxKeyHint = t.keyHint
    setPhase('arriving')
    setMessage(null)
    setPip('happy')
    trialRef.current = t
    setTrialState(t)
    await scene.current?.arrive(labels, statesFor(t))
    speak(mode === 'see' ? `${spokenWord(word)}!` : `Can you spell ${spokenWord(word)}?`)
    if (mode === 'remember') setMessage('Can you remember it?')
    setPhase('typing')
  }

  useEffect(() => {
    if (!sceneReady) return
    ensureStation()
    void startWord()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneReady])

  // A pause with no key presses helps in two steps per letter: first a faint letter
  // (or a glowing key), then the glowing key with an arrow and the letter spoken.
  useEffect(() => {
    if (phase !== 'typing' || !active || !trial || trial.idleSteps >= 2) return
    const id = window.setTimeout(() => {
      const t = trialRef.current
      if (!t) return
      const fromMemory = t.mode === 'remember' && t.index > 0
      if (t.idleSteps === 0 && fromMemory && !t.revealed) {
        setTrial({ ...t, revealed: true, hints: t.hints + 1, idleSteps: 1 })
      } else if (t.idleSteps === 0 && !fromMemory) {
        const keyHint = Math.max(t.keyHint, 1)
        setTrial({ ...t, keyHint, maxKeyHint: Math.max(t.maxKeyHint, keyHint), idleSteps: 1 })
      } else {
        const hints = fromMemory && t.keyHint < 2 ? t.hints + 1 : t.hints
        setTrial({ ...t, revealed: true, keyHint: 2, maxKeyHint: 2, hints, idleSteps: 2 })
        setMessage('Look for the glowing key!')
      }
      speak(letterName(t.word[t.index]))
      setPip('curious')
    }, pace.idleMs)
    return () => clearTimeout(id)
  }, [phase, active, trial, nudge, pace.idleMs])

  const finishStation = async () => {
    const p = currentProfile()
    const words = p.train.current?.words ?? []
    const fresh = p.train.current?.fresh ?? []
    const done = p.train.stationsDone + 1
    updateProfile((q) => ({ ...q, train: { ...q.train, stationsDone: done, current: null } }))
    logActivity({ at: Date.now(), kind: 'train', summary: `Word Train station ${done} — ${words.map((x) => x.toLowerCase()).join(', ')}` })
    setPhase('station')
    sfx.reward()
    speak(`Station ${done}! Great spelling!`)
    setStationEnd({ station: done, words, fresh })
    await scene.current?.showStation(`Station ${done}`)
  }

  const finishWord = async (t: WordTrial) => {
    updateProfile((p) => {
      const skill = recordWord(p.train.words[t.word], { word: t.word, mode: t.mode, misses: t.misses, hints: t.hints, at: Date.now() })
      const current = p.train.current ? { ...p.train.current, index: p.train.current.index + 1 } : null
      return { ...p, train: { ...p.train, words: { ...p.train.words, [t.word]: skill }, current } }
    })
    setPhase('spelled')
    setPip('cheer')
    setMessage(t.mode === 'remember' ? 'You remembered it!' : 'You spelled it!')
    sfx.toot()
    // Spell it, then blend it: "C, A, T. Cat!"
    speak(`${[...t.word].map(letterName).join(', ')}. ${spokenWord(t.word)}!`)
    await later(2300)
    setPhase('leaving')
    setMessage(null)
    await scene.current?.depart()
    const cur = currentProfile().train.current
    if (cur && cur.index < cur.words.length) await startWord()
    else await finishStation()
  }

  const nextStation = async () => {
    sfx.tap()
    setStationEnd(null)
    await scene.current?.hideStation()
    ensureStation()
    await startWord()
  }

  const onPress = (press: KeyPress) => {
    const t = trialRef.current
    if (phase !== 'typing' || !t || press.repeat || !press.letter) return
    setNudge((n) => n + 1)
    const expected = t.word[t.index]

    if (press.letter === expected) {
      const i = t.index
      const p = currentProfile()
      const letterCase = letterCaseAt(p.progress.caseStage, i)
      // Every letter typed here also counts for that letter's skill.
      updateProfile((q) => {
        const skill = getSkill(q.progress, expected, letterCase)
        const updated = recordTrial(skill, { letter: expected, letterCase, misses: t.letterMisses, wrongKeys: t.letterMisses ? t.wrongKeys.slice(-t.letterMisses) : [], maxHint: t.maxKeyHint, at: Date.now() })
        return { ...q, progress: { ...q.progress, skills: { ...q.progress.skills, [updated.id]: updated } } }
      })
      scene.current?.fill(i)
      sfx.chuff(i)
      setFlash({ code: press.code, kind: 'press', id: Date.now() })
      setPip('happy')
      const next = i + 1
      if (next >= t.word.length) {
        const doneTrial = { ...t, index: next }
        setTrial(doneTrial)
        void finishWord(doneTrial)
        return
      }
      speak(letterName(expected))
      const keyHint = keyHintFor(t.word, next, t.mode)
      setTrial({ ...t, index: next, letterMisses: 0, revealed: false, keyHint, maxKeyHint: keyHint, idleSteps: 0 })
      setMessage(null)
      return
    }

    // A gentle nudge: nothing is undone. Help grows a step with each miss.
    const letterMisses = t.letterMisses + 1
    let { revealed, hints, keyHint } = t
    if (t.mode === 'remember' && t.index > 0) {
      if (letterMisses >= 1 && !revealed) {
        revealed = true
        hints += 1
      }
      if (letterMisses >= 2 && keyHint < 2) {
        keyHint = 2
        hints += 1
      }
    } else if (letterMisses >= 2) {
      keyHint = 2
    }
    setTrial({ ...t, misses: t.misses + 1, letterMisses, wrongKeys: [...t.wrongKeys, press.letter], revealed, hints, keyHint, maxKeyHint: Math.max(t.maxKeyHint, keyHint) })
    scene.current?.wobble()
    sfx.hmm()
    setPip('curious')
    setFlash({ code: press.code, kind: 'wrong', id: Date.now() })
    setMessage(revealed && !t.revealed ? 'Here’s a little clue!' : keyHint > t.keyHint ? 'Look for the glowing key!' : 'Hmm… try another key!')
    if (keyHint === 2 && t.keyHint < 2) speak(letterName(expected))
  }

  useKeyPresses(onPress, active)

  const info = trial ? wordInfo(trial.word) : null
  const typing = phase === 'typing' || phase === 'spelled'
  const showKeys = phase !== 'station'

  return (
    <div className="game train">
      <div className="game-top">
        <HomeButton onClick={onHome} />
        {phase !== 'station' && (
          <span className="stage-chip">
            {station > TOTAL_STATIONS ? 'Bonus station' : `Station ${station} of ${TOTAL_STATIONS}`} · {line.name}
          </span>
        )}
      </div>

      <PixiStage create={(app) => new TrainScene(app)} onReady={onReady} />

      {info && phase !== 'station' && (
        <div className="picture-area">
          <button className={`picture-card ${phase === 'spelled' ? 'spelled' : ''}`} onClick={() => trial && speak(spokenWord(trial.word))} aria-label={`Hear the word ${trial?.word.toLowerCase()}`}>
            <span className="picture-emoji" aria-hidden="true">{info.picture}</span>
            <span className="replay" aria-hidden="true">🔊</span>
          </button>
          {typing && (
            <div className="pip-line">
              <Pip mood={pip} size={56} />
              {message && <span key={message} className="pip-message">{message}</span>}
            </div>
          )}
        </div>
      )}

      {phase === 'station' && stationEnd && (
        <div className="reward-overlay">
          <div className="reward-card">
            <h2>Station {stationEnd.station}!</h2>
            <p>{stationEnd.fresh.length ? 'New words for your Word Book:' : 'Great practice!'}</p>
            <div className="word-cards">
              {stationEnd.words.map((x) => (
                <button key={x} className="word-card" onClick={() => speak(`${[...x].map(letterName).join(', ')}. ${spokenWord(x)}!`)}>
                  <span className="word-card-emoji" aria-hidden="true">{wordInfo(x).picture}</span>
                  <span className="word-card-word">{displayWord(x, caseStage)}</span>
                  {stationEnd.fresh.includes(x) && <span className="word-card-new">New</span>}
                </button>
              ))}
            </div>
            <div className="reward-actions">
              {breakDue ? (
                <button className="big-btn primary" onClick={onBreak}>Time for a rest 😴</button>
              ) : (
                <>
                  <button className="big-btn primary next-stage" onClick={nextStation}>
                    Next station 🚂<small>Station {stationEnd.station + 1}</small>
                  </button>
                  <button className="big-btn" onClick={onHome}>Home</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div ref={keyboardArea} className={`game-bottom ${showKeys ? '' : 'hidden'}`}>
        <OnScreenKeyboard
          target={phase === 'typing' && trial ? `Key${trial.word[trial.index]}` : null}
          hint={trial?.keyHint ?? 0}
          flash={flash}
        />
      </div>
    </div>
  )
}
