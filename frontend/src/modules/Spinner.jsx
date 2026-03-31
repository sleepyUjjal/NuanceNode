export default function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        fontSize: 13,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          border: "2px solid var(--border-hi)",
          borderTopColor: "var(--gold)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          flexShrink: 0,
        }}
      />
      Analyzing claim…
    </div>
  );
}
