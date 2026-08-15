# Bench — Technical Requirements (v3)

## 1. Current architecture (as of v2, branch `version_2`)

```
bench-app/
├── index.html              thin shell: head, body skeleton, <script src> tags
├── css/
│   └── style.css           one stylesheet, CSS custom properties for theming
├── js/
│   ├── icons.js             hand-drawn SVG part-art + symbol/icon generation
│   ├── catalog.js            static parts database (CATALOG array, ~250 entries)
│   ├── store.js              IndexedDB wrapper, app state (S), boot()
│   ├── views.js               screen rendering (Home/Stock/Buy/Projects/All), nav
│   ├── detail.js              detail sheet, add form, more menu, project sheets
│   ├── io.js                  backup export/import, shrink-photo, shopping list
│   └── main.js                entry point: event wiring, back-button, boot() call
├── assets/
│   ├── icon.svg              app icon source (rasterized at build time)
│   └── splash.svg            splash screen source (rasterized at build time)
├── .github/workflows/
│   └── build-apk.yml         GitHub Actions: Capacitor wrap + Gradle build + release
└── docs/                      this directory
```

No framework, no bundler, no npm build step for the app itself. All JS
files are loaded as plain `<script>` tags in dependency order and share one
global scope (functions/consts defined in one file are used directly by
functions in files loaded after it — e.g. `views.js` calls `price()`-style
helpers... actually as of v2, pricing helpers are unused but left defined
in `store.js` for anyone who wants to look at how `all()`/`byId()`/`U()`
work). This was a deliberate choice over ES modules: the code has ~60
cross-referencing functions/consts with no existing `import`/`export`
structure, and converting that blind carries real risk (a missed export
breaks a screen only when that code path runs, hard to catch without
exhaustive manual testing). **v3 keeps this pattern** — modularity here
means clearly-scoped files with a single responsibility each, not ES module
syntax.

Storage: one IndexedDB database (`bench2`), a single `kv` object store,
keyed by string (`u`, `custom`, `proj`, `pix`, `p:<id>`, `theme`,
`onboarded`, ...). All reads/writes go through `dbGet`/`dbSet`/`dbDel` in
`store.js`. No backend — this is intentional and stays intentional (see
PRD §4, Won't have).

Build/deploy: `.github/workflows/build-apk.yml` runs on push to `main`
only (a v2 change — earlier it ran on every branch, which risked
overwriting the live release with WIP builds). It wraps the web app in
Capacitor, generates the Android project fresh every run (not committed),
generates app icon/splash from `assets/*.svg` via `@capacitor/assets`,
builds a debug-signed APK (reusing a committed `debug.keystore` so updates
install over old ones), and publishes it to a `latest` GitHub Release.

## 2. v3 architectural changes

None of the above changes structurally. v3 is additive:

- **New UI primitives, each in one clear place**: a bottom-sheet quick-
  action component and a progressive-disclosure ("More details" expand)
  pattern both belong in `views.js`/`detail.js` following the existing
  convention (a small builder function returning an HTML string + a bind
  function wiring its interactive elements, same shape as `row()`/`bind()`
  today).
- **Quick-add** is a new entry point into the existing `openAdd()` flow in
  `detail.js`, not a parallel data path — it should resolve to the same
  `S.custom.push(I(...))` / `S.u[id]=...` writes the current Add form uses,
  so there is exactly one way component data gets created.
- **Design tokens formalized**: `css/style.css`'s existing `:root` custom
  properties (`--bg`, `--card`, `--line`, `--ink`/`--ink2`/`--ink3`,
  `--blue`, `--green`, `--amber`, `--red`, `--r`, `--shadow`) are the
  system already — v3 documents them properly (`DESIGN-SYSTEM.md`) and
  adds the missing pieces (a type scale, a spacing scale) as new tokens in
  the same block, rather than introducing a second styling system.

## 3. Data model reference

```js
// js/catalog.js
I(i, n, c, l, s, p, q, w, d, t) // id, name, category, level, symbol-key,
                                 // price(unused post-v2), qty, why-text,
                                 // desc/spec, tags
CATALOG = [I(...), I(...), ...] // ~250 built-in entries

// js/store.js — runtime state, not persisted directly (see below)
S = {
  u: {},          // per-item user data, keyed by item id: {st, qty, cond, tested, loc, project}
  custom: [],      // user-added items, same shape as CATALOG entries
  photos: {},      // item id -> data URL, loaded lazily after first paint
  projects: [],    // [{id, name, status, parts:[{id,q}], notes}]
  view: 'home',
  f: {cat:'', q:''}, // active category filter / search query
  theme: 'system',
}
```

IndexedDB keys (`bench2` → `kv` store): `u`, `custom`, `proj`, `pix`
(photo id index), `p:<id>` (individual photo blobs), `theme`, `onboarded`.
Any new v3 persisted setting follows this same flat key pattern — no need
for a second store or a schema migration system at this scale.

## 4. Constraints (unchanged from v1/v2, still binding)

- No local Android SDK/emulator in the dev environment — Capacitor-only
  behavior (back button, haptics, splash, real icon rendering) can only be
  verified after a real GitHub Actions build + on-device install. Every v3
  feature that touches a Capacitor plugin must be flagged in its PR as
  "verified in browser" vs. "needs on-device check," same convention used
  since the back-button fix.
- Debug-signed APK only, sideloaded — no Play Store constraints apply, but
  also no Play Store distribution features (staged rollout, crash
  reporting dashboards, etc.) are available; don't design around them.
- Single developer, single user — architecture choices should optimize for
  "easy to change next month," not "scales to a team."

## 5. Testing strategy

See `TEST-PLAN.md`. Summary: everything that's pure HTML/CSS/JS gets
verified locally via a temporary test harness page served over
`python3 -m http.server` and driven with headless Chrome (`--dump-dom`,
synthetic `PointerEvent`s for gestures, `--screenshot` for visual
sanity-checks) before every commit — this has been the working pattern
since the v2 restructure and continues unchanged into v3. Capacitor-native
behavior is verified on-device after merging to `main`.
