/* curriculum.js — the syllabus.

   Each exercise step is { do, note }:
     do    the terse cue you read at the piano, mid-playing
     note  the explanation, shown while the exercise is new and on request
   A step may also be a plain string when it needs no explanation.

   Text is a template filled against the exercise's current key — {{1}} is the
   triad on degree 1, {{5:7}} the seventh on degree 5, {{key}} the key name —
   so `vary` lets the same drill come back in a different key rather than
   identically. See Theory.fill.
*/
(function (global) {
  'use strict';

  // Key rotations, roughly ordered by how hard they sit under the hand.
  var EASY = ['C', 'G', 'F'];
  var MID = ['C', 'G', 'F', 'D', 'Bb'];
  var WIDE = ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb'];
  var ALL12 = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

  var STAGES = [

  // ================================================================ STAGE 1
  { id: 's1', title: 'Chord Foundations',
    blurb: 'Get the shapes into your hands so you never hunt for a chord again.',
    units: [

    { id: 'u1', title: 'Hand shape and your first three chords',
      goal: 'Play the 1, 4 and 5 major triads in root position, hands separately, without looking at the keys.',
      why: 'Almost every song a singer brings you is built from three or four chords. These three are the spine of a key, and the shape is the same in all 12.',
      keys: ['C'],
      exercises: [
        { id: 'u1e1', title: 'Bench setup and hand arch', type: 'warmup', role: 'warmup', minutes: 2,
          vary: EASY,
          steps: [
            { do: 'Elbows level with the keys, feet flat.',
              note: 'Sit so your elbows are level with, or a touch above, the white keys.' },
            { do: 'Right hand 1-2-3-4-5 on five notes from {{key}}.',
              note: 'Curve the fingers like you are holding a tennis ball — knuckles up, not collapsed.' },
            { do: 'One note per second, dropping arm weight in.',
              note: 'Let the weight of the arm fall into the key rather than pressing with the finger alone.' },
            { do: 'Repeat an octave lower with the left hand.' }
          ],
          target: 'Every note speaks evenly. No collapsed knuckles, no wrist below the key bed.' },

        { id: 'u1e2', title: 'Build the three majors', type: 'technique', role: 'core', minutes: 4,
          vary: EASY,
          steps: [
            { do: 'Root, skip a letter, skip a letter.',
              note: 'That is a major triad. In {{key}}: {{1}}, {{4}} and {{5}} are the three you want.' },
            { do: 'Play {{1}} five times, saying the notes aloud.',
              note: 'Right hand, fingers 1-3-5. Lift the whole hand off between each one.' },
            { do: 'Same for {{4}}, then {{5}}.' },
            { do: 'Cycle {{1}} - {{4}} - {{5}} - {{1}} four times, not looking down.' }
          ],
          target: 'You can land each chord blind, all three notes together, no rolling.',
          show: { numbers: '1 4 5' } },

        { id: 'u1e3', title: 'Blind landing drill', type: 'technique', role: 'core', minutes: 3,
          vary: EASY,
          steps: [
            'Look at the ceiling, not your hands.',
            { do: 'Call a chord from {{1}} / {{4}} / {{5}} at random, then play it.' },
            { do: 'Missed it? Feel for the black-key groups to re-orient.',
              note: 'The groups of two and three black keys are your map. Never look down to find them.' },
            'Do 20 landings.'
          ],
          target: '17 out of 20 landed correctly without looking.',
          show: { numbers: '1 4 5' },
          tool: 'random-chord' },

        { id: 'u1e4', title: 'Left hand roots', type: 'technique', role: 'core', minutes: 3,
          vary: EASY,
          steps: [
            { do: 'Left hand, finger 5 on the {{key}} below middle C.' },
            { do: 'Play the single roots of {{1}}, {{4}}, {{5}}.',
              note: 'Use finger 5 for the tonic, 2 and 1 for the others, or simply shift the hand.' },
            { do: 'One root per beat: 1 1 4 4 5 5 1 1.' }
          ],
          target: 'Roots land on time with no hesitation between them.',
          show: { numbers: '1 4 5', hand: 'L', octave: 2 } }
      ],
      checkpoint: { title: 'Three chords, blind',
        criteria: [
          'Play the 1, 4 and 5 chords in the right hand, root position, without looking, 18/20 correct.',
          'Say the three notes of each chord out loud correctly.',
          'Play the left-hand roots on beat with no searching.'
        ] } },

    { id: 'u2', title: 'The minor three and the family of a key',
      goal: 'Play all six workhorse chords of a major key from memory, any order, within two seconds each.',
      why: 'A huge share of pop, folk, worship and singer-songwriter material never leaves these six chords. Owning them in one key means you can already comp hundreds of songs.',
      keys: ['C', 'G', 'F'],
      exercises: [
        { id: 'u2e1', title: 'Warm-up: 1 4 5 round', type: 'warmup', role: 'warmup', minutes: 2,
          vary: EASY,
          steps: [
            'Right hand: {{1}} - {{4}} - {{5}} - {{1}}, twice.',
            'Left hand roots along with it.',
            'Once more, eyes closed.'
          ],
          target: 'Clean, no hunting.',
          show: { numbers: '1 4 5' } },

        { id: 'u2e2', title: 'Minor is one note lower', type: 'technique', role: 'core', minutes: 4,
          vary: EASY,
          steps: [
            { do: 'Play {{1}}, then lower its middle note one key.',
              note: 'That is the minor version. The middle note is the only difference between major and minor.' },
            { do: 'Build {{2}}, {{3}} and {{6}} the same way.',
              note: 'In {{key}} these are the three minor chords of the family.' },
            'Play each five times, saying the notes aloud.',
            { do: 'Alternate {{1}} - {{6}} - {{4}} - {{2}} - {{5}} - {{3}} - {{1}}.',
              note: 'Listen for the mood flip as you pass between each major and minor.' }
          ],
          target: 'You can hear the difference and name which is which with your eyes closed.',
          show: { numbers: '2 3 6' } },

        { id: 'u2e3', title: 'The six-chord random drill', type: 'technique', role: 'core', minutes: 4,
          vary: MID,
          steps: [
            { do: 'Pool: {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}}.' },
            'Use the chord caller below. Land each one within two seconds.',
            'Left hand plays the root at the same time.',
            '24 calls.'
          ],
          target: '22/24 landed within two seconds, both hands.',
          show: { numbers: '1 2 3 4 5 6' },
          tool: 'random-chord' },

        { id: 'u2e4', title: 'First real progression: 1 5 6 4', type: 'song', role: 'apply', minutes: 4,
          vary: MID,
          steps: [
            { do: 'In {{key}}: {{1}} - {{5}} - {{6}} - {{4}}.',
              note: 'This progression is the engine of a hundred pop songs.' },
            'Two beats per chord, left hand root, right hand triad. Slow.',
            { do: 'Then four beats each, humming any melody over it.',
              note: 'Badly is fine — the point is splitting your attention between hands and voice.' },
            { do: 'Loop eight times without stopping.',
              note: 'If you stumble, keep going in time. Never stop to fix.' }
          ],
          target: 'Eight loops with no stops. Stumbles are allowed, stopping is not.',
          show: { numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'The family of a key',
        criteria: [
          'Name and play all six workhorse chords of C major on demand, under two seconds each.',
          'Play 1 - 5 - 6 - 4 for eight loops with both hands, no stopping.',
          'Tell major from minor by ear, 8 out of 10.'
        ] } },

    { id: 'u3', title: 'Inversions: three ways to play every chord',
      goal: 'Play every chord in a key in root position, 1st and 2nd inversion, and name which is which.',
      why: 'Root position only is what makes a beginner sound like one — the hand leaps and the chords sit low and blocky. Inversions keep you in one small area and sound smooth.',
      keys: ['C', 'G', 'F'],
      exercises: [
        { id: 'u3e1', title: 'Warm-up: six-chord round', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['Play {{1}} {{2}} {{3}} {{4}} {{5}} {{6}} in order, two beats each, both hands.', 'Then backwards.'],
          target: 'No hesitation.',
          show: { numbers: '1 2 3 4 5 6' } },

        { id: 'u3e2', title: 'Move the bottom note to the top', type: 'technique', role: 'core', minutes: 5,
          vary: EASY,
          steps: [
            { do: 'Play {{1}}. Move its bottom note up an octave.',
              note: 'That is 1st inversion — the 3rd of the chord is now the lowest note.' },
            { do: 'Do it again to reach 2nd inversion.',
              note: 'Now the 5th is on the bottom. Once more and you are back where you started, an octave up.' },
            'Climb this ladder up two octaves and back down, right hand, then left.',
            'Repeat on {{4}} and {{5}}.'
          ],
          target: 'You can climb and descend the inversion ladder smoothly on the 1, 4 and 5 chords.',
          show: { chords: ['{{1}}', '{{1}}', '{{1}}'], inversions: [0, 1, 2] } },

        { id: 'u3e3', title: 'Name that inversion', type: 'theory', role: 'core', minutes: 3,
          vary: MID,
          steps: [
            { do: 'The lowest chord tone names the inversion.',
              note: 'Root on the bottom = root position. 3rd on the bottom = 1st inversion. 5th on the bottom = 2nd inversion.' },
            'Play a random chord from {{key}} in a random inversion.',
            'Before looking, say which inversion it is and what note is on top.',
            'Twelve reps.'
          ],
          target: '10/12 correctly identified.' },

        { id: 'u3e4', title: 'Closest-shape drill', type: 'technique', role: 'core', minutes: 4,
          vary: EASY,
          steps: [
            'Play {{1}} in root position.',
            { do: 'Find the {{4}} nearest your hand, not the one below it.',
              note: 'Instead of jumping down, use the inversion of {{4}} closest to where your hand already sits.' },
            { do: 'Then the nearest {{5}}.' },
            { do: 'Play {{1}} - {{4}} - {{5}} - {{1}} with your hand barely moving.' }
          ],
          target: 'Your hand stays within a five-note span for the whole progression.',
          show: { chords: ['{{1}}', '{{4}}/{{key}}', '{{5}}', '{{1}}'] } }
      ],
      checkpoint: { title: 'Inversions on demand',
        criteria: [
          'Play any chord in the key in any of its three positions when called.',
          'Climb the inversion ladder up and down two octaves on the 1, 4 and 5 chords.',
          'Play 1 - 4 - 5 - 1 with the hand staying inside one five-note span.'
        ] } },

    { id: 'u4', title: 'Voice leading: stop jumping',
      goal: 'Play 1-5-6-4 and 1-6-4-5 with nearest-note motion — no hand jumps larger than a third.',
      why: 'Smooth voice leading is the single biggest sound upgrade available to you, and it lets you comp quietly under a singer without the accompaniment jumping about.',
      keys: ['C', 'G', 'F'],
      exercises: [
        { id: 'u4e1', title: 'Warm-up: inversion ladder', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['Climb the inversion ladder on {{1}}, then {{4}}, then {{5}}, up and back.'],
          target: 'Even and smooth.' },

        { id: 'u4e2', title: 'Common-tone rule', type: 'technique', role: 'core', minutes: 5,
          vary: EASY,
          steps: [
            { do: 'Shared notes stay put. Everything else moves to the nearest note.',
              note: 'That one rule is the whole of voice leading.' },
            { do: '{{1}} to {{6}}: two notes are shared.',
              note: 'Keep them where they are and let the remaining note step up to the nearest tone of {{6}}.' },
            'Work out {{6}} to {{4}}, and {{4}} back to {{1}}, the same way.',
            'Play {{1}} - {{6}} - {{4}} - {{1}} slowly, checking each move against the rule.'
          ],
          target: 'You can state which notes are shared at each change before you play it.',
          show: { chords: ['{{1}}', '{{6}}/{{key}}', '{{4}}/{{key}}', '{{1}}'] } },

        { id: 'u4e3', title: '1-5-6-4 voice-led, both hands', type: 'technique', role: 'core', minutes: 5,
          vary: MID, bpm: { start: 60, goal: 80 },
          steps: [
            { do: 'Right hand: voice-led {{1}} - {{5}} - {{6}} - {{4}}.',
              note: 'Use the nearest inversion each time, so the hand stays in one place.' },
            { do: 'Left hand plays the real root each time, low.',
              note: 'The left hand names the chord; the right hand just colours it.' },
            'Four beats per chord at 60 bpm, then two beats per chord.',
            'Loop eight times without stopping.'
          ],
          target: 'Eight clean loops at 70 bpm, right hand inside one span, left hand on the roots.',
          show: { numbers: '1 5 6 4' } },

        { id: 'u4e4', title: '1-6-4-5 (the doo-wop turn)', type: 'song', role: 'apply', minutes: 4,
          vary: MID, bpm: { start: 60, goal: 80 },
          steps: [
            '{{1}} - {{6}} - {{4}} - {{5}}, voice-led the same way.',
            'Four beats each, then two beats each.',
            { do: 'Hum a melody over it.',
              note: 'Notice how the {{5}} at the end pulls you back to {{1}}.' }
          ],
          target: 'Eight loops at 70 bpm without stopping.',
          show: { numbers: '1 6 4 5' } }
      ],
      checkpoint: { title: 'Smooth changes',
        criteria: [
          'Play 1-5-6-4 voice-led, both hands, 8 loops at 70 bpm with no stops.',
          'Play 1-6-4-5 the same way.',
          'Explain out loud which notes are shared between any two chords in the key.'
        ] } },

    { id: 'u5', title: 'Two hands, one groove',
      goal: 'Left hand root or root-fifth, right hand voice-led triad, steady against a metronome at 80 bpm.',
      why: 'This is the working posture of an accompanist: the left hand owns the harmony floor, the right hand owns the texture. Everything later sits on top of it.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u5e1', title: 'Warm-up: voice-led 1-5-6-4', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['Two loops of {{1}} - {{5}} - {{6}} - {{4}}, voice-led, both hands, slow.'],
          target: 'Smooth.',
          show: { numbers: '1 5 6 4' } },

        { id: 'u5e2', title: 'Root and root-fifth in the left hand', type: 'technique', role: 'core', minutes: 4,
          vary: MID,
          steps: [
            { do: 'Left hand: root alone, then root with the fifth above it.',
              note: 'Fingers 5 and 1. The root-fifth shape is a fuller, more stable floor than the root alone.' },
            'Play those shapes under 1-5-6-4 in {{key}}.',
            { do: 'Nothing but roots and fifths below the bass stave.',
              note: 'Three-note chords turn to mud down there. Keep full triads above it.' }
          ],
          target: 'Left hand root-fifth shapes on all four chords, no mud.',
          show: { numbers: '1 5 6 4', hand: 'L', octave: 2 } },

        { id: 'u5e3', title: 'Metronome lock-in', type: 'groove', role: 'core', minutes: 5,
          vary: MID, bpm: { start: 70, goal: 90 },
          steps: [
            'Metronome at 70. One chord per bar, played on beat 1, held for four.',
            { do: 'Aim to make the click disappear underneath your chord.',
              note: 'If you cannot hear the click on beat 1, you are exactly on it.' },
            'Move to 80, then try one chord per two beats.',
            'Four minutes without stopping the metronome, whatever happens.'
          ],
          target: 'You land on beat 1 consistently at 80 bpm and can feel when you rush.',
          tool: 'metronome' },

        { id: 'u5e4', title: 'Same groove, new key', type: 'keys', role: 'apply', minutes: 4,
          vary: WIDE, bpm: { start: 60, goal: 80 },
          steps: [
            { do: 'Key of {{key}}. The six chords: {{1}} {{2}} {{3}} {{4}} {{5}} {{6}}.' },
            '1-5-6-4 here is {{1}} - {{5}} - {{6}} - {{4}}.',
            'Voice-lead it, both hands, four beats each at 70 bpm.',
            'Loop eight times.'
          ],
          target: 'Eight loops in the new key at 70 bpm.',
          show: { numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'Stage 1 exit — the working posture',
        criteria: [
          'Play 1-5-6-4 in two keys, voice-led, left hand root-fifth, 8 loops at 80 bpm with a metronome.',
          'Play 1-6-4-5 at 80 bpm.',
          'Name every chord in the keys of C and G on demand.'
        ] } }
    ] },

  // ================================================================ STAGE 2
  { id: 's2', title: 'Rhythm and Groove',
    blurb: 'Chords are not music until they have a pulse. This is where you start to sound like an accompanist.',
    units: [

    { id: 'u6', title: 'Counting out loud and the steady quarter',
      goal: 'Comp 1-5-6-4 in quarter notes at 90 bpm while counting "1 2 3 4" out loud, without losing either.',
      why: 'A singer will forgive a wrong chord. They will not forgive unsteady time — they are relying on you for it. Counting out loud makes your time external and reliable.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u6e1', title: 'Warm-up: hands together', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['One loop of 1-5-6-4 in {{key}}, voice-led, slow.', 'Then the same backwards: {{4}} {{6}} {{5}} {{1}}.'],
          target: 'Clean.' },

        { id: 'u6e2', title: 'Count out loud, play on every beat', type: 'groove', role: 'core', minutes: 5,
          vary: MID, bpm: { start: 70, goal: 90 }, tool: 'metronome',
          steps: [
            'Metronome at 70. Count "1 2 3 4" out loud for four bars before playing.',
            { do: 'Right hand on every beat, left hand on beat 1 only.',
              note: 'Keep counting out loud at conversational volume the whole time.' },
            'One chord per bar: {{1}} / {{5}} / {{6}} / {{4}}.',
            { do: 'Counting stops, you restart.',
              note: 'Losing the count is the failure condition, not a wrong chord. Build to 90 bpm.' }
          ],
          target: 'Four minutes at 90 bpm with the counting never dropping out.',
          show: { numbers: '1 5 6 4' } },

        { id: 'u6e3', title: 'Half-bar changes', type: 'groove', role: 'core', minutes: 4,
          vary: MID, bpm: { start: 80, goal: 100 }, tool: 'metronome',
          steps: [
            'Same drill, but change chord every two beats.',
            'Left hand root on each change, right hand on every beat.',
            '80 bpm, then 90.'
          ],
          target: 'Chord changes land exactly on 1 and 3, no early or late.' },

        { id: 'u6e4', title: 'Where is beat 1?', type: 'ear', role: 'apply', minutes: 3,
          steps: [
            'Put on any pop song you like.',
            'Clap only on beat 1 of each bar for a full minute.',
            'Then clap on 2 and 4 — the backbeat — for a minute.',
            'Then play a single root note on beat 1 along with the track.'
          ],
          target: 'You can find and hold beat 1 in a song you have never analysed.' }
      ],
      checkpoint: { title: 'Reliable time',
        criteria: [
          'Comp 1-5-6-4 in quarters at 90 bpm counting out loud, four minutes, no dropouts.',
          'Change chords cleanly on beats 1 and 3 at 90 bpm.',
          'Find beat 1 in an unfamiliar song within four bars.'
        ] } },

    { id: 'u7', title: 'The pop eighth-note pad',
      goal: 'Play a steady eighth-note right-hand pattern with left-hand roots on 1, at 80 bpm.',
      why: 'This is the default modern pop accompaniment — the thing you will play behind more singers than anything else. It fills space without stepping on the vocal.',
      keys: ['C', 'G', 'F'],
      exercises: [
        { id: 'u7e1', title: 'Warm-up: quarters with counting', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['One minute of quarter-note comping in {{key}} at 80, counting out loud.'],
          target: 'Steady.' },

        { id: 'u7e2', title: 'Count in eighths', type: 'groove', role: 'core', minutes: 4,
          vary: MID, bpm: { start: 70, goal: 85 }, tool: 'metronome',
          steps: [
            'Metronome at 70, still clicking quarters.',
            { do: 'Count "1 and 2 and 3 and 4 and" evenly, out loud.',
              note: 'The "and" falls exactly between clicks. Not early — that is the commonest fault.' },
            'Tap eighths on your knee while the click plays quarters.',
            { do: 'Now play the chord on all eight eighths, lightly.',
              note: 'This is a texture, not an attack. Keep it quiet.' }
          ],
          target: 'Your eighths are even; the "and" is exactly halfway, not rushed.' },

        { id: 'u7e3', title: 'Pad it: hold the top, pulse the bottom', type: 'groove', role: 'core', minutes: 5,
          vary: MID, bpm: { start: 75, goal: 90 },
          steps: [
            { do: 'Hold the top note; pulse the lower two in eighths.',
              note: 'Rather than hitting all three notes on every eighth, which gets relentless.' },
            'Play 1-5-6-4 in {{key}} with this texture at 75 bpm.',
            { do: 'Left hand: root on 1, fifth on 3.' },
            'Eight loops without stopping.'
          ],
          target: 'Continuous eighth pulse, no gaps at the chord changes.',
          show: { numbers: '1 5 6 4' } },

        { id: 'u7e4', title: 'Pad in a new key', type: 'keys', role: 'apply', minutes: 4,
          vary: WIDE, bpm: { start: 70, goal: 85 },
          steps: [
            'Same eighth pad, 1-5-6-4 in {{key}}: {{1}} - {{5}} - {{6}} - {{4}}.',
            'Four loops at 75 bpm.',
            { do: 'The feel must survive the key change.',
              note: 'Same groove, different notes. If the groove sags, slow the tempo rather than fighting it.' }
          ],
          target: 'The pattern survives the key change — same feel, different notes.',
          show: { numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'The pad',
        criteria: [
          'Play the eighth-note pad through 1-5-6-4 in three keys at 80 bpm, 8 loops each, no gaps.',
          'Your eighths are even against a quarter-note click.',
          'Left hand covers root on 1 and fifth on 3 without disturbing the right hand.'
        ] } },

    { id: 'u8', title: 'Broken chords and the ballad arpeggio',
      goal: 'Play a rolling arpeggio accompaniment through a four-chord progression in 4/4 and in 6/8.',
      why: 'Ballads are where singers are most exposed and most often ask for piano only. A rolling arpeggio gives them a bed of harmony with none of the percussive attack of block chords.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u8e1', title: 'Warm-up: eighth pad', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['One minute of the eighth pad in {{key}} at 80.'],
          target: 'Even.' },

        { id: 'u8e2', title: 'The 1-5-8-5 roll', type: 'technique', role: 'core', minutes: 5,
          vary: MID, bpm: { start: 65, goal: 85 },
          steps: [
            { do: 'Left hand: root, fifth, octave, fifth. One per beat.',
              note: 'On {{1}} that is the root, the fifth above it, the octave, then back to the fifth. The classic rolling bass.' },
            'Do it on {{1}}, {{4}}, {{5}}, {{6}}.',
            'Right hand plays the plain triad on beat 1 while the left rolls underneath.',
            '70 bpm, four bars per chord, then one bar per chord.'
          ],
          target: 'The roll is even and the right-hand chord lands exactly on 1.',
          show: { chords: ['{{1}}', '{{4}}', '{{5}}', '{{6}}'], voicing: 'open', octave: 3, hand: 'L' } },

        { id: 'u8e3', title: 'Alberti bass', type: 'technique', role: 'core', minutes: 4,
          vary: MID, bpm: { start: 60, goal: 80 },
          steps: [
            { do: 'Pattern: low - high - middle - high.',
              note: 'On {{1}} that is root, fifth, third, fifth. One note per eighth.' },
            'Slowly at first, left hand alone.',
            'Run it through {{1}} - {{6}} - {{4}} - {{5}}, one bar each.',
            'Right hand adds the top note of the chord only, held for the bar.'
          ],
          target: 'Even Alberti pattern at 70 bpm through four chords.' },

        { id: 'u8e4', title: '6/8 ballad feel', type: 'groove', role: 'apply', minutes: 5,
          vary: MID, bpm: { start: 55, goal: 75 },
          steps: [
            { do: 'Count 1 2 3 4 5 6, weight on 1 and 4.',
              note: 'This is the slow-ballad feel behind a huge number of vocal standards.' },
            'Left hand: root on 1, fifth on 4.',
            'Right hand: arpeggiate the triad up across each group of three.',
            'Play {{1}} - {{6}} - {{4}} - {{5}}, one bar per chord, at 60 bpm.'
          ],
          target: 'The 6/8 lilt is audible — 1 and 4 are clearly stronger than the rest.',
          show: { numbers: '1 6 4 5' } }
      ],
      checkpoint: { title: 'Ballad textures',
        criteria: [
          'Play the 1-5-8-5 roll through four chords at 80 bpm, evenly.',
          'Play Alberti bass through four chords at 75 bpm.',
          'Play a 6/8 arpeggiated accompaniment with the lilt clearly audible.'
        ] } },

    { id: 'u9', title: 'Syncopation and the push',
      goal: 'Play a syncopated pop comping pattern, and anticipate a chord change by an eighth note.',
      why: 'Straight on-the-beat comping sounds stiff behind a singer phrasing freely. The push — arriving at the new chord an eighth early — is the most useful rhythmic trick in pop accompaniment.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u9e1', title: 'Warm-up: eighths and counting', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: [{ do: 'Pad in {{key}} at 80, counting eighths out loud.',
              note: 'Count "1 and 2 and 3 and 4 and" against the click for a full minute.' }],
          target: 'Even.' },

        { id: 'u9e2', title: 'Play only the offbeats', type: 'groove', role: 'core', minutes: 4,
          vary: MID, bpm: { start: 70, goal: 85 }, tool: 'metronome',
          steps: [
            { do: 'Right hand only on the "ands". Never on the click.' },
            { do: 'It will feel wrong for the first minute. Keep going.',
              note: 'Sitting against the beat is a skill that arrives suddenly rather than gradually.' },
            'Left hand plays the root on the click, so the hands alternate.',
            'Three minutes. Build to 85 bpm.'
          ],
          target: 'You can sit on the offbeat for three minutes without drifting onto the beat.' },

        { id: 'u9e3', title: 'The Charleston pattern', type: 'groove', role: 'core', minutes: 5,
          vary: MID, bpm: { start: 70, goal: 90 }, tool: 'metronome',
          steps: [
            { do: 'Hit on 1, then on the "and of 2". Rest.',
              note: 'Count it as "1 (2) and (3) (4)". Two hits per bar is the backbone of a huge amount of comping.' },
            'Play it through {{1}} - {{5}} - {{6}} - {{4}}, one bar each, at 75 bpm.',
            'Then vary: hit on 1 and the "and of 3".'
          ],
          target: 'The pattern is locked and repeatable at 85 bpm through a four-chord loop.',
          show: { numbers: '1 5 6 4' } },

        { id: 'u9e4', title: 'The push', type: 'groove', role: 'apply', minutes: 5,
          vary: MID, bpm: { start: 70, goal: 90 },
          steps: [
            { do: 'Arrive at each new chord an eighth early.',
              note: 'On the "and of 4" of the previous bar, then hold through the barline.' },
            'Play 1-5-6-4 in {{key}}, pushing every change.',
            { do: 'Try pushing both hands, then only the right.',
              note: 'Both hands is punchier; right hand only is smoother. Both are used.' },
            'Eight loops at 75 bpm.'
          ],
          target: 'Every chord arrives an eighth early, consistently, without the tempo drifting forward.' }
      ],
      checkpoint: { title: 'Rhythmic independence',
        criteria: [
          'Comp on offbeats only for three minutes at 85 bpm without drifting.',
          'Play the Charleston pattern through a four-chord loop at 85 bpm.',
          'Push every chord change by an eighth without speeding up.'
        ] } },

    { id: 'u10', title: 'Dynamics and space',
      goal: 'Comp the same progression four ways — sparse, pad, rhythmic, full — and switch on cue without stopping.',
      why: 'Accompanying is mostly about what you leave out. The singer owns the melody and the top of the texture. Being able to change density on demand is what makes you pleasant to sing with.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u10e1', title: 'Warm-up: Charleston', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['One minute of the Charleston pattern in {{key}} at 80.'],
          target: 'Locked.' },

        { id: 'u10e2', title: 'The four density levels', type: 'technique', role: 'core', minutes: 6,
          vary: MID,
          steps: [
            { do: 'Level 1 sparse: root on 1, two notes held. Nothing else.' },
            { do: 'Level 2 pad: quiet eighth pulse, mid-register.' },
            { do: 'Level 3 rhythmic: Charleston, left hand root-fifth.' },
            { do: 'Level 4 full: left-hand octave, four-note chord, driving eighths.' },
            'Play 1-5-6-4 in {{key}} for two loops at each level, up then back down.'
          ],
          target: 'Four clearly different densities that are recognisably the same progression.',
          show: { numbers: '1 5 6 4' } },

        { id: 'u10e3', title: 'Stay out of the singer register', type: 'technique', role: 'core', minutes: 4,
          vary: MID,
          steps: [
            { do: 'Singers live roughly G3 to G5.',
              note: 'That is the octave below middle C up to the octave above it.' },
            { do: 'Keep your top note at or below the C above middle C.' },
            'Play 1-5-6-4 in {{key}} with the whole right hand inside that octave.',
            { do: 'Now play it an octave too high on purpose.',
              note: 'Hear how it fights an imagined vocal line. That is what you are avoiding.' }
          ],
          target: 'You can keep the whole right hand inside one octave above middle C for a full progression.' },

        { id: 'u10e4', title: 'Verse-chorus dynamic map', type: 'apply', role: 'apply', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Verse = 1-5-6-4. Chorus = 4-5-6-1.' },
            { do: 'Run 1, 1, 2, 2, then chorus at 4, then verse at 2.',
              note: 'Two loops each: verse at Level 1, verse at Level 2, chorus at Level 4, verse at Level 2.' },
            'No stopping between sections.',
            { do: 'Play it twice through.',
              note: 'The density change should be obvious from across the room.' }
          ],
          target: 'A listener could tell you where the chorus starts with their eyes closed.',
          show: { numbers: '4 5 6 1' } }
      ],
      checkpoint: { title: 'Stage 2 exit — you sound like an accompanist',
        criteria: [
          'Play four distinct density levels on the same progression and switch between them on cue.',
          'Keep the right hand inside the octave above middle C for a whole song section.',
          'Play a verse-chorus dynamic map, no stops, with an audible lift into the chorus.'
        ] } }
    ] },

  // ================================================================ STAGE 3
  { id: 's3', title: 'Keys and Numbers',
    blurb: 'Singers change keys. This stage is what lets you say "sure, what key?" and mean it.',
    units: [

    { id: 'u11', title: 'Numbers, not letters',
      goal: 'Convert any chord chart to numbers and back, and play the core progressions by number in three keys.',
      why: 'This separates an accompanist from someone who memorised songs. Singers routinely ask for a key change ten seconds before you start. With letters you are stuck; with numbers you just move.',
      keys: ['C', 'G', 'F'],
      exercises: [
        { id: 'u11e1', title: 'Warm-up: six chords, three keys', type: 'warmup', role: 'warmup', minutes: 3,
          vary: MID,
          steps: ['Play the six workhorse chords of {{key}}, then of C, then of G, two beats each.'],
          target: 'No hesitation in any of the three.' },

        { id: 'u11e2', title: 'Number the scale', type: 'theory', role: 'core', minutes: 4,
          vary: WIDE, tool: 'number-drill',
          steps: [
            { do: '1 major, 2 minor, 3 minor, 4 major, 5 major, 6 minor, 7 diminished.',
              note: 'This pattern never changes, in any major key. Learn it once and you have all 12.' },
            { do: 'Say it in {{key}}: {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}}.' },
            'Cover the answer. Call a number; say the chord within two seconds.',
            'Use the number drill below.'
          ],
          target: 'Any number in the key named correctly within two seconds.' },

        { id: 'u11e3', title: 'Translate a chart', type: 'theory', role: 'core', minutes: 4,
          vary: MID,
          steps: [
            { do: 'Write {{1}} | {{6}} | {{4}} | {{5}} in numbers.',
              note: 'The answer is 1 6 4 5. Now you own it in every key at once.' },
            'Write it out in two other keys using only the numbers.',
            'Do the same for {{1}} | {{5}} | {{6}} | {{4}} and {{6}} | {{4}} | {{1}} | {{5}}.'
          ],
          target: 'You can convert a letter chart to numbers and back into any key on paper.' },

        { id: 'u11e4', title: 'Play by number', type: 'keys', role: 'apply', minutes: 5,
          vary: WIDE,
          steps: [
            { do: 'Set the progression to 1 5 6 4. Do not think about letters.' },
            'Play it in {{key}}. Then immediately in C. Then in G. No pause between keys.',
            'Then 1 6 4 5 the same way.',
            'Then 6 4 1 5 — the "sensitive" turn.'
          ],
          target: 'Three progressions, three keys, no pause to work out letters.',
          show: { numbers: '6 4 1 5' } }
      ],
      checkpoint: { title: 'Thinking in numbers',
        criteria: [
          'Name any diatonic chord by number in C, G and F within two seconds.',
          'Convert a letter chart to numbers and re-voice it in a new key.',
          'Play 1-5-6-4, 1-6-4-5 and 6-4-1-5 in three keys back to back without pausing.'
        ] } },

    { id: 'u12', title: 'The sharp keys: G, D, A, E',
      goal: 'Play the six workhorse chords and the three core progressions in G, D, A and E.',
      why: 'These are guitar keys. If a singer works with a guitarist — and most do — this is where their material lives. D and A come up constantly.',
      keys: ['G', 'D', 'A', 'E'],
      exercises: [
        { id: 'u12e1', title: 'Warm-up: numbers round', type: 'warmup', role: 'warmup', minutes: 3,
          vary: ['C', 'G', 'F', 'D'],
          steps: ['Play 1-5-6-4 in {{key}}, then two other keys, one loop each, no pause.'],
          target: 'Fluent.' },

        { id: 'u12e2', title: 'Learn the sharps', type: 'theory', role: 'core', minutes: 4,
          vary: ['G', 'D', 'A', 'E'],
          steps: [
            { do: 'Sharps arrive in order: F#, C#, G#, D#.',
              note: 'G has one, D has two, A has three, E has four. Nothing else to memorise.' },
            'Say the sharps of {{key}} out loud before you play.',
            'Play the {{key}} major scale, right hand, one octave, slowly.'
          ],
          target: 'You can say and play the scale of G, D, A and E with correct sharps.',
          show: { numbers: '1 2 3 4 5 6' } },

        { id: 'u12e3', title: 'The six chords in a sharp key', type: 'technique', role: 'core', minutes: 5,
          vary: ['D', 'A', 'G', 'E'], tool: 'random-chord',
          steps: [
            { do: '{{key}}: {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}}.' },
            'Play each slowly, two beats per chord, voice-led.',
            { do: 'Keep the thumb off black keys where you can.',
              note: 'The minors here sit on black keys. Choose inversions that put long fingers on them.' },
            'Random-call drill: 20 chords.'
          ],
          target: '18/20 landed within two seconds.',
          show: { numbers: '1 2 3 4 5 6' } },

        { id: 'u12e4', title: 'Progressions in a sharp key', type: 'keys', role: 'apply', minutes: 5,
          vary: ['E', 'A', 'D', 'B'], bpm: { start: 65, goal: 85 },
          steps: [
            'Play 1-5-6-4 in {{key}} — {{1}} {{5}} {{6}} {{4}} — with the eighth pad.',
            'Then 1-6-4-5: {{1}} {{6}} {{4}} {{5}}.',
            { do: 'Four loops of each at 75 bpm.',
              note: 'Awkward at first is normal here and it passes with reps rather than effort.' }
          ],
          target: 'Both progressions, four loops each, no stops.',
          show: { numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'Sharp keys',
        criteria: [
          'Name and play all six workhorse chords in G, D, A and E.',
          'Play 1-5-6-4 and 1-6-4-5 in each of those four keys at 75 bpm.',
          'State the sharps in each key without thinking.'
        ] } },

    { id: 'u13', title: 'The flat keys: F, Bb, Eb, Ab',
      goal: 'Play the six workhorse chords and the three core progressions in F, Bb, Eb and Ab.',
      why: 'Flat keys are singer keys and horn keys. Standards, soul, gospel and jazz vocal material lives here, and many voices land in Eb and Ab.',
      keys: ['F', 'Bb', 'Eb', 'Ab'],
      exercises: [
        { id: 'u13e1', title: 'Warm-up: sharp-key round', type: 'warmup', role: 'warmup', minutes: 3,
          vary: ['G', 'D', 'A'],
          steps: ['1-5-6-4 in {{key}}, one loop, then two more sharp keys.'],
          target: 'Fluent.' },

        { id: 'u13e2', title: 'Learn the flats', type: 'theory', role: 'core', minutes: 4,
          vary: ['F', 'Bb', 'Eb', 'Ab'],
          steps: [
            { do: 'Flats arrive in order: Bb, Eb, Ab, Db.',
              note: 'F has one, Bb has two, Eb has three, Ab has four.' },
            'Say the flats of {{key}} out loud, then play the scale slowly.',
            { do: 'Flat keys are easier than they look.',
              note: 'The black keys give your longer fingers somewhere natural to sit.' }
          ],
          target: 'Scales of F, Bb, Eb and Ab with correct flats.',
          show: { numbers: '1 2 3 4 5 6' } },

        { id: 'u13e3', title: 'The six chords in a flat key', type: 'technique', role: 'core', minutes: 5,
          vary: ['Bb', 'Eb', 'F', 'Ab'], tool: 'random-chord',
          steps: [
            { do: '{{key}}: {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}}.' },
            'Play the set voice-led, two beats per chord.',
            { do: 'Fingers 2, 3, 4 take the black keys; thumb stays on whites.' },
            'Random-call drill: 20 chords.'
          ],
          target: '18/20 landed within two seconds.',
          show: { numbers: '1 2 3 4 5 6' } },

        { id: 'u13e4', title: 'Progressions in a flat key', type: 'keys', role: 'apply', minutes: 5,
          vary: ['Ab', 'Eb', 'Bb', 'Db'], bpm: { start: 65, goal: 80 },
          steps: [
            '1-5-6-4 in {{key}} is {{1}} - {{5}} - {{6}} - {{4}}.',
            'Four loops with the eighth pad at 70 bpm.',
            'Then 6-4-1-5: {{6}} {{4}} {{1}} {{5}}, four loops.'
          ],
          target: 'Both progressions, four loops each.',
          show: { numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'Flat keys',
        criteria: [
          'Name and play all six workhorse chords in F, Bb, Eb and Ab.',
          'Play 1-5-6-4 and 6-4-1-5 in each at 70 bpm.',
          'State the flats in each key without thinking.'
        ] } },

    { id: 'u14', title: 'Transpose on demand',
      goal: 'Take any four-chord progression and play it in any of the 12 keys within five seconds of being told the key.',
      why: 'The pay-off of the whole stage, and the moment you become genuinely useful. "Can we take it down a third?" stops being a problem.',
      keys: ALL12,
      exercises: [
        { id: 'u14e1', title: 'Warm-up: circle of fifths', type: 'warmup', role: 'warmup', minutes: 3,
          steps: [
            'Play single roots round the circle: C G D A E B F# Db Ab Eb Bb F, back to C.',
            'Then major triads on each.'
          ],
          target: 'All the way round without stopping.',
          show: { chords: ['C', 'G', 'D', 'A', 'E', 'B'] } },

        { id: 'u14e2', title: '1-5-6-4 around the circle', type: 'keys', role: 'core', minutes: 6,
          bpm: { start: 60, goal: 80 },
          steps: [
            { do: 'One loop of 1-5-6-4 per key, right round the circle.',
              note: 'C, then G, then D, then A, and onwards until you are back at C.' },
            'Two beats per chord. Do not stop between keys.',
            { do: 'Stuck in a key? Play just the roots and move on.',
              note: 'Come back to that key next session rather than grinding it now.' }
          ],
          target: 'All 12 keys in one continuous pass.' },

        { id: 'u14e3', title: 'Up a step, down a third', type: 'keys', role: 'core', minutes: 5,
          vary: WIDE,
          steps: [
            { do: 'Four common asks: up a semitone or tone, down a tone or minor third.' },
            'Play 1-6-4-5 in {{key}}. Now up a tone. Now down a tone. Now down a minor third.',
            'Say the new key out loud before you play it.',
            'Repeat from two other starting keys.'
          ],
          target: 'You can shift by any of those four intervals from any starting key without working it out on paper.' },

        { id: 'u14e4', title: 'Cold-call transposition', type: 'apply', role: 'apply', minutes: 5,
          tool: 'random-key',
          steps: [
            'Use the caller below. It names a key and a progression.',
            'Five seconds to start playing. Two loops, then take the next call.',
            'Twelve calls. Score how many you started inside five seconds.'
          ],
          target: '10/12 started within five seconds.' }
      ],
      checkpoint: { title: 'Stage 3 exit — key independence',
        criteria: [
          'Play 1-5-6-4 in all 12 keys in one continuous pass.',
          'Shift a progression up a step, down a step, or down a minor third on command.',
          'Cold-call drill: start playing in a named key within five seconds, 10 out of 12.'
        ] } }
    ] },

  // ================================================================ STAGE 4
  { id: 's4', title: 'Richer Harmony',
    blurb: 'Sevenths, suspensions, slash chords and shell voicings — the difference between "correct" and "good".',
    units: [

    { id: 'u15', title: 'Seventh chords',
      goal: 'Play maj7, m7 and dominant 7 chords in any key, and know which belongs on each degree.',
      why: 'Triads are the skeleton; sevenths are the sound of adult music. Nearly every ballad, standard, soul and R&B chart a singer hands you is written in sevenths.',
      keys: ['C', 'F', 'Bb'],
      exercises: [
        { id: 'u15e1', title: 'Warm-up: triads round the circle', type: 'warmup', role: 'warmup', minutes: 3,
          steps: ['Major triads around the circle of fifths, then minor triads.'],
          target: 'Continuous.' },

        { id: 'u15e2', title: 'The three sevenths', type: 'theory', role: 'core', minutes: 5,
          vary: WIDE,
          steps: [
            { do: 'Major triad + a note a tone below the root = maj7.',
              note: 'Warm and floating. On {{key}} that gives you {{1:7}}.' },
            { do: 'Drop that note a semitone = dominant 7.',
              note: 'Restless, wants to move. This is the chord that pulls home.' },
            { do: 'Minor triad + the same lowered note = m7.',
              note: 'Smooth and neutral — the workhorse of the three.' },
            'Play all three on the same root, back to back, and listen.'
          ],
          target: 'You can build and hear the difference between the three seventh types on any root.',
          show: { chords: ['{{key}}maj7', '{{key}}7', '{{key}}m7'] } },

        { id: 'u15e3', title: 'Sevenths in the key', type: 'theory', role: 'core', minutes: 5,
          vary: WIDE,
          steps: [
            { do: '1 maj7, 2 m7, 3 m7, 4 maj7, 5 dominant, 6 m7, 7 m7b5.' },
            { do: 'Only the 5 chord is dominant.',
              note: 'That is exactly why the 5 chord pulls home so strongly.' },
            'Play all seven in {{key}}: {{1:7}}, {{2:7}}, {{3:7}}, {{4:7}}, {{5:7}}, {{6:7}}, {{7:7}}.'
          ],
          target: 'All seven diatonic sevenths played correctly in the key.',
          show: { numbers: '1 2 3 4 5 6 7', sevenths: true } },

        { id: 'u15e4', title: 'Sevenths in a progression', type: 'apply', role: 'apply', minutes: 5,
          vary: WIDE, bpm: { start: 65, goal: 85 },
          steps: [
            'Play 1-6-4-5 in {{key}} as plain triads.',
            'Now as sevenths: {{1:7}} {{6:7}} {{4:7}} {{5:7}}. Same progression, new colour.',
            { do: 'Add the eighth pad, right hand inside one octave.',
              note: 'Use inversions. Do not stack all four notes up from the root or it turns to mud.' },
            'Four loops.'
          ],
          target: 'The seventh version sounds richer, not muddier — that means you inverted rather than stacking low.',
          show: { numbers: '1 6 4 5', sevenths: true } }
      ],
      checkpoint: { title: 'Sevenths',
        criteria: [
          'Build maj7, dominant 7 and m7 on any root within three seconds.',
          'Play all seven diatonic sevenths in C, F and Bb.',
          'Play 1-6-4-5 in sevenths with a pad, right hand inside one octave, in two keys.'
        ] } },

    { id: 'u16', title: 'Sus chords, add9 and slash chords',
      goal: 'Use sus4, sus2, add9 and slash chords to add motion and control the bass line.',
      why: 'These make a simple progression sound arranged. A sus4 resolving is the most-used gesture in pop piano, and slash chords let you write a walking bass under static harmony.',
      keys: ['C', 'G', 'D'],
      exercises: [
        { id: 'u16e1', title: 'Warm-up: diatonic sevenths', type: 'warmup', role: 'warmup', minutes: 3,
          vary: WIDE,
          steps: ['All seven diatonic sevenths in {{key}}, then one more key.'],
          target: 'Fluent.' },

        { id: 'u16e2', title: 'Suspend and resolve', type: 'technique', role: 'core', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Push the 3rd up to the 4th: that is sus4.',
              note: 'Tense. Dropping it back down to the 3rd is the release, and the whole point.' },
            { do: 'Push the 3rd down to the 2nd instead: sus2.',
              note: 'Open and airy, with no strong pull either way.' },
            'Play sus4 to resolution on {{1}}, {{4}} and {{5}}, ten times each.',
            'Now play 1-5-6-4 where every chord arrives as a sus and resolves on beat 3.'
          ],
          target: 'The sus-to-resolution move is automatic on any major chord.',
          show: { chords: ['{{key}}sus4', '{{key}}', '{{key}}sus2'] } },

        { id: 'u16e3', title: 'add9 for colour', type: 'technique', role: 'core', minutes: 4,
          vary: MID,
          steps: [
            { do: 'add9 = the triad plus the 9th, keeping the 3rd.',
              note: 'Unlike sus2, the 3rd stays. That is what makes it colour rather than ambiguity.' },
            { do: 'Practical shape: root in the left, 3rd-5th-9th in the right.' },
            'Play add9 versions of {{1}}, {{4}}, {{5}}.',
            'Replace every chord in 1-5-6-4 with its add9 version.'
          ],
          target: 'A four-chord loop in add9 voicings that sounds modern rather than cluttered.',
          show: { chords: ['{{key}}add9'] } },

        { id: 'u16e4', title: 'Slash chords and the descending bass', type: 'apply', role: 'apply', minutes: 5,
          bpm: { start: 60, goal: 80 },
          steps: [
            { do: 'A slash chord names the bass separately: C/E is a C chord over E.',
              note: 'The right hand does not change. Only the left hand moves.' },
            { do: 'Play C - C/B - Am - Am/G - F - C/E - Dm - G.',
              note: 'The bass walks down C B A G F E D, then jumps to G to turn around.' },
            { do: 'Left hand takes only the bass notes.',
              note: 'The right hand keeps voice-led chords in one small area and barely moves.' },
            'Two loops slowly, then at 70 bpm.'
          ],
          target: 'A clear stepwise descending bass line under static-sounding right-hand chords.',
          show: { chords: ['C', 'C/B', 'Am', 'Am/G', 'F', 'C/E', 'Dm', 'G'], bassline: true } }
      ],
      checkpoint: { title: 'Colour chords',
        criteria: [
          'Play sus4-to-resolution on any major chord instantly.',
          'Play a four-chord loop in add9 voicings without muddiness.',
          'Play the descending bass progression in two keys with a clean stepwise bass.'
        ] } },

    { id: 'u17', title: 'Shell voicings and the pro left hand',
      goal: 'Play left-hand shell voicings — root + 7th, or root + 3rd + 7th — with the right hand free for colour.',
      why: 'The standard division of labour for accompanying a singer on anything jazz-adjacent. The left hand states the harmony minimally, the right is free, and the whole thing stays out of the singer’s way.',
      keys: ['C', 'F', 'Bb', 'Eb'],
      exercises: [
        { id: 'u17e1', title: 'Warm-up: sevenths in two keys', type: 'warmup', role: 'warmup', minutes: 3,
          vary: WIDE,
          steps: ['Diatonic sevenths in {{key}}, two beats each, then one more key.'],
          target: 'Fluent.' },

        { id: 'u17e2', title: 'Root and seventh', type: 'technique', role: 'core', minutes: 5,
          vary: WIDE,
          steps: [
            { do: 'Left hand: pinky on the root, thumb on the 7th.',
              note: 'Two notes is enough to state the whole chord.' },
            { do: 'Keep the root around the octave below middle C.',
              note: 'Lower than that and the interval turns muddy.' },
            'Play shells for {{1:7}} - {{6:7}} - {{2:7}} - {{5:7}}, left hand alone.',
            'Then the same in one more key.'
          ],
          target: 'Two-note shells on every diatonic seventh, left hand alone, in three keys.',
          show: { numbers: '1 6 2 5', sevenths: true, voicing: 'shell', octave: 3, hand: 'L' } },

        { id: 'u17e3', title: 'Root, third, seventh', type: 'technique', role: 'core', minutes: 5,
          vary: WIDE,
          steps: [
            { do: 'Add the 3rd between root and 7th.' },
            { do: 'The 3rd and 7th define the quality; the 5th is expendable.',
              note: 'This is why you can drop the 5th and lose nothing.' },
            'Play 1-6-2-5 in {{key}} with these three-note left-hand shells.',
            'Right hand adds one colour note on top — the 9th or the 5th — held.'
          ],
          target: 'Left-hand 1-3-7 shells with a clear, uncluttered sound.',
          show: { numbers: '1 6 2 5', sevenths: true, voicing: 'shell37', octave: 3, hand: 'L' } },

        { id: 'u17e4', title: 'Shells under a melody', type: 'apply', role: 'apply', minutes: 5,
          vary: WIDE,
          steps: [
            'Play the shells with the left hand and hum any melody over them.',
            'Now play that melody with the right hand instead, one note at a time.',
            { do: 'This is literally the job.',
              note: 'Your left hand is the whole band; your right hand doubles or answers the singer.' },
            'Do it over 1-6-2-5 in {{key}}, then one more key.'
          ],
          target: 'You can hold left-hand shells steady while the right hand does something independent.' }
      ],
      checkpoint: { title: 'The pro left hand',
        criteria: [
          'Play root-7 and root-3-7 shells on every diatonic seventh in C, F and Bb.',
          'Comp 1-6-2-5 with left-hand shells and a right-hand colour note.',
          'Hold the shells steady while singing or playing an independent melody.'
        ] } },

    { id: 'u18', title: '2-5-1 and borrowed colour',
      goal: 'Play 2-5-1 with voice-led shells in all 12 keys, and use secondary dominants and the minor 4 chord.',
      why: '2-5-1 is the most common cadence in vocal repertoire, and secondary dominants and the minor 4 are the two outside sounds that show up most in songs singers actually bring you.',
      keys: WIDE,
      exercises: [
        { id: 'u18e1', title: 'Warm-up: shells in three keys', type: 'warmup', role: 'warmup', minutes: 3,
          vary: WIDE,
          steps: ['1-6-2-5 with left-hand shells in {{key}}, then two more keys.'],
          target: 'Fluent.' },

        { id: 'u18e2', title: 'Voice-led 2-5-1', type: 'technique', role: 'core', minutes: 6,
          vary: ALL12, bpm: { start: 55, goal: 75 },
          steps: [
            { do: 'In {{key}}: {{2:7}} - {{5:7}} - {{1:7}}.' },
            { do: 'The 7th of one chord becomes the 3rd of the next.',
              note: 'It falls a semitone each time. That half-step voice leading is the whole mechanism.' },
            'Play it here, then move down a tone and repeat, all the way round.',
            'All 12 keys, two beats per chord.'
          ],
          target: '2-5-1 in all 12 keys in one continuous pass.',
          show: { numbers: '2 5 1', sevenths: true } },

        { id: 'u18e3', title: 'Secondary dominants', type: 'theory', role: 'core', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Any chord can be preceded by the dominant 7 a fifth above it.' },
            { do: 'A chord with an accidental that is not in the key is usually one of these.',
              note: 'It tells you where the music is heading next — a fifth below.' },
            'Play {{1}} - {{3:7}} - {{6}} - {{6:7}} - {{2}} - {{5:7}} - {{1}}.',
            'Every chord is set up by its own dominant.'
          ],
          target: 'You can spot a secondary dominant in a chart and know where it is going.' },

        { id: 'u18e4', title: 'The minor 4 chord', type: 'apply', role: 'apply', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Borrow the 4 chord from the parallel minor.',
              note: 'In {{key}} that is a minor {{4}} instead of a major one — the most emotionally loaded chord in pop.' },
            'Play {{1}} - {{4}} - minor {{4}} - {{1}}. Listen to what it does on the way home.',
            { do: 'Use it at the end of a chorus or the last line before one.' },
            'Play 1 - 4 - 4m - 1 in two more keys.'
          ],
          target: 'You can drop a minor 4 in at the end of a phrase and make it land.' }
      ],
      checkpoint: { title: 'Stage 4 exit — real harmony',
        criteria: [
          'Play voice-led 2-5-1 with shells in all 12 keys in one pass.',
          'Recognise and play secondary dominants in a chart.',
          'Use the minor 4 chord musically at the end of a phrase in three keys.'
        ] } }
    ] },

  // ================================================================ STAGE 5
  { id: 's5', title: 'Working With a Singer',
    blurb: 'Everything up to here was about the piano. This stage is about the other person in the room.',
    units: [

    { id: 'u19', title: 'Intros, count-offs and endings',
      goal: 'Start and end a song cleanly without being told how — intro, pitch, count-off, ending.',
      why: 'The two moments a singer is most exposed are the first note and the last. Give them their pitch, set the tempo and land an ending, and you are already more useful than most amateur accompanists.',
      keys: ['C', 'G', 'F', 'Eb'],
      exercises: [
        { id: 'u19e1', title: 'Warm-up: 2-5-1 in four keys', type: 'warmup', role: 'warmup', minutes: 3,
          vary: WIDE,
          steps: ['Voice-led 2-5-1 with shells in {{key}}, then three more keys.'],
          target: 'Fluent.' },

        { id: 'u19e2', title: 'The four-bar intro', type: 'technique', role: 'core', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Default: play the last four bars of the song, then start.' },
            { do: 'Second default: vamp {{1}} and {{4}} for four bars.' },
            { do: 'Third: {{4}} - {{5}} - {{1}} as a two-bar setup.' },
            'Build all three for 1-5-6-4 in {{key}} and play each straight into the verse, no gap.'
          ],
          target: 'Three usable intros for the same song, each flowing straight into the verse.',
          show: { numbers: '4 5 1' } },

        { id: 'u19e3', title: 'Give the singer their note', type: 'ear', role: 'core', minutes: 4,
          vary: MID,
          steps: [
            { do: 'Work out their first pitch — usually the 1, 3 or 5 of the first chord.' },
            { do: 'Play the tonic chord, then that note alone, in their octave.' },
            'Practise in {{key}}: play {{1}}, then sound the starting note clearly.',
            'Then count off.'
          ],
          target: 'You can isolate and sound a starting pitch in the singer’s octave in any key.' },

        { id: 'u19e4', title: 'Count-offs and endings', type: 'apply', role: 'apply', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Count off "1, 2, 1 2 3 4" at the exact tempo.',
              note: 'Practise at 60, 80, 100 and 120 without a metronome, then check yourself against one.' },
            { do: 'Ending 1 — the ritard: slow the last two bars, hold the final chord.' },
            { do: 'Ending 2 — the tag: repeat the last line three times, slower each time.' },
            { do: 'Ending 3 — the cold stop: everyone lands on beat 1 and stops.' },
            'Play a 16-bar loop with an intro, then each of the three endings.'
          ],
          target: 'Count-off within 5 bpm of the target tempo, and three endings you can execute on cue.' }
      ],
      checkpoint: { title: 'Top and tail',
        criteria: [
          'Play three different intros into the same song without a gap.',
          'Give a singer their starting pitch in any key.',
          'Count off within 5 bpm of a target tempo, and land all three ending types.'
        ] } },

    { id: 'u20', title: 'Following a singer',
      goal: 'Stay with a singer through rubato, early entries, late entries and dropped lines without stopping.',
      why: 'This is the actual job. Singers breathe, stretch phrases, come in early and forget words. An accompanist who can only play in strict time forces the singer to serve the piano, which is backwards.',
      keys: ['C', 'F', 'G'],
      exercises: [
        { id: 'u20e1', title: 'Warm-up: sparse comping', type: 'warmup', role: 'warmup', minutes: 2,
          vary: MID,
          steps: ['Level 1 sparse comping through 1-5-6-4 in {{key}}, very quiet.'],
          target: 'Controlled.' },

        { id: 'u20e2', title: 'Rubato: stretch and compress', type: 'technique', role: 'core', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Metronome off for this one.' },
            { do: 'Stretch bar 2 by about a quarter, then compress bar 4 to catch up.',
              note: 'Play 1-6-4-5 in {{key}} as a slow ballad while you do it.' },
            { do: 'The harmony must stay coherent while the pulse breathes.',
              note: 'Practise until the stretch sounds intentional rather than like a mistake.' },
            'Then do it following a recording, or your own singing, rather than a beat.'
          ],
          target: 'You can bend the tempo deliberately and still arrive at the next chord together.' },

        { id: 'u20e3', title: 'The rescue drills', type: 'technique', role: 'core', minutes: 6,
          vary: MID,
          steps: [
            { do: 'Singer early: jump to their chord immediately. Do not finish your bar.',
              note: 'Practise by starting a progression and forcing yourself forward one chord at a random point.' },
            { do: 'Singer late: hold the chord, do not fill, wait.',
              note: 'Practise holding chord 1 for eight bars, then continuing as if nothing happened.' },
            { do: 'Singer lost: hold the groove, play the melody quietly until they find it.' },
            { do: 'Wrong key: play their actual tonic, loudly, on the next beat 1.' }
          ],
          target: 'All four recoveries executed without stopping the music.' },

        { id: 'u20e4', title: 'Play with an actual voice', type: 'apply', role: 'apply', minutes: 6,
          steps: [
            { do: 'Pick a song you know and find a voice to follow.',
              note: 'A vocal-only or acoustic version works, or sing it yourself.' },
            'Comp underneath it for the whole song. Do not stop for any reason.',
            { do: 'Three rules: stay below the voice, drop out once, lift the chorus.',
              note: 'Never play above the vocal line; drop out entirely for at least one phrase; change density between verse and chorus.' },
            'Afterwards write one sentence on what got in the singer’s way.'
          ],
          target: 'A complete song accompanied end to end without stopping.' }
      ],
      checkpoint: { title: 'Following',
        criteria: [
          'Play rubato deliberately and arrive at chord changes with the voice.',
          'Execute all four rescue drills without stopping.',
          'Accompany a full song end to end with at least one deliberate drop-out.'
        ] } },

    { id: 'u21', title: 'Find the singer’s key',
      goal: 'Work out what key a singer is comfortable in, by ear, within a minute — and move a song there.',
      why: 'Singers often do not know their key. They know the song and roughly where it feels good. Finding it quickly is one of the most valued things an accompanist does.',
      keys: WIDE,
      exercises: [
        { id: 'u21e1', title: 'Warm-up: circle of fifths triads', type: 'warmup', role: 'warmup', minutes: 3,
          vary: WIDE,
          steps: ['Major triads around the circle, then 1-5-6-4 in {{key}} and two random keys.'],
          target: 'Fluent.' },

        { id: 'u21e2', title: 'Match a pitch', type: 'ear', role: 'core', minutes: 4,
          steps: [
            'Sing or hum any note. Find it on the piano within three tries.',
            'Repeat twenty times, starting from a different note each time.',
            'Then reverse: play a note, sing it back, check by playing it again.'
          ],
          target: 'You can find a hummed pitch on the keyboard within three tries, 18 times out of 20.' },

        { id: 'u21e3', title: 'The key-finding routine', type: 'technique', role: 'core', minutes: 5,
          vary: WIDE,
          steps: [
            { do: 'Ask for the highest note of the chorus, unaccompanied. Find it.' },
            { do: 'Work out what scale degree that note is in the original key.',
              note: 'Usually the 5, sometimes the 1 or 3.' },
            { do: 'The key that puts their comfortable note on that degree is your key.' },
            { do: 'Worked example: comfortable on {{5}}, and it is the 5 — key of {{key}}.' },
            'Do that calculation for five different top notes.'
          ],
          target: 'Given a top note and its scale degree, you name the key instantly.' },

        { id: 'u21e4', title: 'Move a song two ways', type: 'apply', role: 'apply', minutes: 5,
          vary: WIDE, tool: 'random-key',
          steps: [
            'Take a progression you know in {{key}}. Number it.',
            { do: 'Play it a fourth up, then a fourth down.',
              note: 'These are the two most common "too high / too low" corrections.' },
            'Then a minor third down, and a tone up.',
            'Under a minute per key, no written notes.'
          ],
          target: 'Four transpositions of the same song from memory, under a minute each.' }
      ],
      checkpoint: { title: 'Key finding',
        criteria: [
          'Find a hummed pitch on the keyboard within three tries, 18/20.',
          'Name the correct key given a comfortable top note and its scale degree.',
          'Move a known song into four different keys from memory.'
        ] } },

    { id: 'u22', title: 'Arrange a whole song',
      goal: 'Build and play a complete arrangement — intro, verse, chorus, bridge, final chorus, ending — with a deliberate dynamic plan.',
      why: 'A song is not four chords repeated; it is a shape. Once you can build a shape, a singer will want to work with you again.',
      keys: ['C', 'G', 'F', 'Eb'],
      exercises: [
        { id: 'u22e1', title: 'Warm-up: density levels', type: 'warmup', role: 'warmup', minutes: 3,
          vary: MID,
          steps: ['Run the four density levels through 1-5-6-4 in {{key}}, one loop each.'],
          target: 'Clearly distinct.' },

        { id: 'u22e2', title: 'Write the dynamic map', type: 'theory', role: 'core', minutes: 4,
          steps: [
            { do: 'Pick a song and list its sections in order.',
              note: 'For example: Intro / V1 / C1 / V2 / C2 / Bridge / C3 / Outro.' },
            { do: 'Give each section a density level 1-4.',
              note: 'A standard shape is 2 / 1 / 3 / 2 / 3 / 1 / 4 / 2.' },
            { do: 'No two adjacent sections share a level.',
              note: 'That is what makes every section boundary audible.' },
            'Write the map where you can see it at the piano.'
          ],
          target: 'A written dynamic map with no two adjacent sections at the same level.' },

        { id: 'u22e3', title: 'Section-boundary drill', type: 'technique', role: 'core', minutes: 5,
          vary: MID,
          steps: [
            { do: 'Signal the change in the last bar: a fill, a held chord, a drop, or a bass run.' },
            'Practise verse into chorus, ten times, transition bar only.',
            'Then chorus into verse — usually a drop in density.',
            'Then bridge into final chorus — usually the biggest lift in the song.'
          ],
          target: 'Three transition types you can play cleanly on demand.' },

        { id: 'u22e4', title: 'Play the whole arrangement', type: 'apply', role: 'apply', minutes: 8,
          steps: [
            'Play your song from the dynamic map, start to finish, real intro and real ending.',
            'Do not stop, even for a wrong chord.',
            'Record it on your phone.',
            { do: 'Listen back once; note the single weakest moment.',
              note: 'That moment is what you work on next session. One thing, not five.' }
          ],
          target: 'A complete recorded take with an intro, four distinct sections and an ending.' }
      ],
      checkpoint: { title: 'Stage 5 exit — you can accompany',
        criteria: [
          'Produce a written dynamic map for a song with audible section boundaries.',
          'Play three transition types on demand.',
          'Record a complete song, start to finish, with intro, dynamic shape and ending.'
        ] } }
    ] },

  // ================================================================ STAGE 6
  { id: 's6', title: 'Repertoire and Fluency',
    blurb: 'Turning skill into a set you can actually play when someone asks.',
    units: [

    { id: 'u23', title: 'Song forms',
      goal: 'Play 12-bar blues, 32-bar AABA and pop verse-chorus forms from memory in several keys.',
      why: 'Almost everything a singer brings you is one of these three shapes. Knowing the form means you can follow a song you have never heard after eight bars.',
      keys: ['C', 'F', 'Bb', 'G'],
      exercises: [
        { id: 'u23e1', title: 'Warm-up: 2-5-1 round the circle', type: 'warmup', role: 'warmup', minutes: 3,
          vary: WIDE,
          steps: ['Voice-led 2-5-1 with shells starting from {{key}}, six keys.'],
          target: 'Fluent.' },

        { id: 'u23e2', title: '12-bar blues', type: 'technique', role: 'core', minutes: 6,
          vary: ['C', 'F', 'Bb', 'G', 'Eb'], bpm: { start: 70, goal: 100 },
          steps: [
            { do: 'Form: 1 1 1 1 / 4 4 1 1 / 5 4 1 5.' },
            { do: 'All three chords are dominant sevenths.',
              note: 'In {{key}} that means {{1}}7, {{4}}7 and {{5}}7 — not the diatonic qualities.' },
            'One bar per chord with a shuffle feel — long-short on each pair of eighths.',
            'Four choruses without stopping.'
          ],
          target: 'Twelve-bar blues in three keys, four choruses each, without losing the form.',
          show: { chords: ['{{1}}7', '{{4}}7', '{{5}}7'] } },

        { id: 'u23e3', title: '32-bar AABA', type: 'technique', role: 'core', minutes: 6,
          vary: WIDE,
          steps: [
            { do: 'Eight bars of A, repeated, then a contrasting B, then A again.',
              note: 'Almost every jazz standard and mid-century vocal song is this shape.' },
            { do: 'A section: 1 6 2 5, two bars each.' },
            { do: 'B section: 4 4 1 1 with a 2-5 to get home.' },
            'Play the full 32 bars twice through in {{key}}, then one more key.'
          ],
          target: 'A full 32-bar chorus played twice without losing your place.',
          show: { numbers: '1 6 2 5', sevenths: true } },

        { id: 'u23e4', title: 'Follow an unknown song', type: 'ear', role: 'apply', minutes: 6,
          steps: [
            'Put on a song you do not know well.',
            { do: 'Listen eight bars before you touch anything.',
              note: 'Find the form, find beat 1, and decide whether the 1 chord is major or minor.' },
            'From bar 9, play just the root of each chord on beat 1.',
            'Second pass add triads. Third pass add the groove.'
          ],
          target: 'You can play the roots of an unfamiliar song correctly by the second chorus.' }
      ],
      checkpoint: { title: 'Forms',
        criteria: [
          '12-bar blues in three keys, four choruses each.',
          'Full 32-bar AABA played twice in two keys without losing your place.',
          'Play the roots of an unfamiliar song correctly by its second chorus.'
        ] } },

    { id: 'u24', title: 'Sight-reading a lead sheet',
      goal: 'Play through an unseen chord chart at tempo, first time, without stopping.',
      why: 'A singer hands you a chart four minutes before you play. The skill is not perfection, it is never stopping.',
      keys: WIDE,
      exercises: [
        { id: 'u24e1', title: 'Warm-up: random-key progressions', type: 'warmup', role: 'warmup', minutes: 3,
          tool: 'random-key',
          steps: ['Cold-call drill: three random keys, 1-5-6-4 in each.'],
          target: 'Under five seconds each.' },

        { id: 'u24e2', title: 'Scan before you play', type: 'theory', role: 'core', minutes: 4,
          steps: [
            { do: 'Scan in order: key, time, form, odd chords, last four bars.',
              note: 'Spend thirty seconds on exactly that list. The last four bars tell you how it ends, which is where most trains come off.' },
            'Find any chord chart online or in a songbook. Run the checklist out loud.',
            'Do it for three different charts.'
          ],
          target: 'A 30-second scan that catches the key, the form and the one hard chord.' },

        { id: 'u24e3', title: 'Never stop', type: 'technique', role: 'core', minutes: 6,
          bpm: { start: 60, goal: 90 }, tool: 'metronome',
          steps: [
            'Metronome at a deliberately slow tempo. Play an unseen chart.',
            { do: 'Cannot get the chord in time? Play the root alone, on the beat.',
              note: 'Rejoin at the next chord. A missed chord costs nothing; a stop costs the whole take.' },
            'Three different charts, one pass each, no stops.'
          ],
          target: 'Three unseen charts played through with no stops, roots covered even when chords are missed.' },

        { id: 'u24e4', title: 'Read and transpose at sight', type: 'apply', role: 'apply', minutes: 5,
          vary: WIDE,
          steps: [
            'Take a chart written in C. Play it in {{key}} at sight, converting through numbers.',
            'Then one more key.',
            'Slow tempo. No stopping.',
            { do: 'This is the hardest skill in the course.',
              note: 'Expect it to take many sessions. Slow and unbroken beats fast and stuttering.' }
          ],
          target: 'One full chart read and transposed at sight, no stops, at any tempo.' }
      ],
      checkpoint: { title: 'Reading',
        criteria: [
          'Run the 30-second scan on an unseen chart and name key, form and problem chords.',
          'Play three unseen charts with no stops.',
          'Read one chart and transpose it at sight into a new key without stopping.'
        ] } },

    { id: 'u25', title: 'Build your set',
      goal: 'Five songs, memorised, in a singer’s keys, playable start to finish on request.',
      why: 'This is the point of everything above. A set you can play cold is what makes you an accompanist rather than a student of accompaniment.',
      keys: ALL12,
      exercises: [
        { id: 'u25e1', title: 'Warm-up: your weakest key', type: 'warmup', role: 'warmup', minutes: 3,
          vary: ALL12,
          steps: ['Play 1-5-6-4, 1-6-4-5 and 2-5-1 in {{key}}.', 'If that key is easy now, pick your worst one instead.'],
          target: 'Getting easier each session.' },

        { id: 'u25e2', title: 'Choose and chart five songs', type: 'theory', role: 'core', minutes: 5,
          steps: [
            { do: 'Pick five songs.',
              note: 'One ballad, one mid-tempo pop, one blues or soul, one standard, and one of the singer’s choosing.' },
            'Write each in numbers, not letters, with the form marked.',
            'Note your default key and two alternatives — a tone up, a third down.'
          ],
          target: 'Five number charts with forms and three viable keys each.' },

        { id: 'u25e3', title: 'One song to performance standard', type: 'apply', role: 'core', minutes: 8,
          steps: [
            'Pick one of your five. Play it start to finish with intro, dynamic map and ending.',
            'Then play it in a second key.',
            'Then from memory, chart face down.',
            'Record it. Listen once. Fix the weakest moment. Record again.'
          ],
          target: 'One song played from memory, in two keys, with a clean intro and ending.' },

        { id: 'u25e4', title: 'Set run-through', type: 'apply', role: 'apply', minutes: 8,
          steps: [
            'Play all five back to back, as a set, no stopping and no charts.',
            'Four bars between songs to find the next key.',
            { do: 'Whatever falls apart is next session’s focus.' }
          ],
          target: 'Five songs back to back from memory, no stops.' }
      ],
      checkpoint: { title: 'Course complete — you can comp',
        criteria: [
          'Five songs charted in numbers with three viable keys each.',
          'Each song playable from memory with intro, dynamic shape and ending.',
          'A full five-song set played back to back with no charts and no stops.'
        ] } }
    ] }
  ];

  // ---- flatten for linear progression ----
  var UNITS = [];
  STAGES.forEach(function (s) {
    s.units.forEach(function (u) { u.stageId = s.id; u.stageTitle = s.title; UNITS.push(u); });
  });
  UNITS.forEach(function (u, i) { u.index = i; u.number = i + 1; });

  var EXERCISES = {};
  UNITS.forEach(function (u) {
    u.exercises.forEach(function (e) {
      e.unitId = u.id;
      e.unitNumber = u.number;
      // normalise steps to { do, note }
      e.steps = e.steps.map(function (s) {
        return typeof s === 'string' ? { do: s } : s;
      });
      EXERCISES[e.id] = e;
    });
  });

  /* Which key this exercise should be practised in on a given repetition. */
  function keyFor(ex, variant) {
    if (!ex) return 'C';
    if (ex.vary && ex.vary.length) return ex.vary[(variant || 0) % ex.vary.length];
    return (ex.show && ex.show.key) || 'C';
  }

  global.Curriculum = {
    stages: STAGES, units: UNITS, exercises: EXERCISES, keyFor: keyFor,
    unit: function (id) { return UNITS.filter(function (u) { return u.id === id; })[0]; },
    unitAt: function (i) { return UNITS[Math.max(0, Math.min(UNITS.length - 1, i))]; },
    count: UNITS.length
  };
})(typeof window !== 'undefined' ? window : this);
