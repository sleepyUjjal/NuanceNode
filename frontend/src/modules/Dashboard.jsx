import { useCallback, useEffect, useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    },
    [token],
  );

  async function submitClaim(event) {
    event.preventDefault();
    if (!claim.trim()) return;

    setError("");
    setLoading(true);
    setLoadingPhaseIndex(0);
    setCurrentReport(null);

    try {
      const data = await apiFetch(
        "/analyze-claim",
        {
          method: "POST",
          body: JSON.stringify({ claim: claim.trim() }),
        },
        token,
      );
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

    const phaseDurations = [900, 1800, 2600, 3600, 4800];
    const timers = phaseDurations.map((delay, index) =>
      window.setTimeout(() => {
        setLoadingPhaseIndex(index + 1);
      }, delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [loading]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          width: sidebarOpen ? 280 : 0,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: "var(--text)" }}>
            Nuance<span style={{ color: "var(--gold)" }}>Node</span>
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text-faint)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            AI Fact Intelligence
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div
            style={{
              padding: "14px 20px 6px",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text-faint)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            History
          </div>
          <HistoryPanel key={historyKey} token={token} onSelectReport={loadHistoryReport} activeId={currentReport?.id} />
        </div>

        <div style={{ padding: 16, borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: 6,
              transition: "all 0.2s",
              letterSpacing: "0.05em",
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            height: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg)",
            gap: 16,
          }}
        >
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-faint)",
              fontSize: 18,
              lineHeight: 1,
              padding: 4,
              transition: "color 0.15s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = "var(--text-faint)";
            }}
          >
            ☰
          </button>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)" }}>
            {currentReport ? `Report #${currentReport.id}` : "New Analysis"}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          <div
            style={{
              padding: "40px 24px 24px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg)",
              backgroundImage: "radial-gradient(ellipse 100% 200% at 50% -50%, #1a1520 0%, transparent 70%)",
            }}
          >
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
                    onChange={(event) => setClaim(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submitClaim(event);
                      }
                    }}
                    placeholder="e.g. Scientists confirm 5G towers cause COVID-19 symptoms…"
                    rows={3}
                    minLength={5}
                    maxLength={5000}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      resize: "none",
                      fontFamily: "var(--body)",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !claim.trim()}
                    style={{
                      ...btnPrimaryStyle,
                      width: 100,
                      flexShrink: 0,
                      height: 86,
                      fontSize: 13,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "…" : "Analyze →"}
                  </button>
                </div>
                {error && (
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: "var(--red)",
                      padding: "8px 14px",
                      background: "var(--red-dim)",
                      borderRadius: 6,
                      borderLeft: "3px solid var(--red)",
                    }}
                  >
                    ✕ {error}
                  </div>
                )}
                {loading && (
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <Spinner />
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--text-faint)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
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
            <PhaseLoader claim={claim.trim()} phaseIndex={loadingPhaseIndex} />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 360,
                padding: 40,
                textAlign: "center",
              }}
            >
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
