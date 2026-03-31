export default function ConfidenceMeter({ score }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const hue = Math.round((normalizedScore / 100) * 120);
  const color = `hsl(${hue}, 68%, 52%)`;

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
          background: "linear-gradient(90deg, rgba(214,69,69,0.16) 0%, rgba(212,166,75,0.16) 50%, rgba(45,179,109,0.16) 100%)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${normalizedScore}%`,
            borderRadius: 999,
            background: "linear-gradient(90deg, #d64545 0%, #d4a64b 50%, #2db36d 100%)",
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
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
