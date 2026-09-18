(function () {
  "use strict";

  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-lb-contact-form]"));
  if (!forms.length) return;

  var endpoint = "https://basin-site-insights.basin-site-insights.workers.dev/v1/contact";

  function clean(value, max) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
  }

  function campaign() {
    if (window.lbInsightsCampaign) return window.lbInsightsCampaign;
    var params = new URLSearchParams(location.search);
    return {
      source: clean(params.get("utm_source"), 100),
      medium: clean(params.get("utm_medium"), 100),
      campaign: clean(params.get("utm_campaign"), 120),
      content: clean(params.get("utm_content"), 120)
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
        conversation_id: window.lbConversation ? window.lbConversation.ensure() : "",
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
        var result = await response.json();
        if (result.accepted !== true) throw new Error("not_accepted");
        form.reset();
        startedAt = Date.now();
        status.classList.add("is-success");
        status.textContent = "Received in Leon's private inbox. Thank you for writing.";
        if (window.lbInsightsRecord) {
          window.lbInsightsRecord("Conversion", {
            category: "Commercial intent",
            action: "contact-form-submit",
            destination: location.pathname,
            label: "Contact form submitted",
            region: "section"
          });
          if (payload.intent.toLowerCase() === "senior operating role") window.lbInsightsRecord("Hiring Funnel Step", {
            step: "email",
            destination: location.pathname,
            label: "Contact form submitted"
          });
        }
      } catch (_) {
        var subject = "[lb-site] " + payload.intent + " from " + payload.name;
        var body = [
          "Name: " + payload.name,
          "Email: " + payload.email,
          "Company: " + payload.company,
          "Intent: " + payload.intent,
          "Page: " + payload.page,
          "",
          "What is broken or changing:",
          payload.problem
        ].join("\n");
        var mailto = "mailto:lbasin23@gmail.com" +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        status.classList.add("is-error");
        status.textContent = "";
        var lead = document.createElement("span");
        lead.textContent = "Direct route: ";
        var link = document.createElement("a");
        link.href = mailto;
        link.textContent = "open your email app with everything prefilled";
        var tail = document.createElement("span");
        tail.textContent = " or write to lbasin23@gmail.com";
        status.appendChild(lead);
        status.appendChild(link);
        status.appendChild(tail);
      } finally {
        form.removeAttribute("aria-busy");
        submit.disabled = false;
      }
    });
  });
})();
