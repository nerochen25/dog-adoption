import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import { login as apiLogin, logout as apiLogout } from "./services/api";
import { User } from "./types";

const SESSION_DURATION = 3600; // session duration in seconds (for testing; use 3600 for 1 hour)

const App: React.FC = () => {
  const navigate = useNavigate();

  // Initialize user from localStorage if available.
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Initialize loginTime from localStorage, if available.
  const [loginTime, setLoginTime] = useState<number | null>(() => {
    const storedLogin = localStorage.getItem("loginTime");
    return storedLogin ? Number(storedLogin) : null;
  });

  // Initialize expirationTime from localStorage if available; otherwise, compute a new one.
  const [expirationTime, setExpirationTime] = useState<number>(() => {
    const storedExp = localStorage.getItem("expirationTime");
    // If there's a stored expiration time, use it.
    if (storedExp) {
      return Number(storedExp);
    }
    // Otherwise, if no loginTime is stored, compute a new expiration based on now.
    return Date.now() + SESSION_DURATION * 1000;
  });

  const [sessionTimeLeft, setSessionTimeLeft] =
    useState<number>(SESSION_DURATION);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  // Handle login: call the API, store user info and timestamps in localStorage, and start the timer.
  const handleLogin = async (name: string, email: string) => {
    try {
      await apiLogin(name, email);
      const loggedInUser: User = { name, email };
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      const now = Date.now();
      setLoginTime(now);
      localStorage.setItem("loginTime", now.toString());
      const expTime = now + SESSION_DURATION * 1000;
      setExpirationTime(expTime);
      localStorage.setItem("expirationTime", expTime.toString());
      setSessionTimeLeft(SESSION_DURATION);
      navigate("/search");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
      console.error(error);
    }
  };

  // Handle logout: clear state and localStorage, then navigate to login.
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    setUser(null);
    setLoginTime(null);
    setExpirationTime(Date.now() + SESSION_DURATION * 1000);
    setSessionTimeLeft(SESSION_DURATION);
    setSessionExpired(false);
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("expirationTime");
    navigate("/login", { replace: true });
  }, [navigate]);

  // Set up the session timer using the stored expirationTime.
  useEffect(() => {
    if (user && loginTime && expirationTime) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.floor((expirationTime - now) / 1000);
        if (remaining <= 0) {
          setSessionTimeLeft(0);
          setSessionExpired(true);
        } else {
          setSessionTimeLeft(remaining);
        }
      };

      updateTimer(); // run immediately on mount
      const intervalId = setInterval(updateTimer, 1000);
      return () => clearInterval(intervalId);
    }
  }, [user, loginTime, expirationTime]);

  return (
    <>
      {/* Display the session timer if the user is logged in and session is active */}
      {user && !sessionExpired && (
        <div
          style={{
            position: "absolute",
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
              fontSize: "14px",
            }}
          >
            <p>Your session has expired. Please log in again.</p>
            <button onClick={handleLogout}>Log In Again</button>
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
