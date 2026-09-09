(() => {
  const stories = [
    {
      path: "/blog/posts/sam-ink-note-in-the-other-room.html",
      title: "The Note in the Other Room",
      published: "August 1, 2026",
      room: "Listening room"
    },
    {
      path: "/blog/posts/sam-ink-the-signal.html",
      title: "The Signal",
      published: "July 26, 2026",
      room: "First contact"
    },
    {
      path: "/blog/posts/sam-ink-starlight-map.html",
      title: "The Map Made of Starlight",
      published: "August 19, 2025",
      room: "Night journey"
    }
  ];

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const index = stories.findIndex(story => story.path === currentPath);
  const main = document.querySelector("main");
  if (index < 0 || !main) return;

  const current = stories[index];
  const previous = stories[index - 1];
  const next = stories[index + 1];
  const storyText = document.querySelector("article")?.textContent || main.textContent || "";
  const wordCount = storyText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 230))} min`;
  const arrow = direction => direction === "previous"
    ? '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m6 6-6-6 6-6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const route = (story, direction) => story
    ? `<a class="fiction-continuity__route" href="${story.path}" data-track="Fiction: ${direction} story"><span>${direction === "previous" ? "Previous room" : "Next room"}</span><strong>${story.title}</strong>${arrow(direction)}</a>`
    : `<div class="fiction-continuity__empty">${direction === "previous" ? "You are at the first open room." : "The next room is still being written."}</div>`;

  const section = document.createElement("section");
  section.className = "fiction-continuity";
  section.id = "sam-ink-continuity";
  section.setAttribute("aria-label", "Continue through Sam and Ink");
  section.innerHTML = `
    <div class="fiction-continuity__inner">
      <p class="fiction-continuity__label">Sam &amp; Ink · Story continuity</p>
      <dl class="fiction-continuity__meta">
        <div><dt>Story world</dt><dd>Sam &amp; Ink</dd></div>
        <div><dt>Published</dt><dd>${current.published}</dd></div>
        <div><dt>Reading time</dt><dd>${readingTime}</dd></div>
      </dl>
      <div class="fiction-continuity__routes">
        ${route(previous, "previous")}
        ${route(next, "next")}
      </div>
      <div class="fiction-continuity__close">
        <p>${current.room}. New stories arrive slowly.</p>
        <div class="fiction-continuity__links">
          <a href="/blog/fiction/sam-and-ink/" data-track="Fiction: return to Sam and Ink">Return to Sam &amp; Ink</a>
          <a href="https://basinandassociates.substack.com/subscribe?utm_source=basinleon.github.io&amp;utm_medium=owned&amp;utm_campaign=fiction&amp;utm_content=story-continuity" target="_blank" rel="noopener noreferrer" data-track="Fiction: subscribe">Receive the next story</a>
        </div>
      </div>
    </div>`;
  main.append(section);
})();
