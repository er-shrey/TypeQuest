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
    <td><img src="docs/screenshots/rocket-reward.png" alt="The rocket visits a smiling blue planet called Bubble; a card offers Fly again or Home" /></td>
    <td><img src="docs/screenshots/rocket-portrait.png" alt="Rocket Launch on a tablet held in portrait" /></td>
  </tr>
  <tr>
    <td><b>A new planet.</b> Each round unlocks the next planet sticker. Rewards come in a fixed order and are never taken away.</td>
    <td><b>Portrait too.</b> The layout adapts when the tablet is turned.</td>
  </tr>
</table>

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
    <td><b>Home.</b> Three big choices and the next planet to fly to.</td>
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
    <td><b>Players.</b> Add, edit or remove children. Each one has their own letters, planets and settings: sound, speech, calmer visuals, a break reminder and letter case.</td>
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

## Docs

- [docs/PRD.md](docs/PRD.md): product requirements, the source of truth
- [docs/DECISIONS.md](docs/DECISIONS.md): choices the PRD left open (stack, letter case, audio, storage, parent gate)
- [docs/ROCKET_GAME_SPEC.md](docs/ROCKET_GAME_SPEC.md): the first mini-game and its hint ladder

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

**Stack:** Vite, React and TypeScript, PixiJS (WebGL) for the game scenes, Web Audio and Web Speech for sound, and vite-plugin-pwa for offline use. An Android tablet app via Capacitor is planned once the web version is stable.
