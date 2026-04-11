import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";

const contactLinks = {
  email: "mailto:ujjaldeep.work@gmail.com",
  github: "https://github.com/sleepyUjjal",
  linkedin: "https://www.linkedin.com/in/ujjaldeep/",
};

const stackGroups = [
  {
    title: "Frontend",
    items: ["React.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Backend",
    items: ["Python", "Django", "FastAPI", "Flask"],
  },
  {
    title: "Workflow",
    items: ["REST APIs", "SQL / Databases", "Git & GitHub", "AWS / Cloud Basics"],
  },
];

const skillAreas = [
  {
    title: "Backend Problem Solving",
    description:
      "I enjoy designing backend flows, thinking through application logic, and breaking down real-world problems into clear, buildable systems.",
  },
  {
    title: "System Design Curiosity",
    description:
      "I’m naturally curious about how systems connect behind the scenes, from APIs and services to the way products behave as complete workflows.",
  },
  {
    title: "Product Thinking",
    description:
      "I like thinking beyond code itself. I care about whether what I build is understandable, useful, and actually meaningful for the person using it.",
  },
  {
    title: "Collaboration & Learning",
    description:
      "I believe there’s always something to learn from other people. Staying open, learning fast, and improving continuously is a big part of how I work.",
  },
];

const contactCards = [
  {
    label: "Work Email",
    value: "ujjaldeep.work@gmail.com",
    href: contactLinks.email,
    note: "Best for collaboration and project discussions.",
  },
  {
    label: "GitHub",
    value: "sleepyUjjal",
    href: contactLinks.github,
    note: "Code, experiments, and project work.",
  },
  {
    label: "LinkedIn",
    value: "ujjaldeep",
    href: contactLinks.linkedin,
    note: "Professional profile and updates.",
  },
];

function sectionLabel(text) {
  return (
    <div
      style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--gold)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        marginBottom: 14,
      }}
    >
      {text}
    </div>
  );
}

