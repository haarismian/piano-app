# Comp — piano for accompanying singers

A single-user practice app that turns "I want to comp for singers" into a numbered
list of things to do at the piano today.

Open `index.html` in a browser. That's it — no build, no install, no server, no
accounts. Progress is stored in the browser's `localStorage`.

## What it does

**Tells you exactly what to practise.** Pick a length (5 to 45 minutes) and press
start. You get a numbered list of steps with literal instructions, the chord
shapes drawn on a keyboard, a target for each one ("done when…"), a timer and a
metronome. Work down the list. Stop whenever — nothing is lost.

**Progresses linearly.** 25 units across 6 stages, in order. Each unit has one
objective, a handful of exercises and a checkpoint with concrete criteria.
Passing the checkpoint unlocks the next unit. You always know what unit you're on
and what step comes next — the header says so on every screen.

**Adapts to the time you have.** A session is built from four blocks — warm-up,
core work on the current unit, spaced review of earlier units, and applying it —
and scales to fit. Short sessions drop blocks from the bottom, so a 5-minute
session is still a warm-up plus the thing you're actually meant to be learning.
Consecutive sessions rotate through a unit's exercises so you cover all of it.

## The curriculum

Built around what accompanying a singer actually demands, rather than general
piano study. The through-line is: shapes → time → keys → colour → the singer.

| Stage | Units | What you come out able to do |
|---|---|---|
| 1. Chord Foundations | 1–5 | Play the chords of a key from memory, voice-led, both hands |
| 2. Rhythm and Groove | 6–10 | Comp in time with four distinct density levels |
| 3. Keys and Numbers | 11–14 | Think in numbers; play a progression in any of 12 keys on demand |
| 4. Richer Harmony | 15–18 | Sevenths, sus/add9/slash chords, shell voicings, 2-5-1 |
| 5. Working With a Singer | 19–22 | Intros, endings, following rubato, finding their key, arranging |
| 6. Repertoire and Fluency | 23–25 | Blues/AABA/pop forms, sight-reading charts, a five-song set |

Stage 3 is the one that makes you useful. Learning progressions as numbers rather
than letters is what lets you answer "can we take it down a step?" without
starting over.

## Tabs

- **Today** — the session runner. Numbered steps, instructions, keyboards, timer.
- **Path** — all 25 units with objectives, exercises, rep counts and checkpoints.
  Pass a checkpoint here to advance; reopen a passed unit to go back and drill it.
- **Reference** — key explorer (every chord in a key, triads or sevenths), a
  progression transposed into all 12 keys, chord lookup with every inversion and
  shell/rootless voicings, plus the practice tools (random chord caller,
  cold-call key drill, number drill, metronome).
- **Progress** — sessions, minutes, streak, checkpoints, your notes, and
  export/import of your data.

Every chord diagram has a ▶ button that plays it, so you can check yourself.
Blue keys are the left hand, orange the right.

## Keyboard shortcuts

- `m` — open / toggle the metronome
- `n` — mark the current step done and move to the next

## Notes

- Progress lives in this browser only. Use **Progress → Export** before clearing
  site data or moving to another device.
- Checkpoints are self-assessed. The criteria are specific on purpose — passing
  one you can't actually do makes the next unit harder, not easier.
- Rep counts are guidance, not gates. If you genuinely meet every checkpoint
  criterion, pass it and move on.

## Layout

```
index.html         app shell
css/style.css      styles (follows your system light/dark setting)
js/theory.js       note spelling, chords, voicings, keys, transposition
js/keyboard.js     SVG keyboard renderer
js/audio.js        WebAudio chord playback and metronome
js/curriculum.js   the syllabus: 6 stages, 25 units, 100 exercises
js/store.js        progress in localStorage
js/session.js      session builder
js/app.js          views and interaction
```

Plain ES5-era JavaScript with classic `<script>` tags and no dependencies,
so it runs from `file://` as happily as from a web server.
