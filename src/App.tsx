import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import { login as apiLogin, logout as apiLogout } from "./services/api";
import { User } from "./types";

const SESSION_DURATION = 3600; // session duration in seconds (1 hour)

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginTime, setLoginTime] = useState<number | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] =
    useState<number>(SESSION_DURATION);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle login: record the login time so we can start the timer.
  const handleLogin = async (name: string, email: string) => {
    try {
      await apiLogin(name, email);
      const loggedInUser = { name, email };
      setUser(loggedInUser);

      const now = Date.now();
      setLoginTime(now);

      setSessionTimeLeft(SESSION_DURATION);
      navigate("/search");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
      console.error(error);
    }
  };

  // Handle logout: clear user state and navigate to login.
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    setUser(null);
    setLoginTime(null);
    setSessionTimeLeft(SESSION_DURATION);
    setSessionExpired(false);
    navigate("/login", { replace: true });
  }, []);

  // Set up the session timer once the user is logged in.
  useEffect(() => {
    if (user && loginTime) {
      const intervalId = setInterval(() => {
        const elapsed = (Date.now() - loginTime) / 1000; // elapsed time in seconds
        const remaining = SESSION_DURATION - elapsed;
        if (remaining <= 0) {
          // Session has expired.
          setSessionTimeLeft(0);
          setSessionExpired(true);
          clearInterval(intervalId);
        } else {
          setSessionTimeLeft(Math.floor(remaining));
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [user, loginTime]);

  return (
    <>
      {/* Display the session timer if the user is logged in */}
      {user && !sessionExpired && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "#eee",
            padding: "5px 10px",
            borderRadius: "4px",
            fontFamily: "monospace",
          }}
        >
          Session expires in: {Math.floor(sessionTimeLeft / 60)}:
          {("0" + (sessionTimeLeft % 60)).slice(-2)}
        </div>
      )}

      {/* If the session has expired, show a modal popup */}
      {sessionExpired && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "5px",
              textAlign: "center",
              maxWidth: "300px",
              width: "80%",
            }}
          >
            <p>Your session has expired. Please log in again.</p>
            <button onClick={handleLogout}>Login Again</button>
          </div>
        </div>
      )}

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
    </>
  );
};

export default App;
