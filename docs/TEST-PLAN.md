# Bench — Test Plan (v3)

Bench has no framework, no test runner, and no CI test step — verification
has been done via a repeatable manual pattern across the v2 work, which
this doc writes down so it stays consistent going into v3 rather than
living only in commit history.

## What can be verified locally (before every commit)

Everything that is pure HTML/CSS/JS — which is nearly everything, since
Capacitor plugins are a thin, isolated layer (see below).

**Method**: serve the repo root with `python3 -m http.server <port>`, then
drive it with headless Chrome:

```
google-chrome --headless --disable-gpu --no-sandbox \
  --virtual-time-budget=<ms> --dump-dom http://localhost:<port>/<page>
```

A temporary `_test.html` (never committed — deleted before every commit)
loads the real `js/*.js` files in the same order as `index.html`, then runs
a script that:
- Seeds `S` with representative fake data (owned items across several
  categories, a project, a "need to buy" item, etc.)
- Calls the view functions directly (`vHome()`, `vAll()`, `vStock()`,
  `vBuy()`, `vProj()`, `open()`, `openAdd()`, `openMore()`, `openProject()`)
  and asserts on the returned/rendered HTML string or resulting DOM state
- For gestures (swipe rows), dispatches synthetic `PointerEvent`s
  (`pointerdown`/`pointermove`/`pointerup`) with `clientX` deltas — this
  works because Bench's swipe handling is plain DOM pointer events, not a
  gesture library, so scripted events exercise the exact same code path a
  real touch would
- Writes a single result string into `document.title` as
  `TESTRESULT:check1:OK|check2:ERR:<message>|...`, read back via
  `--dump-dom` and a `grep`

A second pattern, used for anything visual (shadows, dark mode, new
layout): `--screenshot=<path>.png --window-size=390,844` (a common phone
viewport) against either the real `index.html` or a small dedicated
`_shot.html`, then reading the PNG back to eyeball it. Two known pitfalls
already hit once each — write new screenshot harnesses with these in mind:
- Always include `<meta charset="utf-8">` in any throwaway test HTML shell,
  or hand-drawn glyphs (×, −, ✕) render as mojibake.
- `boot()` runs automatically via `main.js` and will overwrite any
  manually-set `data-theme`/state — set theme via the real `setTheme()`
  API *after* boot has settled (e.g. poll for the sheet's `open` class
  after first paint), not by mutating `document.documentElement.dataset`
  directly before boot runs.
- **`--virtual-time-budget` silently breaks IndexedDB persistence tests.**
  Virtual time wins the race against real IndexedDB I/O, so `dbOpen()`'s
  1200ms timeout fires first, `DB.ok` stays false, and every read/write
  silently falls back to the in-memory `DB.mem` object. Persistence then
  *appears* broken (or appears to work while writing nothing durable).
  Anything asserting that a value survives a real app restart must run
  with real time (a genuine `sleep`, results beaconed out via `fetch` to
  the http.server access log) against a persistent Chrome profile. Virtual
  time is fine for pure render/DOM assertions, which is most of the suite.

**Regression checklist** — run after any change, not just in the touched
area, since the global-scope module pattern means a rename/removal in one
file can silently break a caller in another:
- [ ] All five views (`Home`/`Stock`/`Buy`/`Projects`/`All`) render without
      throwing, with both empty and populated state
- [ ] Item detail sheet opens and closes cleanly
- [ ] Add-component form completes a full save
- [ ] Project create/open/add-part/delete flow completes
- [ ] More menu opens; theme toggle actually flips `data-theme`
- [ ] Search + category filter narrows results and clears correctly
- [ ] No `₹`, `money(`, or stray price references anywhere (Bench dropped
      cost tracking in v2 — this regressing would be a real bug)
- [ ] Swipe rows: dragging past the open threshold reveals the action and
      the action fires; a small/no drag still lets the normal tap through

## What can only be verified on-device (after a real build)

Anything behind a Capacitor plugin — the browser has no bridge for these,
so headless testing can only confirm the JS-side call is correctly guarded
(`if(window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.X)`) and
doesn't throw in a plain browser, not that the native behavior is correct.

| Feature | Plugin | On-device check |
|---|---|---|
| Back button closes sheet/steps back instead of exiting | `@capacitor/app` | Open a detail sheet, press hardware/gesture back — sheet should close, not exit app. Repeat from a non-Home tab. |
| Haptic pulses | `@capacitor/haptics` | Feel a light tap on status change / save / swipe action. |
| Splash screen | `@capacitor/splash-screen` | Cold-launch shows the branded blue splash briefly, not a blank/white screen, and dismisses quickly. |
| App icon | `@capacitor/assets` (build-time) | Home screen / app drawer icon shows the chip mark, not Capacitor's default. |

These get one line in the PR description each time they change, same
convention as the v2 back-button fix: call out explicitly that they're
unverified until installed.

## Before opening a PR

1. Full regression checklist above, green.
2. Any new screenshot-checked visual change actually looked at, not just
   "didn't throw."
3. Temporary test/screenshot files deleted — `git status` should show only
   the real, intended file changes.
4. PR description lists which on-device checks the reviewer (the user)
   still needs to do after installing the resulting APK.
