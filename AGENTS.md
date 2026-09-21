# Working agreement

How work is done on this repo. Applies to any agent or assistant working here,
and to any human picking the project up.

---

## 1. Discuss before building

Agree on paper first. Code only on an explicit go-ahead.

The reason is concrete: earlier rounds were built straight from short
instructions, and one whole pass (the design-token work) was deliberately
layout-preserving — so after a lot of building it looked unchanged, because the
intent had never been pinned down. Agreeing first avoids spending effort on the
wrong thing.

Writing to the planning documents in `docs/` is the exception — that *is* the
deliverable while discussing, and needs no separate permission.

## 2. Plans live in `docs/`

| File | Holds |
|---|---|
| `docs/v4-plan.md` | The current round's work order, in phases |
| `docs/update.md` | The v3 round's record, and why each thing was done |
| `docs/future_update.md` | Ideas not agreed and not scheduled |
| `docs/taxonomy-draft.md` | Superseded category draft, kept for the reasoning |
| `docs/PRD.md`, `TRD.md`, `DESIGN-SYSTEM.md`, `TEST-PLAN.md` | Standing reference |

When a decision changes, **correct the document that is now wrong.** Stale plans
that contradict the code are worse than no plans — this has already happened
once, where `update.md` claimed nothing was built long after five of six issues
had shipped.

## 3. Work one phase at a time, in order

Phases are sequential. Do not start a later phase because it looks easier, and
do not bundle two phases into one pass. Each phase in `docs/v4-plan.md` carries
its own verification list and is not done until that list passes.

## 4. The loop for each phase

1. **Read** the phase in the plan.
2. **Break it into finer tasks** — one behaviour per task, small enough to
   verify individually.
3. **Research and analyse** before editing. Confirm the root cause in the actual
   code; cite `file:line`. Never fix from a guess or from memory of how the code
   used to work.
4. **Check the surrounding code** for the same fault elsewhere. Faults here have
   repeatedly been systemic rather than local — one missing `esc()` implied
   others; one scroll reset affected every sheet.
5. **Fix**, as narrowly as the task allows.
6. **Test** — and make the test real. See §6.
7. **Validate and verify** against the phase's verification list in the plan.
8. **Show it working** in a live browser view, for confirmation, before the
   phase is called done.

## 5. Git is the owner's job

**Do not run any git command that changes state.** No `add`, no `commit`, no
`checkout`, no branch creation, and above all no `push`. Read-only inspection
(`git status`, `git log`, `git diff`) is fine.

When work is ready, **hand over copy-pasteable commit commands** instead:

- One commit per logical change. Not one large commit, and not artificial
  splits to inflate the count — if it is three commits, say three.
- Messages explain *why*, not just what.
- End each message with the Claude co-author attribution line.

The owner reviews everything and controls history and what reaches the remote.

## 6. Testing rules that have already caught real bugs

- **Test in the APK, not only in a browser.** The backup export worked
  perfectly in a desktop browser and produced no file at all on the phone,
  while still showing "Backup saved". A browser-only test would never find it.
- **Use real timing when checking that something saves.** Chrome's headless
  virtual-time mode makes IndexedDB writes hang, so tests can pass while
  nothing was written. See `docs/TEST-PLAN.md`.
- **The build must copy `assets/` into `www/`.** Without it, photos work in a
  browser and are broken on the phone.

## 7. Data safety is not optional

User data lives only on the phone. There is no server copy and no second copy
anywhere.

- Any change to how a record is stored needs a **migration that runs on
  startup, before the first render** — idempotent and lossless. `migrateUnits()`
  in `js/store.js` is the pattern to follow.
- Never change a catalogue row's `i` or `n`. Saved user data keys off `i`, and
  `js/photos.js` maps photos by `i`. Categories, symbols and text may change
  freely.
- Before any large data change, make sure backup and restore actually work
  first. This is why backup integrity is Phase 1 of the v4 plan and the signing
  change is Phase 2 — the signing change forces a reinstall, which erases data.

## 8. Scope discipline

Fix what was asked. No surrounding cleanup, no speculative abstraction, no
features that were not agreed. The app deliberately has no build step, no
framework and no runtime dependencies — adding one is a decision to be
discussed, not a convenience to be taken.
