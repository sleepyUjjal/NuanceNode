import { useState } from "react";

import AuthPage from "./modules/AuthPage.jsx";
import Dashboard from "./modules/Dashboard.jsx";
import FontLoader from "./modules/FontLoader.jsx";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("nn_token") || null);

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
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </>
  );
}
