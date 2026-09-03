/* curriculum.js — the linear syllabus.
   Everything is ordered. Unit N is unlocked when unit N-1's checkpoint passes.

   exercise fields:
     id, title, type, minutes, reps (target repetitions before the checkpoint),
     steps[]  — literal instructions, do them in order
     target   — how you know you did it right
     bpm      — {start, goal} when a metronome is involved
     show     — keyboard/chart display:
                {chords:[...], voicing, octave, hand} or {key, numbers, sevenths}
     role     — 'warmup' | 'core' | 'apply'  (drives session building)
*/
(function (global) {
  'use strict';

  var STAGES = [

  // ================================================================ STAGE 1
  { id: 's1', title: 'Chord Foundations',
    blurb: 'Get the shapes into your hands so you never hunt for a chord again.',
    units: [

    { id: 'u1', title: 'Hand shape and your first three chords',
      goal: 'Play C, F and G major triads in root position, hands separately, without looking at the keys.',
      why: 'Almost every song a singer brings you is built from three or four chords. These three are the spine of the key of C, and the shape you build here is the same shape in all 12 keys.',
      keys: ['C'],
      exercises: [
        { id: 'u1e1', title: 'Bench setup and hand arch', type: 'warmup', role: 'warmup', minutes: 2, reps: 5,
          steps: [
            'Sit so your elbows are level with (or a touch above) the white keys. Feet flat.',
            'Rest fingers 1-2-3-4-5 of the right hand on C D E F G. Curve the fingers like you are holding a tennis ball — knuckles up, not collapsed.',
            'Play each note slowly, one per second, letting the arm weight drop into the key rather than pressing with the finger alone.',
            'Repeat with the left hand on C D E F G an octave below (thumb on G, pinky on C).'
          ],
          target: 'Every note speaks evenly. No collapsed knuckles, no wrist below the key bed.' },

        { id: 'u1e2', title: 'Build C, F, G from the root', type: 'technique', role: 'core', minutes: 4, reps: 8,
          steps: [
            'A major triad is: root, skip a letter, skip a letter. C-E-G. F-A-C. G-B-D.',
            'Right hand fingers 1-3-5. Play C major. Lift. Play it again. Do that 5 times, saying "C E G" out loud.',
            'Same for F (F A C) and G (G B D).',
            'Now cycle C - F - G - C, four times, lifting the whole hand off between chords and landing without looking down.'
          ],
          target: 'You can land each chord blind, all three notes together, no rolling.',
          show: { chords: ['C', 'F', 'G'], octave: 4, hand: 'R' } },

        { id: 'u1e3', title: 'Blind landing drill', type: 'technique', role: 'core', minutes: 3, reps: 8,
          steps: [
            'Look at the ceiling, not your hands.',
            'Say a chord name out loud from C / F / G at random, then play it.',
            'If you miss, feel for the group of two/three black keys to re-orient — do not look.',
            'Do 20 landings.'
          ],
          target: '17 out of 20 landed correctly without looking.',
          show: { chords: ['C', 'F', 'G'], octave: 4, hand: 'R' } },

        { id: 'u1e4', title: 'Left hand roots', type: 'technique', role: 'core', minutes: 3, reps: 6,
          steps: [
            'Left hand, pinky (finger 5) on the C below middle C.',
            'Play the single root notes C, F, G. F and G are both a short reach — use finger 5 for C, 2 for F, 1 for G, or simply move the hand.',
            'Play root notes only, one per beat: C C F F G G C C.'
          ],
          target: 'Roots land on time with no hesitation between them.',
          show: { chords: ['C', 'F', 'G'], octave: 2, hand: 'L' } }
      ],
      checkpoint: { title: 'Three chords, blind',
        criteria: [
          'Play C, F, G in the right hand, root position, without looking, 18/20 correct.',
          'Say the three notes of each chord out loud correctly.',
          'Play the left-hand roots C, F, G on beat with no searching.'
        ] } },

    { id: 'u2', title: 'The minor three and the family of C',
      goal: 'Play all six workhorse chords of C major — C Dm Em F G Am — from memory, any order, within two seconds each.',
      why: 'A huge share of pop, folk, worship and singer-songwriter material never leaves these six chords. Owning them means you can already comp hundreds of songs in one key.',
      keys: ['C'],
      exercises: [
        { id: 'u2e1', title: 'Warm-up: C F G round', type: 'warmup', role: 'warmup', minutes: 2, reps: 10,
          steps: ['Right hand: C - F - G - C, twice.', 'Left hand roots along with it.', 'Once more, eyes closed.'],
          target: 'Clean, no hunting.', show: { chords: ['C', 'F', 'G'], octave: 4, hand: 'R' } },

        { id: 'u2e2', title: 'Minor is one note lower', type: 'technique', role: 'core', minutes: 4, reps: 8,
          steps: [
            'Play C major (C E G). Now lower the middle note by one key: C Eb G. That is C minor. The middle note is the only difference between major and minor.',
            'Build Dm (D F A), Em (E G B), Am (A C E) — all white keys.',
            'Play each 5 times, saying the notes aloud.',
            'Alternate C - Am - F - Dm - G - Em - C, listening for the mood flip between each major and minor.'
          ],
          target: 'You can hear the difference and name which is which with your eyes closed.',
          show: { chords: ['Dm', 'Em', 'Am'], octave: 4, hand: 'R' } },

        { id: 'u2e3', title: 'The six-chord random drill', type: 'technique', role: 'core', minutes: 4, reps: 12,
          steps: [
            'Pool: C, Dm, Em, F, G, Am.',
            'Use the Random Chord button on this screen (or shuffle six slips of paper).',
            'Land each called chord within two seconds. 24 calls.',
            'Keep the left hand playing the root of each chord at the same time.'
          ],
          target: '22/24 landed within two seconds, both hands.',
          show: { chords: ['C', 'Dm', 'Em', 'F', 'G', 'Am'], octave: 4, hand: 'R' },
          tool: 'random-chord' },

        { id: 'u2e4', title: 'First real progression: 1 5 6 4', type: 'song', role: 'apply', minutes: 4, reps: 10,
          steps: [
            'In C that is C - G - Am - F. This progression is the engine of a hundred pop songs.',
            'Play two beats per chord, left hand root, right hand triad. Slow.',
            'Then four beats per chord, and sing or hum any melody over the top — badly is fine, the point is splitting your attention.',
            'Loop it eight times without stopping. If you stumble, keep going in time — never stop to fix.'
          ],
          target: 'Eight loops with no stops. Stumbles are allowed, stopping is not.',
          show: { key: 'C', numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'The family of C',
        criteria: [
          'Name and play all six chords of C major on demand, under two seconds each.',
          'Play C - G - Am - F for eight loops with both hands, no stopping.',
          'Tell major from minor by ear, 8 out of 10.'
        ] } },

    { id: 'u3', title: 'Inversions: three ways to play every chord',
      goal: 'Play every chord in the key of C in root position, 1st and 2nd inversion, and name which is which.',
      why: 'Root position only is what makes a beginner sound like a beginner — the hand leaps around and the chords sound blocky and low. Inversions are how you stay in one small area of the keyboard and sound smooth.',
      keys: ['C'],
      exercises: [
        { id: 'u3e1', title: 'Warm-up: six-chord round', type: 'warmup', role: 'warmup', minutes: 2, reps: 12,
          steps: ['Play C Dm Em F G Am in order, two beats each, both hands.', 'Then backwards.'],
          target: 'No hesitation.', show: { chords: ['C', 'Dm', 'Em', 'F', 'G', 'Am'], octave: 4, hand: 'R' } },

        { id: 'u3e2', title: 'Move the bottom note to the top', type: 'technique', role: 'core', minutes: 5, reps: 10,
          steps: [
            'Play C major: C E G (root position). Take the C and move it up an octave: E G C — that is 1st inversion.',
            'Do it again: take the E to the top: G C E — 2nd inversion.',
            'Once more and you are back at C E G an octave up.',
            'Climb this ladder up two octaves and back down, right hand, then left hand.',
            'Repeat for F and G.'
          ],
          target: 'You can climb and descend the inversion ladder smoothly on C, F and G.',
          show: { chords: ['C', 'C', 'C'], inversions: [0, 1, 2], octave: 4, hand: 'R' } },

        { id: 'u3e3', title: 'Name that inversion', type: 'theory', role: 'core', minutes: 3, reps: 8,
          steps: [
            'The inversion is named by which chord tone is on the bottom. Root on bottom = root position. 3rd on bottom = 1st inversion. 5th on bottom = 2nd inversion.',
            'Play a random chord from the key of C in a random inversion.',
            'Before you look, say which inversion you played and what note is on top.',
            'Twelve reps.'
          ],
          target: '10/12 correctly identified.' },

        { id: 'u3e4', title: 'Closest-shape drill', type: 'technique', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Play C in root position (C E G).',
            'Now play F — but instead of jumping down to F A C, find the inversion of F that is closest to where your hand already is. That is C F A (2nd inversion).',
            'Then G: the closest is B D G (1st inversion).',
            'Play C - F - G - C using only these close shapes. Your hand should barely move.'
          ],
          target: 'Your hand stays within a five-note span for the whole progression.',
          show: { chords: ['C', 'F/C', 'G/B', 'C'], octave: 4, hand: 'R' } }
      ],
      checkpoint: { title: 'Inversions on demand',
        criteria: [
          'Play any chord in the key of C in any of its three positions when called.',
          'Climb the inversion ladder up and down two octaves on C, F and G.',
          'Play C - F - G - C with the hand staying inside one five-note span.'
        ] } },

    { id: 'u4', title: 'Voice leading: stop jumping',
      goal: 'Play 1-5-6-4 and 1-6-4-5 in C with nearest-note motion — no hand jumps larger than a third.',
      why: 'Smooth voice leading is the single biggest sound upgrade available to you. It is also what lets you comp quietly under a singer without the accompaniment jumping around and distracting them.',
      keys: ['C'],
      exercises: [
        { id: 'u4e1', title: 'Warm-up: inversion ladder', type: 'warmup', role: 'warmup', minutes: 2, reps: 12,
          steps: ['Climb the inversion ladder on C, then F, then G, up and back.'],
          target: 'Even and smooth.' },

        { id: 'u4e2', title: 'Common-tone rule', type: 'technique', role: 'core', minutes: 5, reps: 10,
          steps: [
            'Rule: when moving between chords, any note the two chords share stays where it is. Everything else moves to the nearest available note.',
            'C (C E G) to Am (A C E): C and E are shared. Keep them. G moves down to A. Result: C E A.',
            'Work out the same way from Am to F (A C F) and F back to C (C E G becomes G C E if that is closer).',
            'Play C - Am - F - C slowly, checking each move against the rule.'
          ],
          target: 'You can state which notes are shared at each change before you play it.',
          show: { chords: ['C', 'Am/C', 'F/C', 'C'], octave: 4, hand: 'R' } },

        { id: 'u4e3', title: '1-5-6-4 voice-led, both hands', type: 'core', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Right hand voice-led shapes for C - G - Am - F in C: C E G, then B D G, then C E A, then C F A.',
            'Left hand plays the actual root each time, low: C, G, A, F. The left hand names the chord; the right hand just colours it.',
            'Four beats per chord at 60 bpm. Then two beats per chord.',
            'Loop eight times without stopping.'
          ],
          target: 'Eight clean loops at 70 bpm, right hand inside one span, left hand on the roots.',
          bpm: { start: 60, goal: 80 },
          show: { chords: ['C', 'G/B', 'Am/C', 'F/C'], octave: 4, hand: 'R' } },

        { id: 'u4e4', title: '1-6-4-5 (the doo-wop turn)', type: 'song', role: 'apply', minutes: 4, reps: 10,
          steps: [
            'C - Am - F - G. Voice-lead it the same way.',
            'Four beats each, then two beats each.',
            'Hum a melody over it. Notice how the G at the end pulls you back to C.'
          ],
          target: 'Eight loops at 70 bpm without stopping.',
          bpm: { start: 60, goal: 80 },
          show: { key: 'C', numbers: '1 6 4 5' } }
      ],
      checkpoint: { title: 'Smooth changes',
        criteria: [
          'Play 1-5-6-4 in C, voice-led, both hands, 8 loops at 70 bpm with no stops.',
          'Play 1-6-4-5 in C the same way.',
          'Explain out loud which notes are shared between any two chords in the key of C.'
        ] } },

    { id: 'u5', title: 'Two hands, one groove',
      goal: 'Left hand root or root-fifth, right hand voice-led triad, held steady against a metronome at 80 bpm.',
      why: 'This is the basic working posture of an accompanist: the left hand owns the harmony floor, the right hand owns the texture. Everything later in this course sits on top of it.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u5e1', title: 'Warm-up: voice-led 1-5-6-4', type: 'warmup', role: 'warmup', minutes: 2, reps: 15,
          steps: ['Two loops of 1-5-6-4 in C, voice-led, both hands, slow.'],
          target: 'Smooth.', show: { key: 'C', numbers: '1 5 6 4' } },

        { id: 'u5e2', title: 'Root and root-fifth in the left hand', type: 'technique', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Left hand: play the root alone, low. Then the root with the fifth above it (C with G, finger 5 and 1). This is a fuller, more stable floor.',
            'Play C5, G5, A5, F5 (root-fifth shapes) under the 1-5-6-4 progression.',
            'Avoid playing full triads down low — below the C two octaves under middle C, three-note chords turn to mud. Roots and fifths only down there.'
          ],
          target: 'Left hand root-fifth shapes on all four chords, no mud.',
          show: { chords: ['C5', 'G5', 'Am', 'F5'], octave: 2, hand: 'L' } },

        { id: 'u5e3', title: 'Metronome lock-in', type: 'groove', role: 'core', minutes: 5, reps: 15,
          steps: [
            'Metronome at 70. One chord per bar, played on beat 1 only, and hold it for four beats.',
            'The metronome click should disappear underneath your chord if you are exactly on it.',
            'Move to 80 bpm. Then try one chord per two beats.',
            'Four minutes without stopping the metronome, whatever happens.'
          ],
          target: 'You land on beat 1 consistently at 80 bpm and can feel when you rush.',
          bpm: { start: 70, goal: 90 }, tool: 'metronome' },

        { id: 'u5e4', title: 'Same thing in G', type: 'keys', role: 'apply', minutes: 4, reps: 10,
          steps: [
            'Key of G. The six chords are G, Am, Bm, C, D, Em. Only one black key in the whole key: F#.',
            '1-5-6-4 in G is G - D - Em - C.',
            'Voice-lead it, both hands, four beats each at 70 bpm.',
            'Loop eight times.'
          ],
          target: 'Eight loops in G at 70 bpm.',
          bpm: { start: 60, goal: 80 },
          show: { key: 'G', numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'Stage 1 exit — the working posture',
        criteria: [
          'Play 1-5-6-4 in both C and G, voice-led, left hand root-fifth, 8 loops at 80 bpm with a metronome, no stops.',
          'Play 1-6-4-5 in C at 80 bpm.',
          'Name every chord in the keys of C and G on demand.'
        ] } }
    ] },

  // ================================================================ STAGE 2
  { id: 's2', title: 'Rhythm and Groove',
    blurb: 'Chords are not music until they have a pulse. This is where you start to sound like an accompanist.',
    units: [

    { id: 'u6', title: 'Counting out loud and the steady quarter',
      goal: 'Comp 1-5-6-4 in quarter notes at 90 bpm while counting "1 2 3 4" out loud, without losing either.',
      why: 'A singer will forgive a wrong chord. They will not forgive an unsteady one — they are relying on you for time. Counting out loud is the drill that makes your time external and reliable.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u6e1', title: 'Warm-up: hands together in C and G', type: 'warmup', role: 'warmup', minutes: 2, reps: 20,
          steps: ['One loop of 1-5-6-4 in C, one in G, voice-led, slow.'], target: 'Clean.' },

        { id: 'u6e2', title: 'Count out loud, play on every beat', type: 'groove', role: 'core', minutes: 5, reps: 15,
          steps: [
            'Metronome at 70. Count "1 2 3 4" out loud, at conversational volume, for four bars before you play anything.',
            'Now play the right-hand chord on every single beat while still counting out loud. Left hand plays the root on beat 1 only.',
            'One chord per bar: C / G / Am / F.',
            'If your counting stops, you have lost. Restart. Build to 90 bpm.'
          ],
          target: 'Four minutes at 90 bpm with the counting never dropping out.',
          bpm: { start: 70, goal: 90 }, tool: 'metronome',
          show: { key: 'C', numbers: '1 5 6 4' } },

        { id: 'u6e3', title: 'Half-bar changes', type: 'groove', role: 'core', minutes: 4, reps: 12,
          steps: [
            'Same drill, but change chord every two beats: C C G G Am Am F F becomes two chords per bar.',
            'Left hand root on each chord change, right hand on every beat.',
            '80 bpm. Then 90.'
          ],
          target: 'Chord changes land exactly on 1 and 3, no early or late.',
          bpm: { start: 80, goal: 100 }, tool: 'metronome' },

        { id: 'u6e4', title: 'Where is beat 1?', type: 'ear', role: 'apply', minutes: 3, reps: 8,
          steps: [
            'Put on any pop song you like.',
            'Clap only on beat 1 of each bar for a full minute.',
            'Then clap on 2 and 4 (the backbeat) for a minute.',
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
      goal: 'Play a steady eighth-note right-hand pattern with left-hand roots on 1, in C and G, at 80 bpm.',
      why: 'This is the default modern pop accompaniment — the thing you will play behind more singers than anything else. It fills space without stepping on the vocal.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u7e1', title: 'Warm-up: quarters with counting', type: 'warmup', role: 'warmup', minutes: 2, reps: 20,
          steps: ['One minute of quarter-note comping in C at 80, counting out loud.'], target: 'Steady.' },

        { id: 'u7e2', title: 'Count in eighths', type: 'groove', role: 'core', minutes: 4, reps: 12,
          steps: [
            'Metronome at 70, still clicking quarters.',
            'Count "1 and 2 and 3 and 4 and" out loud, evenly. The "and" falls exactly between clicks.',
            'Tap eighths on your knee while the click plays quarters.',
            'Now play the right-hand chord on all eight eighths of each bar. Keep it light — this is a texture, not an attack.'
          ],
          target: 'Your eighths are even; the "and" is exactly halfway, not rushed.',
          bpm: { start: 70, goal: 85 }, tool: 'metronome' },

        { id: 'u7e3', title: 'Pad it: hold the top, pulse the bottom', type: 'groove', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Right hand plays the voice-led triad. Instead of hitting all three notes on every eighth, hold the top note and pulse the lower two.',
            'Play through 1-5-6-4 in C at 75 bpm using this texture.',
            'Left hand: root on beat 1, and the fifth on beat 3. So under C: C on 1, G on 3.',
            'Eight loops without stopping.'
          ],
          target: 'Continuous eighth pulse, no gaps at the chord changes.',
          bpm: { start: 75, goal: 90 },
          show: { key: 'C', numbers: '1 5 6 4' } },

        { id: 'u7e4', title: 'Pad in G and F', type: 'keys', role: 'apply', minutes: 4, reps: 10,
          steps: [
            'Same eighth pad, 1-5-6-4 in G (G D Em C), then in F (F C Dm Bb).',
            'F has one flat: Bb. The Bb chord is Bb D F.',
            'Four loops in each key at 75 bpm.'
          ],
          target: 'The pattern survives the key change — same feel, different notes.',
          bpm: { start: 70, goal: 85 },
          show: { key: 'G', numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'The pad',
        criteria: [
          'Play the eighth-note pad through 1-5-6-4 in C, G and F at 80 bpm, 8 loops each, no gaps.',
          'Your eighths are even against a quarter-note click.',
          'Left hand covers root on 1 and fifth on 3 without disturbing the right hand.'
        ] } },

    { id: 'u8', title: 'Broken chords and the ballad arpeggio',
      goal: 'Play a rolling arpeggio accompaniment through a four-chord progression in 4/4 and in 6/8.',
      why: 'Ballads are where singers are most exposed and most often ask for piano only. A rolling arpeggio gives them a bed of harmony with none of the percussive attack of block chords.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u8e1', title: 'Warm-up: eighth pad', type: 'warmup', role: 'warmup', minutes: 2, reps: 15,
          steps: ['One minute of the eighth pad in C at 80.'], target: 'Even.' },

        { id: 'u8e2', title: 'The 1-5-8-5 roll', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Take C major spread over an octave: C (low), G, C (high), G. Play those four notes one per beat, left hand.',
            'This is the classic rolling bass. Do it on C, F, G, Am.',
            'Now right hand plays the plain triad on beat 1 while the left hand rolls underneath.',
            '70 bpm, four bars per chord, then one bar per chord.'
          ],
          target: 'The roll is even and the right-hand chord lands exactly on 1.',
          bpm: { start: 65, goal: 85 },
          show: { chords: ['C', 'F', 'G', 'Am'], voicing: 'open', octave: 3, hand: 'L' } },

        { id: 'u8e3', title: 'Alberti bass', type: 'technique', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Alberti pattern is low - high - middle - high. On C major (C E G): C G E G.',
            'Left hand, one note per eighth. Slow at first.',
            'Run it through C - Am - F - G, one bar each.',
            'Right hand adds the top note of the chord only, held for the whole bar.'
          ],
          target: 'Even Alberti pattern at 70 bpm through four chords.',
          bpm: { start: 60, goal: 80 } },

        { id: 'u8e4', title: '6/8 ballad feel', type: 'groove', role: 'apply', minutes: 5, reps: 10,
          steps: [
            'Count "1 2 3 4 5 6" with weight on 1 and 4. This is the slow-ballad feel behind a huge number of vocal standards.',
            'Left hand: root on 1, fifth on 4.',
            'Right hand: arpeggiate the triad upward across each group of three — three notes on 1-2-3, three notes on 4-5-6.',
            'Play C - Am - F - G, one bar per chord, at 60 bpm (dotted-quarter feel).'
          ],
          target: 'The 6/8 lilt is audible — 1 and 4 are clearly stronger than the rest.',
          bpm: { start: 55, goal: 75 },
          show: { key: 'C', numbers: '1 6 4 5' } }
      ],
      checkpoint: { title: 'Ballad textures',
        criteria: [
          'Play the 1-5-8-5 roll through four chords at 80 bpm, evenly.',
          'Play Alberti bass through four chords at 75 bpm.',
          'Play a 6/8 arpeggiated accompaniment through 1-6-4-5 with the lilt clearly audible.'
        ] } },

    { id: 'u9', title: 'Syncopation and the push',
      goal: 'Play a syncopated pop comping pattern, and anticipate a chord change by an eighth note ("the push").',
      why: 'Straight on-the-beat comping sounds stiff behind a singer phrasing freely. The push — arriving at the new chord an eighth early — is the single most useful rhythmic trick in pop accompaniment.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u9e1', title: 'Warm-up: eighths and counting', type: 'warmup', role: 'warmup', minutes: 2, reps: 15,
          steps: ['Count "1 and 2 and 3 and 4 and" out loud with a click at 80 for one minute while padding in C.'],
          target: 'Even.' },

        { id: 'u9e2', title: 'Play only the offbeats', type: 'groove', role: 'core', minutes: 4, reps: 12,
          steps: [
            'Metronome at 70. Play the right-hand chord ONLY on the "ands" — never on the click itself.',
            'This will feel wrong for the first minute. Keep going.',
            'Left hand plays the root on the click, so the two hands alternate.',
            'Three minutes. Build to 85 bpm.'
          ],
          target: 'You can sit on the offbeat for three minutes without drifting onto the beat.',
          bpm: { start: 70, goal: 85 }, tool: 'metronome' },

        { id: 'u9e3', title: 'The Charleston pattern', type: 'groove', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Pattern: hit on beat 1, then on the "and of 2". Rest for the remainder of the bar. Count: "1 (2) and (3) (4)".',
            'This two-hit pattern is the backbone of a huge amount of comping.',
            'Play it through C - G - Am - F, one bar each, at 75 bpm.',
            'Then vary: hit on 1 and the "and of 3".'
          ],
          target: 'The pattern is locked and repeatable at 85 bpm through a four-chord loop.',
          bpm: { start: 70, goal: 90 }, tool: 'metronome',
          show: { key: 'C', numbers: '1 5 6 4' } },

        { id: 'u9e4', title: 'The push', type: 'groove', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Normally you change chord on beat 1. Now arrive an eighth note early — on the "and of 4" of the previous bar — and hold through.',
            'Play 1-5-6-4 in C, pushing every chord change.',
            'Left hand can either push with the right, or stay on beat 1. Try both; pushing both hands is punchier, pushing only the right hand is smoother.',
            'Eight loops at 75 bpm.'
          ],
          target: 'Every chord arrives an eighth early, consistently, without the tempo drifting forward.',
          bpm: { start: 70, goal: 90 } }
      ],
      checkpoint: { title: 'Rhythmic independence',
        criteria: [
          'Comp on offbeats only for three minutes at 85 bpm without drifting.',
          'Play the Charleston pattern through a four-chord loop at 85 bpm.',
          'Push every chord change by an eighth through 1-5-6-4 without speeding up.'
        ] } },

    { id: 'u10', title: 'Dynamics and space',
      goal: 'Comp the same progression four ways — sparse, pad, rhythmic, full — and switch between them on cue without stopping.',
      why: 'Accompanying is mostly about what you leave out. The singer owns the melody and the top of the texture; your job is to support and then get out of the way. Being able to change density on demand is what makes you pleasant to sing with.',
      keys: ['C', 'G'],
      exercises: [
        { id: 'u10e1', title: 'Warm-up: Charleston in C', type: 'warmup', role: 'warmup', minutes: 2, reps: 12,
          steps: ['One minute of the Charleston pattern in C at 80.'], target: 'Locked.' },

        { id: 'u10e2', title: 'The four density levels', type: 'technique', role: 'core', minutes: 6, reps: 12,
          steps: [
            'Level 1 — Sparse: left-hand root on beat 1 only, right hand two notes held. Nothing else.',
            'Level 2 — Pad: eighth-note pulse, quiet, mid-register.',
            'Level 3 — Rhythmic: Charleston or pushed pattern, left hand root-fifth.',
            'Level 4 — Full: octave in the left hand, four-note right-hand chord, driving eighths.',
            'Play 1-5-6-4 in C for two loops at each level, moving up. Then come back down.'
          ],
          target: 'Four clearly different densities that are recognisably the same progression.',
          show: { key: 'C', numbers: '1 5 6 4' } },

        { id: 'u10e3', title: 'Stay out of the singer register', type: 'technique', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Most singers live between about G3 and G5 — that is the octave below middle C up to the octave above.',
            'Play your right-hand voicings so the top note stays at or below the C above middle C when a singer is singing.',
            'Play 1-5-6-4 in C keeping every right-hand note between middle C and the C above it.',
            'Now deliberately play it an octave too high and hear how it fights an imagined vocal line.'
          ],
          target: 'You can keep the whole right hand inside one octave above middle C for a full progression.' },

        { id: 'u10e4', title: 'Verse-chorus dynamic map', type: 'apply', role: 'apply', minutes: 5, reps: 10,
          steps: [
            'Take 1-5-6-4 in C as your "verse" and 4-5-6-1 (F G Am C) as your "chorus".',
            'Play: verse twice at Level 1, verse twice at Level 2, chorus twice at Level 4, back to verse at Level 2.',
            'No stopping between sections. The change in density should be obvious from across the room.',
            'Play it twice through.'
          ],
          target: 'A listener could tell you where the chorus starts with their eyes closed.' }
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
      goal: 'Convert any chord chart to Nashville numbers and back, and play 1-5-6-4 and 1-6-4-5 by number in C, G and F.',
      why: 'This is the skill that separates an accompanist from someone who has memorised songs. Singers routinely say "can we do it a step lower" ten seconds before you start. If you have memorised letters you are stuck; if you have memorised numbers you just move.',
      keys: ['C', 'G', 'F'],
      exercises: [
        { id: 'u11e1', title: 'Warm-up: the six chords in three keys', type: 'warmup', role: 'warmup', minutes: 3, reps: 20,
          steps: ['Play the six workhorse chords of C, then G, then F, two beats each.'],
          target: 'No hesitation in any of the three keys.' },

        { id: 'u11e2', title: 'Number the scale', type: 'theory', role: 'core', minutes: 4, reps: 10,
          steps: [
            'In any major key, the chords built on the scale are: 1 major, 2 minor, 3 minor, 4 major, 5 major, 6 minor, 7 diminished. This never changes.',
            'Say the numbers and chords of C out loud: 1 = C, 2 = Dm, 3 = Em, 4 = F, 5 = G, 6 = Am.',
            'Do the same for G: 1 = G, 2 = Am, 3 = Bm, 4 = C, 5 = D, 6 = Em.',
            'And F: 1 = F, 2 = Gm, 3 = Am, 4 = Bb, 5 = C, 6 = Dm.',
            'Cover the answers. Someone calls a key and a number; you say the chord within two seconds.'
          ],
          target: 'Any number in C, G or F named correctly within two seconds.',
          tool: 'number-drill' },

        { id: 'u11e3', title: 'Translate a chart', type: 'theory', role: 'core', minutes: 4, reps: 8,
          steps: [
            'Write out this chart in numbers: C | Am | F | G | C | Am | F | G.',
            'Answer: 1 6 4 5, twice.',
            'Now write it out in G, then in F, using the numbers.',
            'Do the same for: G | Em | C | D  and  F | Dm | Bb | C.'
          ],
          target: 'You can convert a letter chart to numbers and back into any of the three keys on paper.' },

        { id: 'u11e4', title: 'Play by number', type: 'keys', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Set the progression to 1 5 6 4. Do not think about letters.',
            'Play it in C. Then immediately in G. Then immediately in F. No pause between keys.',
            'Then 1 6 4 5 the same way.',
            'Then 6 4 1 5 (the "sensitive" turn) in all three.'
          ],
          target: 'Three progressions, three keys, no pause to work out letters.',
          show: { key: 'G', numbers: '6 4 1 5' } }
      ],
      checkpoint: { title: 'Thinking in numbers',
        criteria: [
          'Name any diatonic chord by number in C, G and F within two seconds.',
          'Convert a letter chart to numbers and re-voice it in a new key.',
          'Play 1-5-6-4, 1-6-4-5 and 6-4-1-5 in C, G and F back to back without pausing.'
        ] } },

    { id: 'u12', title: 'The sharp keys: G, D, A, E',
      goal: 'Play the six workhorse chords and the three core progressions in G, D, A and E.',
      why: 'These are guitar keys. If a singer works with a guitarist — and most do — this is where their material lives. D and A in particular come up constantly.',
      keys: ['G', 'D', 'A', 'E'],
      exercises: [
        { id: 'u12e1', title: 'Warm-up: numbers in C, G, F', type: 'warmup', role: 'warmup', minutes: 3, reps: 20,
          steps: ['Play 1-5-6-4 in C, G, F, one loop each, no pause.'], target: 'Fluent.' },

        { id: 'u12e2', title: 'Learn the sharps', type: 'theory', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Sharps arrive in order: F#, C#, G#, D#. G has 1 (F#). D has 2 (F#, C#). A has 3 (F#, C#, G#). E has 4 (F#, C#, G#, D#).',
            'Play the major scale of each with the correct sharps, right hand, one octave, slowly.',
            'Say the sharps out loud for each key before you play it.'
          ],
          target: 'You can say and play the scale of G, D, A and E with correct sharps.',
          show: { key: 'D', numbers: '1 2 3 4 5 6' } },

        { id: 'u12e3', title: 'The six chords in D and A', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'D: D, Em, F#m, G, A, Bm. A: A, Bm, C#m, D, E, F#m.',
            'Play each set slowly, two beats per chord, voice-led.',
            'Note that the minor chords here sit on black keys — the thumb should avoid black keys where possible, so use inversions.',
            'Random-call drill: 20 chords across D and A.'
          ],
          target: '18/20 landed within two seconds in D and A.',
          show: { chords: ['D', 'Em', 'F#m', 'G', 'A', 'Bm'], octave: 4, hand: 'R' },
          tool: 'random-chord' },

        { id: 'u12e4', title: 'Progressions in E', type: 'keys', role: 'apply', minutes: 5, reps: 10,
          steps: [
            'E: E, F#m, G#m, A, B, C#m.',
            'Play 1-5-6-4 in E (E B C#m A) with the eighth-note pad.',
            'Then 1-6-4-5 (E C#m A B).',
            'Four loops of each at 75 bpm. E feels awkward at first; that is normal and it passes with reps.'
          ],
          target: 'Both progressions in E, four loops each, no stops.',
          bpm: { start: 65, goal: 85 },
          show: { key: 'E', numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'Sharp keys',
        criteria: [
          'Name and play all six workhorse chords in G, D, A and E.',
          'Play 1-5-6-4 and 1-6-4-5 in each of those four keys at 75 bpm.',
          'State the sharps in each key without thinking.'
        ] } },

    { id: 'u13', title: 'The flat keys: F, Bb, Eb, Ab',
      goal: 'Play the six workhorse chords and the three core progressions in F, Bb, Eb and Ab.',
      why: 'Flat keys are singer keys and horn keys. Standards, soul, gospel and jazz vocal material lives here, and a lot of female vocal ranges land in Eb and Ab.',
      keys: ['F', 'Bb', 'Eb', 'Ab'],
      exercises: [
        { id: 'u13e1', title: 'Warm-up: sharp-key round', type: 'warmup', role: 'warmup', minutes: 3, reps: 20,
          steps: ['1-5-6-4 in G, D, A, one loop each.'], target: 'Fluent.' },

        { id: 'u13e2', title: 'Learn the flats', type: 'theory', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Flats arrive in order: Bb, Eb, Ab, Db. F has 1 (Bb). Bb has 2 (Bb, Eb). Eb has 3 (Bb, Eb, Ab). Ab has 4 (Bb, Eb, Ab, Db).',
            'Play each major scale, right hand, one octave, slowly, saying the flats first.',
            'Flat keys are physically easier than they look — the black keys give your longer fingers somewhere to sit.'
          ],
          target: 'Scales of F, Bb, Eb and Ab with correct flats.',
          show: { key: 'Eb', numbers: '1 2 3 4 5 6' } },

        { id: 'u13e3', title: 'The six chords in Bb and Eb', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Bb: Bb, Cm, Dm, Eb, F, Gm. Eb: Eb, Fm, Gm, Ab, Bb, Cm.',
            'Play each set voice-led, two beats per chord.',
            'Let fingers 2, 3 and 4 take the black keys and keep the thumb on whites where you can.',
            'Random-call drill: 20 chords across Bb and Eb.'
          ],
          target: '18/20 landed within two seconds.',
          show: { chords: ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm'], octave: 4, hand: 'R' },
          tool: 'random-chord' },

        { id: 'u13e4', title: 'Progressions in Ab', type: 'keys', role: 'apply', minutes: 5, reps: 10,
          steps: [
            'Ab: Ab, Bbm, Cm, Db, Eb, Fm.',
            '1-5-6-4 in Ab is Ab - Eb - Fm - Db.',
            'Play it with the eighth pad, four loops at 70 bpm.',
            'Then 6-4-1-5 (Fm Db Ab Eb), four loops.'
          ],
          target: 'Both progressions in Ab, four loops each.',
          bpm: { start: 65, goal: 80 },
          show: { key: 'Ab', numbers: '1 5 6 4' } }
      ],
      checkpoint: { title: 'Flat keys',
        criteria: [
          'Name and play all six workhorse chords in F, Bb, Eb and Ab.',
          'Play 1-5-6-4 and 6-4-1-5 in each at 70 bpm.',
          'State the flats in each key without thinking.'
        ] } },

    { id: 'u14', title: 'Transpose on demand',
      goal: 'Take any four-chord progression and play it in any of the 12 keys within five seconds of being told the key.',
      why: 'This is the pay-off of the whole stage, and the moment you become genuinely useful to a singer. "Can we take it down a third?" stops being a problem.',
      keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#'],
      exercises: [
        { id: 'u14e1', title: 'Warm-up: circle of fifths roots', type: 'warmup', role: 'warmup', minutes: 3, reps: 20,
          steps: [
            'Play single root notes around the circle of fifths: C G D A E B F# Db Ab Eb Bb F, back to C.',
            'Then play major triads on each, root position.'
          ],
          target: 'All the way round without stopping.',
          show: { chords: ['C', 'G', 'D', 'A', 'E', 'B'], octave: 4, hand: 'R' } },

        { id: 'u14e2', title: '1-5-6-4 around the circle', type: 'keys', role: 'core', minutes: 6, reps: 15,
          steps: [
            'Play 1-5-6-4, one loop, in C. Then move to G. Then D. Then A. Keep going all the way round the circle of fifths.',
            'Two beats per chord. Do not stop between keys.',
            'If you get stuck in a key, play just the roots in that key and move on. Come back to it next session.'
          ],
          target: 'All 12 keys in one continuous pass.',
          bpm: { start: 60, goal: 80 } },

        { id: 'u14e3', title: 'Up a step, down a third', type: 'keys', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Singers usually ask for small moves. The four most common: up a half step, up a whole step, down a whole step, down a minor third.',
            'Play 1-6-4-5 in C. Now immediately in D (up a step). Now in Bb (down a step). Now in A (down a minor third).',
            'Repeat starting from G, then from F.',
            'Say the new key out loud before you play it.'
          ],
          target: 'You can shift by any of those four intervals from any starting key without calculating on paper.' },

        { id: 'u14e4', title: 'Cold-call transposition', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Use the Random Key button. It will call a key and a progression.',
            'You have five seconds to start playing. Play two loops, then take the next call.',
            'Twelve calls.',
            'Score yourself: how many did you start inside five seconds?'
          ],
          target: '10/12 started within five seconds.',
          tool: 'random-key' }
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
      goal: 'Play maj7, m7 and dominant 7 chords in any key, and know which one belongs on each degree of the scale.',
      why: 'Triads are the skeleton; sevenths are the sound of adult music. Nearly every ballad, standard, soul and R&B chart a singer hands you will be written in sevenths.',
      keys: ['C', 'F', 'Bb'],
      exercises: [
        { id: 'u15e1', title: 'Warm-up: triads round the circle', type: 'warmup', role: 'warmup', minutes: 3, reps: 20,
          steps: ['Major triads around the circle of fifths, then minor triads.'], target: 'Continuous.' },

        { id: 'u15e2', title: 'The three sevenths', type: 'theory', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Take a major triad and add a note a whole step below the root, up an octave. C E G + B = Cmaj7. Warm, floating.',
            'Lower that added note by a half step: C E G + Bb = C7 (dominant). Restless, wants to move.',
            'Now use a minor triad plus the same lowered note: C Eb G + Bb = Cm7. Smooth, neutral.',
            'Play Cmaj7, C7, Cm7 back to back and listen. Then do the same on F and on G.'
          ],
          target: 'You can build and hear the difference between the three seventh types on any root.',
          show: { chords: ['Cmaj7', 'C7', 'Cm7'], octave: 4, hand: 'R' } },

        { id: 'u15e3', title: 'Sevenths in the key', type: 'theory', role: 'core', minutes: 5, reps: 12,
          steps: [
            'In any major key the sevenths are: 1 = maj7, 2 = m7, 3 = m7, 4 = maj7, 5 = dominant 7, 6 = m7, 7 = m7b5.',
            'Only the 5 chord is dominant. That is why the 5 chord pulls home so strongly.',
            'Play all seven in C: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5.',
            'Then all seven in F, then in Bb.'
          ],
          target: 'All seven diatonic sevenths played correctly in C, F and Bb.',
          show: { key: 'C', numbers: '1 2 3 4 5 6 7', sevenths: true } },

        { id: 'u15e4', title: 'Sevenths in a progression', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Play 1-6-4-5 in C as plain triads: C Am F G.',
            'Now play it as sevenths: Cmaj7 Am7 Fmaj7 G7. Same progression, completely different colour.',
            'Add the eighth-note pad. Keep the right hand inside one octave — use inversions, do not stack all four notes from the root every time.',
            'Four loops in C, four in F.'
          ],
          target: 'The seventh version sounds richer, not muddier — that means you inverted rather than stacking low.',
          bpm: { start: 65, goal: 85 },
          show: { key: 'C', numbers: '1 6 4 5', sevenths: true } }
      ],
      checkpoint: { title: 'Sevenths',
        criteria: [
          'Build maj7, dominant 7 and m7 on any root within three seconds.',
          'Play all seven diatonic sevenths in C, F and Bb.',
          'Play 1-6-4-5 in sevenths with a pad, right hand inside one octave, in two keys.'
        ] } },

    { id: 'u16', title: 'Sus chords, add9 and slash chords',
      goal: 'Use sus4, sus2, add9 and slash chords to add motion and control the bass line.',
      why: 'These are the chords that make a simple progression sound arranged. A sus4 resolving to the plain chord is the most-used gesture in pop piano, and slash chords let you write a walking bass line underneath a static harmony.',
      keys: ['C', 'G', 'D'],
      exercises: [
        { id: 'u16e1', title: 'Warm-up: diatonic sevenths', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['All seven diatonic sevenths in C, then G.'], target: 'Fluent.' },

        { id: 'u16e2', title: 'Suspend and resolve', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Take C major (C E G). Move the E up to F: C F G is Csus4. Tense. Now drop the F back to E — that release is the whole point.',
            'Move the E down to D instead: C D G is Csus2. Open, airy, no strong pull.',
            'Play Csus4 - C, Fsus4 - F, Gsus4 - G, ten times each, feeling the resolution.',
            'Now play 1-5-6-4 in C where every chord arrives as a sus and resolves on beat 3.'
          ],
          target: 'The sus-to-resolution move is automatic on any major chord.',
          show: { chords: ['Csus4', 'C', 'Csus2'], octave: 4, hand: 'R' } },

        { id: 'u16e3', title: 'add9 for colour', type: 'technique', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Cadd9 is C E G plus D (the 9th, an octave above the 2nd). Unlike sus2, the 3rd stays.',
            'A practical shape: left hand plays C; right hand plays E G D or G D E.',
            'Play Cadd9, Fadd9, Gadd9, Am(add9). This is the standard modern pop-piano colour.',
            'Replace every chord in 1-5-6-4 with its add9 version.'
          ],
          target: 'A four-chord loop in add9 voicings that sounds modern rather than cluttered.',
          show: { chords: ['Cadd9', 'Fadd9', 'Gadd9'], octave: 4, hand: 'R' } },

        { id: 'u16e4', title: 'Slash chords and the descending bass', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'A slash chord names the bass note separately: C/E means a C chord with E in the bass. The right hand does not change; only the left hand moves.',
            'Play this descending line in C: C - C/B - Am - Am/G - F - C/E - Dm - G. The bass walks down C B A G F E D G.',
            'Left hand plays only the bass notes; right hand keeps voice-led chords in one small area.',
            'Two loops slowly, then at 70 bpm.'
          ],
          target: 'A clear stepwise descending bass line under static-sounding right-hand chords.',
          bpm: { start: 60, goal: 80 },
          show: { chords: ['C', 'C/B', 'Am', 'Am/G', 'F', 'C/E', 'Dm', 'G'], bassline: true } }
      ],
      checkpoint: { title: 'Colour chords',
        criteria: [
          'Play sus4-to-resolution on any major chord instantly.',
          'Play a four-chord loop in add9 voicings without muddiness.',
          'Play the descending bass progression in C and in G with a clean stepwise bass.'
        ] } },

    { id: 'u17', title: 'Shell voicings and the pro left hand',
      goal: 'Play left-hand shell voicings (root + 7th, or root + 3rd + 7th) with the right hand free for colour.',
      why: 'This is the standard division of labour for accompanying a singer on anything jazz-adjacent. The left hand states the harmony minimally, the right hand is free, and the whole thing stays out of the singer’s way.',
      keys: ['C', 'F', 'Bb', 'Eb'],
      exercises: [
        { id: 'u17e1', title: 'Warm-up: sevenths in two keys', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['Diatonic sevenths in F and Bb, two beats each.'], target: 'Fluent.' },

        { id: 'u17e2', title: 'Root and seventh', type: 'technique', role: 'core', minutes: 5, reps: 15,
          steps: [
            'Left hand only. Play the root with your pinky and the 7th with your thumb. On Cmaj7: C and B. On Dm7: D and C. On G7: G and F.',
            'Two notes is enough to state the whole chord. Keep the root around the C below middle C so it stays clear.',
            'Play the shells for Cmaj7 - Am7 - Dm7 - G7, left hand alone.',
            'Then the same in F and Bb.'
          ],
          target: 'Two-note shells on every diatonic seventh, left hand alone, in three keys.',
          show: { chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'], voicing: 'shell', octave: 3, hand: 'L' } },

        { id: 'u17e3', title: 'Root, third, seventh', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Add the 3rd between them: Cmaj7 becomes C E B. G7 becomes G B F. Dm7 becomes D F C.',
            'The 3rd and 7th are the two notes that define the chord quality; the root grounds it. The 5th is expendable.',
            'Play 1-6-2-5 in C (Cmaj7 Am7 Dm7 G7) with these three-note left-hand shells.',
            'Right hand: add just the top colour note — the 9th or the 5th — held.'
          ],
          target: 'Left-hand 1-3-7 shells with a clear, uncluttered sound.',
          show: { chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'], voicing: 'shell37', octave: 3, hand: 'L' } },

        { id: 'u17e4', title: 'Shells under a melody', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Play the shells with the left hand and hum or sing a simple melody over them — any melody.',
            'Now play the melody with your right hand instead, one note at a time, while the left hand holds the shells.',
            'This is exactly what accompanying is: your left hand is the whole band, your right hand doubles or answers the singer.',
            'Do it over 1-6-2-5 in C, then in F.'
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
      why: '2-5-1 is the most common cadence in vocal repertoire, and secondary dominants and the minor 4 are the two "outside" sounds that appear most often in songs singers actually bring you.',
      keys: ['C', 'F', 'Bb', 'Eb', 'G', 'D'],
      exercises: [
        { id: 'u18e1', title: 'Warm-up: shells in three keys', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['1-6-2-5 with left-hand shells in C, F, Bb.'], target: 'Fluent.' },

        { id: 'u18e2', title: 'Voice-led 2-5-1', type: 'technique', role: 'core', minutes: 6, reps: 15,
          steps: [
            'In C: Dm7 - G7 - Cmaj7. Left hand shells: D-C, G-F, C-B.',
            'Notice that the 7th of one chord becomes the 3rd of the next. C is the 7th of Dm7 and moves down a half step to B, the 3rd of G7. That half-step voice leading is the whole mechanism.',
            'Play 2-5-1 in C, then down a whole step to Bb, then Ab, then F#, and so on around the circle.',
            'All 12 keys, two beats per chord.'
          ],
          target: '2-5-1 in all 12 keys in one continuous pass.',
          bpm: { start: 55, goal: 75 },
          show: { key: 'C', numbers: '2 5 1', sevenths: true } },

        { id: 'u18e3', title: 'Secondary dominants', type: 'theory', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Any chord can be preceded by the dominant 7 a fifth above it. In C, to approach Am you can play E7 first — that is "5 of 6".',
            'The tell is a chord with a sharp in it that does not belong to the key. If you see E7 in the key of C, that is a secondary dominant heading for Am.',
            'Play C - E7 - Am - A7 - Dm - G7 - C. Every chord is set up by its own dominant.',
            'Do it in C and in G.'
          ],
          target: 'You can spot a secondary dominant in a chart and know where it is going.',
          show: { chords: ['C', 'E7', 'Am', 'A7', 'Dm', 'G7', 'C'], octave: 4, hand: 'R' } },

        { id: 'u18e4', title: 'The minor 4 chord', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Borrow the 4 chord from the parallel minor: in C, that is Fm instead of F. It is the most emotionally loaded chord in pop music.',
            'Play C - F - Fm - C. Listen to what the Fm does on the way home.',
            'Common uses: at the end of a chorus, or the last line of a verse before the chorus.',
            'Play 1 - 4 - 4m - 1 in C, G and F.'
          ],
          target: 'You can drop a minor 4 in at the end of a phrase and make it land.',
          show: { chords: ['C', 'F', 'Fm', 'C'], octave: 4, hand: 'R' } }
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
      why: 'The two moments a singer is most exposed are the first note and the last. If you can reliably give them their starting pitch, set the tempo, and land an ending, you are already more useful than most amateur accompanists.',
      keys: ['C', 'G', 'F', 'Eb'],
      exercises: [
        { id: 'u19e1', title: 'Warm-up: 2-5-1 in four keys', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['Voice-led 2-5-1 with shells in C, F, Bb, Eb.'], target: 'Fluent.' },

        { id: 'u19e2', title: 'The four-bar intro', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Default intro that always works: play the last four bars of the song, then start.',
            'Second default: vamp the 1 and 4 chords for four bars.',
            'Third: play 4 - 5 - 1 as a two-bar setup.',
            'Take 1-5-6-4 in C. Build all three intros for it and play each one straight into the first verse without a gap.'
          ],
          target: 'Three usable intros for the same song, each flowing straight into the verse.',
          show: { key: 'C', numbers: '4 5 1' } },

        { id: 'u19e3', title: 'Give the singer their note', type: 'ear', role: 'core', minutes: 4, reps: 12,
          steps: [
            'Before the count-off, the singer needs to hear their first pitch. Work out what it is: usually the 1, 3 or 5 of the first chord.',
            'Play the tonic chord, then play the singer\'s first note on its own, clearly, in their octave.',
            'Practise: for 1-5-6-4 in C with a first note of E, play C major, then E alone, then count off.',
            'Do this in C, G, F and Eb, choosing a plausible starting note each time.'
          ],
          target: 'You can isolate and sound a starting pitch in the singer\'s octave in any key.' },

        { id: 'u19e4', title: 'Count-offs and endings', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Count-off out loud: "1, 2, 1 2 3 4" at the exact tempo of the song. Practise counting off at 60, 80, 100 and 120 without a metronome, then check yourself against one.',
            'Ending 1 — the ritard: slow the last two bars gradually and hold the final chord.',
            'Ending 2 — the tag: repeat the last line three times, the third time slower.',
            'Ending 3 — the cold stop: everyone lands hard on beat 1 and stops.',
            'Play a full 16-bar loop with an intro, then each of the three endings.'
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
      why: 'This is the actual job. Singers breathe, stretch phrases, come in early, forget words. An accompanist who can only play in strict time forces the singer to serve the piano, which is backwards.',
      keys: ['C', 'F', 'G'],
      exercises: [
        { id: 'u20e1', title: 'Warm-up: sparse comping', type: 'warmup', role: 'warmup', minutes: 2, reps: 12,
          steps: ['Level 1 sparse comping through 1-5-6-4 in C, very quiet.'], target: 'Controlled.' },

        { id: 'u20e2', title: 'Rubato: stretch and compress', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Turn the metronome OFF for this exercise.',
            'Play 1-6-4-5 in C in a slow ballad texture. Deliberately stretch bar 2 to be about 25 percent longer, then compress bar 4 to catch up.',
            'The harmony must stay coherent even though the pulse breathes. Practise until the stretch sounds intentional rather than like a mistake.',
            'Now do it with a recording of a singer, or singing yourself, following the voice rather than a beat.'
          ],
          target: 'You can bend the tempo deliberately and still arrive at the next chord together.' },

        { id: 'u20e3', title: 'The rescue drills', type: 'technique', role: 'core', minutes: 6, reps: 15,
          steps: [
            'Drill A — Singer comes in early: the moment you hear it, jump to the chord they are on. Do not finish your bar. Practise by starting a progression, then forcing yourself to jump forward one chord at a random point.',
            'Drill B — Singer comes in late: hold the current chord, do not fill, wait. Practise holding chord 1 for eight bars, then continuing as if nothing happened.',
            'Drill C — Singer drops a line: keep the groove absolutely steady and play the melody quietly in the right hand until they find it. Practise picking out a simple melody over your own comping.',
            'Drill D — Wrong key: play the tonic of the key they are actually singing in, loudly, on the next beat 1.'
          ],
          target: 'All four recoveries executed without stopping the music.' },

        { id: 'u20e4', title: 'Play with an actual voice', type: 'apply', role: 'apply', minutes: 6, reps: 15,
          steps: [
            'Pick a song you know. Find a vocal-only or acoustic version, or sing it yourself.',
            'Comp underneath it for the whole song. Do not stop for any reason.',
            'Rules: never play above the vocal line, drop out entirely for at least one phrase, and change density between verse and chorus.',
            'Afterwards, write one sentence on what got in the singer\'s way.'
          ],
          target: 'A complete song accompanied end to end without stopping.' }
      ],
      checkpoint: { title: 'Following',
        criteria: [
          'Play rubato deliberately and arrive at chord changes with the voice.',
          'Execute all four rescue drills without stopping.',
          'Accompany a full song end to end with at least one deliberate drop-out.'
        ] } },

    { id: 'u21', title: 'Find the singer\'s key',
      goal: 'Work out what key a singer is comfortable in, by ear, within a minute — and move a song there.',
      why: 'Singers often do not know their key. They know the song and roughly where it feels good. Finding it for them quickly is one of the most valued things an accompanist does.',
      keys: ['C', 'G', 'D', 'F', 'Bb', 'Eb'],
      exercises: [
        { id: 'u21e1', title: 'Warm-up: circle of fifths triads', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['Major triads around the circle, then 1-5-6-4 in three random keys.'], target: 'Fluent.' },

        { id: 'u21e2', title: 'Match a pitch', type: 'ear', role: 'core', minutes: 4, reps: 15,
          steps: [
            'Sing or hum any note. Find it on the piano within three tries.',
            'Repeat twenty times, starting from a different note each time.',
            'Then reverse: play a note, sing it back, check by playing it again.'
          ],
          target: 'You can find a hummed pitch on the keyboard within three tries, 18 times out of 20.' },

        { id: 'u21e3', title: 'The key-finding routine', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'Step 1: ask the singer to sing the highest note of the chorus, unaccompanied. Find that note on the piano.',
            'Step 2: work out what scale degree that note is in the original key — usually the 5, sometimes the 1 or 3.',
            'Step 3: the key that puts their comfortable top note on that degree is the key you want.',
            'Practise: pick a song with a top note of the 5. If their comfortable top note is D, then D is the 5, so the key is G.',
            'Do this calculation for five different top notes: C, Eb, F, A, Bb.'
          ],
          target: 'Given a top note and its scale degree, you name the key instantly.' },

        { id: 'u21e4', title: 'Move a song two ways', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Take a progression you know in C. Number it.',
            'Play it in the key a fourth up (F) and a fourth down (G) — the two most common "that\'s too high / too low" corrections.',
            'Then in the key a minor third down (A) and a whole step up (D).',
            'Under a minute per key, no written notes.'
          ],
          target: 'Four transpositions of the same song from memory, under a minute each.',
          tool: 'random-key' }
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
        { id: 'u22e1', title: 'Warm-up: density levels', type: 'warmup', role: 'warmup', minutes: 3, reps: 12,
          steps: ['Run the four density levels through 1-5-6-4 in C, one loop each.'], target: 'Clearly distinct.' },

        { id: 'u22e2', title: 'Write the dynamic map', type: 'theory', role: 'core', minutes: 4, reps: 10,
          steps: [
            'Pick a song. Write its sections in order: e.g. Intro / V1 / C1 / V2 / C2 / Bridge / C3 / Outro.',
            'Assign a density level 1-4 to each section. A standard shape: 2 / 1 / 3 / 2 / 3 / 1 / 4 / 2.',
            'The rule is that no two adjacent sections have the same level — every section boundary must be audible.',
            'Write the map down where you can see it at the piano.'
          ],
          target: 'A written dynamic map with no two adjacent sections at the same level.' },

        { id: 'u22e3', title: 'Section-boundary drill', type: 'technique', role: 'core', minutes: 5, reps: 12,
          steps: [
            'The last bar of each section is where you signal the change. Options: a fill, a held chord, a drop to nothing, a bass run up to the next chord.',
            'Practise the transition bars only — the last bar of a verse into the first bar of a chorus, ten times.',
            'Then the last bar of a chorus into a verse (usually a drop in density).',
            'Then the bridge into the final chorus (usually the biggest lift in the song).'
          ],
          target: 'Three transition types you can play cleanly on demand.' },

        { id: 'u22e4', title: 'Play the whole arrangement', type: 'apply', role: 'apply', minutes: 8, reps: 15,
          steps: [
            'Play your chosen song from your dynamic map, start to finish, with a real intro and a real ending.',
            'Do not stop, even for a wrong chord.',
            'Record it on your phone.',
            'Listen back once and note the single weakest moment. That is next session\'s focus.'
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
        { id: 'u23e1', title: 'Warm-up: 2-5-1 round the circle', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['Voice-led 2-5-1 with shells, six keys.'], target: 'Fluent.' },

        { id: 'u23e2', title: '12-bar blues', type: 'technique', role: 'core', minutes: 6, reps: 15,
          steps: [
            'The form in numbers: 1 1 1 1 / 4 4 1 1 / 5 4 1 5. All three chords are dominant sevenths in blues.',
            'Play it in C (C7 F7 G7), one bar per chord, with a shuffle feel — long-short on each pair of eighths.',
            'Then in F and Bb, the two most common blues keys for singers.',
            'Four choruses in each key without stopping.'
          ],
          target: 'Twelve-bar blues in three keys, four choruses each, without losing the form.',
          bpm: { start: 70, goal: 100 },
          show: { chords: ['C7', 'F7', 'G7'], octave: 4, hand: 'R' } },

        { id: 'u23e3', title: '32-bar AABA', type: 'technique', role: 'core', minutes: 6, reps: 12,
          steps: [
            'Eight bars of A, repeated, then eight bars of a contrasting B (the bridge), then A again. Almost every jazz standard and mid-century vocal song.',
            'Build a simple one: A section is 1 6 2 5 (Cmaj7 Am7 Dm7 G7), two bars each. B section is 4 4 1 1 with a 2-5 to get home.',
            'Play the full 32 bars twice through in C.',
            'Then in F.'
          ],
          target: 'A full 32-bar chorus played twice without losing your place.',
          show: { key: 'C', numbers: '1 6 2 5', sevenths: true } },

        { id: 'u23e4', title: 'Follow an unknown song', type: 'ear', role: 'apply', minutes: 6, reps: 15,
          steps: [
            'Put on a song you do not know well.',
            'Listen for eight bars only. Decide: what is the form, where is beat 1, is the 1 chord major or minor.',
            'From bar 9, play just the root note of each chord you hear, on beat 1.',
            'Second pass, add triads. Third pass, add the groove.'
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
      keys: ['C', 'G', 'F', 'Bb', 'Eb', 'D'],
      exercises: [
        { id: 'u24e1', title: 'Warm-up: random-key progressions', type: 'warmup', role: 'warmup', minutes: 3, reps: 12,
          steps: ['Cold-call drill: three random keys, 1-5-6-4 in each.'], target: 'Under five seconds each.',
          tool: 'random-key' },

        { id: 'u24e2', title: 'Scan before you play', type: 'theory', role: 'core', minutes: 4, reps: 12,
          steps: [
            'Given a new chart, spend 30 seconds on this checklist, in order: key signature, time signature, form and repeats, any chord you do not recognise, the last four bars.',
            'Find any chord chart online or in a songbook. Run the checklist out loud.',
            'Do it for three different charts.'
          ],
          target: 'A 30-second scan that catches the key, the form and the one hard chord.' },

        { id: 'u24e3', title: 'Never stop', type: 'technique', role: 'core', minutes: 6, reps: 15,
          steps: [
            'Set a metronome at a deliberately slow tempo. Play an unseen chart.',
            'Rule: if you cannot get the chord in time, play only the root, on the beat, and rejoin at the next chord.',
            'A missed chord costs nothing. A stop costs the whole take.',
            'Three different charts, one pass each, no stops.'
          ],
          target: 'Three unseen charts played through with no stops, roots covered even when chords are missed.',
          bpm: { start: 60, goal: 90 }, tool: 'metronome' },

        { id: 'u24e4', title: 'Read and transpose at sight', type: 'apply', role: 'apply', minutes: 5, reps: 12,
          steps: [
            'Take a chart written in C. Play it in D at sight, converting on the fly through numbers.',
            'Then the same chart in Bb.',
            'Slow tempo. No stopping.',
            'This is the hardest skill in the course. Expect it to take many sessions.'
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
      goal: 'Five songs, memorised, in a singer\'s keys, playable start to finish on request.',
      why: 'This is the point of everything above. A set you can play cold is what makes you an accompanist rather than a student of accompaniment.',
      keys: ['any'],
      exercises: [
        { id: 'u25e1', title: 'Warm-up: your weakest key', type: 'warmup', role: 'warmup', minutes: 3, reps: 15,
          steps: ['Pick the key you are worst in. Play 1-5-6-4, 1-6-4-5 and 2-5-1 in it.'], target: 'Getting easier each session.' },

        { id: 'u25e2', title: 'Choose and chart five songs', type: 'theory', role: 'core', minutes: 5, reps: 8,
          steps: [
            'Pick five songs: one ballad, one mid-tempo pop, one blues or soul, one standard, one of the singer\'s choosing.',
            'Write each one out in numbers, not letters, with the form marked.',
            'Note the key you would default to and two alternatives (a step up, a third down).'
          ],
          target: 'Five number charts with forms and three viable keys each.' },

        { id: 'u25e3', title: 'One song to performance standard', type: 'apply', role: 'core', minutes: 8, reps: 20,
          steps: [
            'Pick one song from your five. Play it start to finish with intro, dynamic map and ending.',
            'Then play it in a second key.',
            'Then play it from memory with the chart face down.',
            'Then record it. Listen once. Fix the weakest moment. Record again.'
          ],
          target: 'One song played from memory, in two keys, with a clean intro and ending.' },

        { id: 'u25e4', title: 'Set run-through', type: 'apply', role: 'apply', minutes: 8, reps: 20,
          steps: [
            'Play all five songs back to back, as a set, with no stopping and no charts.',
            'Between songs, give yourself four bars to find the next key.',
            'Anything that falls apart becomes the focus of the next session.'
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
    u.exercises.forEach(function (e) { e.unitId = u.id; e.unitNumber = u.number; EXERCISES[e.id] = e; });
  });

  global.Curriculum = {
    stages: STAGES, units: UNITS, exercises: EXERCISES,
    unit: function (id) { return UNITS.filter(function (u) { return u.id === id; })[0]; },
    unitAt: function (i) { return UNITS[Math.max(0, Math.min(UNITS.length - 1, i))]; },
    count: UNITS.length
  };
})(typeof window !== 'undefined' ? window : this);
