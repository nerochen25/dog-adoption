import React, { useState, FormEvent } from "react";
import styles from "./LoginPage.module.css";

interface LoginPageProps {
  onLogin: (name: string, email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(name, email);
  };

  return (
    <div className={styles.root}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_container}>
          <label htmlFor="login-name">
            Name:
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your name"
            />
          </label>
        </div>
        <div className={styles.input_container}>
          <label htmlFor="login-email">
            Email:
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