export default function AboutPage() {
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
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 12% 14%, rgba(201,168,76,0.14) 0%, transparent 28%), radial-gradient(circle at 86% 18%, rgba(255,255,255,0.06) 0%, transparent 24%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      <header
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: isMobile ? "center" : "space-between",
          padding: isMobile ? "16px 20px" : "24px 48px",
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

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "var(--text)",
              cursor: "pointer",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "10px 14px",
              transition: "all 0.2s ease",
              boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
              e.currentTarget.style.background = "rgba(201,168,76,0.08)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate("/authen")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text)",
              cursor: "pointer",
              fontFamily: "var(--body)",
              fontSize: isMobile ? 12 : 14,
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => navigate("/authen", { state: { initialMode: "register" } })}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 10,
              color: "var(--text)",
              padding: isMobile ? "7px 12px" : "9px 16px",
              cursor: "pointer",
              fontFamily: "var(--body)",
              fontSize: isMobile ? 12 : 14,
            }}
          >
            Sign up
          </button>
        </div>
      </header>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "52px 48px 110px",
          display: "grid",
          gap: 28,
        }}
      >
        <section
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
            gap: 28,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: isMobile ? 24 : 34,
              boxShadow: "0 24px 64px rgba(0,0,0,0.34)",
            }}
          >
            {sectionLabel("About")}
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: isMobile ? 40 : 56,
                lineHeight: 1.03,
                marginBottom: 20,
                maxWidth: 560,
              }}
            >
              Ujjaldeep Singh
            </h1>
            <p style={{ fontSize: isMobile ? 14 : 16, color: "var(--text-dim)", lineHeight: 1.85, marginBottom: 18, maxWidth: 680 }}>
              Hi everyone! I’m Ujjaldeep, an aspiring backend developer who’s curious about how things actually work
              behind what we see on the internet.
            </p>
            <p style={{ fontSize: isMobile ? 12 : 14, color: "#a9a9bc", lineHeight: 1.9, marginBottom: 18, maxWidth: 700 }}>
              I enjoy solving real-world problems using logic and programming, and I’m always trying to build things
              that are not only functional but also meaningful.
            </p>
            <p style={{ fontSize: isMobile ? 12 : 14, color: "#a9a9bc", lineHeight: 1.9, marginBottom: 18, maxWidth: 700 }}>
              I keep exploring new technologies to stay engaged and keep learning. My tech stack includes React.js for
              frontend and Python with Django, FastAPI, and Flask for backend development.
            </p>
            <p style={{ fontSize: isMobile ? 12 : 14, color: "#a9a9bc", lineHeight: 1.9, maxWidth: 700 }}>
              I believe in learning from anyone and everyone, constantly improving myself every day. I’m always open to
              collaborating, learning, and building something impactful.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, rgba(201,168,76,0.10), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: isMobile ? 24 : 28,
              boxShadow: "0 24px 64px rgba(0,0,0,0.34)",
              display: "grid",
              gap: 18,
              alignContent: "start",
            }}
          >
            {sectionLabel("Profile")}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(201,168,76,0.98), rgba(122,97,48,0.95))",
                  color: "#0a0805",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                US
              </div>
              <div>
                <div style={{ fontSize: isMobile ? 15 : 18, color: "var(--text)", fontWeight: 700 }}>Aspiring Backend Developer</div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: isMobile ? 10 : 11,
                    color: "#9f9fb5",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Logic • APIs • Real-world problem solving
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Curious about systems behind the interface",
                "Interested in meaningful and useful software",
                "Always learning, iterating, and improving",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      marginTop: 8,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      boxShadow: "0 0 12px rgba(201,168,76,0.28)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontSize: isMobile ? 12 : 14.5, color: "#b5b5c8", lineHeight: 1.7 }}>{item}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 6 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "#9f9fb5",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skillAreas.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.045)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "#c5c5d6",
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="fade-up-1"
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 20px 56px rgba(0,0,0,0.32)",
            }}
          >
            {sectionLabel("Tech Stack")}
            <p style={{ fontSize: 14.5, color: "#b0b0c3", lineHeight: 1.7, marginBottom: 16 }}>
              These are the tools and frameworks I currently use the most while building frontend and backend projects.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              {stackGroups.map((group) => (
                <div
                  key={group.title}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      color: "#9d9db0",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {group.title}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {group.items.map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "9px 12px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          fontFamily: "var(--mono)",
                          fontSize: 12,
                          color: "#c5c5d6",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 20px 56px rgba(0,0,0,0.32)",
            }}
          >
            {sectionLabel("Core Skills")}
            <p style={{ fontSize: 14.5, color: "#b0b0c3", lineHeight: 1.7, marginBottom: 16 }}>
              Beyond the stack itself, these are the strengths and habits that shape how I approach engineering work.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {skillAreas.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ fontSize: 18, color: "var(--text)", fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 14.5, color: "#b5b5c8", lineHeight: 1.7 }}>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="fade-up-2"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: isMobile ? 24 : 30,
            boxShadow: "0 24px 64px rgba(0,0,0,0.32)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.9fr) minmax(320px, 1.1fr)",
              gap: 28,
              alignItems: "start",
            }}
          >
            <div>
              {sectionLabel("Contact")}
              <h2 style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 26 : 36, lineHeight: 1.12, marginBottom: 14 }}>
                Open to collaboration, learning, and meaningful work
              </h2>
              <p style={{ fontSize: isMobile ? 13 : 16, color: "#b0b0c3", lineHeight: 1.85, maxWidth: 540 }}>
                If you want to connect for collaboration, backend work, project discussions, or just to exchange ideas,
                you can reach me through the links here.
              </p>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {contactCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={card.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 18,
                    padding: "18px 20px",
                    transition: "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.38)";
                    e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      color: "#9d9db0",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {card.label}
                  </div>
                  <div style={{ fontSize: 18, color: "var(--text)", marginBottom: 4, wordBreak: "break-word" }}>{card.value}</div>
                  <div style={{ fontSize: 13, color: "#b0b0c3" }}>{card.note}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div
          className="fade-up-3"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "#9f9fb2",
              letterSpacing: "0.06em",
            }}
          >
            Built with curiosity, consistency, and a lot of iteration.
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderRadius: 12,
              padding: "12px 16px",
              cursor: "pointer",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.05em",
            }}
          >
            Back to Landing
          </button>
        </div>
      </main>
    </div>
  );
}
