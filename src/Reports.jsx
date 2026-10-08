import { useEffect, useState } from "react";

const API = "http://localhost:8080";

function Reports() {

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const response = await fetch(`${API}/expenses`);
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error("Could not load expenses:", error);
        }
    };

    const categories = {};

    expenses.forEach((expense) => {

        const category = expense.category;

        if (!categories[category]) {
            categories[category] = 0;
        }

        categories[category] += Number(
            expense.amount || 0
        );
    });

    const categoryList = Object.entries(categories);

    const maxAmount =
        categoryList.length > 0
            ? Math.max(
                ...categoryList.map(
                    ([, amount]) => amount
                )
            )
            : 0;

    return (
        <div className="page">

            <div className="page-header">
                <h1>📊 Spending Reports</h1>
                <p>See where your money is going</p>
            </div>

            {categoryList.length === 0 ? (

                <div className="empty-card">
                    <h2>No data yet</h2>
                    <p>
                        Add expenses to see your spending graph.
                    </p>
                </div>

            ) : (

                <div className="card">

                    <h2>Spending by Category</h2>

                    <div className="chart">

                        {categoryList.map(
                            ([category, amount]) => {

                                const percentage =
                                    maxAmount > 0
                                        ? (amount / maxAmount) * 100
                                        : 0;

                                return (
                                    <div
                                        className="chart-row"
                                        key={category}
                                    >

                                        <div className="chart-label">
                                            <span>{category}</span>

                                            <strong>
                                                ₹
                                                {amount.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>

                                        <div className="bar-background">

                                            <div
                                                className="bar"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Reports;