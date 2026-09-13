/* session.js — builds a numbered practice session of a requested length.
   Shape: warm-up -> core work on the current unit -> review of earlier units -> apply.
   Shorter sessions drop blocks from the bottom, so a 5-minute session is still
   warm-up plus the thing you are actually supposed to be learning. */
(function (global) {
  'use strict';

  function pick(pool, offset, n) {
    var out = [];
    if (!pool.length) return out;
    for (var i = 0; i < n; i++) out.push(pool[(offset + i) % pool.length]);
    return out;
  }

  function byRole(unit, role) {
    return unit.exercises.filter(function (e) { return e.role === role; });
  }

  // Exercises from earlier units, weighted towards the most recent ones.
  function reviewPool(unitIndex) {
    var pool = [];
    for (var back = 1; back <= 4 && unitIndex - back >= 0; back++) {
      var u = global.Curriculum.unitAt(unitIndex - back);
      var picks = u.exercises.filter(function (e) { return e.role === 'core' || e.role === 'apply'; });
      // nearer units appear more often
      var weight = back <= 2 ? 2 : 1;
      for (var w = 0; w < weight; w++) pool = pool.concat(picks);
    }
    return pool;
  }

  /* build(minutes, unitIndex) -> session object.
     unitIndex defaults to wherever you are on the path; passing one builds a
     one-off session on any other unit without moving your place. */
  function build(minutes, unitIndex) {
    var st = global.Store.load();
    var idx = (unitIndex == null) ? st.currentUnitIndex : unitIndex;
    var unit = global.Curriculum.unitAt(idx);
    var rot = st.rotation[unit.id] || 0;
    var budget = Math.max(5, minutes || 15);

    var plan = [];
    var warmups = byRole(unit, 'warmup');
    var cores = byRole(unit, 'core');
    var applies = byRole(unit, 'apply');
    var reviews = reviewPool(idx);

    // Block sizes, in minutes, before rescaling.
    var wantWarm = Math.min(5, Math.max(2, Math.round(budget * 0.15)));
    var wantReview = (budget >= 12 && reviews.length) ? Math.max(2, Math.round(budget * 0.15)) : 0;
    var wantApply = (budget >= 10 && applies.length) ? Math.max(3, Math.round(budget * 0.22)) : 0;
    var wantCore = Math.max(3, budget - wantWarm - wantReview - wantApply);

    function has(id) { return plan.some(function (p) { return p.id === id; }); }

    function fill(pool, offset, want, block) {
      var used = 0, i = 0;
      while (used < want && pool.length && i < pool.length * 2) {
        var e = pool[(offset + i) % pool.length];
        i++;
        if (!e || has(e.id)) continue;
        plan.push({ id: e.id, block: block, minutes: e.minutes });
        used += e.minutes;
      }
      return used;
    }

    fill(warmups, rot, wantWarm, 'Warm-up');
    fill(cores, rot, wantCore, 'Core work');
    if (wantReview) fill(reviews, rot * 3, wantReview, 'Review');
    if (wantApply) fill(applies, rot, wantApply, 'Apply it');

    if (!plan.length && unit.exercises.length) {
      plan.push({ id: unit.exercises[0].id, block: 'Core work', minutes: unit.exercises[0].minutes });
    }

    // A long session should mean more exercises, not one drill stretched to
    // twenty minutes. Top up from review and earlier-unit material instead.
    var MAX_STRETCH = 1.7;
    function planned() { return plan.reduce(function (a, p) { return a + p.minutes; }, 0); }
    var topUp = reviews.concat(applies).concat(cores);
    var guard = 0;
    while (planned() * MAX_STRETCH < budget && guard < 40) {
      guard++;
      var added = false;
      for (var j = 0; j < topUp.length; j++) {
        var e = topUp[(rot * 5 + guard + j) % topUp.length];
        if (!e || has(e.id)) continue;
        plan.push({ id: e.id, block: e.role === 'apply' ? 'Apply it' : 'Review', minutes: e.minutes });
        added = true;
        break;
      }
      if (!added) break;
    }

    // Rescale to hit the requested total, keeping every item at 2 minutes or more.
    var raw = planned();
    var scale = Math.min(MAX_STRETCH, budget / raw);
    plan.forEach(function (p) { p.minutes = Math.max(2, Math.round(p.minutes * scale)); });
    // Nudge items so the total lands exactly on the requested length.
    var diff = budget - planned();
    var order = plan.slice().sort(function (a, b) { return b.minutes - a.minutes; });
    var k = 0;
    while (diff !== 0 && order.length && k < 200) {
      var t = order[k % order.length];
      if (diff > 0) { t.minutes++; diff--; }
      else if (t.minutes > 2) { t.minutes--; diff++; }
      k++;
      if (diff < 0 && plan.every(function (p) { return p.minutes <= 2; })) break;
    }

    var ORDER = ['Warm-up', 'Core work', 'Review', 'Apply it'];
    plan.sort(function (a, b) { return ORDER.indexOf(a.block) - ORDER.indexOf(b.block); });

    plan.forEach(function (p, i) {
      p.step = i + 1;
      p.done = false;
      var e = global.Curriculum.exercises[p.id];
      p.title = e.title;
      p.type = e.type;
      p.fromUnit = e.unitNumber;
    });

    return {
      n: global.Store.sessionNumber(),
      unitId: unit.id,
      unitNumber: unit.number,
      unitTitle: unit.title,
      requested: budget,
      minutes: plan.reduce(function (a, p) { return a + p.minutes; }, 0),
      items: plan,
      oneOff: idx !== st.currentUnitIndex,
      createdAt: new Date().toISOString()
    };
  }

  /* A single exercise on its own, for when you want to drill one thing. */
  function buildSingle(exerciseId, minutes) {
    var e = global.Curriculum.exercises[exerciseId];
    if (!e) return null;
    var unit = global.Curriculum.unit(e.unitId);
    var st = global.Store.load();
    var mins = Math.max(2, minutes || e.minutes);
    return {
      n: global.Store.sessionNumber(),
      unitId: unit.id, unitNumber: unit.number, unitTitle: unit.title,
      requested: mins, minutes: mins,
      items: [{
        id: e.id, block: 'Core work', minutes: mins, step: 1, done: false,
        title: e.title, type: e.type, fromUnit: e.unitNumber
      }],
      single: true,
      oneOff: unit.index !== st.currentUnitIndex,
      createdAt: new Date().toISOString()
    };
  }

  // How ready the current unit is for its checkpoint: fraction of core/apply
  // exercises that have hit their recommended rep count.
  function readiness(unit) {
    var list = unit.exercises.filter(function (e) { return e.role !== 'warmup'; });
    if (!list.length) return 1;
    var got = 0, want = 0;
    list.forEach(function (e) {
      var target = e.reps || 8;
      want += target;
      got += Math.min(target, global.Store.reps(e.id));
    });
    return want ? got / want : 1;
  }

  global.Session = { build: build, buildSingle: buildSingle, readiness: readiness };
})(typeof window !== 'undefined' ? window : this);
