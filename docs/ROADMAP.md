# Bench v3 — Build Roadmap

Step-by-step plan for turning the PRD/TRD/design system into actual
changes on `version_3`. Each phase should be its own commit (or small
group of commits), verified per `TEST-PLAN.md` before moving to the next —
same incremental, verify-then-commit rhythm used throughout v2.

## Phase 1 — Design system foundation
Add the missing typography/spacing tokens from `DESIGN-SYSTEM.md` to
`css/style.css`'s `:root` block. Sweep existing screens to use the new
`--fs-*` tokens instead of one-off `font-size` values, without changing
any layout logic. This is the lowest-risk phase (pure CSS) and makes every
later phase easier to keep consistent.

## Phase 2 — Progressive disclosure on item detail
In `js/detail.js` `open()`: keep name/photo/status/quantity always
visible, move datasheet/supplier/notes/pin-diagram behind a single "More
details" expand. Verify the detail sheet still opens/saves/deletes
correctly with the new structure.

## Phase 3 — Quick-action bottom sheets
A lighter-weight sheet (per `DESIGN-SYSTEM.md`'s "quick-action bottom
sheet" spec) for adjusting quantity/status directly from a card, without
opening the full detail sheet. Wire from a long-press or a small affordance
on `.row` — decide the exact trigger during implementation and note it
here once built.

## Phase 4 — Quick-add entry point
A fast add path in `js/detail.js` that still resolves through the same
`I(...)`/`S.custom.push`/`S.u[id]=...` writes `openAdd()` already uses (per
TRD §2 — one data path, not two). Full natural-language parsing is
explicitly deferred (PRD §4, Could have) — v3's quick-add can start as a
shorter, faster form.

## Phase 5 — Catalog view toggle
List view (current) vs. photo-grid view on the All-items screen, per PRD
§4 Should-have. Reuses existing `thumb()`/`art()` rendering — this is a
layout-mode toggle, not a new data path.

## Phase 6 — Icon/empty-state consistency sweep
Apply the outline/filled-on-active icon rule everywhere an active state
exists beyond nav (category chips, any new view toggle from Phase 5).
Confirm every empty state in the app matches the one pattern in
`DESIGN-SYSTEM.md`.

## Phase 7 — Full regression + on-device verification
Run the complete `TEST-PLAN.md` checklist. Merge `version_3` toward `main`
(or open a PR, per the user's preference established in v2) with a
description listing what needs on-device confirmation.

## Explicitly not in this roadmap
Anything in PRD §4 "Could have" or "Won't have" — natural-language
quick-add parsing, adaptive dark mode, trend visualizations, accounts/sync,
multi-view (kanban/calendar), 3D iconography, Play Store release. Don't
pull these forward without updating the PRD first.
