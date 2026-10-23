import type { CaseStage } from './letters'
import { dayKey } from './skills'

export interface Word {
  word: string
  /** A picture the child can name without reading. Emoji kept to widely supported ones (Android 9+). */
  picture: string
  /** How to say it when the spelling alone would be read oddly ("OK" → "okay"). */
  say?: string
}

export interface TrainLine {
  id: string
  name: string
  stations: number
  /** In teaching order. 3-letter words are grouped by rhyme family, which helps children decode. */
  words: Word[]
}

const w = (word: string, picture: string, say?: string): Word => ({ word, picture, say })

export const LINES: TrainLine[] = [
  {
    id: 'little',
    name: 'Little Line',
    stations: 10,
    words: [
      w('UP', '⬆️'), w('GO', '🚦'), w('HI', '👋'), w('OX', '🐂'), w('NO', '🙅'),
      w('ME', '🙋'), w('WE', '👫'), w('ON', '💡'), w('OK', '👌', 'okay'), w('OH', '😮'),
    ],
  },
  {
    id: 'rhyme',
    name: 'Rhyme Railway',
    stations: 30,
    words: [
      // -at, -an, -ap, -ag
      w('CAT', '🐱'), w('HAT', '🎩'), w('BAT', '🦇'), w('RAT', '🐀'),
      w('VAN', '🚐'), w('PAN', '🍳'), w('MAN', '👨'), w('CAN', '🥫'),
      w('MAP', '🗺️'), w('CAP', '🧢'), w('BAG', '👜'), w('TAG', '🏷️'),
      // -ed, -en, -et
      w('BED', '🛏️'), w('RED', '🔴'), w('HEN', '🐔'), w('TEN', '🔟'), w('PEN', '🖊️'),
      w('JET', '✈️'), w('NET', '🥅'), w('VET', '🩺'),
      // -ig, -in, -ip
      w('PIG', '🐷'), w('PIN', '📌'), w('FIN', '🦈'), w('BIN', '🗑️'), w('LIP', '👄'), w('ZIP', '🤐'),
      // -og, -op, -ot, -ox
      w('DOG', '🐶'), w('FOG', '🌫️'), w('MOP', '🧹'), w('POT', '🍲'), w('DOT', '⚫'), w('BOX', '📦'), w('FOX', '🦊'),
      // -un, -ug, -us, -up
      w('SUN', '☀️'), w('BUN', '🍔'), w('RUN', '🏃'), w('BUG', '🐛'), w('MUG', '☕'), w('HUG', '🤗'),
      w('BUS', '🚌'), w('CUP', '🥤'),
      // Everyday words that don't rhyme
      w('EGG', '🥚'), w('ANT', '🐜'), w('OWL', '🦉'), w('BEE', '🐝'), w('COW', '🐄'), w('KEY', '🔑'),
      w('ICE', '🧊'), w('PIE', '🥧'), w('TOY', '🧸'), w('ZOO', '🦒'), w('SEA', '🌊'), w('EYE', '👁️'),
      w('EAR', '👂'), w('ARM', '💪'), w('LEG', '🦵'), w('BOY', '👦'), w('YAK', '🐃'),
    ],
  },
  {
    id: 'forest',
    name: 'Forest Express',
    stations: 30,
    words: [
      // sh, ck, then blends
      w('FISH', '🐟'), w('SHIP', '🚢'), w('SHOE', '👟'), w('DUCK', '🦆'), w('SOCK', '🧦'), w('LOCK', '🔒'),
      w('FROG', '🐸'), w('DRUM', '🥁'), w('CRAB', '🦀'), w('STAR', '⭐'), w('SNOW', '❄️'),
      // double letters
      w('BALL', '⚽'), w('BELL', '🔔'), w('MOON', '🌙'), w('BOOK', '📖'), w('FOOT', '🦶'), w('TREE', '🌳'), w('SEED', '🌱'),
      // magic e
      w('CAKE', '🎂'), w('KITE', '🪁'), w('BONE', '🦴'), w('ROSE', '🌹'), w('NOSE', '👃'),
      // vowel pairs and more
      w('BOAT', '⛵'), w('RAIN', '🌧️'), w('LEAF', '🍃'), w('BIRD', '🐦'), w('BEAR', '🐻'), w('LION', '🦁'),
      w('MILK', '🥛'), w('CORN', '🌽'), w('PEAR', '🍐'), w('FIRE', '🔥'), w('HAND', '✋'), w('GIFT', '🎁'),
      w('BABY', '👶'), w('KING', '🤴'), w('FORK', '🍴'), w('TENT', '⛺'), w('WOLF', '🐺'), w('DEER', '🦌'), w('GOAT', '🐐'),
    ],
  },
  {
    id: 'mountain',
    name: 'Mountain Line',
    stations: 30,
    words: [
      w('APPLE', '🍎'), w('HOUSE', '🏠'), w('TRAIN', '🚂'), w('CLOUD', '☁️'), w('SNAKE', '🐍'), w('HORSE', '🐴'),
      w('ROBOT', '🤖'), w('PIZZA', '🍕'), w('TIGER', '🐯'), w('ZEBRA', '🦓'), w('MOUSE', '🐭'), w('SHEEP', '🐑'),
      w('WHALE', '🐋'), w('GRAPE', '🍇'), w('LEMON', '🍋'), w('MANGO', '🥭'), w('BREAD', '🍞'), w('CANDY', '🍬'),
      w('CHAIR', '🪑'), w('CLOCK', '⏰'), w('TRUCK', '🚚'), w('PIANO', '🎹'), w('HEART', '❤️'), w('SMILE', '😊'),
      w('BEACH', '🏖️'), w('CROWN', '👑'), w('PLANT', '🌿'), w('TOOTH', '🦷'), w('SHIRT', '👕'), w('PEACH', '🍑'),
      w('GHOST', '👻'), w('SPOON', '🥄'),
    ],
  },
]

