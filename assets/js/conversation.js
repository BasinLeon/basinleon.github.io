/**
 * lbConversation — one conversation_id per engaged journey.
 *
 * A conversation_id is created the moment a visitor actually engages:
 * completing the diagnostic, requesting their score by email, clicking a
 * session CTA, or submitting the contact intake. It is NOT created for
 * passive pageviews.
 *
 * The id is the join key between site analytics and Basin::Nexus — it lets
 * Leon answer: "which piece of my work created this relationship, and what
 * did that relationship become?"
 *
 * Format: conv-YYYYMMDD-xxxxxx  (e.g. conv-20260910-a3f9k2)
 * Storage: sessionStorage only. Random, contains no PII. A new id is minted
 * per browser session once engagement happens; it never follows the visitor
 * across sessions.
 */
(function () {
  "use strict";

  if (window.lbConversation) return;

  var KEY = "lb:conversation:id:v1";

  function randomPart() {
    var out = "";
    try {
      var bytes = new Uint32Array(4);
      (window.crypto || window.msCrypto).getRandomValues(bytes);
      for (var i = 0; i < bytes.length; i++) {
        out += bytes[i].toString(36);
      }
    } catch (_) {
      out = String(Math.random()).slice(2) + String(Date.now().toString(36));
    }
    return out.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 6) || "000000";
  }

  function todayStamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
  }

  function read() {
    try {
      return window.sessionStorage.getItem(KEY) || "";
    } catch (_) {
      return "";
    }
  }

  function get() {
    return read();
  }

  function ensure() {
    var id = read();
    if (!id) {
      id = "conv-" + todayStamp() + "-" + randomPart();
      try {
        window.sessionStorage.setItem(KEY, id);
      } catch (_) {
        // Engagement is still real even if the id cannot persist.
      }
    }
    return id;
  }

  window.lbConversation = { get: get, ensure: ensure };
})();
