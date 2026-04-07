import { useState } from "react";
import SystemDesign from "./SystemDesign.jsx";
import logo from "../assets/logo.webp";

export default function LandingPage({ onNavigate }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // Reusable SVG for Newspaper Document
  const NewspaperSVG = ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={color} opacity={opacity}>
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 15h10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 18h10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)", overflowX: "hidden", position: "relative" }}>
      
      {/* Keyframes for Floating Elements */}
      <style>
        {`
          @keyframes float-1 {
            0% { transform: translateY(0px) rotate(-8deg) scale(1); }
            50% { transform: translateY(-25px) rotate(4deg) scale(1.05); }
            100% { transform: translateY(0px) rotate(-8deg) scale(1); }
          }
          @keyframes float-2 {
            0% { transform: translateY(0px) rotate(12deg) scale(0.9); }
            50% { transform: translateY(-15px) rotate(-2deg) scale(0.95); }
            100% { transform: translateY(0px) rotate(12deg) scale(0.9); }
          }
          @keyframes float-3 {
            0% { transform: translateY(0px) rotate(-15deg) scale(1.1); }
            50% { transform: translateY(-30px) rotate(-3deg) scale(1.15); }
            100% { transform: translateY(0px) rotate(-15deg) scale(1.1); }
          }
           @keyframes float-4 {
            0% { transform: translateY(0px) rotate(20deg) scale(0.8); }
            50% { transform: translateY(-20px) rotate(5deg) scale(0.85); }
            100% { transform: translateY(0px) rotate(20deg) scale(0.8); }
          }
        `}
      </style>

      {/* Ambient Radial Glowing Background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "radial-gradient(circle at 50% 120%, rgba(201, 168, 76, 0.12) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }}></div>
      {/* Subtle Dot matrix overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 1 }}></div>

      {/* Navbar Minimal */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", position: "relative", zIndex: 10 }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: "var(--text)", display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="NuanceNode Logo" width="28" height="28" style={{ objectFit: "contain" }} />
          Nuance<span style={{ color: "var(--gold)" }}>Node</span>
        </div>
        
        <nav style={{ display: "flex", gap: 36, fontFamily: "var(--mono)", fontSize: 13, color: "var(--text-dim)", fontWeight: 500 }}>
          <span style={{ color: "var(--text)", cursor: "pointer" }}>Product</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="var(--text)"} onMouseLeave={e => e.target.style.color="var(--text-dim)"}>Code</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="var(--text)"} onMouseLeave={e => e.target.style.color="var(--text-dim)"}>Contact</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="var(--text)"} onMouseLeave={e => e.target.style.color="var(--text-dim)"}>API Docs</span>
        </nav>
        
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => onNavigate("login")}
            style={{ background: "transparent", border: "none", color: "var(--text)", padding: "10px 16px", fontFamily: "var(--body)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate("register")}
            style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 16px", fontFamily: "var(--body)", borderRadius: 6, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 100, position: "relative", zIndex: 10 }}>
        
        <div className="fade-up" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 900, padding: "0 24px" }}>
          
          {/* GitHub Style Massive Title */}
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "5rem", lineHeight: 1.1, fontWeight: 800, marginBottom: 24, color: "var(--text)", textShadow: "0 4px 24px rgba(0,0,0,0.5)", letterSpacing: "-0.03em" }}>
            Deconstruct the noise on a single, <span style={{ color: "var(--gold)" }}>objective platform</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontFamily: "var(--body)", fontSize: 20, color: "var(--text-dim)", marginBottom: 48, lineHeight: 1.6, fontWeight: 400 }}>
            Join the world's most intelligent fact-checking and logic-analysis engine.
          </p>

          {/* GitHub Style Form Bar & Buttons */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 16, height: 50, marginBottom: 64 }}>
            
            {/* Combo Input + Primary Button */}
            <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", width: 440 }}>
              <input 
                type="text" 
                placeholder="Enter a claim to verify..." 
                style={{ flex: 1, background: "transparent", border: "none", color: "var(--text)", padding: "0 16px", fontFamily: "var(--body)", fontSize: 15, outline: "none" }}
              />
              <button
                onClick={() => onNavigate("register")}
                style={{ background: "var(--gold)", color: "#000", border: "none", padding: "0 24px", fontFamily: "var(--body)", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "filter 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
              >
                Sign up for NuanceNode
              </button>
            </div>

            {/* Outline Secondary Button */}
            <button
              onClick={() => {
                const el = document.getElementById("system-design");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)", padding: "0 24px", fontFamily: "var(--body)", fontSize: 15, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-dim)"; e.currentTarget.style.background = "#ffffff0a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
            >
              System Architecture ↓
            </button>
          </div>
        </div>

        {/* Floating Newspapers Area */}
        <div style={{ position: "relative", width: "100%", height: 300, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 24 }}>
          
          {/* Newspaper 1 - Top Left */}
          <div style={{ position: "absolute", left: "20%", top: "10%", animation: "float-1 8s ease-in-out infinite" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(4px)", padding: 24, borderRadius: "20%", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 32px rgba(0,0,0,0.5)" }}>
               <NewspaperSVG size={64} color="var(--gold)" opacity={0.9} />
            </div>
          </div>

          {/* Newspaper 2 - Bottom Left */}
          <div style={{ position: "absolute", left: "30%", bottom: "0%", animation: "float-2 6s ease-in-out infinite" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(4px)", padding: 16, borderRadius: "20%", border: "1px solid rgba(255,255,255,0.08)" }}>
               <NewspaperSVG size={48} color="var(--text-faint)" opacity={0.6} />
            </div>
          </div>

          {/* Newspaper 3 - Center Glowing */}
          <div style={{ position: "absolute", left: "48%", top: "40%", animation: "float-3 7s ease-in-out infinite", zIndex: 12 }}>
            <div style={{ position: "absolute", inset: -20, background: "var(--gold)", filter: "blur(40px)", opacity: 0.15, borderRadius: "50%" }}></div>
            <div style={{ background: "rgba(201, 168, 76, 0.1)", backdropFilter: "blur(8px)", padding: 32, borderRadius: "25%", border: "1px solid var(--gold)", boxShadow: "0 24px 48px rgba(0,0,0,0.6), inset 0 0 20px rgba(201, 168, 76, 0.2)" }}>
               <NewspaperSVG size={80} color="var(--gold)" opacity={1} />
            </div>
          </div>

          {/* Newspaper 4 - Top Right */}
          <div style={{ position: "absolute", right: "25%", top: "15%", animation: "float-4 9s ease-in-out infinite" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(4px)", padding: 20, borderRadius: "20%", border: "1px solid rgba(255,255,255,0.08)" }}>
               <NewspaperSVG size={56} color="var(--text-dim)" opacity={0.7} />
            </div>
          </div>

          {/* Newspaper 5 - Bottom Right */}
          <div style={{ position: "absolute", right: "15%", bottom: "10%", animation: "float-1 7.5s ease-in-out infinite reverse" }}>
             <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(4px)", padding: 28, borderRadius: "20%", border: "1px solid rgba(255,255,255,0.1)" }}>
               <NewspaperSVG size={60} color="var(--gold)" opacity={0.8} />
            </div>
          </div>
          
        </div>
        
        {/* System Design Section component appended here */}
        <SystemDesign />

      </main>
    </div>
  );
}
