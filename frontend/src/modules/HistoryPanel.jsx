import { useEffect, useState } from "react";

import { apiFetch } from "./api.js";

export default function HistoryPanel({ token, onSelectReport, activeId }) {
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
        <button
          key={item.id}
          onClick={() => onSelectReport(item.id)}
          className={`fade-up-${Math.min(index + 1, 5)}`}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            background: activeId === item.id ? "var(--border)" : "none",
            border: "none",
            borderLeft: `3px solid ${activeId === item.id ? "var(--gold)" : "transparent"}`,
            cursor: "pointer",
            padding: "12px 20px",
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
      ))}
    </div>
  );
}
