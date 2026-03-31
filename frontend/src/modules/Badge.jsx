export default function Badge({ label, color }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 3,
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}
