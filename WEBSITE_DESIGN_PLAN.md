# Meerkat Universe — Website Design Plan

The official public website. Static, mobile-first, GitHub Pages.
This document exists to make the implementation intentional, not to specify it exhaustively.

---

## Visual Direction

**The game's art is the spectacle; the website's chrome is quiet.**

That sentence resolves the one real tension in this brief: the site must obviously belong to
Meerkat Universe, and must obviously not be another screen of it.

So the split is deliberate:

| Taken from the game | Deliberately NOT taken |
|---|---|
| The artwork itself, full-bleed | Wooden plates, carved buttons, parchment windows |
| The palette, exactly | The game's own UI components |
| Golden-hour warmth, storybook softness | Baked-label art as buttons |
| The logo, as the single brand anchor | Game-style animation everywhere |

Website chrome is plain: generous whitespace, soft shadows, rounded corners, ordinary type.
Anything that would read as a *control from the game* is out — the moment a visitor thinks
"this is a screenshot of a menu" the site has failed as a website.

### Palette — lifted from `mu_tokens.dart`, not invented

| Token | Hex | Use |
|---|---|---|
| Ink | `#5A3A1E` | All body text and headings |
| Cream | `#FFF3DC` | Page background, cards |
| Tan | `#CE9A5A` | Borders, dividers, muted rules |
| Accent | `#F08A2E` | Primary CTA, links |
| Accent soft | `#FFC24D` | Hover, highlights |
| Backdrop ramp | `#FFE9B8` → `#FAD08A` → `#F3B074` | Section gradients, hero scrim |
| Leaf green | `#4A7A2B` / `#8CBF3F` | From the logo badge — accents only |

### Type

**No webfont.** `ui-rounded` resolves to SF Pro Rounded on Apple devices — soft, friendly, exactly
the right register for a children's game — and falls back to `system-ui` elsewhere. It costs zero
bytes and never flashes.

The logo already carries all the personality the page needs. A second decorative face would compete
with it.

> Considered and rejected for V1: self-hosting **Baloo 2**, the game's own dialog-title face
> (SIL OFL, already in the repo). No `woff2` tooling is available here and the raw variable TTF is
> 668 KB — too much for a heading font on a mobile-first page. Recorded under *Missing Assets*.

### "Universe" means the natural world

The hero art settles this: golden-hour savanna, acacias, wildflowers. No planets, stars or
spacecraft anywhere on this site.

---

## Page Structure

One scrolling landing page, plus four flat content pages.

```
index.html          Hero → Screenshots → What it is → Features → Final CTA → Footer
privacy.html        \
terms.html           |  shared quiet layout: cream, narrow measure,
support.html         |  no full-bleed art, same header/footer
delete-account.html /
```

Flat files at the repo root with **relative** asset paths, so the site works unchanged at
`user.github.io/repo/` and at a custom domain later.

**No top navigation on mobile, and no hamburger.** The landing page has one job — understand the
game — and legal/support links live in the footer where people look for them. A minimal text link
row appears on desktop only, where there is spare horizontal room and it costs nothing.

---

## Asset Selection

Only what strengthens the site. Everything else stays in the game.

| Asset | Source | Where |
|---|---|---|
| `logo.png` (487×400) | `welcome/` | Hero, footer, favicon crop |
| `background_with_treehouse.png` (948×1660) | `home_screen/` | Hero, full-bleed |
| `victory_guardian.png` (335×444, transparent) | `result_screen/` | Final CTA |
| `ambient_*.png` (3 of 23) | `home_screen/ambient/` | Drifting leaves |
| Character crops — fox, raccoon, monkey | `intruder/*/` | Feature cards |
| 7 screenshots | captured from the simulator | Screenshots section |

**Website-specific optimized copies only.** Source game assets are never modified. Copies are
resized and re-encoded into `assets/img/`, at roughly 2× their largest CSS display size and no more.

Deliberately unused: shop/social UI plates, buff and special icons, the guardian puppet parts, the
scroll-window furniture. They are game UI, and using them is exactly how the site would start
looking like a menu.

---

## Hero Composition

The first mobile viewport, top to bottom:

```
┌──────────────────────────────┐
│   sky, drifting leaves       │  full-bleed background_with_treehouse
│                              │  object-position favours the treehouse
│        [ LOGO ]              │  ~70vw, max 320px, centred
│                              │
│    Guard the treehouse.      │  tagline, cream, soft shadow
│  A warm, gentle reflex game  │  one supporting line — tells a parent
│      for young players.      │  who this is for, within seconds
│                              │
│  ┌────────┐   ┌────────┐     │  two store CTAs, side by side ≥380px,
│  │App Store│  │  Play  │     │  stacked below that
│  └────────┘   └────────┘     │
│        Coming soon           │
│  ······ warm scrim ······    │  gradient into the cream below —
└──────────────────────────────┘  no hard edge between art and page
```

