export default function ConfidenceMeter({ score }) {
  const color = score >= 75 ? "var(--green)" : score >= 45 ? "var(--amber)" : "var(--red)";

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-dim)",
        }}
      >
        <span>Confidence Score</span>
        <span style={{ color, fontWeight: 600 }}>{score}%</span>
      </div>
      <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}>
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
