/* audio.js — a small WebAudio synth for chord playback, plus the metronome. */
(function (global) {
  'use strict';
  var ctx = null;
  function ac() {
    if (!ctx) {
      var C = global.AudioContext || global.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function freq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function tone(midi, at, dur, gain) {
    var a = ac(); if (!a) return;
    var osc = a.createOscillator(), g = a.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq(midi);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g); g.connect(a.destination);
    osc.start(at); osc.stop(at + dur + 0.05);
  }

  // Play a set of midi notes together (or rolled, when `roll` ms is given).
  function playNotes(midis, roll) {
    var a = ac(); if (!a) return;
    var t = a.currentTime + 0.03;
    midis.forEach(function (m, i) {
      tone(m, t + (roll ? i * roll / 1000 : 0), 1.5, 0.16);
    });
  }

  /* Play a run of notes one after another, for hearing a scale back. */
  var seqTimers = [];
  function stopSequence() {
    seqTimers.forEach(clearTimeout); seqTimers = [];
  }
  function playSequence(midis, bpm, onNote) {
    var a = ac(); if (!a) return;
    stopSequence();
    var step = 60 / (bpm || 92) / 2;          // eighth notes
    var t = a.currentTime + 0.05;
    midis.forEach(function (m, i) {
      tone(m, t + i * step, step * 1.6, 0.17);
      if (onNote) seqTimers.push(setTimeout(function () { onNote(i); }, (0.05 + i * step) * 1000));
    });
    if (onNote) seqTimers.push(setTimeout(function () { onNote(-1); }, (0.05 + midis.length * step) * 1000));
  }

  /* ---- groove player ----
     Plays bars of note events — { s: eighth-note slot, d: length in slots,
     midis, gain } — in time, optionally looping, calling onBar(i) as each bar
     starts so the page can follow along. Many notes at once at forte would
     clip, so everything runs through a compressor. Every voice is tracked so
     stop() silences notes already scheduled, not just future bars. */
  var grv = { on: false, timer: null, bars: [], i: 0, next: 0, bpm: 80, loop: false,
              onBar: null, voices: [], cbs: [], bus: null };

  function bus() {
    var a = ac();
    if (!grv.bus) {
      var comp = a.createDynamicsCompressor();
      comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 5;
      comp.attack.value = 0.004; comp.release.value = 0.2;
      var out = a.createGain(); out.gain.value = 0.9;
      comp.connect(out); out.connect(a.destination);
      grv.bus = comp;
    }
    return grv.bus;
  }

  /* A slightly fuller tone than tone(): triangle plus a quiet octave sine,
     brighter as it gets louder, the way a struck string is. */
  function pianoNote(midi, at, dur, gain) {
    var a = ac(), dest = bus();
    var g = a.createGain(), o1 = a.createOscillator(), o2 = a.createOscillator(), g2 = a.createGain();
    o1.type = 'triangle'; o1.frequency.value = freq(midi);
    o2.type = 'sine'; o2.frequency.value = freq(midi) * 2;
    g2.gain.value = Math.min(0.6, 0.15 + gain * 2.5);
    var len = Math.max(0.25, dur);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.008);
    g.gain.exponentialRampToValueAtTime(gain * 0.45, at + Math.min(0.35, len * 0.5));
    g.gain.exponentialRampToValueAtTime(0.0001, at + len + 0.12);
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(dest);
    o1.start(at); o2.start(at); o1.stop(at + len + 0.2); o2.stop(at + len + 0.2);
    grv.voices.push({ g: g, o: [o1, o2], end: at + len + 0.2 });
  }

  function grooveTick() {
    var a = ac(); if (!a || !grv.on) return;
    var slot = 60 / grv.bpm / 2;
    grv.voices = grv.voices.filter(function (v) { return v.end > a.currentTime; });
    while (grv.on && grv.next < a.currentTime + 0.3) {
      if (grv.i >= grv.bars.length) {
        if (!grv.loop) {
          var endAt = grv.next;
          grv.cbs.push(setTimeout(function () { grooveStop(); if (grv.onEnd) grv.onEnd(); },
            Math.max(0, (endAt - a.currentTime) * 1000)));
          clearInterval(grv.timer); grv.timer = null;
          return;
        }
        grv.i = 0;
      }
      var bar = grv.bars[grv.i], start = grv.next, idx = grv.i;
      (bar.events || []).forEach(function (ev) {
        ev.midis.forEach(function (m) { pianoNote(m, start + ev.s * slot, ev.d * slot, ev.gain); });
      });
      if (grv.onBar) {
        grv.cbs.push(setTimeout(function () { if (grv.on) grv.onBar(idx); },
          Math.max(0, (start - a.currentTime) * 1000)));
      }
      grv.next += 8 * slot;
      grv.i++;
    }
  }

  function grooveStart(o) {
    var a = ac(); if (!a) return false;
    grooveStop();
    bus();
    grv.on = true; grv.bars = o.bars || []; grv.i = 0; grv.bpm = o.bpm || 80;
    grv.loop = !!o.loop; grv.onBar = o.onBar || null; grv.onEnd = o.onEnd || null;
    grv.next = a.currentTime + 0.08;
    grooveTick();
    if (grv.on && !grv.timer) grv.timer = setInterval(grooveTick, 40);
    return true;
  }

  function grooveStop() {
    var a = ctx;
    grv.on = false;
    if (grv.timer) clearInterval(grv.timer);
    grv.timer = null;
    grv.cbs.forEach(clearTimeout); grv.cbs = [];
    if (a) {
      var now = a.currentTime;
      grv.voices.forEach(function (v) {
        try {
          v.g.gain.cancelScheduledValues(now);
          v.g.gain.setValueAtTime(v.g.gain.value, now);
          v.g.gain.linearRampToValueAtTime(0, now + 0.05);
          v.o.forEach(function (o) { o.stop(now + 0.06); });
        } catch (e) {}
      });
    }
    grv.voices = [];
  }

  // ---- metronome ----
  var met = { on: false, bpm: 80, timer: null, next: 0, beat: 0, beats: 4 };
  function click(at, accent) {
    var a = ac(); if (!a) return;
    var osc = a.createOscillator(), g = a.createGain();
    osc.type = 'square';
    osc.frequency.value = accent ? 1600 : 1000;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(accent ? 0.28 : 0.15, at + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
    osc.connect(g); g.connect(a.destination);
    osc.start(at); osc.stop(at + 0.06);
  }
  function schedule() {
    var a = ac(); if (!a) return;
    while (met.next < a.currentTime + 0.15) {
      click(met.next, met.beat % met.beats === 0);
      met.beat++;
      met.next += 60 / met.bpm;
    }
  }
  function metStart(bpm, beats) {
    var a = ac(); if (!a) return false;
    met.bpm = bpm || met.bpm;
    met.beats = beats || met.beats;
    if (met.on) return true;
    met.on = true; met.beat = 0; met.next = a.currentTime + 0.1;
    met.timer = setInterval(schedule, 25);
    return true;
  }
  function metStop() {
    met.on = false;
    if (met.timer) clearInterval(met.timer);
    met.timer = null;
  }
  function metSet(bpm) {
    met.bpm = bpm;
  }

  global.Audio2 = {
    playSequence: playSequence, stopSequence: stopSequence,
    playNotes: playNotes, playChordVoicing: function (v, roll) {
      playNotes(v.map(function (n) { return n.midi; }), roll);
    },
    metStart: metStart, metStop: metStop, metSet: metSet,
    metIsOn: function () { return met.on; },
    grooveStart: grooveStart, grooveStop: grooveStop,
    grooveIsOn: function () { return grv.on; },
    grooveSetBpm: function (b) { grv.bpm = b; }
  };
})(typeof window !== 'undefined' ? window : this);
