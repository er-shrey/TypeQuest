import { DIGIT_NAMES, LETTER_NAMES } from '../engine/letters'

// Spoken prompts through the browser's speech engine (DECISIONS D4). Swapping
// to recorded clips later only means changing this file.

let enabled = true
let voice: SpeechSynthesisVoice | null = null

export function setSpeechEnabled(on: boolean) {
  enabled = on
  if (!on) window.speechSynthesis?.cancel()
}

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? []
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const preferred = ['Samantha', 'Google US English', 'Karen', 'Moira', 'Tessa']
  voice =
    preferred.map((name) => english.find((v) => v.name.includes(name))).find(Boolean) ??
    english.find((v) => v.localService) ??
    english[0] ??
    null
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  pickVoice()
  window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice)
}

export function speak(text: string) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  if (!enabled || !synth) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  if (voice) u.voice = voice
  u.lang = voice?.lang ?? 'en-US'
  u.rate = 0.9
  u.pitch = 1.25
  synth.speak(u)
}

export function letterName(letter: string): string {
  return LETTER_NAMES[letter.toUpperCase()] ?? letter
}

export function digitName(digit: string): string {
  return DIGIT_NAMES[Number(digit)] ?? digit
}
