# Bench — future update

Ideas for the next round, after the six issues in [update.md](update.md).
**Nothing here is built, and nothing here is agreed.** Same working rule as
before: discuss and settle first, code only on an explicit go-ahead.

---

## Where these came from

You pointed at [techpanda-inventory](https://github.com/arslansadiq87/techpanda-inventory)
and asked what that app does that Bench does not.

That repo ships no source — only a README, an Android APK and a Windows
installer — so this list comes from reading the APK itself. It is a Flutter
app, roughly 60 MB, built around a small-shop stock system: dashboard,
components, stock movements, projects, reports, settings, and a login.

He has thirteen or so things Bench lacks. **Four of them are worth taking.**
The rest are listed at the bottom with the reason for skipping them, so this
does not get re-litigated later.

---

## ▶ OPEN — needs your decision

Nothing below is settled. Each item has a **Worth deciding** section; those
are the questions to answer before any of it is built.

| # | Item | Size | My recommendation |
|---|---|---|---|
| 1 | Low-stock warning | Small | **Do it.** Cheapest of the four, and Home already has the place to show it. |
| 2 | Stock movement history | Medium | **Do it, cut down.** Single-part entries only, not his multi-part movements. |
| 3 | Real location list | Medium | **Do it.** Makes an existing field actually useful. |
| 4 | CSV / PDF export | Medium–large | **CSV yes, PDF is the question.** See the cost note. |

Suggested order: **1 → 3 → 2 → 4**. Reason in [Suggested order](#suggested-order).

---

## Item 1 — Low-stock warning

### What it is
Each part gets a **minimum quantity** you set yourself. When you drop to or
below it, the part is flagged **Low stock**. At zero it is **Out of stock**.

### Why it is worth doing
Right now Bench can tell you what you *have* and what you *need to buy*, but
nothing connects the two. You find out you are down to your last 1N4148 when
you reach for the second one. This closes that gap without you having to
remember to move anything to the buy list by hand.

It is also the cheapest of the four by a wide margin. Home already has the
exact place to show it — `vHome()` in `js/views.js:355` renders a **"Check
these"** block whenever `sums().untested` or `sums().bad` is non-zero:

```js
${(s.untested||s.bad)?`<h2>Check these</h2> …`:''}
```

A third line slots straight in beside those two. No new screen, no new
navigation, no layout work.

### How it would work
- One new optional field on the unit record: `min` (a number, absent = no
  warning). It lives next to `qty` in `S.u[id]`, so nothing needs migrating —
  a record without `min` simply never warns.
- `sums()` in `js/store.js:174` gains a `low` count alongside `bad` and
  `untested`, using the same loop.
- Set it on the component's own page, in the same edit block as **Quantity**
  and **Kept in**.
- The Stock list shows a small **Low** marker on the affected rows.

### What it costs
Small. `js/store.js` (one field, one counter), `js/views.js` (one Home line,
one row marker), `js/detail.js` (one input). No data migration, no new
storage keys.

### Worth deciding
- **Default minimum?** I would say **none** — no part warns until you set one.
  Guessing a default across 253 wildly different parts (one oscilloscope vs
  600 resistors) would produce noise on day one, and noise gets ignored.
- **Should Low stock auto-add to the buy list?** I would say **no, not
  silently.** Flag it, and let the "Check these" line be tappable so you can
  move it over deliberately. Silent list-stuffing is how a list stops being
  trusted.
- **One threshold, or a percentage?** One plain number. Percentages of a
  600-piece resistor kit are meaningless.

---

## Item 2 — Stock movement history

### What it is
A record of stock *changes* over time, instead of only the current number.
"Took 3 out on 14 Aug for the clock build. 2 left."

### Why it is worth doing
This is the one thing Bench forgets forever. Today, changing the quantity
stepper from 5 to 2 overwrites the 5 — there is no trace that it was ever 5,
when it changed, or why. Every other kind of "where did my parts go" question
is unanswerable.

It is also the piece that makes Item 1 smarter later: with history you can
say *"you get through these"*, not just *"you are low"*.

### How it would work — the cut-down version
His app records a full **movement**: a transaction code, several components in
one entry, opening quantity, before, after, delta, notes, and edit/delete of
the whole movement. That is a receiving dock unpacking a delivery. It is not
your desk.

What I would build instead:

- Every write that changes `qty` or the condition counts appends one entry:
  `{t: timestamp, id, from, to, why}`.
- `why` is optional and picked from a very short list — **used in a project**,
  **bought more**, **broke**, **correction** — plus a free-text note if you
  want one. Never required; leaving it blank is fine.
- The component's own page grows a **History** section under "More details",
  newest first.
- Stored under one new flat key (`hist`), same pattern as `u` / `custom` /
  `proj`. The backup in `js/io.js:29` bumps to `v:3` and carries it.

### What it costs
Medium, and the real cost is **storage discipline**, not code. An unbounded
log grows forever on a phone. It needs a cap decided up front — my suggestion
is **keep the last 40 entries per part**, dropping the oldest. That is more
than enough to answer "when did I last use these" and can never run away.

Files: `js/store.js` (the log + the cap), `js/detail.js` (the History block
and the reason picker), `js/io.js` (backup version bump).

### Worth deciding
- **40 entries per part** — right, too many, too few?
- **Is the reason picker worth it,** or is date + quantity enough? The picker
  is what makes history readable a year later, but it adds a tap to every
  quantity change. It could be optional and skippable.
- **Should project use auto-log?** When you mark a project built and it
  consumes parts, that is the most valuable entry of all — and the one you
  are least likely to write by hand.
- **Editing history.** His app lets you edit and delete past movements. I would
  say **no** — a log you can rewrite is not a log. Corrections get added as
  new entries.

---

## Item 3 — Real location list

### What it is
"Kept in" becomes a managed list you pick from, instead of a text box you
retype every time.

### Why it is worth doing
The field already exists and is already half-broken. In `js/detail.js:288`:

```js
<div><label class="f">Kept in</label><input class="f" id="loc" value="…" placeholder="Box A"></div>
```

It is free text. Type `Box A` on one part and `box a` on another and Bench
treats them as two unrelated places. `js/views.js:118` prints it on the row,
but nothing groups by it, filters by it, or can answer **"what is in Box A?"**
— which is the only question the field exists to answer.

His app models this properly: an editable location list, a *Cabinet / rack*
and a *Bin / compartment*, filtering by location, and an explicit "No
location". That part he got right.

### How it would work
- A `locs` list stored under its own flat key, edited from Settings
  (**Settings → My data → Locations**, next to the existing controls).
- "Kept in" becomes a picker with a **+ New location** option, so adding one
  mid-edit does not break your flow.
- A new filter on the Stock tab: **All locations / Box A / … / No location**.
- Existing typed values get folded in on first run: collect every distinct
  `loc` string already in `S.u`, case-insensitively, and seed the list from
  them. Nothing is lost and nothing needs retyping.

### What it costs
Medium. `js/store.js` (the list + the one-time fold-in), `js/detail.js` (the
picker), `js/views.js` (the filter). The fold-in is the fiddly part and must
be idempotent, same as the Issue 4 migration.

### Worth deciding
- **Two levels (cabinet → bin) or one flat list?** He uses two. I would start
  **flat** — "Drawer 3" is one string, and two levels is another tree to
  maintain right after we finish arguing about the category tree. Easy to
  deepen later if a flat list gets long.
- **Can a part be in two places?** I would say **no.** One part, one home.

---

## Item 4 — CSV / PDF export

### What it is
Export your inventory as a spreadsheet, and as a printable document.

### Why it is worth doing
Bench already has backup and restore (`doExport()` / `doImport()` in
`js/io.js:28`), but the file is machine JSON:

```js
const d={v:2,at:new Date().toISOString(),u:S.u,custom:S.custom,photos:S.photos};
```

That is a restore file, not something you can read, sort, print or send to
anyone. And `copyList()` only copies the buy list as plain text.

A CSV opens in any spreadsheet. A PDF is something you print and tape inside
the cabinet door.

### How it would work
- **CSV** — one row per owned part: name, category, quantity, working,
  damaged, needs repair, location, tested, notes. Built as a plain string and
  handed to the same download path `doExport()` already uses. Small, no
  dependencies.
- **PDF** — a printable inventory grouped by category, optionally with the
  thumbnails.

### What it costs
**CSV is small.** Under an hour, no new dependencies, reuses the existing
download code.

**PDF is the expensive one, and this is the part to think hardest about.**
Bench is a plain-`<script>` app with no build step and no libraries — that is
deliberate and it is why the whole thing stays small. A real PDF library
(his app bundles `dart_pdf`) would be the first dependency Bench has ever
had, and would push the APK up for a feature used rarely.

There is a cheaper route: generate a clean printable HTML page and use the
browser's own **Print → Save as PDF**. Zero dependencies, and on Android the
system print dialog produces a real PDF. It gives up fine control over page
breaks and margins.

### Worth deciding
- **CSV first, on its own?** I would say yes — it is a fraction of the work
  and probably covers most of what you actually want.
- **PDF via print-to-PDF, or a bundled library?** I strongly prefer
  **print-to-PDF**, for the size reason above. Worth confirming it behaves on
  your phone before committing either way.
- **Photos in the export?** They are what makes his PDF nice and also what
  makes it enormous. Suggest a checkbox, default **off**.
- **What about projects?** He exports a per-project parts list as PDF. That is
  genuinely useful — a printed shopping list for one build. Worth folding into
  the same work rather than doing it twice.

---

## Deliberately not taking

Recorded so the reasoning is not lost.

| His feature | Why not |
|---|---|
| **Login + local admin password** | It is your own phone. A lock screen on a personal parts drawer is friction with no threat behind it. |
| **Permission toggles** (enable add / enable edit / show delete actions) | Same reason — those exist so a shop owner can hand a phone to staff. |
| **Auto inventory codes** (`code_prefix` + generated code) | For a stockroom with printed labels. Your parts are identified by what they are. |
| **User-uploaded SVG icons per type** | His app ships no icons, so users must supply their own. Bench has 64 hand-drawn ones covering all 253 parts — that is the better position, not the worse one. |
| **Dashboard greeting + big number tiles** | Bench already has pinned parts and the category chart, which are more useful on a personal bench than a count of "total products". |
| **Windows desktop build** | Out of scope. Bench is an Android app. |
| **Archive instead of delete** | Worth revisiting *if* stock history lands — until then there is no history to preserve, so delete is honest. |
| **Multi-part stock movements** | Covered in Item 2. That shape is for unpacking deliveries, not for a desk. |
| **Barcode scanning** | He does not have it either. Noting it only because it is the obvious thing to assume an inventory app has. |

---

## Suggested order

1. **Low-stock warning** — smallest, immediately useful, needs no migration.
2. **Location list** — medium, and it makes an existing broken field work.
3. **Stock movement history** — medium, and better built *after* locations so
   there is one migration pattern already proven twice.
4. **CSV export** — small, do it with or ahead of the PDF question.
5. **PDF / print** — last, and only after the print-to-PDF route is tested on
   your actual phone.

None of this should start until the **category tree** in
[taxonomy-draft.md](taxonomy-draft.md) is settled — that is the last of the
six current issues, it re-tags all 253 parts, and doing it after any of the
above would mean touching the same rows twice.
