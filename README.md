# Tootie Designs — landing page

The home page for Tootie Designs, an independent web studio. It doubles as the
hub for every site the studio ships: the **Work** section is a grid of live
project links.

The design thesis is *range* — a studio with no house style. The hero
demonstrates it literally: one phrase whose subject cycles through different
clients, each set in a typeface that fits them.

## Stack

Deliberately dependency-free and static — it loads fast and deploys anywhere.

- Hand-written semantic HTML5
- One stylesheet (`css/styles.css`) driven by CSS custom properties
- One vanilla-JS file (`js/main.js`) — no framework, no build step
- Google Fonts: Bricolage Grotesque, Hanken Grotesk, Newsreader, JetBrains Mono

## Structure

```
index.html          Markup and copy
css/styles.css      Design tokens, layout, light + dark themes
js/main.js          Hero type-cycle, theme toggle, scroll reveals
assets/favicon.svg  Monogram
```

## Run it

No build needed. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customising

- **Add a real project:** copy a `<li>` in the `.work-grid` (in `index.html`).
  Set `href` to the live URL, and give the tile its own identity via the inline
  `--card-accent` (spot colour) and `--card-face` (title typeface) variables.
- **Contact address:** replace `hello@tootiedesigns.com` in `index.html`
  (two `mailto:` links in the Contact section) with the studio inbox.
- **Colour / type:** every colour and font is a token at the top of
  `css/styles.css`. Both light and dark themes are defined there.

## Accessibility & performance notes

- Fully keyboard navigable with a visible focus ring and a skip link.
- Light and dark themes, each hand-tuned (not an inversion); honours the OS
  preference and remembers a manual choice.
- Respects `prefers-reduced-motion` — the hero cycle and scroll reveals hold
  still for anyone who asks them to.
- A `Content-Security-Policy` meta tag restricts sources to self plus Google
  Fonts. External links carry `rel` safeguards where added.
