# Writing at the hub

The canonical post lives at `/blog/posts/`. Social posts point back to it.

To publish a new Sam & Ink fragment, prepare a JSON file outside the public checkout:

```json
{"status":"approved","date":"2026-10-10","slug":"fragment-08","title":"Your approved title","paragraphs":["Your approved writing."]}
```

Run `node scripts/publish-fragment.mjs /absolute/path/to/approved-fragment.json` from the site root. It creates the page, updates the latest fragments manifest and essay archive, and regenerates SEO feeds. Review the exact diff before committing and publishing. Existing pages are never overwritten.

Threads opens a prepared draft. Instagram and Substack copy a title and tracked canonical link, then offer the destination. They do not publish automatically. The source URL carries channel attribution, not personal data.

The hub retains existing Sam & Ink archive pieces until approved daily fragments exist. The Amazon button currently searches the confirmed book title and author. Replace it with the exact listing when supplied.
