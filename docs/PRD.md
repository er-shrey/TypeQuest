# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## TypeQuest --- A playful typing journey from first keys to professional mastery

**Document status:** Initial product specification\
**Version:** 1.0\
**Product approach:** Web-first, with Android tablet support explicitly
included in the product roadmap\
**Primary audience:** Product owner and AI coding assistant implementing
the product

------------------------------------------------------------------------

## 1. Product vision

TypeQuest is a welcoming, game-based typing tutor that helps children
discover the keyboard through play and gradually develops into a serious
typing-learning platform for older learners and adults.

For a young child, it should feel like exploring a colorful world,
helping friendly characters, and discovering what keys do. As the
learner grows, the experience should introduce letter recognition,
controlled key presses, touch typing, accuracy, speed, and practical
typing tasks.

The product must not be a conventional typing tutor with cartoon
decoration added afterward. Learning activities should be part of the
game itself.

**Product promise:** From the first curious key press to confident,
accurate typing, learners can progress at their own pace in one
continuous product.

### Product principles

1.  **Play before pressure.** Early experiences reward curiosity and
    exploration rather than speed.
2.  **Mastery over grinding.** Progress reflects demonstrated learning,
    not endless repetition.
3.  **Age-appropriate progression.** The product adapts to the learner's
    demonstrated ability; age is only a starting guide.
4.  **Encouragement over punishment.** Mistakes are opportunities to
    learn. Avoid shame, harsh sounds, failure screens, or negative
    labels.
5.  **One learning engine, many experiences.** Skills should carry
    across mini-games, adventures, and structured practice.
6.  **Parent trust and child safety.** Minimize data collection, avoid
    public social features, and give parents clear controls.
7.  **Accessible and inclusive.** Support different learning speeds,
    adjustable audio, clear visuals, and reduced-stimulation options.
8.  **Device flexibility.** Start web-first while planning for a
    high-quality Android tablet experience, including external physical
    keyboards.

------------------------------------------------------------------------

## 2. Product goals

### Goals for the initial release

-   Make a four-year-old comfortable exploring a physical keyboard.
-   Teach basic letter recognition and the relationship between a
    displayed letter and a physical key.
-   Provide immediate, delightful feedback for key presses.
-   Offer at least one complete, replayable game loop.
-   Save progress locally so a child can return without starting over.
-   Give a parent a simple view of progress and session controls.
-   Work well in a desktop browser and on an Android tablet with a
    physical keyboard.
-   Establish a foundation that can expand into structured touch-typing
    and professional practice.

### Long-term goals

-   Support a progression from first-key exploration to
    professional-grade typing practice.
-   Personalize lessons using observed strengths, errors, and retention.
-   Support multiple learner profiles.
-   Offer optional advanced modes for school-age learners, teens, and
    adults.
-   Support offline learning where feasible.
-   Consider cloud synchronization and additional distribution options
    only when validated by user needs.

### Non-goals for the first release

-   A full professional typing certification system.
-   Multiplayer, public leaderboards, chat, or social networking.
-   Advertising or monetization systems.
-   Mandatory accounts, cloud services, or internet access for core
    practice.
-   AI-generated lessons or an AI chatbot.
-   A large library of worlds and mini-games before the core experience
    is validated.
-   A complete school or classroom administration system.
-   Mobile-only touch typing as a substitute for learning a physical
    keyboard.

------------------------------------------------------------------------

## 3. Target users and jobs to be done

### Primary learner: early explorer (approximately ages 4--5)

**Needs** - Understand that pressing keys causes something interesting
to happen. - Begin recognizing letters and finding them on a physical
keyboard. - Feel safe exploring without fear of being wrong. - Receive
simple instructions using visuals and optional audio. - Enjoy short
sessions that can end naturally.

**Design implications** - Large, clear targets and simple screens. - One
instruction at a time. - Minimal reading required. - Gentle sounds and
immediate visual responses. - No timers, WPM scores, streak pressure, or
competitive ranking. - Free-exploration mode in which any key press can
produce a playful response.

