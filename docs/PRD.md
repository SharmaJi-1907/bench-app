# Bench — Product Requirements (v3)

## 1. What Bench is

Bench is a personal, offline, single-user Android app for tracking
electronic components: what you own, what you still need, and the projects
you're building with them. It runs entirely on-device (IndexedDB storage,
no server, no account, no sync) and installs as a debug-signed APK built by
GitHub Actions from this repo.

v1 was a single 1358-line `index.html`. v2 split it into `css/`+`js/`
modules, fixed a real Android navigation bug, added dark mode, removed cost
tracking, and did a first visual redesign pass (gear icon, wordmark, swipe
actions, haptics, custom icon/splash). v3's job is to take everything
learned from that process — plus the design research done on Things 3,
Linear, Notion, Todoist, and others (see `DESIGN-SYSTEM.md`) — and turn
Bench into something that feels like a finished, considered product rather
than a series of patches.

## 2. Who it's for

One user: a hobbyist who owns and uses this app themselves, on one phone.
This shapes every decision below — Bench does not need accounts, multi-user
sync, a Play Store release, or enterprise-grade abstraction. Building for
an imaginary team or imaginary scale would be a mistake here.

## 3. v3 goals

Ranked by what actually moves the product forward, informed by the
research finding that the best-regarded apps right now win on **restraint
and consistency**, not visual maximalism:

1. **One coherent design system**, applied everywhere — not per-screen
   one-off styling. Concretely: a fixed type scale, a fixed spacing scale,
   nav/chrome that recedes so content has visual priority (Linear), and a
   small functional color vocabulary (Things 3).
2. **Faster core workflows** — adding a part is the single most common
   action in this app and still requires opening a full form.
3. **Less clutter per screen** — secondary metadata (datasheet, supplier,
   notes) hidden behind a tap instead of always visible (Notion-style
   progressive disclosure).
4. **Native-feeling interaction** — bottom sheets for quick actions instead
   of always navigating away; a consistent, restrained haptic vocabulary
   instead of buzzing on everything.
5. **Modular, maintainable code** — the codebase should make it obvious
   where a given piece of UI or logic lives, so future changes (v4, v5,
   ...) are additions, not archaeology.

## 4. Feature scope

### Must have (v3 ships with these)
- Formal design system (tokens + component rules) applied consistently
  across every screen — see `DESIGN-SYSTEM.md`.
- Quick-add: a fast, typing-first way to add/adjust a component without
  opening the full Add form for the common case.
- Progressive disclosure on the item detail sheet: primary info (name,
  photo, status, quantity) always visible; secondary info (datasheet link,
  supplier, notes, pin diagram) behind a single "More details" expand.
- Bottom-sheet quick actions: adjusting quantity or status from a part card
  without leaving the current screen.
- Outline-by-default / filled-on-active iconography, applied consistently
  (nav already does this as of v2 — extend the same rule to category icons
  and anywhere else an active/inactive state exists).
- Empty states everywhere follow one pattern: short empathetic line + one
  clear action button, in Bench's existing hand-drawn icon style.
- A written, current design system doc, test plan, and this PRD/TRD kept up
  to date as the source of truth for future changes.

### Should have (do if time allows within v3)
- Catalog view toggle: list view (current) vs. a photo-grid view, for
  scanning by appearance instead of name.
- A short, dismissible first-run tips affordance beyond the existing
  one-time welcome sheet (e.g. a "you can swipe rows" hint shown once).

### Could have (explicitly deferred, not in v3 scope)
- Natural-language parsing for quick-add (e.g. "10x 220Ω resistor
  #passives" auto-parsed). The quick-add *entry point* is in scope; full
  NLP parsing is a v4 candidate.
- Adaptive/time-of-day dark mode.
- Sparkline-style trend visuals (deferred — Bench dropped cost tracking in
  v2, so there is currently no time-series numeric data worth visualizing;
  revisit only if a new trackable metric is added).

### Won't have (out of scope, don't build)
- Accounts, sign-in, or any cloud sync — this is a one-user, on-device app
  by design.
- Multi-view flexibility à la Airtable (kanban/calendar/etc.) — overkill
  for a personal tracker; the list/grid toggle above covers the real need.
- 3D/skeuomorphic icons, glassmorphism/heavy blur, or wallpaper-derived
  dynamic color — consumer-app/OS-team patterns that don't fit a small,
  single-developer utility tool (see `DESIGN-SYSTEM.md` for why these were
  explicitly rejected).
- A Play Store release / production keystore — this stays a sideloaded
  debug-signed APK unless the user asks for that separately.

## 5. Success criteria

v3 is done when:
- Every screen visibly follows the same type scale, spacing scale, and
  color rules (spot-checkable against `DESIGN-SYSTEM.md`, not vibes-based).
- Adding a component takes meaningfully fewer taps than the current full
  Add form for the common case.
- No screen shows more than one primary action at equal visual weight.
- The full regression pass in `TEST-PLAN.md` is green, and the on-device
  checklist has been walked through on a real build.
