#!/usr/bin/env python3
"""Search Wikimedia Commons for a component photo and save the best candidate.

Usage:
    python3 scripts/fetch_image.py <item_id> "<search term>" ["<fallback term>" ...]

Saves to assets/raw_images/<item_id>.<ext> and prints a JSON result line.
Only Commons is used, so everything retrieved is openly licensed.
"""
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://commons.wikimedia.org/w/api.php"
UA = "BenchApp/1.0 (personal electronics inventory app; contact: local user)"
RAW = Path(__file__).resolve().parent.parent / "assets" / "raw_images"

# Commons has plenty of unrelated diagrams/schematics/logos; skip those.
BAD_WORDS = (
    "logo", "icon", "symbol", "schematic", "circuit diagram", "graph",
    "chart", "map", "signature", "coat of arms", "flag", "portrait",
)
GOOD_EXT = (".jpg", ".jpeg", ".png", ".webp")


def _get(url, attempts=5):
    """Fetch a URL, backing off when Commons rate-limits us.

    Several agents share this script concurrently, so 429/503 responses are
    routine rather than exceptional - retry patiently instead of failing.
    """
    delay = 2.0
    last = None
    for _ in range(attempts):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            last = e
            if e.code in (429, 503):
                retry_after = e.headers.get("Retry-After") if e.headers else None
                wait = float(retry_after) if (retry_after or "").isdigit() else delay
                time.sleep(min(wait, 30))
                delay = min(delay * 2, 30)
                continue
            raise
        except Exception as e:
            last = e
            time.sleep(delay)
            delay = min(delay * 2, 30)
    raise last if last else RuntimeError("fetch failed")


def search(term, limit=8):
    q = urllib.parse.urlencode({
        "action": "query", "generator": "search", "gsrsearch": term,
        "gsrnamespace": "6", "gsrlimit": str(limit), "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime", "iiurlwidth": "1000",
        "format": "json",
    })
    data = json.loads(_get(f"{API}?{q}"))
    pages = data.get("query", {}).get("pages", {})
    out = []
    for p in pages.values():
        info = (p.get("imageinfo") or [{}])[0]
        title = p.get("title", "")
        url = info.get("thumburl") or info.get("url")
        if not url:
            continue
        if not any(title.lower().endswith(e) for e in GOOD_EXT):
            continue
        if any(b in title.lower() for b in BAD_WORDS):
            continue
        if (info.get("width") or 0) < 250:
            continue
        out.append({
            "title": title,
            "url": url,
            "index": p.get("index", 99),
            "license": (info.get("extmetadata", {})
                        .get("LicenseShortName", {}).get("value", "unknown")),
            "descurl": info.get("descriptionurl", ""),
        })
    out.sort(key=lambda c: c["index"])
    return out


def fetch(item_id, terms):
    RAW.mkdir(parents=True, exist_ok=True)
    throttled = False          # distinguish "rate limited" from "genuinely absent"
    saw_candidates = False
    for term in terms:
        try:
            cands = search(term)
        except Exception as e:
            if isinstance(e, urllib.error.HTTPError) and e.code in (429, 503):
                throttled = True
            print(json.dumps({"id": item_id, "ok": False,
                              "error": f"search failed: {e}", "term": term}))
            time.sleep(1)
            continue
        saw_candidates = saw_candidates or bool(cands)
        for c in cands:
            try:
                blob = _get(c["url"])
            except Exception as e:
                if isinstance(e, urllib.error.HTTPError) and e.code in (429, 503):
                    throttled = True
                continue
            if len(blob) < 6000:          # too small to be a usable photo
                continue
            ext = Path(urllib.parse.urlparse(c["url"]).path).suffix.lower()
            if ext not in GOOD_EXT:
                ext = ".jpg"
            dest = RAW / f"{item_id}{ext}"
            dest.write_bytes(blob)
            print(json.dumps({
                "id": item_id, "ok": True, "file": dest.name,
                "term": term, "source": c["descurl"],
                "license": c["license"], "title": c["title"],
                "bytes": len(blob),
            }))
            return True
        time.sleep(0.5)
    # Be explicit about *why* nothing was saved: a throttled run is worth
    # retrying later, a genuine miss is not.
    if throttled:
        reason = ("RATE LIMITED - Commons throttled this request; the image may "
                  "well exist. Retry this id later rather than writing it off.")
    elif saw_candidates:
        reason = "candidates found but none downloadable/usable"
    else:
        reason = "no suitable candidate"
    print(json.dumps({"id": item_id, "ok": False, "error": reason,
                      "throttled": throttled, "terms": terms}))
    return False


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: fetch_image.py <item_id> <search term> [fallback ...]")
        sys.exit(2)
    fetch(sys.argv[1], sys.argv[2:])
