import { useEffect, useState } from "react";

import { apiFetch } from "./api.js";

export default function HistoryPanel({ token, onSelectReport, onDeleteReport, activeId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/history", {}, token)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              height: 58,
              borderRadius: 8,
              background: "var(--border)",
              marginBottom: 10,
              animation: "pulse 1.5s ease infinite",
              animationDelay: `${item * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (!history.length) {
    return (
      <div style={{ padding: 24, fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)", textAlign: "center", lineHeight: 2 }}>
        No analyses yet.
        <br />
        Submit your first claim.
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 0" }}>
      {history.map((item, index) => (
        <div key={item.id} className={`fade-up-${Math.min(index + 1, 5)}`} style={{ position: "relative" }}>
          <button
            onClick={() => onSelectReport(item.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: activeId === item.id ? "var(--border)" : "none",
              border: "none",
              borderLeft: `3px solid ${activeId === item.id ? "var(--gold)" : "transparent"}`,
              cursor: "pointer",
              padding: "12px 40px 12px 20px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(event) => {
              if (activeId !== item.id) event.currentTarget.style.background = "#ffffff08";
            }}
            onMouseLeave={(event) => {
              if (activeId !== item.id) event.currentTarget.style.background = "none";
            }}
          >
            <div
              style={{
                fontFamily: "var(--body)",
                fontSize: 13,
                color: "var(--text)",
                lineHeight: 1.4,
                marginBottom: 4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.claim}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)" }}>
              {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this report?")) {
                try {
                  await apiFetch(`/history/${item.id}`, { method: 'DELETE' }, token);
                  setHistory(h => h.filter(x => x.id !== item.id));
                  if (onDeleteReport && activeId === item.id) {
                    onDeleteReport(item.id);
                  }
                } catch (err) {
                  console.error("Failed to delete", err);
                  alert("Failed to delete report");
                }
              }
            }}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--text-faint)",
              cursor: "pointer",
              padding: 6,
              borderRadius: "50%",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--red)";
              e.currentTarget.style.background = "#ff000015";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-faint)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Delete Report"
            aria-label="Delete Report"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
