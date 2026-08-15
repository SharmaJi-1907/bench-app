# Bench

Bench keeps track of the electronic parts you own, the ones you still need to
buy, and the projects you are building with them. Everything is stored on your
own phone — no account, no sign-in, no internet needed, nothing sent anywhere.

It is a web app wrapped into a real Android app, built for you automatically by
GitHub. See [BUILD-ON-PHONE.md](BUILD-ON-PHONE.md) to build it using only your
phone, no computer required.

## What it does

- **Browse a catalogue** of 250+ common components — tools, resistors,
  capacitors, transistors, chips, sensors, boards, motors and more. Most parts
  show a real photograph; the rest show a hand-drawn illustration.
- **Track what you own** — mark parts as *I have it* or *Need to buy*, with
  quantity, condition, whether you have tested it, and where you keep it.
- **Plan projects** — a project holds a parts list, and Bench tells you which
  parts you are missing.
- **Pin your go-to parts** to the Home screen, so the things you reach for most
  are always one tap away.
- **Add your own parts** that are not in the catalogue, with your own photo.
- **Back up and restore** everything to a single file.

## Using it

**Home** shows the parts you pinned, a chart of your collection by category,
your projects, and anything that needs attention (untested or damaged).

**Stock** is everything you own. **To Buy** is your shopping list. **Projects**
is what you are building. **All** is the full catalogue, as a list or a photo
grid.

A few things worth knowing:

- Swipe a row sideways for a quick action — remove from stock, or mark as
  bought.
- Tap the small arrows on a row to change quantity or status without opening
  the part.
- Open a part and tap the star to pin it to Home.
- Tap the camera badge on any part to replace its picture with your own photo.
- Light and dark themes follow your phone, or you can force one in **Settings**
  (the gear icon, top right).

## What is in this project

```
bench-app/
├── index.html                  the page shell — loads everything below
├── css/
│   ├── style.css               all the styling, colours and layout
│   └── views-grid.css          styling for the catalogue grid view
├── js/
│   ├── icons.js                hand-drawn part illustrations
│   ├── catalog.js              the built-in parts database
│   ├── store.js                saving/loading your data, app state
│   ├── views.js                the five main screens
│   ├── detail.js               part pages, add form, project pages, settings
│   ├── photos.js               which parts have a bundled photo (generated)
│   ├── io.js                   backup, restore, share
│   └── main.js                 startup and the Android back button
├── assets/
│   ├── processed_images/       the component photos the app ships with
│   ├── icon.svg                app icon
│   └── splash.svg              launch screen
├── scripts/                    tools for fetching and preparing photos
├── docs/                       how the app is designed, built and tested
└── .github/workflows/          the recipe GitHub follows to build the APK
```

Your data lives on the phone in the browser's own storage — it is not in any of
these files, so updating the app never touches it.

## Making changes

1. **Edit** a file — the styling lives in `css/`, the screens in `js/`.
2. **Commit** it to the `main` branch.
3. **GitHub builds it** automatically, about 5 minutes.
4. **Install** the new `Bench.apk` from the **Releases** page, over the old one.

Your parts, projects and photos survive updates. The build reuses the same
signing key each time, which is what allows Android to install over the
existing app instead of refusing.

The app name and app ID are near the top of
`.github/workflows/build-apk.yml`. You can rename the app whenever you like,
but **never change the app ID** — Android would treat it as a completely
different app and your data would not carry over.

Still worth doing occasionally: **Settings → Export backup**, and keep the file
somewhere safe. It is the only real safety net.

## Adding more component photos

Photos come from [Wikimedia Commons](https://commons.wikimedia.org), so they are
openly licensed. To add more:

```bash
python3 scripts/fetch_image.py <part-id> "search term" "backup search term"
python3 scripts/process_images.py        # trims, squares and compresses
python3 scripts/build_photo_manifest.py  # tells the app what exists
```

Check every image with your own eyes before keeping it — searches confidently
return the wrong thing. Real examples from building this: a soldering iron
*stand* instead of the iron, Predator drones for a gas sensor, and a Renoir
painting for a transistor.

You can also just drop your own picture into `assets/raw_images/` named after
the part id (`t1.jpg`), then run the last two commands.

## For developers

`docs/` holds the working documents: what the app is for and what is
deliberately out of scope (`PRD.md`), how it is put together (`TRD.md`), the
design rules and why certain popular trends were rejected
(`DESIGN-SYSTEM.md`), and how changes are verified (`TEST-PLAN.md`).

Two things that will bite you if you skip them:

- **The build must copy `assets/` into `www/`.** Without it, photos work
  perfectly in a browser and are broken on the phone.
- **Test with real timing when checking that something saves.** Chrome's
  headless virtual-time mode makes database writes hang, so tests can pass
  while nothing was actually saved. `docs/TEST-PLAN.md` explains this.