export const ALL_WORDS: Word[] = LINES.flatMap((l) => l.words)
const BY_WORD = new Map(ALL_WORDS.map((x) => [x.word, x]))
export const TOTAL_STATIONS = LINES.reduce((n, l) => n + l.stations, 0)

export function wordInfo(word: string): Word {
  return BY_WORD.get(word) ?? { word, picture: '❓' }
}

/** What the child has shown with one word. */
export interface WordSkill {
  word: string
  firstSeenAt: number
  /** Completions with every letter visible ("See it"). */
  shown: number
  /** Completions from memory ("Remember it") with at most one hint. */
  recalled: number
  recallDays: string[]
  misses: number
  lastAt: number
  /** "Remember it" rounds in a row that needed a lot of help; 2 sends the word back to "See it". */
  struggles?: number
}

export interface TrainProgress {
  stationsDone: number
  words: Record<string, WordSkill>
  /** The station in progress, so a reload carries on mid-station. `fresh` are the words new at this station. */
  current: { words: string[]; index: number; fresh?: string[] } | null
}

export function newTrainProgress(): TrainProgress {
  return { stationsDone: 0, words: {}, current: null }
}

export type WordMode = 'see' | 'remember'

export const STRUGGLES_BEFORE_SHOWING_AGAIN = 2

/**
 * "See it" until a word has been typed with all letters visible `rememberAfter`
 * times. A word that needed a lot of help twice in a row is shown again once.
 */
export function wordMode(skill: WordSkill | undefined, rememberAfter: number): WordMode {
  if (!skill || skill.shown < rememberAfter) return 'see'
  return (skill.struggles ?? 0) >= STRUGGLES_BEFORE_SHOWING_AGAIN ? 'see' : 'remember'
}

/** Known: spelled from memory twice, with at most one hint, on different days. */
export function isKnown(skill: WordSkill | undefined): boolean {
  return !!skill && skill.recalled >= 2 && skill.recallDays.length >= 2
}

export interface WordResult {
  word: string
  mode: WordMode
  misses: number
  /** How many letters had to be revealed or glowed in "Remember it". */
  hints: number
  at: number
}

