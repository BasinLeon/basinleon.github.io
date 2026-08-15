(function () {
  "use strict";

  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-lb-contact-form]"));
  if (!forms.length) return;

  var endpoint = "https://basin-site-insights.basin-site-insights.workers.dev/v1/contact";

  function clean(value, max) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
  }

  function campaign() {
    var params = new URLSearchParams(location.search);
    return {
      source: clean(params.get("utm_source"), 100),
      medium: clean(params.get("utm_medium"), 100),
      campaign: clean(params.get("utm_campaign"), 120)
    };
  }

  forms.forEach(function (form) {
    var status = form.querySelector("[data-lb-contact-status]");
    var submit = form.querySelector("button[type=submit]");
    var startedAt = Date.now();

    form.addEventListener("focusin", function () {
      if (form.dataset.started === "1") return;
      form.dataset.started = "1";
      startedAt = Date.now();
      if (window.lbInsightsRecord) {
        window.lbInsightsRecord("Conversion", {
          category: "Commercial intent",
          action: "contact-form-start",
          destination: location.pathname,
          label: "Contact form started",
          region: "section"
        });
      }
    }, { once: true });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var payload = {
        v: 1,
        name: clean(data.get("name"), 100),
        email: clean(data.get("email"), 180),
        company: clean(data.get("company"), 140),
        intent: clean(data.get("intent"), 60),
        problem: clean(data.get("problem"), 2000),
        website: clean(data.get("website"), 120),
        startedAt: startedAt,
        page: location.pathname,
        referrer: document.referrer ? new URL(document.referrer, location.href).hostname : "",
        campaign: campaign()
      };

      form.setAttribute("aria-busy", "true");
      submit.disabled = true;
      status.className = "lb-contact-form__status";
      status.textContent = "Sending privately…";

      try {
        var response = await fetch(endpoint, {
          method: "POST",
          mode: "cors",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("send_failed");
        form.reset();
        startedAt = Date.now();
        status.classList.add("is-success");
        status.textContent = "Received. Leon will reply personally.";
        if (window.lbInsightsRecord) {
          window.lbInsightsRecord("Conversion", {
            category: "Commercial intent",
            action: "contact-form-submit",
            destination: location.pathname,
            label: "Contact form submitted",
            region: "section"
          });
          window.lbInsightsRecord("Hiring Funnel Step", {
            step: "email",
            destination: location.pathname,
            label: "Contact form submitted"
          });
        }
      } catch (_) {
        status.classList.add("is-error");
        status.textContent = "That did not send. Use Gmail, your email app, or copy the address below.";
      } finally {
        form.removeAttribute("aria-busy");
        submit.disabled = false;
      }
    });
  });
})();
