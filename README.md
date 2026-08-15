# Bench

Bench is a small app for keeping track of your electronic parts (resistors,
capacitors, ICs, and so on), the projects you build with them, and photos of
your work. It is one single web page, and it can also be turned into an
Android app (APK) that installs on your phone.

See [BUILD-ON-PHONE.md](BUILD-ON-PHONE.md) for how to turn it into an app
using only your phone — no computer needed.

## What is in this project

Just three files. Nothing complicated.

```
bench-app/
├── index.html                      the whole app (all in one file)
├── .github/workflows/build-apk.yml  tells GitHub how to build the APK
└── BUILD-ON-PHONE.md               step-by-step guide to build from a phone
```

- **index.html** — This is Bench itself. All the screens, all the code, all
  the style, in one file. Your data (parts, projects, photos) is saved on
  your own phone, not sent anywhere.
- **.github/workflows/build-apk.yml** — A recipe that GitHub follows by
  itself. Every time `index.html` changes, GitHub wraps it into a real
  Android app and hands you back a `.apk` file to install.
- **BUILD-ON-PHONE.md** — The instructions for doing all of this from a
  phone browser, no laptop required.

## How the project grows over time

This project changes in a simple loop, one step at a time:

1. **Edit** — You open `index.html` on GitHub and change something (add a
   feature, fix a bug, tweak the look).
2. **Commit** — You save that change with a short note about what you did.
3. **Build** — GitHub notices the change and automatically builds a new APK.
   You don't have to do anything for this step, it just happens.
4. **Release** — The finished `Bench.apk` shows up under **Releases** on
   GitHub.
5. **Install** — You download that APK on your phone and install it over the
   old one. Your parts, photos, and projects are kept — nothing is lost.

Then the loop starts again whenever you want to change something else. The
app name and app ID live near the top of `build-apk.yml` — change the name
whenever you like, but keep the app ID the same forever, or Android will
treat it as a brand new app and your old data won't carry over.
