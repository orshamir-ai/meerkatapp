/* =============================================================================
 * MEERKAT UNIVERSE — the invite landing page
 *
 * A child taps "Copy link" in the app and sends the result to a friend. That
 * link lands here, carrying a friend code: /invite/?c=MK-XXXX-XXXX
 *
 * WHY A QUERY STRING AND NOT /invite/MK-XXXX-XXXX. GitHub Pages is static and
 * cannot rewrite, so a path segment per code would need a file per code —
 * every real invite would 404. The query form is served by this one page.
 *
 * THE PAGE IS USEFUL WITH JAVASCRIPT OFF, which is the whole site's rule. The
 * instructions, the store buttons and the age note are ordinary markup; the
 * only thing this file adds is displaying the code, and the code block ships
 * `hidden` so its absence is silent rather than an empty box.
 *
 * THE CODE IS UNTRUSTED INPUT — it arrives in a URL anyone can edit, and the
 * page is a link people are told to send to children. Two rules, either of
 * which alone would be sufficient and both of which are kept:
 *
 *   1. It is MATCHED against the exact issued shape and rejected otherwise.
 *      Not sanitised, not escaped — rejected. Anything that is not a friend
 *      code is not a friend code.
 *   2. It is written with `textContent`, never `innerHTML`. The site's CSP
 *      already forbids inline script, so this is defence in depth rather than
 *      the only guard — but this exact substitution (innerHTML → append text)
 *      was made across the rest of the site during hardening, and a new file
 *      that reintroduces the old habit undoes that work quietly.
 * ========================================================================== */

(function () {
  'use strict';

  /* The shape `ProfileNotifier` mints: MK- then two groups of four over
     `_codeAlphabet` = ABCDEFGHJKLMNPQRSTUVWXYZ23456789 — I, O, 0 and 1 are
     deliberately absent so a child reading a code aloud cannot produce an
     ambiguous one. The class here is that EXACT alphabet rather than
     [A-Z0-9]: a superset would accept MK-IIII-0000, which the app cannot
     issue, and the whole point of matching untrusted input is to accept only
     what is real. Anchored at both ends, so a code with anything appended is
     refused rather than quietly truncated into something that looks valid. */
  var CODE = /^MK-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

  function codeFromUrl() {
    var raw;
    try {
      raw = new URLSearchParams(window.location.search).get('c');
    } catch (e) {
      return null;               // Very old browser: no code, no error page.
    }
    if (!raw) return null;
    /* Uppercased before matching, because a code typed or forwarded by hand
       loses its case long before it loses its meaning. Trimmed for the same
       reason — a trailing space survives most copy-paste routes. */
    var code = raw.trim().toUpperCase();
    return CODE.test(code) ? code : null;
  }

  function show(code) {
    var block = document.getElementById('invite-code-block');
    var slot = document.getElementById('invite-code');
    if (!block || !slot) return;
    slot.textContent = code;     // never innerHTML — see the header.
    block.hidden = false;
  }

  var code = codeFromUrl();
  if (code) show(code);
  /* No `else`. A missing or malformed code leaves the page exactly as it
     shipped: an explanation of how to add a friend, and where to get the game.
     Telling a visitor their link was broken helps nobody — they cannot fix it,
     and the person who sent it is not here to be told. */
})();
