# Bench — v4 plan

Work order for the `version_4` branch (based on `version_3_update`).

**Nothing here is built.** Same working rule as every round: discuss and agree
first, code only on an explicit go-ahead. This document is the agreed plan,
written 2026-09-21.

Build runs **phase by phase**. Each phase has its own verification step and is
not considered done until that passes. Later phases assume the earlier ones
shipped.

---

## What v4 delivers

1. **A new category tree** — 24 short categories replacing today's 12, with
   depth that varies per branch instead of one fixed depth.
2. **The All tab becomes a category grid** instead of a horizontal chip strip.
3. **Catalogue grows** from 253 to ~290 parts, weighted to the thin branches
   the re-cut exposes.
4. **Two v3 bugs fixed** — scroll position lost on back, and "Used in" being a
   disconnected text box.
5. **Security work** — trustworthy backups, a non-debuggable release build, and
   hardening against a hostile import.

Deliberately **not** in v4: photo credits (still outstanding), app-level
encryption, PIN/biometric lock, login (reasons in
[Not doing, and why](#not-doing-and-why)).

---

## Phase order and why

Backup work comes **first**, before anything touches data. The category re-tag
rewrites all 253 catalogue rows; that should not happen while the only safety
net is known-broken.

| Phase | Work | Why here |
|---|---|---|
| 1 | Backup integrity and import safety | **There is currently no working backup at all** (confirmed on device). The re-tag is a large data change and Phase 2 forces a reinstall — both need a backup that works first. |
| 2 | Release build + signing key | One change fixes the real data-at-rest exposure and the committed keystore together. |
| 3 | Hostile-import hardening (XSS) | Closes the one path by which a file can run code in the app. |
| 4 | The two v3 bugs | Small, self-contained, no data model change. Ships independently. |
| 5 | Category tree + grid | The big one. Re-tags every row and changes the All tab. |
| 6 | Catalogue growth to ~290 | New rows need the new tags, so this follows the tree. |

---

## Phase 1 — Backup integrity and import safety

Bench's backup is its only safety net, and it has three faults — the first of
which means it has never worked on the phone at all.

### 1a. Export silently loses every project
`js/io.js:29` builds the payload as:

```js
const d={v:2,at:new Date().toISOString(),u:S.u,custom:S.custom,photos:S.photos};
```

`S.projects` is absent. Export, reinstall, import — every project is gone, with
no warning. **Confirmed by reading the file.**

**Fix:** include `S.projects`, bump to `v:3`, and keep reading `v:2` files so
older backups still restore.

### 1b. Export may not produce a file at all on the phone
`doExport()` creates a `blob:` URL and clicks an anchor. Capacitor registers no
download listener, so the WebView appears to drop the download — while the app
still shows "Backup saved". In a desktop browser it works, which is why this
was never caught.

**Confirmed on device 2026-09-21:** the app shows "Backup saved" and no file
appears anywhere on the phone. The export path is dead, not merely
mis-reporting. This means **Bench has had no working backup at all** — the one
thing the README calls "the only real safety net."

**Fix:** write the file through the Capacitor Filesystem API (or a share
sheet) rather than an anchor click, and only toast success after the write
actually returns. Surface a real error if it fails.

### 1c. A malformed import can permanently brick the app
Import validates only:

```js
if(!d.u&&!d.user)throw 0;
```

then assigns `S.u`, `S.custom` and `S.photos` wholesale. A `custom` row missing
its `t` field makes `js/views.js:121` (`it.t.indexOf('📘')`) throw inside
`render()` — which aborts *before* `$('#main').innerHTML` is assigned. Result:
permanent blank screen, and the only recovery is erasing all data.

**Fix:**
- Validate shape and types before anything is written: `u` is an object, each
  record's fields are the expected types, `custom` is an array of rows with the
  required fields, `photos` values are strings.
- Reject with a clear message instead of a half-applied import.
- Confirm before importing ("This replaces everything currently on this
  device"), since import is destructive and currently silent.
- Keep a pre-import snapshot so a bad restore can be rolled back.
- Cap file size before `readAsText` so a huge file cannot exhaust memory.

### Phase 1 verification
- Export on a real phone; a file exists and opens as valid JSON.
- That file contains `projects`, and restoring it on a wiped install brings
  back parts, custom parts, photos **and** projects.
- A `v:2` backup still restores.
- Importing a truncated file, a file with a `custom` row missing `t`, a file
  where `u` is a string, and a non-JSON file each show a clear error and leave
  existing data untouched.
- Import asks for confirmation first, and a rollback restores the prior state.

---

## Phase 2 — Release build and signing key

Two problems, one change. This also closes out Issue 7 from
[update.md](update.md).

### 2a. The shipped APK is debuggable
The workflow builds `assembleDebug` (`.github/workflows/build-apk.yml:100`), so
the released APK carries `android:debuggable="true"` and
`android:allowBackup="true"`.

Consequences on a **stock, non-rooted** phone: anyone who can enable USB
debugging and authorise a host can read the entire database via
`adb shell run-as com.bench.inventory`, `adb backup` includes app data, and the
live WebView is inspectable through `chrome://inspect`.

**This is the actual data-at-rest exposure** — not the absence of encryption.

**Fix:** build `assembleRelease`, and set `android:allowBackup="false"`.

### 2b. The signing key is committed, and CI pushes it
The "Reuse the same signing key every build" step generates `debug.keystore`
with the public password `android`, then commits and pushes it back to the
repo. Anyone with repo read access can build a same-signature APK that installs
over the real app.

**Fix:**
1. Generate a release keystore locally, with a private password. Never commit it.
2. Store `KEYSTORE_BASE64` and `KEYSTORE_PASSWORD` as GitHub Actions secrets.
3. Decode to a file at build time; sign `assembleRelease` with it.
4. Delete the self-commit step entirely — CI must never push to the repo.
5. Remove `debug.keystore` from the repo and delete the old debug-signed
   Releases.
6. `permissions: contents: write` stays, but only for creating Releases.

### The one-time cost, acknowledged
Changing the signing key **breaks update-in-place.** Any phone running a
debug-signed build will refuse the next update as a signature mismatch, forcing
uninstall + reinstall, which erases local data.

**Therefore: Phase 1 must ship and be verified before Phase 2.** Export a
backup, reinstall, import it. This ordering is not optional — it is the reason
backups come first.

### Phase 2 verification
- Built APK reports `debuggable=false` and `allowBackup=false` (check with
  `aapt dump badging` or by decoding the manifest).
- `adb shell run-as com.bench.inventory` is refused on the release build.
- `chrome://inspect` no longer lists the app.
- The workflow run produces no new commits.
- `debug.keystore` is absent from the repo and from history going forward.
- A backup exported from the old build imports cleanly into the new one.

---

## Phase 3 — Hostile-import hardening

A crafted backup file can currently run arbitrary JavaScript inside the app.

`js/views.js:99` and `js/detail.js:244` interpolate photo data straight into an
image tag without escaping:

```js
`<img src="${p}" alt="">`
```

`p` comes from `S.photos`, which `js/io.js:39` imports verbatim. A `photos`
value of `x" onerror="…` therefore becomes executable on the next render. There
is no CSP in `index.html`, and `android.permission.INTERNET` is granted, so
injected script could send the whole inventory off-device. It persists until
data is erased.

The same applies to ids: `js/views.js:54`, `:136`, `:139`, `:142` and
`js/detail.js:64` interpolate `it.i` into attributes, and `S.custom[].i` is
imported verbatim.

Note `esc()` (`js/store.js:102`) escapes `< > & "` but not `'`. No
single-quoted attributes with interpolation exist today, so it is adequate
where used — the faults above are places it is **not** used.

**Fix:**
- Escape photo sources and ids at every interpolation, or set `img.src` as a
  property rather than building HTML.
- Validate that photo values are `data:image/...` URLs on import, and that ids
  match a safe pattern (`[A-Za-z0-9_-]+`).
- Add a restrictive CSP meta tag to `index.html`.

### Phase 3 verification
- A backup whose `photos` value contains `" onerror="` imports without
  executing anything, and renders no broken markup.
- A backup whose custom-part `i` contains `"><img src=x onerror=…>` likewise.
- Normal photos still display, in lists and on the part page.
- CSP blocks inline event handlers, confirmed in the console with no errors on
  normal use.

---

## Phase 4 — The two v3 bugs

### 4a. List jumps to the top after opening a part
`js/detail.js:348`:

```js
function close(){$('#sheet').classList.remove('open');document.body.style.overflow='';render()}
```

`render()` ends with `window.scrollTo(0,0)` (`js/views.js:470`), so every sheet
close snaps the list to the top. Scroll down the All tab, open a part, come
back — you are at the top again and must scroll to find your place.

The fix already exists in the codebase but was never wired in:
`refreshUnder()` (`js/views.js:268`) saves and restores the offset.

**Fix:** `close()` uses `refreshUnder()` instead of `render()`. This fixes every
sheet — part pages, projects, Settings, the add form — not only the All tab.

Watch for one thing: the scroll offset must be captured **before**
`document.body.style.overflow` is reset, or the body can jump on some WebViews.

### 4b. "Used in" is a disconnected text box
`js/detail.js:289`:

```js
<div><label class="f">Used in</label><input class="f" id="pj" value="${esc(u.project||'')}" placeholder="free"></div>
```

Free text, stored as `u.project`. Meanwhile every project already has its own
`parts[]` array — that is what **Add parts** writes to and what the missing-parts
count reads. So there are two disconnected records of the same fact, and they
can silently disagree.

**Decision: make it derived and read-only.** Drop `u.project` entirely. The
field lists whichever projects actually include this part, computed from
`S.projects`, each tappable to open that project. When none do, it reads
**Free**. Parts are added and removed from a project's own screen, which is
already where that works.

This handles a part being in several projects — which the data model already
supports and a single dropdown could not represent.

**Migration, mandatory.** Dropping `u.project` must not silently discard what is
already typed there. On first launch, for each part with a `project` value,
match it case-insensitively against project names and add the part to that
project's `parts[]` if absent; then delete the field. Idempotent, runs before
the first render, same pattern as `migrateUnits()`. Values matching no project
disappear as labels, which is correct — they were never real links.

### Phase 4 verification
- Scroll the All tab, open a part, close it: the list is exactly where it was.
- Same for Stock, To Buy, project parts and the part picker.
- A part in two projects lists both; tapping either opens it.
- A part in none reads "Free".
- An existing `u.project` value matching a project name results in that part
  appearing in that project's parts list; running the migration twice changes
  nothing further.
- Quantity, condition counts, notes, location and favourites are untouched.

---

## Phase 5 — The category tree

### The shape, and why

Researched against 11 real stores (DigiKey, Mouser, LCSC, Farnell, Robu,
Robocraze, Quartz, ElectronicsComp, Adafruit, SparkFun, Pimoroni). Three
findings drove the design:

1. **Ragged depth is universal.** Every store has depth-2 leaves next to
   depth-4 branches, often under the same parent. No store enforces one depth.
2. **The folder/filter line is drawn identically everywhere.** Folders encode
   *form factor and technology family*; filters encode *measurable values*.
   Nobody makes a "10k" folder.
3. **Tools stay shallow, parts go deep.** Screwdrivers reach a product in 2
   levels; transistors take 3–4. Soldering is the one tool branch that earns a
   third level, at four separate stores.

Names are 1–2 words throughout. That forces bundles to split, which is why the
count is 22 rather than 12 — in line with Mouser (19), Quartz (17) and
Robocraze (19).

### The 24 majors

Two were added on 2026-09-21 after review: **Audio** gives buzzers a home
(they are sound output, so they fit neither Displays nor Sensors — and the
major leaves room for a speaker or microphone later), and **Transformers**
stands alone rather than being split between Instruments and Passives.
Both are thin today, like FPGA and Relays — that is deliberate, so the next
part bought has somewhere obvious to go.

| # | Major | Subcategories | Depth |
|---|---|---|---|
| 1 | **Tools** | Hand Tools · **Soldering** (→ Irons, Stations, Tips, Desoldering) · Inspection · ESD | 2–**3** |
| 2 | **Instruments** | Multimeters · Oscilloscopes · Analysers · Signal Sources · Component Testers · Bench Supplies | 2 |
| 3 | **Passives** | **Resistors** (→ Through Hole, SMD, Precision, Power) · Potentiometers · **Capacitors** (→ Ceramic, Electrolytic, Film, Tantalum, Super) · Magnetics · Crystals | 2–**3** |
| 4 | **Discretes** | **Diodes** (→ Signal, Rectifier, Zener, Schottky) · **Transistors** (→ BJT, MOSFET, JFET, IGBT, Darlington) · Thyristors | **3** |
| 5 | **Protection** | Fuses · TVS & MOV · Thermistors | 2 |
| 6 | **ICs** | Op-Amps · Comparators · Timers · Regulators · **Logic** (→ Gates, Flip-Flops, Counters, Shift Registers, Mux, Buffers, Arithmetic) · Data Conversion · Interface · Isolation · Drivers · Memory | 2–**3** |
| 7 | **Power** | Batteries · Holders · Charging & BMS · SMPS · Adapters | 2 |
| 8 | **LEDs** | Standard · RGB · Addressable · Infrared · Lasers | 2 |
| 9 | **Displays** | 7-Segment · LCD · OLED · Matrix · TFT · E-Paper | 2 |
| 10 | **Microcontrollers** | Arduino · ESP · STM32 · Pico · micro:bit · ATtiny · Teensy · 8051 · RISC-V · nRF · Bare Chips · Programmers | 2–**3** |
| 11 | **SBCs** | Raspberry Pi · Jetson · Other | 2 |
| 12 | **FPGA** | FPGA Boards · CPLD Boards | 2 |
| 13 | **Wireless** | Wi-Fi · Bluetooth · LoRa · Cellular · RF · GPS · RFID & NFC · Ethernet | 2 |
| 14 | **Sensors** | **Environmental** (→ Temperature, Humidity, Pressure, Gas, Soil, Rain) · Motion · Distance · Light · Electrical · Force · Sound · Magnetic · Biometric | **3** |
| 15 | **Motors** | Brushed · Brushless · Servo · Stepper · Gear · Solenoids · Pumps | 2 |
| 16 | **Motor Drivers** | Driver ICs · Driver Modules · Stepper Drivers · ESCs | 2 |
| 17 | **Switches** | Tactile · Toggle · DIP · Rotary · Reed · Limit · Keypads | 2 |
| 18 | **Relays** | Electromechanical · Solid State · Modules | 2 |
| 19 | **Prototyping** | Breadboards · Perfboard · Headers · Sockets · Adapters | 2 |
| 20 | **Connectors** | Terminals · JST & Dupont · Power · USB & Data · Hookup Wire · Heat Shrink | 2 |
| 21 | **Hardware** | Fasteners · Enclosures · Cooling · Thermal · Motion Parts | 2 |
| 22 | **Consumables** | Solder · Flux · Cleaning · Adhesives · Tape | 2 |
| 23 | **Audio** | Buzzers · Speakers · Microphones | 2 |
| 24 | **Transformers** | Mains · Isolation · Toroidal | 2 |

**Microcontrollers is subdivided by family, not architecture.** AVR was only an
example; a tree built on architecture breaks for ESP32, Pico and STM32, which
every store files by family name. Family subdivision means a new board is one
new entry with no restructuring — this is also what Quartz, Robocraze and
ElectronicsComp actually do.

**No part is reachable by two paths.** Soldering *consumables* (solder, flux,
paste) live in Consumables; **Tools → Soldering** holds only irons, stations,
tips and desoldering gear. Duplicate paths were flagged as a common store
mistake and are avoided deliberately.

### The growth rule, agreed now
Once a subcategory fills up, it is narrowed by **filters inside that
subcategory** (package, voltage, value) — never by adding another level. All 11
stores draw the line there. Agreeing this now prevents a deeper tree being
proposed later.

### Re-tagging the 253 rows

Each `CATALOG` row gains a `sub`, and its `c` is re-pointed at the new major.
**`i` and `n` must not change** — saved user data keys off `i`, and
`js/photos.js` maps photos by `i`. Same rule that governed the icon work.

How today's 12 map onto the 22. Verified to total exactly 253:

| Today | Goes to |
|---|---|
| **Tools** (23) | Tools 12 · Instruments 8 · Transformers 1 (isolation) · Consumables 2 (solder wire, flux) |
| **Passives** (18) | Passives 18, unchanged |
| **Discretes** (29) | Discretes 17 · LEDs 5 · Sensors→Light 3 (photodiode, LDR, phototransistor) · Protection 3 · ICs 1 (TL431) |
| **Analog IC** (16) | ICs 15 · Sensors→Electrical 1 (INA219) |
| **Power IC** (14) | ICs 8 (6 regulators, 2 gate drivers) · Power 5 · Hardware 1 (heat sinks) |
| **Logic IC** (38) | ICs → Logic, all 38 |
| **Interface IC** (19) | ICs, all 19 (data conversion, isolation, interface, drivers, memory) |
| **Motors & Drive** (11) | Motors 6 · Motor Drivers 4 · Relays 1 |
| **Boards & MCU** (22) | Microcontrollers 18 · SBCs 2 · FPGA 2 |
| **Sensors** (32) | Sensors 22 · Wireless 8 · Microcontrollers 1 (ESP32-CAM) · Switches 1 (rotary encoder) |
| **Display & Input** (11) | Displays 7 · Switches 3 · Audio 1 (buzzers) |
| **Wires & Parts** (20) | Connectors 8 · Prototyping 4 · Power 3 · Hardware 2 · Consumables 2 · Transformers 1 (12-0-12) |

Resulting distribution — note **ICs at 81** is why its Logic branch needs the
third level, and the small majors are the ones Phase 6 fills:

```
ICs 81 · Sensors 26 · Microcontrollers 19 · Passives 18 · Discretes 17
Tools 12 · Instruments 8 · Power 8 · Wireless 8 · Connectors 8
Displays 7 · Motors 6 · LEDs 5 · Switches 4 · Motor Drivers 4
Consumables 4 · Prototyping 4 · Hardware 3 · Protection 3
SBCs 2 · FPGA 2 · Transformers 2 · Relays 1 · Audio 1
```

Totals to exactly 253. Verify this sum after re-tagging — if it does not come
to 253, a row was dropped or double-counted.

### Code changes
- `CATS` in `js/catalog.js` grows from 12 to 22, and a `SUBS` structure carries
  the subcategories and their depth.
- The All tab becomes a **category grid** — 22 tiles, roughly 4×6 on a phone.
  The horizontal chip strip cannot hold 22 and is retired. Search stays as the
  fast path when the part name is already known.
- Drill-down: major → sub → (→ sub-sub where the branch has one) → parts.
- Android back must step *up* the tree, not close the view outright.
- The Add form needs a second dropdown for `sub`, filtered by the chosen major.
- Custom user parts need a major and sub too; existing ones default to their
  current category's closest new major.
- The Home collection chart reads categories — with 22 it needs checking, and
  probably shows top N rather than all.

### Phase 5 verification
- All 253 parts are reachable by browsing; none orphaned, none reachable by two
  paths.
- Every row has a valid `c` and `sub`; no row's `i` or `n` changed (diff the
  ids and names against the previous commit).
- Photos still resolve for all 167 parts that have one.
- Saved user data still matches parts after the re-tag — quantity, condition,
  location, notes, favourites intact.
- Custom parts added before the change still appear, with a sensible major.
- Back button walks sub → major → grid, then exits.
- The category grid, drill-down and search all work in the APK, not only in a
  browser.

---

## Phase 6 — Catalogue growth to ~290

Target **~298**. Decided 2026-09-21: **keep all 45 candidates, drop none.**
Going slightly over 300 is acceptable. Additions go to the branches the re-cut
showed to be thin, rather than being guessed.

| Major | Today | Add | Candidates |
|---|---|---|---|
| Switches | 4 | 6 | toggle SPDT, rocker, slide, rotary switch, reed, micro/limit |
| Connectors | 8 | 5 | XT60, Molex, banana plugs, crocodile clips, RJ45 / ribbon |
| Power | 8 | 4 | CR2032 + holder, AA/AAA holder, LiPo pack, buck-boost module |
| Sensors | 26 | 4 | ADXL345, BH1750 lux, SHT31, MAX30102 pulse |
| Consumables | 4 | 4 | kapton tape, electrical tape, cable ties, contact cleaner |
| Hardware | 3 | 4 | 12V fan, gears & wheels, shaft coupler, bearings |
| Relays | 1 | 3 | bare SPDT, SSR 25A, 4-channel module |
| Protection | 3 | 3 | glass fuse + holder, polyfuse, gas discharge tube |
| Prototyping | 4 | 3 | breadboard 400/170, stripboard, SOIC→DIP adapter |
| Tools | 12 | 3 | crimping tool, hot glue gun, PCB vise |
| Wireless | 8 | 3 | PN532 NFC, ESP-01, XBee / Zigbee |
| Microcontrollers | 19 | 2 | micro:bit, LilyPad |
| SBCs | 2 | 1 | Orange Pi or BeagleBone |

Each new row needs: id, name, major, sub, level, symbol/package for its icon,
price, why-it-matters text. New ids must not collide with existing ones.

Further growth happens in later versions — this is a top-up, not an attempt to
be complete.

### Phase 6 verification
- Total lands at ~298 with all 45 added.
- Every new row renders an icon that is not a duplicate silhouette of an
  existing part (the v3 icon work set this bar: 243 distinct across 253).
- No id collisions; `js/photos.js` still valid.
- Every new part is reachable by browsing and by search.

---

## Not doing, and why

Recorded so it is not re-argued.

| Asked for | Verdict |
|---|---|
| **App-level encryption of local data** | **Skip.** Without a passphrase typed at every launch, the key must live on the device — anything that can read the data can ask for the key. A hardware-backed Keystore key protects only copies taken *off* the device, which Phase 2 already closes far more cheaply, without the risk of corrupting the only copy. Revisit only if a launch passphrase becomes acceptable. |
| **PIN / biometric app lock** | **Skip for now.** Addresses exactly one threat — someone holding the already-unlocked phone. Does nothing against adb, root or a hostile import. Cheap to add later as *privacy* if wanted, but it is not security and must not be mistaken for it. |
| **Login / authorization** | **Skip.** No server, no second user, nothing to authorize against. Confirms the decision already recorded in [future_update.md](future_update.md), now on evidence rather than assumption. |
| **Photo credits** | **Still outstanding, still deferred.** The 167 bundled photos are CC BY / CC BY-SA / FAL and legally require attribution; the source data was never saved to the repo. Must be settled before the app is shared with anyone else. |

Also worth knowing, from the same review — these are **not** problems:
IndexedDB is properly sandboxed on a non-rooted phone (no other app can read
it); there is no network code in the app; the icon engine escapes every derived
label correctly; and apart from the keystore, no secrets exist anywhere in the
repo.

---

## Open questions

Resolved 2026-09-21: buzzers → new **Audio** major; isolation transformer →
new **Transformers** major; Phase 6 keeps all 45 candidates.

One still open, and it does not block Phase 1:

1. **The Home collection chart with 24 categories.** 24 segments is likely
   unreadable on a phone. Needs a decision: show a top N (say 6) with the rest
   grouped as "Other", or remove the chart from Home entirely.

---

## Status

| Phase | State |
|---|---|
| 1 — Backup integrity | Agreed, not built |
| 2 — Release build + signing | Agreed, not built. Blocked on Phase 1 shipping first |
| 3 — Import hardening | Agreed, not built |
| 4 — Two v3 bugs | Agreed, not built |
| 5 — Category tree | Agreed, not built. 24 majors and depth settled |
| 6 — Catalogue growth | Agreed, not built. All 45 additions kept, target ~298 |
| Code changes | **None made** — awaiting go-ahead |
