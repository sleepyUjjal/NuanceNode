import { useMemo, useState } from "react";

import { apiFetch } from "./api.js";

export default function HistoryPanel({ token, history, loading, onSelectReport, onDeleteReport, onReloadHistory, activeId }) {
  const [itemToDelete, setItemToDelete] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const visibleHistory = useMemo(
    () => history.filter((item) => item.id !== pendingDeleteId),
    [history, pendingDeleteId],
  );

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const deletingId = itemToDelete.id;
    setPendingDeleteId(deletingId);
    onDeleteReport?.(deletingId);
    setItemToDelete(null);

    try {
      await apiFetch(`/history/${deletingId}`, { method: "DELETE" }, token);
    } catch (err) {
      console.error("Failed to delete", err);
      onReloadHistory?.();
    } finally {
      setPendingDeleteId(null);
    }
  };

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

  if (!visibleHistory.length) {
    return (
      <div style={{ padding: 24, fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)", textAlign: "center", lineHeight: 2 }}>
        No analyses yet.
        <br />
        Submit your first claim.
      </div>
    );
  }

  return (
    <>
    <div style={{ padding: "12px 0" }}>
      {visibleHistory.map((item, index) => (
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
              setItemToDelete(item);
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

    {itemToDelete && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: 24
      }}>
        <div className="fade-up" style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
        }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--text)", marginBottom: 12, fontWeight: 700 }}>Confirm Deletion</div>
          <div style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.5 }}>
            Are you sure you want to delete this analysis report? This action cannot be undone.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button 
              onClick={() => setItemToDelete(null)}
              style={{ flex: 1, padding: "10px 16px", background: "none", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#ffffff08"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              style={{ flex: 1, padding: "10px 16px", background: "var(--red-dim)", border: "1px solid var(--red)", color: "var(--text)", borderRadius: 8, cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#c0392b"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--red-dim)"}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
