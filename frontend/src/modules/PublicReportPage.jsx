import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API } from "./api.js";
import ConfidenceMeter from "./ConfidenceMeter.jsx";
import ContextTree from "./ContextTree.jsx";
import { renderNodeValue, verdictColor } from "./uiUtils.jsx";
import logo from "../assets/logo.webp";

export default function PublicReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 650;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/report/${id}/public`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const data = report?.report;
  const claim = report?.claim;
  const vColor = data ? verdictColor(data.verdict) : "var(--text-faint)";
  const diagnostics = Array.isArray(data?.meta?.diagnostics) ? data.meta.diagnostics.filter(Boolean) : [];

  const nodes = [
    { label: "Facts Node", icon: "◎", key: "facts" },
    { label: "Sources Node", icon: "◉", key: "sources" },
    { label: "Logic & Fallacies", icon: "◈", key: "logic_analysis" },
    { label: "Anatomy of Belief", icon: "◇", key: "anatomy_of_belief" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background effects */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(circle at 50% 30%, rgba(201, 168, 76, 0.06) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "16px 20px" : "20px 48px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(10, 10, 15, 0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontFamily: "var(--serif)",
            fontSize: isMobile ? 18 : 22,
            fontWeight: 900,
          }}
        >
          <img src={logo} alt="NuanceNode Logo" width={isMobile ? 20 : 26} height={isMobile ? 20 : 26} style={{ objectFit: "contain" }} />
          <span>Nuance<span style={{ color: "var(--gold)" }}>Node</span></span>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            background: "rgba(201, 168, 76, 0.08)",
            border: "1px solid rgba(201, 168, 76, 0.15)",
            padding: "5px 12px",
            borderRadius: 20,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          Shared Report
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "2px solid var(--border)",
                borderTopColor: "var(--gold)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)", letterSpacing: "0.1em" }}>
              LOADING REPORT…
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: 20,
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: isMobile ? 64 : 80,
                fontWeight: 900,
                background: "linear-gradient(180deg, var(--red) 0%, var(--bg) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}
            >
              ✕
            </div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: isMobile ? 22 : 28,
                fontWeight: 700,
                color: "var(--text)",
                margin: 0,
              }}
            >
              Report Not Found
            </h2>
            <p style={{ fontFamily: "var(--body)", fontSize: 15, color: "var(--text-dim)", maxWidth: 420, lineHeight: 1.6 }}>
              {error}
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--border)",
                padding: "0 24px",
                height: 44,
                fontFamily: "var(--body)",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-dim)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Go to NuanceNode
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 24px" }}>
            {/* Verdict Banner */}
            <div
              className="fade-up"
              style={{
                background: `${vColor}0f`,
                border: `1px solid ${vColor}33`,
                borderRadius: 12,
                padding: isMobile ? "20px 20px" : "28px 32px",
                marginBottom: 28,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: `${vColor}08` }} />
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-faint)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Shared Analysis — Verdict
              </div>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: isMobile ? 24 : 30,
                  fontWeight: 900,
                  color: vColor,
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {data?.verdict || "Unknown"}
              </div>
              <div
                style={{
                  fontFamily: "var(--body)",
                  fontSize: 14,
                  color: "var(--text-dim)",
                  fontStyle: "italic",
                  marginBottom: 16,
                  lineHeight: 1.7,
                }}
              >
                "{claim}"
              </div>
              <ConfidenceMeter score={data?.confidence_score || 0} />

              {/* Timestamp */}
              {report?.created_at && (
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text-faint)",
                    letterSpacing: "0.05em",
                  }}
                >
                  Analyzed on {new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}

              {diagnostics.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    display: "grid",
                    gap: 8,
                    padding: "12px 14px",
                    background: "rgba(230, 126, 34, 0.12)",
                    border: "1px solid rgba(230, 126, 34, 0.32)",
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--amber)",
                    }}
                  >
                    Diagnostics
                  </div>
                  {diagnostics.map((item, index) => (
                    <div key={`diag-${index}`} style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Node Cards */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {nodes.map(({ label, icon, key }, index) => (
                <div
                  key={key}
                  className={`fade-up-${index + 1}`}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--gold)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    {icon} {label}
                  </div>
                  <div style={{ fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.7 }}>
                    {renderNodeValue(data?.[key], key) || "No data available."}
                  </div>
                </div>
              ))}
            </div>

            {/* Context Tree */}
            <ContextTree tree={data?.context_tree} />

            {/* CTA Footer */}
            <div
              className="fade-up"
              style={{
                marginTop: 48,
                padding: "28px 32px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 8,
                }}
              >
                Analyze your own claims
              </div>
              <p style={{ fontFamily: "var(--body)", fontSize: 14, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
                NuanceNode uses a 4-Node AI Context Tree to fact-check any claim with source verification, logic analysis, and belief modeling.
              </p>
              <button
                onClick={() => navigate("/authen")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--body)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0a0a0f",
                  background: "linear-gradient(135deg, var(--gold), #e8c84a)",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 16px rgba(201, 168, 76, 0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201, 168, 76, 0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(201, 168, 76, 0.3)"; }}
              >
                Get Started Free →
              </button>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 32,
                marginBottom: 24,
                textAlign: "center",
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-faint)",
                letterSpacing: "0.08em",
              }}
            >
              Powered by NuanceNode · AI Fact Intelligence
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
