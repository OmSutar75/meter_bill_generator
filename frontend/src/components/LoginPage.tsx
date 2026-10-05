import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "./LoginPage.css";
import { apiService } from "../services/api";

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sends JSON payload { email, password } to POST http://localhost:8080/api/user/login
      await apiService.post("user/login", {
        email,
        password,
      });

      onLoginSuccess?.();
    } catch (error: any) {
      alert(error.message || "Invalid credentials or user does not exist!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="pixel-card">
        <div className="pixel-header">
          <h1 className="pixel-title">METER BILL</h1>
          <p className="pixel-subtitle">Meter Bill Calculator</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="pixel-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="pixel-input"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="user@meter.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="pixel-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="pixel-input"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="pixel-button" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <button
            type="button"
            className="pixel-button"
            style={{
              marginTop: "8px",
              backgroundColor: "transparent",
              color: "var(--ink-charcoal)",
              border: "none",
              boxShadow: "none",
            }}
            onClick={onNavigateToRegister}
          >
            DON'T HAVE AN ACCOUNT? REGISTER
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
