-- 🏛️ NEXUS MASTER DATABASE SCHEMA
-- Purpose: Centralized Command Base for Opportunities, Signals, and Triad Logs.

-- 1. OPPORTUNITIES (The Deal Flow)
CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT,
    stage TEXT DEFAULT 'SUGGESTED',
    priority TEXT DEFAULT 'MEDIUM',
    potential_revenue REAL DEFAULT 0.0,
    probability REAL DEFAULT 0.1,
    contact_name TEXT,
    next_action TEXT,
    source TEXT, -- LinkedIn, TrueUp, HN
    last_activity DATE DEFAULT CURRENT_DATE,
    tags TEXT -- JSON array: ["GTM", "AI", "RevOps"]
);

-- 2. SIGNALS (The Inhale)
CREATE TABLE IF NOT EXISTS signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL, -- Reddit, X, HN, TrueUp, Google News
    content TEXT,
    sentiment TEXT,
    relevance_score INTEGER DEFAULT 0, -- 1 to 10
    action_taken INTEGER DEFAULT 0, -- 0: Pending, 1: Processed
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMMUNICATIONS (The Exhale)
CREATE TABLE IF NOT EXISTS communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id INTEGER,
    channel TEXT NOT NULL, -- Email, Telegram, Moltbook, X
    content TEXT,
    direction TEXT, -- INBOUND, OUTBOUND
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities (id)
);

-- 4. APPRENTICE RECURSIVE LOGS (The Learning)
CREATE TABLE IF NOT EXISTS apprentice_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_type TEXT, -- CORRECTION, DISCOVERY, MILESTONE
    raw_input TEXT,
    learning_output TEXT,
    status INTEGER DEFAULT 0, -- 0: Unverified, 1: Verified by Architect
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 🦅 INITIAL SEED DATA
INSERT INTO
    opportunities (
        company,
        role,
        stage,
        priority,
        potential_revenue,
        probability,
        source
    )
VALUES (
        'TALSMART',
        'GTM ARCHITECT',
        'NEGOTIATION',
        'CRITICAL',
        60000,
        0.7,
        'DIRECT'
    );