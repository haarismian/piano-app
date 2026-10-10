/* session.js — builds a numbered practice session.

   The old builder took almost everything from the current unit, which meant
   grinding the same four exercises for ten sessions before the path moved.
   This one treats every exercise as a spaced-repetition item: a session is a
   little new material from the frontier unit plus whatever is most overdue
   from everything behind it, then interleaved so consecutive steps come from
   different units. */
(function (global) {
  'use strict';

  function C() { return global.Curriculum; }
  function S() { return global.Store; }
  function R() { return global.SRS; }

  // Share of the session each kind of work gets.
  var MIX = { warmup: 0.12, fresh: 0.28, review: 0.42, apply: 0.18 };

  function pools(idx, today) {
    var all = [];
    for (var i = 0; i <= idx; i++) all = all.concat(C().unitAt(i).exercises);

    var frontier = C().unitAt(idx);
    var sched = function (e) { return S().sched(e.id); };
    var over = function (e) { return R().overdueness(sched(e), today); };
    var stale = function (e) { return R().staleness(sched(e), today); };

    function unseen(e) { return !sched(e).seen; }
    function due(e) { return R().isDue(sched(e), today); }
    /* Practised today already — never serve it again in the same session set
       unless there is genuinely nothing else to do. */
    function freshlyDone(e) { return stale(e) < 1; }
    /* A resting item may be pulled forward to fill a thin session, but only
       once it is at least halfway to its due date. Without this, a small pool
       early in the course serves the same exercise every single day. */
    function pullable(e) {
      var r = sched(e);
      return !due(e) && !unseen(e) && stale(e) >= Math.max(2, (r.interval || 1) * 0.5);
    }

    function byOverdue(a, b) { return over(b) - over(a); }
    function byStale(a, b) { return stale(b) - stale(a); }

    function ready(list) {
      return {
        now: list.filter(function (e) { return (unseen(e) || due(e)) && !freshlyDone(e); })
                 .sort(function (a, b) {
                   if (unseen(a) && !unseen(b)) return -1;
                   if (unseen(b) && !unseen(a)) return 1;
                   return unseen(a) ? 0 : byOverdue(a, b);
                 }),
        later: list.filter(function (e) { return pullable(e); }).sort(byStale)
      };
    }

    return {
      all: all,
      stalest: all.slice().sort(byStale),
      fresh: ready(frontier.exercises.filter(function (e) { return S().seen(e.id) < 2; })),
      review: ready(all.filter(function (e) { return S().seen(e.id) >= 1; })),
      warm: ready(all.filter(function (e) {
        return e.role === 'warmup' && S().lastGrade(e.id) !== 'shaky';
      })),
      apply: ready(all.filter(function (e) { return e.role === 'apply'; }))
    };
  }

  function build(minutes, unitIndex) {
    var st = S().load(), today = S().today();
    var idx = (unitIndex == null) ? st.currentUnitIndex : unitIndex;
    var frontier = C().unitAt(idx);
    var budget = Math.max(5, minutes || 15);
    var p = pools(idx, today);

    var plan = [];
    function has(id) { return plan.some(function (x) { return x.id === id; }); }
    function planned() { return plan.reduce(function (a, x) { return a + x.minutes; }, 0); }

    function take(pool, wantMins, kind) {
      var used = 0;
      for (var i = 0; i < pool.length && used < wantMins; i++) {
        var e = pool[i];
        if (!e || has(e.id)) continue;
        plan.push({ id: e.id, kind: kind, minutes: e.minutes, unitNumber: e.unitNumber });
        used += e.minutes;
      }
      return used;
    }

    // Due or unmet work first; a block simply does not appear if it has none.
    take(p.warm.now, Math.max(2, budget * MIX.warmup), 'warmup');
    if (budget >= 10) take(p.apply.now, Math.max(3, budget * MIX.apply), 'apply');
    take(p.fresh.now, Math.max(3, budget * MIX.fresh), 'new');
    take(p.review.now, budget * MIX.review, 'review');

    // Still short? Pull forward work that is partway to due, then warm-ups and
    // apply items on the same terms, and only then anything at all.
    var tiers = [
      [p.review.later, 'review'], [p.fresh.later, 'new'],
      [p.warm.later, 'warmup'], [p.apply.later, 'apply'],
      // Prefer the least-recently-touched work from anywhere in the course over
      // serving the frontier unit a third and fourth time in one session.
      [p.stalest, 'review'],
      [C().unitAt(idx).exercises, 'new']
    ];
    for (var t = 0; t < tiers.length && planned() < budget - 1; t++) {
      take(tiers[t][0], budget - planned(), tiers[t][1]);
    }

    fitToBudget(plan, budget);
    plan = interleave(plan);

    plan.forEach(function (x, i) {
      var e = C().exercises[x.id];
      // A fallback pool can hand back material you have never met; call that
      // new, whichever bucket it came out of.
      if (x.kind === 'review' && !S().seen(x.id)) x.kind = 'new';
      x.step = i + 1;
      x.done = false;
      x.title = e.title;
      x.type = e.type;
      x.variant = S().variantIndex(x.id);
      x.fromUnit = e.unitNumber;
    });

    return {
      n: S().sessionNumber(),
      unitId: frontier.id, unitNumber: frontier.number, unitTitle: frontier.title,
      requested: budget,
      minutes: plan.reduce(function (a, x) { return a + x.minutes; }, 0),
      items: plan,
      oneOff: idx !== st.currentUnitIndex,
      createdAt: new Date().toISOString()
    };
  }

  /* Scale the chosen exercises to the requested length, keeping each at two
     minutes or more and landing exactly on the total. */
  function fitToBudget(plan, budget) {
    var MAX_STRETCH = 1.7;
    var raw = plan.reduce(function (a, x) { return a + x.minutes; }, 0);
    var scale = Math.min(MAX_STRETCH, budget / raw);
    plan.forEach(function (x) { x.minutes = Math.max(2, Math.round(x.minutes * scale)); });
    var diff = budget - plan.reduce(function (a, x) { return a + x.minutes; }, 0);
    var order = plan.slice().sort(function (a, b) { return b.minutes - a.minutes; });
    var k = 0;
    while (diff !== 0 && order.length && k < 300) {
      var t = order[k % order.length];
      if (diff > 0) { t.minutes++; diff--; }
      else if (t.minutes > 2) { t.minutes--; diff++; }
      else if (plan.every(function (x) { return x.minutes <= 2; })) break;
      k++;
    }
  }

  /* Warm-up first, apply last, and in between never two steps running from the
     same unit while another unit is still waiting. This is the bit that stops
     a session feeling like one topic on repeat. */
  function interleave(plan) {
    var warm = plan.filter(function (x) { return x.kind === 'warmup'; });
    var apply = plan.filter(function (x) { return x.kind === 'apply'; });
    var mid = plan.filter(function (x) { return x.kind !== 'warmup' && x.kind !== 'apply'; });

    var fresh = mid.filter(function (x) { return x.kind === 'new'; });
    var rev = mid.filter(function (x) { return x.kind !== 'new'; });
    var zipped = [];
    while (fresh.length || rev.length) {
      if (fresh.length) zipped.push(fresh.shift());
      if (rev.length) zipped.push(rev.shift());
      if (rev.length && zipped.length % 3 === 0) zipped.push(rev.shift());
    }

    var out = [], pending = zipped.slice(), prevUnit = warm.length ? warm[warm.length - 1].unitNumber : null;
    while (pending.length) {
      var pick = 0;
      for (var i = 0; i < pending.length; i++) {
        if (pending[i].unitNumber !== prevUnit) { pick = i; break; }
      }
      var chosen = pending.splice(pick, 1)[0];
      prevUnit = chosen.unitNumber;
      out.push(chosen);
    }
    return warm.concat(out, apply);
  }

  function buildSingle(exerciseId, minutes) {
    var e = C().exercises[exerciseId];
    if (!e) return null;
    var unit = C().unit(e.unitId), st = S().load();
    var mins = Math.max(2, minutes || e.minutes);
    return {
      n: S().sessionNumber(),
      unitId: unit.id, unitNumber: unit.number, unitTitle: unit.title,
      requested: mins, minutes: mins,
      items: [{
        id: e.id, kind: 'new', minutes: mins, step: 1, done: false,
        title: e.title, type: e.type, fromUnit: e.unitNumber,
        unitNumber: e.unitNumber, variant: S().variantIndex(e.id)
      }],
      single: true,
      oneOff: unit.index !== st.currentUnitIndex,
      createdAt: new Date().toISOString()
    };
  }

  /* Ready to move on once you have genuinely met each piece of the unit —
     not once you have drilled it to mastery. Mastery is what the review
     schedule is for. */
  function readiness(unit) {
    var list = unit.exercises.filter(function (e) { return e.role !== 'warmup'; });
    if (!list.length) return 1;
    var met = list.filter(function (e) {
      return S().seen(e.id) >= 2 && S().lastGrade(e.id) !== 'shaky';
    }).length;
    return met / list.length;
  }

  global.Session = { build: build, buildSingle: buildSingle, readiness: readiness, MIX: MIX };
})(typeof window !== 'undefined' ? window : this);
