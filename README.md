# Leon Basin · Founding GTM Dossier & Writing Library

The source for [basinleon.github.io](https://basinleon.github.io/): Founding GTM operating record, GTM systems, interactive instruments, essays, and fiction.

[Visit the site](https://basinleon.github.io/) · [GTM Systems](https://basinleon.github.io/gtm-systems/) · [Case Studies](https://basinleon.github.io/case-studies/) · [Tool Bench](https://basinleon.github.io/tools/) · [Writing Library](https://basinleon.github.io/blog/) · [Résumé](https://basinleon.github.io/resume.html) · [Contact](https://basinleon.github.io/#contact)

![The Writing Library with two reading choices](assets/img/github-writing-library.jpg)

## Explore

| Destination | What you will find |
| --- | --- |
| [GTM Systems](https://basinleon.github.io/gtm-systems/) | How I build and run a repeatable commercial motion, including the First-90-Days blueprint |
| [Case Studies](https://basinleon.github.io/case-studies/) | Operating records across Fudo Security ($2M+ partner pipeline), Sense ($10M+ qualified pipeline), SurveyMonkey ($300K+ expansion), and Obvio.ai |
| [Basin::Nexus](https://basinleon.github.io/basin-nexus/) | Walkthrough of signal capture, judgment, commercial action, and learning loop |
| [The Tool Bench](https://basinleon.github.io/tools/) | Browser-runnable Signal Architect, GTM Motion Diagnostic, Revenue Architecture Simulator, and NEXUS::CRM |
| [Operator Q&A](https://basinleon.github.io/answers/) | 12 direct answers on revenue architecture, P0–P3 priority logic, and SDR ramp compression |
| [Writing Library](https://basinleon.github.io/blog/) | 102 essays, field notes, curated reading paths, Plays, and Sam & Ink fiction |

## Try an interactive tool

[Signal Architect](https://basinleon.github.io/signal-architect/) lets visitors edit fictional account signals and inspect the keyword rules behind a priority tier. Inputs stay in the browser. [Python prototype](https://github.com/BasinLeon/gtm-signal-architect).

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
