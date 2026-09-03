/* theory.js — note spelling, chords, voicings, keys.
   No dependencies. Loaded as a classic script so the app works from file://  */
(function (global) {
  'use strict';

  var LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var ACC_NAME = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': '##' };

  function accToNum(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      if (s[i] === '#') n += 1;
      else if (s[i] === 'b' || s[i] === '♭') n -= 1;
    }
    return n;
  }

  function parseNote(name) {
    var letter = name[0].toUpperCase();
    return { letter: letter, alter: accToNum(name.slice(1)) };
  }

  function noteName(note) {
    return note.letter + (ACC_NAME[String(note.alter)] || '');
  }

  function notePc(note) {
    return ((LETTER_PC[note.letter] + note.alter) % 12 + 12) % 12;
  }

  // Move a spelled note by `semis` semitones across `steps` letter names.
  function stepNote(note, semis, steps) {
    var idx = LETTERS.indexOf(note.letter) + steps;
    var octShift = Math.floor(idx / 7);
    var letter = LETTERS[((idx % 7) + 7) % 7];
    var target = notePc(note) + semis;
    var alter = ((target - LETTER_PC[letter]) % 12 + 12) % 12;
    if (alter > 6) alter -= 12;
    return { letter: letter, alter: alter, oct: octShift };
  }

  // ---- chord formulas: [semitones, letterSteps] from the root ----
  var FORMULAS = {
    'maj':   [[0,0],[4,2],[7,4]],
    'min':   [[0,0],[3,2],[7,4]],
    'dim':   [[0,0],[3,2],[6,4]],
    'aug':   [[0,0],[4,2],[8,4]],
    'sus2':  [[0,0],[2,1],[7,4]],
    'sus4':  [[0,0],[5,3],[7,4]],
    '6':     [[0,0],[4,2],[7,4],[9,5]],
    'm6':    [[0,0],[3,2],[7,4],[9,5]],
    'maj7':  [[0,0],[4,2],[7,4],[11,6]],
    '7':     [[0,0],[4,2],[7,4],[10,6]],
    'm7':    [[0,0],[3,2],[7,4],[10,6]],
    'm7b5':  [[0,0],[3,2],[6,4],[10,6]],
    'dim7':  [[0,0],[3,2],[6,4],[9,5]],
    '7sus4': [[0,0],[5,3],[7,4],[10,6]],
    'add9':  [[0,0],[4,2],[7,4],[14,8]],
    'madd9': [[0,0],[3,2],[7,4],[14,8]],
    '9':     [[0,0],[4,2],[7,4],[10,6],[14,8]],
    'm9':    [[0,0],[3,2],[7,4],[10,6],[14,8]]
  };

  // Symbols accepted in chord strings, longest first so "maj7" beats "m".
  var SUFFIXES = [
    ['maj7', 'maj7'], ['M7', 'maj7'], ['m7b5', 'm7b5'], ['dim7', 'dim7'],
    ['7sus4', '7sus4'], ['7sus', '7sus4'], ['madd9', 'madd9'], ['add9', 'add9'],
    ['sus2', 'sus2'], ['sus4', 'sus4'], ['sus', 'sus4'], ['dim', 'dim'],
    ['aug', 'aug'], ['m9', 'm9'], ['m7', 'm7'], ['m6', 'm6'],
    ['min', 'min'], ['9', '9'], ['7', '7'], ['6', '6'],
    ['m', 'min'], ['+', 'aug'], ['°', 'dim'], ['', 'maj']
  ];

  // "Am7", "F#m7b5", "C/G" -> { root, quality, bass, symbol }
  function parseChord(sym) {
    var symbol = String(sym).trim();
    var bass = null;
    var slash = symbol.indexOf('/');
    var body = symbol;
    if (slash > 0) { bass = symbol.slice(slash + 1); body = symbol.slice(0, slash); }
    var m = /^([A-Ga-g])([#b♭]*)(.*)$/.exec(body);
    if (!m) return null;
    var root = m[1].toUpperCase() + m[2].replace(/♭/g, 'b');
    var rest = m[3];
    for (var i = 0; i < SUFFIXES.length; i++) {
      if (rest === SUFFIXES[i][0]) {
        return { root: root, quality: SUFFIXES[i][1], bass: bass, symbol: symbol };
      }
    }
    return { root: root, quality: 'maj', bass: bass, symbol: symbol };
  }

  // Spelled note names of a chord, low to high, root position.
  function chordNotes(sym) {
    var c = typeof sym === 'string' ? parseChord(sym) : sym;
    if (!c) return [];
    var root = parseNote(c.root);
    var f = FORMULAS[c.quality] || FORMULAS.maj;
    return f.map(function (iv) { return stepNote(root, iv[0], iv[1]); });
  }

  function chordNoteNames(sym) {
    return chordNotes(sym).map(noteName);
  }

  // ---- MIDI realisation ----
  function pcToMidiAtOrAbove(pc, floorMidi) {
    var m = Math.ceil((floorMidi - pc) / 12) * 12 + pc;
    return m;
  }

  /* Realise a chord as MIDI notes.
     opts: { octave: base octave for lowest voice (default 4),
             inversion: 0..n, voicing: 'close'|'shell'|'shell37'|'rootless'|'open',
             hand: 'R'|'L' } */
  function voice(sym, opts) {
    opts = opts || {};
    var c = typeof sym === 'string' ? parseChord(sym) : sym;
    if (!c) return [];
    var notes = chordNotes(c);
    var base = 12 * ((opts.octave == null ? 4 : opts.octave) + 1);
    var inv = opts.inversion || 0;
    var v = opts.voicing || 'close';
    var out = [];

    /* A slash chord whose bass is one of the chord's own notes is just an
       inversion (C/E is C in first inversion), so rotate rather than bolting an
       extra note underneath. Only a bass note foreign to the chord — C/B — gets
       added below. */
    var addBass = null;
    if (c.bass) {
      var bn = parseNote(c.bass), bpc = notePc(bn), found = -1;
      for (var bi = 0; bi < notes.length; bi++) if (notePc(notes[bi]) === bpc) { found = bi; break; }
      if (found >= 0 && v === 'close') inv = found;
      else addBass = bn;
    }

    function stack(list, floor) {
      var res = [], prev = floor;
      for (var i = 0; i < list.length; i++) {
        var m = pcToMidiAtOrAbove(notePc(list[i]), prev);
        res.push({ midi: m, name: noteName(list[i]) });
        prev = m + 1;
      }
      return res;
    }

    if (v === 'shell') {          // root + 7th (or 5th on triads)
      var sh = [notes[0], notes[3] || notes[2]];
      out = stack(sh, base);
    } else if (v === 'shell37') { // root + 3rd + 7th
      var s3 = [notes[0], notes[1], notes[3] || notes[2]];
      out = stack(s3, base);
    } else if (v === 'rootless') { // 3 5 7 9-ish: drop the root
      out = stack(notes.slice(1), base);
    } else if (v === 'open') {    // root, then the rest an octave up
      out = stack([notes[0]], base).concat(stack(notes.slice(1), base + 12));
    } else {                      // close position, with inversion
      var list = notes.slice();
      for (var i = 0; i < inv; i++) list.push(list.shift());
      out = stack(list, base);
    }

    if (addBass) {
      out.unshift({ midi: pcToMidiAtOrAbove(notePc(addBass), base - 12), name: noteName(addBass), bass: true });
    }
    if (opts.hand) out.forEach(function (n) { n.hand = opts.hand; });
    return out;
  }

  // ---- keys & scales ----
  var MAJOR_STEPS = [[0,0],[2,1],[4,2],[5,3],[7,4],[9,5],[11,6]];
  var DEGREE_QUALITY = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
  var DEGREE_7TH = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'];
  var ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

  function scaleNotes(key) {
    var root = parseNote(key);
    return MAJOR_STEPS.map(function (iv) { return stepNote(root, iv[0], iv[1]); });
  }

  function scaleNoteNames(key) { return scaleNotes(key).map(noteName); }

  // Diatonic chord for degree 1..7 in `key`. sevenths=true for 7th chords.
  function diatonic(key, degree, sevenths) {
    var n = scaleNotes(key)[(degree - 1) % 7];
    var q = (sevenths ? DEGREE_7TH : DEGREE_QUALITY)[(degree - 1) % 7];
    var suffix = { maj: '', min: 'm', dim: 'dim', maj7: 'maj7', m7: 'm7', '7': '7', m7b5: 'm7b5' }[q];
    return noteName(n) + suffix;
  }

  // "1 5 6 4" (or [1,5,6,4]) in a key -> ["C","G","Am","F"]
  function numbersToChords(numbers, key, sevenths) {
    var arr = Array.isArray(numbers) ? numbers : String(numbers).trim().split(/\s+/);
    return arr.map(function (d) {
      var m = /^([b#]?)(\d)(.*)$/.exec(String(d));
      if (!m) return String(d);
      var chord = diatonic(key, parseInt(m[2], 10), sevenths);
      return chord + (m[3] || '');
    });
  }

  // Keys singers actually call, roughly in order of how often they come up.
  var SINGER_KEYS = ['C', 'G', 'F', 'D', 'A', 'Bb', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#'];
  var CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

  function midiName(midi) {
    var pc = ((midi % 12) + 12) % 12;
    var sharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return sharp[pc] + (Math.floor(midi / 12) - 1);
  }

  function isBlack(midi) {
    return [1, 3, 6, 8, 10].indexOf(((midi % 12) + 12) % 12) >= 0;
  }

  global.Theory = {
    parseNote: parseNote, noteName: noteName, notePc: notePc, stepNote: stepNote,
    parseChord: parseChord, chordNotes: chordNotes, chordNoteNames: chordNoteNames,
    voice: voice, scaleNotes: scaleNotes, scaleNoteNames: scaleNoteNames,
    diatonic: diatonic, numbersToChords: numbersToChords,
    SINGER_KEYS: SINGER_KEYS, CIRCLE_OF_FIFTHS: CIRCLE_OF_FIFTHS, ROMAN: ROMAN,
    midiName: midiName, isBlack: isBlack, FORMULAS: FORMULAS
  };
})(typeof window !== 'undefined' ? window : this);
