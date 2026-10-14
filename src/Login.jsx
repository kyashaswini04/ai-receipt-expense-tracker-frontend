import { useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (
            email.trim() === "" ||
            password.trim() === ""
        ) {
            alert("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {
            console.log("Sending login request...");

            const response = await fetch(
                `${API}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            console.log(
                "Login response status:",
                response.status
            );

            const data = await response.json();

            console.log(
                "Login response:",
                data
            );

            if (!response.ok) {
                alert(
                    data.message ||
                    "Invalid email or password."
                );

                return;
            }

            // Save user information
            localStorage.setItem(
                "userName",
                data.name
            );

            localStorage.setItem(
                "userEmail",
                data.email
            );

            // Go to dashboard
            window.location.href =
                "/welcome";

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            alert(
                "Could not connect to the server."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* =================================================
                FLOATING MONEY DECORATION
            ================================================= */}

            <div className="money-emoji emoji-1">
                💵
            </div>

            <div className="money-emoji emoji-2">
                💰
            </div>

            <div className="money-emoji emoji-3">
                💸
            </div>

            <div className="money-emoji emoji-4">
                💵
            </div>

            <div className="money-emoji emoji-5">
                🤑
            </div>

            <div className="money-emoji emoji-6">
                💰
            </div>

            <div className="money-emoji emoji-7">
                💸
            </div>

            <div className="money-emoji emoji-8">
                💵
            </div>

            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div className="login-card">

                <div className="login-icon">
                    💰
                </div>

                <h1>
                    Welcome Back!
                </h1>

                <p className="login-subtitle">
                    Login to manage your
                    personal expenses
                </p>

                <form
                    onSubmit={handleLogin}
                >

                    {/* Email */}

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        placeholder="Enter your email"
                        required
                    />

                    {/* Password */}

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        placeholder="Enter your password"
                        required
                    />

                    {/* Login */}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* Register */}

                <p className="register-text">

                    Don't have an account?

                    <button
                        type="button"
                        className="register-link"
                        onClick={() => {
                            window.location.href =
                                "/register";
                        }}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;