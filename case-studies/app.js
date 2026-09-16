"use strict";

const menuButton = document.querySelector(".menu-toggle");
const primaryLinks = document.querySelector("#primary-links");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (menuButton && primaryLinks) {
  const closeMenu = () => {
    primaryLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  menuButton.addEventListener("click", () => {
    const open = primaryLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  primaryLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
}

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
  revealItems.forEach(item => revealObserver.observe(item));
}

const recordLinks = [...document.querySelectorAll(".record-nav a[data-record]")];
const recordSections = [...document.querySelectorAll("[data-record-section]")];
if ("IntersectionObserver" in window) {
  const recordObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const record = visible.target.dataset.recordSection;
    recordLinks.forEach(link => link.classList.toggle("active", link.dataset.record === record));
  }, { rootMargin: "-20% 0px -58% 0px", threshold: [0, 0.1, 0.3] });
  recordSections.forEach(section => recordObserver.observe(section));
}
