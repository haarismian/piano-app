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
    playNotes: playNotes, playChordVoicing: function (v, roll) {
      playNotes(v.map(function (n) { return n.midi; }), roll);
    },
    metStart: metStart, metStop: metStop, metSet: metSet,
    metIsOn: function () { return met.on; }
  };
})(typeof window !== 'undefined' ? window : this);
