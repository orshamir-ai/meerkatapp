/* =============================================================================
 * MEERKAT UNIVERSE — SITE CONFIGURATION
 *
 * THE ONLY PLACE STORE URLS ARE WRITTEN. Nothing else in this site hard-codes a
 * store link, so turning the download buttons on later is a one-file change.
 *
 * While a value is `null` the button renders as a polished, NON-INTERACTIVE
 * "Coming soon" card: it is not a link, has no href, cannot navigate and cannot
 * reload the page. Put a real https URL in and it becomes an ordinary link on
 * the next page load, with no other edit anywhere.
 *
 *     appStore:   'https://apps.apple.com/app/idXXXXXXXXXX'
 *     googlePlay: 'https://play.google.com/store/apps/details?id=com.orshamir.meerkatuniverse'
 *
 * Do NOT put a TestFlight or Play testing-track URL here — this is the public
 * website, and a link that turns strangers away is worse than no link.
 * ========================================================================== */

window.MU_CONFIG = {
  storeLinks: {
    appStore: null,
    googlePlay: null,
  },

  /* The "Coming soon" caption under the buttons is deliberately NOT configured
     here — it is written in the HTML, so it is correct with JavaScript
     disabled, and site.js removes it once a real link exists.

     The one support address, used by support.html and delete-account.html.
     null renders an honest "not published yet" note rather than a mailto: that
     goes nowhere. */
  supportEmail: null,
};
