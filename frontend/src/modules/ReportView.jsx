import { useCallback, useState } from "react";

import { downloadAuthenticatedFile } from "./api.js";
import ConfidenceMeter from "./ConfidenceMeter.jsx";
import ContextTree from "./ContextTree.jsx";
import { renderNodeValue, verdictColor } from "./uiUtils.jsx";

export default function ReportView({ report, token }) {
  const { id, claim, report: data, pdf_download_link } = report;
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const vColor = verdictColor(data?.verdict);

  const handleDownload = useCallback(async () => {
    setDownloadError("");
    setDownloading(true);

    try {
      const safeClaim = (claim || "report")
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 40) || "report";
      await downloadAuthenticatedFile(pdf_download_link, token, `NuanceNode_Report_${safeClaim}.pdf`);
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setDownloading(false);
    }
  }, [claim, pdf_download_link, token]);

  const nodes = [
    { label: "Facts Node", icon: "◎", key: "facts" },
    { label: "Sources Node", icon: "◉", key: "sources" },
    { label: "Logic & Fallacies", icon: "◈", key: "logic_analysis" },
    { label: "Anatomy of Belief", icon: "◇", key: "anatomy_of_belief" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <div
        className="fade-up"
        style={{
          background: `${vColor}0f`,
          border: `1px solid ${vColor}33`,
          borderRadius: 12,
          padding: "24px 28px",
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
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--gold)",
              textDecoration: "none",
              padding: "8px 16px",
              border: "1px solid var(--gold-dim)",
              borderRadius: 6,
              background: "rgba(122, 97, 48, 0.27)",
              transition: "all 0.2s",
              cursor: downloading ? "wait" : "pointer",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(201, 168, 76, 0.13)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(122, 97, 48, 0.27)";
            }}
          >
            {downloading ? "Preparing PDF…" : "↓ Download PDF Report"}
          </button>
        </div>
        {downloadError && (
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
            ✕ {downloadError}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
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

      <ContextTree tree={data?.context_tree} />
    </div>
  );
}
