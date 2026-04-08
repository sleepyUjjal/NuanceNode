import logo from "../assets/logo.webp";

export default function SystemDesign({ onNavigate }) {
  const contactLinks = {
    email: "mailto:ujjaldeep.work@gmail.com",
    github: "https://github.com/sleepyUjjal",
    linkedin: "https://www.linkedin.com/in/ujjaldeep/",
  };

  const modules = [
    {
      id: "01",
      title: "Context Retrieval (RAG)",
      desc: "Our engine executes a dual-pass semantic sweep. It parallelizes history fetching and local context retrieval using LLM-generated embeddings, ensuring every verification is grounded in established facts from our MySQL databanks.",
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      )
    },
    {
      id: "02",
      title: "Live Semantic Search",
      desc: "When local context is insufficient, the engine dynamically delegates queries via a multi-threaded ThreadPoolExecutor. We instantly interact with DuckDuckGo Search APIs to pull real-time citations and bleeding-edge public records with near-zero latency.",
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e0e0ff" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      )
    },
    {
      id: "03",
      title: "Logic & Fallacy Critic",
      desc: "Driven by optimized local LLM inference pipelines, this protocol acts as an aggressive critic. It parses claim structures to isolate Ad Hominem attacks, Strawmen, and unsupported assumptions, separating raw fact from emotional manipulation.",
      svg: (
        <img src={logo} alt="Logic Engine" width="24" height="24" style={{ objectFit: "contain" }} />
      )
    },
    {
      id: "04",
      title: "Anatomy of Belief Modeler",
      desc: "We don't just output 'True' or 'False'. Our engine deconstructs linguistic and psychological hooks, detailing exactly why a statement might be inherently viral, mapping its specific cognitive biases down to the root cause.",
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e0e0ff" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    {
      id: "05",
      title: "Source Credibility Scoring",
      desc: "Every fetched citation undergoes algorithmic credibility weighting. The engine cross-references historical bias curves and source reliability to penalize unverified domains entirely automatically.",
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      id: "06",
      title: "Immutable Analysis Logs",
      desc: "Total transparency is mandated. Every single execution trace, from the raw retrieved sources to the LLM's final weighted judgements, is securely recorded and made accessible via our History API.",
      svg: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e0e0ff" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    }
  ];

  return (
    <section id="system-design" style={{ width: "100%", padding: "100px 48px 0px 48px", background: "transparent", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Header */}
      <div className="fade-up" style={{ textAlign: "center", marginBottom: 60, maxWidth: 800 }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 800, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.02em" }}>
          Behind the Analytical Engine
        </h2>
        <p style={{ fontFamily: "var(--body)", fontSize: 16, color: "var(--text-dim)", lineHeight: 1.6 }}>
          NuanceNode is driven by a bespoke multi-agent Python backend. It utilizes concurrent thread execution to fetch, criticize, and model claims in real-time.
        </p>
      </div>

      {/* Modules Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, width: "100%", maxWidth: 1200 }}>
        {modules.map((mod, index) => (
          <div 
            key={mod.id} 
            className="fade-up" 
            style={{ 
              animationDelay: (0.1 * index) + "s",
              background: "rgba(255,255,255,0.02)", 
              border: "1px solid rgba(255,255,255,0.06)", 
              borderRadius: 16, 
              padding: 40,
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.3s, background 0.3s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            {/* Ambient Background Number */}
            <div style={{ position: "absolute", right: -10, top: -20, fontSize: 120, fontFamily: "var(--mono)", fontWeight: 900, color: "rgba(255,255,255,0.03)", zIndex: 0, pointerEvents: "none" }}>
              {mod.id}
            </div>

            {/* Content Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                {mod.svg}
              </div>
              <h3 style={{ fontFamily: "var(--body)", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>
                {mod.title}
              </h3>
              <p style={{ fontFamily: "var(--body)", fontSize: 15, color: "var(--text-faint)", lineHeight: 1.6 }}>
                {mod.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Footer */}
      <footer style={{ marginTop: 100, width: "100%", padding: "48px 0", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontFamily: "var(--body)", fontSize: 15, fontWeight: 500 }}>
          <button
            type="button"
            onClick={() => onNavigate?.("about")}
            style={{ background: "none", border: "none", color: "var(--text)", textDecoration: "none", transition: "color 0.2s", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}
          >
            Contact
          </button>
          <a href={contactLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--text)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}>
            LinkedIn
          </a>
          <a href={contactLinks.github} target="_blank" rel="noreferrer" style={{ color: "var(--text)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}>
            GitHub
          </a>
          <a href={contactLinks.email} style={{ color: "var(--text)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}>
            Work Email
          </a>
        </div>

        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.05em", marginTop: 16 }}>
          © {new Date().getFullYear()} NUANCENODE SYSTEM V2.0 • BUILT FOR VERIFICATION
        </div>
      </footer>

    </section>
  );
}
