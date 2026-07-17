# Tootie Designs — church websites

The home page for Tootie Designs, a web design agency that builds and maintains
custom websites for small-to-midsize churches on a monthly subscription
($100–500/mo) rather than a five-figure upfront build.

Positioning, pricing, tiers, and integrations on this page come from
[`church_web_agency_business_model.md`](church_web_agency_business_model.md) —
if the model changes, this page should change with it.

### One deliberate divergence from the model

The model is built on serving **one defined local metro**, and leans on
in-person kickoff, ministerial-alliance networking, and "local relationship
capital" as the moat (Sections 1.3–1.4). **This site serves churches nationally
instead**, so all in-person promises have been rewritten for remote delivery:
the process starts with a call rather than a visit, and the differentiator is a
named person who answers the phone rather than someone in the building.

Worth knowing: the model argues local presence is the thing "a remote national
vendor structurally cannot replicate." Going national trades that moat away, so
the CAC and churn assumptions in the workbook may not hold as written.

## Look & feel

Warm, light, and trustworthy: a cream base with a fine paper texture, deep-navy
headlines, brass accents on monospace uppercase labels, and softly tinted cards.
It's a deliberate **single light theme** — the aesthetic depends on it.

The buyer is a pastor or a volunteer church administrator, not a design director.
Everything here optimises for "these people are approachable and will pick up the
phone" over "this studio is expensive."

## Stack

Deliberately dependency-free and static — it loads fast and deploys anywhere.

- Hand-written semantic HTML5
- One stylesheet (`css/styles.css`) driven by CSS custom properties
- One vanilla-JS file (`js/main.js`) — no framework, no build step
- Self-hosted fonts, no third-party requests (the CSP is `self`-only, so a
  Google Fonts request would be blocked): **Newsreader** for headlines,
  **Inter** for running text, **JetBrains Mono** for the uppercase labels.
  All three are variable fonts, instanced and subset to the glyphs this page
  uses — see [`assets/fonts/OFL-NOTICE.md`](assets/fonts/OFL-NOTICE.md) for the
  rebuild commands and the glyph-coverage warning.

## Structure

```
index.html          Markup and copy
css/styles.css      Design tokens, layout, light theme
js/main.js          Sticky header, scroll reveals, lazy video, link guard
assets/favicon.svg  Monogram
assets/fonts/       Self-hosted woff2 (Latin subset) + OFL notice
assets/img/         Stills (webp)
assets/video/       Encoded mp4 + webp posters
pictures/ videos/   SOURCE masters — not shipped, not referenced by the page
```

### The media pipeline

`pictures/` and `videos/` hold the 58 MB originals. **Nothing in them is served.**
Everything on the page is a compressed derivative in `assets/`, regenerated with
ffmpeg/Pillow. To re-encode after replacing a master:

```bash
# hero — cropped to the arch's 4:5 at encode time, so no wasted pixels ship
ffmpeg -i videos/Hero_Church.mp4 -vf "crop=576:720:352:0" -an \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart \
  assets/video/hero-church.mp4

# wide clips (strip / reel)
ffmpeg -i videos/River.mp4 -vf "scale=1120:-2" -an \
  -c:v libx264 -crf 32 -preset slow -pix_fmt yuv420p -movflags +faststart \
  assets/video/river.mp4
```

Every `<video>` is muted/loop/playsinline with a real first-frame poster. Only the
hero autoplays; the rest carry `data-lazyplay` and are fetched and played by
`js/main.js` when scrolled into view, then paused on exit. Under
`prefers-reduced-motion` nothing plays and the posters stand in.

**Weight budget:** ~530 KB above the fold (core + hero video), ~2.7 MB if a
visitor scrolls the whole page. Keep it there — if you add a clip, take one away.

Page sections, in order: hero → start here (the five problems churches arrive
with) → process band → what's included + integrations → pricing → work →
who you work with → contact.

## Run it

No build needed. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Before this goes live

- **The `#work` section is illustrative, not a portfolio.** The reel shows a
  *range* of church styles; its caption says so in as many words. That caption is
  load-bearing honesty — the model projects the first client in Month 1, so there
  is no client work yet. Don't delete the caption while that's still true, and
  don't relabel the reel as "our work." When real churches launch, replace the
  reel with them.
- **The imagery is stock/generated, not photographs of clients.** Fine as
  atmosphere; it stops being fine the moment a caption implies otherwise.

Contact is live: `tootiedesigns18@gmail.com` in the `#contact` section (two
`mailto:` links). A phone number is still worth adding — the pitch is built on
"a person who picks up," and right now there's no number to pick up.

## Customising

- **Add a real church:** copy a `<li>` in the `.work-grid` (in `index.html`), set
  `href` to the live URL, choose a card tint (`card--warm` / `card--cool` /
  `card--sage` / `card--neutral`), and adjust the three `swatches` colours.
- **Change pricing:** the three `.tier` cards in the `#pricing` section. Keep them
  in sync with the `Assumptions` tab of the business model workbook.
- **Colour / type:** every colour and font is a token at the top of
  `css/styles.css` (`--brass`, `--ink`, `--bg`, card gradients, …).

## Accessibility & performance notes

- Fully keyboard navigable with a visible focus ring and a skip link.
- Text colours are checked against the cream background: body 6.6:1, muted and
  brass ≥4.5:1 — all pass WCAG AA. If you retint `--brass`, re-check it; it sits
  close to the 4.5:1 line on this background.
- Buttons carry a 44px minimum touch target.
- Respects `prefers-reduced-motion` — scroll reveals hold still when asked.
- A `Content-Security-Policy` meta tag restricts sources to self only.
- No dead/stubbed UI: contact CTAs are real `mailto:` links; placeholder work
  links are guarded so they never jump the page before real URLs are added.
