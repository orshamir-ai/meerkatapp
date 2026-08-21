# Website — review, hardening and polish

Review of `website/` as it stands live at `https://orshamir-ai.github.io/meerkatapp/`.
All five pages return 200. Findings first, then a plan.

---

## PART 1 — Correctness. Fix before submission.

These are not polish. Two of them can cost a review.

### 1.1 BLOCKER — the legal pages announce that they are not in force

`privacy.html` and `terms.html` both carry, live:

> **Draft for review — not yet in force.**

App Store Connect requires a Privacy Policy URL, and a reviewer opens it. A policy
that states it is not in force is arguably not a policy at all. This is the single
highest-risk thing on the site, and it is one line in each file.

Replace with an effective date (see 1.3).

### 1.2 BLOCKER-ADJACENT — the privacy policy contradicts itself on the parental gate

The document is unusually good: written from the source rather than a template, and
it even documents the change correctly in one place —

> *"**Superseded — the parental gate.** An earlier draft relied on a parental gate in
> front of account creation… The age branch replaces it."*

But two places were not updated with it, and one of them is a legal claim:

| Where | Says | Reality |
|---|---|---|
| §3.2 heading | "If your child signs in **(behind the parental gate)**" | sign-in is behind the AGE DECLARATION; the gate was removed from it |
| Legal-basis table | Social Hub basis = "Consent, **given by a parent through the parental gate**" | there is no gate there; a 13+ player consents for themselves |

The second matters more than a stale heading: it is the stated **GDPR lawful basis**
for the Social Hub, and it describes a mechanism the app no longer has. A reviewer
comparing §3.2 against the "Superseded" note will find the document disagreeing with
itself about how the app works.

**Fix:** heading → "(13 and over)"; legal basis → consent given by the player, who
must be 13+ to reach it, with the age declaration named as the control.

### 1.3 No effective date on either legal page

Neither `privacy.html` nor `terms.html` carries "Last updated" or an effective date.
Standard for both documents, and the first thing a reviewer looks for after the
title. Add on publication, not before.

### 1.4 Store buttons — correct as they are, and worth stating why

`assets/js/config.js` holds `appStore: null`, so the button renders a
non-interactive "Coming soon" card. **Leave it null until the app is actually live.**
The Apple ID now exists (`6802090814`), but that URL 404s until publication — and a
Download button that 404s is worse than no button. The file's own comment already
refuses a TestFlight link for the same reason.

Worth doing now: update the *example* in that comment from `idXXXXXXXXXX` to the real
id, so the person flipping it later has nothing to look up.

---

## PART 2 — Security. The posture is already unusually good.

Stated plainly because it is rare: **the site makes zero third-party requests.** No
CDN, no Google Fonts, no analytics, no tag manager, no embedded video. Every byte is
same-origin. There are no forms, so no injection or CSRF surface, and no
`target="_blank"` anywhere, so no reverse-tabnabbing to guard against. It is a static
site on GitHub Pages, so there is no server to compromise and HTTPS is enforced by
default on `*.github.io`.

Most "website security" advice does not apply here because the classes of problem it
addresses were designed out. What is left is small and worth doing.

### 2.1 Add a Content Security Policy — and here it can be a strict one

There is none. GitHub Pages cannot set response headers, so it has to be a
`<meta http-equiv>` tag in each page's `<head>`. **Because nothing external is
loaded, the strictest useful policy is achievable** — most sites cannot do this:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               img-src 'self' data:;
               style-src 'self';
               script-src 'self';
               font-src 'self';
               connect-src 'none';
               form-action 'none';
               frame-ancestors 'none';
               base-uri 'none';
               object-src 'none';
               upgrade-insecure-requests">
