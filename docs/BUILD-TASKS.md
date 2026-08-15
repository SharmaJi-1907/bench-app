# Bench v3 — Detailed Build Task Order

Execution plan for `version_3`. Tasks are ordered so each one is verifiable
on its own and nothing depends on work that hasn't landed yet. Every task
lists: what changes, how to verify it, and the edge cases that must be
checked before it counts as done.

**Ground rules for every task**
- One task = one commit (or a tight group), verified before moving on.
- Verify locally per `TEST-PLAN.md` (headless Chrome harness) *before*
  committing; delete any `_test.html` / `_shot*.html` scratch files first.
- Anything touching a Capacitor plugin is "browser-verified" only — it must
  be listed in the PR as needing an on-device check.
- Never regress the v2 fixes: no price/₹ anywhere, back-button still
  closes sheets, nav chrome stays visually recessive.

---

## Task 1 — Ship the component photos (in progress)

**Goal**: real photos on the item detail page; hand-drawn icons stay in
list/catalog views.

**1a. Finish sourcing + processing**
- `assets/raw_images/<id>.<ext>` — originals from Wikimedia Commons.
- `python3 scripts/process_images.py` → `assets/processed_images/<id>.jpg`
  (square, white-letterboxed, 800px, optimized JPEG).
- `python3 scripts/build_photo_manifest.py` → generates `js/photos.js`
  exposing `STOCK_PHOTOS` (a Set of ids) and `stockPhoto(id)`.

**1b. Wire into the app**
- `index.html`: add `<script src="js/photos.js">` **before** `js/detail.js`
  (load order matters — plain scripts, shared global scope, per TRD §1).
- `js/detail.js` `open()` — the hero currently branches user-photo vs
  hand-drawn art. New precedence:
  1. user camera photo (`S.photos[id]`) — always wins
  2. bundled stock photo (`stockPhoto(id)`)
  3. hand-drawn `art(it)` — unchanged fallback
- List/grid views (`row()`, `thumb()`) are **unchanged** — icons stay there
  by explicit design decision.

**1c. Build workflow — REQUIRED, do not skip**
`.github/workflows/build-apk.yml` copies `css/` and `js/` into `www/` but
**not `assets/`**. Without a fix, every stock photo 404s *on device only* —
local testing serves from the repo root and passes, so this failure is
invisible until the APK is installed. Add:
```
cp -r assets www/assets
```
(The existing `@capacitor/assets` icon/splash step reads `assets/*.svg`
from the repo root and is unaffected.)

**Verification**
- Manifest count matches `ls assets/processed_images/*.jpg | wc -l`.
- Detail sheet renders a photo for an id that has one; renders hand-drawn
  art for one that doesn't; no broken-image icon in either case.
- List/catalog rows still show icons, not photos.
- Grep the built `www/` in CI logs (or assert locally) that
  `www/assets/processed_images/` is non-empty.

**Edge cases**
- **User photo + stock photo both exist** → user photo wins.
- **User deletes their camera photo** → must fall back to the stock photo,
  not to blank. (`delPhoto()` → re-render → precedence re-evaluated.)
- **User-added custom items** (`u_` ids) never have stock photos → must
  land on hand-drawn art cleanly.
- **Manifest/file drift** (id listed but file missing) → add an `onerror`
  on the `<img>` that swaps in the hand-drawn art, so a stale manifest
  degrades instead of showing a broken image.
- **Backup/export**: stock photos live in the bundle, not `S.photos`, so
  they must NOT be written into the export JSON (would bloat it and
  duplicate bundled data). Confirm export size is unchanged by this task.
- **Offline**: images are bundled in the APK, so no network dependency —
  confirm by airplane-mode check on device.
- **APK size**: ~19MB of images at 800px. If the installed size is
  objectionable, re-run processing at `--size 600` (roughly halves it)
  rather than dropping photos.

---

## Task 2 — Design tokens (`DESIGN-SYSTEM.md` §Typography/Spacing)

Add `--fs-*` and spacing tokens to `:root` in `css/style.css`, then sweep
existing screens to use them instead of one-off `font-size` values.

**Verification**: screenshot Home / Stock / detail in **both** light and
dark before & after — layout must be visually unchanged except where a
size was deliberately corrected. Pure-CSS task, so no JS regression risk.

