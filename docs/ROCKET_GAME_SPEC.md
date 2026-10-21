# Mini-game 1 — Rocket Launch

**Goal for the child:** fuel the rocket by finding letters, then watch it blast
off to a new planet.

## Screen

- Night sky with slowly drifting, twinkling stars (parallax, two layers).
- A friendly rocket on a launch pad, left of centre. Its window shows the guide, Pip.
- A fuel gauge of **5 cells** beside the rocket.
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
   removed. After 2 misses the hint gets stronger (see below).
4. After 5 cells: countdown "3, 2, 1" (spoken), engine flame and smoke
   particles, the rocket flies up, stars streak past, and a new planet slides in.
5. The planet becomes a **sticker** in the Collection. Two big buttons:
   **Fly again** and **Home**.

There is no timer, no score, no lives and no speed measurement.

## Hint ladder

| Level | What the child sees |
| --- | --- |
| 0 | Target letter only; keyboard keys are plain. |
| 1 | The target key glows and pulses on the on-screen keyboard (with a ring, not just colour). |
| 2 | Level 1 plus a bouncing arrow over the key and the letter spoken again. |

- A key the learner hasn't shown they know starts at level 1.
- After 3 unassisted first-try successes on a key, it starts at level 0.
- Within a trial: every 2 misses → one level up. About 8 s of no key presses
  → one level up (once). Never above 2.

## Rewards

Planets unlock in a fixed order (Moon, Mars, Ringo, Bubble, Candy, Ice,
Jungle, Rainbow). Once all are collected, rounds keep awarding bonus stars.
Rewards are never taken away.

## Learning

Each completed trial records: target, case, first-try or not, number of
misses, highest hint level used, and the wrong keys pressed. The shared
learning engine (`src/engine`) picks the targets, so the same skills carry to
future games.
