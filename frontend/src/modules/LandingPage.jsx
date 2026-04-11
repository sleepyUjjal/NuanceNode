import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SystemDesign from "./SystemDesign.jsx";
import logo from "../assets/logo.webp";

function NewspaperSVG({ size, color, opacity }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={color} opacity={opacity}>
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 15h10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 18h10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HamburgerIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

function CloseIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 650;

  function scrollToSection(sectionId) {
    setIsMobileMenuOpen(false); // Close menu on click
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function navLinkStyle(isPrimary = false) {
    return {
      color: isPrimary ? "var(--text)" : "var(--text-dim)",
      cursor: "pointer",
      textDecoration: "none",
      transition: "color 0.2s",
    };
  }

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
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "20px 24px" : "24px 48px", position: "relative", zIndex: 10 }}>
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 20 : 22, fontWeight: 900, color: "var(--text)", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", zIndex: 20 }}
        >
          <img src={logo} alt="NuanceNode Logo" width={isMobile ? 20 : 28} height={isMobile ? 20 : 28} style={{ objectFit: "contain" }} />
          <span>Nuance<span style={{ color: "var(--gold)" }}>Node</span></span>
        </button>
        
        {/* Desktop Navbar */}
        {!isMobile && (
          <>
            <nav style={{ display: "flex", gap: 36, fontFamily: "var(--mono)", fontSize: 13, color: "var(--text-dim)", fontWeight: 500 }}>
              <button
                type="button"
                onClick={() => scrollToSection("hero")}
                style={{ ...navLinkStyle(true), background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit" }}
              >
                Product
              </button>
              <a
                href="https://github.com/sleepyUjjal/NuanceNode"
                target="_blank"
                rel="noreferrer"
                style={navLinkStyle()}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
              >
                Code
              </a>
              <button
                type="button"
                onClick={() => navigate("/contact")}
                style={{ ...navLinkStyle(), background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => navigate("/docs")}
                style={{ ...navLinkStyle(), background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
              >
                API Docs
              </button>
            </nav>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={() => navigate("/authen")}
                style={{ background: "transparent", border: "none", color: "var(--text)", padding: "10px 16px", fontFamily: "var(--body)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/authen", { state: { initialMode: "register" } })}
                style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 16px", fontFamily: "var(--body)", borderRadius: 6, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                Sign up
              </button>
            </div>
          </>
        )}

        {/* Mobile Hamburger Button */}
        {isMobile && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", zIndex: 20 }}
          >
            <HamburgerIcon />
          </button>
        )}
      </header>

      {/* Mobile Menu Overlay & Drawer */}
      {isMobile && (
        <>
          {/* Dark Overlay (Click to close) */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.6)", zIndex: 30, opacity: isMobileMenuOpen ? 1 : 0, pointerEvents: isMobileMenuOpen ? "auto" : "none", transition: "opacity 0.3s ease", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer Sliding from Right */}
          <div style={{ position: "fixed", top: 0, right: 0, width: 280, height: "100%", background: "var(--surface)", borderLeft: "1px solid var(--border)", zIndex: 40, transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", flexDirection: "column", padding: "24px", boxSizing: "border-box", boxShadow: "-8px 0 24px rgba(0,0,0,0.5)" }}>
            
            {/* Header with Close Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 48 }}>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 8, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}>
                <CloseIcon />
              </button>
            </div>

            {/* Nav Links */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 32, fontFamily: "var(--mono)", fontSize: 16, color: "var(--text-dim)", fontWeight: 500, textAlign: "left", paddingLeft: 8 }}>
              <button type="button" onClick={() => scrollToSection("hero")} style={{ ...navLinkStyle(), background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit", textAlign: "left" }}>
                Product
              </button>
              <a href="https://github.com/sleepyUjjal/NuanceNode" target="_blank" rel="noreferrer" style={navLinkStyle()}>
                Code
              </a>
              <button type="button" onClick={() => navigate("/contact")} style={{ ...navLinkStyle(), background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit", textAlign: "left" }}>
                Contact
              </button>
              <button type="button" onClick={() => navigate("/docs")} style={{ ...navLinkStyle(), background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit", textAlign: "left" }}>
                API Docs
              </button>
              
              <div style={{ width: "100%", height: 1, background: "var(--border)", margin: "8px 0" }}></div>

              <button onClick={() => navigate("/authen")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text)", padding: "12px 24px", fontFamily: "var(--body)", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "center" }}>
                Sign in
              </button>
              <button onClick={() => navigate("/authen", { state: { initialMode: "register" } })} style={{ background: "var(--gold)", color: "#000", border: "none", padding: "12px 24px", fontFamily: "var(--body)", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "center", marginTop: 8 }}>
                Sign up
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Hero Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: isMobile ? 60 : 100, position: "relative", zIndex: 10 }}>
        
        <div id="hero" className="fade-up" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 900, padding: "0 24px" }}>
          
          {/* Main Title */}
          <h1 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? "2.5rem" : "3.8rem", lineHeight: 1.1, fontWeight: 800, marginBottom: 24, color: "var(--text)", textShadow: "0 4px 24px rgba(0,0,0,0.5)", letterSpacing: "-0.03em", wordWrap: "break-word" }}>
            Deconstruct the noise on a single, <span style={{ color: "var(--gold)" }}>objective platform</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontFamily: "var(--body)", fontSize: isMobile ? 16 : 18, color: "var(--text-dim)", marginBottom: 48, lineHeight: 1.6, fontWeight: 400 }}>
            Join the world's most intelligent fact-checking and logic-analysis engine.
          </p>

          {/* Search/Signup Form Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16, width: "100%", marginBottom: 64 }}>
            
            <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", width: "100%", maxWidth: 440, height: 46 }}>
              <input 
                type="text" 
                placeholder="Enter a claim to verify..." 
                style={{ flex: 1, background: "transparent", border: "none", color: "var(--text)", padding: "0 16px", fontFamily: "var(--body)", fontSize: 14, outline: "none", minWidth: 0 }}
              />
              <button
                onClick={() => navigate("/authen", { state: { initialMode: "register" } })}
                style={{ background: "var(--gold)", color: "#000", border: "none", padding: isMobile ? "0 16px" : "0 20px", fontFamily: "var(--body)", fontSize: isMobile ? 13 : 14, fontWeight: 700, cursor: "pointer", transition: "filter 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
              >
                Sign up
              </button>
            </div>

            <button
              onClick={() => scrollToSection("system-design")}
              style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)", padding: "0 20px", fontFamily: "var(--body)", fontSize: 14, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46 }}
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
