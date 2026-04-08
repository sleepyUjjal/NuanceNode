import { useState } from "react";

import AuthPage from "./modules/AuthPage.jsx";
import AboutPage from "./modules/AboutPage.jsx";
import Dashboard from "./modules/Dashboard.jsx";
import LandingPage from "./modules/LandingPage.jsx";
import FontLoader from "./modules/FontLoader.jsx";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("nn_token") || null);
  const [authView, setAuthView] = useState("landing");

  function handleLogin(nextToken) {
    setToken(nextToken);
  }

  function handleLogout() {
    localStorage.removeItem("nn_token");
    setToken(null);
  }

  return (
    <>
      <FontLoader />
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : authView === "about" ? (
        <AboutPage onNavigate={setAuthView} />
      ) : authView === "landing" ? (
        <LandingPage onNavigate={setAuthView} />
      ) : (
        <AuthPage initialMode={authView} onLogin={handleLogin} onBack={() => setAuthView("landing")} />
      )}
    </>
  );
}
