/* notation.js — a small SVG music engraver, enough for scales.

   Draws a staff with clef, key signature, noteheads with stems, ledger lines,
   cautionary accidentals and fingering numbers. Everything is hand-drawn SVG
   so the app keeps working offline and from file://. */
(function (global) {
  'use strict';

  var SP = 10;          // one staff space
  var HALF = SP / 2;    // one diatonic step
  var LETTERS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

  // Diatonic index of the note sitting on the bottom staff line.
  var BOTTOM = { treble: 2 + 7 * 4, bass: 4 + 7 * 2 };   // E4 / G2

  function idx(letter, octave) { return LETTERS[letter] + 7 * octave; }

  function yFor(letter, octave, clef) {
    return 4 * SP - (idx(letter, octave) - BOTTOM[clef]) * HALF;
  }

  // Key-signature glyph positions, in the conventional order and octaves.
  var SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
  var FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
  var SHARP_OCT = { treble: { F: 5, C: 5, G: 5, D: 5, A: 4, E: 5, B: 4 },
                    bass:   { F: 3, C: 3, G: 3, D: 3, A: 2, E: 3, B: 2 } };
  var FLAT_OCT  = { treble: { B: 4, E: 5, A: 4, D: 5, G: 4, C: 5, F: 4 },
                    bass:   { B: 2, E: 3, A: 2, D: 3, G: 2, C: 3, F: 2 } };

  /* Clefs, drawn as stroked outlines rather than filled engraver glyphs — no
     music font is needed, and a single-weight stroke suits the UI. Coordinates
     are staff units: y=0 is the top line, y=40 the bottom, so the treble
     spiral sits on G4 (y=30) and the bass dots straddle F3 (y=10). */
  function clefPath(clef) {
    var stroke = 'fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round"';
    if (clef === 'treble') {
      return '<path ' + stroke + ' d="' +
        'M17 30' +
        'C11 30 8 34 9 39' +
        'C10 45 17 48 22 43' +
        'C28 37 27 28 23 20' +
        'C19 12 13 6 12 -1' +
        'C11 -9 15 -15 19 -15' +
        'C23 -15 25 -8 24 -1' +
        'C23 9 19 18 19 30' +
        'L19 45' +
        'C19 51 15 54 11 52' +
        'C8 50 9 46 12 46"/>';
    }
    return '<path ' + stroke + ' d="' +
      'M7 15C7 8 13 5 18 8C23 11 23 19 19 25C15 31 10 35 4 37"/>' +
      '<circle cx="26" cy="6" r="1.9" fill="currentColor"/>' +
      '<circle cx="26" cy="14" r="1.9" fill="currentColor"/>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* render(notes, opts) -> SVG string.
       notes: [{ letter, octave, alter, finger }]
       opts:  { clef, sharps, flats, title }
     `sharps`/`flats` give the key signature; a note whose accidental differs
     from what the signature implies gets one printed in front of it. */
  function render(notes, opts) {
    opts = opts || {};
    var clef = opts.clef === 'bass' ? 'bass' : 'treble';
    var sharps = opts.sharps || 0, flats = opts.flats || 0;

    var padL = 8, clefW = clef === 'treble' ? 32 : 30;
    var sigW = (sharps + flats) * 9 + ((sharps + flats) ? 8 : 4);
    var noteStart = padL + clefW + sigW;
    var gap = 22;
    var width = noteStart + notes.length * gap + 14;

    /* Measure first: a fingering row guessed at a fixed offset collides with
       stems and ledger lines, so work out where the ink actually ends. */
    var STEM = 32, inkTop = 0, inkBottom = 4 * SP;
    notes.forEach(function (nt) {
      var y = yFor(nt.letter, nt.octave, clef);
      var up = y > 2 * SP;
      inkTop = Math.min(inkTop, y - 6, up ? y - STEM : y);
      inkBottom = Math.max(inkBottom, y + 6, up ? y : y + STEM);
    });
    var hasFingers = notes.some(function (nt) { return nt.finger; });
    var fingerY = clef === 'bass' ? inkBottom + 16 : inkTop - 9;
    var top = (hasFingers && clef !== 'bass' ? fingerY - 11 : inkTop) - 10;
    var bottom = (hasFingers && clef === 'bass' ? fingerY : inkBottom) + 10;
    var height = bottom - top;

    var out = [];

    // staff
    for (var i = 0; i < 5; i++) {
      out.push('<line x1="' + padL + '" y1="' + (i * SP) + '" x2="' + (width - 6) +
        '" y2="' + (i * SP) + '" stroke="currentColor" stroke-width="1.1" opacity=".85"/>');
    }
    out.push('<g>' + clefPath(clef) + '</g>');

    // key signature
    var sigX = padL + clefW;
    var sigNotes = sharps ? SHARP_ORDER.slice(0, sharps) : FLAT_ORDER.slice(0, flats);
    var sigOct = sharps ? SHARP_OCT[clef] : FLAT_OCT[clef];
    sigNotes.forEach(function (L, n) {
      var y = yFor(L, sigOct[L], clef);
      out.push(glyph(sharps ? '♯' : '♭', sigX + n * 9 + 4, y));
    });

    // what the signature already does to each letter
    var implied = {};
    sigNotes.forEach(function (L) { implied[L] = sharps ? 1 : -1; });

    notes.forEach(function (nt, n) {
      var x = noteStart + n * gap;
      var y = yFor(nt.letter, nt.octave, clef);
      var alter = nt.alter || 0;

      // ledger lines
      var ly;
      for (ly = 4 * SP + SP; ly <= y + 0.1; ly += SP) out.push(ledger(x, ly));
      for (ly = -SP; ly >= y - 0.1; ly -= SP) out.push(ledger(x, ly));

      if (alter !== (implied[nt.letter] || 0)) {
        out.push(glyph(alter === 1 ? '♯' : alter === -1 ? '♭' : '♮', x - 13, y));
        implied[nt.letter] = alter;
      }

      // notehead
      out.push('<ellipse cx="' + x + '" cy="' + y + '" rx="6.4" ry="4.7" ' +
        'transform="rotate(-20 ' + x + ' ' + y + ')" fill="currentColor"/>');
      // stem — up below the middle line, down above it
      var up = y > 2 * SP;
      out.push('<line x1="' + (x + (up ? 5.9 : -5.9)) + '" y1="' + y +
        '" x2="' + (x + (up ? 5.9 : -5.9)) + '" y2="' + (y + (up ? -32 : 32)) +
        '" stroke="currentColor" stroke-width="1.4"/>');

      if (nt.finger) {
        out.push('<text x="' + x + '" y="' + fingerY +
          '" text-anchor="middle" style="font-size:11px" font-weight="700" ' +
          'fill="currentColor" opacity=".55">' + esc(nt.finger) + '</text>');
      }
    });

    return '<svg class="staff" viewBox="' + 0 + ' ' + top + ' ' + width + ' ' + height + '" ' +
      'width="100%" preserveAspectRatio="xMinYMid meet" role="img" aria-label="' +
      esc(opts.title || 'scale notation') + '">' + out.join('') + '</svg>';
  }

  function ledger(x, y) {
    return '<line x1="' + (x - 10) + '" y1="' + y + '" x2="' + (x + 10) + '" y2="' + y +
      '" stroke="currentColor" stroke-width="1.1"/>';
  }

  function glyph(ch, x, y) {
    return '<text x="' + x + '" y="' + (y + 6.5) + '" text-anchor="middle" font-size="011" ' +
      'style="font-size:19px" fill="currentColor" font-family="serif">' + ch + '</text>';
  }

  global.Notation = { render: render, yFor: yFor, SP: SP };
})(typeof window !== 'undefined' ? window : this);
