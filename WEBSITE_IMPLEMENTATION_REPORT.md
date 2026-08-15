# Meerkat Universe Website — Implementation Report

Static marketing site for the mobile game. Independent git repository at
`/Users/orshamir/Developer/MeerkatApp/website`, outside the Flutter project, sharing no build
system or dependency with it.

---

## 1. Design

**The governing sentence: the game's art is the spectacle; the website's chrome is quiet.**

That resolves the one real tension in the brief — the site must obviously belong to Meerkat
Universe, and must obviously not be another screen of it. So the artwork is used full-bleed and the
palette is exact, while every piece of the game's *UI furniture* is refused:

| Taken from the game | Deliberately not taken |
|---|---|
| The artwork itself, full-bleed | Wooden plates, carved buttons, parchment windows |
| The palette, verbatim from `mu_tokens.dart` | The game's own UI components |
| Golden-hour warmth, storybook softness | Baked-label art used as buttons |
| The logo, as the single brand anchor | Game-style animation everywhere |

**Palette** is lifted from the app's `mu_tokens.dart` rather than sampled or invented, so the site
cannot drift from the product: ink `#5A3A1E`, cream `#FFF3DC`, tan `#CE9A5A`, accent `#F08A2E`,
plus the backdrop ramp and the logo's leaf greens.

