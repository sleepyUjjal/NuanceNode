import { useState } from "react";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

import { apiFetch } from "./api.js";
import { btnPrimaryStyle, inputStyle } from "./sharedStyles.js";
import logo from "../assets/logo.webp";

export default function AuthPage({ initialMode = "login", onLogin, onBack }) {
  const [mode, setMode] = useState(initialMode); // login | register | verify | forgot | reset
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await apiFetch("/register", { method: "POST", body: JSON.stringify({ full_name: fullName, email, password }) });
        setMode("verify");
        setError("Account created! Please check your email for the 6-digit verification code.");
      } else if (mode === "verify") {
        const data = await apiFetch("/verify-email", { method: "POST", body: JSON.stringify({ email, otp }) });
        localStorage.setItem("nn_token", data.access_token);
        onLogin(data.access_token);
      } else if (mode === "forgot") {
        await apiFetch("/auth/send-reset-otp", { method: "POST", body: JSON.stringify({ email }) });
        setMode("reset");
        setError("Reset code sent! Please check your email.");
      } else if (mode === "reset") {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        await apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, otp, new_password: password }) });
        setMode("login");
        setError("Password has been successfully updated! You can now sign in.");
      } else {
        const data = await apiFetch("/login", { method: "POST", body: JSON.stringify({ email, password }) });
        localStorage.setItem("nn_token", data.access_token);
        onLogin(data.access_token);
      }
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("verify your email")) {
        setMode("verify");
      }
    } finally {
      setLoading(false);
    }
  }

  const googleLoginAction = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleSuccess(codeResponse.access_token),
    onError: (error) => setError("Google Sign-In failed.")
  });

  async function handleGoogleSuccess(accessToken) {
    setError("");
    setLoading(true);
    try {
      // Sending access_token to backend.
      const data = await apiFetch("/auth/google", { method: "POST", body: JSON.stringify({ token: accessToken }) });
      localStorage.setItem("nn_token", data.access_token);
      onLogin(data.access_token);
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
      <div className="fade-up" style={{ width: "100%", maxWidth: 420, padding: "0 24px", position: "relative" }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ position: "absolute", top: -40, left: 24, background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
          >
            ← Back to Home
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12
            }}
          >
            <img src={logo} alt="Logo" width="40" height="40" style={{ objectFit: "contain" }} />
            <span>Nuance<span style={{ color: "var(--gold)" }}>Node</span></span>
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
          {(mode === "login" || mode === "register") && (
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
          )}
          {mode === "verify" && (
            <div style={{ marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                <h3 style={{ margin: 0, color: "var(--text)", fontSize: 16, fontFamily: "var(--mono)" }}>Verify Email</h3>
            </div>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <div style={{ marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                <h3 style={{ margin: 0, color: "var(--text)", fontSize: 16, fontFamily: "var(--mono)" }}>Reset Password</h3>
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                style={inputStyle}
              />
            )}
            
            {(mode === "login" || mode === "register" || mode === "forgot") && (
              <>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  style={inputStyle}
                />
                {(mode === "login" || mode === "register") && (
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={8}
                      style={{ ...inputStyle, width: "100%", paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--text-faint)"
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                )}
              </>
            )}

            {(mode === "verify" || mode === "reset") && (
                <>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    style={{ ...inputStyle, opacity: 0.7 }}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="6-digit Verification Code"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    required
                    maxLength={10}
                    style={{ ...inputStyle, textAlign: "center", letterSpacing: "4px" }}
                  />
                  {mode === "reset" && (
                    <>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={8}
                        style={inputStyle}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        minLength={8}
                        style={inputStyle}
                      />
                    </>
                  )}
                </>
            )}

            {error && (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: error.includes("created!") || error.includes("sent!") || error.includes("successfully") ? "var(--green)" : "var(--red)",
                  padding: "8px 12px",
                  background: error.includes("created!") || error.includes("sent!") || error.includes("successfully") ? "var(--green-dim)" : "var(--red-dim)",
                  borderRadius: 6,
                  borderLeft: `3px solid ${error.includes("created!") || error.includes("sent!") || error.includes("successfully") ? "var(--green)" : "var(--red)"}`,
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={btnPrimaryStyle}>
              {loading 
                ? "Please wait…" 
                : mode === "login" 
                  ? "Sign In →" 
                  : mode === "register" ? "Create Account →" 
                  : mode === "forgot" ? "Send Reset Code →"
                  : mode === "reset" ? "Reset Password →"
                  : "Verify OTP →"}
            </button>
          </form>

          {(mode === "login" || mode === "register") && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase" }}>or</div>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => googleLoginAction()}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    padding: "12px 24px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "var(--text)",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = "var(--text-faint)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.71 22.36 9.98H12V14.28H17.92C17.67 15.67 16.89 16.84 15.72 17.61V20.35H19.28C21.36 18.44 22.56 15.61 22.56 12.25Z" fill="#4285F4" />
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.35L15.72 17.61C14.74 18.27 13.48 18.66 12 18.66C9.14 18.66 6.71 16.73 5.84 14.14H2.18V16.98C4.03 20.65 7.73 23 12 23Z" fill="#34A853" />
                    <path d="M5.84 14.14C5.62 13.48 5.49 12.76 5.49 12C5.49 11.24 5.62 10.52 5.84 9.86V7.02H2.18C1.42 8.52 1 10.21 1 12C1 13.79 1.42 15.48 2.18 16.98L5.84 14.14Z" fill="#FBBC05" />
                    <path d="M12 5.34C13.62 5.34 15.06 5.9 16.21 7.01L19.35 3.87C17.45 2.1 14.96 1 12 1C7.73 1 4.03 3.35 2.18 7.02L5.84 9.86C6.71 7.27 9.14 5.34 12 5.34Z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </>
          )}

          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
                <button 
                type="button" 
                onClick={() => setMode("forgot")}
                style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, textDecoration: "underline" }}
                >
                    Forgot Password?
                </button>
            </div>
          )}

          {(mode === "verify" || mode === "forgot" || mode === "reset") && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                  <button 
                  type="button" 
                  onClick={() => setMode("login")}
                  style={{ background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, textDecoration: "underline" }}
                  >
                      Back to Sign In
                  </button>
              </div>
          )}

        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-faint)" }}>
          Powered by local LLM + live web search
        </div>
      </div>
    </div>
  );
}
