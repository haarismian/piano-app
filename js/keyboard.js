/* keyboard.js — SVG piano keyboard that highlights a voicing. */
(function (global) {
  'use strict';
  var T = global.Theory;
  var WHITE_PC = [0, 2, 4, 5, 7, 9, 11];

  function whiteIndex(midi) {
    // number of white keys strictly below this midi note, from C-1
    var oct = Math.floor(midi / 12), pc = ((midi % 12) + 12) % 12;
    var below = 0;
    for (var i = 0; i < WHITE_PC.length; i++) if (WHITE_PC[i] < pc) below++;
    if (T.isBlack(midi)) return oct * 7 + below - 0.5;
    return oct * 7 + below;
  }

  /* Smallest sensible keyboard window containing every note: start on the C at
     or below the lowest note, end on the white key at or above the highest, and
     never show less than an octave. Keeping it tight is what keeps the note
     labels readable when several diagrams sit side by side. */
  function span(midis) {
    if (!midis || !midis.length) return { low: 60, high: 83 };
    var lo = Math.min.apply(null, midis), hi = Math.max.apply(null, midis);
    var low = Math.floor(lo / 12) * 12;
    var high = hi;
    while (T.isBlack(high)) high++;
    if (high - low < 11) high = low + 11;
    return { low: low, high: high };
  }

  /* render(notes, opts) -> SVG string.
     notes: [{midi, name, hand:'L'|'R', bass}]
     opts: { low, high, width, labels } */
  function render(notes, opts) {
    notes = notes || [];
    opts = opts || {};
    var midis = notes.map(function (n) { return n.midi; });
    var low = opts.low, high = opts.high;
    if (low == null) {
      var r = span(midis);
      low = r.low; high = r.high;
    }
    var wLow = whiteIndex(low), wHigh = whiteIndex(high);
    var nWhite = Math.round(wHigh - wLow) + 1;
    var kw = 27, kh = 118, bw = 15, bh = 74;
    var w = nWhite * kw, h = kh;
    var byMidi = {};
    notes.forEach(function (n) { byMidi[n.midi] = n; });

    function fill(n) {
      if (!n) return null;
      if (n.bass) return 'var(--key-bass)';
      return n.hand === 'L' ? 'var(--key-lh)' : 'var(--key-rh)';
    }

    var whites = '', blacks = '', labels = '';
    for (var m = low; m <= high; m++) {
      var x = (whiteIndex(m) - wLow) * kw;
      var hit = byMidi[m];
      if (!T.isBlack(m)) {
        whites += '<rect x="' + x + '" y="0" width="' + (kw - 1) + '" height="' + kh +
          '" rx="3" fill="' + (hit ? fill(hit) : 'var(--key-white)') + '" stroke="var(--key-edge)" stroke-width="1"/>';
        if (hit && opts.labels !== false) {
          labels += '<text x="' + (x + (kw - 1) / 2) + '" y="' + (kh - 10) +
            '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--key-label-dark)">' +
            esc(hit.name) + '</text>';
        }
      } else {
        var bx = x + (kw - bw / 2) - kw / 2 + kw / 2; // centre on the boundary
        bx = (whiteIndex(m) - wLow) * kw + (kw - bw) / 2 + kw / 2 - kw / 2;
        bx = ((whiteIndex(m) + 0.5) - wLow) * kw - bw / 2;
        blacks += '<rect x="' + bx + '" y="0" width="' + bw + '" height="' + bh +
          '" rx="2" fill="' + (hit ? fill(hit) : 'var(--key-black)') + '" stroke="var(--key-edge)" stroke-width="1"/>';
        if (hit && opts.labels !== false) {
          labels += '<text x="' + (bx + bw / 2) + '" y="' + (bh - 7) +
            '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--key-label-dark)">' +
            esc(hit.name) + '</text>';
        }
      }
    }
    return '<svg class="kbd" viewBox="0 0 ' + w + ' ' + h + '" width="100%" ' +
      'preserveAspectRatio="xMidYMid meet" role="img" aria-label="' +
      esc(notes.map(function (n) { return n.name; }).join(' ')) + '">' +
      whites + blacks + labels + '</svg>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  global.Keyboard = { render: render, span: span, esc: esc };
})(typeof window !== 'undefined' ? window : this);
