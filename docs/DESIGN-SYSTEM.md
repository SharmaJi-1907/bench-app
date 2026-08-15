# Bench — Design System (v3)

This codifies the design research done for v3 (Things 3, Linear, Notion,
Todoist, Spotify, Revolut, Apple's native apps, and current 2025-2026
mobile design trend reporting) into concrete, checkable rules for this
specific codebase. The guiding principle, taken directly from what's
actually winning design awards right now: **restraint and consistency beat
visual maximalism.** Things 3 and Linear are the two closest reference
points — both are small, functional, single-accent-color apps that win on
doing one thing with unusual polish, which is exactly Bench's situation.

## Color

Defined as CSS custom properties in `css/style.css` `:root` (light) with
dark overrides via `@media(prefers-color-scheme:dark)` and an explicit
`[data-theme]` override — this structure is correct as-is, keep it.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | page background | `#F6F7F9` | `#0F1115` |
| `--card` | card/surface background | `#FFFFFF` | `#1A1D23` |
| `--line` | borders/dividers | `#E3E6EB` | `#2A2E36` |
| `--ink` | primary text | `#1A1D23` | `#F2F4F7` |
| `--ink2` | secondary text | `#6B7280` | `#9AA1AC` |
| `--ink3` | tertiary text | `#9AA1AC` | `#6B7280` |
| `--blue` | the one accent color | `#2563EB` | `#4C86FF` |
| `--green`/`--red`/`--amber` | functional status only (have/damaged/warn) | see file | see file |
| `--shadow` | card elevation | soft shadow | `none` |

Rule (Linear/Things 3): **one accent color** (`--blue`) used for
interactive/selected state. `--green`/`--red`/`--amber` are **status
colors only** (tag a condition/state) — never used decoratively, never
used for a 4th "brand" hue. This is already true in the codebase; v3 must
not add new hues casually. If a new status is ever needed, reuse one of
these four before introducing a fifth.

Explicitly rejected for this project (see research): wallpaper-derived
dynamic color (Material You — OS-level, not available to a Capacitor web
view), gradients/glass effects, decorative use of status colors.

## Typography

Bench currently uses the system font stack
(`system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`) at ad-hoc sizes
per element. v3 formalizes a fixed scale — every new/touched screen must
use one of these, not a one-off size:

| Token | Size | Weight | Used for |
|---|---|---|---|
| `--fs-hero` | 40px | 800 | Home's big number (`.total .amt`) |
| `--fs-title` | 20px | 800 | Header wordmark ("Bench") |
| `--fs-heading` | 16px | 700 | Sheet titles |
| `--fs-label` | 13px | 700 | Section headers (`h2`), field labels |
| `--fs-body` | 15px | 600 | Card titles, buttons |
| `--fs-meta` | 12.5–13px | 500-600 | Tags, secondary line under a title |
| `--fs-caption` | 11px | 500-600 | Tile captions, small print |

This mirrors the Spotify/Revolut research finding: hierarchy comes from
**size and weight jumps**, not color or borders. The one number that
matters most on a screen (a stock count, an item total) should always be
`--fs-hero`; nothing else on that screen should compete with it.

## Spacing

Existing implicit scale, make it explicit: **4 / 8 / 12 / 16 / 20 / 24px**
steps. Card padding is 10-14px, section gaps (`h2` margin) are 26px top /
10px bottom (set in v2's polish pass) — keep using multiples of 4 for any
new spacing rather than arbitrary values.

## Chrome recession (Linear pattern)

The bottom nav and header should visually recede relative to card content
— content is what the user came to look at, chrome is just how they get
there. Concretely: nav/header keep `--card` background and `--line`
borders (already true), never get elevated with a shadow the way content
cards do, and icon/text contrast in nav uses `--ink3` for inactive state
(already true) — this rule is mostly already followed; v3 must not
regress it by, e.g., adding a shadow to the nav bar for "consistency" with
cards. Nav and cards are deliberately different visual weights.

## Iconography

Rule established in v2, extend it everywhere in v3: **outline by default,
filled only on the active/selected state.** Bottom nav already does this
(`js/views.js` `NAV` array has both an outline and filled path per icon,
swapped by `drawNav()`). Any new place with an active/inactive icon state
(e.g. a category filter, a view-toggle) follows the same two-variant
pattern, not a single icon with a color change.

Hand-drawn SVG icon style (icons.js) stays as-is — no 3D/skeuomorphic
icons, no duotone. This was a deliberate research-informed rejection:
Airbnb's tactile 3D icon direction is built for a large consumer app with
a design team, and doesn't fit a dense, functional inventory tool.

## Components

**Card** (`.row`, `.total`, `.tile`, `.list`, `.hero`, `.pinbox`): `--card`
background, `--line` 1px border, `var(--shadow)` (soft in light mode, none
in dark), `var(--r)` (12px) corner radius. One card = one unit of
information; a card never has more than one primary tappable action at
equal visual weight to its main content (Uber rule: one primary action per
screen/unit).

**Sheet** (bottom sheet, used for detail/add/more/project screens):
slides up via `transform`, not `display:none`/`block` (v2 fix, keep it).
New in v3: **quick-action bottom sheets** for lightweight interactions
(adjusting quantity/status from a card) should be shorter/lighter-weight
than the existing full-screen detail sheets — same slide-up mechanic,
smaller content, dismiss-on-outside-tap.

**Progressive disclosure** (new in v3): item detail sheet shows name,
photo, status, and quantity by default. Datasheet link, supplier, notes,
and the pin diagram move behind a single "More details" expand/collapse —
Notion's pattern, applied to keep the primary card from feeling dense.

**Empty state**: icon badge (reusing `.thumb`-style container, established
in v2) + one-line message explaining *why* it's empty + one clear action
button. Every empty state in the app follows this exact shape — no bare
text-only empty states going forward.

**Swipe row**: swipe-to-reveal a single action (already implemented:
remove-from-stock, mark-bought). Research flags swipe-only actions as an
accessibility gap — any new swipe action must also be reachable a second
way (e.g. from the item's own detail sheet), never swipe-exclusive.

## Motion

150–250ms, ease-out, and always tied to a real state change (something
appeared/disappeared/updated) — never decorative bounce/spring. This is a
direct reaction to the research finding that even Apple's Liquid Glass
redesign drew criticism for motion/effects prioritized over clarity.
Existing sheet slide-up and swipe-row transitions already follow this;
keep new transitions in the same range.

## Haptics

Small, fixed vocabulary — do not expand this list per-feature:
- **Light impact**: confirmations (status change, save, mark bought) —
  already wired in v2.
- One additional case worth adding in v3, following the Things 3 checkmark
  pattern: a haptic exactly at the moment quick-add successfully creates
  an item — the single most common "did that work?" moment in the app.

No haptic on navigation (switching tabs, opening a sheet) — reserved for
actions that change data, matching the research finding that apps
overusing haptics are increasingly criticized for it.
