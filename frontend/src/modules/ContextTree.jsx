import Badge from "./Badge.jsx";
import { renderNodeValue, weightColor } from "./uiUtils.jsx";

export default function ContextTree({ tree }) {
  if (!tree) return null;

  const forItems = tree.why_it_may_be_true || [];
  const againstItems = tree.why_it_may_be_false || [];
  const beliefDrivers = tree.belief_drivers;

  function renderItems(items) {
    return items.map((item, index) => (
      <div
        key={index}
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderLeft: `3px solid ${weightColor(item.weight)}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Badge label={item.weight || "N/A"} color={weightColor(item.weight)} />
        </div>
        <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8, lineHeight: 1.6 }}>{item.reason}</div>
        {item.explanation && (
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8, lineHeight: 1.5 }}>{item.explanation}</div>
        )}
        {item.evidence && (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--text-dim)",
              borderTop: "1px solid var(--border)",
              paddingTop: 8,
              lineHeight: 1.6,
            }}
          >
            ↳ {item.evidence}
          </div>
        )}
      </div>
    ));
  }

  return (
    <div className="fade-up-4" style={{ marginTop: 32 }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
        Context Tree
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--green)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>●</span> Why It May Be True ({forItems.length})
          </div>
          {forItems.length ? renderItems(forItems) : <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No supporting arguments found.</div>}
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--red)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>●</span> Why It May Be False ({againstItems.length})
          </div>
          {againstItems.length ? renderItems(againstItems) : <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No contradicting arguments found.</div>}
        </div>
      </div>
      {beliefDrivers && (
        <div
          style={{
            marginTop: 20,
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
            Belief Drivers
          </div>
          <div style={{ fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.7 }}>
            {renderNodeValue(beliefDrivers, "belief-drivers")}
          </div>
        </div>
      )}
    </div>
  );
}
