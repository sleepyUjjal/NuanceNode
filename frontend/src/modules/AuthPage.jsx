import { useState } from "react";

import { apiFetch } from "./api.js";
import { btnPrimaryStyle, inputStyle } from "./sharedStyles.js";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await apiFetch("/register", { method: "POST", body: JSON.stringify({ email, password }) });
        setMode("login");
        setError("Account created — please log in.");
      } else {
        const data = await apiFetch("/login", { method: "POST", body: JSON.stringify({ email, password }) });
        localStorage.setItem("nn_token", data.access_token);
        onLogin(data.access_token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #1a1520 0%, transparent 70%)",
      }}
    >
      <div className="fade-up" style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: 6,
            }}
          >
            Nuance<span style={{ color: "var(--gold)" }}>Node</span>
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-faint)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            AI Fact Intelligence
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 36 }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "1px solid var(--border)" }}>
            {["login", "register"].map((nextMode) => (
              <button
                key={nextMode}
                onClick={() => setMode(nextMode)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: mode === nextMode ? "var(--gold)" : "var(--text-faint)",
                  padding: "8px 0 12px",
                  borderBottom: `2px solid ${mode === nextMode ? "var(--gold)" : "transparent"}`,
                  marginBottom: -1,
                  transition: "all 0.2s",
                }}
              >
                {nextMode === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              style={inputStyle}
            />

            {error && (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: error.includes("created") ? "var(--green)" : "var(--red)",
                  padding: "8px 12px",
                  background: error.includes("created") ? "var(--green-dim)" : "var(--red-dim)",
                  borderRadius: 6,
                  borderLeft: `3px solid ${error.includes("created") ? "var(--green)" : "var(--red)"}`,
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={btnPrimaryStyle}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-faint)" }}>
          Powered by local LLM + live web search
        </div>
      </div>
    </div>
  );
}