### Secondary learner: developing typist (approximately ages 5--8)

**Needs** - Recognize and find letters reliably. - Build control and
begin learning finger positioning. - Practice short letter sequences,
words, and sentences. - See progress and earn meaningful unlocks.

### Older learner: confident typist (approximately ages 8--12)

**Needs** - Learn touch typing across the keyboard. - Improve accuracy,
rhythm, and speed. - Practice punctuation, capitalization, numbers, and
longer passages. - Understand strengths and areas for improvement.

### Advanced learner: teen or adult

**Needs** - Improve net speed, accuracy, consistency, and endurance. -
Practice real-world content such as prose, technical text, coding
snippets, or transcription. - Review error patterns and weak keys. -
Take repeatable assessments and track personal improvement.

### Parent or guardian

**Needs** - Set up and manage a child profile. - Understand progress
without turning it into pressure. - Control session duration, sound, and
age-appropriate options. - Keep the experience safe and free from
unwanted social contact or advertising. - See useful progress summaries
in plain language.

------------------------------------------------------------------------

## 4. Product scope and platform strategy

### Initial platform

The first release should be a **web-first application**, designed to run
comfortably in a desktop browser and on an Android tablet browser.

The product must explicitly plan for an **Android tablet app
experience**. Android tablet support is part of the product direction,
not an afterthought. The first milestone should validate the tablet
experience using a real Android tablet, including an external physical
keyboard. The product may begin as an installable web experience; a
dedicated Android app/package can be evaluated as a later delivery
milestone based on user needs and validation.

### Cross-device product requirements

-   Adapt layouts to tablet landscape and portrait orientations.
-   Prioritize landscape when a physical keyboard is connected, without
    making portrait unusable.
-   Make important controls comfortably tappable.
-   Support physical keyboard input reliably.
-   Prevent accidental page navigation or loss of progress during a
    lesson.
-   Provide clear recovery when focus leaves the typing area.
-   Support sound on/off and an easy way to replay spoken instructions.
-   Keep core learning available without an account.
-   Save progress locally and recover gracefully after a refresh or app
    restart.
-   Validate behavior on actual Android tablet hardware rather than
    relying only on desktop emulation.

### Product experience modes

1.  **Child experience:** Full, simple, playful learning interface.
2.  **Parent area:** Profile management, session controls, progress, and
    preferences.
3.  **Free exploration:** Safe, pressure-free keyboard discovery.
4.  **Guided learning:** Short activities with clear objectives.
5.  **Advanced practice:** A future mode for structured typing drills
    and assessments.

------------------------------------------------------------------------

## 5. Information architecture

The initial product should have a small, clear set of destinations:

-   **Home / World Map:** Resume the current activity and see the next
    suggested adventure.
-   **Explore:** Press keys freely and discover reactions.
-   **Play / Mission:** Complete a short guided activity.
-   **Collection:** View earned characters, items, stickers, or
    discoveries.
-   **My Progress:** A child-friendly view of recently learned skills.
-   **Parent Area:** Manage profile, session settings, sound, and
    progress.
-   **Settings:** Accessibility and experience preferences.

Do not expose every future mode at launch. Keep the child-facing
interface focused on a small number of understandable choices.

------------------------------------------------------------------------

## 6. Core learner journey

1.  A parent opens the application and creates a learner profile without
    needing an account.
2.  The child enters a welcoming home world and meets a friendly guide
    character.
3.  The child is invited to explore the keyboard or begin a simple
    mission.
4.  The game presents one clear target, such as finding a letter.
5.  The child presses a physical key.
6.  The application responds immediately with a visual and optional
    audio reaction.
7.  Correct responses progress the mission; incorrect responses receive
    gentle guidance without punishment.
8.  The game offers a small celebration when the child completes a
    learning milestone.
9.  Progress is saved automatically.
10. The child can continue exploring or finish the session naturally.
11. The parent can later review a simple summary of skills explored and
    progress observed.

The journey must remain usable for a child who cannot read instructions
independently.

------------------------------------------------------------------------

## 7. Functional requirements