**Edge cases**
- Long component names must still ellipsize, not overflow (`.sheet-top .t`,
  `.info .nm`).
- Dark mode tokens must not be forgotten — check both themes.
- Don't let the hero number (`.total .amt`) shrink below the "one dominant
  number per screen" rule.

---

## Task 3 — Progressive disclosure on item detail

Keep name / photo / status / quantity always visible; move datasheet link,
supplier, notes, and pin diagram behind one "More details" expand.

**Verification**: detail sheet opens, expand toggles, edits still save,
delete still works. Re-run the full regression checklist — `open()` is the
most heavily-used sheet in the app.

**Edge cases**
- Expand state must reset when opening a *different* item (no leaking of
  the previous item's open/closed state).
- Items with **no** secondary data (no notes, no pinout) should not show an
  expand control that opens to nothing.
- The pin diagram (`pinout()`) only exists for some parts — must not throw
  when absent.
- Editing a field inside the collapsed section then re-rendering must not
  silently collapse and lose focus mid-typing.

---

## Task 4 — Quick-action bottom sheet

A lightweight sheet to change quantity/status straight from a card, without
the full detail sheet.

**Verification**: opens from a row, adjusts data, dismisses; underlying
list re-renders with the new value.

**Edge cases**
- Must not conflict with the existing **swipe** gesture on the same row
  (swipe-to-reveal vs open-quick-sheet) — pick a non-colliding trigger and
  verify a swipe still swipes.
- Dismiss on outside tap **and** on Android back button (back handling
  lives in `js/main.js` — it currently only knows about `#sheet`; a second
  sheet element needs adding to that logic or it will exit the app).
- Quantity floor: never allow negative.
- Setting status from the quick sheet must write through the same
  `S.u[id]` + `save()` path as the detail sheet (one data path only).

---

## Task 5 — Quick-add entry point

Faster path to add a component; must resolve to the same
`I(...)` / `S.custom.push` / `S.u[id]` writes as `openAdd()` (TRD §2).
Natural-language parsing stays **out of scope** (PRD §4 Could-have).

**Verification**: add via quick-add, confirm the item appears in All +
Stock, persists across reload, and is byte-identical in shape to an item
added the old way.

**Edge cases**
- Empty/whitespace-only name → rejected with a toast, no ghost item.
- Duplicate name → allowed (ids are unique), but must not collide.
- Rapid double-submit → must not create two items (`Date.now()` ids can
  collide within the same millisecond).
- Haptic fires once on success (per `DESIGN-SYSTEM.md` haptics vocabulary).

---

## Task 6 — Catalog list/grid view toggle

Photo-grid vs list on the All-items screen (PRD §4 Should-have).

**Verification**: toggle switches layout, persists across re-render, and
search/category filters still apply in both modes.

**Edge cases**
- Grid mode with **no** photos available → must look intentional (icons in
  a grid), not broken.
- Toggle state should persist like `theme` (same flat `dbSet` key pattern).
- Filter + toggle together: switching view must not clear the active
  search query or category chip.

---

## Task 7 — Icon + empty-state consistency sweep

Apply outline-default / filled-on-active everywhere an active state exists
(beyond nav); confirm every empty state matches the single pattern.

**Verification**: visually diff each screen's empty state; confirm active
chips/toggles use the two-variant icon pattern, not a color-only change.

**Edge cases**
- Empty states must render correctly in dark mode (icon badge contrast).
- "No results" (filtered to zero) is a *different* state from "nothing
  added yet" — both need correct, non-identical copy.

---

## Task 8 — Full regression + release

1. Complete `TEST-PLAN.md` checklist, both themes, empty and populated.
2. Confirm no scratch files; `git status` shows only intended changes.
3. Open PR `version_3` → `main` with an explicit on-device checklist:
   - back button (incl. the new quick-action sheet) closes rather than exits
   - stock photos actually appear (this is the `www/assets` copy fix)
   - app icon + splash still correct
   - haptics fire on status change / quick-add
   - APK size acceptable after ~19MB of images

**Rollback note**: `prototype` branch holds pre-v2 `main` if a full revert
is ever needed.
