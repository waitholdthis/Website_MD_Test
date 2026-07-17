# Bundled font licenses

These woff2 files are Latin subsets of open-source families, self-hosted so the
site has no third-party font dependency (the page's CSP is `self`-only, so a
Google Fonts request would be blocked anyway). All are licensed under the
**SIL Open Font License 1.1** (OFL), which permits bundling and redistribution.

| File | Family | Author / foundry | Role | License |
| --- | --- | --- | --- | --- |
| `newsreader.woff2` | Newsreader | Production Type | Headlines | OFL 1.1 |
| `inter.woff2` | Inter | Rasmus Andersson | Running text | OFL 1.1 |
| `jetbrains-mono.woff2` | JetBrains Mono | JetBrains | Uppercase labels | OFL 1.1 |

Full license text: https://openfontlicense.org

## How these were built

Each file is a **variable font, instanced and subset** to only what the page uses
— which is why they're a fraction of the upstream size (Newsreader 129 KB → 34 KB,
Inter 47 KB → 25 KB). To regenerate after changing the type:

```bash
pip install fonttools brotli

UNI="U+0020-007E,U+00A0-00FF,U+2010,U+2011,U+2013,U+2014,U+2018,U+2019,\
U+201C,U+201D,U+2022,U+2026,U+00B7,U+2192,U+2197,U+00A9"

# Newsreader — optical-size axis pinned at 30 (display), weight axis kept
python -m fontTools.varLib.instancer newsreader.ttf opsz=30 wght=400:700 -o nr.ttf
python -m fontTools.subset nr.ttf --unicodes="$UNI" --flavor=woff2 \
  --layout-features='kern,liga,calt,ccmp,locl,mark,mkmk' \
  --output-file=newsreader.woff2 --no-hinting

# Inter — weight axis kept, tabular numerals retained for the pricing table
python -m fontTools.varLib.instancer inter.ttf wght=400:700 -o in.ttf
python -m fontTools.subset in.ttf --unicodes="$UNI" --flavor=woff2 \
  --layout-features='kern,liga,calt,ccmp,locl,mark,mkmk,tnum' \
  --output-file=inter.woff2 --no-hinting
```

**Watch the glyph set.** The subset covers Basic Latin, Latin-1, curly quotes,
en/em dashes, the middot in the hero label, and the `→` / `↗` arrows. A character
outside that range (a different arrow, an accented name) will silently fall back
to Georgia/system and look wrong — extend `$UNI` and re-subset rather than
dropping the character in and hoping.

When pulling from Google Fonts, take the `@font-face` block whose `unicode-range`
includes `U+0000-00FF`. The **first** block returned is Cyrillic; grabbing it
yields a file with no Latin glyphs that fails silently and falls back to a system
serif — which looks plausible enough to ship by accident.
