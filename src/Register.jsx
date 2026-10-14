import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API = (
    import.meta.env.VITE_API_URL ||
    "https://ai-expense-tracker-api-kyashaswini.onrender.com"
).replace(/\/$/, "");

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);

            let response;

            try {
                response = await fetch(`${API} /auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        email: form.email.trim(),
                        password: form.password,
                    }),
                    signal: controller.signal,
                });
            } finally {
                clearTimeout(timeout);
            }

            const text = await response.text();
            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text };
            }

            if (!response.ok) {
                setMessage(
                    data.message ||
                    `Registration failed(HTTP ${response.status}).`
                );
                return;
            }

            setMessage("Account created successfully! Redirecting to login...");

            setTimeout(() => navigate("/login"), 1200);
        } catch (error) {
            console.error("Registration error:", error);

            setMessage(
                error.name === "AbortError"
                    ? "The server took too long to respond. Please try again."
                    : "Could not connect to the server. Please try again."
            );
        } finally {
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
                        required
                    />

                    {message && (
                        <p role="status" aria-live="polite">
                            {message}
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
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;
