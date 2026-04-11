import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useState, useEffect } from "react";

import logo from "../assets/logo.webp";
import { resolveApiUrl } from "./api.js";

const schemaLinks = {
  json: resolveApiUrl("/openapi/download.json"),
  yaml: resolveApiUrl("/openapi/download.yaml"),
};

const swaggerSpecUrl = resolveApiUrl("/openapi.json");

function navButtonStyle(outlined = false, isMobile = false) {
  return {
    background: outlined ? "transparent" : "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "var(--text)",
    cursor: "pointer",
    fontFamily: outlined ? "var(--body)" : "var(--mono)",
    fontSize: isMobile ? (outlined ? 13 : 11) : (outlined ? 14 : 12),
    letterSpacing: outlined ? "0" : "0.06em",
    textTransform: outlined ? "none" : "uppercase",
    padding: isMobile ? (outlined ? "7px 10px" : "8px 10px") : (outlined ? "9px 16px" : "10px 14px"),
    transition: "all 0.2s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap"
  };
}

export default function ApiDocsPage({ onNavigate }) {
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
        overflow: "hidden",
      }}
    >
      <style>
        {`
          .nuancenode-swagger-shell .swagger-ui {
            font-family: var(--body);
            color: #e8e8f0;
          }

          .nuancenode-swagger-shell .swagger-ui,
          .nuancenode-swagger-shell .swagger-ui section,
          .nuancenode-swagger-shell .swagger-ui .wrapper,
          .nuancenode-swagger-shell .swagger-ui .information-container {
            background: transparent;
          }

          .nuancenode-swagger-shell .swagger-ui .topbar {
            display: none;
          }

          .nuancenode-swagger-shell .swagger-ui .info,
          .nuancenode-swagger-shell .swagger-ui .scheme-container,
          .nuancenode-swagger-shell .swagger-ui .wrapper {
            max-width: none;
          }

          .nuancenode-swagger-shell .swagger-ui .scheme-container {
            box-shadow: none;
            background: transparent;
            padding: 0;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title,
          .nuancenode-swagger-shell .swagger-ui .info p,
          .nuancenode-swagger-shell .swagger-ui .info li,
          .nuancenode-swagger-shell .swagger-ui .markdown p,
          .nuancenode-swagger-shell .swagger-ui .markdown li,
          .nuancenode-swagger-shell .swagger-ui .opblock-description-wrapper p,
          .nuancenode-swagger-shell .swagger-ui .response-col_description,
          .nuancenode-swagger-shell .swagger-ui .parameter__type,
          .nuancenode-swagger-shell .swagger-ui .tab li,
          .nuancenode-swagger-shell .swagger-ui label,
          .nuancenode-swagger-shell .swagger-ui .responses-table td,
          .nuancenode-swagger-shell .swagger-ui .responses-table th,
          .nuancenode-swagger-shell .swagger-ui .model,
          .nuancenode-swagger-shell .swagger-ui .model-title,
          .nuancenode-swagger-shell .swagger-ui .prop-type,
          .nuancenode-swagger-shell .swagger-ui .prop-format,
          .nuancenode-swagger-shell .swagger-ui .parameter__name,
          .nuancenode-swagger-shell .swagger-ui .response-col_status,
          .nuancenode-swagger-shell .swagger-ui .responses-inner h4,
          .nuancenode-swagger-shell .swagger-ui .responses-inner h5,
          .nuancenode-swagger-shell .swagger-ui .opblock-tag,
          .nuancenode-swagger-shell .swagger-ui .opblock-summary-path,
          .nuancenode-swagger-shell .swagger-ui .opblock-summary-description,
          .nuancenode-swagger-shell .swagger-ui .opblock-summary-method {
            color: #e8e8f0;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title,
          .nuancenode-swagger-shell .swagger-ui .opblock-tag,
          .nuancenode-swagger-shell .swagger-ui .opblock-summary-path,
          .nuancenode-swagger-shell .swagger-ui .opblock-summary-method,
          .nuancenode-swagger-shell .swagger-ui .parameter__name,
          .nuancenode-swagger-shell .swagger-ui .response-col_status,
          .nuancenode-swagger-shell .swagger-ui .responses-inner h4,
          .nuancenode-swagger-shell .swagger-ui .responses-inner h5 {
            font-family: var(--mono);
          }

          .nuancenode-swagger-shell .swagger-ui .info a,
          .nuancenode-swagger-shell .swagger-ui .markdown a,
          .nuancenode-swagger-shell .swagger-ui .response-col_links a {
            color: #e2c56f;
          }

          .nuancenode-swagger-shell .swagger-ui .info > a,
          .nuancenode-swagger-shell .swagger-ui .info a.link,
          .nuancenode-swagger-shell .swagger-ui .info .link {
            display: none !important;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title small,
          .nuancenode-swagger-shell .swagger-ui .info .title .version-stamp {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 34px;
            margin-left: 10px;
            padding: 0 12px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.04);
            color: #f4f0e4;
            box-shadow: none;
            vertical-align: middle;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title small {
            font-size: 0.42em;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title .version-stamp {
            background: rgba(201, 168, 76, 0.12);
            border-color: rgba(201, 168, 76, 0.32);
            color: #f0d786;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title small pre,
          .nuancenode-swagger-shell .swagger-ui .info .title .version-stamp {
            font-family: var(--mono);
            font-size: 0.95rem;
            line-height: 1;
            margin: 0;
          }

          .nuancenode-swagger-shell .swagger-ui .info .title small pre {
            background: transparent;
            color: inherit;
            padding: 0;
          }

          .nuancenode-swagger-shell .swagger-ui .info .base-url,
          .nuancenode-swagger-shell .swagger-ui .info > div:first-of-type {
            display: none;
          }

          .nuancenode-swagger-shell .swagger-ui .info div a[href^="mailto:"],
          .nuancenode-swagger-shell .swagger-ui .info div a[href^="https://"],
          .nuancenode-swagger-shell .swagger-ui .info div a[href^="http://"] {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
            padding: 8px 12px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-dim);
            font-family: var(--mono);
            font-size: 12px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .nuancenode-swagger-shell .swagger-ui .info div a[href^="mailto:"]:hover,
          .nuancenode-swagger-shell .swagger-ui .info div a[href^="https://"]:hover,
          .nuancenode-swagger-shell .swagger-ui .info div a[href^="http://"]:hover {
            border-color: rgba(201, 168, 76, 0.24);
            background: rgba(201, 168, 76, 0.08);
            color: #f0d786;
          }

          .nuancenode-swagger-shell .swagger-ui .opblock-tag,
          .nuancenode-swagger-shell .swagger-ui .opblock .opblock-section-header,
          .nuancenode-swagger-shell .swagger-ui .responses-inner,
          .nuancenode-swagger-shell .swagger-ui table tbody tr td,
          .nuancenode-swagger-shell .swagger-ui table thead tr th,
          .nuancenode-swagger-shell .swagger-ui .tab li,
          .nuancenode-swagger-shell .swagger-ui .model-box {
            border-color: rgba(255, 255, 255, 0.08);
          }

          .nuancenode-swagger-shell .swagger-ui .opblock-tag {
            background: rgba(255, 255, 255, 0.02);
            display: flex;
            flex-wrap: wrap !important;
            row-gap: 8px;
          }

          .nuancenode-swagger-shell .swagger-ui .opblock-tag small {
             flex: 1 1 100%;
          }

          .nuancenode-swagger-shell .swagger-ui .opblock {
            background: rgba(255, 255, 255, 0.03);
            border-width: 1px;
            box-shadow: none;
          }

          .nuancenode-swagger-shell .swagger-ui .opblock .opblock-summary,
          .nuancenode-swagger-shell .swagger-ui .opblock .opblock-section-header,
          .nuancenode-swagger-shell .swagger-ui .responses-inner {
            background: rgba(0, 0, 0, 0.12);
          }

          .nuancenode-swagger-shell .swagger-ui .opblock-summary-method {
            min-width: 80px;
          }

          .nuancenode-swagger-shell .swagger-ui .parameters-col_description input,
          .nuancenode-swagger-shell .swagger-ui .parameters-col_description textarea,
          .nuancenode-swagger-shell .swagger-ui input[type="text"],
          .nuancenode-swagger-shell .swagger-ui textarea {
            background: rgba(8, 8, 13, 0.78);
            color: #f3f3f8;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: none;
          }

          .nuancenode-swagger-shell .swagger-ui select {
            background: rgba(8, 8, 13, 0.9);
            color: #f3f3f8;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nuancenode-swagger-shell .swagger-ui .highlight-code,
          .nuancenode-swagger-shell .swagger-ui .microlight,
          .nuancenode-swagger-shell .swagger-ui pre,
          .nuancenode-swagger-shell .swagger-ui .model-example,
          .nuancenode-swagger-shell .swagger-ui .highlight-code > .microlight {
            background: #0d0d15;
            color: #f1f1f7;
          }

          .nuancenode-swagger-shell .swagger-ui .btn,
          .nuancenode-swagger-shell .swagger-ui .download-contents,
          .nuancenode-swagger-shell .swagger-ui .try-out__btn,
          .nuancenode-swagger-shell .swagger-ui .execute,
          .nuancenode-swagger-shell .swagger-ui .btn.cancel {
            border-radius: 10px;
            box-shadow: none;
          }

          .nuancenode-swagger-shell .swagger-ui .btn.authorize {
            border-color: #c9a84c;
            color: #e2c56f;
            background: rgba(201, 168, 76, 0.08);
          }

          .nuancenode-swagger-shell .swagger-ui .btn.cancel,
          .nuancenode-swagger-shell .swagger-ui .btn.execute,
          .nuancenode-swagger-shell .swagger-ui .btn.try-out__btn {
            border-color: rgba(255, 255, 255, 0.12);
          }

          .nuancenode-swagger-shell .swagger-ui svg,
          .nuancenode-swagger-shell .swagger-ui svg path {
            fill: currentColor;
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 14% 16%, rgba(201,168,76,0.12) 0%, transparent 28%), radial-gradient(circle at 86% 12%, rgba(255,255,255,0.06) 0%, transparent 24%)",
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
          onClick={() => onNavigate("landing")}
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
          Nuance<span style={{ color: "var(--gold)" }}>Node</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 12 }}>
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            style={navButtonStyle(false, isMobile)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
              e.currentTarget.style.background = "rgba(201,168,76,0.08)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            style={{ ...navButtonStyle(true, isMobile), border: "none" }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => onNavigate("register")}
            style={navButtonStyle(true, isMobile)}
          >
            Sign up
          </button>
        </div>
      </header>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1240,
          margin: "0 auto",
          padding: isMobile ? "12px 20px 60px" : "20px 48px 72px",
        }}
      >
        <section
          className="fade-up"
          style={{
            display: "grid",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 24px 64px rgba(0,0,0,0.34)",
            }}
          >
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
              API Docs
            </div>
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto",
                alignItems: isMobile ? "start" : "end",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
                    lineHeight: 1.05,
                    marginBottom: 12,
                  }}
                >
                  Explore NuanceNode&apos;s API
                </h1>
                <p style={{ fontSize: isMobile ? 14 : 15, color: "var(--text-dim)", lineHeight: 1.6, maxWidth: 760 }}>
                  This page renders the live OpenAPI schema exposed by the backend, so the docs stay synced with the
                  running FastAPI service. You can inspect endpoints here or download the schema directly as JSON or
                  YAML.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-end" }}>
                <a href={schemaLinks.json} style={navButtonStyle(true, isMobile)}>
                  Download JSON
                </a>
                <a href={schemaLinks.yaml} style={navButtonStyle(true, isMobile)}>
                  Download YAML
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="fade-up-1"
          style={{
            background: "linear-gradient(180deg, rgba(18,18,28,0.96), rgba(12,12,20,0.98))",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.38)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Live schema
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 14 }}>
                Loaded from Backend
              </div>
            </div>
          </div>

          <div className="nuancenode-swagger-shell" style={{ padding: isMobile ? "8px 12px 28px" : "8px 24px 28px" }}>
            <SwaggerUI url={swaggerSpecUrl} docExpansion="list" defaultModelsExpandDepth={-1} displayRequestDuration />
          </div>
        </section>
      </main>
    </div>
  );
}
