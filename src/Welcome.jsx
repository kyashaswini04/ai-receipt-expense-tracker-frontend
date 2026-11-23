import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { API_BASE_URL as API } from "./api";

const getAuthHeaders = (includeJson = false) => ({
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
});

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const currentDate = new Date();

function Welcome() {
    const [expenses, setExpenses] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [salary, setSalary] = useState("");
    const [budgetData, setBudgetData] = useState({});
    const [budgetLoading, setBudgetLoading] = useState(true);
    const [salarySaving, setSalarySaving] = useState(false);
    const [budgetError, setBudgetError] = useState("");

    const userName = localStorage.getItem("userName");

    // Load all expenses for the signed-in user. The selected month is filtered
    // locally, so older expense records remain available in the database.
    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const response = await fetch(`${API}/expenses`, {
                    headers: getAuthHeaders(),
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userEmail");
                    window.location.href = "/login";
                    return;
                }

                if (!response.ok) throw new Error("Could not load expenses");
                const data = await response.json();
                setExpenses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Could not load expenses:", error);
            }
        };

        if (!localStorage.getItem("authToken")) {
            window.location.href = "/login";
            return;
        }
        loadExpenses();
    }, []);

    // Each salary is stored in the backend against its month and year.
    useEffect(() => {
        let cancelled = false;

        const loadMonthlyBudget = async () => {
            setBudgetLoading(true);
            setBudgetError("");
            setSalary("");
            try {
                const response = await fetch(
                    `${API}/budget/${selectedYear}/${selectedMonth}`,
                    { headers: getAuthHeaders() }
                );

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userEmail");
                    window.location.href = "/login";
                    return;
                }

                if (!response.ok) {
                    throw new Error("Could not load this month's salary.");
                }

                const savedBudget = await response.json();
                if (cancelled) return;

                if (savedBudget) {
                    setBudgetData(savedBudget);
                    setSalary(
                        savedBudget.salary !== null && savedBudget.salary !== undefined
                            ? String(savedBudget.salary)
                            : ""
                    );
                } else {
                    setBudgetData({});
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Could not load monthly budget:", error);
                    setBudgetError(error.message || "Could not load monthly salary.");
                }
            } finally {
                if (!cancelled) setBudgetLoading(false);
            }
        };

        loadMonthlyBudget();
        return () => {
            cancelled = true;
        };
    }, [selectedMonth, selectedYear]);

    const monthlyExpenses = useMemo(() => {
        const monthText = String(selectedMonth).padStart(2, "0");
        const prefix = `${selectedYear}-${monthText}-`;

        return expenses.filter((expense) => {
            const dateValue = String(expense.expenseDate || expense.date || "");
            // Backend expenseDate is expected as YYYY-MM-DD.
            if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
                return dateValue.startsWith(prefix);
            }

            // Fallback for ISO timestamps or other parseable date strings.
            const parsed = new Date(dateValue);
            return !Number.isNaN(parsed.getTime()) &&
                parsed.getFullYear() === selectedYear &&
                parsed.getMonth() + 1 === selectedMonth;
        });
    }, [expenses, selectedMonth, selectedYear]);

    const totalSpent = monthlyExpenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
    );

    const remaining = salary !== "" ? Number(salary) - totalSpent : null;

    const addSalary = async () => {
        const value = window.prompt(
            `Enter your salary for ${MONTHS[selectedMonth - 1]} ${selectedYear}:`,
            salary
        );

        if (value === null || value.trim() === "") return;

        const amount = Number(value);
        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid salary amount.");
            return;
        }

        setSalarySaving(true);
        try {
            const payload = {
                ...budgetData,
                month: selectedMonth,
                year: selectedYear,
                salary: amount,
                shoppingBudget: Number(budgetData.shoppingBudget || 0),
                groceriesBudget: Number(budgetData.groceriesBudget || 0),
                foodBudget: Number(budgetData.foodBudget || 0),
                transportBudget: Number(budgetData.transportBudget || 0),
                personalCareBudget: Number(budgetData.personalCareBudget || 0),
                otherBudget: Number(budgetData.otherBudget || 0),
            };

            const response = await fetch(`${API}/budget`, {
                method: "POST",
                headers: getAuthHeaders(true),
                body: JSON.stringify(payload),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userName");
                localStorage.removeItem("userEmail");
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Could not save salary.");
            }

            const savedBudget = await response.json();
            setBudgetData(savedBudget || payload);
            setSalary(String(amount));
            alert(`Salary saved for ${MONTHS[selectedMonth - 1]} ${selectedYear}.`);
        } catch (error) {
            console.error("Could not save salary:", error);
            alert(error.message || "Could not connect to the backend.");
        } finally {
            setSalarySaving(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
    };

    const goTo = (page) => {
        window.location.href = page;
    };

    const yearOptions = [];
    for (let year = currentDate.getFullYear() - 5; year <= currentDate.getFullYear() + 1; year += 1) {
        yearOptions.push(year);
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-money-emoji dashboard-emoji-1">💵</div>
            <div className="dashboard-money-emoji dashboard-emoji-2">💰</div>
            <div className="dashboard-money-emoji dashboard-emoji-3">💸</div>
            <div className="dashboard-money-emoji dashboard-emoji-4">💵</div>
            <div className="dashboard-money-emoji dashboard-emoji-5">🤑</div>
            <div className="dashboard-money-emoji dashboard-emoji-6">💰</div>
            <div className="dashboard-money-emoji dashboard-emoji-7">💸</div>
            <div className="dashboard-money-emoji dashboard-emoji-8">💵</div>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Personal Finance</h1>
                    <p>
                        {userName
                            ? `Welcome, ${userName}! Manage your money, expenses and loans in one place.`
                            : "Manage your money, expenses and loans in one place."}
                    </p>
                </div>

                <div className="card monthly-filter-card" style={{ marginBottom: "24px", padding: "20px" }}>
                    <h2 style={{ marginTop: 0 }}>📅 Monthly Overview</h2>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "end" }}>
                        <label style={{ display: "grid", gap: "7px", fontWeight: 600 }}>
                            Select month
                            <select
                                value={selectedMonth}
                                onChange={(event) => setSelectedMonth(Number(event.target.value))}
                                style={{ minWidth: "170px", padding: "12px", borderRadius: "10px", border: "1px solid #ead9a8", background: "#fffdf6" }}
                            >
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index + 1}>{month}</option>
                                ))}
                            </select>
                        </label>
                        <label style={{ display: "grid", gap: "7px", fontWeight: 600 }}>
                            Select year
                            <select
                                value={selectedYear}
                                onChange={(event) => setSelectedYear(Number(event.target.value))}
                                style={{ minWidth: "120px", padding: "12px", borderRadius: "10px", border: "1px solid #ead9a8", background: "#fffdf6" }}
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <p style={{ marginBottom: 0, color: "#806f4d" }}>
                        Showing financial details for {MONTHS[selectedMonth - 1]} {selectedYear}.
                    </p>
                </div>

                <div className="finance-summary">
                    <div className="summary-card salary-card">
                        <div className="summary-icon">💰</div>
                        <h3>Monthly Salary</h3>
                        {budgetLoading ? (
                            <div className="summary-amount">Loading...</div>
                        ) : salary !== "" ? (
                            <>
                                <div className="summary-amount">
                                    ₹{Number(salary).toLocaleString("en-IN")}
                                </div>
                                <button type="button" className="small-edit-btn" onClick={addSalary} disabled={salarySaving}>
                                    {salarySaving ? "Saving..." : "Edit amount"}
                                </button>
                            </>
                        ) : (
                            <button type="button" className="add-amount-btn" onClick={addSalary} disabled={salarySaving}>
                                + Add salary
                            </button>
                        )}
                        {budgetError && <p role="alert" style={{ color: "#b42318", fontSize: "12px" }}>{budgetError}</p>}
                    </div>

                    <div className="summary-card spent-card">
                        <div className="summary-icon">💳</div>
                        <h3>Total Spent</h3>
                        <div className="summary-amount">
                            ₹{totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </div>
                        <p style={{ color: "#806f4d", fontSize: "13px", marginBottom: 0 }}>
                            {monthlyExpenses.length} expense{monthlyExpenses.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    <div className="summary-card remaining-card">
                        <div className="summary-icon">💵</div>
                        <h3>Remaining</h3>
                        {salary !== "" ? (
                            <div className="summary-amount">
                                ₹{remaining.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                            </div>
                        ) : (
                            <p style={{ color: "#806f4d" }}>Add this month's salary</p>
                        )}
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "30px" }}>
                    <h2>🧾 {MONTHS[selectedMonth - 1]} {selectedYear} Expenses</h2>
                    {monthlyExpenses.length === 0 ? (
                        <p style={{ color: "#806f4d" }}>No expenses recorded for this month. Previous months' expenses remain saved.</p>
                    ) : (
                        <div style={{ display: "grid", gap: "12px" }}>
                            {monthlyExpenses
                                .slice()
                                .sort((a, b) => String(b.expenseDate || "").localeCompare(String(a.expenseDate || "")))
                                .map((expense) => (
                                    <div key={expense.id} style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", borderBottom: "1px solid #f0e5c8", paddingBottom: "10px" }}>
                                        <div>
                                            <strong>{expense.storeName || expense.description || "Expense"}</strong>
                                            <div style={{ color: "#806f4d", fontSize: "13px" }}>
                                                {expense.expenseDate} · {expense.category || "Other"}
                                            </div>
                                        </div>
                                        <strong>₹{Number(expense.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <h2 className="quick-actions-title">Quick Actions</h2>
                <div className="dashboard-options">
                    <button type="button" className="dashboard-option" onClick={() => goTo("/expenses")}>
                        <span className="dashboard-option-icon">💳</span>
                        <span className="dashboard-option-title">Expenses</span>
                        <span className="dashboard-option-description">Add and manage expenses</span>
                    </button>
                    <button type="button" className="dashboard-option" onClick={() => goTo("/expenses")}>
                        <span className="dashboard-option-icon">📷</span>
                        <span className="dashboard-option-title">Scan Receipt</span>
                        <span className="dashboard-option-description">Scan your receipt</span>
                    </button>
                    <button type="button" className="dashboard-option" onClick={() => goTo("/money")}>
                        <span className="dashboard-option-icon">💸</span>
                        <span className="dashboard-option-title">Money Given / Taken</span>
                        <span className="dashboard-option-description">Track personal money</span>
                    </button>
                    <button type="button" className="dashboard-option" onClick={() => goTo("/loans")}>
                        <span className="dashboard-option-icon">🏦</span>
                        <span className="dashboard-option-title">Loans</span>
                        <span className="dashboard-option-description">Manage bank loans</span>
                    </button>
                    <button type="button" className="dashboard-option" onClick={() => goTo("/loans")}>
                        <span className="dashboard-option-icon">🌑</span>
                        <span className="dashboard-option-title">Chit Funds</span>
                        <span className="dashboard-option-description">Manage chit funds</span>
                    </button>
                    <button type="button" className="dashboard-option" onClick={() => goTo("/reports")}>
                        <span className="dashboard-option-icon">📊</span>
                        <span className="dashboard-option-title">Reports</span>
                        <span className="dashboard-option-description">View spending graph</span>
                    </button>
                </div>

                <div className="dashboard-info">
                    <div className="dashboard-info-icon">✨</div>
                    <div>
                        <h3>Your financial dashboard</h3>
                        <p>
                            Your monthly salary is saved separately for each month.
                            Expense history stays available when you switch months.
                        </p>
                    </div>
                </div>

                <button type="button" className="dashboard-logout" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Welcome;
