import { useEffect, useRef, useState } from 'react'
import { letterFromKey } from '../engine/letters'

export interface KeyPress {
  /** Uppercase A–Z if a letter key was pressed. */
  letter: string | null
  digit: string | null
  key: string
  /** Physical key position, e.g. "KeyA". Used to light up the on-screen keyboard. */
  code: string
  repeat: boolean
}

/** Keys that would scroll, navigate or open browser UI during play (DECISIONS D7). */
const SWALLOWED = new Set([' ', 'Backspace', 'Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '/', "'", 'PageUp', 'PageDown', 'Home', 'End'])

/**
 * Listens to the physical keyboard on the whole window — not a text field, so
 * Android never pops up its on-screen keyboard or routes keys through an IME.
 */
export function useKeyPresses(onPress: (press: KeyPress) => void, enabled = true) {
  const handler = useRef(onPress)
  handler.current = onPress

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (e: KeyboardEvent) => {
      // Leave system and browser shortcuts alone (PRD FR-015).
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.isComposing || e.keyCode === 229) return
      if (SWALLOWED.has(e.key)) e.preventDefault()
      const letter = letterFromKey(e.key)
      if (letter) e.preventDefault()
      handler.current({
        letter,
        digit: /^[0-9]$/.test(e.key) ? e.key : null,
        key: e.key,
        code: e.code,
        repeat: e.repeat,
      })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}

/** True while the page has lost keyboard focus (another app, a tab switch, a tap outside). */
export function useFocusLost(): [boolean, () => void] {
  const [lost, setLost] = useState(() => typeof document !== 'undefined' && !document.hasFocus())

  useEffect(() => {
    const onBlur = () => setLost(true)
    const onFocus = () => setLost(false)
    const onVisibility = () => setLost(document.hidden || !document.hasFocus())
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const recover = () => {
    window.focus()
    setLost(false)
  }
  return [lost, recover]
}
