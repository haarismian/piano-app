/* store.js — progress, persisted to localStorage. Single user, single device. */
(function (global) {
  'use strict';
  var KEY = 'pianocomp.v1';

  function blank() {
    return {
      version: 1,
      startedOn: today(),
      currentUnitIndex: 0,
      reps: {},          // exerciseId -> times completed
      checkpoints: {},   // unitId -> {passed:true, date}
      sessions: [],      // {n, date, minutes, unitId, items:[exerciseId], done:[bool]}
      rotation: {},      // unitId -> counter, drives exercise variety
      active: null,      // the session currently in progress
      notes: {},         // exerciseId -> free text
      settings: { minutes: 15, bpm: 80 }
    };
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = global.localStorage && global.localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : blank();
    } catch (e) { state = blank(); }
    var b = blank();
    for (var k in b) if (!(k in state)) state[k] = b[k];
    return state;
  }

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(load())); } catch (e) {}
  }

  function reps(exId) { return load().reps[exId] || 0; }

  function bumpRep(exId) {
    var s = load();
    s.reps[exId] = (s.reps[exId] || 0) + 1;
    save();
  }

  function passCheckpoint(unitId) {
    var s = load();
    s.checkpoints[unitId] = { passed: true, date: today() };
    var idx = global.Curriculum.units.map(function (u) { return u.id; }).indexOf(unitId);
    if (idx === s.currentUnitIndex && idx < global.Curriculum.units.length - 1) {
      s.currentUnitIndex = idx + 1;
    }
    s.active = null;
    save();
  }

  function unpassCheckpoint(unitId) {
    var s = load();
    delete s.checkpoints[unitId];
    var idx = global.Curriculum.units.map(function (u) { return u.id; }).indexOf(unitId);
    if (idx < s.currentUnitIndex) s.currentUnitIndex = idx;
    save();
  }

  function isPassed(unitId) { return !!(load().checkpoints[unitId] || {}).passed; }

  function currentUnit() { return global.Curriculum.unitAt(load().currentUnitIndex); }

  function finishSession(sess) {
    var s = load();
    var doneItems = sess.items.filter(function (it) { return it.done; });
    doneItems.forEach(function (it) { s.reps[it.id] = (s.reps[it.id] || 0) + 1; });
    s.sessions.push({
      n: sess.n, date: today(), minutes: doneItems.reduce(function (a, it) { return a + it.minutes; }, 0),
      unitId: sess.unitId, items: doneItems.map(function (it) { return it.id; }),
      planned: sess.items.length, completed: doneItems.length
    });
    s.rotation[sess.unitId] = (s.rotation[sess.unitId] || 0) + 1;
    s.active = null;
    save();
  }

  function setActive(sess) { load().active = sess; save(); }
  function getActive() { return load().active; }
  function clearActive() { load().active = null; save(); }

  function sessionNumber() { return load().sessions.length + 1; }

  function totalMinutes() {
    return load().sessions.reduce(function (a, s) { return a + (s.minutes || 0); }, 0);
  }

  function streak() {
    var dates = {};
    load().sessions.forEach(function (s) { dates[s.date] = true; });
    var n = 0, d = new Date();
    // today does not break the streak if not yet practised
    var key = fmt(d);
    if (!dates[key]) d.setDate(d.getDate() - 1);
    while (dates[fmt(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function daysPractised() {
    var dates = {};
    load().sessions.forEach(function (s) { dates[s.date] = true; });
    return Object.keys(dates).length;
  }

  function setNote(exId, text) { load().notes[exId] = text; save(); }
  function getNote(exId) { return load().notes[exId] || ''; }

  function setting(k, v) {
    var s = load();
    if (v === undefined) return s.settings[k];
    s.settings[k] = v; save(); return v;
  }

  function exportJSON() { return JSON.stringify(load(), null, 2); }
  function importJSON(txt) {
    var obj = JSON.parse(txt);
    if (!obj || typeof obj !== 'object') throw new Error('not a progress file');
    state = obj; save();
  }
  function reset() { state = blank(); save(); }

  global.Store = {
    load: load, save: save, today: today, reps: reps, bumpRep: bumpRep,
    passCheckpoint: passCheckpoint, unpassCheckpoint: unpassCheckpoint, isPassed: isPassed,
    currentUnit: currentUnit, finishSession: finishSession,
    setActive: setActive, getActive: getActive, clearActive: clearActive,
    sessionNumber: sessionNumber, totalMinutes: totalMinutes, streak: streak,
    daysPractised: daysPractised, setNote: setNote, getNote: getNote, setting: setting,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset
  };
})(typeof window !== 'undefined' ? window : this);
