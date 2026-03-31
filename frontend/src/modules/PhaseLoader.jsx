import { useEffect, useMemo, useState } from "react";

import Spinner from "./Spinner.jsx";
import { analysisPhases } from "./analysisPhases.js";

export default function PhaseLoader({ claim, phaseIndex }) {
  const currentPhase = analysisPhases[phaseIndex] || analysisPhases[0];
  const phaseActivities = useMemo(() => currentPhase.activities || [], [currentPhase]);
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  useEffect(() => {
    if (phaseActivities.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveActivityIndex((current) => (current + 1) % phaseActivities.length);
    }, 1100);

    return () => window.clearInterval(intervalId);
  }, [phaseActivities]);

  return (
    <div className="fade-up-3" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          background: "linear-gradient(180deg, rgba(16,16,26,0.96), rgba(8,8,13,0.98))",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 18px 48px rgba(0,0,0,0.22)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            background: "linear-gradient(90deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--gold)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Analysis In Progress
              </div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 26, color: "var(--text)", lineHeight: 1.2 }}>
                {currentPhase.label}
              </div>
            </div>
            <Spinner />
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "var(--body)",
              fontSize: 14,
              color: "var(--text-dim)",
              lineHeight: 1.7,
              maxWidth: 720,
            }}
          >
            {currentPhase.detail}
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "var(--body)",
              fontSize: 13,
              color: "var(--text-faint)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            “{claim}”
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {analysisPhases.map((phase, index) => {
              const isComplete = index < phaseIndex;
              const isActive = index === phaseIndex;

              return (
                <div
                  key={phase.label}
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: isComplete
                      ? "linear-gradient(90deg, rgba(39,174,96,0.8), rgba(39,174,96,1))"
                      : isActive
                        ? "linear-gradient(90deg, rgba(201,168,76,0.4), rgba(201,168,76,1))"
                        : "var(--border)",
                    boxShadow: isActive ? "0 0 18px rgba(201,168,76,0.28)" : "none",
                    transition: "all 0.35s ease",
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 18 }}>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-faint)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Pipeline Stages
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {analysisPhases.map((phase, index) => {
                  const isComplete = index < phaseIndex;
                  const isActive = index === phaseIndex;

                  return (
                    <div
                      key={phase.label}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
                        border: `1px solid ${isActive ? "rgba(201,168,76,0.24)" : "transparent"}`,
                        transition: "all 0.25s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: isComplete ? "#08110b" : isActive ? "#0a0805" : "var(--text-faint)",
                          background: isComplete ? "var(--green)" : isActive ? "var(--gold)" : "var(--border)",
                        }}
                      >
                        {isComplete ? "✓" : index + 1}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 12,
                            color: isActive ? "var(--text)" : isComplete ? "var(--green)" : "var(--text-dim)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          {phase.label}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-faint)", lineHeight: 1.55 }}>
                          {phase.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text-faint)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Live Analysis Feed
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(201,168,76,0.07)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      boxShadow: "0 0 14px rgba(201,168,76,0.45)",
                      animation: "pulse 1.4s ease-in-out infinite",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.65 }}>
                    {phaseActivities[activeActivityIndex] || currentPhase.detail}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {phaseActivities.map((activity, index) => {
                    const isComplete = index < activeActivityIndex;
                    const isActive = index === activeActivityIndex;

                    return (
                      <div
                        key={activity}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: 12.5,
                          color: isActive ? "var(--text)" : isComplete ? "var(--green)" : "var(--text-faint)",
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            background: isComplete
                              ? "rgba(39,174,96,0.18)"
                              : isActive
                                ? "rgba(201,168,76,0.18)"
                                : "rgba(255,255,255,0.04)",
                            border: `1px solid ${
                              isComplete ? "rgba(39,174,96,0.28)" : isActive ? "rgba(201,168,76,0.25)" : "var(--border)"
                            }`,
                          }}
                        >
                          {isComplete ? "✓" : isActive ? "•" : index + 1}
                        </div>
                        <div style={{ lineHeight: 1.5 }}>{activity}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--text-faint)", lineHeight: 1.65 }}>
                  This is a stage-by-stage trace of observable work, not a hidden chain-of-thought dump. The report will appear automatically when synthesis is complete.
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text-faint)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Report Preview
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[1, 2, 3, 4].map((row) => (
                    <div
                      key={row}
                      style={{
                        height: row === 1 ? 18 : 10,
                        width: row === 1 ? "72%" : row === 2 ? "94%" : row === 3 ? "86%" : "78%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, rgba(46,46,78,0.5), rgba(90,90,120,0.18), rgba(46,46,78,0.5))",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.9s linear infinite",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
