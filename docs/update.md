# Bench — pending update

Working notes for the `version_3_update` branch. Nothing here is built yet.
Discussion and agreement first; code only on an explicit go-ahead.

---

## ▶ START HERE — decisions needed before any work resumes

**Ask these first, in this order. Do not begin implementation until they are
answered.** Each links to the section that explains the trade-off.

| # | Decision | Options | Suggested | Blocks |
|---|---|---|---|---|
| 1 | Remove "add photo" from every list, keeping it only on the component page? | Yes / No | **Yes** | Issue 1 |
| 2 | How should the project part-picker show all 253 parts? | A grouped by category / B flat list / C "show more" button | **A** | Issue 2 |
| 3 | Add category filter chips to the part picker too? | Yes / No | **No** — keeps a narrow sheet simple | Issue 2 |
| 4 | Category tree depth? | 2 levels / 3 levels | **Draft the full taxonomy for approval first**, then decide depth | Issue 3 |
| 5 | Multiple units of one part in different conditions? | A condition counts / B individual units | **A** — "1 working, 1 damaged" | Issue 4 |
| 6 | Which optional settings to include? | see list | **Vibration toggle + default "Add as" only**; skip text size, section toggles, confirm-deletes | Issue 5 |
| 7 | How to fix repeated icons? | A readable labels / B category colours / C more shapes / D photos in lists | **A now, B after the category tree** | Issue 6 |

### Also needs a decision, not yet asked as a question
- **Photo credits are a licence obligation, not a preference.** 167 bundled
  photos are CC BY / CC BY-SA / FAL and legally require attribution, but the
  author/licence data was never saved to the repo. It must be recovered and
  shipped. Confirm this is in scope. → Issue 5.
- **Data migration** is mandatory for Issue 4 — existing records on the phone
  must convert automatically or real data is lost.

---

## Issue 1 — Tapping a component opens the photo picker instead of its page

### What you see
You tap a component in a list expecting its description to open. Instead the
phone's image/file picker opens, asking you to add a photo.

### Why it happens
In `js/views.js`, `thumb()` marks the **entire** 54x54 picture as the camera
trigger:

```js
return `<div class="thumb" data-cam="${it.i}">…`   // line 94
```

and `bind()` then treats a tap anywhere inside it as "add a photo", explicitly
skipping the normal open-the-item behaviour:

```js
if(e.target.closest('[data-cam]'))return;   // line 132 - don't open the item
document.querySelectorAll('[data-cam]').forEach(t=>t.onclick=…pick(…));  // 133
```

So the small camera badge is only ~20px visually, but its **tap area is the
whole thumbnail**. The picture is the most natural thing to aim at, so a normal
tap lands on the photo picker. This affects every list: Stock, To Buy, All,
Home, project parts, and the project part-picker — all of them render rows via
`thumb()`.

### Proposed fix
Remove the camera trigger from list thumbnails entirely. In lists the picture
becomes just a picture, and the whole row opens the component.

Adding a photo stays available where it belongs — on the component's own page,
which already has the controls for it:

- **Add photo** / **Change photo** (`#ph1`)
- **Find online** (`#ph2`)
- **Remove** (`#ph3`, only when a photo exists)

This matches what you asked for: the add-image option lives in the description
page only.

### Worth deciding
- **Bulk photo add** (Settings → "Add many photos at once") is unaffected and
  still works — it matches files to parts by filename.
- Nothing is lost by this change; it removes a shortcut that was firing by
  accident far more often than on purpose.

---

## Issue 2 — Can't see all components when adding parts to a project

### What you see
Inside a project → **Add parts**, only some components appear. Scrolling to the
bottom does not load any more, so most of the catalogue is unreachable.

### Why it happens
`openPartPicker()` in `js/detail.js` hard-caps the list at 60 items:

```js
const list = all().filter(…).slice(0,60);   // line 55
```

The catalogue has **253 components**, so **193 of them never appear**. There is
no "load more" and no paging — the list simply stops. The only way to reach a
part beyond the first 60 is to know its name and search for it.

### Proposed fix
Drop the 60-item cap and show the full catalogue.

Rendering all 253 is already proven safe: the **All** tab does exactly that on
every render, grouped by category, with no performance problem.

To keep a 253-row list navigable, the picker should also adopt the same
**category grouping** the All tab uses (`Tools`, `Passives`, `Discretes`, …),
so you can scan to the right section instead of scrolling blindly.

### Options for how the picker lists parts

| Option | What it gives | Cost |
|---|---|---|
| **A. Remove cap + group by category** (suggested) | Everything reachable, easy to scan, consistent with the All tab | Slightly longer list to scroll |
| B. Remove cap, flat list | Everything reachable, simplest change | 253 undifferentiated rows is hard to scan |
| C. Keep cap, add "Show more" button | Shorter initial list | Extra taps; still hides most of the catalogue by default |

