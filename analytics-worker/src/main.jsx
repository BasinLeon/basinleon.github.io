import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const EMPTY = {
  summary: { unique_visitors: 0, visits: 0, engaged_visits: 0, conversion_actions: 0 },
  trend: [],
  landing_pages: [],
  sources: [],
  conversions: [],
  hiring_funnel: [],
  reading_completion: [],
  returning_visitors: 0,
  retention_days: 400
};

const INTENTS = ["Commercial intent", "Operating interest", "Reader interest"];
const HIRING_STEPS = [
  { step: "homepage", label: "Homepage" },
  { step: "resume", label: "Résumé" },
  { step: "case-study", label: "Case study" },
  { step: "email", label: "Email action" }
];
const DEPTHS = [
  { depth: 25, label: "Started" },
  { depth: 50, label: "Skimmed" },
  { depth: 75, label: "Deep read" },
  { depth: 100, label: "Completed" }
];
const DISTRIBUTION_LINKS = [
  { label: "LinkedIn", source: "linkedin", medium: "social" },
  { label: "X", source: "x", medium: "social" },
  { label: "Email signature", source: "email-signature", medium: "signature", campaign: "always-on" },
  { label: "Introduction", source: "direct-intro", medium: "introduction" }
];

function number(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function Metric({ label, value, note }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{number(value)}</strong>
      <small>{note}</small>
    </div>
  );
}

