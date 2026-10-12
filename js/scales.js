/* scales.js — scale spelling, key signatures and fingerings.

   Fingerings for seven-note scales are derived from the two rules every method
   book encodes, rather than typed out per key:
     - the thumb never lands on a black key
     - the notes between thumbs fall in groups of three and four
   Candidates that satisfy those are scored by the classical preference — the
   right thumb wants the white key just after a black one, the left thumb the
   white key just before one. See the test, which checks this reproduces the
   standard fingering for all twelve major scales in both hands. */
(function (global) {
  'use strict';
  var T = global.Theory;

  // [semitones, letterSteps] from the root, as in Theory.FORMULAS
  var TYPES = [
    { id: 'major', name: 'Major', blurb: 'The one everything else is measured against.',
      formula: [[0,0],[2,1],[4,2],[5,3],[7,4],[9,5],[11,6]], signature: 'self' },
    { id: 'natural-minor', name: 'Natural minor', blurb: 'The relative minor scale — same notes as its major, different home.',
      formula: [[0,0],[2,1],[3,2],[5,3],[7,4],[8,5],[10,6]], signature: 'relative' },
    { id: 'harmonic-minor', name: 'Harmonic minor', blurb: 'Natural minor with a raised 7th, so the 5 chord pulls home.',
      formula: [[0,0],[2,1],[3,2],[5,3],[7,4],[8,5],[11,6]], signature: 'relative' },
    { id: 'melodic-minor', name: 'Melodic minor', blurb: 'Raised 6th and 7th going up. Jazz keeps them coming down too.',
      formula: [[0,0],[2,1],[3,2],[5,3],[7,4],[9,5],[11,6]], signature: 'relative' },
    { id: 'dorian', name: 'Dorian', blurb: 'Minor with a bright 6th. The default sound over a 2 chord.',
      formula: [[0,0],[2,1],[3,2],[5,3],[7,4],[9,5],[10,6]], signature: 'none' },
    { id: 'mixolydian', name: 'Mixolydian', blurb: 'Major with a flat 7th. What you play over a dominant chord.',
      formula: [[0,0],[2,1],[4,2],[5,3],[7,4],[9,5],[10,6]], signature: 'none' },
    { id: 'major-pentatonic', name: 'Major pentatonic', blurb: 'Five notes, none of them wrong. Safe over major harmony.',
      formula: [[0,0],[2,1],[4,2],[7,4],[9,5]], signature: 'none' },
    { id: 'minor-pentatonic', name: 'Minor pentatonic', blurb: 'The backbone of blues, soul and rock fills.',
      formula: [[0,0],[3,2],[5,3],[7,4],[10,6]], signature: 'none' },
    /* The blue note is a flat 5 where that spells cleanly (C blues: Gb) and a
       sharp 4 where the flat 5 would need a double flat (Eb blues takes A
       natural, not B double-flat). The third entry is that fallback. */
    { id: 'blues', name: 'Blues', blurb: 'Minor pentatonic plus the flat 5 — the note that does the work.',
      formula: [[0,0],[3,2],[5,3],[6,4,3],[7,4],[10,6]], signature: 'none' }
  ];

  // Candidate spellings for each pitch class, best-first.
  var SPELLINGS = [
    ['C'], ['Db', 'C#'], ['D'], ['Eb', 'D#'], ['E'], ['F'],
    ['Gb', 'F#'], ['G'], ['Ab', 'G#'], ['A'], ['Bb', 'A#'], ['B']
  ];

  function isBlackPc(pc) { return [1, 3, 6, 8, 10].indexOf(((pc % 12) + 12) % 12) >= 0; }

  /* Spell the scale on `root`, returning notes with letter / alter / degree. */
  function spell(root, type) {
    var r = T.parseNote(root);
    return type.formula.map(function (iv, i) {
      var n = T.stepNote(r, iv[0], iv[1]);
      /* Take the alternative letter when the first needs a double accidental,
         and also for Fb and Cb — both are white keys written as a flat, which
         reads badly in a scale you are sight-reading. */
      var awkward = n.alter === -1 && (n.letter === 'F' || n.letter === 'C');
      if ((Math.abs(n.alter) > 1 || awkward) && iv.length > 2) n = T.stepNote(r, iv[0], iv[2]);
      return { letter: n.letter, alter: n.alter, name: T.noteName(n),
               pc: T.notePc(n), degreeStep: iv[1], semis: iv[0], index: i };
    });
  }

  /* Pick the spelling of a pitch class that needs the fewest accidentals and
     no double sharps or flats. */
  function rootFor(pc, type) {
    var best = null;
    SPELLINGS[((pc % 12) + 12) % 12].forEach(function (cand) {
      var notes = spell(cand, type);
      var doubles = notes.filter(function (n) { return Math.abs(n.alter) > 1; }).length;
      var accs = notes.filter(function (n) { return n.alter !== 0; }).length;
      var score = doubles * 100 + accs;
      if (!best || score < best.score) best = { root: cand, score: score };
    });
    return best.root;
  }

  /* Key signature: a major scale uses its own, the minor forms use the
     relative major's, and modal or gapped scales print accidentals instead. */
  function signature(root, type) {
    if (type.signature === 'none') return { sharps: 0, flats: 0 };
    var key = root;
    if (type.signature === 'relative') {
      var rel = T.stepNote(T.parseNote(root), 3, 2);   // up a minor third
      key = T.noteName(rel);
    }
    var notes = spell(key, TYPES[0]);
    var sharps = notes.filter(function (n) { return n.alter > 0; }).length;
    var flats = notes.filter(function (n) { return n.alter < 0; }).length;
    return { sharps: sharps, flats: flats };
  }

  // ---------------------------------------------------------------- fingering
  /* Thumb sets are indices into the eight ascending notes (tonic to octave).
     finger(i) counts up from the previous thumb for the right hand, and down
     to the next thumb for the left. */
  function rhFingers(thumbs) {
    var f = [];
    for (var i = 0; i <= 7; i++) {
      var prev = -99;
      thumbs.forEach(function (t) {
        if (t <= i && t > prev) prev = t;
        if (t - 7 <= i && t - 7 > prev) prev = t - 7;
      });
      f.push(1 + (i - prev));
    }
    return f;
  }
  function lhFingers(thumbs) {
    var f = [];
    for (var i = 0; i <= 7; i++) {
      var next = 99;
      thumbs.forEach(function (t) {
        if (t >= i && t < next) next = t;
        if (t + 7 >= i && t + 7 < next) next = t + 7;
      });
      f.push(1 + (next - i));
    }
    return f;
  }

  function fingering(notes) {
    if (notes.length !== 7) return null;           // only heptatonic scales
    var pcs = notes.map(function (n) { return n.pc; });
    function white(i) { return !isBlackPc(pcs[i % 7]); }
    // white key directly after / before a black one, within the scale
    function afterBlack(i) { return isBlackPc(pcs[(i + 6) % 7]); }
    function beforeBlack(i) { return isBlackPc(pcs[(i + 1) % 7]); }

    var rh = null, lh = null;
    for (var t = 0; t <= 6; t++) {
      for (var gi = 0; gi < 2; gi++) {
        var g = gi ? 4 : 3, t2 = t + g;
        if (t2 > 6) continue;
        if (!white(t) || !white(t2)) continue;
        /* Mirror of the left-hand rule: when the tonic is a white key the right
           thumb starts on it, and that outranks the black-key preference. */
        var score = (t === 0 ? 10 : 0) +
                    (afterBlack(t) ? 2 : 0) + (afterBlack(t2) ? 2 : 0) +
                    (g === 3 ? 0.5 : 0);
        if (!rh || score > rh.score) rh = { score: score, thumbs: [t, t2] };
      }
    }
    for (var a = 0; a <= 4; a++) {
      for (var gj = 0; gj < 2; gj++) {
        var gg = gj ? 4 : 3, bb = a + gg;
        if (bb > 7) continue;
        if (!white(a) || !white(bb)) continue;
        /* The left thumb wants the tonic itself when the tonic is a white key;
           that outranks everything. Only when the tonic is black does the
           "white key just before a black one" preference decide. */
        var s2 = (bb === 7 ? 10 : 0) +
                 (beforeBlack(a) ? 2 : 0) + (beforeBlack(bb) ? 2 : 0) + a * 0.3;
        if (!lh || s2 > lh.score) lh = { score: s2, thumbs: [a, bb] };
      }
    }
    if (!rh || !lh) return null;
    return { rh: rhFingers(rh.thumbs), lh: lhFingers(lh.thumbs) };
  }

  // ---------------------------------------------------------------- assembly
  var LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  /* Pitch of a spelled note. This has to come from the letter plus its
     accidental, not from the wrapped pitch class: Cb5 sounds B4, so deriving
     it from pitch class 11 would place it an octave too high. */
  function midiOf(letter, alter, octave) {
    return 12 * (octave + 1) + LETTER_PC[letter] + (alter || 0);
  }

  /* scale(pc, typeId, octaves, baseOctave) -> everything the UI needs. */
  function scale(pc, typeId, octaves, baseOctave) {
    var type = TYPES.filter(function (x) { return x.id === typeId; })[0] || TYPES[0];
    var root = rootFor(pc, type);
    var base = spell(root, type);
    var sig = signature(root, type);
    var fng = fingering(base);
    octaves = octaves || 1;
    var oct = baseOctave == null ? 4 : baseOctave;

    // Walk the letters; the octave ticks over whenever the letter crosses C.
    var out = [], prevLetter = LET.indexOf(base[0].letter);
    for (var o = 0; o < octaves; o++) {
      base.forEach(function (n, i) {
        var li = LET.indexOf(n.letter);
        if (!(o === 0 && i === 0) && li < prevLetter) oct++;
        prevLetter = li;
        out.push({ letter: n.letter, alter: n.alter, octave: oct, name: n.name,
                   degree: i + 1, midi: midiOf(n.letter, n.alter, oct) });
      });
    }
    var topLi = LET.indexOf(base[0].letter);
    if (topLi < prevLetter) oct++;
    out.push({ letter: base[0].letter, alter: base[0].alter, octave: oct, name: base[0].name,
               degree: 1, midi: midiOf(base[0].letter, base[0].alter, oct) });

    if (fng) {
      var n7 = base.length;
      out.forEach(function (nt, i) {
        var last = i === out.length - 1;
        nt.rh = last ? fng.rh[7] : fng.rh[i % n7];
        nt.lh = last ? fng.lh[7] : fng.lh[i % n7];
      });
    }

    return {
      type: type, root: root, pc: pc, notes: out,
      sharps: sig.sharps, flats: sig.flats,
      degreeNames: base.map(function (n) { return n.name; }),
      hasFingering: !!fng,
      name: root + ' ' + type.name.toLowerCase()
    };
  }

  function types() { return TYPES; }
  function roots(typeId) {
    var type = TYPES.filter(function (x) { return x.id === typeId; })[0] || TYPES[0];
    var order = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];   // circle of fifths
    return order.map(function (pc) { return { pc: pc, name: rootFor(pc, type) }; });
  }

  global.Scales = { types: types, roots: roots, scale: scale, rootFor: rootFor, fingering: fingering, spell: spell };
})(typeof window !== 'undefined' ? window : this);