### Worth deciding
- Should the picker also offer the **category filter chips** that the All tab
  has, on top of grouping? It would make finding a part faster, but adds a
  second row of controls to a sheet that is already narrow.
- Should parts already in the project be **sorted to the top**, or stay in
  place with their current tick mark?

---

## Issue 3 — Categories are flat; they should be a proper tree

### What you see
Everything sits in one level. "Tools" is a single bucket holding all 23 tools.
Real component sites nest it: a major category, then sub-categories, then the
products.

### Where it stands now
12 flat categories, one per component (`c` on each catalogue row):

Tools (23) · Passives (18) · Discretes (29) · Analog IC (16) · Power IC (14) ·
Logic IC (38) · Interface IC (19) · Motors & Drive (11) · Boards & MCU (22) ·
Sensors (32) · Display & Input (11) · Wires & Parts (20)

With 253 parts across 12 buckets, some buckets are big and undifferentiated —
Logic IC alone is 38 rows of 74-series chips in one flat run.

### Proposed shape
Two levels of grouping above the product, as you described. Sketch using real
catalogue contents:

```
Boards & MCU                    (major)
├── Arduino                     (sub)
│   ├── Boards                  Uno R3, Nano, Mega
│   ├── Shields                 …
│   └── Bare chips              ATmega328P + crystal
├── ESP / WiFi
│   ├── ESP32                   DevKit, S3, C3/C6
│   └── ESP8266                 NodeMCU, ESP-01
├── Raspberry Pi                Pico / Pico W, Zero 2 W
└── Other MCU                   STM32, ATtiny, RISC-V

Logic IC
├── 74 series
│   ├── Gates                   7400 NAND, 7402 NOR, 7404 inverter, 7408 AND
│   ├── Flip-flops & counters   …
│   └── Buffers & shift regs    …
└── CD4000 series               …

Sensors
├── Environment                 DHT11/22, BMP280, BME280
├── Distance & motion           HC-SR04, PIR, VL53L0X
├── Motion & orientation        MPU6050, MPU9250
└── Radio & comms               nRF24L01, LoRa, GPS
```

### What this actually costs
This is the largest of the four items, and it is mostly **data work, not code**:

1. **Designing the taxonomy** — deciding the sub-levels for all 12 majors.
2. **Re-tagging 253 components** — every row needs its new sub-category, and
   ideally sub-sub. This is the bulk of the effort.
3. **Code changes** — the catalogue row gains a field or two; the All tab
   becomes a drill-down (major → sub → products) instead of one long grouped
   list; the category filter chips and the project part-picker follow the same
   structure.

### Worth deciding
- **Two levels or three?** (major → sub → product, or major → sub → sub-sub →
  product). Three is what you sketched with Arduino → Shields; it is also
  noticeably more tagging work and deeper tapping on a phone.
- **Browsing style:** drill-down (tap Boards → tap Arduino → see products) or
  one long page with collapsible sections?
- **Should the majors change too,** or keep today's 12 as the top level? Some
  merging might help — e.g. Analog IC + Power IC + Logic IC + Interface IC
  could all sit under one "Integrated circuits" major.
- Do you want me to **propose the full taxonomy first** as a document you
  approve, before any re-tagging happens?

---

## Issue 4 — Two of the same part, in different conditions

### What you see
You own 2 of a component: one tested and working, the other damaged. Right now
you cannot record that — the app forces one condition for the whole quantity.

### Why it happens
Each component stores a single set of values for all its units:

```js
S.u[id] = { st, qty, cond, tested, loc, project, notes, fav }
```

`qty: 2` with `cond: 'working'` means *both* are working. There is nowhere to
say one is damaged. The same limitation applies to **tested**, **kept in** and
**used in** — they are all one value covering every unit.

### Two ways to fix it

**Option A — condition counts (simpler)**
Replace the single condition with counts per condition:

```js
S.u[id] = { qty: 2, cond: { working: 1, damaged: 1, repair: 0 }, … }
```

- Stock row reads "×2 — 1 working, 1 damaged".
- Home's "damaged" tile and the "Check these" section become accurate — today
  a part with 5 units counts as one damaged item, not five.
- You cannot say *which* unit is which, or store a different location per unit.

**Option B — individual units (fuller)**
Each unit becomes its own record:

```js
S.u[id] = { units: [
  { cond:'working', tested:true,  loc:'Box A' },
  { cond:'damaged', tested:false, loc:'Bin'   }
], … }
```

