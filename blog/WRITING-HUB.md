# Writing at the hub

The canonical post lives at `/blog/posts/`. Social posts point back to it.

To publish a new Sam & Ink fragment, prepare a JSON file outside the public checkout:

```json
{"status":"approved","date":"2026-10-10","slug":"fragment-08","title":"Your approved title","paragraphs":["Your approved writing."],"video":"/assets/video/fragments/fragment-10-title.mp4","poster":"/assets/video/fragments/fragment-10-cover.jpg"}
```

Run `node scripts/publish-fragment.mjs /absolute/path/to/approved-fragment.json` from the site root. It creates the page, updates the latest fragments manifest and essay archive, and synchronizes the hero, both numbered shelves, every previous/next link, reading times, RSS and fragment sitemap entries. The reel must already exist in the checkout; the poster is optional. No video autoplays, and it is not downloaded until requested. Review the exact diff before committing and publishing. Existing pages are never overwritten.

Threads opens a prepared draft. Instagram and Substack copy a title and tracked canonical link, then offer the destination. They do not publish automatically. The source URL carries channel attribution, not personal data.

The hub retains existing Sam & Ink archive pieces until approved daily fragments exist. The Amazon button uses Leon’s confirmed listing: https://www.amazon.com/dp/B0CB9PWL5X.

To reconcile existing published pages after a manual import, run `python3 scripts/sync-fragments.py`. It preserves their writing and video blocks. Feed updates retain unrelated entries and do not run the broad SEO generator.

Public career numbers must appear on the verified resume or have a separate explicit verification record. Unverified claims remain unpublished.