- Height `100svh` (small-viewport unit) so the mobile address bar cannot cause a jump, with a
  `min-height` floor for short landscape windows.
- **A scrim, not luck.** Text sits on a soft warm gradient over the art rather than relying on
  whatever pixels happen to be behind it. This is a legibility requirement, not decoration.
- The CTAs are above the fold. A visitor who never scrolls has still seen the name, what it is, who
  it is for, and where it will be available.

Tagline: **"Guard the treehouse."** — three words, imperative, echoes the game's own name
(Treehouse Guard), promises nothing that is not in the product.

---

## Screenshot Presentation

Seven real screenshots, captured from the running game on an iPhone 17 Pro simulator. Three are
gameplay; the rest are Home, Victory, Shop and Leaderboard.

- **Mobile:** horizontal `scroll-snap` carousel, one-and-a-bit slides visible so it is self-evidently
  swipeable. Native touch scrolling — no JS animation, no tiny arrows. Subtle dots below.
- **Desktop:** the same track, wider, three visible at once. No overlap, no fake 3-D fan.
- **Framing:** rounded corners, a thin tan border and a soft shadow. **No skeuomorphic device bezel** —
  bezels date badly, add weight, and imply a specific handset.
- **Content is never altered.** CSS may round, shadow and scale. Nothing is retouched.
- **Accessible:** the track is focusable, arrow keys move it, each slide is a `<figure>` with a real
  caption, and the dots are buttons with labels rather than decorative spans.

**Driven by one config array.** If no screenshots are configured, the section does not render at
all — so the site is never live with an empty carousel.

---

## Motion

Subtle, and all of it optional.

| Motion | Implementation |
|---|---|
| Section entrance (fade + 12px rise) | `IntersectionObserver`, one class toggle |
| Drifting leaves in the hero | 3 elements, CSS keyframes, 30–45s, low opacity |
| Button press | `transform: scale(.97)` on `:active` |
| Screenshot swipe | Native scroll-snap — no script |
| Desktop hover | Soft lift on cards and CTAs |

**No parallax.** The brief warns against excess and the leaf drift already supplies life; scroll-tied
transforms are the usual source of jank on mid-range phones.

`prefers-reduced-motion: reduce` disables the leaf drift and the entrance animation, and content
starts fully visible — never faded-out-and-stuck, which is the classic way this pattern breaks.

---

## Responsive Strategy

Mobile-first. Base CSS is the phone; two `min-width` breakpoints add room.

| Range | Change |
|---|---|
| Base — narrow phones | Single column. Stacked CTAs. Carousel shows 1.15 slides. |
| ≥ 600px — large phones, tablets | CTAs side by side. Features 2-up. Carousel 2.2 slides. |
| ≥ 960px — desktop | Content capped ~1100px. Features 4-up. Carousel 3 slides. Minimal text nav appears. Hero capped ~820px tall. |

- Text measure capped near 65 characters everywhere, including legal pages.
- The hero art is portrait, so desktop crops it tighter around the treehouse rather than letterboxing.
  A proper wide crop is the top *Missing Assets* item.
- Explicit `width`/`height` on every image so nothing shifts as art loads.
- Everything below the fold is `loading="lazy"`; the hero art is not.

---

## Missing Assets

Recorded as recommendations. **None of these are being generated**, and V1 does not depend on any.

1. **A wide (landscape) crop of the hero savanna.** The single most useful one. The source is
   948×1660 portrait, so every desktop viewport crops it hard. A 16:9 composition of the same scene
   would markedly improve the desktop hero.
2. **A real app icon.** `Icon-App-1024x1024@1x.png` is still the stock Flutter logo (audit REL-003),
   so there is no brand mark to derive a favicon from. V1 crops the meerkat head out of the logo
   instead — adequate, not ideal.
3. **An Open Graph share image (1200×630).** Links shared to iMessage, WhatsApp or Slack currently
   have nothing to show. V1 ships a crop of existing art; a purpose-made one would be better.
4. **A horizontal wordmark.** The logo is a tall badge; a wide lockup would suit the footer and a
   desktop header far better than a scaled-down badge.
5. **Baloo 2 as a subset `woff2`.** Would tie website headings to the game's own dialog titles. Needs
   `fonttools`/`woff2_compress`, neither available here.

---

## Store Links — not configured

There are no public App Store or Google Play URLs. The buttons are polished, non-navigating
placeholders carrying a "Coming soon" treatment.

Both live in **one** place, `assets/js/config.js`:

```js
const storeLinks = { appStore: null, googlePlay: null };
```

`null` renders the button as a non-interactive element with no `href` — it cannot navigate, cannot
reload the page, and is marked `aria-disabled`. Supplying a URL turns it into a real link with no
other change anywhere in the site.