Priority definitions: - **P0:** Required for the first playable
release. - **P1:** Important after the core loop is validated. - **P2:**
Later enhancement.

### 7.1 Learner profiles and entry

**FR-001 --- Local learner profile (P0)**\
A parent must be able to create a learner profile using a display name
or nickname and an optional avatar. No account should be required for
initial use.

**Acceptance criteria** - A learner can enter the experience after
profile creation without entering an email address. - The profile
persists across reloads and app restarts. - The product supports at
least one learner profile in the first release. - The product structure
should not prevent multiple profiles from being added later.

**FR-002 --- Age/experience onboarding (P0)**\
Onboarding should ask the parent to select a broad learning stage or
experience level, not require unnecessary personal information.

**Acceptance criteria** - The selected stage configures the initial
activity recommendations. - The parent can change the stage later. - The
product explains that the learner can progress at their own pace.

### 7.2 Keyboard exploration

**FR-003 --- Free exploration mode (P0)**\
The child can press keys on a physical keyboard and receive a playful
response.

**Acceptance criteria** - Recognized key presses produce an immediate
visual response. - Audio feedback can be disabled. - The activity does
not require correct answers or use a timer. - Repeated key presses do
not cause the experience to become stuck. - The child can exit
exploration easily.

**FR-004 --- On-screen keyboard (P0)**\
Show a visual representation of the relevant physical keyboard, with
keys that can be highlighted.

**Acceptance criteria** - The target key is visually distinct from other
keys. - The displayed keyboard remains legible on tablet and desktop
sizes. - Key highlighting does not rely on color alone. - The visual
layout matches the supported keyboard layout. - Physical key input is
the primary interaction for typing lessons; tapping a displayed key
should not falsely count as physical typing practice.

### 7.3 Guided letter mission

**FR-005 --- Find the letter (P0)**\
The game presents a letter and invites the child to find and press the
matching physical key.

**Acceptance criteria** - Only one primary target is presented at a time
for beginner mode. - The target is shown clearly and can optionally be
spoken aloud. - The game recognizes the intended key and gives immediate
feedback. - Incorrect input produces gentle guidance and lets the child
try again. - The child can replay the instruction. - No speed
requirement is imposed on beginner mode.

**FR-006 --- Beginner difficulty adjustment (P0)**\
The product should adjust assistance based on observed performance.

**Acceptance criteria** - The activity can provide stronger visual or
audio hints when the learner struggles. - Hints can be reduced after
repeated successful responses. - A single mistake never labels the
learner as failing or lowers their standing. - The parent can restart or
repeat a lesson.

### 7.4 First game loop

**FR-007 --- One complete playable mini-game (P0)**\
Include one polished, replayable game that uses key presses as its main
interaction. Recommended initial concept: a rocket, friendly creature,
or vehicle responds to finding target letters.

**Acceptance criteria** - The game has a clear start, objective,
interaction, completion state, and replay option. - It can be completed
by a beginner without reading a paragraph of instructions. - The
activity rewards learning and participation, not speed. - The game does
not require an internet connection once the required assets and app
resources are available offline. - The game can be replayed without
resetting the learner's overall progress.

**FR-008 --- Milestone reward (P0)**\
Completing a mission can unlock a small cosmetic item, sticker,
character reaction, or world detail.

**Acceptance criteria** - Rewards are predictable and linked to learning
milestones. - The child is not pressured to continue playing to protect
a streak or avoid losing rewards. - Rewards do not rely on gambling-like
random mechanics. - The child can return to the next activity without
navigating a complex menu.

### 7.5 Learning progress

**FR-009 --- Automatic progress saving (P0)**\
Save progress during and after activities.

**Acceptance criteria** - Completed activities remain completed after a
reload or restart. - Progress is not lost when the child returns to the
home screen. - If an activity is interrupted, the product recovers
gracefully. - The product clearly handles the absence of previous
progress.

**FR-010 --- Skill history (P0)**\
Record basic learning observations for each target key.

