import { useEffect, useState } from "react";

/**
 * TruthDial — An animated SVG semi-circle gauge that visualizes
 * the AI's confidence score as a dramatic, premium arc meter.
 */
export default function TruthDial({ score, verdict }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate from 0 to score on mount
    const timeout = setTimeout(() => setAnimatedScore(normalizedScore), 80);
    return () => clearTimeout(timeout);
  }, [normalizedScore]);

  // Arc geometry — 180° sweep
  const cx = 140;
  const cy = 130;
  const r = 100;
  const startAngle = Math.PI; // left (180°)
  const endAngle = 0;        // right (0°)
  const sweepAngle = startAngle - (startAngle - endAngle) * (animatedScore / 100);

  // Arc path helpers
  const polarToCartesian = (angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  const arcStart = polarToCartesian(startAngle);
  const arcEnd = polarToCartesian(sweepAngle);
  const largeArc = animatedScore > 50 ? 1 : 0;

  const trackPath = `M ${polarToCartesian(startAngle).x} ${polarToCartesian(startAngle).y} A ${r} ${r} 0 1 1 ${polarToCartesian(endAngle).x} ${polarToCartesian(endAngle).y}`;
  const valuePath = animatedScore > 0
    ? `M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`
    : "";

  // Needle tip position
  const needle = polarToCartesian(sweepAngle);

  // Color based on score
  const color = normalizedScore > 67 ? "#2db36d" : normalizedScore < 33 ? "#d64545" : "#d4a64b";
  const glowColor = normalizedScore > 67 ? "rgba(45,179,109,0.5)" : normalizedScore < 33 ? "rgba(214,69,69,0.5)" : "rgba(212,166,75,0.5)";

  // Label
  const label = normalizedScore > 67 ? "High Credibility" : normalizedScore < 33 ? "Low Credibility" : "Uncertain";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "8px 0 4px" }}>
      <svg width="280" height="160" viewBox="0 0 280 160" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d64545" />
            <stop offset="50%" stopColor="#d4a64b" />
            <stop offset="100%" stopColor="#2db36d" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Colored value arc */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke="url(#dialGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            style={{
              transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        )}

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = startAngle - (startAngle - endAngle) * (tick / 100);
          const inner = { x: cx + (r - 18) * Math.cos(angle), y: cy - (r - 18) * Math.sin(angle) };
          const outer = { x: cx + (r - 10) * Math.cos(angle), y: cy - (r - 10) * Math.sin(angle) };
          return (
            <line
              key={tick}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle line */}
        <line
          x1={cx} y1={cy}
          x2={needle.x} y2={needle.y}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#needleGlow)"
          style={{ transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />

        {/* Needle tip glow dot */}
        <circle
          cx={needle.x} cy={needle.y} r="5"
          fill={color}
          style={{
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 10px ${glowColor})`,
          }}
        />

        {/* Center hub */}
        <circle cx={cx} cy={cy} r="6" fill="var(--surface)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

        {/* Score text */}
        <text
          x={cx} y={cy - 28}
          textAnchor="middle"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 36,
            fontWeight: 700,
            fill: color,
            transition: "fill 0.4s ease",
          }}
        >
          {normalizedScore}
        </text>
        <text
          x={cx} y={cy - 12}
          textAnchor="middle"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.15em",
            fill: "var(--text-faint)",
            textTransform: "uppercase",
          }}
        >
          CONFIDENCE
        </text>

        {/* Min / Max labels */}
        <text x={cx - r - 4} y={cy + 18} textAnchor="middle" style={{ fontFamily: "var(--mono)", fontSize: 9, fill: "var(--text-faint)" }}>0</text>
        <text x={cx + r + 4} y={cy + 18} textAnchor="middle" style={{ fontFamily: "var(--mono)", fontSize: 9, fill: "var(--text-faint)" }}>100</text>
      </svg>

      {/* Label below */}
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color,
          marginTop: -4,
          transition: "color 0.4s ease",
        }}
      >
        {label}
      </div>
    </div>
  );
}
