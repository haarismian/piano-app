/* app.js — views, session runner, reference tools. */
(function () {
  'use strict';
  var T = window.Theory, K = window.Keyboard, C = window.Curriculum,
      S = window.Store, Sess = window.Session, A = window.Audio2;

  var esc = K.esc;
  var main = document.getElementById('main');
  var view = 'today';
  var openStep = 0;
  var openUnit = null;
  var timer = { id: null, left: 0, total: 0, stepId: null };

  function h(html) { return html; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------------------------------------------------------------- voicing
  /* Choose the inversion of each chord closest to the previous one, so the
     displayed shapes match the voice-leading the course actually teaches. */
  function voiceLead(symbols, octave) {
    var prev = null, out = [];
    symbols.forEach(function (sym) {
      var p = T.parseChord(sym);
      if (!p) { out.push([]); return; }
      var n = T.chordNotes(p).length;
      var best = null, bestCost = Infinity;
      for (var inv = 0; inv < n; inv++) {
        var v = T.voice({ root: p.root, quality: p.quality, bass: null },
                        { inversion: inv, octave: octave == null ? 4 : octave, hand: 'R' });
        var avg = v.reduce(function (a, x) { return a + x.midi; }, 0) / v.length;
        var cost = prev === null ? Math.abs(avg - 64) : Math.abs(avg - prev);
        if (v.some(function (x) { return x.midi < 55 || x.midi > 81; })) cost += 40;
        if (cost < bestCost) { bestCost = cost; best = v; }
      }
      prev = best.reduce(function (a, x) { return a + x.midi; }, 0) / best.length;
      out.push(best);
    });
    return out;
  }

  /* Bass notes chosen so each one sits nearest the previous — otherwise a
     written descending line like C B A G reads as a jump up to B. */
  function bassLine(symbols, octave) {
    var prev = null;
    return symbols.map(function (sym) {
      var p = T.parseChord(sym);
      var n = T.parseNote((p && (p.bass || p.root)) || 'C');
      var pc = T.notePc(n);
      var m;
      if (prev === null) {
        var base = 12 * ((octave == null ? 3 : octave) + 1);
        m = Math.ceil((base - pc) / 12) * 12 + pc;
      } else {
        m = Math.round((prev - pc) / 12) * 12 + pc;
        if (m === prev) m = prev;
      }
      prev = m;
      return [{ midi: m, name: T.noteName(n), hand: 'L' }];
    });
  }

  function chordBox(label, notes, sublabel, range) {
    var midis = notes.map(function (n) { return n.midi; });
    return '<div class="chordbox">' +
      '<div class="name">' + esc(label) +
      '<button class="play" data-play="' + midis.join(',') + '" title="Hear it">&#9654;</button>' +
      (sublabel ? '<span class="spell">' + esc(sublabel) + '</span>' : '') + '</div>' +
      '<div class="kbdwrap">' + K.render(notes, range) + '</div></div>';
  }

  /* One shared keyboard window for a whole set, so the shapes are comparable
     side by side instead of every diagram sliding around. */
  function spanOf(sets) {
    var all = [];
    sets.forEach(function (s) { s.forEach(function (n) { all.push(n.midi); }); });
    return K.span(all);
  }

  /* Turn an exercise `show` spec into keyboards. */
  function renderShow(show) {
    if (!show) return '';
    var boxes = [];
    if (show.key && show.numbers) {
      var syms = T.numbersToChords(show.numbers, show.key, show.sevenths);
      var voiced = voiceLead(syms, 4);
      var nums = String(show.numbers).trim().split(/\s+/);
      var lhs = bassLine(syms, 3);
      var sets = syms.map(function (sym, i) { return lhs[i].concat(voiced[i]); });
      var range = spanOf(sets);
      sets.forEach(function (notes, i) {
        boxes.push(chordBox(nums[i] + '  ·  ' + syms[i], notes, T.chordNoteNames(syms[i]).join(' '), range));
      });
      return '<div class="chordset wide">' + boxes.join('') + '</div>' +
        '<p class="tiny muted">Key of ' + esc(show.key) + '. Blue = left hand, orange = right hand, voice-led.</p>';
    }
    /* A written bass line under held chords: left hand takes the slash note,
       right hand keeps a voice-led shape of the plain chord. */
    if (show.chords && show.bassline) {
      var plain = show.chords.map(function (sym) {
        var c = T.parseChord(sym);
        return c.root + ({ maj: '', min: 'm' }[c.quality] !== undefined
          ? { maj: '', min: 'm' }[c.quality] : c.quality);
      });
      var rh = voiceLead(plain, 4);
      var bl = bassLine(show.chords, 3);
      var bsets = show.chords.map(function (sym, i) { return bl[i].concat(rh[i]); });
      var brange = spanOf(bsets);
      var bbox = bsets.map(function (notes, i) {
        return chordBox(show.chords[i], notes,
          'bass ' + notes[0].name + '  ·  ' + T.chordNoteNames(plain[i]).join(' '), brange);
      });
      return '<div class="chordset wide">' + bbox.join('') + '</div>' +
        '<p class="tiny muted">Blue = left hand (the bass line), orange = right hand.</p>';
    }

    if (show.chords) {
      var hand = show.hand || 'R';
      var oct = show.octave == null ? (hand === 'L' ? 3 : 4) : show.octave;
      var sets2 = show.chords.map(function (sym, i) {
        if (show.voicing) return T.voice(sym, { voicing: show.voicing, octave: oct, hand: hand });
        if (show.inversions) return T.voice(sym, { inversion: show.inversions[i] || 0, octave: oct, hand: hand });
        return T.voice(sym, { octave: oct, hand: hand });
      });
      var range2 = spanOf(sets2);
      show.chords.forEach(function (sym, i) {
        var notes = sets2[i];
        var lbl = sym;
        if (show.inversions) lbl += ' (' + ['root position', '1st inversion', '2nd inversion', '3rd inversion'][show.inversions[i] || 0] + ')';
        boxes.push(chordBox(lbl, notes, T.chordNoteNames(sym).join(' '), range2));
      });
      var legend = hand === 'L' ? 'Left hand.' : 'Right hand.';
      if (show.voicing === 'shell') legend += ' Shell: root and 7th only.';
      if (show.voicing === 'shell37') legend += ' Shell: root, 3rd and 7th.';
      if (show.voicing === 'open') legend += ' Spread over an octave.';
      return '<div class="chordset">' + boxes.join('') + '</div><p class="tiny muted">' + legend + '</p>';
    }
    return '';
  }

  // ---------------------------------------------------------------- tools
  var callState = {};

  function toolHTML(tool, ex) {
    if (tool === 'metronome') {
      var b = (ex && ex.bpm) || { start: 80, goal: 90 };
      return '<div class="tool"><h4>Metronome</h4><div class="row">' +
        '<button class="mini" data-met="' + b.start + '">Start at ' + b.start + ' bpm</button>' +
        '<button class="mini" data-met="' + b.goal + '">Goal: ' + b.goal + ' bpm</button>' +
        '<span class="tiny muted">Opens the click at the bottom of the screen.</span></div></div>';
    }
    if (tool === 'random-chord') {
      var pool = (ex && ex.show && ex.show.chords) ? ex.show.chords : ['C', 'Dm', 'Em', 'F', 'G', 'Am'];
      return '<div class="tool" data-tool="random-chord" data-pool="' + esc(pool.join(',')) + '">' +
        '<h4>Random chord caller</h4><div class="bigcall" data-out>—<small>press call</small></div>' +
        '<button class="mini" data-call>Call a chord</button></div>';
    }
    if (tool === 'random-key') {
      return '<div class="tool" data-tool="random-key"><h4>Cold-call: key + progression</h4>' +
        '<div class="bigcall" data-out>—<small>press call</small></div>' +
        '<button class="mini" data-call>Call it</button></div>';
    }
    if (tool === 'number-drill') {
      return '<div class="tool" data-tool="number-drill"><h4>Number drill</h4>' +
        '<div class="bigcall" data-out>—<small>press call, say the chord, then reveal</small></div>' +
        '<div class="row"><button class="mini" data-call>Call</button>' +
        '<button class="mini" data-reveal>Reveal</button></div></div>';
    }
    return '';
  }

  function runTool(node, action) {
    var kind = node.getAttribute('data-tool');
    var out = $('[data-out]', node);
    if (kind === 'random-chord') {
      var pool = node.getAttribute('data-pool').split(',');
      var c = pool[Math.floor(Math.random() * pool.length)];
      out.innerHTML = esc(c) + '<small>' + esc(T.chordNoteNames(c).join(' – ')) + '</small>';
    } else if (kind === 'random-key') {
      var keys = T.SINGER_KEYS;
      var progs = ['1 5 6 4', '1 6 4 5', '6 4 1 5', '1 4 5 4', '2 5 1', '1 5 4 5'];
      var k = keys[Math.floor(Math.random() * keys.length)];
      var p = progs[Math.floor(Math.random() * progs.length)];
      node.setAttribute('data-answer', T.numbersToChords(p, k).join('  '));
      out.innerHTML = esc(k) + ' &nbsp;·&nbsp; ' + esc(p) + '<small>five seconds — go</small>';
      callState.pending = { node: node };
    } else if (kind === 'number-drill') {
      if (action === 'reveal') {
        out.querySelector('small').textContent = node.getAttribute('data-answer') || '—';
        return;
      }
      var kk = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab'][Math.floor(Math.random() * 9)];
      var deg = 1 + Math.floor(Math.random() * 6);
      node.setAttribute('data-answer', T.diatonic(kk, deg) + '  (' + T.chordNoteNames(T.diatonic(kk, deg)).join(' ') + ')');
      out.innerHTML = 'the ' + deg + ' of ' + esc(kk) + '<small>say it out loud, then reveal</small>';
    }
    if (kind === 'random-key' && action === 'reveal') {
      out.querySelector('small').textContent = node.getAttribute('data-answer');
    }
  }

  // ---------------------------------------------------------------- today
  function renderToday() {
    var active = S.getActive();
    if (!active) return renderStart();
    return renderSession(active);
  }

  function renderStart() {
    var unit = S.currentUnit();
    var st = S.load();
    var ready = Sess.readiness(unit);
    var last = st.sessions[st.sessions.length - 1];
    var dur = S.setting('minutes') || 15;
    var opts = [5, 10, 15, 20, 30, 45];

    var html = '<div class="hero">' +
      '<div class="pill">Session ' + S.sessionNumber() + '</div>' +
      '<h1 style="margin-top:9px">Unit ' + unit.number + ' — ' + esc(unit.title) + '</h1>' +
      '<p class="sub">' + esc(unit.stageTitle) + ' · Step ' + unit.number + ' of ' + C.count + ' on the path</p>' +
      '<p class="goal" style="margin-top:14px"><b>Objective:</b> ' + esc(unit.goal) + '</p>' +
      '<div class="durations">' +
      opts.map(function (m) {
        return '<button class="mini' + (m === dur ? ' on' : '') + '" data-dur="' + m + '">' + m + ' min</button>';
      }).join('') + '</div>' +
      '<button class="btn wide" data-start style="margin-top:12px">Start session ' + S.sessionNumber() + '</button>' +
      '<p class="tiny muted" style="margin:10px 0 0;text-align:center">Not where you actually are? ' +
      '<button class="linky" data-view="path">Pick any unit from the full list</button></p>' +
      '</div>';

    html += '<div class="card"><div class="spread"><h3>Where you are</h3>' +
      '<span class="tiny muted">' + Math.round(ready * 100) + '% of the reps for this unit</span></div>' +
      '<div class="meter"><i style="width:' + Math.round(ready * 100) + '%"></i></div>' +
      '<p class="small muted" style="margin:0">' + esc(unit.why) + '</p>' +
      (ready >= 0.7 ? '<p class="small" style="margin:10px 0 0"><b style="color:var(--accent)">You have put in the reps.</b> ' +
        'Take the checkpoint on the Path tab when you are ready to move to unit ' + (unit.number + 1) + '.</p>' : '') +
      '</div>';

    if (last) {
      html += '<div class="card small muted">Last session: #' + last.n + ' on ' + last.date +
        ' · ' + last.minutes + ' min · ' + last.completed + ' of ' + last.planned + ' steps done.</div>';
    } else {
      html += '<div class="card"><h3>How this works</h3>' +
        '<p class="small muted" style="margin:8px 0 0">Pick a length and press start. You get a numbered list of steps ' +
        'with exact instructions — do them in order and stop when you run out of time. ' +
        'Every unit ends in a checkpoint; passing it unlocks the next unit. ' +
        'Nothing is required daily, and the app picks up where you left off.</p></div>';
    }
    return html;
  }

  function blockPill(block) {
    var m = { 'Warm-up': 'warm', 'Core work': 'core', 'Review': 'rev', 'Apply it': 'app' };
    return '<span class="pill ' + (m[block] || '') + '">' + esc(block) + '</span>';
  }

  function renderSession(sess) {
    var doneCount = sess.items.filter(function (i) { return i.done; }).length;
    var pct = Math.round(doneCount / sess.items.length * 100);
    var unit = C.unit(sess.unitId);

    var html = '<div class="hero">' +
      '<div class="spread"><div>' +
      '<div class="pill">Session ' + sess.n + '</div>' +
      '<h1 style="margin-top:9px">Unit ' + sess.unitNumber + ' — ' + esc(sess.unitTitle) + '</h1>' +
      '<p class="sub">' + sess.minutes + ' minutes · ' + sess.items.length + ' step' +
      (sess.items.length === 1 ? '' : 's') + ' · ' + doneCount + ' done</p>' +
      (sess.oneOff ? '<p class="tiny muted" style="margin:6px 0 0">One-off ' +
        (sess.single ? 'drill' : 'session') + ' — your place on the path stays at unit ' +
        (S.load().currentUnitIndex + 1) + '.</p>' : '') + '</div>' +
      '<button class="mini ghost" data-abandon title="Discard this session">Discard</button></div>' +
      '<div class="meter" style="margin-top:12px"><i style="width:' + pct + '%"></i></div>' +
      '</div>';

    if (doneCount === sess.items.length) {
      var ready = Sess.readiness(unit);
      html += '<div class="card" style="border-color:var(--accent)">' +
        '<h3>Session ' + sess.n + ' complete.</h3>' +
        '<p class="small muted">' + sess.minutes + ' minutes logged against unit ' + sess.unitNumber + '. ' +
        'You are now at ' + Math.round(ready * 100) + '% of the recommended reps for this unit.</p>' +
        (ready >= 0.7
          ? '<p class="small">Next: take the <b>' + esc(unit.checkpoint.title) + '</b> checkpoint on the Path tab.</p>'
          : '<p class="small">Next: another session on this unit. Keep going until the reps meter is full, then take the checkpoint.</p>') +
        '<button class="btn" data-finish style="margin-top:8px">Log it and finish</button></div>';
    }

    var lastBlock = null;
    html += '<div class="steplist">';
    sess.items.forEach(function (it, i) {
      var ex = C.exercises[it.id];
      if (it.block !== lastBlock) { html += '<div class="blockhead">' + esc(it.block) + '</div>'; lastBlock = it.block; }
      var isOpen = i === openStep;
      var cls = 'step' + (isOpen ? ' current' : '') + (it.done ? ' done' : '');
      html += '<div class="' + cls + '" data-step="' + i + '">' +
        '<button class="stephead" data-open="' + i + '">' +
        '<span class="num">' + (it.done ? '&#10003;' : it.step) + '</span>' +
        '<span class="stitle">' + esc(ex.title) + '</span>' +
        '<span class="mins">' + it.minutes + ' min</span></button>';
      if (isOpen) html += stepBody(it, ex, i, sess);
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function stepBody(it, ex, i, sess) {
    var reps = S.reps(ex.id);
    var target = ex.reps || 8;
    var body = '<div class="stepbody">' +
      '<div class="row" style="margin-top:12px">' + blockPill(it.block) +
      (ex.type === 'warmup' ? '' : '<span class="pill">' + esc(ex.type) + '</span>') +
      (ex.unitNumber !== sess.unitNumber ? '<span class="pill">from unit ' + ex.unitNumber + '</span>' : '') +
      '<span class="tiny muted">done ' + reps + ' / ' + target + ' times</span></div>';

    body += '<ol>' + ex.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>';
    body += '<div class="target"><b>Done when:</b> ' + esc(ex.target) + '</div>';

    if (ex.bpm) {
      body += '<p class="small muted">Tempo: start at ' + ex.bpm.start + ' bpm, goal ' + ex.bpm.goal + ' bpm.</p>';
    }
    body += renderShow(ex.show);
    if (ex.tool) body += toolHTML(ex.tool, ex);
    if (!ex.tool && ex.bpm) body += toolHTML('metronome', ex);

    // timer
    var running = timer.stepId === it.id;
    var left = running ? timer.left : it.minutes * 60;
    var pct = running && timer.total ? (timer.left / timer.total * 100) : 100;
    body += '<div class="tool"><h4>Timer</h4>' +
      '<div class="row"><span class="timer' + (left < 0 ? ' over' : '') + '" data-timer>' + fmtTime(left) + '</span>' +
      '<button class="mini" data-timer-toggle="' + it.id + '" data-mins="' + it.minutes + '">' +
      (running && timer.id ? 'Pause' : 'Start ' + it.minutes + ' min') + '</button>' +
      '<button class="mini ghost" data-timer-reset>Reset</button></div>' +
      '<div class="timerbar"><i style="width:' + pct + '%"></i></div></div>';

    var note = S.getNote(ex.id);
    body += '<details style="margin-top:10px"><summary class="tiny muted" style="cursor:pointer">Notes on this exercise</summary>' +
      '<textarea data-note="' + ex.id + '" placeholder="What went wrong, what tempo you reached, what to fix next time.">' +
      esc(note) + '</textarea></details>';

    body += '<div class="row" style="margin-top:14px">' +
      (it.done
        ? '<button class="btn secondary" data-undone="' + i + '">Mark not done</button>'
        : '<button class="btn" data-done="' + i + '">Done &rarr; next step</button>') +
      '<button class="mini ghost" data-skip="' + i + '">Skip for now</button></div>';

    body += '</div>';
    return body;
  }

  function fmtTime(sec) {
    var neg = sec < 0; sec = Math.abs(sec);
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return (neg ? '+' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ---------------------------------------------------------------- path
  var pathQuery = '';

  /* Search across everything a unit is about — "flat keys", "shell", "rubato",
     "Alberti", "Eb" — but weight where the words landed, so a unit whose title
     is about flat keys beats one that merely says "feet flat" and "white keys"
     somewhere in its instructions. */
  var FIELD_WEIGHT = [
    [function (u) { return u.title; }, 6],
    [function (u) { return u.goal + ' ' + u.keys.join(' '); }, 3],
    [function (u) { return u.why + ' ' + u.stageTitle + ' unit ' + u.number; }, 2],
    [function (u) { return u.exercises.map(function (e) { return e.title; }).join(' '); }, 2],
    [function (u) { return u.checkpoint.title + ' ' + u.checkpoint.criteria.join(' '); }, 1],
    [function (u) { return u.exercises.map(function (e) { return e.steps.join(' '); }).join(' '); }, 0.5]
  ];

  function unitScore(u, q) {
    if (!q) return 1;
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var fields = FIELD_WEIGHT.map(function (f) { return [f[0](u).toLowerCase(), f[1]]; });
    var total = 0;
    for (var i = 0; i < words.length; i++) {
      var best = 0;
      for (var j = 0; j < fields.length; j++) {
        if (fields[j][0].indexOf(words[i]) >= 0 && fields[j][1] > best) best = fields[j][1];
      }
      if (!best) return 0;          // every word must appear somewhere
      total += best;
    }
    return total;
  }

  function unitMatches(u, q) { return unitScore(u, q) > 0; }

  function renderPath() {
    var st = S.load();
    var q = pathQuery.trim();
    var hits = C.units.filter(function (u) { return unitMatches(u, q); });

    var html = '<div class="card"><div class="spread"><div><h3>The path</h3>' +
      '<p class="small muted" style="margin:4px 0 0">' + C.count + ' units, in order. Each ends in a ' +
      'checkpoint you assess yourself against.</p></div>' +
      '<div style="text-align:right"><b style="font-size:22px">' + (st.currentUnitIndex + 1) + '</b>' +
      '<div class="tiny muted">of ' + C.count + '</div></div></div>' +
      '<div class="meter" style="margin-top:12px"><i style="width:' +
      Math.round(st.currentUnitIndex / C.count * 100) + '%"></i></div>' +
      '<p class="tiny muted" style="margin:10px 0 0">New device, or already know some of this? ' +
      'Open any unit below and press <b>Start here</b> to move your place on the path. ' +
      'You can practise any unit without moving it.</p>' +
      '<input type="text" data-pathq value="' + esc(pathQuery) + '" ' +
      'placeholder="Search all ' + C.count + ' units — try &quot;flat keys&quot;, &quot;rubato&quot;, &quot;shell&quot;" ' +
      'style="width:100%;margin-top:12px">' +
      (q ? '<p class="tiny muted" style="margin:8px 0 0">' + hits.length + ' of ' + C.count +
        ' units match. <button class="mini ghost" data-pathclear>Clear</button></p>' : '') +
      '</div>';

    if (q && !hits.length) {
      html += '<div class="card"><p class="small muted" style="margin:0">Nothing matches ' +
        '&ldquo;' + esc(q) + '&rdquo;. Try a key name, a technique, or part of a unit title.</p></div>';
      return html;
    }

    /* With a query, rank across the whole course; without one, keep the stage
       grouping that shows the shape of the path. */
    var groups = q
      ? [{ title: 'Best matches', blurb: 'Ranked across all ' + C.count + ' units.',
           units: hits.slice().sort(function (a, bb) { return unitScore(bb, q) - unitScore(a, q); }) }]
      : C.stages;

    groups.forEach(function (stage) {
      var units = stage.units;
      if (!units.length) return;
      html += '<div class="stage"><h2>' + esc(stage.title) + '</h2><p>' + esc(stage.blurb) + '</p>';
      units.forEach(function (u) {
        var passed = S.isPassed(u.id);
        var cur = u.index === st.currentUnitIndex;
        var ahead = u.index > st.currentUnitIndex;
        var state = cur ? 'current' : passed ? (S.isAssumed(u.id) ? 'skipped' : 'passed')
          : ahead ? 'ahead' : 'available';
        var cls = 'unit' + (passed ? ' done' : '') + (cur ? ' cur' : '') + (ahead ? ' ahead' : '');
        html += '<div class="' + cls + '">' +
          '<button class="unithead" data-unit="' + u.id + '">' +
          '<span class="un">' + (passed ? '&#10003;' : u.number) + '</span>' +
          '<span class="ut">' + esc(u.title) +
          (q ? '<span class="tiny muted" style="display:block;font-weight:400">Unit ' + u.number +
            ' &middot; ' + esc(u.stageTitle) + '</span>' : '') + '</span>' +
          '<span class="tiny muted">' + state + '</span></button>';
        if (openUnit === u.id) html += unitBody(u, cur, passed, ahead);
        html += '</div>';
      });
      html += '</div>';
    });
    return html;
  }

  function unitBody(u, cur, passed, ahead) {
    var ready = Sess.readiness(u);
    var mins = S.setting('minutes') || 15;
    var body = '<div class="unitbody">' +
      '<p class="goal"><b>Objective:</b> ' + esc(u.goal) + '</p>' +
      '<p class="why">' + esc(u.why) + '</p>' +
      '<p class="tiny muted">Working keys: ' + esc(u.keys.join(', ')) + '</p>' +

      '<div class="row" style="margin:12px 0">' +
      '<button class="' + (cur ? 'btn' : 'mini') + '" data-practice="' + u.index + '">' +
      'Practise this unit &middot; ' + mins + ' min</button>' +
      (cur ? '' : '<button class="mini" data-jump="' + u.index + '">Start here</button>') +
      '</div>' +
      (cur ? '' : '<p class="tiny muted" style="margin:-4px 0 10px">' +
        '<b>Practise</b> runs a session on this unit and leaves your place alone. ' +
        '<b>Start here</b> moves your place on the path to unit ' + u.number + '.</p>') +

      '<p class="tiny muted" style="margin-bottom:4px">Exercises — tap one to drill it on its own.</p>' +
      '<ul class="exlist">' + u.exercises.map(function (e) {
        var r = S.reps(e.id), t = e.reps || 8;
        return '<li><button class="exrow" data-drill="' + e.id + '">' +
          '<span class="pill ' + ({ warmup: 'warm', core: 'core', apply: 'app' }[e.role]) + '">' +
          e.role + '</span><span class="exname">' + esc(e.title) + '</span>' +
          '<span class="reps' + (r >= t ? ' hit' : '') + '">' + r + '/' + t + '</span></button></li>';
      }).join('') + '</ul>';

    body += '<div class="checkbox"><h4>Checkpoint — ' + esc(u.checkpoint.title) + '</h4>' +
      '<ul>' + u.checkpoint.criteria.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
      '<div class="meter"><i style="width:' + Math.round(ready * 100) + '%"></i></div>' +
      '<p class="tiny muted" style="margin:-6px 0 10px">Recommended reps: ' + Math.round(ready * 100) + '% complete.</p>';

    if (passed) {
      body += '<div class="row">' +
        (S.isAssumed(u.id)
          ? '<span class="tiny muted">Marked done when you skipped ahead, not assessed here.</span>'
          : '') +
        '<button class="mini" data-unpass="' + u.id + '">Reopen this unit</button></div>';
    } else if (cur) {
      body += '<button class="btn" data-pass="' + u.id + '">I can do all of these — pass</button>' +
        (ready < 0.5 ? '<p class="tiny muted" style="margin:8px 0 0">You have not done many reps yet. ' +
          'Pass it anyway if you genuinely meet the criteria.</p>' : '');
    } else {
      body += '<p class="tiny muted" style="margin:0">You are on unit ' + (S.load().currentUnitIndex + 1) +
        '. Press <b>Start here</b> above if this is really where you are.</p>';
    }
    body += '</div></div>';
    return body;
  }

  // ---------------------------------------------------------------- reference
  var ref = { key: 'C', sevenths: false, root: 'C', quality: 'maj', numbers: '1 5 6 4' };

  function renderRef() {
    var quals = ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4', '6', 'maj7', '7', 'm7', 'm7b5', 'add9', '9', 'm9'];
    var roots = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

    var html = '<div class="card"><h3>Key explorer</h3>' +
      '<div class="row" style="margin:12px 0">' +
      '<label class="f">Key<select data-ref="key">' + T.SINGER_KEYS.map(function (k) {
        return '<option' + (k === ref.key ? ' selected' : '') + '>' + k + '</option>';
      }).join('') + '</select></label>' +
      '<label class="f">Chords<select data-ref="sevenths">' +
      '<option value="0"' + (ref.sevenths ? '' : ' selected') + '>Triads</option>' +
      '<option value="1"' + (ref.sevenths ? ' selected' : '') + '>Sevenths</option></select></label></div>';

    html += '<div class="chart">' + [1, 2, 3, 4, 5, 6, 7].map(function (d) {
      return '<span><i>' + T.ROMAN[d - 1] + ' · ' + d + '</i>' + esc(T.diatonic(ref.key, d, ref.sevenths)) + '</span>';
    }).join('') + '</div>' +
    '<p class="tiny muted">Scale: ' + esc(T.scaleNoteNames(ref.key).join(' ')) + '</p>';

    var syms = [1, 2, 3, 4, 5, 6].map(function (d) { return T.diatonic(ref.key, d, ref.sevenths); });
    var voiced = voiceLead(syms, 4);
    var vrange = spanOf(voiced);
    html += '<div class="chordset">' + syms.map(function (s, i) {
      return chordBox(String(i + 1) + '  ·  ' + s, voiced[i], T.chordNoteNames(s).join(' '), vrange);
    }).join('') + '</div></div>';

    html += '<div class="card"><h3>Progression in any key</h3>' +
      '<div class="row" style="margin:12px 0">' +
      '<label class="f">Numbers<input type="text" data-ref="numbers" value="' + esc(ref.numbers) + '" size="12"></label>' +
      '<span class="tiny muted" style="align-self:flex-end;padding-bottom:9px">e.g. <b>1 5 6 4</b> or <b>2 5 1</b></span></div>' +
      '<div class="chart">' + T.SINGER_KEYS.map(function (k) {
        return '<span><i>' + k + '</i>' + esc(T.numbersToChords(ref.numbers, k, ref.sevenths).join(' ')) + '</span>';
      }).join('') + '</div>' +
      renderShow({ key: ref.key, numbers: ref.numbers, sevenths: ref.sevenths }) + '</div>';

    html += '<div class="card"><h3>Chord lookup</h3>' +
      '<div class="row" style="margin:12px 0">' +
      '<label class="f">Root<select data-ref="root">' + roots.map(function (r) {
        return '<option' + (r === ref.root ? ' selected' : '') + '>' + r + '</option>';
      }).join('') + '</select></label>' +
      '<label class="f">Type<select data-ref="quality">' + quals.map(function (q) {
        return '<option' + (q === ref.quality ? ' selected' : '') + '>' + q + '</option>';
      }).join('') + '</select></label></div>';

    var sym = ref.root + ({ maj: '', min: 'm' }[ref.quality] !== undefined ? { maj: '', min: 'm' }[ref.quality] : ref.quality);
    var n = T.chordNotes(sym).length;
    var lookSets = [], lookLabels = [];
    for (var inv = 0; inv < n; inv++) {
      lookSets.push(T.voice(sym, { inversion: inv, octave: 4, hand: 'R' }));
      lookLabels.push(sym + ' — ' + ['root position', '1st inversion', '2nd inversion', '3rd inversion'][inv]);
    }
    if (n === 4) {
      lookSets.push(T.voice(sym, { voicing: 'shell37', octave: 3, hand: 'L' }));
      lookLabels.push(sym + ' — shell (1 3 7), left hand');
      lookSets.push(T.voice(sym, { voicing: 'rootless', octave: 4, hand: 'R' }));
      lookLabels.push(sym + ' — rootless');
    }
    var lrange = spanOf(lookSets);
    var boxes = lookSets.map(function (v, i) { return chordBox(lookLabels[i], v, null, lrange); });
    html += '<div class="chordset">' + boxes.join('') + '</div></div>';

    html += '<div class="card"><h3>Practice tools</h3>' +
      toolHTML('random-chord', null) + toolHTML('random-key', null) +
      toolHTML('number-drill', null) + toolHTML('metronome', null) + '</div>';
    return html;
  }

  // ---------------------------------------------------------------- progress
  function renderProgress() {
    var st = S.load();
    var html = '<div class="grid" style="margin-bottom:16px">' +
      stat(st.sessions.length, 'sessions') +
      stat(S.totalMinutes(), 'minutes') +
      stat(S.streak(), 'day streak') +
      stat(st.currentUnitIndex + 1 + '/' + C.count, 'unit') +
      '</div>';

    var passed = Object.keys(st.checkpoints).length;
    html += '<div class="card"><h3>Checkpoints passed</h3>' +
      '<p class="small muted">' + passed + ' of ' + C.count + '.</p>' +
      '<div class="meter"><i style="width:' + Math.round(passed / C.count * 100) + '%"></i></div></div>';

    if (st.sessions.length) {
      var rows = st.sessions.slice().reverse().slice(0, 30).map(function (s) {
        var u = C.unit(s.unitId);
        return '<tr><td class="num2">#' + s.n + '</td><td>' + esc(s.date) + '</td>' +
          '<td>' + (u ? 'U' + u.number + ' ' + esc(u.title) : esc(s.unitId)) + '</td>' +
          '<td class="num2">' + s.completed + '/' + s.planned + '</td>' +
          '<td class="num2">' + s.minutes + 'm</td></tr>';
      }).join('');
      html += '<div class="card"><h3>Session log</h3><div style="overflow-x:auto"><table>' +
        '<tr><th>#</th><th>Date</th><th>Unit</th><th>Steps</th><th>Time</th></tr>' + rows +
        '</table></div></div>';
    }

    var notes = Object.keys(st.notes).filter(function (k) { return st.notes[k].trim(); });
    if (notes.length) {
      html += '<div class="card"><h3>Your notes</h3>' + notes.map(function (k) {
        var e = C.exercises[k];
        return '<p class="small"><b>' + esc(e ? e.title : k) + '</b><br><span class="muted">' +
          esc(st.notes[k]) + '</span></p>';
      }).join('') + '</div>';
    }

    html += '<div class="card"><h3>Your data</h3>' +
      '<p class="small muted">Progress lives in this browser only. Export it before clearing site data or moving device.</p>' +
      '<div class="row" style="margin-top:10px">' +
      '<button class="mini" data-export>Export progress</button>' +
      '<button class="mini" data-import>Import progress</button>' +
      '<button class="mini ghost" data-reset style="color:var(--danger)">Reset everything</button></div>' +
      '<textarea data-io hidden></textarea></div>';
    return html;
  }

  function stat(v, label) {
    return '<div class="stat"><b>' + esc(String(v)) + '</b><span>' + esc(label) + '</span></div>';
  }

  // ---------------------------------------------------------------- shell
  function nextLine() {
    var el = document.getElementById('nextline');
    var active = S.getActive();
    if (active) {
      var next = active.items.filter(function (i) { return !i.done; })[0];
      if (next) {
        el.innerHTML = 'Session ' + active.n + ' &middot; <b>Step ' + next.step + ' of ' +
          active.items.length + '</b> &middot; ' + esc(next.title);
      } else {
        el.innerHTML = 'Session ' + active.n + ' &middot; <b>all steps done</b> — log it to finish.';
      }
    } else {
      var u = S.currentUnit();
      el.innerHTML = 'Next up: <b>Session ' + S.sessionNumber() + '</b> &middot; Unit ' + u.number + ' — ' + esc(u.title);
    }
  }

  function render() {
    main.innerHTML =
      view === 'today' ? renderToday() :
      view === 'path' ? renderPath() :
      view === 'ref' ? renderRef() : renderProgress();
    nextLine();
    $$('#tabs button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-view') === view);
    });
    window.scrollTo({ top: window.__keepScroll || 0 });
    window.__keepScroll = 0;
  }

  function keepScroll() { window.__keepScroll = window.scrollY; }

  // ---------------------------------------------------------------- events
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-view],[data-dur],[data-start],[data-open],[data-done],[data-undone],[data-skip],[data-abandon],[data-finish],[data-unit],[data-pass],[data-unpass],[data-practice],[data-jump],[data-drill],[data-pathclear],[data-play],[data-met],[data-call],[data-reveal],[data-timer-toggle],[data-timer-reset],[data-export],[data-import],[data-reset]') : null;
    if (!t) return;
    var a;

    if ((a = t.getAttribute('data-view'))) { view = a; openStep = openStep; render(); return; }

    if ((a = t.getAttribute('data-dur'))) { S.setting('minutes', parseInt(a, 10)); keepScroll(); render(); return; }

    if (t.hasAttribute('data-start')) {
      var sess = Sess.build(S.setting('minutes') || 15);
      S.setActive(sess); openStep = 0; stopTimer(); render(); return;
    }

    if ((a = t.getAttribute('data-open')) !== null && a !== undefined) {
      var i = parseInt(a, 10);
      openStep = (openStep === i) ? -1 : i;
      keepScroll(); render(); return;
    }

    if ((a = t.getAttribute('data-done')) !== null && a !== undefined) {
      var s = S.getActive(); s.items[parseInt(a, 10)].done = true; S.setActive(s);
      var nxt = s.items.map(function (x, ix) { return x.done ? -1 : ix; }).filter(function (x) { return x >= 0; })[0];
      openStep = (nxt === undefined ? -1 : nxt);
      stopTimer(); render();
      if (openStep >= 0) {
        var node = $('[data-step="' + openStep + '"]');
        if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if ((a = t.getAttribute('data-undone')) !== null && a !== undefined) {
      var s2 = S.getActive(); s2.items[parseInt(a, 10)].done = false; S.setActive(s2); keepScroll(); render(); return;
    }

    if ((a = t.getAttribute('data-skip')) !== null && a !== undefined) {
      var ix = parseInt(a, 10);
      openStep = ix + 1 < S.getActive().items.length ? ix + 1 : -1;
      keepScroll(); stopTimer(); render(); return;
    }

    if (t.hasAttribute('data-abandon')) {
      if (confirm('Discard this session? Nothing is logged.')) { S.clearActive(); stopTimer(); render(); }
      return;
    }

    if (t.hasAttribute('data-finish')) {
      S.finishSession(S.getActive()); stopTimer(); openStep = 0; render(); return;
    }

    if ((a = t.getAttribute('data-unit'))) { openUnit = (openUnit === a ? null : a); keepScroll(); render(); return; }

    if ((a = t.getAttribute('data-practice')) !== null && a !== undefined) {
      var pIdx = parseInt(a, 10);
      var ps = Sess.build(S.setting('minutes') || 15, pIdx);
      S.setActive(ps); openStep = 0; openUnit = null; stopTimer(); view = 'today'; render();
      return;
    }

    if ((a = t.getAttribute('data-drill'))) {
      var ds = Sess.buildSingle(a);
      if (ds) { S.setActive(ds); openStep = 0; openUnit = null; stopTimer(); view = 'today'; render(); }
      return;
    }

    if ((a = t.getAttribute('data-jump')) !== null && a !== undefined) {
      var jIdx = parseInt(a, 10);
      var ju = C.unitAt(jIdx);
      var behind = jIdx > S.load().currentUnitIndex;
      var msg = 'Move your place on the path to unit ' + ju.number + ' — ' + ju.title + '?';
      if (behind) {
        msg += '\n\nUnits 1-' + ju.number + ' before it will be marked done so the path stays ' +
          'consistent. Only do this for material you can already play.';
      }
      if (confirm(msg)) {
        S.setCurrentUnit(jIdx, behind);
        openUnit = null; stopTimer(); view = 'today'; render();
      }
      return;
    }

    if (t.hasAttribute('data-pathclear')) { pathQuery = ''; keepScroll(); render(); return; }

    if ((a = t.getAttribute('data-pass'))) {
      var uu = C.unit(a);
      if (confirm('Pass "' + uu.checkpoint.title + '"?\n\nOnly do this if you genuinely meet every criterion — the rest of the course assumes it.')) {
        S.passCheckpoint(a); openUnit = null; view = 'today'; render();
      }
      return;
    }

    if ((a = t.getAttribute('data-unpass'))) { S.unpassCheckpoint(a); keepScroll(); render(); return; }

    if ((a = t.getAttribute('data-play'))) {
      A.playNotes(a.split(',').map(Number), 55); return;
    }

    if ((a = t.getAttribute('data-met'))) { showMet(parseInt(a, 10)); return; }

    if (t.hasAttribute('data-call')) { runTool(t.closest('[data-tool]'), 'call'); return; }
    if (t.hasAttribute('data-reveal')) { runTool(t.closest('[data-tool]'), 'reveal'); return; }

    if ((a = t.getAttribute('data-timer-toggle'))) {
      var mins = parseInt(t.getAttribute('data-mins'), 10);
      if (timer.stepId === a && timer.id) { pauseTimer(); }
      else { startTimer(a, mins); }
      keepScroll(); render(); return;
    }
    if (t.hasAttribute('data-timer-reset')) { stopTimer(); keepScroll(); render(); return; }

    if (t.hasAttribute('data-export')) {
      var ta = $('[data-io]'); ta.hidden = false; ta.value = S.exportJSON(); ta.select(); return;
    }
    if (t.hasAttribute('data-import')) {
      var ta2 = $('[data-io]');
      if (ta2.hidden) { ta2.hidden = false; ta2.value = ''; ta2.placeholder = 'Paste exported progress JSON here, then press Import again.'; ta2.focus(); return; }
      try { S.importJSON(ta2.value); alert('Imported.'); render(); }
      catch (e) { alert('Could not read that: ' + e.message); }
      return;
    }
    if (t.hasAttribute('data-reset')) {
      if (confirm('Delete all progress and start from unit 1?')) { S.reset(); stopTimer(); view = 'today'; render(); }
      return;
    }
  });

  document.addEventListener('change', function (ev) {
    var t = ev.target, a = t.getAttribute && t.getAttribute('data-ref');
    if (a) {
      ref[a] = (a === 'sevenths') ? t.value === '1' : t.value;
      keepScroll(); render(); return;
    }
  });
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.hasAttribute && t.hasAttribute('data-pathq')) {
      clearTimeout(window.__pq);
      var val = t.value;
      window.__pq = setTimeout(function () {
        pathQuery = val; keepScroll(); render();
        var box = $('[data-pathq]');
        if (box) { box.focus(); box.setSelectionRange(val.length, val.length); }
      }, 250);
      return;
    }
    if (t.getAttribute && t.getAttribute('data-note')) { S.setNote(t.getAttribute('data-note'), t.value); }
    if (t.getAttribute && t.getAttribute('data-ref') === 'numbers') {
      clearTimeout(window.__nt);
      window.__nt = setTimeout(function () { ref.numbers = t.value; keepScroll(); render(); }, 600);
    }
  });

  // ---------------------------------------------------------------- timer
  function startTimer(stepId, mins) {
    if (timer.stepId !== stepId) { timer.total = mins * 60; timer.left = mins * 60; timer.stepId = stepId; }
    clearInterval(timer.id);
    timer.id = setInterval(function () {
      timer.left--;
      var el = $('[data-timer]');
      if (el) {
        el.textContent = fmtTime(timer.left);
        el.classList.toggle('over', timer.left < 0);
        var bar = $('.timerbar i');
        if (bar) bar.style.width = Math.max(0, timer.left / timer.total * 100) + '%';
      }
      if (timer.left === 0) { try { A.playNotes([76, 83], 90); } catch (e) {} }
    }, 1000);
  }
  function pauseTimer() { clearInterval(timer.id); timer.id = null; }
  function stopTimer() { clearInterval(timer.id); timer = { id: null, left: 0, total: 0, stepId: null }; }

  // ---------------------------------------------------------------- metronome bar
  var metbar = document.getElementById('metbar');
  var metBpm = document.getElementById('met-bpm');
  var metOut = document.getElementById('met-out');
  var metToggle = document.getElementById('met-toggle');

  function showMet(bpm) {
    metbar.hidden = false;
    if (bpm) { metBpm.value = bpm; metOut.value = bpm; A.metSet(bpm); }
    if (!A.metIsOn()) { A.metStart(parseInt(metBpm.value, 10), 4); metToggle.textContent = 'Stop click'; metToggle.classList.add('on'); }
  }
  metToggle.addEventListener('click', function () {
    if (A.metIsOn()) { A.metStop(); metToggle.textContent = 'Start click'; metToggle.classList.remove('on'); }
    else { A.metStart(parseInt(metBpm.value, 10), 4); metToggle.textContent = 'Stop click'; metToggle.classList.add('on'); }
  });
  metBpm.addEventListener('input', function () { metOut.value = metBpm.value; A.metSet(parseInt(metBpm.value, 10)); });
  document.getElementById('met-close').addEventListener('click', function () {
    A.metStop(); metToggle.textContent = 'Start click'; metToggle.classList.remove('on'); metbar.hidden = true;
  });

  // keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (/input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === 'm') { metbar.hidden ? showMet() : metToggle.click(); }
    if (e.key === 'n' && view === 'today') {
      var b = $('[data-done]'); if (b) b.click();
    }
  });

  // exposed for the test harness; harmless at runtime
  window.__comp = { renderShow: renderShow, voiceLead: voiceLead, bassLine: bassLine, build: Sess.build };

  render();
})();
