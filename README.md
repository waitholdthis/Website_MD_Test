# Tootie Designs — landing page

The home page for Tootie Designs, an independent web studio, and the hub for
every site the studio ships (the **Work** section links out to live projects).

## Look & feel

A dark, cinematic, premium identity: near-black textured background with soft
radial glows, an antique-gold accent carried on monospace uppercase labels,
heavy cream grotesque headlines, and hue-tinted "command-panel" cards. It's a
deliberate **single dark theme** — the aesthetic depends on it.

## Stack

Deliberately dependency-free and static — it loads fast and deploys anywhere.

- Hand-written semantic HTML5
- One stylesheet (`css/styles.css`) driven by CSS custom properties
- One vanilla-JS file (`js/main.js`) — no framework, no build step
- Self-hosted fonts (no third-party requests): **Onest** (display + body,
  a Neue-Grotesque-style face) and **JetBrains Mono** (labels)

## Structure

```
index.html          Markup and copy
css/styles.css      Design tokens, layout, dark theme
js/main.js          Sticky header, scroll reveals, placeholder-link guard
assets/favicon.svg  Monogram
assets/fonts/       Self-hosted woff2 (Latin subset) + OFL notice
```

## Run it

No build needed. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customising

- **Add a real project:** copy a `<li>` in the `.work-grid` (in `index.html`),
  set `href` to the live URL, choose a card tint (`card--warm` / `card--cool` /
  `card--teal` / `card--neutral`), and adjust the three `swatches` colours.
- **Contact address:** replace `hello@tootiedesigns.com` in `index.html`
  (two `mailto:` links in the Contact section) with the studio inbox.
- **Colour / type:** every colour and font is a token at the top of
  `css/styles.css` (`--gold`, `--fg`, `--bg`, card gradients, …).

## Accessibility & performance notes

- Fully keyboard navigable with a visible focus ring and a skip link.
- Respects `prefers-reduced-motion` — scroll reveals hold still when asked.
- A `Content-Security-Policy` meta tag restricts sources to self only.
- No dead/stubbed UI: the contact CTA is a real `mailto:`; placeholder work
  links are guarded so they never jump the page before real URLs are added.
