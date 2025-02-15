import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import styles from "./SessionTimer.module.css";

interface SessionTimerProps {
  expirationTime: number; // timestamp (in ms) when the session expires
  onSessionExpire: () => void; // callback to log out (or otherwise handle expiration)
}

const SessionTimer: React.FC<SessionTimerProps> = ({
  expirationTime,
  onSessionExpire,
}) => {
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(
    Math.floor((expirationTime - Date.now()) / 1000)
  );
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  useEffect(() => {
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

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [expirationTime]);

  if (sessionExpired) {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_content}>
          <p>Your session has expired. Please log in again.</p>
          <Button onClick={onSessionExpire} size="small">
            Log In Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      Session expires in: {Math.floor(sessionTimeLeft / 60)}:
      {("0" + (sessionTimeLeft % 60)).slice(-2)}
    </div>
  );
};

export default SessionTimer;