export function recordWord(skill: WordSkill | undefined, r: WordResult): WordSkill {
  const s: WordSkill = skill ?? { word: r.word, firstSeenAt: r.at, shown: 0, recalled: 0, recallDays: [], misses: 0, lastAt: r.at }
  const clean = r.mode === 'remember' && r.hints <= 1
  const struggled = r.mode === 'remember' && r.hints >= 2
  const day = dayKey(r.at)
  return {
    ...s,
    shown: s.shown + (r.mode === 'see' ? 1 : 0),
    recalled: s.recalled + (clean ? 1 : 0),
    recallDays: clean && !s.recallDays.includes(day) ? [...s.recallDays, day].slice(-30) : s.recallDays,
    misses: s.misses + r.misses,
    lastAt: r.at,
    struggles: struggled ? (s.struggles ?? 0) + 1 : 0,
  }
}

/** The line a 1-based station number belongs to; past the last station, the last line. */
export function lineForStation(station: number): { line: TrainLine; index: number; first: number } {
  let first = 1
  for (let i = 0; i < LINES.length; i++) {
    if (station < first + LINES[i].stations) return { line: LINES[i], index: i, first }
    first += LINES[i].stations
  }
  const last = LINES.length - 1
  return { line: LINES[last], index: last, first: TOTAL_STATIONS - LINES[last].stations + 1 }
}

export const MAX_NEW_WORDS_PER_STATION = 2

/**
 * Words for one station: up to 2 new words from the current line, the rest
 * reviews of words met before (tricky, not yet known, or not seen lately
 * first). New words prefer letters the child already has in play, allowing
 * at most one unfamiliar letter, and stay close to list order so rhyme
 * families arrive together.
 */
export function planStation(
  progress: TrainProgress,
  station: number,
  lettersInPlay: Set<string>,
  count: number,
  now: number = Date.now(),
): string[] {
  const { line, index: lineIndex } = lineForStation(station)
  const met = progress.words
  const unseen = line.words.filter((x) => !met[x.word])
  const unknownLetters = (word: string) => new Set([...word].filter((c) => !lettersInPlay.has(c))).size

  const fresh: string[] = []
  const window = unseen.slice(0, 6)
  for (const x of window) {
    if (fresh.length >= MAX_NEW_WORDS_PER_STATION) break
    if (unknownLetters(x.word) <= 1) fresh.push(x.word)
  }
  // Nothing easy enough in reach: take the next word anyway (its keys glow to help).
  if (fresh.length === 0 && unseen.length > 0) fresh.push(unseen[0].word)

  const reviewable = LINES.slice(0, lineIndex + 1)
    .flatMap((l) => l.words)
    .map((x) => met[x.word])
    .filter((s): s is WordSkill => !!s && !fresh.includes(s.word))
  const DAY = 24 * 60 * 60 * 1000
  const score = (s: WordSkill) => (isKnown(s) ? 0 : 3) + Math.min(3, s.misses * 0.5) + Math.min(3, (now - s.lastAt) / DAY)
  const review = [...reviewable].sort((a, b) => score(b) - score(a) || a.lastAt - b.lastAt).map((s) => s.word)

  const picked = [...fresh]
  for (const word of review) {
    if (picked.length >= count) break
    picked.push(word)
  }
  // Early on there is little to review: top up with more new words.
  for (const x of unseen) {
    if (picked.length >= count) break
    if (!picked.includes(x.word)) picked.push(x.word)
  }

  // Alternate new and review words, starting with a new one.
  const news = picked.filter((x) => !met[x])
  const olds = picked.filter((x) => met[x])
  const out: string[] = []
  while (news.length || olds.length) {
    if (news.length) out.push(news.shift()!)
    if (olds.length) out.push(olds.shift()!)
  }
  return out
}

/** A word in the child's letter case: CAT, cat, or Cat once capital case arrives. */
export function displayWord(word: string, caseStage: CaseStage): string {
  if (caseStage === 'upper') return word.toUpperCase()
  if (caseStage === 'lower') return word.toLowerCase()
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}
