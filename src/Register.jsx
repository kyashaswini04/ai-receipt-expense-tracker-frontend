import { useState } from "react";
import "./App.css";
const API = (import.meta.env.VITE_API_URL || "https://ai-expense-tracker-api-kyashaswini.onrender.com").replace(/\/$/, "");
function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed.");
                return;
            }

            alert("Account created successfully!");

            window.location.href = "/login";

        } catch (error) {
            console.error("Registration error:", error);
            alert("Could not connect to the server.");
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

                <div className="login-icon">
                    💰
                </div>

                <h1>Create Account</h1>

                <p className="login-subtitle">
                    Start managing your personal expenses
                </p>

                <form onSubmit={handleRegister}>

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />


                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />


                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                    />


                    <label>Confirm Password</label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />


                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>


                <p className="register-text">

                    Already have an account?

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
