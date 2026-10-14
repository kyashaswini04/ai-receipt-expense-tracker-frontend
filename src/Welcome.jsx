import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Welcome() {
    const [expenses, setExpenses] = useState([]);
    const [salary, setSalary] = useState(
        localStorage.getItem("monthlySalary") || ""
    );

    const userName = localStorage.getItem("userName");

    // Load expenses from database
    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const response = await fetch(`${API}/expenses`);

                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                }
            } catch (error) {
                console.error("Could not load expenses:", error);
            }
        };

        loadExpenses();
    }, []);

    // Calculate total spent from actual user expenses
    const totalSpent = expenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
    );

    // Calculate remaining salary
    const remaining =
        salary !== ""
            ? Number(salary) - totalSpent
            : null;

    // Add monthly salary
    const addSalary = () => {
        const value = window.prompt(
            "Enter your monthly salary:"
        );

        if (value === null || value.trim() === "") {
            return;
        }

        const amount = Number(value);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid salary amount.");
            return;
        }

        localStorage.setItem(
            "monthlySalary",
            String(amount)
        );

        setSalary(String(amount));
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("monthlySalary");

        window.location.href = "/login";
    };

    // Navigation
    const goTo = (page) => {
        window.location.href = page;
    };

    return (
        <div className="dashboard-page">

            {/* Floating money decorations */}

            <div className="dashboard-money-emoji dashboard-emoji-1">
                💵
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-2">
                💰
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-3">
                💸
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-4">
                💵
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-5">
                🤑
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-6">
                💰
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-7">
                💸
            </div>

            <div className="dashboard-money-emoji dashboard-emoji-8">
                💵
            </div>


            {/* Main Dashboard */}

            <div className="dashboard-container">

                {/* Header */}

                <div className="dashboard-header">

                    <h1>
                        Personal Finance
                    </h1>

                    <p>
                        {userName
                            ? `Welcome, ${userName}! Manage your money, expenses and loans in one place.`
                            : "Manage your money, expenses and loans in one place."}
                    </p>

                </div>


                {/* Financial Summary */}

                <div className="finance-summary">

                    {/* Monthly Salary */}

                    <div className="summary-card salary-card">

                        <div className="summary-icon">
                            💰
                        </div>

                        <h3>
                            Monthly Salary
                        </h3>

                        {salary !== "" ? (
                            <>
                                <div className="summary-amount">
                                    ₹
                                    {Number(
                                        salary
                                    ).toLocaleString("en-IN")}
                                </div>

                                <button
                                    className="small-edit-btn"
                                    onClick={addSalary}
                                >
                                    Edit amount
                                </button>
                            </>
                        ) : (
                            <button
                                className="add-amount-btn"
                                onClick={addSalary}
                            >
                                + Add amount
                            </button>
                        )}

                    </div>


                    {/* Total Spent */}

                    <div className="summary-card spent-card">

                        <div className="summary-icon">
                            💳
                        </div>

                        <h3>
                            Total Spent
                        </h3>

                        <div className="summary-amount">
                            ₹
                            {totalSpent.toLocaleString(
                                "en-IN"
                            )}
                        </div>

                    </div>


                    {/* Remaining */}

                    <div className="summary-card remaining-card">

                        <div className="summary-icon">
                            💵
                        </div>

                        <h3>
                            Remaining
                        </h3>

                        {salary !== "" ? (
                            <div className="summary-amount">
                                ₹
                                {remaining.toLocaleString(
                                    "en-IN"
                                )}
                            </div>
                        ) : (
                            <button
                                className="add-amount-btn"
                                onClick={addSalary}
                            >
                                + Add amount
                            </button>
                        )}

                    </div>

                </div>


                {/* Quick Actions */}

                <h2 className="quick-actions-title">
                    Quick Actions
                </h2>


                <div className="dashboard-options">

                    {/* Expenses */}

                    <button
                        className="dashboard-option"
                        onClick={() =>
                            goTo("/expenses")
                        }
                    >

                        <span className="dashboard-option-icon">
                            💳
                        </span>

                        <span className="dashboard-option-title">
                            Expenses
                        </span>

                        <span className="dashboard-option-description">
                            Add and manage expenses
                        </span>

                    </button>


                    {/* Scan Receipt */}

                    <button
                        className="dashboard-option"
                        onClick={() =>
                            goTo("/expenses")
                        }
                    >

                        <span className="dashboard-option-icon">
                            📷
                        </span>

                        <span className="dashboard-option-title">
                            Scan Receipt
                        </span>

                        <span className="dashboard-option-description">
                            Scan your receipt
                        </span>

                    </button>


                    {/* Money Given / Taken */}

                    <button
                        className="dashboard-option"
                        onClick={() =>
                            goTo("/money")
                        }
                    >

                        <span className="dashboard-option-icon">
                            💸
                        </span>

                        <span className="dashboard-option-title">
                            Money Given / Taken
                        </span>

                        <span className="dashboard-option-description">
                            Track personal money
                        </span>

                    </button>


                    {/* Loans */}

                    <button
                        className="dashboard-option"
                        onClick={() =>
                            goTo("/loans")
                        }
                    >

                        <span className="dashboard-option-icon">
                            🏦
                        </span>

                        <span className="dashboard-option-title">
                            Loans
                        </span>

                        <span className="dashboard-option-description">
                            Manage bank loans
                        </span>

                    </button>


                    {/* Chit Funds */}

                    <button
                        className="dashboard-option"
                        onClick={() =>
                            goTo("/loans")
                        }
                    >

                        <span className="dashboard-option-icon">
                            🌑
                        </span>

                        <span className="dashboard-option-title">
                            Chit Funds
                        </span>

                        <span className="dashboard-option-description">
                            Manage chit funds
                        </span>

                    </button>


                    {/* Reports */}

                    <button
                        className="dashboard-option"
                        onClick={() =>
                            goTo("/reports")
                        }
                    >

                        <span className="dashboard-option-icon">
                            📊
                        </span>

                        <span className="dashboard-option-title">
                            Reports
                        </span>

                        <span className="dashboard-option-description">
                            View spending graph
                        </span>

                    </button>

                </div>


                {/* Information Box */}

                <div className="dashboard-info">

                    <div className="dashboard-info-icon">
                        ✨
                    </div>

                    <div>

                        <h3>
                            Your financial dashboard
                        </h3>

                        <p>
                            Add your own salary, expenses,
                            loans and other financial details.
                            Your dashboard will calculate the
                            information from your entries.
                        </p>

                    </div>

                </div>


                {/* Logout */}

                <button
                    className="dashboard-logout"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Welcome;