**Minimum tracked information** - Whether the key has been introduced. -
Number of attempts. - Successful and unsuccessful attempts. - Most
recent practice time. - A simple provisional mastery state.

**Acceptance criteria** - The product can distinguish a key that has
never been introduced from one that needs more practice. - The mastery
state is not determined solely by total attempts or time spent. - The
parent can view a basic summary. - Data remains local in the initial
release.

**FR-011 --- Child-friendly progress (P0)**\
Show progress through accessible visual milestones rather than dense
statistics.

**Acceptance criteria** - The child can understand what they have
discovered or unlocked. - Progress language is encouraging and
neutral. - No WPM score, ranking, or speed comparison is shown in the
early-childhood experience.

### 7.6 Parent area

**FR-012 --- Parent controls (P0)**\
Provide an adult-oriented area for session settings and progress review.

**Acceptance criteria** - The parent can toggle sound. - The parent can
set a reasonable session reminder or limit. - The parent can review keys
introduced and recent activities. - The child should not accidentally
enter destructive settings through ordinary gameplay. - The parent area
is separated from the main child flow with a simple adult-oriented gate.

**FR-013 --- Reset and data controls (P1)**\
Provide a clear way for a parent to reset a profile or clear its
progress, with confirmation before destructive action.

### 7.7 Tablet and physical keyboard support

**FR-014 --- Responsive tablet experience (P0)**\
The experience must be usable on an Android tablet and desktop browser.

**Acceptance criteria** - Primary controls remain visible and tappable
on supported tablet sizes. - Text, prompts, and keyboard keys are
legible without zooming. - Layout does not break when the tablet
orientation changes. - The product is tested on a real Android tablet. -
No essential activity depends on a mouse hover.

**FR-015 --- External physical keyboard (P0)**\
Typing activities must accept real keyboard input on an Android tablet
connected to an external keyboard.

**Acceptance criteria** - Target keys can be pressed and recognized
reliably. - Input focus is obvious and recoverable. - Browser shortcuts
and system keys are handled safely; the product must not interfere with
essential device controls. - The lesson can continue after the user
briefly switches focus away and back. - Physical keyboard input is
tested on the target Android browser/device combination.

**FR-016 --- Installable experience and Android app direction (P1)**\
The product should be designed so the web experience can be installed
where supported, and the product roadmap must evaluate a dedicated
Android tablet app or package.

**Acceptance criteria** - Installation and launch behavior are
documented and tested on supported Android devices. - The team records
any gaps between browser/PWA behavior and the desired tablet app
experience. - The product owner can make a later decision about a
dedicated Android app based on real usage and capability gaps. - The
first release must not be blocked by delivering a dedicated native
Android package if the installable web experience meets the validated
needs.

### 7.8 Accessibility, comfort, and safety

**FR-017 --- Sensory controls (P0)**\
Allow audio to be disabled and avoid relying on sound alone to
communicate success or failure.

**FR-018 --- Low-pressure experience (P0)**\
The early-childhood mode must not include countdown timers, punitive
error sounds, lost lives, public rankings, or failure messaging.

**FR-019 --- Child privacy (P0)**\
The initial release should collect as little personal information as
possible.

**Acceptance criteria** - No account or email is required for core
use. - No public profile, public chat, targeted advertising, or social
sharing is included. - The product does not request precise location or
unnecessary personal details. - Any future data collection or cloud
synchronization requires a separate product and privacy review.

**FR-020 --- Session comfort (P0)**\
Sessions should be short and easy to end. The application may gently
suggest a break but should not guilt the child for stopping.

### 7.9 Future curriculum and advanced training

The following are future requirements and should not delay the first
playable release.

**FR-021 --- Structured curriculum (P1)**\
Introduce home-row learning, finger positioning, upper/lower rows,
capitalization, punctuation, numbers, common words, and sentences in a
sensible sequence.

**FR-022 --- Adaptive practice (P1)**\
Reintroduce difficult keys more often, mix mastered keys into later
exercises, and periodically check retention.

**FR-023 --- Touch-typing guidance (P1)**\
Offer optional visual finger guidance and progressively reduce it as
technique improves.

