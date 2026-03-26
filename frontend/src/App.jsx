import { useState, useEffect, useCallback } from "react";

const API = "http://127.0.0.1:8000";

/* ─── Google Fonts ─────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=IBM+Plex+Mono:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:         #08080d;
      --surface:    #10101a;
      --border:     #1e1e2e;
      --border-hi:  #2e2e4e;
      --gold:       #c9a84c;
      --gold-dim:   #7a6130;
      --red:        #c0392b;
      --red-dim:    #5a1a14;
      --green:      #27ae60;
      --green-dim:  #0f3d21;
      --amber:      #e67e22;
      --text:       #e8e8f0;
      --text-dim:   #888899;
      --text-faint: #44445a;
      --mono:       'IBM Plex Mono', monospace;
      --serif:      'Playfair Display', Georgia, serif;
      --body:       'Lora', Georgia, serif;
    }

    html, body, #root {
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: var(--body);
      font-size: 15px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    @keyframes scanline {
      0%   { background-position: 0 0; }
      100% { background-position: 0 100px; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    .fade-up { animation: fadeUp 0.5s ease both; }
    .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s 0.12s ease both; }
    .fade-up-3 { animation: fadeUp 0.5s 0.20s ease both; }
    .fade-up-4 { animation: fadeUp 0.5s 0.28s ease both; }
    .fade-up-5 { animation: fadeUp 0.5s 0.36s ease both; }
  `}</style>
);

/* ─── Utility ──────────────────────────────────────────────── */
function verdictColor(verdict = "") {
  const v = verdict.toLowerCase();
  if (v.includes("fake") || v.includes("false")) return "var(--red)";
  if (v.includes("true") || v.includes("verified") || v.includes("likely true")) return "var(--green)";
  return "var(--amber)";
}

function weightColor(w = "") {
  const weight = w.toLowerCase();
  if (weight === "strong") return "var(--green)";
  if (weight === "moderate") return "var(--amber)";
  return "var(--text-dim)";
}

/* ─── API helpers ───────────────────────────────────────────── */
async function apiFetch(path, opts = {}, token = null) {
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ─── Components ────────────────────────────────────────────── */

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-dim)", fontFamily: "var(--mono)", fontSize: 13 }}>
      <div style={{
        width: 16, height: 16, border: "2px solid var(--border-hi)",
        borderTopColor: "var(--gold)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite", flexShrink: 0
      }} />
      Analyzing claim…
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 3,
      background: color + "22", color, border: `1px solid ${color}55`,
      letterSpacing: "0.08em", textTransform: "uppercase"
    }}>{label}</span>
  );
}

