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
    /* Live on the App Store since 4 September 2026. The id is the same one
       `update_required_screen.dart` carries as `kAppStoreUrl`; if one ever
       changes, change both. */
    appStore: 'https://apps.apple.com/app/id6802090814',
    /* Still null: the Android build is in the Play Console but not published.
       A PARTIAL launch is the case the first version of this file did not
       anticipate — see the note about `.store-note` below. */
    googlePlay: null,
  },

  /* The "Coming soon" caption under the buttons is deliberately NOT configured
     here — it is written in the HTML, so it is correct with JavaScript disabled.
     site.js removes it only when EVERY button is live, and rewrites it to name
     the platform still missing when only some are. It used to remove the caption
     as soon as ANY button went live, which was fine while the two platforms were
     assumed to ship together and wrong the moment iOS shipped first: the Play
     button would have been left looking exactly like the working one.

     The support address is likewise written into the pages as real markup, not
     injected from here: it appears in the privacy policy and the terms, where a
     contact route that needs JavaScript to appear is no use at all. To change it,
     grep the repo for the old address. */
};