**FR-024 --- Speed and accuracy mode (P1)**\
For learners who are ready, offer timed practice and meaningful metrics
such as net WPM, accuracy, and consistency. This mode must be opt-in and
separate from early-childhood learning.

**FR-025 --- Advanced content (P2)**\
Offer configurable practice using longer passages, numbers, symbols,
punctuation, technical text, coding snippets, and transcription.

**FR-026 --- Assessments and personal bests (P2)**\
Provide repeatable tests and personal progress comparisons. Any
competitive features should remain optional and privacy-conscious.

------------------------------------------------------------------------

## 8. Learning progression model

Use skill-based progression rather than fixed age gates. The suggested
ages below are guidance, not promises or restrictions.

### Stage A --- Keyboard Explorer

**Typical audience:** Ages 4--5\
**Objectives:** Explore cause and effect, notice letters, find a
displayed letter, and become comfortable with the keyboard.

-   Free exploration.
-   Single-letter recognition.
-   Simple visual and optional audio hints.
-   No timers, WPM, streak pressure, or finger-position demands.

### Stage B --- Letter Adventurer

**Typical audience:** Ages 5--6\
**Objectives:** Recall letter locations and type short sequences.

-   Introduce letters gradually.
-   Mix familiar and new letters.
-   Practice simple sequences and selected words.
-   Begin gentle finger-awareness activities when appropriate.

### Stage C --- Typing Apprentice

**Typical audience:** Ages 6--8\
**Objectives:** Build touch-typing habits, accuracy, and fluency.

-   Home row and finger zones.
-   Full alphabet and basic punctuation.
-   Short words and sentences.
-   Gentle accuracy feedback.

### Stage D --- Typing Champion

**Typical audience:** Ages 8--12\
**Objectives:** Improve accuracy, speed, rhythm, and real-world typing.

-   Longer passages and timed options.
-   Numbers, capitalization, and punctuation.
-   Personal bests and progress history.
-   Optional challenges without public comparison.

### Stage E --- Advanced Typist

**Typical audience:** Teens and adults\
**Objectives:** Build efficient, reliable typing performance for real
tasks.

-   Net WPM and accuracy assessment.
-   Error-pattern analysis and weak-key drills.
-   Endurance and consistency practice.
-   Technical text, coding, transcription, and configurable content.

A learner may repeat, skip, or revisit activities. Do not unlock the
next stage based only on age or total play time.

------------------------------------------------------------------------

## 9. Adaptive learning and mastery rules

The initial product should use understandable, rule-based adaptation.
The product does not need an AI tutor.

For each key or skill, consider: - Exposure: has the learner seen the
target before? - Recognition: can the learner find the correct key? -
Accuracy: how often is the intended key pressed? - Assistance: did the
learner need hints? - Recency: how recently was the skill practiced? -
Retention: can the learner perform it again in a later session?

### Behavioral rules

-   Introduce a small number of new targets at a time.
-   Mix recently learned targets with familiar ones.
-   Offer a hint after repeated difficulty rather than repeating the
    same prompt indefinitely.
-   Reduce hints only after consistent success.
-   Revisit skills after a delay to check retention.
-   Avoid treating response speed as the primary indicator for young
    learners.
-   Make mastery thresholds configurable and avoid presenting
    provisional scores as scientific assessments.
-   Never punish a learner for forgetting a previously practiced key.

------------------------------------------------------------------------

## 10. Game design and content principles

### World and character direction

The recommended starting theme is a friendly adventure world with a
guide character and one simple mission. Possible future worlds include a
forest, ocean, dinosaur island, space station, and futuristic city.

### Reward design

-   Reward learning milestones, exploration, and persistence.
-   Use collectibles, stickers, character reactions, and world changes.
-   Make reward rules understandable and predictable.
-   Do not remove earned items for inactivity.
-   Do not use manipulative streaks, loot-box mechanics, or pressure to
    keep playing.

### Feedback language

Prefer: - "You found it!" - "Let's try another key." - "Would you like a
hint?" - "Great exploring." - "Ready for another adventure, or shall we
stop?"

