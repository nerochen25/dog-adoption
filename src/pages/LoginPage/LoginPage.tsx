import React, { useState, FormEvent } from "react";
import styles from "./LoginPage.module.css";
import Button from "../../components/Button/Button";

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
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_container}>
          <label htmlFor="login-name">Name</label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
            placeholder="Enter your name"
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            placeholder="Enter your email"
          />
        </div>
        <div className={styles.button_container}>
          <Button
            type="submit"
            disabled={name.trim() === "" || email.trim() === ""}
          >
            Log in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