/* ─── Auth Page ─────────────────────────────────────────────── */
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "register") {
        await apiFetch("/register", { method: "POST", body: JSON.stringify({ email, password }) });
        setMode("login");
        setError("Account created — please log in.");
      } else {
        const data = await apiFetch("/login", { method: "POST", body: JSON.stringify({ email, password }) });
        localStorage.setItem("nn_token", data.access_token);
        onLogin(data.access_token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)",
      backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #1a1520 0%, transparent 70%)",
    }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900,
            letterSpacing: "-0.02em", color: "var(--text)",
            marginBottom: 6
          }}>
            Nuance<span style={{ color: "var(--gold)" }}>Node</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            AI Fact Intelligence
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 36,
        }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "1px solid var(--border)" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: mode === m ? "var(--gold)" : "var(--text-faint)",
                padding: "8px 0 12px",
                borderBottom: `2px solid ${mode === m ? "var(--gold)" : "transparent"}`,
                marginBottom: -1, transition: "all 0.2s"
              }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle}
            />
            <input
              type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)} required
              style={inputStyle}
            />

            {error && (
              <div style={{
                fontFamily: "var(--mono)", fontSize: 12,
                color: error.includes("created") ? "var(--green)" : "var(--red)",
                padding: "8px 12px", background: error.includes("created") ? "var(--green-dim)" : "var(--red-dim)",
                borderRadius: 6, borderLeft: `3px solid ${error.includes("created") ? "var(--green)" : "var(--red)"}`
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={btnPrimaryStyle}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-faint)" }}>
          Powered by local LLM + DuckDuckGo Search
        </div>
      </div>
    </div>
  );
}

/* ─── History Panel ─────────────────────────────────────────── */
function HistoryPanel({ token, onSelectReport, activeId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/history", {}, token)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ padding: 24 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: 58, borderRadius: 8, background: "var(--border)",
          marginBottom: 10, animation: "pulse 1.5s ease infinite",
          animationDelay: `${i * 0.15}s`
        }} />
      ))}
    </div>
  );

  if (!history.length) return (
    <div style={{ padding: 24, fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)", textAlign: "center", lineHeight: 2 }}>
      No analyses yet.<br />Submit your first claim.
    </div>
  );

  return (
    <div style={{ padding: "12px 0" }}>
      {history.map((item, i) => (
        <button
          key={item.id}
          onClick={() => onSelectReport(item.id)}
          className={`fade-up-${Math.min(i + 1, 5)}`}
          style={{
            display: "block", width: "100%", textAlign: "left",
            background: activeId === item.id ? "var(--border)" : "none",
            border: "none", borderLeft: `3px solid ${activeId === item.id ? "var(--gold)" : "transparent"}`,
            cursor: "pointer", padding: "12px 20px",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (activeId !== item.id) e.currentTarget.style.background = "#ffffff08"; }}
          onMouseLeave={e => { if (activeId !== item.id) e.currentTarget.style.background = "none"; }}
        >
          <div style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--text)", lineHeight: 1.4, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.claim}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)" }}>
            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── Confidence Meter ──────────────────────────────────────── */
function ConfidenceMeter({ score }) {
  const color = score >= 75 ? "var(--green)" : score >= 45 ? "var(--amber)" : "var(--red)";
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>
        <span>Confidence Score</span>
        <span style={{ color, fontWeight: 600 }}>{score}%</span>
      </div>
      <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}>
        <div style={{
          height: "100%", width: `${score}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
        }} />
      </div>
    </div>
  );
}

/* ─── Context Tree ──────────────────────────────────────────── */
function ContextTree({ tree }) {
  if (!tree) return null;
  const forItems = tree.why_it_may_be_true || [];
  const againstItems = tree.why_it_may_be_false || [];

  const renderItems = (items, side) => items.map((item, i) => (
    <div key={i} style={{
      background: "var(--bg)", border: `1px solid var(--border)`,
      borderLeft: `3px solid ${weightColor(item.weight)}`,
      borderRadius: 8, padding: 16, marginBottom: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Badge label={item.weight || "N/A"} color={weightColor(item.weight)} />
      </div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8, lineHeight: 1.6 }}>
        {item.reason}
      </div>
      {item.explanation && (
        <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8, lineHeight: 1.5 }}>
          {item.explanation}
        </div>
      )}
      {item.evidence && (
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-dim)", borderTop: "1px solid var(--border)", paddingTop: 8, lineHeight: 1.6 }}>
          ↳ {item.evidence}
        </div>
      )}
    </div>
  ));

  return (
    <div className="fade-up-4" style={{ marginTop: 32 }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
        Context Tree
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span>●</span> Why It May Be True ({forItems.length})
          </div>
          {forItems.length ? renderItems(forItems, "true") : <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No supporting arguments found.</div>}
        </div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span>●</span> Why It May Be False ({againstItems.length})
          </div>
          {againstItems.length ? renderItems(againstItems, "false") : <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No contradicting arguments found.</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── Report View ───────────────────────────────────────────── */
function ReportView({ report, token }) {
  const { id, claim, report: data, pdf_download_link } = report;
  const vColor = verdictColor(data?.verdict);

  const authenticatedPdfLink = `${pdf_download_link}?token=${token}`;

  const nodes = [
    { label: "Facts Node", icon: "◎", key: "facts" },
    { label: "Sources Node", icon: "◉", key: "sources" },
    { label: "Logic & Fallacies", icon: "◈", key: "logic_analysis" },
    { label: "Anatomy of Belief", icon: "◇", key: "anatomy_of_belief" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      {/* Verdict Banner */}
      <div className="fade-up" style={{
        background: vColor + "0f", border: `1px solid ${vColor}33`,
        borderRadius: 12, padding: "24px 28px", marginBottom: 28,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: vColor + "08" }} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
          Analysis #{id} — Verdict
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 900, color: vColor, marginBottom: 12, lineHeight: 1.2 }}>
          {data?.verdict || "Unknown"}
        </div>
        <div style={{ fontFamily: "var(--body)", fontSize: 14, color: "var(--text-dim)", fontStyle: "italic", marginBottom: 16, lineHeight: 1.7 }}>
          "{claim}"
        </div>
        <ConfidenceMeter score={data?.confidence_score || 0} />
        <div style={{ marginTop: 16 }}>
          <a
            href={authenticatedPdfLink}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--mono)", fontSize: 12, color: "var(--gold)",
              textDecoration: "none", padding: "8px 16px",
              border: "1px solid var(--gold-dim)", borderRadius: 6,
              background: "var(--gold-dim)" + "44",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--gold)" + "22"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--gold-dim)" + "44"}
          >
            ↓ Download PDF Report
          </a>
        </div>
      </div>

      {/* 4 Nodes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {nodes.map(({ label, icon, key }, i) => (
          <div key={key} className={`fade-up-${i + 1}`} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 10, padding: 20,
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              {icon} {label}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.7 }}>
              {data?.[key] || "No data available."}
            </div>
          </div>
        ))}
      </div>

      {/* Context Tree */}
      <ContextTree tree={data?.context_tree} />
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
function Dashboard({ token, onLogout }) {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentReport, setCurrentReport] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  async function submitClaim(e) {
    e.preventDefault();
    if (!claim.trim()) return;
    setError(""); setLoading(true); setCurrentReport(null);
    try {
      const data = await apiFetch("/analyze-claim", {
        method: "POST",
        body: JSON.stringify({ claim: claim.trim() })
      }, token);
      setCurrentReport(data);
      setHistoryKey(k => k + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadHistoryReport(id) {
    try {
      const history = await apiFetch("/history", {}, token);
      const item = history.find(h => h.id === id);
      if (!item) return;
      // We only have basic info in history — show a minimal "loading" view

      let parsedReport = {};
      try {
        if (item.analysis_report) {
          parsedReport = JSON.parse(item.analysis_report);
        }
      }
      catch (e) {
        console.error("Failed to parse analysis report:", e);
      }

      setCurrentReport({
        id: item.id,
        claim: item.claim,
        report: parsedReport,
        pdf_download_link: `${API}/report/${item.id}/download`
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 280 : 0, flexShrink: 0,
        background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: "var(--text)" }}>
            Nuance<span style={{ color: "var(--gold)" }}>Node</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
            AI Fact Intelligence
          </div>
        </div>

        {/* History */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "14px 20px 6px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            History
          </div>
          <HistoryPanel key={historyKey} token={token} onSelectReport={loadHistoryReport} activeId={currentReport?.id} />
        </div>

        {/* Logout */}
        <div style={{ padding: 16, borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <button onClick={onLogout} style={{
            width: "100%", background: "none", border: "1px solid var(--border)",
            color: "var(--text-dim)", fontFamily: "var(--mono)", fontSize: 12,
            cursor: "pointer", padding: "8px 12px", borderRadius: 6, transition: "all 0.2s",
            letterSpacing: "0.05em"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{
          height: 56, flexShrink: 0, display: "flex", alignItems: "center",
          padding: "0 24px", borderBottom: "1px solid var(--border)",
          background: "var(--bg)", gap: 16
        }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-faint)", fontSize: 18, lineHeight: 1, padding: 4,
            transition: "color 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
          >☰</button>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)" }}>
            {currentReport ? `Report #${currentReport.id}` : "New Analysis"}
          </span>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          {/* Claim Input */}
          <div style={{
            padding: "40px 24px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg)",
            backgroundImage: "radial-gradient(ellipse 100% 200% at 50% -50%, #1a1520 0%, transparent 70%)"
          }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <div className="fade-up" style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text)", lineHeight: 1.25 }}>
                What claim should we investigate?
              </div>
              <div className="fade-up-1" style={{ fontFamily: "var(--body)", fontSize: 14, color: "var(--text-dim)", marginBottom: 24, fontStyle: "italic" }}>
                Enter a news headline, viral post, or statement to analyze with the 4-Node Context Tree.
              </div>

              <form onSubmit={submitClaim} className="fade-up-2">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <textarea
                    value={claim}
                    onChange={e => setClaim(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitClaim(e); } }}
                    placeholder="e.g. Scientists confirm 5G towers cause COVID-19 symptoms…"
                    rows={3}
                    style={{
                      ...inputStyle,
                      flex: 1, resize: "none",
                      fontFamily: "var(--body)", fontSize: 14,
                      lineHeight: 1.6
                    }}
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading || !claim.trim()} style={{
                    ...btnPrimaryStyle,
                    width: 100, flexShrink: 0, height: 86,
                    fontSize: 13, cursor: loading ? "not-allowed" : "pointer"
                  }}>
                    {loading ? "…" : "Analyze →"}
                  </button>
                </div>
                {error && (
                  <div style={{
                    marginTop: 12, fontFamily: "var(--mono)", fontSize: 12,
                    color: "var(--red)", padding: "8px 14px",
                    background: "var(--red-dim)", borderRadius: 6,
                    borderLeft: "3px solid var(--red)"
                  }}>
                    ✕ {error}
                  </div>
                )}
                {loading && <div style={{ marginTop: 16 }}><Spinner /></div>}
              </form>
            </div>
          </div>

          {/* Report or Empty State */}
          {currentReport ? (
            <ReportView report={currentReport} token={token} />
          ) : !loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 360, padding: 40, textAlign: "center"
            }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 56, marginBottom: 16, opacity: 0.08 }}>⊕</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)", letterSpacing: "0.1em" }}>
                Submit a claim to begin investigation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Styles ─────────────────────────────────────────── */
const inputStyle = {
  width: "100%",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "12px 14px",
  color: "var(--text)",
  fontFamily: "var(--body)",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  display: "block",
};

const btnPrimaryStyle = {
  width: "100%",
  background: "var(--gold)",
  border: "none",
  borderRadius: 8,
  padding: "12px 20px",
  color: "#0a0805",
  fontFamily: "var(--mono)",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: "0.04em",
  transition: "opacity 0.2s, transform 0.1s",
};

/* ─── Root App ──────────────────────────────────────────────── */
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("nn_token") || null);

  function handleLogin(t) { setToken(t); }
  function handleLogout() { localStorage.removeItem("nn_token"); setToken(null); }

  return (
    <>
      <FontLoader />
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </>
  );
}