Avoid: - "You failed." - "Wrong again!" - "You're too slow." - "Don't
lose your streak." - Any message that compares a young child negatively
with others.

### Content requirements

-   The initial experience should require minimal reading.
-   Instructions should be short and concrete.
-   Audio is optional and repeatable.
-   Animations should be delightful but brief enough not to obstruct
    learning.
-   The product should not require the child to understand a complicated
    narrative to complete an activity.

------------------------------------------------------------------------

## 11. UX and visual design requirements

-   Use a warm, friendly, high-quality visual style rather than a
    cluttered dashboard.
-   Give each screen one primary objective.
-   Use large targets, clear contrast, readable typography, and generous
    spacing.
-   Keep the keyboard and target letter visually prominent during typing
    tasks.
-   Make feedback immediate and understandable.
-   Avoid excessive animation, visual noise, and competing calls to
    action.
-   Ensure interactions work with a physical keyboard and touch input
    where appropriate.
-   Do not require hover interactions.
-   Provide a visible way to pause, return home, and end a session.
-   Use consistent icon meanings and labels.
-   Keep parent-facing settings visually distinct from child-facing
    gameplay.
-   Support reduced motion or a calmer visual mode as the product
    matures.

------------------------------------------------------------------------

## 12. Success metrics

The initial goal is to validate learning and usability, not maximize
screen time.

### Product usability

-   Can a child start the first activity with minimal adult explanation?
-   Can the child understand the target and identify the corresponding
    physical key?
-   Does the core activity work reliably on desktop and Android tablet?
-   Can the parent create a profile and find the progress summary?

### Learning signals

-   Percentage of introduced keys successfully found in guided
    activities.
-   Change in accuracy over repeated attempts.
-   Number of keys recalled in a later session.
-   Reduction in required hints for familiar targets.
-   Ability to transfer a learned key into a different activity.

### Engagement quality

-   Voluntary return to the activity on another day.
-   Completion of a short mission without frustration.
-   Parent feedback on whether the experience feels enjoyable and
    appropriate.
-   Whether the child chooses to explore or repeat an activity
    willingly.

### Safety and quality

-   No loss of saved progress in normal use.
-   No critical keyboard-input failures on supported devices.
-   No unexpected exposure to external social content or advertising.
-   Session duration remains parent-controlled and age-appropriate.

Do not optimize for longest session time, number of clicks, or streak
length.

------------------------------------------------------------------------

## 13. Release plan

### Milestone 1 --- First delightful playable experience (P0)

Deliver: - A welcoming home screen. - One local learner profile. -
Keyboard exploration. - On-screen keyboard highlighting. -
Find-the-letter mission. - One polished mini-game. - Basic learning
observations and local persistence. - Simple parent controls and
progress view. - Sound controls. - Responsive desktop and Android tablet
browser experience. - Physical keyboard support on an actual Android
tablet. - Basic offline operation after the experience has been loaded
and cached.

**Exit criteria:** A young child can start, play, complete, and replay
the activity with minimal adult help; progress survives a restart; and
the core interaction works on the target tablet and physical keyboard.

### Milestone 2 --- Learning foundation (P1)

Deliver: - More letters and short sequences. - Improved adaptive
hints. - A small structured curriculum. - Additional rewards and
unlocks. - Multiple profiles if needed. - Better parent progress
summaries. - Installable web experience on supported devices. -
Evaluation of Android tablet app packaging and any gaps.

**Exit criteria:** The product can guide a learner through a coherent
set of skills and recall earlier skills in later sessions.

### Milestone 3 --- Touch typing and fluency (P1)

Deliver: - Home-row and finger guidance. - Full keyboard curriculum. -
Words and sentences. - Accuracy-focused practice. - Retention checks. -
Optional timed practice for appropriate learners.

### Milestone 4 --- Advanced and professional training (P2)

Deliver: - Advanced assessments. - Net WPM, accuracy, consistency, and
endurance tracking. - Longer passages and configurable practice
content. - Technical, coding, and transcription tracks. - Optional
cross-device synchronization if user demand justifies it.

