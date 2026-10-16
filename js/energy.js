/* energy.js — the same chords at five levels of intensity.

   A song's verse and chorus often use exactly the same four chords. What
   changes is how they are played, and on the piano "louder" is four dials
   turned together, not one:
     register  how low the bass sits and how high the right hand goes
     density   how many notes are sounding (2 at the bottom, 7 at the top)
     rhythm    how often you strike
     touch     where the weight comes from — fingertip, wrist, forearm, arm
   Hitting a thin voicing harder just sounds harsh. The ladder below turns all
   four dials a notch at a time, so each level is something you can learn as a
   shape, and the drills train moving between them mid-song.

   Fingering for every shape is derived rather than typed out: the hand's
   fingers are assigned to the notes so that each pair of neighbouring fingers
   spans an interval it comfortably reaches. See finger(). */
(function (global) {
  'use strict';
  var T = global.Theory;

  // ---------------------------------------------------------------- fingering
  /* Comfortable reach, in semitones, between two fingers of one hand — the
     same for both hands, since the left is the mirror of the right.
     [min, max]: below min the fingers are cramped, above it they stretch. */
  var REACH = {
    '12': [1, 5], '13': [3, 7], '14': [5, 9], '15': [7, 12],
    '23': [1, 4], '24': [3, 5], '25': [5, 9],
    '34': [1, 3], '35': [3, 5],
    '45': [1, 4]
  };
  /* 3-4 and 4-5 are the weak, tight pairs; a stretch there costs more than the
     same stretch between 1 and 2. */
  var STRETCH_COST = { '34': 4, '45': 4, '35': 3.5, '23': 3 };

  function combos(k) {
    var out = [];
    (function rec(start, acc) {
      if (acc.length === k) { out.push(acc.slice()); return; }
      for (var f = start; f <= 5; f++) { acc.push(f); rec(f + 1, acc); acc.pop(); }
    })(1, []);
    return out;
  }

  /* finger(notes, hand) -> notes with .finger set.
     notes: [{midi}] in any order. Right hand numbers rise with pitch, left
     hand numbers fall (the left thumb is on top). */
  function finger(notes, hand) {
    if (!notes || !notes.length) return notes;
    var sorted = notes.slice().sort(function (a, b) { return a.midi - b.midi; });
    var k = sorted.length;
    if (k > 5) return notes;
    if (k === 1) return notes;          // a single note can take any finger
    var spanAll = sorted[k - 1].midi - sorted[0].midi;
    var best = null;
    combos(k).forEach(function (fs) {
      // fs ascends; for the left hand the lowest note takes the highest finger
      var seq = hand === 'L' ? fs.slice().reverse() : fs;
      var cost = 0;
      for (var i = 1; i < k; i++) {
        var a = seq[i - 1], b = seq[i];
        var key = Math.min(a, b) + '' + Math.max(a, b);
        var r = REACH[key], d = sorted[i].midi - sorted[i - 1].midi;
        if (d > r[1]) cost += (d - r[1]) * (STRETCH_COST[key] || 3);
        if (d < r[0]) cost += (r[0] - d);
      }
      // a shape a fifth or wider wants the whole hand: thumb and fifth outside
      if (spanAll >= 7) {
        if (fs[0] !== 1) cost += 2;
        if (fs[k - 1] !== 5) cost += 2;
      }
      /* Don't skip fingers in a tight cluster: C D E is 1 2 3, not 1 3 5.
         A small charge per unused finger inside the shape. */
      cost += 0.15 * ((fs[k - 1] - fs[0]) - (k - 1)) * (spanAll < 7 ? 1 : 0);
      if (!best || cost < best.cost - 1e-9) best = { cost: cost, seq: seq };
    });
    sorted.forEach(function (n, i) { n.finger = best.seq[i]; });
    return notes;
  }

  // ---------------------------------------------------------------- levels
  /* Patterns are one bar of 4/4 in eighth-note slots, 0-7.
       s  slot it starts on     d  length in slots
       acc  accented            arp  play only this note of the hand (0 = lowest)
     Gain is per note; accents multiply it. */
  var LEVELS = [
    { n: 1, id: 'whisper', name: 'Whisper', dyn: 'pp',
      when: 'Intros, a quiet first verse, the drop before the last chorus.',
      lh: 'Root only — one note, low-middle.',
      rh: 'Close triad near middle C, nearest inversion each time.',
      rhythm: 'One strike per chord. Let it ring for the whole bar.',
      touch: 'Fingertips already resting on the keys. Press down, never strike.',
      lhShape: 'root', lhLow: 43, rhCenter: 62, rhDouble: false, gain: 0.05,
      pattern: { rh: [{ s: 0, d: 8 }], lh: [{ s: 0, d: 8 }] } },

    { n: 2, id: 'flow', name: 'Flow', dyn: 'mp',
      when: 'Verses. Movement without weight, so the voice sits on top.',
      lh: 'Root and fifth together (an open fifth), held.',
      rh: 'Same triad, broken into even eighths: bottom, middle, top, middle.',
      rhythm: 'Steady eighths in the right hand; the left hand holds.',
      touch: 'Fingers only. Wrist level and quiet, each note the same size.',
      lhShape: 'fifth', lhLow: 40, rhCenter: 64, rhDouble: false, gain: 0.07,
      pattern: {
        rh: [0, 1, 2, 1, 0, 1, 2, 1].map(function (ix, s) { return { s: s, d: 1.6, arp: ix }; }),
        lh: [{ s: 0, d: 8 }]
      } },

    { n: 3, id: 'lift', name: 'Lift', dyn: 'mf',
      when: 'Pre-chorus: the build. Energy rising, not arrived.',
      lh: 'Octave on the root, fingers 5 and 1.',
      rh: 'Block triad on every eighth — short, light, pulsing.',
      rhythm: 'Right hand eighths, accents on 1 and 3. Left hand on 1 and 3.',
      touch: 'Small bounces from the wrist. Fingers stay in the shape.',
      lhShape: 'octave', lhLow: 36, rhCenter: 66, rhDouble: false, gain: 0.09,
      pattern: {
        rh: [0, 1, 2, 3, 4, 5, 6, 7].map(function (s) { return { s: s, d: 0.8, acc: s === 0 || s === 4 }; }),
        lh: [{ s: 0, d: 4, acc: true }, { s: 4, d: 4 }]
      } },

    { n: 4, id: 'drive', name: 'Drive', dyn: 'f',
      when: 'The chorus. Full band energy.',
      lh: 'Octaves on 1, the "and" of 2, and 3 — the pop push.',
      rh: 'Four notes: the triad with its bottom note doubled an octave up.',
      rhythm: 'Right hand on every beat, leaning on 2 and 4 like a snare.',
      touch: 'Forearm weight. Fingertips firm, the forearm drops into each chord.',
      lhShape: 'octave', lhLow: 36, rhCenter: 67, rhDouble: true, gain: 0.115,
      pattern: {
        rh: [{ s: 0, d: 2 }, { s: 2, d: 2, acc: true }, { s: 4, d: 2 }, { s: 6, d: 2, acc: true }],
        lh: [{ s: 0, d: 3, acc: true }, { s: 3, d: 1 }, { s: 4, d: 4 }]
      } },

    { n: 5, id: 'slam', name: 'Slam', dyn: 'ff',
      when: 'The last chorus, the key change, the moment everything opens up.',
      lh: 'Low root, fifth and octave (5-2-1) — the whole bottom of the piano.',
      rh: 'The four-note chord moved up high, so the top note rings out.',
      rhythm: 'Both hands on every beat, everything accented. Nothing held back.',
      touch: 'Whole arm from the shoulder. Fall into the keys and rebound — never push into the key bed.',
      lhShape: 'power', lhLow: 33, rhCenter: 72, rhDouble: true, gain: 0.14,
      pattern: {
        rh: [0, 2, 4, 6].map(function (s) { return { s: s, d: 2, acc: true }; }),
        lh: [{ s: 0, d: 2, acc: true }, { s: 2, d: 2, acc: true }, { s: 4, d: 2, acc: true }, { s: 6, d: 2, acc: true }]
      } }
  ];

  function level(n) { return LEVELS[Math.max(1, Math.min(5, n || 1)) - 1]; }

  // ---------------------------------------------------------------- voicing
  function avg(v) { return v.reduce(function (a, x) { return a + x.midi; }, 0) / v.length; }
  function shift(v, semis) {
    return v.map(function (n) { return { midi: n.midi + semis, name: n.name, hand: n.hand }; });
  }
  function movement(a, b) {
    if (a.length !== b.length) return Math.abs(avg(a) - avg(b)) * Math.max(a.length, b.length);
    var s = 0;
    for (var i = 0; i < a.length; i++) s += Math.abs(a[i].midi - b[i].midi);
    return s;
  }

  /* Every close-position shape of a chord within reach of `center`. */
  function shapes(sym, center) {
    var p = T.parseChord(sym);
    if (!p) return [];
    var plain = { root: p.root, quality: p.quality, bass: null };
    var n = T.chordNotes(plain).length, out = [];
    for (var inv = 0; inv < n; inv++) {
      var base = T.voice(plain, { inversion: inv, octave: 4, hand: 'R' });
      for (var o = -2; o <= 2; o++) {
        var v = shift(base, o * 12);
        if (Math.abs(avg(v) - center) <= 8) { v.inversion = inv; out.push(v); }
      }
    }
    return out;
  }

  /* Right-hand chords for a progression, each moving as little as possible
     from the last while staying near the level's register. `start` forces the
     first chord's inversion, which decides the top note of the whole lane. */
  function rhLane(syms, center, start) {
    var prev = null;
    return syms.map(function (sym, i) {
      var cands = shapes(sym, center);
      if (i === 0 && start != null) {
        var forced = cands.filter(function (v) { return v.inversion === start; });
        if (forced.length) cands = forced;
      }
      var best = null, bestCost = Infinity;
      cands.forEach(function (v) {
        var cost = prev ? movement(prev, v) + 0.5 * Math.abs(avg(v) - center)
                        : Math.abs(avg(v) - center);
        if (cost < bestCost) { bestCost = cost; best = v; }
      });
      prev = best || [];
      return prev;
    });
  }

  var INV_NAME = ['root position', '1st inversion', '2nd inversion', '3rd inversion'];

  /* Which chord tone is on top of a close voicing: the thing the ear hears as
     the "tune" of the chords. */
  function topTone(sym, v) {
    var names = T.chordNoteNames(sym);
    var top = v[v.length - 1];
    var ix = names.indexOf(top && top.name);
    return ['root', '3rd', '5th', '7th', '9th'][ix] || '';
  }

  function lhShape(sym, lv) {
    var p = T.parseChord(sym);
    var bassName = (p && (p.bass || p.root)) || 'C';
    var bn = T.parseNote(bassName), pc = T.notePc(bn);
    var r = Math.ceil((lv.lhLow - pc) / 12) * 12 + pc;
    var name = T.noteName(bn);
    // a slash bass foreign to the chord gets octaves, not a fifth it doesn't own
    var fifth = (!p.bass || p.bass === p.root) ? T.noteName(T.stepNote(bn, 7, 4)) : null;
    var out = [{ midi: r, name: name, hand: 'L' }];
    if (lv.lhShape === 'fifth') out.push(fifth ? { midi: r + 7, name: fifth, hand: 'L' } : { midi: r + 12, name: name, hand: 'L' });
    if (lv.lhShape === 'octave') out.push({ midi: r + 12, name: name, hand: 'L' });
    if (lv.lhShape === 'power') {
      if (fifth) out.push({ midi: r + 7, name: fifth, hand: 'L' });
      out.push({ midi: r + 12, name: name, hand: 'L' });
    }
    return finger(out, 'L');
  }

  /* voiceSong(syms, levelN, start) -> [{ sym, rh, lh, inversion, top }] */
  function voiceSong(syms, n, start) {
    var lv = level(n);
    var lane = rhLane(syms, lv.rhCenter, start);
    return syms.map(function (sym, i) {
      var rh = lane[i].map(function (x) { return { midi: x.midi, name: x.name, hand: 'R' }; });
      var inv = lane[i].inversion;
      if (lv.rhDouble && rh.length === 3) rh.push({ midi: rh[0].midi + 12, name: rh[0].name, hand: 'R' });
      var top = topTone(sym, rh);     // after doubling: the doubled note is the new top
      finger(rh, 'R');
      return { sym: sym, rh: rh, lh: lhShape(sym, lv), inversion: inv, top: top };
    });
  }

  /* All inversions of one chord, for the shape drills. */
  function inversions(sym, hand) {
    var p = T.parseChord(sym);
    var plain = { root: p.root, quality: p.quality, bass: null };
    var n = T.chordNotes(plain).length, out = [], prev = null;
    /* Roots from G upward start an octave lower, so the climb through the
       inversions stays in the middle of the keyboard. */
    var high = T.notePc(T.parseNote(p.root)) >= 7;
    var oct = (hand === 'L' ? 3 : 4) - (high ? 1 : 0);
    for (var inv = 0; inv < n; inv++) {
      var v = T.voice(plain, { inversion: inv, octave: oct, hand: hand });
      // each shape sits above the last: the drill is a climb, not a scramble
      while (prev && v[0].midi <= prev[0].midi) v = shift(v, 12);
      v.forEach(function (x) { x.hand = hand; });
      finger(v, hand);
      out.push({ notes: v, inversion: inv, label: INV_NAME[inv], top: topTone(sym, v) });
      prev = v;
    }
    return out;
  }

  // ---------------------------------------------------------------- playback
  /* One bar of note events for a voiced chord at a level. */
  function barEvents(v, n) {
    var lv = level(n), ev = [];
    function add(list, notes) {
      list.forEach(function (p) {
        var midis = p.arp == null ? notes.map(function (x) { return x.midi; })
                                  : [notes[Math.min(p.arp, notes.length - 1)].midi];
        ev.push({ s: p.s, d: p.d, midis: midis, gain: lv.gain * (p.acc ? 1.4 : 1) });
      });
    }
    if (v.rh && v.rh.length) add(lv.pattern.rh, v.rh);
    if (v.lh && v.lh.length) add(lv.pattern.lh, v.lh);
    return ev;
  }

  /* The pattern as two rows of eight cells for display:
     'x' strike, 'X' accented strike, '-' held, '' silent. */
  function grid(n) {
    var lv = level(n);
    function row(list) {
      var cells = ['', '', '', '', '', '', '', ''];
      list.forEach(function (p) {
        cells[p.s] = p.acc ? 'X' : 'x';
        for (var s = p.s + 1; s < Math.min(8, p.s + Math.round(p.d)); s++) if (!cells[s]) cells[s] = '-';
      });
      return cells;
    }
    return { rh: row(lv.pattern.rh), lh: row(lv.pattern.lh) };
  }

  // ---------------------------------------------------------------- songs
  var SONGS = [
    { id: 'hello', name: 'Minor ballad — “Hello” (Adele)', numbers: '6 1 5 4', key: 'Ab', bpm: 79,
      blurb: 'Fm – Ab – Eb – Db, the same four chords for the whole song. Verse and chorus differ only in how they are played — exactly what this tab trains.' },
    { id: 'anthem', name: 'Pop anthem', numbers: '1 5 6 4', key: 'C', bpm: 84,
      blurb: 'The most-used progression in pop. Countless songs are these four chords at different energy levels.' },
    { id: 'minor-anthem', name: 'Minor-feel anthem', numbers: '6 4 1 5', key: 'G', bpm: 80,
      blurb: 'Same four chords, starting on the 6 — darker, more urgent.' },
    { id: 'doowop', name: 'Doo-wop ballad', numbers: '1 6 4 5', key: 'F', bpm: 72,
      blurb: 'The classic slow-dance loop. Great for practising the build from whisper to slam.' },
    { id: 'custom', name: 'My own progression', numbers: '1 4 6 5', key: 'C', bpm: 80,
      blurb: 'Type the chord numbers of the song you are working on.' }
  ];

  var SECTIONS = ['Intro', 'Verse 1', 'Pre-chorus', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Final chorus', 'Outro'];
  var DEFAULT_MAP = [1, 2, 3, 4, 2, 4, 1, 5, 1];

  // ---------------------------------------------------------------- drills
  /* Each drill is { id, block, title, minutes, steps:[{do, note}], target,
     show, bpm }. Steps follow the curriculum's convention: `do` is the cue
     you read mid-playing, `note` the reason. "Your song" means the
     progression picked at the top of the tab. */
  function ladderDrill(lv, extraSteps, target) {
    return {
      id: 'lv' + lv.n, block: 'ladder', title: 'Level ' + lv.n + ' — ' + lv.name + ' (' + lv.dyn + ')',
      minutes: 4,
      steps: [
        { do: 'Left hand alone: ' + lv.lh, note: 'Use the fingering on the keys. Play it through the whole song before adding the right hand.' },
        { do: 'Right hand alone: ' + lv.rh },
        { do: 'Hands together: ' + lv.rhythm },
        { do: 'Touch: ' + lv.touch }
      ].concat(extraSteps || []),
      target: target,
      show: { kind: 'level', level: lv.n }
    };
  }

  var BLOCKS = [
    { id: 'shapes', title: 'Inversions — the shapes under the chords',
      blurb: 'Every chord has three shapes. Knowing all of them is what lets your hands stay in one place, and lets you choose the top note.' },
    { id: 'ladder', title: 'The energy ladder',
      blurb: 'Your song at five levels. Each one is a fixed recipe — learn it as a shape, not a feeling.' },
    { id: 'switch', title: 'Switching sections',
      blurb: 'The real skill: changing level on the downbeat, mid-song, without a gap.' },
    { id: 'power', title: 'Power without strain',
      blurb: 'Playing loud is arm weight and timing, not finger force. These keep big choruses from hurting.' }
  ];

  var DRILLS = [
    { id: 'inv-shapes', block: 'shapes', title: 'Three shapes of every chord', minutes: 4,
      steps: [
        { do: 'Right hand: chord 1 of your song in root, 1st, 2nd, then root an octave up. Back down.',
          note: 'Read the finger numbers on the keys. Root and 2nd inversion are 1-3-5; 1st inversion is 1-2-5, because the big gap is at the top.' },
        { do: 'Same for every other chord in the song.' },
        { do: 'Left hand, an octave lower: same climb.',
          note: 'The left hand mirrors it: 5-3-1 for root and 1st inversion, 5-2-1 for 2nd, because there the big gap is at the bottom.' },
        { do: 'Say the top note out loud as you land each shape.' }
      ],
      target: 'Up and down every chord at 70 bpm, one shape per click, no pause between shapes, both hands.',
      bpm: { start: 60, goal: 70 },
      show: { kind: 'inversions' } },

    { id: 'inv-nearest', block: 'shapes', title: 'Nearest-shape changes', minutes: 4,
      steps: [
        { do: 'Right hand: loop your song using the shapes shown.',
          note: 'Each chord is the inversion closest to the one before. Notes that two chords share stay held down; only the fingers that must move, move.' },
        { do: 'Hold every common note through the change.' },
        { do: 'Eyes off the keys for the last two loops.' }
      ],
      target: 'Four loops with no gap at any change. Your hand barely travels.',
      bpm: { start: 66, goal: 80 },
      show: { kind: 'level', level: 1, hands: 'R' } },

    { id: 'inv-lanes', block: 'shapes', title: 'Choose the top note', minutes: 5,
      steps: [
        { do: 'Play the loop in lane A, then B, then C.',
          note: 'Each lane starts chord 1 in a different inversion, which puts a different note on top of every chord after it. The top note is what listeners hear as the tune of your chords.' },
        { do: 'Hum the top line of each lane while you play it.' },
        { do: 'Pick the lane whose top line clashes least with the melody — and the highest one for the chorus.',
          note: 'A chorus usually wants the highest lane: a brighter top note cuts through without you having to hit harder.' }
      ],
      target: 'Switch lanes on any bar line without stopping, and say which lane you are in.',
      bpm: { start: 66, goal: 80 },
      show: { kind: 'lanes' } }
  ].concat([
    ladderDrill(LEVELS[0], [{ do: 'Change the pedal exactly as each new chord sounds.',
      note: 'Lift and press again a moment after the new chord, so the old one clears without a gap.' }],
      'Four loops so soft the chords barely speak — every note still sounding, all three together.'),
    ladderDrill(LEVELS[1], [{ do: 'Keep the eighths even through every chord change.',
      note: 'The usual slip is a hiccup on the change. Look at the next shape a beat early.' }],
      'Four loops of perfectly even eighths, no bump at the changes, right hand never louder than mp.'),
    ladderDrill(LEVELS[2], [{ do: 'Make beats 1 and 3 clearly louder than the rest.' }],
      'Four loops with the pulse steady and the accents obvious — and still nowhere near full volume.'),
    ladderDrill(LEVELS[3], [{ do: 'Lean into beats 2 and 4 in the right hand.',
      note: 'That is where the snare drum hits in a band. Leaning there makes the chorus groove instead of plod.' }],
      'Four loops at chorus tempo. Octaves land with the right hand, and the push on the "and" of 2 is tight.'),
    ladderDrill(LEVELS[4], [{ do: 'Go completely loose between hits.',
      note: 'If your forearm is still tight on beat 2, you are pushing, not dropping. Big sound comes from the fall, not the squeeze.' }],
      'Four loops at full volume with a round, ringing sound — no clatter, no pain, wrists loose after every hit.')
  ]).concat([
    { id: 'sw-verse-chorus', block: 'switch', title: 'Verse to chorus', minutes: 5,
      steps: [
        { do: 'Two loops at level 2, then straight into level 4 on the downbeat.',
          note: 'The move happens on the last beat of the verse: left hand drops to the octave, right hand jumps up to the four-note shape.' },
        { do: 'Look at the landing spot a beat before your hands move.' },
        { do: 'Then back down: chorus to verse 2.', note: 'Getting quiet on time is harder than getting loud. Lighten the arm before the bar line.' }
      ],
      target: 'Five clean switches in a row each way, no hesitation on the downbeat.',
      bpm: { start: 66, goal: 80 },
      show: { kind: 'switch', levels: [2, 4] } },

    { id: 'sw-build-drop', block: 'switch', title: 'The build and the drop', minutes: 5,
      steps: [
        { do: 'One loop at each level, 1 up to 5, no stopping.',
          note: 'Every level should be clearly bigger than the last. If 3 and 4 sound the same, the voicing changed but the touch did not.' },
        { do: 'From level 5, drop straight to level 1.',
          note: 'The drop is a classic arranging move — a whole band cutting out before the last chorus. It only works if it is sudden: no fade.' },
        { do: 'Then build 1 to 5 again, this time in half the loops: two levels per loop.' }
      ],
      target: 'Five clear, different sizes going up, and a drop that lands soft on the very first beat.',
      bpm: { start: 66, goal: 80 },
      show: { kind: 'ladder' } },

    { id: 'sw-called', block: 'switch', title: 'Called levels', minutes: 4,
      steps: [
        { do: 'Loop your song at level 2.' },
        { do: 'Press Call. Switch to the called level at the next bar line.',
          note: 'This is what happens in a real band when the singer signals "bring it down" or the drummer kicks up. You do not get warning.' },
        { do: 'Call again whenever you have settled.' }
      ],
      target: 'Ten calls in a row, each switch within one bar, never stopping the time.',
      tool: 'level-caller',
      show: { kind: 'ladder' } },

    { id: 'sw-map', block: 'switch', title: 'Play the whole song map', minutes: 6,
      steps: [
        { do: 'Set the song map to the sections of your song.' },
        { do: 'Press Play map once and listen to the shape of the song.' },
        { do: 'Play the map along with it, then without it.',
          note: 'This is the goal of the whole tab: the song played start to finish with each section at its own energy.' }
      ],
      target: 'The whole song form, no stops, every section clearly its own level.',
      show: { kind: 'map' } }
  ]).concat([
    { id: 'pw-octaves', block: 'power', title: 'Arm-weight octaves', minutes: 3,
      steps: [
        { do: 'Left hand octave, fingers 5 and 1, shaped like a held-open C.' },
        { do: 'Lift the forearm two inches. Let it fall into the octave on beat 1.',
          note: 'Let gravity do it. The fingers only need to be firm enough not to buckle.' },
        { do: 'Go limp the instant it sounds. Wiggle the wrist to check.' },
        { do: 'Four drops per chord through your song.' }
      ],
      target: 'Big, round octaves with no clack, and a wrist you can wiggle straight after every one.',
      show: { kind: 'level', level: 4, hands: 'L' } },

    { id: 'pw-fingertips', block: 'power', title: 'Firm fingertips, loud top note', minutes: 3,
      steps: [
        { do: 'Right-hand four-note shape. Drop in on each beat and rebound off.' },
        { do: 'Tilt the weight toward the little finger.',
          note: 'The top note is the one the ear follows. Weighting the 5th finger makes the chord sing instead of thud.' },
        { do: 'Check the 4th and 5th fingers stay curved — no collapsing.' }
      ],
      target: 'All four notes sound together, the top note clearly loudest, fingers never buckle.',
      bpm: { start: 66, goal: 80 },
      show: { kind: 'level', level: 4, hands: 'R' } },

    { id: 'pw-accents', block: 'power', title: 'Accent control', minutes: 4,
      steps: [
        { do: 'Right-hand eighths at level 3, accents on 1 and 3.' },
        { do: 'Move the accents to 2 and 4.' },
        { do: 'Now accent only the "and"s.',
          note: 'Off-beat accents are what make a pop chorus push forward. The unaccented notes must stay soft or the accents disappear.' }
      ],
      target: 'Each accent pattern clearly audible for four loops; the unaccented notes stay light.',
      bpm: { start: 66, goal: 88 },
      show: { kind: 'level', level: 3, hands: 'R' } }
  ]);

  var BY_ID = {};
  DRILLS.forEach(function (d, i) { d.index = i; BY_ID[d.id] = d; });

  global.Energy = {
    LEVELS: LEVELS, level: level, SONGS: SONGS, SECTIONS: SECTIONS, DEFAULT_MAP: DEFAULT_MAP,
    BLOCKS: BLOCKS, DRILLS: DRILLS, drill: function (id) { return BY_ID[id]; },
    finger: finger, voiceSong: voiceSong, inversions: inversions, topTone: topTone,
    barEvents: barEvents, grid: grid, INV_NAME: INV_NAME
  };
})(typeof window !== 'undefined' ? window : this);
