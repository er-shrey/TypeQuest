// Captures the README screenshots: starts the dev server, seeds demo players,
// plays through the screens in headless Chrome and saves PNGs to docs/screenshots.
//
//   npm run screenshots
//   CHROME_PATH=/path/to/chrome npm run screenshots

import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import puppeteer from 'puppeteer-core'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = `${ROOT}docs/screenshots`
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const LANDSCAPE = { width: 1280, height: 800, deviceScaleFactor: 1 }
const PORTRAIT = { width: 800, height: 1280, deviceScaleFactor: 1 }

const DAY = 24 * 60 * 60 * 1000
const now = Date.now()

function skill(letter, { successes, unassisted = 0, days = 0, misses = 0, ago = 0 }) {
  const dayKeys = Array.from({ length: days }, (_, i) => new Date(now - i * DAY).toISOString().slice(0, 10))
  const firstTry = Math.max(0, successes - misses)
  return {
    id: `upper:${letter}`,
    letter,
    letterCase: 'upper',
    introducedAt: now - 3 * DAY,
    attempts: successes + misses,
    successes,
    misses,
    firstTrySuccesses: firstTry,
    unassistedSuccesses: unassisted,
    unassistedDays: dayKeys,
    recent: Array.from({ length: Math.min(8, successes) }, (_, i) => i >= misses),
    lastPracticedAt: now - ago,
    confusions: {},
  }
}

function player(id, name, avatar, startStage, extra = {}) {
  return {
    id,
    name,
    avatar,
    startStage,
    createdAt: now - (id === 'mia' ? 5 : 2) * DAY,
    settings: { sound: false, speech: false, reducedMotion: false, sessionLimitMin: 0 },
    progress: { caseStage: 'upper', poolSize: { upper: 4, lower: 4 }, skills: {} },
    rewards: { planets: [], bonusStars: 0 },
    activity: [],
    rocketCells: 0,
    ...extra,
  }
}

const mia = player('mia', 'Mia', '🦊', 'explorer', {
  progress: {
    caseStage: 'upper',
    poolSize: { upper: 6, lower: 4 },
    skills: Object.fromEntries(
      [
        skill('A', { successes: 14, unassisted: 9, days: 3, misses: 1, ago: 2 * 60e3 }),
        skill('O', { successes: 12, unassisted: 7, days: 2, ago: 5 * 60e3 }),
        skill('S', { successes: 9, unassisted: 4, days: 1, misses: 2, ago: 3 * 60e3 }),
        skill('T', { successes: 8, unassisted: 3, days: 1, misses: 1, ago: 8 * 60e3 }),
        skill('M', { successes: 3, misses: 2, ago: 4 * 60e3 }),
        skill('E', { successes: 1, misses: 1, ago: 60e3 }),
      ].map((s) => [s.id, s]),
    ),
  },
  rewards: { planets: ['moon', 'mars', 'ringo'], bonusStars: 0 },
  activity: [
    { at: now - 60e3, kind: 'rocket', summary: 'Rocket round finished — reached Ringo' },
    { at: now - 9 * 60e3, kind: 'explore', summary: 'Explored 14 different keys' },
    { at: now - DAY, kind: 'rocket', summary: 'Rocket round finished — reached Mars' },
    { at: now - 2 * DAY, kind: 'rocket', summary: 'Rocket round finished — reached Moon' },
  ],
})
const leo = player('leo', 'Leo', '🐼', 'adventurer', { progress: { caseStage: 'upper', poolSize: { upper: 8, lower: 8 }, skills: {} } })

const seed = (activeProfileId, profiles) => JSON.stringify({ version: 1, activeProfileId, profiles: Object.fromEntries(profiles.map((p) => [p.id, p])) })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const server = await createServer({ root: ROOT, server: { port: 5199, strictPort: true }, logLevel: 'error' })
await server.listen()
const URL_ = 'http://localhost:5199/'
await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
})

async function open(viewport, data) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.evaluateOnNewDocument((d) => {
    if (d && !sessionStorage.getItem('seeded')) {
      localStorage.setItem('typequest:v1', d)
      sessionStorage.setItem('seeded', '1')
    }
  }, data)
  await page.goto(URL_, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await sleep(600)
  return page
}

const shot = async (page, name, fullPage = false) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage })
  console.log(`  ✓ ${name}.png`)
}
const click = (page, selector) => page.click(selector)
const clickText = (page, text) =>
  page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(t))?.click(), text)
const target = (page) => page.$eval('.target-letter', (e) => e.textContent.trim().toLowerCase())
const press = (page, key) => page.keyboard.press(key)

async function passGate(page) {
  await click(page, '.parent-link')
  await sleep(300)
  const sum = await page.$eval('.gate p', (e) => {
    const [, a, b] = e.textContent.match(/(\d+) \+ (\d+)/)
    return String(Number(a) + Number(b))
  })
  for (const d of sum) {
    await page.evaluate((digit) => [...document.querySelectorAll('.numpad button')].find((b) => b.textContent === digit).click(), d)
    await sleep(60)
  }
  await sleep(400)
}

async function wrongKey(page) {
  const t = await target(page)
  const k = 'qwzxjv'.split('').find((c) => c !== t)
  await press(page, k)
}

try {
  console.log('Capturing screenshots…')

  // First-run setup
  let page = await open(LANDSCAPE, null)
  await shot(page, 'onboarding', true)
  await page.close()

  // Who's playing?
  page = await open(LANDSCAPE, seed('mia', [mia, leo]))
  await sleep(500)
  await shot(page, 'picker')

  // Home
  await page.evaluate(() => [...document.querySelectorAll('.player-card')].find((b) => b.textContent.includes('Mia')).click())
  await sleep(700)
  await shot(page, 'home')

  // Rocket: the target key glows (hint level 1)
  await click(page, '.card-rocket')
  await sleep(1600)
  await shot(page, 'rocket-prompt')

  // Repeated misses: the hint grows to an arrow over the key, with a gentle message
  for (let i = 0; i < 4; i++) {
    await wrongKey(page)
    await sleep(650)
  }
  await shot(page, 'rocket-hint')

  // Correct key: fuel cell fills with sparkles
  await press(page, await target(page))
  await sleep(220)
  await shot(page, 'rocket-found')

  // Fill the rest of the tank and capture the launch
  for (let i = 0; i < 4; i++) {
    await sleep(1300)
    await press(page, await target(page))
  }
  await sleep(1500)
  await shot(page, 'rocket-countdown')
  await sleep(3600)
  await shot(page, 'rocket-liftoff')
  await sleep(3600)
  await shot(page, 'rocket-reward')

  // Explore
  await clickText(page, 'Home')
  await sleep(500)
  await click(page, '.card-explore')
  await sleep(1400)
  for (const k of ['m', 'i', 'a']) {
    await press(page, k)
    await sleep(180)
  }
  await press(page, 'Space')
  await sleep(450)
  await shot(page, 'explore')

  // Planet collection
  await click(page, '.home-btn')
  await sleep(500)
  await click(page, '.card-stickers')
  await sleep(900)
  await shot(page, 'collection')

  // Grown-ups area
  await click(page, '.home-btn')
  await sleep(500)
  await passGate(page)
  await shot(page, 'parent-progress', true)
  await clickText(page, 'Players (')
  await sleep(400)
  await shot(page, 'parent-players')
  await page.close()

  // Portrait tablet
  page = await open(PORTRAIT, seed('leo', [leo]))
  await click(page, '.card-rocket')
  await sleep(1600)
  await shot(page, 'rocket-portrait')
  await page.close()
} finally {
  await browser.close()
  await server.close()
}
