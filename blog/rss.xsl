<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:atom="http://www.w3.org/2005/Atom">
    <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat"/>

    <xsl:template match="/rss/channel">
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>The Archive / RSS | Leon Basin</title>
                <style><![CDATA[
                    :root {
                        --ink: #070706;
                        --paper: #f1eee7;
                        --white: #fffdf8;
                        --gold: #d9ab45;
                        --muted: #aaa398;
                        --line: rgba(255,255,255,.14);
                        --max: 1140px;
                    }
                    * { box-sizing: border-box; }
                    html { color-scheme: dark; }
                    body {
                        margin: 0;
                        background: var(--ink);
                        color: var(--white);
                        font-family: Inter, "Helvetica Neue", Arial, sans-serif;
                        line-height: 1.5;
                        -webkit-font-smoothing: antialiased;
                    }
                    a { color: inherit; }
                    ::selection { background: var(--gold); color: var(--ink); }
                    .shell { width: min(calc(100% - 2.5rem), var(--max)); margin: 0 auto; }
                    header { border-bottom: 1px solid var(--line); }
                    nav { min-height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
                    .brand { font-size: .82rem; font-weight: 800; letter-spacing: .08em; text-decoration: none; }
                    .brand span { color: var(--gold); }
                    nav .back { color: var(--muted); font-size: .76rem; font-weight: 700; text-decoration: none; }
                    nav .back:hover { color: var(--gold); }
                    .hero {
                        position: relative;
                        overflow: hidden;
                        padding: clamp(5rem, 12vw, 9rem) 0 clamp(4rem, 9vw, 7rem);
                        border-bottom: 1px solid var(--line);
                    }
                    .hero::after {
                        content: "RSS";
                        position: absolute;
                        right: -2vw;
                        bottom: -5vw;
                        color: rgba(217,171,69,.08);
                        font-size: min(30vw, 25rem);
                        font-weight: 900;
                        letter-spacing: -.1em;
                        line-height: .8;
                        pointer-events: none;
                    }
                    .eyebrow { margin: 0 0 1.2rem; color: var(--gold); font-family: monospace; font-size: .66rem; letter-spacing: .16em; text-transform: uppercase; }
                    h1 { max-width: 850px; margin: 0; font-size: clamp(3.6rem, 10vw, 8.5rem); line-height: .82; letter-spacing: -.075em; }
                    .hero-copy { max-width: 640px; margin: 2rem 0 0; color: var(--muted); font-size: 1rem; }
                    .subscribe {
                        display: grid;
                        grid-template-columns: minmax(0, .8fr) minmax(300px, 1.2fr);
                        gap: 3rem;
                        align-items: center;
                        padding: 2.5rem 0;
                        border-bottom: 1px solid var(--line);
                    }
                    .subscribe strong { font-size: 1.15rem; }
                    .subscribe p { margin: .35rem 0 0; color: var(--muted); font-size: .84rem; }
                    .feed-url { padding: 1rem 1.1rem; border: 1px solid var(--line); color: var(--gold); font-family: monospace; font-size: .75rem; overflow-wrap: anywhere; user-select: all; }
                    main { padding: clamp(4rem, 8vw, 7rem) 0; }
                    .section-head { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 2.5rem; }
                    h2 { margin: 0; font-size: clamp(2.2rem, 5vw, 4.5rem); letter-spacing: -.06em; line-height: .92; }
                    .count { color: var(--muted); font-family: monospace; font-size: .64rem; letter-spacing: .12em; text-transform: uppercase; }
                    .items { border-top: 1px solid var(--line); }
                    article { display: grid; grid-template-columns: 145px 1fr 24px; gap: clamp(1rem, 4vw, 3.5rem); padding: 2rem 0; border-bottom: 1px solid var(--line); }
                    time { color: var(--gold); font-family: monospace; font-size: .63rem; letter-spacing: .08em; text-transform: uppercase; }
                    h3 { margin: 0; font-size: clamp(1.3rem, 2.4vw, 2rem); line-height: 1.12; letter-spacing: -.035em; }
                    h3 a { text-decoration: none; }
                    h3 a:hover { color: var(--gold); }
                    article p { max-width: 750px; margin: .8rem 0 0; color: var(--muted); font-size: .88rem; }
                    .arrow { color: var(--gold); font-size: 1.3rem; }
                    footer { padding: 2.5rem 0; border-top: 1px solid var(--line); color: var(--muted); font-size: .7rem; }
                    footer .shell { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
                    footer a { color: var(--gold); text-decoration: none; }
                    @media (max-width: 680px) {
                        .subscribe { grid-template-columns: 1fr; gap: 1.2rem; }
                        article { grid-template-columns: 1fr 20px; gap: .8rem; }
                        article time { grid-column: 1 / -1; }
                        .section-head, footer .shell { align-items: flex-start; flex-direction: column; }
                    }
                ]]></style>
            </head>
            <body>
                <header>
                    <nav class="shell">
                        <a class="brand" href="/">LEON <span>BASIN.</span></a>
                        <a class="back" href="/blog/">Back to The Archive &#8599;</a>
                    </nav>
                </header>

                <section class="hero">
                    <div class="shell">
                        <p class="eyebrow">The Archive / Syndication feed</p>
                        <h1>Follow the signal.</h1>
                        <p class="hero-copy">This is the RSS feed for Leon Basin's archive: essays and field notes on systems, revenue, AI, leadership, memory, and the human layer beneath the work.</p>
                    </div>
                </section>

                <section class="shell subscribe">
                    <div>
                        <strong>Subscribe in any RSS reader.</strong>
                        <p>Copy the feed address, then add it to Feedly, NetNewsWire, Inoreader, Reeder, or the reader you already use.</p>
                    </div>
                    <div class="feed-url">https://basinleon.github.io/blog/rss.xml</div>
                </section>

                <main class="shell">
                    <div class="section-head">
                        <div>
                            <p class="eyebrow">Latest dispatches</p>
                            <h2>From the archive.</h2>
                        </div>
                        <div class="count"><xsl:value-of select="count(item)"/> entries in this feed</div>
                    </div>
                    <div class="items">
                        <xsl:for-each select="item">
                            <article>
                                <time><xsl:value-of select="substring(pubDate, 1, 16)"/></time>
                                <div>
                                    <h3><a href="{link}"><xsl:value-of select="title"/></a></h3>
                                    <p><xsl:value-of select="description"/></p>
                                </div>
                                <span class="arrow" aria-hidden="true">&#8600;</span>
                            </article>
                        </xsl:for-each>
                    </div>
                </main>

                <footer>
                    <div class="shell"><span>&#169; 2026 Leon Basin</span><a href="/blog/">Read The Archive</a></div>
                </footer>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
