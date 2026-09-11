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
| 5 | A category tree that scales past 253 parts | Medium | **Do it first.** Re-tags every row, so everything else should wait behind it. |

Suggested order: **5 → 1 → 3 → 2 → 4**. Reason in [Suggested order](#suggested-order).

Items 1–4 came from the TechPanda comparison. **Item 5 did not** — it came
from your point that the tree should hold any component, not just the 253 in
the catalogue today. It is the one that should be settled first.

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

## Item 5 — A category tree that scales past 253 parts

### What it is
The current catalogue is 253 parts. The tree should not be designed around
that number. It should be designed so that **any** electronic component —
10,000 of them, anything you buy in the next ten years — has an obvious
category and subcategory to land in, without the tree needing to be
redesigned again.

### What the big sites actually do

I looked at how the real component shops structure this, because the answer
turned out to be the opposite of what I expected.

| Site | Top-level categories | Depth to reach a product | Scale |
|---|---|---|---|
| **DigiKey** | ~45 | 2 levels (Category → Subcategory → list) | millions of parts |
| **Robu.in** | 12 | 2–3 levels | 79,186 in Electronic Components alone; 4,172 sensors |
| **Bench draft today** | 12 | 2 levels | 253 |

DigiKey's top level is things like *Resistors*, *Capacitors*, *Circuit
Protection*, *Crystals, Oscillators, Resonators*, *Isolators*, *RF and
Wireless*, *Magnetics*, *Fans/Thermal Management*, *Test and Measurement*,
*Tools*, *Hardware, Fasteners, Accessories* — each a **kind of part**, never
a difficulty level or a project type.

### The finding — depth is not what makes a tree scale

This is the important bit, and it changes my earlier advice.

DigiKey holds **millions** of parts in **two** levels of navigation. It does
not go three or four deep. What lets it scale is two other things:

1. **Breadth at the top.** ~45 top-level categories, not 12. When a new kind
   of part appears, it gets its own top-level home instead of being crammed
   into a category it does not belong in.
2. **Attributes inside a subcategory, not more folders.** Once you are in
   *Resistors → Through Hole*, you narrow by resistance, tolerance, wattage,
   package. Those are **filters**, not tree branches. A three-level tree tries
   to encode as folders what should be filters, and it always collapses.

So: **stay at two levels, but widen the top considerably, and add filters
later instead of depth.** That is the shape that holds 10,000 parts.

### What this means for Issue 3 — I am revising my own recommendation

[taxonomy-draft.md](taxonomy-draft.md) proposes **12 majors → 46 subs**. I
recommended two levels and I still do — the research backs that up. But **12
majors is too few** if the goal is "anything fits". It was sized for 253
parts, which is exactly the mistake you just called out.

Concretely, 12 majors forces bad homes: circuit protection ends up inside
Discretes, crystals inside Passives, thermal inside Power IC, radios inside
Sensors. Each of those is a category DigiKey gives its own top-level slot,
because each is a thing you shop for on its own.

**Revised recommendation: ~25 majors, still two levels.**

### Proposed tree — 25 majors

Named after the kind of part, so a part you have never bought still has an
obvious home. Roughly ordered the way a bench is organised, not the way a
catalogue is alphabetised.

| # | Major | Subcategories |
|---|---|---|
| 1 | **Tools & Workshop** | Soldering · Desoldering & rework · Hand tools · Cutting & stripping · Inspection & magnification · ESD control |
| 2 | **Test & Measurement** | Meters · Oscilloscopes & analysers · Signal sources · Component testers · Bench power · Probes & leads |
| 3 | **Prototyping & PCB** | Breadboards · Perfboard & stripboard · PCB blanks & etching · Jumpers & test hooks · Sockets & adapters |
| 4 | **Resistors** | Through-hole fixed · SMD fixed · Precision & metal film · Power & wirewound · Networks & arrays · Shunts & current sense |
| 5 | **Variable Resistors** | Potentiometers · Trimpots · Rotary encoders · Rheostats |
| 6 | **Capacitors** | Ceramic · Electrolytic · Film · Tantalum & polymer · Supercapacitors · Variable & trimmer |
| 7 | **Inductors & Magnetics** | Fixed inductors · Chokes & ferrites · Toroids & cores · Transformers · Magnet wire |
| 8 | **Crystals & Timing** | Crystals · Oscillators · Resonators · Real-time clocks |
| 9 | **Diodes & Rectifiers** | Signal · Rectifier & bridge · Zener & references · Schottky · Fast recovery |
| 10 | **Transistors & Thyristors** | BJT · MOSFET · JFET · IGBT · SCR & TRIAC · Darlington & arrays |
| 11 | **Optoelectronics** | LEDs · RGB & addressable · Infrared & UV · Displays — 7-seg & matrix · Lasers · Photodiodes, LDRs & phototransistors |
| 12 | **Analog ICs** | Op-amps · Comparators · Timers & oscillators · Voltage references · Audio & amplifiers · Analog switches |
| 13 | **Logic ICs** | Gates · Flip-flops & latches · Counters & dividers · Shift registers · Multiplexers & decoders · Buffers & drivers · Arithmetic |
| 14 | **Data Conversion** | ADC · DAC · Digital potentiometers · Analog front-ends |
| 15 | **Power Management** | Linear regulators · Switching regulators & modules · Battery charging & BMS · Gate drivers · Power monitoring · References |
| 16 | **Circuit Protection** | Fuses & resettable · TVS & MOV · Thermistors NTC/PTC · Crowbars & supervisors · EMI & filtering |
| 17 | **Isolation & Interface** | Optocouplers · Digital isolators · Level shifters · Serial & bus — UART/I²C/SPI/CAN/RS-485 · USB bridges · Port expanders |
| 18 | **Memory & Storage** | EEPROM · Flash · SRAM & FRAM · Card modules · Storage media |
| 19 | **Boards & Computers** | Arduino · ESP · Raspberry Pi · STM32 · Other MCU · Bare MCU chips · FPGA & CPLD · Programmers & debuggers |
| 20 | **Wireless & Comms** | Bluetooth · Wi-Fi · Sub-GHz & LoRa · Cellular · GPS & GNSS · RFID & NFC · Ethernet · Antennas |
| 21 | **Sensors & Transducers** | Temperature & humidity · Environmental & gas · Distance & proximity · Motion & orientation · Light & colour · Sound · Current & voltage · Force, weight & pressure · Magnetic & Hall · Biometric |
| 22 | **Motors & Motion** | DC & gear motors · Steppers · Servos · Brushless & ESC · Motor drivers · Solenoids & actuators · Pumps & valves |
| 23 | **Switches & Relays** | Tactile & pushbutton · Toggle, rocker & slide · DIP & rotary · Reed & magnetic · Limit & micro · Electromechanical relays · Solid-state relays |
| 24 | **Connectors & Wire** | Headers & sockets · Board-to-wire — JST, Molex, Dupont · Power & barrel · USB & data · Terminal blocks · Hookup wire & cable · Heat shrink & sleeving |
| 25 | **Power Sources** | Batteries · Holders & clips · Chargers · Adapters & supplies · Solar & harvesting |
| 26 | **Mechanical & Enclosures** | Fasteners & standoffs · Enclosures & cases · Heatsinks & thermal · Fans & cooling · Brackets & mounts · Belts, gears & wheels |
| 27 | **Consumables & Chemicals** | Solder & flux · Cleaning & solvents · Adhesives & potting · Thermal compounds · Tape & insulation |

That is 27, not 25 — Data Conversion and Consumables both earned their own
slot while writing it out. Sitting between Robu's 12 and DigiKey's 45 looks
about right for a personal bench.

### How the current 253 map onto it
Every one of today's 12 categories survives — they are split, not replaced:

- **Discretes** splits into Diodes, Transistors, Optoelectronics, Circuit
  Protection — the four things it is currently pretending to be one of.
- **Passives** splits into Resistors, Variable Resistors, Capacitors,
  Inductors, Crystals & Timing.
- **Interface IC** splits into Isolation & Interface, Data Conversion, Memory.
- **Power IC** splits into Power Management and Circuit Protection, with
  heatsinks moving to Mechanical.
- **Sensors** loses its eight radios to Wireless & Comms, as already proposed
  in the draft.
- **Wires & Parts** splits into Prototyping, Connectors & Wire, Power Sources,
  Mechanical, Consumables.
- **Tools** splits into Tools & Workshop and Test & Measurement.

Nothing gets deleted and nothing gets orphaned. Around a dozen majors will
hold only a handful of your parts today — that is the point. They are there
so the next part you buy has somewhere to go.

### What it costs
Medium, and it is mostly data entry rather than logic:

- Each `CATALOG` row gains a `sub` field, and its `c` field is re-pointed at
  the new major. **253 rows, edited once.** `i` and `n` must not change or
  saved data and `js/photos.js` break — same rule that governed the icon work.
- `CATS` in `js/catalog.js` grows from 12 to ~27 entries.
- The All tab renders major → sub headings; the chip strip needs to cope with
  27 chips instead of 12, which is a real UI question (see below).
- User-added custom components need a sub too — the Add form gains a second
  dropdown that filters by the chosen major.

### Worth deciding
- **27 majors, or trim it?** More majors means a longer chip strip. If that
  feels like too much on a phone, the answer is a **category screen** rather
  than fewer categories — a grid of 27 tiles you tap into, which is closer to
  how Robu and DigiKey actually work than a horizontal scroller is.
- **Does the chip strip survive?** With 27 it probably should not. Worth
  deciding whether All becomes "browse by category" first, with search as the
  fast path for people who know what they want.
- **Filters instead of depth — later.** Once subcategories fill up, the next
  step is filtering *inside* a subcategory (package, voltage, value), not a
  third level. Worth agreeing now that this is the direction, so nobody
  proposes a deeper tree again in six months.
- **Do it before or after the four items above?** Strongly **before**. It
  re-tags all 253 rows; doing it after low-stock or locations means touching
  the same rows twice.

### Relationship to Issue 3
This supersedes the 12-major shape in
[taxonomy-draft.md](taxonomy-draft.md) if you agree with it. The two
questions still open there — depth, and whether Wireless & Comms is its own
major — are both answered by this: **two levels**, and **yes**. What is new
is the width of the top level.

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

1. **The category tree** (Item 5) — first, and not close. It re-tags all 253
   rows and changes `CATS`. Every other item below touches those same rows or
   reads that same field, so doing it second means doing parts of it twice.
2. **Low-stock warning** — smallest, immediately useful, needs no migration.
3. **Location list** — medium, and it makes an existing broken field work.
4. **Stock movement history** — medium, and better built *after* locations so
   there is one migration pattern already proven twice.
5. **CSV export** — small, do it with or ahead of the PDF question.
6. **PDF / print** — last, and only after the print-to-PDF route is tested on
   your actual phone.

The open questions in [taxonomy-draft.md](taxonomy-draft.md) — depth, and
whether Wireless & Comms stands alone — are answered by Item 5: two levels,
and yes. What that draft still needs from you is agreement on the **width**
of the top level: 12 majors as drafted, or ~27 as proposed here.