```

Two notes on the specifics. `connect-src 'none'` and `form-action 'none'` are honest
here — the site never fetches and never submits — and they are what turns a stolen
XSS foothold from "exfiltrate" into "nothing". `frame-ancestors 'none'` is the
clickjacking defence that `X-Frame-Options` would give if headers were available.

**Verify no inline handlers first.** A strict `script-src 'self'` breaks inline
`<script>` and `onclick=`. If any exist, move them into `site.js` rather than
weakening the policy with `'unsafe-inline'` — that one keyword removes most of the
value of the whole header.

### 2.2 Referrer policy

Add `<meta name="referrer" content="strict-origin-when-cross-origin">`. Small, but
it stops the full path leaking to the App Store when someone follows the download
button.

### 2.3 The support address is plain text in the markup

`meerkatuniverse.support@gmail.com` appears as literal text in the privacy policy,
the terms and the deletion page. That is **deliberate and correct** — a contact route
that needs JavaScript to appear is no use in a legal document, and `config.js` says so
in as many words. Accept the scraping; do not "protect" it with obfuscation that
breaks copy-paste for a parent.

Worth considering separately: a Gmail address is the weakest professional signal on
the site. See 3.1.

### 2.4 What NOT to add

- **Subresource Integrity** — nothing external to pin.
- **A cookie banner** — there are no cookies. Adding one would be theatre, and in a
  child-directed context, actively misleading.
- **Analytics** — the app ships zero third-party analytics on principle. Putting
  Google Analytics on the marketing site would contradict the privacy policy's own
  framing and create a data-collection disclosure that does not currently exist.

---

## PART 3 — Professional polish, ranked by effect

### 3.1 A custom domain — by far the biggest single lever

`orshamir-ai.github.io/meerkatapp/` reads as a personal project. `meerkatuniverse.com`
reads as a product. It changes the App Store support/privacy URLs, the email domain
(`support@meerkatuniverse.com` instead of Gmail — the second-biggest signal), and it
is what makes every other polish item worth doing.

Mechanically: buy the domain, add a `CNAME` file, point DNS at GitHub Pages, tick
*Enforce HTTPS*. GitHub provisions the certificate. Under an hour, mostly waiting.

**Do this before submitting**, because the URLs go into App Store Connect and changing
them later means editing the listing and re-verifying.

### 3.2 Finish the social/SEO metadata

`index.html` has `og:title`, `og:description`, `og:image`, `og:type` and
`twitter:card` — good. Missing: `og:url`, `og:site_name`, `twitter:image`, and a
`<link rel="canonical">`. Without `og:url` and canonical, a share can resolve to the
wrong variant of the address; without `twitter:image` the card may fall back to text.

Add a `SoftwareApplication` JSON-LD block too — it is what lets a search result show
the app's category and rating rather than a bare link.

### 3.3 A `robots.txt` and `sitemap.xml`

Neither exists. Five pages is small enough that crawlers manage, but their absence is
visible to anyone auditing, and `sitemap.xml` is ten lines.

### 3.4 Page weight

`assets/img` is 1.7 MB, dominated by `hero.jpg`. There is already a responsive
`srcset` with a `-sm` variant and a matching preload — that is more care than most
sites take. The remaining win is **WebP/AVIF with a `<picture>` fallback**, typically
50–70% off the hero for identical perceived quality. Worth doing at the same time as
the app's own WebP conversion, since it is the same decision made twice.

### 3.5 Accessibility pass

Skip-to-content links are present on every page, `alt` text is descriptive rather
than keyword-stuffed, and the nav is honest about being desktop-only. Remaining:
verify colour contrast on the muted caption text against the warm background, and
confirm every interactive element has a visible focus ring. For a child-directed
product this is worth doing properly rather than nearly.

### 3.6 The `<span>`-not-a-link pattern is right — keep it

The "Coming soon" store button renders as a `<span>` that cannot navigate or receive
focus, and becomes a real anchor only when a URL exists. That is better than a
disabled link and better than a dead `href="#"`. Do not let a redesign lose it.

---

## Suggested order

| # | Item | Effort | Why now |
|---|---|---|---|
| 1 | Remove "Draft — not in force" | minutes | Blocks review |
| 2 | Fix the two parental-gate claims | minutes | The policy contradicts itself |
| 3 | Add effective dates | minutes | Expected on both documents |
| 4 | Custom domain + email | ~1 hour | The URLs go into App Store Connect |
| 5 | CSP + referrer meta | ~30 min | Cheap, and unusually strong here |
| 6 | og:url / canonical / JSON-LD | ~30 min | Share and search presentation |
| 7 | robots.txt + sitemap.xml | ~15 min | Completeness |
| 8 | Hero to WebP/AVIF | ~1 hour | Pairs with the app conversion |
| 9 | Contrast + focus audit | ~1 hour | Child-directed product |
| 10 | Store link flip | minutes | **On launch day, not before** |

Items 1–3 are the only ones that gate submission. Item 4 gates it in practice, because
the URLs it changes are fields in the listing.
