# Leon Basin · Website and Writing Library

The source for [basinleon.github.io](https://basinleon.github.io/): my public operating record, selected GTM systems, essays, and fiction.

[Visit the site](https://basinleon.github.io/) · [Writing Library](https://basinleon.github.io/blog/) · [GTM Systems](https://basinleon.github.io/gtm-systems/) · [Résumé](https://basinleon.github.io/resume.html)

![The Writing Library with two reading choices](assets/img/github-writing-library.jpg)

## Explore

| Destination | What you will find |
| --- | --- |
| Writing Library | Essays, field notes, curated reading paths, and Sam & Ink fiction |
| GTM Systems | How I build and run a commercial motion |
| Basin::Nexus | A walkthrough of signal, judgment, and commercial action |
| Case studies | Company-level summaries of the problem, ownership, and results |
| Build Record | A concise career chronology |

## Preview locally

Requires Python 3. From the repository root:

```sh
python3 -m http.server 4193 --bind 127.0.0.1
```

Open `http://127.0.0.1:4193/` or `/blog/`. Most public pages are static HTML, CSS, and JavaScript. GitHub Actions assembles the static site and the Jekyll documentation before deploying to GitHub Pages.

## Validate changes

```sh
python3 scripts/validate-blog-links.py
python3 scripts/check-performance-budget.py
python3 scripts/validate-public-safety.py
```

Check rendered layouts on phone, tablet, and desktop sizes and in Chrome and WebKit. Browser emulation does not replace checks on physical devices.

## Publishing boundaries

Career claims belong in the approved public record. Customer records, contact submissions, unpublished proof, credentials, and database exports stay private. Contact forms deliver to a separate private first-party intake. Analytics respect owner exclusion, Do Not Track, and Global Privacy Control.

Built and maintained by Leon Basin.
