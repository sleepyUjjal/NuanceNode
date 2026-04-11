import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import AuthPage from "./modules/AuthPage.jsx";
import AboutPage from "./modules/AboutPage.jsx";
import Dashboard from "./modules/Dashboard.jsx";
import LandingPage from "./modules/LandingPage.jsx";
import FontLoader from "./modules/FontLoader.jsx";
import NotFoundPage from "./modules/NotFoundPage.jsx";

const ApiDocsPage = lazy(() => import("./modules/ApiDocsPage.jsx"));

function AuthWrapper({ token, setToken, initialMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.initialMode || initialMode;

  function handleLogin(nextToken) {
    setToken(nextToken);
    navigate("/"); // Redirect to dashboard after login
  }

  if (token) return <Navigate to="/" replace />;
  return <AuthPage initialMode={mode} onLogin={handleLogin} onBack={() => navigate("/")} />;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("nn_token") || null);

  function handleLogout() {
    localStorage.removeItem("nn_token");
    setToken(null);
  }

  return (
    <Router>
      <FontLoader />
      <Routes>
        <Route 
          path="/" 
          element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <LandingPage />} 
        />
        <Route path="/contact" element={<AboutPage />} />
        <Route path="/authen" element={<AuthWrapper token={token} setToken={setToken} initialMode="login" />} />
        <Route
          path="/docs"
          element={
            <Suspense fallback={null}>
              <ApiDocsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
