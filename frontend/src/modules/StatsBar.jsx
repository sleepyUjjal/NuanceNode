import { useEffect, useState } from "react";
import { apiFetch } from "./api.js";

export default function StatsBar({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/stats/me", {}, token);
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading || !stats || stats.total_claims === 0) return null;

  const items = [
    { label: "Analyzed", value: stats.total_claims, icon: "◎", color: "var(--gold)" },
    { label: "Falsehoods", value: stats.falsehoods_detected, icon: "✕", color: "#d64545" },
    { label: "Verified", value: stats.verified_true, icon: "✓", color: "#2db36d" },
    { label: "Avg Score", value: `${stats.avg_confidence}%`, icon: "⌀", color: "#d4a64b" },
  ];

  return (
    <div
      className="fade-up-1"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        maxWidth: 760,
        width: "100%",
        margin: "0 auto 28px",
      }}
    >
      {items.map(({ label, value, icon, color }) => (
        <div
          key={label}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 12px 12px",
            textAlign: "center",
            transition: "border-color 0.2s, transform 0.2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 4, color, lineHeight: 1 }}>{icon}</div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text)",
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              marginTop: 4,
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
