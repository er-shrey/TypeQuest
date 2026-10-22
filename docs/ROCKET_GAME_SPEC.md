# Mini-game 1 — Rocket Launch

**Goal for the child:** fuel the rocket by finding letters, then watch it blast
off to a new planet.

## Screen

- Night sky with slowly drifting, twinkling stars (parallax, two layers).
- A friendly rocket on a launch pad, left of centre. Its window shows the guide, Pip.
- A fuel gauge beside the rocket: **4–8 cells**, set by difficulty and galaxy (see Stages).
- A stage label in the corner, e.g. "Stage 3 of 24 · Home Galaxy".
- The **target letter** large, in a glowing bubble above the gauge.
- The on-screen keyboard along the bottom.

## One round

1. A target letter appears with a pop, and Pip says "Can you find *B*?"
   (if speech is on). Tapping the letter bubble repeats it.
2. **Correct key:** the cell fills with a sparkle burst that flies from the
   bubble into the gauge, a rising chime plays, the rocket bounces, "You found it!"
   appears. The next letter comes ~1 s later.
3. **Wrong key:** the rocket does a small curious wobble, a soft low "boop"
   plays, and the pressed key flashes grey on the keyboard. Fuel is **never**
   removed. After a few misses the hint gets stronger (see below).
4. With the tank full: countdown "3, 2, 1" (spoken), engine flame and smoke
   particles, the rocket flies up, stars streak past, and a new planet slides in.
5. The planet becomes a **sticker** in the Collection. Two big buttons:
   **Next: *planet name* 🚀** (the next stage) and **Home**. After the last planet
   of a galaxy, the card also says the whole galaxy is explored.

There is no timer, no score, no lives and no speed measurement.

## Hint ladder

| Level | What the child sees |
| --- | --- |
| 0 | Target letter only; keyboard keys are plain. |
| 1 | The target key glows and pulses on the on-screen keyboard (with a ring, not just colour). |
| 2 | Level 1 plus a bouncing arrow over the key and the letter spoken again. |

- A key the learner hasn't shown they know starts at level 1.
- After 3 unassisted first-try successes on a key, it starts at level 0.
- Within a trial: every few misses → one level up (1 on Gentle, 2 on Normal,
  3 on Challenge). A pause with no key presses → one level up, once (5 s, 8 s
  or 15 s). Never above 2.

## Stages and difficulty

Each planet is one stage: **24 stages in 3 galaxies** (Home Galaxy, Ocean
Nebula, Sweet Cluster), each with its own sky colour. Planets unlock in a fixed
order, one per finished round. After all 24, rounds keep awarding bonus stars.
Rewards are never taken away. Later galaxies stay hidden in the collection
until the child reaches them.

A parent sets the difficulty per child in the grown-ups area:

| | Gentle | Normal | Challenge |
| --- | --- | --- | --- |
| Fuel cells per round (Home / Ocean / Sweet) | 4 / 5 / 6 | 5 / 6 / 7 | 6 / 7 / 8 |
| Misses before a stronger hint | 1 | 2 | 3 |
| Pause before a stronger hint | 5 s | 8 s | 15 s |
| New letter added when this share of letters is known | 85% | 75% | 60% |

Difficulty only changes pace and help. No setting adds timers, scores or penalties.

## Learning

Each completed trial records: target, case, first-try or not, number of
misses, highest hint level used, and the wrong keys pressed. The shared
learning engine (`src/engine`) picks the targets, so the same skills carry to
future games.
