# TypeQuest — implementation decisions

The PRD (`docs/PRD.md`) is the product source of truth. This file records the
choices the PRD left open, and why. Add to it whenever an ambiguous decision is made.

## D1 — Tech stack: web app now, Android app via Capacitor later

- **Vite + React + TypeScript** for screens, menus and the parent area.
- **PixiJS 8 (WebGL)** for the game scenes: particles, parallax stars, the
  rocket. Kids notice smooth motion and juicy feedback more than anything else,
  and DOM/CSS alone struggles to do that at 60 fps on mid-range tablets.
- **Web Audio synthesis** for sound effects (no audio files to download, tiny,
  instant) and the **Web Speech API** for spoken letter names.
- **vite-plugin-pwa** so the app works offline after first load and can be installed.
- **Capacitor 8** wraps the same build as a real Android tablet app (`android/`).
  This gives us what a browser can't: catching the Android Back gesture,
  immersive full screen, keep-awake, and Play Store distribution. Nothing in the
  code depends on URL routing or a web server, and `base` is relative, so the
  build drops straight into the Capacitor WebView.

Considered and rejected for now: **Flutter** (excellent on Android, but its web
build is heavy and slow to start, and the PRD is web-first); **a native Android
app** (would mean building the product twice).

## D2 — Keyboard layout

US QWERTY only for Milestone 1. The on-screen keyboard is drawn in
`src/components/OnScreenKeyboard.tsx` from a single layout table, so adding
layouts later is a data change.

## D3 — Letter case progresses with skill

Each profile has a **case stage**:

1. `upper` — targets shown as uppercase (matches the printed keycaps).
2. `lower` — targets shown as lowercase (matches early reading).
3. `capital` — Capital case words such as "Cat", once word practice exists
   (Milestone 2). Until then this stage mixes upper and lower letters.

Recognising "a" is a different skill from recognising "A", so skills are
tracked per case (`upper:A`, `lower:a`). The stage moves forward automatically
when enough letters are mastered in the current one (see `engine/config.ts`),
and a parent can change it in the parent area. Key matching itself is always
case-insensitive, so Caps Lock or Shift never makes a correct press "wrong".

## D4 — Audio says letter names

"Can you find B?" — letter names, not phonics. Spoken through the browser's
speech engine using a pronunciation table (`"bee"`, `"double you"`) so engines
don't read "A" as the article "a". Recorded voice clips can replace this later
without touching the game code (`src/audio/speech.ts`).

## D5 — Storage

All data is local (`localStorage`, one versioned JSON document per app). On
first run we call `navigator.storage.persist()` so the browser is less likely
to evict it. No accounts, no network calls.

## D6 — Parent gate

A typed sum ("What is 7 + 5?") with a number pad. Pre-readers can't pass it by
chance, and it needs no account or PIN to forget.

## D7 — Keys we swallow, keys we can't

During play the app calls `preventDefault` on keys that would scroll or
navigate the page (Space, Backspace, Tab, arrows, Enter, `/`, `'`). Shortcuts
with Ctrl/Alt/Meta are left alone, as the PRD requires. A web page cannot block
the Home key or app switching; the parent setup screen recommends Android
**screen pinning** for that.

In the Android app (`MainActivity.java`), Esc from a physical keyboard is handed
to the page and stopped there, because Android would otherwise turn it into Back
and close the game. The Back gesture itself returns to the home screen and never
exits the app.

## D8 — Android app specifics

- **No permissions at all**, not even `INTERNET`: the app can't reach the network,
  which is the simplest privacy promise to make to parents.
- **Speech:** Android's WebView has no `speechSynthesis`, so the app speaks
  through Android's own text-to-speech (`@capacitor-community/text-to-speech`).
- **Full screen and screen-on:** system bars hidden (swipe from an edge to show
  them briefly), and the screen doesn't dim while the app is open.
- **No service worker in the app:** files ship inside the APK, and a cached
  worker could keep serving an old version after an update. It's registered on
  the web only.
- **App id:** `io.github.ershrey.typequest`.

## D9 — Stages, difficulty and the break

- **Stages are planets.** 600 stages in 27 galaxies: 3 hand-drawn galaxies of 8,
  then 24 generated galaxies of 24 (seeded, so the order never changes and
  saved progress stays valid). Each galaxy asks for one more fuel cell, capped
  at 8, so rounds lengthen gently as a child progresses. The reward
  button names the next stage ("Next: Ringo") so it never looks like a replay.
- **Letters keep a minimum pace.** Mastery alone was too slow: a child could
  finish 24 stages without meeting Q (seen in real use). Now at least one new
  capital letter joins per stage (every 2 on Gentle), at most 2 per round.
- **Difficulty is per child** (Gentle, Normal, Challenge) and only changes the
  round length, how quickly hints arrive and how soon new letters join. The
  table is in `engine/config.ts` and in the rocket spec.
- **The break can't be skipped by closing the app.** When the session limit is
  reached, the child sees the break screen with a **Close TypeQuest** button
  (it exits the Android app; a browser tab only closes if the browser allows
  it). The rest lasts as long as the limit and is saved, so reopening the app
  during it shows the break screen again. A grown-up can end it early through
  the sum gate.
- **A Quit button, top-left on the home and "Who's playing?" screens**, with no gate:
  quitting loses nothing, since progress is saved after every letter. It shows
  in the Android app and in an installed web app; an ordinary browser tab can't
  close itself, so there the tab's own close button does the job.

## D10 — Word Train teaching choices

- **Second game, unlocked at 8 letters.** Rocket teaches finding a key; the
  train teaches typing keys in order, so it opens once a child has enough
  letters to make words. The home screen now says "Let's play!" with both games.
- **Pictures with every word**, and only concrete, picturable words, so the
  word is tied to a meaning (recognition, not just letter order).
- **See it → Remember it.** New words show every letter; after 2 completions
  only the first letter is shown and the child spells from memory, with hints
  that bring the letters back step by step. Hard words return to "See it".
- **Rhyme families** for 3-letter words (cat, hat, bat), then blends, digraphs,
  double letters and magic e on the 4-letter line, then 5-letter words.
- **Spaced review:** at most 2 new words per station; the rest are earlier
  words, tricky or not-yet-known ones first.
- **100 stations** in 4 lines (10 + 30 + 30 + 30). More words can be added to
  `engine/words.ts` without changing anything else.
- **Letters typed on the train count for Rocket's letter skills too.**

