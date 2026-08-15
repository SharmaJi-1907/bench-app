# Bench — build the APK from your phone

No computer. No Android Studio. No USB cable. GitHub builds it for you and gives
you a finished `.apk` to tap and install.

Time: about 15 minutes the first time, then 5 minutes for every rebuild.
Cost: free.

You need: `index.html` saved on your phone, and a browser.

---

## 1. Make a GitHub account

Go to **github.com** → **Sign up**. Email, password, username, verify. That's it.

## 2. Make a repository

1. Tap your profile picture (top right) → **Your repositories** → **New**.
2. Repository name: `bench-app`
3. Choose **Private**. (Public also works and is unlimited, but private keeps
   your build to yourself. Private repos get 2000 free build minutes a month —
   you will use about 5.)
4. Tick **Add a README file**.
5. Tap **Create repository**.

## 3. Upload index.html

1. On the repository page, tap **Add file** → **Upload files**.
2. Tap **choose your files** and pick `index.html` from your phone.
3. Scroll down, tap **Commit changes**.

The file must sit in the top folder and must be named exactly `index.html`.
Not `index (1).html`. Not inside a folder. If your phone renamed it on
download, rename it before uploading.

## 4. Add the build instructions

1. Tap **Add file** → **Create new file**.
2. In the filename box type exactly:

   ```
   .github/workflows/build-apk.yml
   ```

   The slashes make folders automatically as you type.
3. In the big box below, paste everything from the `build-apk.yml` file I gave
   you. (Open it, select all, copy, paste here.)
4. Scroll down, tap **Commit changes**.

That's the whole setup. The build starts by itself.

## 5. Wait for the build

1. Tap the **Actions** tab at the top of the repository. On a narrow phone
   screen it may be hidden behind a **⋯** or a small menu icon.
2. You will see a run called **Build APK** with a yellow dot (running).
3. Wait about 4–6 minutes. Pull down to refresh. Yellow dot becomes a green
   tick when it is done.

The first build is the slowest. It downloads Android's build tools each time,
so later builds take about the same — it's normal.

## 6. Install it

1. Go back to the repository main page (**Code** tab).
2. On the right side (or scroll to the bottom on a phone) find **Releases** and
   tap **latest**.
3. Under **Assets**, tap **Bench.apk**. It downloads.
4. Open the download. Android will say it can't install from unknown sources —
   tap **Settings**, turn on **Allow from this source**, go back, tap
   **Install**.

Bench is now on your home screen.

---

## When you change index.html later

1. Repository → tap `index.html` → the pencil ✏️ icon → paste your new version →
   **Commit changes**.

   Or: **Add file** → **Upload files** → pick the new `index.html` → it replaces
   the old one.
2. The build starts by itself. Wait 5 minutes.
3. Releases → **latest** → **Bench.apk** → install over the old app.

**Your parts, photos and projects survive the update.** The build reuses the
same signing key every time, which is what lets Android install the new version
over the old one instead of refusing. A file called `debug.keystore` will appear
in your repository after the first build — leave it alone. If you delete it, the
next APK cannot install over the old app and you would have to uninstall first,
which erases everything.

Still: use **More → Export backup** now and then and keep the JSON file in
Drive. That is the only real safety net.

---

## If the build fails (red ✗)

Tap the failed run → tap **build** → the red step opens and shows the reason.
The usual causes:

| What you see | What it means |
|---|---|
| `index.html was not found in the top folder` | The file is missing, misspelled, or inside a folder. Upload it again to the top level. |
| The run never starts | You are on the **Code** tab, not **Actions**. Or the file path was typed wrong — it must be `.github/workflows/build-apk.yml`, with the dot at the front. |
| A red ✗ on a step you don't understand | Tap **Actions** → **Build APK** → **Run workflow** → **Run workflow** to try again. Cloud builds sometimes fail for network reasons and pass on a retry. |

To start a build by hand at any time: **Actions** → **Build APK** (left side) →
**Run workflow** → **Run workflow**.

---

## Changing the app name or icon

Open `.github/workflows/build-apk.yml`, tap ✏️, and edit these two lines near
the top:

```yaml
  APP_NAME: Bench
  APP_ID: com.bench.inventory
```

`APP_NAME` is what shows under the icon. `APP_ID` must stay in the
`something.something.something` form.

**Careful:** if you change `APP_ID` later, Android treats it as a completely
different app. It installs beside the old one and starts empty. Pick it now and
keep it.

The icon is Capacitor's default. Changing it needs image files at several sizes
inside the Android project, which this setup does not keep between builds — tell
me if you want that added.

---

## What this does not do

This is a debug-signed APK. Perfect for your own phone and for sharing the file
with friends. It cannot be uploaded to the Play Store — that needs a release
build with your own private keystore and a $25 developer account. Ask me if you
ever want that; the same workflow can do it with a few more lines.