function trackedLink(item) {
  const month = new Date().toISOString().slice(0, 7);
  const url = new URL("https://basinleon.github.io/");
  url.searchParams.set("utm_source", item.source);
  url.searchParams.set("utm_medium", item.medium);
  url.searchParams.set("utm_campaign", item.campaign || `${month}-site`);
  return url.toString();
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

function QuickActions() {
  const [copied, setCopied] = useState("");

  async function copy(item) {
    await copyText(trackedLink(item));
    setCopied(item.label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <section className="quick-actions" aria-label="Owner and distribution controls">
      <div className="owner-action">
        <div><h2>Owner browser</h2><p>Keep your own visits out of the numbers.</p></div>
        <button onClick={() => window.location.assign("https://basinleon.github.io/?lb_owner=1")}>Exclude this browser</button>
      </div>
      <div className="distribution-action">
        <div><h2>Tracked links</h2><p>Copy the homepage link for each channel.</p></div>
        <div className="channel-buttons">
          {DISTRIBUTION_LINKS.map((item) => (
            <button key={item.label} onClick={() => copy(item)} aria-label={`Copy ${item.label} tracked link`}>
              {copied === item.label ? "Copied" : item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sparkline({ data }) {
  const values = data.map((item) => Number(item.visits || 0));
  const max = Math.max(1, ...values);
  const points = values.length
    ? values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${76 - (value / max) * 64}`).join(" ")
    : "0,76 100,76";
  const labels = data.length ? [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]] : [];
  return (
    <div className="chart-wrap" aria-label="Visits over time">
      <svg className="chart" viewBox="0 0 100 84" preserveAspectRatio="none" role="img">
        {[12, 28, 44, 60, 76].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} />)}
        <polyline points={points} />
      </svg>
      {values.every((value) => value === 0) && <div className="chart-empty">Collecting first-party events</div>}
      <div className="chart-labels">
        {labels.map((item) => <span key={item.day}>{new Date(`${item.day}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>)}
      </div>
    </div>
  );
}

function RankedList({ title, rows, nameKey, emptyLabel }) {
  const display = rows.length ? rows : [{ [nameKey]: emptyLabel, visits: 0 }];
  return (
    <section className="ranked panel">
      <h2>{title}</h2>
      <div className="table-head"><span>{nameKey === "page" ? "Page" : "Source / campaign"}</span><span>Visits</span></div>
      <ol>
        {display.slice(0, 6).map((row, index) => (
          <li key={`${row[nameKey]}-${index}`}>
            <span className="rank">{index + 1}</span>
            <span className="row-name">{row[nameKey]}</span>
            <strong>{number(row.visits)}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

function IntentPanel({ conversions }) {
  const counts = new Map(conversions.map((item) => [item.category, Number(item.actions || 0)]));
  const total = [...counts.values()].reduce((sum, item) => sum + item, 0);
  return (
    <section className="panel intent-panel">
      <h2>Conversion intent</h2>
      <div className="table-head"><span>Intent group</span><span>Actions</span></div>
      <div className="bars">
        {INTENTS.map((label) => {
          const value = counts.get(label) || 0;
          const percent = total ? Math.round((value / total) * 100) : 0;
          return <div className="bar-row" key={label}>
            <span>{label}</span><strong>{number(value)}</strong>
            <i><b style={{ width: `${percent}%` }} /></i><em>{percent}%</em>
          </div>;
        })}
      </div>
    </section>
  );
}

function ReadingPanel({ rows, visits }) {
  const counts = new Map(rows.map((item) => [Number(item.depth), Number(item.visits || 0)]));
  return (
    <section className="panel reading-panel">
      <h2>Reading completion</h2>
      <div className="table-head"><span>Reading depth</span><span>Visits</span></div>
      <ol>
        {DEPTHS.map((item, index) => {
          const value = counts.get(item.depth) || 0;
          const percent = visits ? Math.round((value / visits) * 100) : 0;
          return <li key={item.depth}>
            <span className="rank">{index + 1}</span><span className="row-name">{item.label} (≥ {item.depth}%)</span>
            <strong>{number(value)}</strong><em>{percent}%</em>
          </li>;
        })}
      </ol>
    </section>
  );
}

function HiringFunnel({ rows }) {
  const counts = new Map(rows.map((item) => [item.step, Number(item.actions || 0)]));
  const homepage = counts.get("homepage") || 0;
  return (
    <section className="panel hiring-panel">
      <h2>Hiring-manager path</h2>
      <div className="table-head"><span>Step</span><span>Sessions</span></div>
      <ol>
        {HIRING_STEPS.map((item, index) => {
          const value = counts.get(item.step) || 0;
          const percent = homepage ? Math.round((value / homepage) * 100) : 0;
          return <li key={item.step}>
            <span className="rank">{index + 1}</span><span className="row-name">{item.label}</span>
            <strong>{number(value)}</strong><em>{percent}%</em>
          </li>;
        })}
      </ol>
    </section>
  );
}

function Login({ onUnlock, error, busy }) {
  const [token, setToken] = useState("");
  return (
    <main className="login-shell">
      <form onSubmit={(event) => { event.preventDefault(); onUnlock(token); }}>
        <h1>Site Traffic</h1>
        <p>Private measurement for basinleon.github.io.</p>
        <label htmlFor="owner-token">Owner token</label>
        <input id="owner-token" type="password" autoComplete="current-password" value={token} onChange={(event) => setToken(event.target.value)} autoFocus />
        {error && <div className="form-error" role="alert">{error}</div>}
        <button disabled={!token || busy}>{busy ? "Verifying…" : "Unlock dashboard"}</button>
        <small>No raw IPs · 400-day retention · DNT respected</small>
      </form>
    </main>
  );
}

function Dashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem("lb:owner-token") || "");
  const [days, setDays] = useState(30);
  const [data, setData] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(Boolean(token));

  async function load(nextToken = token, nextDays = days) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/v1/dashboard?days=${nextDays}`, { headers: { authorization: `Bearer ${nextToken}` } });
      if (response.status === 401) throw new Error("That owner token was not accepted.");
      if (!response.ok) throw new Error("The dashboard could not load. Try again in a moment.");
      const payload = await response.json();
      sessionStorage.setItem("lb:owner-token", nextToken);
      setToken(nextToken);
      setData({ ...EMPTY, ...payload, summary: { ...EMPTY.summary, ...(payload.summary || {}) } });
    } catch (caught) {
      sessionStorage.removeItem("lb:owner-token");
      setToken("");
      setError(caught.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { if (token) load(token, days); }, []);
  const summary = data.summary;
  const collecting = Number(summary.visits || 0) === 0;
  const returningPercent = useMemo(() => summary.unique_visitors
    ? Math.round((data.returning_visitors / Number(summary.unique_visitors)) * 100)
    : 0, [data.returning_visitors, summary.unique_visitors]);

  if (!token) return <Login onUnlock={(value) => load(value, days)} error={error} busy={busy} />;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="https://basinleon.github.io">LEON <span>BASIN.</span></a>
        <div><span className="secure">Private owner view</span><button onClick={() => { sessionStorage.removeItem("lb:owner-token"); setToken(""); }}>Lock dashboard</button></div>
      </header>
      <main>
        <section className="intro">
          <div><h1>Site Traffic</h1><p>Owned, privacy-safe measurement for basinleon.github.io</p></div>
          <nav aria-label="Date range">
            {[7, 30, 90, 365].map((value) => <button className={days === value ? "active" : ""} key={value} onClick={() => { setDays(value); load(token, value); }}>{value === 365 ? "1 year" : `${value} days`}</button>)}
          </nav>
        </section>

        <section className="metrics" aria-busy={busy}>
          <Metric label="Unique visitors" value={summary.unique_visitors} note={collecting ? "Collecting first-party events" : `Last ${days} days`} />
          <Metric label="Visits" value={summary.visits} note={collecting ? "Collecting first-party events" : `Last ${days} days`} />
          <Metric label="Engaged visits" value={summary.engaged_visits} note={collecting ? "Collecting first-party events" : "15+ active seconds"} />
          <Metric label="Conversion actions" value={summary.conversion_actions} note={collecting ? "Collecting first-party events" : "Commercial, operating, reader"} />
        </section>

        <QuickActions />

        <section className="primary-grid">
          <section className="trend panel"><h2>Traffic over time</h2><Sparkline data={data.trend} /></section>
          <RankedList title="Top landing pages" rows={data.landing_pages} nameKey="page" emptyLabel="No landing pages yet" />
        </section>

        <section className="detail-grid">
          <RankedList title="Sources & campaigns" rows={data.sources} nameKey="source" emptyLabel="No sources yet" />
          <IntentPanel conversions={data.conversions} />
          <HiringFunnel rows={data.hiring_funnel || []} />
          <ReadingPanel rows={data.reading_completion} visits={Number(summary.visits || 0)} />
          <section className="panel returning">
            <h2>Returning visitors</h2>
            <div><span>Anonymous repeat visitors</span><strong>{number(data.returning_visitors)}</strong><small>{returningPercent}% of unique visitors</small></div>
          </section>
        </section>
        <footer>No raw IPs · {data.retention_days || 400}-day retention · DNT respected</footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Dashboard />);