------------------------------------------------------------------------

## 14. Risks and mitigations

**Risk: The product is too complex for a four-year-old.**\
Mitigation: One instruction per screen, minimal reading, short
activities, and early observation with a real child.

**Risk: Rewards overshadow learning.**\
Mitigation: Tie rewards to meaningful milestones and ensure the core
activity remains enjoyable without rewards.

**Risk: Speed metrics create pressure too early.**\
Mitigation: Hide speed measures in early-childhood mode and introduce
them only in an appropriate, opt-in stage.

**Risk: Tablet browser keyboard input differs across devices.**\
Mitigation: Test with a real Android tablet and physical keyboard during
the first milestone. Document device/browser limitations and decide
later whether a dedicated Android app is warranted.

**Risk: The app becomes a collection of disconnected mini-games.**\
Mitigation: Keep a shared skill model and ensure every game contributes
to the same learning progression.

**Risk: Progress is lost.**\
Mitigation: Save automatically, test reload/restart scenarios, and
provide clear reset and recovery behavior.

**Risk: Children are encouraged to spend too much time in the app.**\
Mitigation: Short sessions, parent controls, easy stopping, no
manipulative streaks, and no rewards lost through inactivity.

**Risk: The scope expands before the core idea is validated.**\
Mitigation: Do not build multiple worlds, advanced analytics, accounts,
or a professional curriculum before the first game loop works well.

------------------------------------------------------------------------

## 15. Definition of done for the first release

The first release is ready for family testing when all of the following
are true:

-   A parent can create and enter a learner profile without creating an
    account.
-   A child can explore the keyboard and receive immediate, friendly
    feedback.
-   A child can complete a find-the-letter activity using a physical
    keyboard.
-   At least one complete mini-game is playable and replayable.
-   Incorrect inputs are handled gently and never block the child from
    continuing.
-   Progress is saved locally and persists after reload/restart.
-   The parent can toggle sound, review basic progress, and safely end a
    session.
-   The experience is usable on desktop and an Android tablet.
-   Physical keyboard input is tested on an actual Android tablet.
-   The child-facing experience does not display WPM, leaderboards,
    punitive timers, or streak pressure.
-   Core activity resources are available offline after initial caching,
    with understandable behavior if a resource is unavailable.
-   There are no critical blockers in the primary learner journey.

------------------------------------------------------------------------

## 16. Instructions for the implementation assistant

Treat this PRD as the product source of truth.

1.  Prioritize the first playable release and its definition of done.
2.  Do not attempt to build all future stages in the first iteration.
3.  Do not introduce unrequested product features that increase
    complexity or compromise child safety.
4.  Do not choose implementation details based on assumptions in this
    document; make reasonable implementation decisions while preserving
    the stated product outcomes.
5.  If a product decision is ambiguous, prefer the simpler, safer, more
    child-friendly option and document the decision.
6.  Keep the learning model separate conceptually from individual games
    so future experiences can reuse the same skills.
7.  Test the complete learner journey, progress persistence, keyboard
    input, and responsive behavior.
8.  Treat Android tablet compatibility with an external physical
    keyboard as an explicit requirement.
9.  Before considering the first milestone complete, provide a concise
    summary of what works, what has been tested, and what remains
    incomplete.
10. Do not claim a feature is complete merely because a screen exists;
    it must perform the behavior specified in its acceptance criteria.

------------------------------------------------------------------------

## 17. Open product questions for later

These questions should not block the first playable release unless a
choice is essential to implementation:

-   Which character and world theme resonates most with the child?
-   Should the default audio use spoken letter names, phonetic sounds,
    or offer both?
-   Which keyboard layouts should be supported first?
-   Should the product eventually include Hindi or other language
    curricula?
-   Is cloud synchronization important for the intended family use?
-   What specific gaps, if any, would justify a dedicated Android app
    instead of an installable web experience?
-   Which advanced practice tracks are most valuable: general typing,
    schoolwork, coding, transcription, or all of these?

**End of PRD**
