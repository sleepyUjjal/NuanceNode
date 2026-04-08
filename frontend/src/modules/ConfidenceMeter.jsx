export default function ConfidenceMeter({ score }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const color =
    normalizedScore > 67
      ? "#2db36d"
      : normalizedScore < 33
        ? "#d64545"
        : "#d4a64b";
  const trackTint =
    normalizedScore > 67
      ? "rgba(45,179,109,0.16)"
      : normalizedScore < 33
        ? "rgba(214,69,69,0.16)"
        : "rgba(212,166,75,0.16)";

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
        <span style={{ color, fontWeight: 600 }}>{normalizedScore}%</span>
      </div>
      <div
        style={{
          position: "relative",
          height: 8,
          borderRadius: 999,
          overflow: "hidden",
          background: trackTint,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${normalizedScore}%`,
            borderRadius: 999,
            background: color,
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `calc(${normalizedScore}% - 7px)`,
            width: 14,
            height: 14,
            borderRadius: "50%",
            transform: "translateY(-50%)",
            background: color,
            border: "2px solid rgba(8, 8, 13, 0.92)",
            boxShadow: `0 0 16px ${color}`,
            transition: "left 1s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
