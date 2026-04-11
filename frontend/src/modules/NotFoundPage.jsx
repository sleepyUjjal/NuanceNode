import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 650;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.08) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      ></div>

      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "20px 24px" : "24px 48px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "none",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontFamily: "var(--serif)",
            fontSize: isMobile ? 20 : 22,
            fontWeight: 900,
          }}
        >
          <img src={logo} alt="NuanceNode Logo" width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ objectFit: "contain" }} />
          <span>Nuance<span style={{ color: "var(--gold)" }}>Node</span></span>
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          className="fade-up"
          style={{
            fontFamily: "var(--mono)",
            fontSize: isMobile ? 80 : 120,
            fontWeight: 900,
            color: "rgba(255, 255, 255, 0.05)",
            background: "linear-gradient(180deg, var(--gold) 0%, var(--bg) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            marginBottom: -20,
            zIndex: -1,
            position: "absolute",
            top: "10%"
          }}
        >
          404
        </div>

        <h1
          className="fade-up"
          style={{
            fontFamily: "var(--serif)",
            fontSize: isMobile ? "2rem" : "3rem",
            lineHeight: 1.1,
            fontWeight: 800,
            color: "var(--text)",
            marginBottom: 24,
            letterSpacing: "-0.03em",
          }}
        >
          This Page Does Not Exist
        </h1>

        <p
          className="fade-up"
          style={{
            fontFamily: "var(--body)",
            fontSize: isMobile ? 15 : 18,
            color: "var(--text-dim)",
            marginBottom: 48,
            maxWidth: 500,
            lineHeight: 1.6,
            animationDelay: "0.1s",
          }}
        >
          The page or system component you are looking for has been deconstructed or does not exist at this coordinate.
        </p>

        <button
          className="fade-up"
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            color: "var(--text)",
            border: "1px solid var(--border)",
            padding: "0 24px",
            height: 48,
            fontFamily: "var(--body)",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            animationDelay: "0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-dim)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Return to Dashboard
        </button>
      </main>
    </div>
  );
}
