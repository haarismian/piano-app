/* srs.js — spaced repetition for practice items.
   Pure functions over a schedule record; no storage, no DOM, so it can be
   tested on its own.

   A record is: { seen, ease, interval, due, last, grade, variant }
     seen      how many times it has been completed
     ease      multiplier the interval grows by (1.3 - 3.0)
     interval  days until it should come back
     due       'YYYY-MM-DD' it next becomes eligible
     grade     'shaky' | 'ok' | 'solid' — how the last attempt went
     variant   which key/tempo variation to use next time

   Intervals are in days, but nothing is ever "overdue and owed". The session
   builder ranks by how overdue an item is and takes what fits, so a week off
   costs you nothing but a reshuffle. */
(function (global) {
  'use strict';

  var DEFAULT_EASE = 2.1;
  var MIN_EASE = 1.3, MAX_EASE = 3.0;
  var MAX_INTERVAL = 60;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) {
    var p = String(s || '').split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1);
  }
  function addDays(dateStr, days) {
    var d = parse(dateStr);
    d.setDate(d.getDate() + Math.round(days));
    return fmt(d);
  }
  function daysBetween(a, b) {
    return Math.round((parse(b) - parse(a)) / 86400000);
  }

  function blank() {
    return { seen: 0, ease: DEFAULT_EASE, interval: 0, due: null, last: null, grade: null, variant: 0 };
  }

  /* Apply a grade and return the next record. `today` is 'YYYY-MM-DD'. */
  function grade(rec, g, today) {
    var r = rec ? JSON.parse(JSON.stringify(rec)) : blank();
    r.seen = (r.seen || 0) + 1;
    r.ease = r.ease || DEFAULT_EASE;
    r.grade = g;
    r.last = today;
    r.variant = (r.variant || 0) + 1;

    if (g === 'shaky') {
      r.ease = Math.max(MIN_EASE, r.ease - 0.25);
      r.interval = 1;                       // see it again next practice day
    } else {
      if (r.seen <= 1) r.interval = 1;
      else if (r.seen === 2) r.interval = 3;
      else r.interval = Math.min(MAX_INTERVAL, (r.interval || 1) * r.ease);
      if (g === 'solid') {
        r.ease = Math.min(MAX_EASE, r.ease + 0.12);
        r.interval = Math.min(MAX_INTERVAL, r.interval * 1.3);
      }
    }
    r.due = addDays(today, r.interval);
    return r;
  }

  /* How overdue, in units of its own interval. 0 = due exactly today,
     >0 = overdue, <0 = not yet due. Never-seen items return null. */
  function overdueness(rec, today) {
    if (!rec || !rec.seen || !rec.due) return null;
    var late = daysBetween(rec.due, today);
    return late / Math.max(1, rec.interval || 1);
  }

  function isDue(rec, today) {
    var o = overdueness(rec, today);
    return o !== null && o >= 0;
  }

  /* Staleness for items that are not yet due — used to top a session up when
     there is not enough genuinely due work. Higher = longer untouched. */
  function staleness(rec, today) {
    if (!rec || !rec.last) return Infinity;
    return daysBetween(rec.last, today);
  }

  /* Turn a plain rep count from the old scheme into a plausible schedule, so
     existing progress is not thrown away. */
  function fromReps(reps, today) {
    if (!reps) return blank();
    var r = blank();
    r.seen = reps;
    r.grade = 'ok';
    r.last = today;
    /* Capped well below MAX_INTERVAL: old reps show the material was drilled,
       but they carry no evidence of how well it stuck, so bring it back inside
       a few weeks rather than burying it for two months. */
    r.interval = Math.min(21, reps <= 1 ? 1 : reps === 2 ? 3 : Math.pow(DEFAULT_EASE, Math.min(reps, 6) - 2) * 3);
    r.variant = reps;
    r.due = addDays(today, r.interval);
    return r;
  }

  global.SRS = {
    blank: blank, grade: grade, overdueness: overdueness, isDue: isDue,
    staleness: staleness, fromReps: fromReps,
    addDays: addDays, daysBetween: daysBetween, fmt: fmt,
    DEFAULT_EASE: DEFAULT_EASE
  };
})(typeof window !== 'undefined' ? window : this);
