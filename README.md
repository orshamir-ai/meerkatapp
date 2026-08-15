# Meerkat Universe — website

The official public website for the mobile game **Meerkat Universe**. Static HTML, CSS and a small
amount of vanilla JavaScript. No build step, no framework, no package manager.

This is an **independent repository**. It is not part of the Flutter app, does not import from it,
and nothing here is compiled into a build.

---

## Running it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

There is nothing to install and nothing to compile. What is in this folder is what gets served.

---

## Layout

```
index.html            the landing page
privacy.html          \
terms.html             |  flat content pages, shared quiet layout
support.html           |
delete-account.html   /
favicon.png
.nojekyll             tells GitHub Pages to serve the folder as-is
assets/
  css/site.css        all styles, mobile-first, one file
  js/config.js        ← THE ONLY FILE TO EDIT FOR STORE LINKS AND SUPPORT EMAIL
  js/site.js          store-link upgrade, carousel dots, entrance reveal
  img/                website-specific optimised copies of game art
  img/shots/          seven real screenshots captured from the running game
WEBSITE_DESIGN_PLAN.md  the design reasoning behind all of the above
```

---

## Store links are NOT configured

There are no public App Store or Google Play URLs for this app yet, so **none are in this repo**.
The two store buttons ship as `<span>` elements: not links, not focusable, no `href`. They cannot
navigate and cannot reload the page, and a screen reader is told they are "coming soon" rather than
being told they are buttons that do nothing.

To make them real, edit **`assets/js/config.js`** and nothing else:

```js
window.MU_CONFIG = {
  storeLinks: {
    appStore:   'https://apps.apple.com/app/idXXXXXXXXXX',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.orshamir.meerkatuniverse',
  },
  supportEmail: null,
};
```

On the next page load each configured button is replaced by a real `<a>`, and the "Coming soon"
caption beneath them is removed. Both the hero and the closing call-to-action are covered by the
same one edit. Leaving a value as `null` keeps that button as a placeholder.

The same file holds `supportEmail`. While it is `null`, every page says plainly that no address has
been published; setting it fills the address in and removes those notices.

---

## The legal pages are drafts

`privacy.html` and `terms.html` carry clearly-marked placeholder blocks, and `delete-account.html`
makes no claim about timescales or retention. This is deliberate: no policy has been drafted or
reviewed for this app, and placeholder legal copy that *looks* final is worse than an obviously
unfinished page. They must be replaced with reviewed text before any app store submission.

What those pages *do* state factually — no advertising, no third-party analytics, what the social
profile contains, what a crash report carries — is taken from the application's own source and
documentation rather than invented.

---

## Deploying to GitHub Pages

**Nothing here is published automatically.** No DNS, no custom domain, and no deployment credentials
are configured in this repo.

When the owner is ready:

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`,
   folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

Every asset path in every page is **relative**, so the site works unchanged at a project subpath, at
a user page, and at a custom domain later. `.nojekyll` is present so GitHub serves the folder as-is
rather than running it through Jekyll.

A custom domain is a separate, deliberate step and has not been taken.

---

## Assets

Everything in `assets/img/` is a **website-specific optimised copy**. The source game assets in the
Flutter project were read and never modified. Copies are resized to roughly twice their largest CSS
display size and re-encoded — art with transparency stays PNG, photographic scenes and screenshots
become JPEG.

The screenshots are real captures of the running game. Their content is not retouched; CSS only
rounds the corners and adds a border and shadow.

### Known asset gaps

Recorded rather than invented — see `WEBSITE_DESIGN_PLAN.md` for the full list:

- There is **no real app icon** yet; the favicon and the small mark are cropped from the logo.
- There is **no wide (landscape) hero crop**, so desktop crops the portrait art tightly.
- There is **no purpose-made Open Graph image**; shared links currently show the hero crop.
