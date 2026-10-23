<p align="center">
  <img src="public/icon-192.png" width="96" alt="TypeQuest icon" />
</p>

<h1 align="center">TypeQuest</h1>

<p align="center">
  A playful typing journey from the first curious key press to confident typing.<br />
  Built for young children (about 4–6) learning to find letters on a real keyboard.
</p>

<p align="center">
  <img src="docs/screenshots/rocket-found.png" width="820" alt="Rocket Launch: the child pressed S, a fuel cell fills with sparkles and Pip says 'You found it!'" />
</p>

- **No pressure.** No timers, scores, lives, streaks or "wrong!" sounds. A wrong key gets a curious wobble, and the hint gets a little stronger.
- **Learning built into the game.** One shared learning engine decides which letters to practise, when to give hints, and when a letter is truly known.
- **Made for tablets.** Works in a desktop or Android tablet browser with a physical keyboard, in landscape or portrait, and offline once loaded.
- **Private by design.** Everything stays on the device. No accounts, emails, ads or network calls.

## Download for Android tablets

**[Latest release](https://github.com/er-shrey/TypeQuest/releases/latest)**, or the direct link to the current build:

```
https://github.com/er-shrey/TypeQuest/releases/download/v0.3.0/TypeQuest-0.3.0.apk
```

Open the link on the tablet and tap the downloaded file. Android asks two one-time questions for apps from outside the Play Store: allow installs from your browser (or file manager), then tap past the Play Protect "unknown developer" warning (**More details → Install anyway**). Connect a physical keyboard and you're ready.

Or install from a computer over USB, with USB debugging on:

```bash
adb install -r TypeQuest-0.3.0.apk
```

TypeQuest asks for no permissions at all, not even internet access.

## Rocket Launch

Find letters to fuel the rocket. Five letters fill the tank, then it's countdown, blast-off and a new planet.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/rocket-prompt.png" alt="A target letter in a glowing bubble, with the matching key glowing on the on-screen keyboard" /></td>
    <td width="50%"><img src="docs/screenshots/rocket-hint.png" alt="After a few misses, a bouncing arrow points at the key and Pip says 'Hmm… let's look again!'" /></td>
  </tr>
  <tr>
    <td><b>Find the letter.</b> New letters start with their key glowing on the on-screen keyboard. Tap the bubble to hear the letter again.</td>
    <td><b>Gentle hints.</b> Misses never take fuel away. After a few, an arrow bounces over the right key.</td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/rocket-countdown.png" alt="Full fuel gauge and a big 3 for the countdown" /></td>
    <td><img src="docs/screenshots/rocket-liftoff.png" alt="The rocket lifting off in a cloud of smoke" /></td>
  </tr>
  <tr>
    <td><b>3, 2, 1…</b> A full tank starts the countdown.</td>
    <td><b>Blast off!</b> Engine flame, smoke and rushing stars.</td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/rocket-reward.png" alt="The rocket visits a smiling blue planet called Bubble; a card offers Next: Ringo or Home" /></td>
    <td><img src="docs/screenshots/rocket-portrait.png" alt="Rocket Launch on a tablet held in portrait" /></td>
  </tr>
  <tr>
    <td><b>A new planet, the next stage.</b> 600 stages across 27 galaxies, each galaxy needing a little more fuel. Planets come in a fixed order and are never taken away.</td>
    <td><b>Portrait too.</b> The layout adapts when the tablet is turned.</td>
  </tr>
</table>

## Word Train

The second game, for children who have met 8 letters. Each word rides in on a train, one letter per carriage, with a picture to say what it means. Type the letters in order and the train chugs off; every few words it reaches a station.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/train-see.png" alt="A new word, MAN, with a picture; every letter shows on the carriages and the first one glows" /></td>
    <td width="50%"><img src="docs/screenshots/train-remember.png" alt="Spelling CAT from memory: a cat picture, the first letter C showing and two blank carriages" /></td>
  </tr>
  <tr>
    <td><b>See it.</b> New words show every letter, with a picture and the word spoken aloud.</td>
    <td><b>Remember it.</b> After typing a word twice, the child spells it from memory, with the picture and first letter as cues.</td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/train-clue.png" alt="A wrong key brings back the hidden letter faintly, with Pip saying here's a little clue" /></td>
    <td><img src="docs/screenshots/train-station.png" alt="A station with its new words shown as picture cards for the Word Book" /></td>
  </tr>
  <tr>
    <td><b>Never stuck.</b> A wrong key or a pause brings the letter back faintly, then its key glows. A word that stays hard goes back to "See it".</td>
    <td><b>Stations.</b> 100 stations on 4 lines: 2-letter words, then 3-letter rhyme families (cat, hat, bat), 4-letter words, and 5-letter words. New words go into the Word Book.</td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/word-book.png" width="600" alt="The Word Book: word cards with pictures, gold stars on words known by heart" /><br />
  <sub>The Word Book: every word met, with its picture. Tap a word to hear it spelled. A gold star means it was spelled from memory on two different days.</sub>
</p>

## Explore, players and stickers

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/explore.png" alt="Explore mode: big colourful letters pop up above the keys that were pressed" /></td>
    <td width="50%"><img src="docs/screenshots/picker.png" alt="Who's playing? screen with a fox for Mia and a panda for Leo" /></td>
  </tr>
  <tr>
    <td><b>Explore.</b> Press any key and its letter or number pops up and is spoken. Space sets off a firework. Nothing to get wrong.</td>
    <td><b>Who's playing?</b> Each child picks their own buddy, so even pre-readers can find themselves.</td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/home.png" alt="Home screen: Pip greets Mia, with Rocket Launch, Explore and My Planets cards" /></td>
    <td><img src="docs/screenshots/collection.png" alt="My Planets: Moon, Mars, Ringo and Bubble collected, four still to discover" /></td>
  </tr>
  <tr>
    <td><b>Home.</b> "Let's play!" with both games, plus Explore, My Planets and My Words. In the tablet app, a Quit button sits top-left.</td>
    <td><b>My Planets.</b> The sticker collection, with the planets still to discover.</td>
  </tr>
</table>

## Grown-ups area

Behind a simple sum ("What is 7 + 5?") so little ones don't wander in.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/parent-progress.png" alt="Progress for Mia: each letter marked as Knows it well, Practising, Getting to know or Not met yet" /></td>
    <td width="50%"><img src="docs/screenshots/parent-players.png" alt="Players list with Mia and Leo, Edit and Delete buttons, and Add a player" /></td>
  </tr>
  <tr>
    <td><b>Progress per child.</b> Every letter, in capitals and small letters, plus recent activity. "Knows it well" means found on the first try without help, on at least two different days.</td>
    <td><b>Players.</b> Add, edit or remove children. Each one has their own letters, planets and settings: difficulty (Gentle, Normal or Challenge), sound, speech, calmer visuals, a break reminder and letter case.</td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/onboarding.png" width="600" alt="First-run setup: nickname, buddy and starting point" /><br />
  <sub>First-run setup takes under a minute: a nickname, a buddy and a starting point.</sub>
</p>

## How it teaches

- **Small steps:** children start with 4 letters (8 for "Letter Adventurer"). A new one is added once most of the current letters are known.
- **Letter case grows with skill:** capital letters first, then small letters, then mixed. Each case is tracked as its own skill, and a parent can move it on early.
- **Mastery takes real evidence:** a letter is "known well" only after it's found on the first try without a hint, on two different days. Time spent or attempt counts don't count on their own.
- **Hints that adapt:** keys a child hasn't shown they know start out glowing. Once found first try three times, the glow goes away, and it comes back only after repeated misses.

## Run it

```bash
npm install
npm run dev
```

To try it on an Android tablet on the same Wi-Fi, open the network address this prints:

```bash
npm run dev -- --host
```

Tests and a production build (installable, offline-capable):

```bash
npm test
```

```bash
npm run build
```

Regenerate the screenshots above. This starts the dev server, seeds demo players and drives a local Chrome; set `CHROME_PATH` if Chrome isn't in the default macOS location:

```bash
npm run screenshots
```

## Android tablet app

The same app, packaged for Android with [Capacitor](https://capacitorjs.com). It runs full screen and keeps the screen on. Esc on a physical keyboard is stopped from closing the game, and the Back gesture goes home instead of exiting. It requests no permissions at all, not even internet access.

You need the Android SDK (Android Studio installs it) and JDK 21. Build a debug APK:

```bash
npm run android:apk
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. For a release build, signed and copied to `release/TypeQuest-<version>.apk` with its SHA-256 printed, bump `version` in `package.json` (the Android version is read from there) and run:

```bash
npm run android:release
```

To install the debug build on a tablet connected by USB with USB debugging on:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or open the project in Android Studio to run it from there:

```bash
npm run android:open
```

After changing web code, run `npm run android:sync` to copy the new build into the Android project. App icon and splash sources are in `assets/`. Regenerate them with `npx @capacitor/assets generate --android`.

## Docs

- [docs/PRD.md](docs/PRD.md): product requirements, the source of truth
- [docs/DECISIONS.md](docs/DECISIONS.md): choices the PRD left open (stack, letter case, audio, storage, parent gate)
- [docs/ROCKET_GAME_SPEC.md](docs/ROCKET_GAME_SPEC.md): the first mini-game and its hint ladder
- [docs/TRAIN_GAME_SPEC.md](docs/TRAIN_GAME_SPEC.md): Word Train, its lines, and how it teaches spelling

## Project layout

```
src/engine/    learning model: letters, skills and mastery, target picking, rewards (no UI)
src/storage/   local, versioned store for multiple players
src/input/     physical keyboard and focus handling
src/audio/     synthesised sound effects and spoken letter names
src/pixi/      PixiJS stage, particles, tweens and the game scenes
src/screens/   React screens
scripts/       screenshot capture
```

**Stack:** Vite, React and TypeScript, PixiJS (WebGL) for the game scenes, Web Audio and Web Speech for sound, and vite-plugin-pwa for offline use. Capacitor for the Android tablet app.
