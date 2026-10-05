import React, { useState } from "react";
import type { SyntheticEvent } from "react";
import {
  apiService,
  type RegisterPayload,
  type UserResponse,
} from "../services/api";

interface RegisterPageProps {
  onNavigateToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState(""); // Captures 'YYYY-MM-DD' from <input type="date">
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Formats birthDate into ISO LocalDateTime string expected by Spring Boot (e.g., '1998-05-15T00:00:00')
      const formattedBirthDate = birthDate
        ? `${birthDate}T00:00:00`
        : new Date().toISOString();

      const payload: RegisterPayload = {
        name,
        email,
        password,
        city,
        birthDate: formattedBirthDate,
      };

      // Hits POST http://localhost:8080/user
      const savedUser = await apiService.post<UserResponse>("user", payload);
      alert(`Registration Successful! Welcome ${savedUser.name}`);

      if (onNavigateToLogin) {
        onNavigateToLogin();
      }
    } catch (error: any) {
      alert(error.message || "Failed to register user. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="pixel-card">
        <h1 className="pixel-title">REGISTER</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="pixel-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="pixel-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="pixel-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="pixel-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <div className="form-group">
            <label className="pixel-label" htmlFor="city">
              City
            </label>
            <input
              id="city"
              type="text"
              className="pixel-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New York"
              required
            />
          </div>

          <div className="form-group">
            <label className="pixel-label" htmlFor="birthDate">
              Birth Date
            </label>
            <input
              id="birthDate"
              type="date"
              className="pixel-input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="pixel-button" disabled={loading}>
            {loading ? "REGISTERING..." : "REGISTER"}
          </button>
        </form>

        {onNavigateToLogin && (
          <button
            type="button"
            className="pixel-button"
            style={{
              marginTop: "12px",
              backgroundColor: "transparent",
              color: "var(--ink-charcoal)",
            }}
            onClick={onNavigateToLogin}
          >
            ALREADY HAVE AN ACCOUNT? LOGIN
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
