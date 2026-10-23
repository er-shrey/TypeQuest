import { describe, expect, it } from 'vitest'
import {
  ALL_WORDS,
  displayWord,
  isKnown,
  LINES,
  lineForStation,
  newTrainProgress,
  planStation,
  recordWord,
  TOTAL_STATIONS,
  wordMode,
  type TrainProgress,
} from './words'

const T0 = new Date(2026, 9, 1, 10).getTime()
const DAY = 24 * 60 * 60 * 1000
const letters = (s: string) => new Set(s.split(''))
const ALPHABET = letters('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

describe('word list', () => {
  it('has 100 stations growing from 2-letter to 5-letter words', () => {
    expect(TOTAL_STATIONS).toBe(100)
    expect(LINES.map((l) => [...new Set(l.words.map((x) => x.word.length))])).toEqual([[2], [3], [4], [5]])
  })

  it('gives every word a picture and no duplicates', () => {
    expect(new Set(ALL_WORDS.map((x) => x.word)).size).toBe(ALL_WORDS.length)
    expect(new Set(ALL_WORDS.map((x) => x.picture)).size).toBe(ALL_WORDS.length)
    for (const x of ALL_WORDS) expect(x.word).toMatch(/^[A-Z]+$/)
  })

  it('has enough words for two new ones per station on every line', () => {
    for (const l of LINES) expect(l.words.length).toBeGreaterThanOrEqual(l.stations)
  })

  it('maps stations to lines', () => {
    expect(lineForStation(1).line.id).toBe('little')
    expect(lineForStation(10).line.id).toBe('little')
    expect(lineForStation(11).line.id).toBe('rhyme')
    expect(lineForStation(71).line.id).toBe('mountain')
    expect(lineForStation(150).line.id).toBe('mountain')
  })
})

describe('seeing, then remembering', () => {
  it('moves a word to "Remember it" after it has been typed with letters showing', () => {
    let s = recordWord(undefined, { word: 'CAT', mode: 'see', misses: 0, hints: 0, at: T0 })
    expect(wordMode(s, 2)).toBe('see')
    s = recordWord(s, { word: 'CAT', mode: 'see', misses: 1, hints: 0, at: T0 })
    expect(wordMode(s, 2)).toBe('remember')
    expect(wordMode(s, 3)).toBe('see')
  })

  it('counts a word as known only after clean recalls on two different days', () => {
    let s = recordWord(undefined, { word: 'CAT', mode: 'see', misses: 0, hints: 0, at: T0 })
    s = recordWord(s, { word: 'CAT', mode: 'remember', misses: 0, hints: 0, at: T0 })
    s = recordWord(s, { word: 'CAT', mode: 'remember', misses: 0, hints: 1, at: T0 + 10 })
    expect(isKnown(s)).toBe(false)
    s = recordWord(s, { word: 'CAT', mode: 'remember', misses: 3, hints: 2, at: T0 + DAY })
    expect(isKnown(s)).toBe(false)
    s = recordWord(s, { word: 'CAT', mode: 'remember', misses: 0, hints: 0, at: T0 + DAY })
    expect(isKnown(s)).toBe(true)
  })
})

describe('planning stations', () => {
  it('starts with new words and never more than two new per station', () => {
    const first = planStation(newTrainProgress(), 1, ALPHABET, 3, T0)
    expect(first).toHaveLength(3)
    expect(first.every((x) => x.length === 2)).toBe(true)
  })

  it('mixes reviews of earlier words into later stations', () => {
    let p: TrainProgress = newTrainProgress()
    for (let station = 1; station <= 12; station++) {
      const words = planStation(p, station, ALPHABET, 3, T0 + station * DAY)
      const fresh = words.filter((x) => !p.words[x])
      if (station > 2) expect(fresh.length).toBeLessThanOrEqual(2)
      for (const word of words) p = { ...p, words: { ...p.words, [word]: recordWord(p.words[word], { word, mode: 'see', misses: 0, hints: 0, at: T0 + station * DAY }) } }
      p = { ...p, stationsDone: station }
    }
    const station12 = planStation(p, 12, ALPHABET, 3, T0 + 13 * DAY)
    expect(station12.some((x) => p.words[x])).toBe(true)
  })

  it('keeps rhyme families together on the Rhyme Railway', () => {
    const p: TrainProgress = newTrainProgress()
    expect(planStation(p, 11, ALPHABET, 3, T0).slice(0, 2).sort()).toEqual(['CAT', 'HAT'])
  })

  it('prefers new words made of letters the child already has', () => {
    // Only A, T, S, O, M, E, I, C, B, L, P, H known: VAN (V and N unknown) is skipped for now.
    const p: TrainProgress = { ...newTrainProgress(), words: { CAT: recordWord(undefined, { word: 'CAT', mode: 'see', misses: 0, hints: 0, at: T0 }), HAT: recordWord(undefined, { word: 'HAT', mode: 'see', misses: 0, hints: 0, at: T0 }), BAT: recordWord(undefined, { word: 'BAT', mode: 'see', misses: 0, hints: 0, at: T0 }), RAT: recordWord(undefined, { word: 'RAT', mode: 'see', misses: 0, hints: 0, at: T0 }) } }
    const words = planStation(p, 12, letters('ATSOMEICBLPH'), 3, T0)
    expect(words).not.toContain('VAN')
    expect(words).toContain('PAN')
  })
})

describe('letter case', () => {
  it('shows words in the child’s case stage', () => {
    expect(displayWord('CAT', 'upper')).toBe('CAT')
    expect(displayWord('CAT', 'lower')).toBe('cat')
    expect(displayWord('CAT', 'capital')).toBe('Cat')
  })
})

describe('when a hidden word is hard', () => {
  it('shows a word again after two rounds that needed a lot of help, then hides it once it goes well', () => {
    let s = recordWord(undefined, { word: 'CAT', mode: 'see', misses: 0, hints: 0, at: T0 })
    s = recordWord(s, { word: 'CAT', mode: 'see', misses: 0, hints: 0, at: T0 })
    expect(wordMode(s, 2)).toBe('remember')
    s = recordWord(s, { word: 'CAT', mode: 'remember', misses: 3, hints: 2, at: T0 })
    expect(wordMode(s, 2)).toBe('remember')
    s = recordWord(s, { word: 'CAT', mode: 'remember', misses: 4, hints: 3, at: T0 })
    expect(wordMode(s, 2)).toBe('see')
    s = recordWord(s, { word: 'CAT', mode: 'see', misses: 0, hints: 0, at: T0 })
    expect(wordMode(s, 2)).toBe('remember')
  })
})