- Every unit tracked separately, with its own condition, tested flag and
  location.
- Costs more UI: the part page needs a list of units with add/remove, and
  quantity becomes "number of units" rather than a number you type.

### Important either way — existing data
Your phone already holds real data in the current shape. Whichever option we
take needs a **migration** that converts existing records on first launch
(e.g. `qty:3, cond:'working'` becomes 3 working units), so nothing you have
recorded is lost. This is not optional and should be built with the change,
not after.

### Worth deciding
- **Option A or B?** A covers "how many of each are good", which is what you
  described. B is right if you also want per-unit location or notes.
- Should **tested / not tested** be per-unit too, or stay one flag for the part?

---

## Issue 5 — Settings panel: proper structure and customisation

### Where it stands now
The panel (gear icon) is titled **More** and is a flat run of four labels with
no grouping or explanation:

| Today | |
|---|---|
| Appearance | Light / Dark / Auto |
| Photos | Add many photos at once |
| Backup | counts, Export, Import |
| Reset | Erase all my data |

It works, but it reads as a maintenance drawer rather than a settings screen,
and it offers almost no control over how the app behaves.

### Proposed layout
Rename it **Settings**, and group into sections with a short line under each
control saying what it does. Order runs most-used at the top, destructive last:

```
Settings
─────────────────────────────
APPEARANCE
  Theme            Light │ Dark │ Auto        (exists)
  Text size        Small │ Normal │ Large     (new)

HOME SCREEN
  Pinned parts     4 │ 6 │ 8                  (new)
  Show collection chart      [toggle]          (new)
  Show "check these"         [toggle]          (new)

WHEN ADDING A PART
  Add as           I have it │ Need to buy    (new - today always "I have it")
  Catalogue view   List │ Grid                (new - today set on the All tab)

FEEDBACK
  Vibration        [toggle]                   (new)
  Confirm deletes  [toggle]                   (new)

PHOTOS
  Add many photos at once                     (exists)
  Photo credits                               (new - see below)

MY DATA
  Items tracked / My own items / Photos saved / Storage   (exists)
  Export backup    Import                     (exists)

ABOUT
  Version, what Bench is, link to the guide   (new)

DANGER ZONE
  Erase all my data                           (exists, moved to the bottom)
```

### On which new settings are actually worth adding
The design rules for this app favour restraint, so not every toggle above
earns its place. My read:

**Worth adding**
- **Vibration on/off** — the one setting people reliably want to kill.
- **Add as** default — if you mostly log parts you already own, or mostly build
  a shopping list, this saves a tap every single time.
- **Pinned parts count** — 4 fills one screen row; 6 or 8 suits a larger
  collection.
- **Photo credits** — not a preference, an obligation (below).

**Questionable — say if you want them**
- **Text size** — the app already respects the phone's own font scaling in
  most places; a second control can fight it.
- **Show/hide Home sections** — Home already hides sections that are empty, so
  this mostly adds switches for a problem that solves itself.
- **Confirm deletes** — deletes already ask for confirmation; making that
  optional mainly adds a way to lose data faster.

### Photo credits — a real obligation, not a nice-to-have
The 167 bundled photos came from Wikimedia Commons under licences including
**CC BY**, **CC BY-SA**, **FAL** and **CC0**. Everything except CC0 legally
**requires attribution** — naming the author and licence — and CC BY-SA also
requires share-alike. That applies to a personal app, not just commercial ones.

**The problem:** the sourcing scripts printed each photo's source URL and
licence to the console, but nothing ever wrote them to a file. That data is
**not in the repo** — it exists only in the agents' run logs. So right now the
app ships photos it cannot credit.

**What fixing it needs:**
1. Recover the source URL + licence + author for all 167 photos. The image
   filename maps to a Commons file, so this is scriptable — re-query Commons
   per image rather than re-download anything.
2. Store it as a data file (e.g. `assets/photo-credits.json`).
3. Show it in Settings → **Photo credits**, listing each part, its photographer
   and licence.

This should be treated as required work before the photos ship widely, not as
an optional extra.

### Worth deciding
- Which of the "questionable" settings do you actually want?
- Any customisation not listed that you had in mind?
- Should **Photo credits** be its own screen, or a section inside About?

---

## Issue 6 — Too many components share the same icon

### What you see
Scrolling a list, large runs of components look identical — especially near
the top of the catalogue.

### Measured, not guessed
253 components are drawn using only **35 distinct package shapes**:

| Icon | Components using it | Examples |
|---|---|---|
| `dip14` | **55** | NE556, LM324, LM339, CD4046, XR2206, LM3914, LM723, IR2110 |
| `module` | **37** | INA219, LM2596, MT3608, TP4056, BMS board, ADS1115, MCP4725 |
| `tool` | 14 | |
| `sensor` | 13 | |
| `dip8` | 11 | |
| `board` | 11 | |
| `to220` | 10 | |
| `mcu` | 10 | |

