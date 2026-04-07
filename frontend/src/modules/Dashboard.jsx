import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "./api.js";
import { analysisPhases } from "./analysisPhases.js";
import HistoryPanel from "./HistoryPanel.jsx";
import PhaseLoader from "./PhaseLoader.jsx";
import ReportView from "./ReportView.jsx";
import Spinner from "./Spinner.jsx";
import { btnPrimaryStyle, inputStyle } from "./sharedStyles.js";

export default function Dashboard({ token, onLogout }) {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [error, setError] = useState("");
  const [currentReport, setCurrentReport] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hidden by default for drawer
  const loadingStartedAt = useRef(0);

  const userEmail = useMemo(() => {
    if (!token) return "User";
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub || "User";
      const name = email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch(e) {
      return "User";
    }
  }, [token]);

  const loadHistoryReport = useCallback(
    async (id) => {
      try {
        const history = await apiFetch("/history", {}, token);
        const item = history.find((entry) => entry.id === id);
        if (!item) return;

        let parsedReport = {};
        try {
          if (item.analysis_report) {
            parsedReport = JSON.parse(item.analysis_report);
          }
        } catch (parseError) {
          console.error("Failed to parse analysis report:", parseError);
        }

        setCurrentReport({
          id: item.id,
          claim: item.claim,
          report: parsedReport,
          pdf_download_link: `/report/${item.id}/download`,
        });
        setSidebarOpen(false); // auto close sidebar on mobile/selection
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    },
    [token],
  );

  const handleDeleteReport = useCallback((id) => {
    if (currentReport?.id === id) {
      setCurrentReport(null);
      setClaim("");
    }
  }, [currentReport]);

  async function submitClaim(event) {
    event.preventDefault();
    if (!claim.trim()) return;

    setError("");
    setLoading(true);
    setLoadingPhaseIndex(0);
    setCurrentReport(null);
    loadingStartedAt.current = Date.now();

    try {
      const data = await apiFetch(
        "/analyze-claim",
        {
          method: "POST",
          body: JSON.stringify({ claim: claim.trim() }),
        },
        token,
      );
      
      const minimumLoaderTimeMs = 1500; // Reduced wait for better UX
      const elapsedMs = Date.now() - loadingStartedAt.current;
      if (elapsedMs < minimumLoaderTimeMs) {
        await new Promise((resolve) => window.setTimeout(resolve, minimumLoaderTimeMs - elapsedMs));
      }

      setLoadingPhaseIndex(analysisPhases.length - 1);
      await new Promise((resolve) => window.setTimeout(resolve, 400));

      setCurrentReport(data);
      setHistoryKey((value) => value + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loading) {
      setLoadingPhaseIndex(0);
      return undefined;
    }

    const maxAutoPhaseIndex = Math.max(0, analysisPhases.length - 2);
    let timeoutId;

    const scheduleAdvance = (delay) => {
      timeoutId = window.setTimeout(() => {
        setLoadingPhaseIndex((current) => {
          const next = Math.min(current + 1, maxAutoPhaseIndex);
          if (next < maxAutoPhaseIndex) {
            scheduleAdvance(1200); // Speed up fake phase loading
          }
          return next;
        });
      }, delay);
    };

    scheduleAdvance(600);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [loading]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      
      {/* Drawer Backdrop */}
      <div 
        onClick={() => setSidebarOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "all 0.3s ease",
          zIndex: 40
        }}
      />

      {/* Drawer Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: 280,
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: sidebarOpen ? "5px 0 25px rgba(0,0,0,0.5)" : "none",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s",
        }}
      >
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: "var(--text)" }}>
              Nuance<span style={{ color: "var(--gold)" }}>Node</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
              AI Fact Intelligence
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ background: "transparent", border: "none", color: "var(--text-faint)", cursor: "pointer", fontSize: 20 }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "14px 20px 6px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            History
          </div>
          <HistoryPanel 
            key={historyKey} 
            token={token} 
            onSelectReport={loadHistoryReport} 
            onDeleteReport={handleDeleteReport}
            activeId={currentReport?.id} 
          />
        </div>

        <div style={{ padding: 16, borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <button
            onClick={onLogout}
            style={{
              width: "100%", background: "none", border: "1px solid var(--border)",
              color: "var(--text-dim)", fontFamily: "var(--mono)", fontSize: 12,
              cursor: "pointer", padding: "8px 12px", borderRadius: 6,
              transition: "all 0.2s", letterSpacing: "0.05em",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = "var(--red)";
              event.currentTarget.style.color = "var(--red)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = "var(--border)";
              event.currentTarget.style.color = "var(--text-dim)";
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
        <div style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid var(--border)", gap: 16 }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-faint)", fontSize: 18, padding: 4, transition: "color 0.15s",
            }}
            onMouseEnter={(event) => event.currentTarget.style.color = "var(--text)"}
            onMouseLeave={(event) => event.currentTarget.style.color = "var(--text-faint)"}
          >
            ☰
          </button>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)" }}>
            {currentReport ? `Analysis Report` : "New Analysis"}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: (!currentReport && !loading) ? "0 24px" : "40px 24px 24px",
              borderBottom: (!currentReport && !loading) ? "none" : "1px solid var(--border)",
              flex: (!currentReport && !loading) ? 1 : "0 0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: (!currentReport && !loading) ? "center" : "flex-start",
              backgroundImage: "radial-gradient(ellipse 100% 200% at 50% -50%, #1a1520 0%, transparent 70%)",
            }}
          >
            <div style={{ maxWidth: 760, width: "100%", margin: "0 auto" }}>
              {(!currentReport && !loading) && (
                <div className="fade-up" style={{ 
                  fontFamily: "var(--serif)", fontSize: 44, fontWeight: 700, marginBottom: 16, 
                  background: "linear-gradient(90deg, #c9a84c, #fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  textAlign: "center"
                }}>
                  Hello, {userEmail}
                </div>
              )}
              <div className="fade-up-1" style={{ 
                fontFamily: "var(--serif)", fontSize: (!currentReport && !loading) ? 20 : 28, 
                fontWeight: 700, marginBottom: 8, color: "var(--text)", lineHeight: 1.25,
                textAlign: (!currentReport && !loading) ? "center" : "left"
              }}>
                What claim should we investigate?
              </div>
              <div className="fade-up-2" style={{ 
                fontFamily: "var(--body)", fontSize: 14, color: "var(--text-dim)", marginBottom: 24, fontStyle: "italic",
                textAlign: (!currentReport && !loading) ? "center" : "left"
              }}>
                Enter a news headline, viral post, or statement to analyze with the 4-Node Context Tree.
              </div>

              <form onSubmit={submitClaim} className="fade-up-3">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", margin: (!currentReport && !loading) ? "0 auto" : "0", maxWidth: 760 }}>
                  <textarea
                    value={claim}
                    onChange={(event) => setClaim(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submitClaim(event);
                      }
                    }}
                    placeholder="e.g. Scientists confirm 5G towers cause COVID-19 symptoms…"
                    rows={(!currentReport && !loading) ? 4 : 3}
                    minLength={5}
                    maxLength={5000}
                    style={{
                      ...inputStyle,
                      flex: 1, resize: "none", fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.6,
                      padding: 16,
                      borderRadius: 12,
                      boxShadow: (!currentReport && !loading) ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
                    }}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !claim.trim()}
                    style={{
                      ...btnPrimaryStyle,
                      width: 100, flexShrink: 0, height: (!currentReport && !loading) ? 104 : 86, fontSize: 13,
                      cursor: loading ? "not-allowed" : "pointer",
                      borderRadius: 12,
                    }}
                  >
                    {loading ? "…" : "Analyze →"}
                  </button>
                </div>
                {error && (
                  <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 12, color: "var(--red)", padding: "8px 14px", background: "var(--red-dim)", borderRadius: 6, borderLeft: "3px solid var(--red)" }}>
                    ✕ {error}
                  </div>
                )}
                {loading && (
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <Spinner />
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Step {loadingPhaseIndex + 1} of {analysisPhases.length}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {currentReport ? (
            <ReportView report={currentReport} token={token} />
          ) : loading ? (
            <PhaseLoader key={loadingPhaseIndex} claim={claim.trim()} phaseIndex={loadingPhaseIndex} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
