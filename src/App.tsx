import React, { lazy, Suspense, useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { login as apiLogin, logout as apiLogout } from "./services/api";
import { User } from "./types";
import LoginPage from "./pages/LoginPage/LoginPage";
import SessionTimer from "./components/SessionTimer/SessionTimer";

const SearchPage = lazy(() => import("./pages/SearchPage/SearchPage"));

const SESSION_DURATION = 3600; // session duration in seconds (1 hour)

const App: React.FC = () => {
  const navigate = useNavigate();

  // Initialize user from localStorage if available.
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [expirationTime, setExpirationTime] = useState<number>(() => {
    const storedExp = localStorage.getItem("expirationTime");
    return storedExp ? Number(storedExp) : Date.now() + SESSION_DURATION * 1000;
  });

  // Handle login: call the API, store user info and timestamps, then navigate to search.
  const handleLogin = async (name: string, email: string) => {
    try {
      await apiLogin(name, email);
      const loggedInUser: User = { name, email };
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      const now = Date.now();
      const expTime = now + SESSION_DURATION * 1000;
      setExpirationTime(expTime);
      localStorage.setItem("expirationTime", expTime.toString());

      navigate("/search");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
      console.error(error);
    }
  };

  // Handle logout: clear session state and localStorage, then navigate to login.
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    setUser(null);
    setExpirationTime(Date.now() + SESSION_DURATION * 1000);
    localStorage.removeItem("user");
    localStorage.removeItem("expirationTime");
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <>
      {user && (
        <SessionTimer
          expirationTime={expirationTime}
          onSessionExpire={handleLogout}
        />
      )}

      <Suspense
        fallback={
          <div
            style={{
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/search"
            element={
              user ? (
                <SearchPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/search" : "/login"} />}
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
