# TypeQuest

A playful typing journey from first key presses to confident typing. Milestone 1
is for young children (about 4–6) learning to find letters on a physical keyboard.

- **Rocket Launch** — find letters to fuel the rocket, fly to a new planet, collect it.
- **Explore** — press any key and something delightful happens. Nothing to get wrong.
- **My Planets** — the sticker collection.
- **Grown-ups area** — progress per letter, sound/speech/motion settings, session limit, reset.

Everything runs offline and stays on the device. No accounts.

## Run it

```bash
npm install
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

## Docs

- [docs/PRD.md](docs/PRD.md) — product requirements (source of truth)
- [docs/DECISIONS.md](docs/DECISIONS.md) — choices the PRD left open: stack, letter case, audio, storage
- [docs/ROCKET_GAME_SPEC.md](docs/ROCKET_GAME_SPEC.md) — the first mini-game, including the hint ladder

## Layout

```
src/engine/    learning model: letters, skills/mastery, target picking, rewards (no UI)
src/storage/   local, versioned profile store
src/input/     physical keyboard and focus handling
src/audio/     synthesised sound effects and spoken letter names
src/pixi/      PixiJS stage, particles, tweens and the game scenes
src/screens/   React screens
```
