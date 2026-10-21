import { useState } from "react";
import "./App.css";

const API =
  "https://ai-receipt-expense-tracker-backend-2.onrender.com";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            data.error ||
            (response.status === 409
              ? "This email may already be registered. Try logging in."
              : `Registration failed (${response.status}).`)
        );
        return;
      }

      alert("Account created successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);

      if (error.name === "AbortError") {
        setErrorMessage(
          "The server took too long to respond. Check whether your account was created before trying again."
        );
      } else {
        setErrorMessage(
          "Could not connect to the server. Please check your internet and try again."
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="money-emoji emoji-1">💵</div>
      <div className="money-emoji emoji-2">💰</div>
      <div className="money-emoji emoji-3">💸</div>
      <div className="money-emoji emoji-4">💵</div>
      <div className="money-emoji emoji-5">🤑</div>
      <div className="money-emoji emoji-6">💰</div>
      <div className="money-emoji emoji-7">💸</div>
      <div className="money-emoji emoji-8">💵</div>

      <div className="login-card">
        <div className="login-icon">💰</div>

        <h1>Create Account</h1>
        <p className="login-subtitle">
          Start managing your personal expenses
        </p>

        <form onSubmit={handleRegister}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          {errorMessage && (
            <p role="alert" className="error-message">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <button
            type="button"
            className="register-link"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
