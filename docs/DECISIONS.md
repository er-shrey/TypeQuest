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
- **Capacitor (later milestone)** wraps the same build as a real Android tablet
  app. This gives us what a browser can't: catching the Android Back gesture
  (an external keyboard's Esc key *is* Back on Android), immersive full screen,
  keep-awake, and Play Store distribution. Nothing in the code depends on URL
  routing or a web server, and `base` is relative, so the build drops straight
  into a Capacitor WebView.

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
the Home key, app switching or Esc-as-Back on Android; the parent setup screen
recommends Android **screen pinning** for that, and the Capacitor app will
handle Back itself.