**Type: no webfont at all.** `ui-rounded` resolves to SF Pro Rounded on Apple devices — soft and
friendly, the right register for a children's game — and falls back to `system-ui` elsewhere. Zero
bytes, no flash of unstyled text, no CDN. Self-hosting Baloo 2 (the game's own dialog-title face)
was considered and rejected for V1: no `woff2` tooling here, and the raw variable TTF is 668 KB.

**"Universe" means the natural world.** The hero art settles it — golden-hour savanna, acacias,
wildflowers. No planets, stars or spacecraft anywhere.

**Structure.** One scrolling landing page (Hero → Screenshots → About → Features → Final CTA →
Footer) plus four flat content pages. Screenshots come *before* any prose, because the pictures
sell the game better than the copy does.

No hamburger menu. The landing page has one job, and the legal links live in the footer where
people look for them; a minimal text nav appears on desktop only, where the room is free.

---

## 2. Implementation

Semantic HTML, one stylesheet, one small script. **No framework, no build step, no package
manager** — what is in the folder is what gets served.

```
index.html  privacy.html  terms.html  support.html  delete-account.html
favicon.png  .nojekyll  .gitignore  README.md  WEBSITE_DESIGN_PLAN.md
assets/css/site.css     one file, mobile-first, breakpoints at 600px and 960px
assets/js/config.js     ← the only file holding store links / support email
assets/js/site.js       store-button upgrade, carousel dots, entrance reveal
assets/img/             optimised website-specific copies of game art
assets/img/shots/       seven real screenshots from the running game
```

**Total weight: 1.9 MB**, of which 1.0 MB is the seven screenshots — all lazy-loaded and below the
fold. The hero is the only eagerly-fetched image.

**JavaScript is strictly additive.** Screenshots are real `<img>` elements in the markup, not
injected from config, so they render, lazy-load, carry alt text and are indexed with no JavaScript
at all. Store buttons are non-interactive without it. Nothing the visitor needs depends on the
script running.

**Accessibility**, built in rather than retrofitted: skip link; landmark elements; visible
`:focus-visible` on everything and removed from nothing; the carousel is a labelled, focusable
group of `<figure>`s with real captions; the dots are `<button>`s with "Show screenshot 3 of 7"
labels rather than decorative spans; every decorative image is `alt=""` and `aria-hidden`; every
meaningful image has descriptive alt text.

**Motion** is subtle and entirely optional: section entrance, three drifting hero leaves, a press
scale, native scroll-snap for the carousel. `prefers-reduced-motion: reduce` disables the drift and
the entrance, and content starts fully visible — never faded-out-and-stuck, which is how this
pattern usually breaks. No parallax.

---

## 3. Assets

**No source game asset was modified.** Everything under `assets/img/` is a website-specific
optimised copy, resized to roughly twice its largest CSS display size and re-encoded — art with
transparency stays PNG, photographic scenes and screenshots become JPEG.

| Asset | From | Size |
|---|---|---|
| `hero.jpg` / `hero-sm.jpg` | `home_screen/background_with_treehouse.png` | 216 K / 128 K |
| `logo.png` | `welcome/` | 169 K |
| `guardian.png` | `result_screen/victory_guardian.png` | 90 K |
| `leaf-1/7/14.png` | `home_screen/ambient/` | ~6 K each |
| `icon-180.png`, `favicon.png` | cropped from the logo | 59 K / 2 K |
| `shots/*.jpg` (7) | captured from the running game | 1.0 MB |

The hero uses `srcset` with a **matching `imagesrcset` on the preload**, so the preload and the
element resolve to the same file — a mismatch silently downloads both.

Deliberately unused: shop and social UI plates, buff and special icons, the guardian puppet parts,
the scroll-window furniture. They are game UI, and using them is exactly how the site would start
looking like a menu.

### Screenshots

Seven real captures of the running game, content unretouched — CSS only rounds the corners and adds
a border and shadow. **No device bezel:** bezels date badly, add weight, and imply a specific
handset.

The three gameplay shots were chosen by the owner from a set of **thirteen candidates** — ten
additional captures were staged specifically so the choice could be made from a real spread rather
than from whatever the first pass produced. The three that won lead the carousel because each shows
a different thing: tension (one fruit left, three intruders at the basket), consequence (a pinecone
connecting, a raccoon knocked off the branch, the beetle reward), and a named mechanic (a Swift Paws
buff card). They were picked on *legibility at thumbnail size* — the arena is a single fixed
composition, so variety comes from effects and HUD state rather than framing, and several otherwise
good candidates showed effects that simply did not read small.

One caveat worth recording: the leaderboard shot was taken on a **separate level-74 account**,
because `FakeSocialService`'s NPCs top out at level 118 and the shot profile is level 150, which
would have ranked the player #1 and made the board look staged.

### Known asset gaps — recorded, not invented

1. **A wide (landscape) crop of the hero savanna.** The most useful one by far. The source is
   948×1660 portrait, so every desktop viewport crops it hard; the framing had to be tuned to keep
   the treehouse in frame at all.
2. **A real app icon.** `Icon-App-1024x1024@1x.png` is still the stock Flutter logo (audit REL-003),
   so there is no brand mark to derive a favicon from — V1 crops the meerkat head out of the logo.
   **A placeholder is in place pending the icon you said you would provide.**
3. **An Open Graph share image (1200×630).** Shared links currently show a crop of the hero.
4. **A horizontal wordmark.** The logo is a tall badge; a wide lockup would suit the footer better.
5. **Baloo 2 as a subset `woff2`**, to tie website headings to the game's own dialog titles.

---

## 4. Store Links — **NOT CONFIGURED**

**The App Store and Google Play links are NOT CONFIGURED.** No public URLs exist for this app, and
none were invented, searched for, or substituted with a TestFlight or Play testing-track link.

The buttons ship as `<span>` elements — not links, not focusable, no `href`. They **cannot navigate
and cannot reload the page**, and they do not tell a screen reader they are actionable when they are
not. Their accessible names end in "— coming soon", and a "Coming soon" caption sits beneath them.

Both live in exactly one place, `assets/js/config.js`:

```js
window.MU_CONFIG = {
  storeLinks: { appStore: null, googlePlay: null },
  supportEmail: null,
};
```

Supplying a URL replaces the span with a real `<a>` on the next page load and removes the caption —
in both the hero and the closing call-to-action — with **no other edit anywhere in the site**.
There are no `href="#"` links anywhere; an audit script checks this.

---

## 5. Legal & Support

**No legal content was invented, and no support address was invented.**

- `privacy.html` and `terms.html` open with an unmissable dashed-red placeholder block stating in
  plain words that the page is a working draft, has not been reviewed by a lawyer, is not a legal
  commitment, and must be replaced before any app store submission.
- What those pages *do* state as fact is taken from this repository's own source and documentation
  rather than imagined: no advertising and no third-party analytics (enforced by
  `kids_category_guard_test.dart`), what the published social profile contains, that crash reports
  carry no player identity, and that product telemetry is first-party and sends no identifier.
- `terms.html` additionally **lists what a published agreement will need to cover**, so the gap is
  visible rather than hidden.
- `delete-account.html` documents the real in-app route (Settings → Account → Delete Account) and
  **claims no timescale, no retention detail and no request route**, because none is documented
  anywhere to claim. It says so explicitly rather than staying silent.
- `support.html` answers five genuine questions from actual app behaviour, and states plainly that
  no contact address has been published yet.

The drafts are `noindex`, so an unfinished policy cannot be indexed as the real one.

---

## 6. QA

Rendered in real headless Chrome at **320×568, 390×844, 430×932, 768×1024 and 1280×860**, plus the
content pages, and inspected as images rather than reasoned about.

One harness note worth recording: Chrome enforces a 500 px minimum window on macOS, so
`--window-size=390` renders a 500 px layout and merely *crops* the screenshot. The first pass looked
like a severe overflow bug that did not exist. Everything was re-shot through an exact-size iframe
harness, which gives the inner document a true narrow layout viewport.

**Five real defects were found by rendering, each of a kind a source review passes:**

1. **The desktop nav was dead.** `.topnav { display: none }` was written *after* the 960 px media
   query that sets `display: block` — identical specificity, so the later rule won. Base styles now
   precede the breakpoints.
2. **Images were being stretched.** Every `<img>` carries real `width`/`height` so nothing shifts as
   art loads, but those attributes are also *presentational hints* — so an image the CSS sized by
   width alone was stretched to the attribute's height. `img { height: auto }` neutralises the hint
   while keeping the reserved aspect ratio.
3. **The entrance reveal could silently blank the page.** It was an `IntersectionObserver`, whose
   failure mode is the worst available: every `.reveal` section stuck at `opacity: 0`. No feature
   check can detect an observer that *exists but never delivers* — measured, inside an embedded
   document it reports once, non-intersecting, then goes quiet through every subsequent scroll.
   Replaced with a `requestAnimationFrame`-throttled geometry pass, which is also verifiable from
   outside: scroll, then assert the class is present (4/12 mid-page, 12/12 at the bottom).
4. **The rewrite's first form had its own bug.** Testing "is it on screen *now*" leaves anything
   scrolled *past* hidden forever — exactly what a deep link or a restored scroll position lands you
   in. The test is now "has it reached the trigger line".
5. **The first two screenshots were unreachable on desktop.** `justify-content: center` on a scroll
   container centres overflowing content in *both* directions, and `scrollLeft` cannot go negative —
   so the start of the track was clipped off the left edge with no way to scroll to it. Now
   `justify-content: safe center`, which falls back to start alignment whenever the content
   overflows. Browsers that do not know the keyword drop the declaration and get start alignment
   too, which is the wanted outcome anyway.

Also corrected in QA: alt text that said the guardian holds "beetles" when the art shows a pinecone;
a feature-card icon of three stacked lines that read as a hamburger menu (now a left-right swipe,
which is also literally the game's control); low contrast on the hero sub-line over bright sunlit
grass (a second, local scrim now lifts only the band the text occupies); a desktop hero crop that
cut the treehouse off at the top; and a dead `comingSoonLabel` config key that nothing read.

An automated audit confirms: no missing assets, no orphaned files, no `href="#"`, and no store or
support URL anywhere in the shipped pages.

---

## 7. GitHub Pages — deployed on owner instruction

The site was built with nothing published. It was deployed afterwards, when the owner asked for the
directory to become a repository for their GitHub page.

**Live: https://orshamir-ai.github.io/meerkat-universe/** — repo `orshamir-ai/meerkat-universe`
(public), Pages source branch `main`, folder `/ (root)`.

**The existing NudgeIt site was NOT touched, and that was the whole decision.** `orshamir-ai.github.io`
already served a live, built NudgeIt marketing site — with the same `privacy` / `support` /
`delete-account` structure, which makes it easy to mistake for a previous version of this one.
Publishing here would have replaced a production site, so it was raised rather than assumed. The
owner confirmed both sites must live at separate URLs, which a project page gives for free:

```
orshamir-ai.github.io/                   → NudgeIt          (verified still serving, HTTP 200)
orshamir-ai.github.io/meerkat-universe/  → Meerkat Universe (new)
```

Verified after the first build: all five pages, the stylesheet, the config, the hero, a screenshot
and the favicon return **200**, the deployed page renders correctly at the subpath, and NudgeIt still
returns its own title. Relative asset paths are what make the subpath work with no edit.

**No DNS was changed, no custom domain configured, and nothing purchased.** Promoting this site to
the root later would mean either moving NudgeIt to its own project repo or pointing a domain here —
both owner decisions, neither implied by this deployment.

### One consequence worth stating plainly

The repository is **public**, so the draft `privacy.html` and `terms.html` are now publicly
reachable. They carry unmissable "working draft, not a published policy" blocks and are `noindex`,
so they will not be indexed as the real thing — but they are visible to anyone with the URL. That is
the correct trade while the pages say clearly what they are; it stops being correct the moment they
are mistaken for final. They should be replaced with reviewed text before the app is submitted.

---

## 8. Open items

| Item | Owner action |
|---|---|
| Real app icon | You said you would provide one; a logo crop is in place |
| Store URLs | Set both in `assets/js/config.js` when the apps are live |
| Support email | Set `supportEmail` in the same file |
| Privacy policy and terms | Must be drafted and reviewed; drafts are marked and `noindex` |
| Wide hero crop, OG image, wordmark | Recorded in the design plan; none generated |
