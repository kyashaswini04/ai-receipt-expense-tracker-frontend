import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080";

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null);

    const [form, setForm] = useState({
        storeName: "",
        expenseDate: "",
        category: "",
        amount: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    // =====================================================
    // LOAD EXPENSES
    // =====================================================

    const loadExpenses = async () => {
        try {
            const response = await fetch(`${API}/expenses`);

            if (!response.ok) {
                throw new Error("Could not load expenses");
            }

            const data = await response.json();

            setExpenses(data);
        } catch (error) {
            console.error("Error loading expenses:", error);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    // =====================================================
    // HANDLE FORM INPUT
    // =====================================================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =====================================================
    // HANDLE RECEIPT FILE
    // =====================================================

    const handleReceiptChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setReceiptFile(e.target.files[0]);
        }
    };

    // =====================================================
    // SCAN RECEIPT
    // =====================================================

    const scanReceipt = async () => {
        if (!receiptFile) {
            alert("Please select a receipt image.");
            return;
        }

        setScanning(true);

        try {
            const formData = new FormData();

            formData.append("file", receiptFile);

            const response = await fetch(
                `${API}/receipts/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Receipt processing failed."
                );

                return;
            }

            console.log("Receipt result:", data);

            /*
              The backend may return different field names
              depending on your ReceiptParserService.
            */

            const storeName =
                data.storeName ||
                data.store ||
                "";

            const expenseDate =
                data.expenseDate ||
                data.date ||
                "";

            const category =
                data.category ||
                "";

            const amount =
                data.amount ||
                data.total ||
                "";

            const description =
                data.description ||
                data.items ||
                "";

            setForm({
                storeName: storeName,
                expenseDate: expenseDate,
                category: category,
                amount: amount,
                description: description,
            });

            alert(
                "Receipt scanned successfully! Please check the extracted details before saving."
            );

        } catch (error) {
            console.error(
                "Receipt scanning error:",
                error
            );

            alert(
                "Could not connect to the receipt service."
            );
        } finally {
            setScanning(false);
        }
    };

    // =====================================================
    // ADD EXPENSE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            form.storeName.trim() === "" ||
            form.expenseDate === "" ||
            form.category === "" ||
            form.amount === ""
        ) {
            alert(
                "Please fill all required fields."
            );

            return;
        }

        const amount = Number(form.amount);

        if (
            isNaN(amount) ||
            amount <= 0
        ) {
            alert(
                "Please enter a valid amount."
            );

            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API}/expenses`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        storeName:
                            form.storeName,

                        expenseDate:
                            form.expenseDate,

                        category:
                            form.category,

                        amount:
                            amount,

                        description:
                            form.description,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Could not add expense"
                );
            }

            alert(
                "Expense added successfully!"
            );

            setForm({
                storeName: "",
                expenseDate: "",
                category: "",
                amount: "",
                description: "",
            });

            setReceiptFile(null);

            const fileInput =
                document.getElementById(
                    "receiptFile"
                );

            if (fileInput) {
                fileInput.value = "";
            }

            loadExpenses();

        } catch (error) {
            console.error(
                "Error adding expense:",
                error
            );

            alert(
                "Could not connect to the backend."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE EXPENSE
    // =====================================================

    const deleteExpense = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this expense?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API}/expenses/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Could not delete expense"
                );
            }

            loadExpenses();

        } catch (error) {
            console.error(
                "Error deleting expense:",
                error
            );

            alert(
                "Could not delete expense."
            );
        }
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="page">

            {/* ================================================
          HEADER
      ================================================= */}

            <div className="page-header">

                <h1>
                    💳 Expenses
                </h1>

                <p>
                    Add and manage your
                    personal expenses.
                </p>

            </div>

            {/* ================================================
          SCAN RECEIPT
      ================================================= */}

            <div className="card">

                <h2>
                    📷 Scan Receipt
                </h2>

                <p
                    style={{
                        color: "#777",
                        fontSize: "14px",
                        lineHeight: "1.5",
                    }}
                >
                    Upload a receipt image.
                    The system will try to
                    extract the expense details
                    using OCR.
                </p>

                <input
                    id="receiptFile"
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptChange}
                />

                {receiptFile && (
                    <p
                        style={{
                            marginTop: "10px",
                            color: "#7049bd",
                            fontSize: "13px",
                        }}
                    >
                        Selected:
                        {" "}
                        {receiptFile.name}
                    </p>
                )}

                <button
                    type="button"
                    className="primary-btn"
                    onClick={scanReceipt}
                    disabled={scanning}
                >
                    {scanning
                        ? "Scanning Receipt..."
                        : "📷 Scan Receipt"}
                </button>

            </div>

            {/* ================================================
          ADD EXPENSE
      ================================================= */}

            <div className="card">

                <h2>
                    Add Expense
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    {/* Store */}

                    <label>
                        Store / Place
                    </label>

                    <input
                        type="text"
                        name="storeName"
                        value={form.storeName}
                        onChange={handleChange}
                        placeholder="Enter store or place"
                        required
                    />

                    {/* Date */}

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        name="expenseDate"
                        value={form.expenseDate}
                        onChange={handleChange}
                        required
                    />

                    {/* Category */}

                    <label>
                        Category
                    </label>

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select category
                        </option>

                        <option value="Food">
                            Food
                        </option>

                        <option value="Groceries">
                            Groceries
                        </option>

                        <option value="Transportation">
                            Transportation
                        </option>

                        <option value="Shopping">
                            Shopping
                        </option>

                        <option value="Personal Care">
                            Personal Care
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                    {/* Amount */}

                    <label>
                        Amount
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="0.01"
                        step="0.01"
                        required
                    />

                    {/* Description */}

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        rows="3"
                    />

                    {/* Submit */}

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Adding..."
                            : "Add Expense"}
                    </button>

                </form>

            </div>

            {/* ================================================
          EXPENSE HISTORY
      ================================================= */}

            <div className="card">

                <h2>
                    Expense History
                </h2>

                {expenses.length === 0 ? (

                    <div className="empty-card">
                        No expenses added yet.
                    </div>

                ) : (

                    expenses.map(
                        (expense) => (

                            <div
                                key={expense.id}
                                style={{
                                    background:
                                        "#f8f6fc",

                                    borderRadius:
                                        "12px",

                                    padding:
                                        "16px",

                                    marginBottom:
                                        "12px",
                                }}
                            >

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "flex-start",

                                        gap: "15px",
                                    }}
                                >

                                    {/* Details */}

                                    <div>

                                        <h3
                                            style={{
                                                margin:
                                                    "0 0 7px",
                                            }}
                                        >
                                            {expense.storeName}
                                        </h3>

                                        <p
                                            style={{
                                                margin:
                                                    "4px 0",

                                                color:
                                                    "#777",
                                            }}
                                        >
                                            📅{" "}
                                            {expense.expenseDate}
                                        </p>

                                        <p
                                            style={{
                                                margin:
                                                    "4px 0",

                                                color:
                                                    "#777",
                                            }}
                                        >
                                            📂{" "}
                                            {expense.category}
                                        </p>

                                        {expense.description && (
                                            <p
                                                style={{
                                                    margin:
                                                        "4px 0",

                                                    color:
                                                        "#777",
                                                }}
                                            >
                                                📝{" "}
                                                {expense.description}
                                            </p>
                                        )}

                                    </div>

                                    {/* Amount */}

                                    <div
                                        style={{
                                            textAlign:
                                                "right",
                                        }}
                                    >

                                        <strong
                                            style={{
                                                display:
                                                    "block",

                                                color:
                                                    "#30283e",

                                                fontSize:
                                                    "18px",

                                                marginBottom:
                                                    "10px",
                                            }}
                                        >
                                            ₹
                                            {Number(
                                                expense.amount
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteExpense(
                                                    expense.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

            {/* ================================================
          BACK TO DASHBOARD
      ================================================= */}

            <button
                className="welcome-logout"
                onClick={() => {
                    window.location.href =
                        "/welcome";
                }}
            >
                ← Back to Dashboard
            </button>

        </div>
    );
}

export default Expenses;