Just those two shapes cover **92 components — 36% of the catalogue**.

### Why it happens
`art()` picks a package drawing from the item's `s` (symbol) field via
`pkgOf()`. There are 35 package drawings, so parts sharing a package share a
picture. The drawing *does* stamp the part's marking on the chip body
(`_mark()` puts e.g. "LM324" on the package), so they are not strictly
identical — but at a 54px list thumbnail that text is far too small to read,
so the silhouettes read as the same icon.

Worth being honest about one thing: **real DIP chips genuinely do all look
alike**. A photo of an LM324 and an LM339 are near-indistinguishable too. So
"a unique drawing per component" is not really achievable, or even truthful —
the fix is to distinguish them by something other than outline.

### Ways to fix it

**A. Make the printed marking readable at thumbnail size**
Enlarge and bolden the text `_mark()` already draws. Cheapest change, and it
turns 55 identical chips into 55 labelled chips. Limited by how many
characters fit on a small package.

**B. Colour-code by category**
Tint the icon (or its badge) per category — ICs one colour, passives another,
sensors another. Instantly separates the long runs without inventing artwork,
and matches the "colour badge" pattern used by Apple's own list apps.
**Depends on Issue 3** — a category tree makes this far more useful, since
sub-categories can carry the tint.

**C. Add more package drawings**
Split the two big buckets into real variants — DIP-8/14/16/18/20/28, SOT-23,
TO-92 vs TO-220 vs TO-3, module vs breakout vs shield. Genuinely better
accuracy, but it is new artwork per shape plus re-tagging the parts that use
them.

**D. Use the real photos in lists**
167 components now have a real photo. Showing them in lists would differentiate
instantly — but you explicitly chose icons for lists and photos for the detail
page, so this contradicts that decision. Noted only for completeness.

### Recommendation
**A + B together**, and revisit C for the worst offenders only. A is cheap and
helps immediately; B fixes the "long run of sameness" problem structurally. C
is worth doing for `dip14` and `module` specifically, since those two carry a
third of the catalogue, but it is real artwork effort.

### Worth deciding
- A, B, C, or a combination?
- If B: should the tint follow the **major** category (12 colours) or the new
  **sub**-categories from Issue 3? Twelve distinct, accessible colours is
  already at the limit of what stays readable — more than that and they stop
  being tellable apart.
- Is it acceptable that some components legitimately share an icon, as long as
  the label is readable?

---

## Open questions

Moved to **▶ START HERE** at the top of this document, so they are the first
thing seen when work resumes.

---

## Suggested order of work

Issues 1 and 2 are small, self-contained bug fixes with confirmed causes —
they can ship quickly. Photo credits is small but is a licence obligation, so
it should not sit at the back of the queue. Issues 3 and 4 are structural:
both change the data model and both need a migration path for data already on
your phone.

| Order | Item | Size | Why here |
|---|---|---|---|
| 1 | Issue 1 — photo picker hijacking taps | Small | Confirmed bug, hits every list |
| 2 | Issue 2 — 60-item cap in part picker | Small | Confirmed bug, hides 193 of 253 parts |
| 3 | Issue 5a — recover + ship photo credits | Small | Licence obligation |
| 4 | Issue 5b — Settings panel restructure | Medium | Self-contained, no data migration |
| 5 | Issue 6a — readable markings on icons | Small | Cheap, helps the 92 worst parts immediately |
| 6 | Issue 4 — per-condition quantities | Medium | Data model change + migration |
| 7 | Issue 3 — category tree | Large | Mostly re-tagging 253 parts |
| 8 | Issue 6b — category colour-coding | Small | Trivial once the tree from Issue 3 exists |

Issue 6b sits after Issue 3 deliberately: colour-coding by category is a small
change on its own, but it is far more useful once the categories are properly
structured, so doing it first would mean doing it twice.

---

## Status

| Item | State |
|---|---|
| Issue 1 — photo picker hijacking taps | Root cause confirmed, fix agreed pending your OK |
| Issue 2 — 60-item cap in project part picker | Root cause confirmed, approach needs your pick |
| Issue 3 — category tree | Needs taxonomy decisions before any work |
| Issue 4 — per-condition quantities | Needs A/B decision + migration plan |
| Issue 5 — settings panel + photo credits | Layout drafted; credits data needs recovering |
| Issue 6 — repeated icons | Measured (35 shapes for 253 parts); approach needs your pick |
| Code changes | **None made** — awaiting go-ahead |
