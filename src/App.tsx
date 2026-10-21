import { useEffect, useRef, useState } from 'react'
import { setSoundEnabled } from './audio/sfx'
import { setSpeechEnabled } from './audio/speech'
import { FocusOverlay } from './components/common'
import { useFocusLost } from './input/useKeyPresses'
import { BreakTime } from './screens/BreakTime'
import { Collection } from './screens/Collection'
import { Explore } from './screens/Explore'
import { Home, type Destination } from './screens/Home'
import { Onboarding } from './screens/Onboarding'
import { ParentArea, type ParentTab } from './screens/ParentArea'
import { ParentGate } from './screens/ParentGate'
import { ProfilePicker } from './screens/ProfilePicker'
import { RocketGame } from './screens/RocketGame'
import { getData, useAppData, useProfile } from './storage/store'

type ScreenName = 'home' | 'rocket' | 'explore' | 'collection' | 'parent'
type GateFor = 'parent' | 'continue' | null

/** Keeps the tablet screen on while a game is open. */
function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    navigator.wakeLock.request('screen').then((l) => {
      if (cancelled) void l.release()
      else lock = l
    }).catch(() => {})
    return () => {
      cancelled = true
      void lock?.release()
    }
  }, [on])
}

export default function App() {
  const profile = useProfile()
  const playerCount = Object.keys(useAppData().profiles).length
  const [screen, setScreen] = useState<ScreenName>('home')
  const [gate, setGate] = useState<GateFor>(null)
  const [parentTab, setParentTab] = useState<ParentTab>('progress')
  // With more than one child, ask who's playing each time the app opens.
  const [picked, setPicked] = useState(() => Object.keys(getData().profiles).length <= 1)
  const [focusLost, recoverFocus] = useFocusLost()
  const [breakDue, setBreakDue] = useState(false)
  const sessionStart = useRef(Date.now())

  const settings = profile?.settings
  useEffect(() => {
    if (!settings) return
    setSoundEnabled(settings.sound)
    setSpeechEnabled(settings.speech)
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion)
  }, [settings])

  // Gentle session limit set by the parent (PRD FR-012, FR-020).
  const limit = settings?.sessionLimitMin ?? 0
  useEffect(() => {
    if (!limit) {
      setBreakDue(false)
      return
    }
    const check = () => setBreakDue(Date.now() - sessionStart.current >= limit * 60_000)
    check()
    const id = setInterval(check, 10_000)
    return () => clearInterval(id)
  }, [limit])

  // The browser Back button (and Esc-as-Back on some tablets) returns home instead of leaving the app.
  useEffect(() => {
    history.pushState({ typequest: true }, '')
    const onPop = () => {
      history.pushState({ typequest: true }, '')
      setGate(null)
      setScreen('home')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const inGame = screen === 'rocket' || screen === 'explore'
  useWakeLock(inGame && !!profile)

  if (!profile) return <Onboarding onDone={() => setScreen('home')} />

  const goHome = () => setScreen('home')
  const openParent = (tab: ParentTab) => {
    setParentTab(tab)
    setGate('parent')
  }
  const go = (d: Destination) => (d === 'parent' ? openParent('progress') : setScreen(d))
  const switchPlayer = () => {
    setScreen('home')
    setPicked(false)
  }
  const passGate = () => {
    if (gate === 'parent') {
      setPicked(true)
      setScreen('parent')
    }
    else {
      sessionStart.current = Date.now()
      setBreakDue(false)
      setScreen('home')
    }
    setGate(null)
  }

  const showBreak = breakDue && (screen === 'home' || screen === 'explore' || screen === 'collection')
  const active = !focusLost && gate === null

  return (
    <>
      {screen === 'parent' ? (
        <ParentArea initialTab={parentTab} onClose={goHome} />
      ) : !picked && playerCount > 1 ? (
        <ProfilePicker onPicked={() => setPicked(true)} onGrownUps={() => openParent('players')} />
      ) : showBreak ? (
        <BreakTime name={profile.name} onGrownUp={() => setGate('continue')} />
      ) : screen === 'rocket' ? (
        <RocketGame profile={profile} onHome={goHome} active={active} breakDue={breakDue} onBreak={goHome} />
      ) : screen === 'explore' ? (
        <Explore profile={profile} onHome={goHome} active={active} />
      ) : screen === 'collection' ? (
        <Collection profile={profile} onHome={goHome} />
      ) : (
        <Home profile={profile} onGo={go} onSwitchPlayer={playerCount > 1 ? switchPlayer : undefined} />
      )}

      {gate && <ParentGate onPass={passGate} onCancel={() => setGate(null)} />}
      {inGame && focusLost && !gate && !showBreak && <FocusOverlay onResume={recoverFocus} />}
    </>
  )
}
