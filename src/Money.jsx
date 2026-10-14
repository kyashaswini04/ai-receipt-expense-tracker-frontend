import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Money() {
    const [records, setRecords] = useState([]);

    const [form, setForm] = useState({
        type: "GIVEN",
        personName: "",
        amount: "",
        transactionDate: "",
        purpose: "",
        dueDate: "",
        notes: "",
    });

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            const response = await fetch(`${API}/money`);
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.error("Error loading money records:", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const addRecord = async (e) => {
        e.preventDefault();

        if (
            form.personName === "" ||
            form.amount === "" ||
            form.transactionDate === ""
        ) {
            alert("Please enter person name, amount and date.");
            return;
        }

        const data = {
            type: form.type,
            personName: form.personName,

            // Amount comes ONLY from the user
            amount: Number(form.amount),

            transactionDate: form.transactionDate,
            purpose: form.purpose,
            dueDate:
                form.dueDate === ""
                    ? null
                    : form.dueDate,
            notes: form.notes,

            status: "PENDING",
            paidAmount: 0,
        };

        try {
            const response = await fetch(`${API}/money`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to save record");
            }

            alert(
                form.type === "GIVEN"
                    ? "Money given record added!"
                    : "Money taken record added!"
            );

            // Clear the form
            setForm({
                type: "GIVEN",
                personName: "",
                amount: "",
                transactionDate: "",
                purpose: "",
                dueDate: "",
                notes: "",
            });

            loadRecords();

        } catch (error) {
            console.error(error);
            alert("Could not save the record.");
        }
    };

    const deleteRecord = async (id) => {
        if (!window.confirm("Delete this record?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/money/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            loadRecords();

        } catch (error) {
            console.error(error);
            alert("Could not delete record.");
        }
    };

    const givenRecords = records.filter(
        (record) => record.type === "GIVEN"
    );

    const takenRecords = records.filter(
        (record) => record.type === "TAKEN"
    );

    return (
        <div className="page">

            {/* HEADER */}

            <div className="page-header">

                <h1>💸 Money Given & Taken</h1>

                <p>
                    Track money you give to or receive from
                    other people
                </p>

            </div>


            {/* ADD FORM */}

            <div className="card">

                <h2>
                    {form.type === "GIVEN"
                        ? "💸 Add Money Given"
                        : "💰 Add Money Taken"}
                </h2>

                <form onSubmit={addRecord}>

                    {/* TYPE */}

                    <label>Type</label>

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="GIVEN">
                            Money Given
                        </option>

                        <option value="TAKEN">
                            Money Taken
                        </option>
                    </select>


                    {/* PERSON */}

                    <label>Person Name</label>

                    <input
                        type="text"
                        name="personName"
                        value={form.personName}
                        onChange={handleChange}
                        placeholder="Enter person name"
                    />


                    {/* AMOUNT */}

                    <label>Amount</label>

                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                    />


                    {/* DATE */}

                    <label>Date</label>

                    <input
                        type="date"
                        name="transactionDate"
                        value={form.transactionDate}
                        onChange={handleChange}
                    />


                    {/* PURPOSE */}

                    <label>Purpose</label>

                    <input
                        type="text"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        placeholder="Enter purpose"
                    />


                    {/* DUE DATE */}

                    <label>Due Date</label>

                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                    />


                    {/* NOTES */}

                    <label>Notes</label>

                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Enter notes"
                        rows="3"
                    />


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        ➕ Add Record
                    </button>

                </form>

            </div>


            {/* MONEY GIVEN */}

            <div className="section">

                <h2>💸 Money I Gave</h2>

                {givenRecords.length === 0 ? (

                    <div className="empty-card">
                        No money-given records yet.
                    </div>

                ) : (

                    givenRecords.map((record) => (

                        <MoneyCard
                            key={record.id}
                            record={record}
                            deleteRecord={deleteRecord}
                        />

                    ))

                )}

            </div>


            {/* MONEY TAKEN */}

            <div className="section">

                <h2>💰 Money I Took</h2>

                {takenRecords.length === 0 ? (

                    <div className="empty-card">
                        No money-taken records yet.
                    </div>

                ) : (

                    takenRecords.map((record) => (

                        <MoneyCard
                            key={record.id}
                            record={record}
                            deleteRecord={deleteRecord}
                        />

                    ))

                )}

            </div>

        </div>
    );
}


/* =========================
   MONEY CARD
========================= */

function MoneyCard({
    record,
    deleteRecord,
}) {

    return (
        <div className="card">

            <div className="loan-card-header">

                <div>

                    <h3>
                        {record.personName}
                    </h3>

                    <p>
                        {record.purpose ||
                            "No purpose entered"}
                    </p>

                </div>

                <button
                    className="delete-btn"
                    onClick={() =>
                        deleteRecord(record.id)
                    }
                >
                    🗑️
                </button>

            </div>


            <div className="loan-details">

                <div>

                    <span>Amount</span>

                    <strong>
                        ₹
                        {Number(
                            record.amount
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div>

                    <span>Date</span>

                    <strong>
                        {record.transactionDate}
                    </strong>

                </div>


                <div>

                    <span>Status</span>

                    <strong>
                        {record.status ||
                            "PENDING"}
                    </strong>

                </div>

            </div>


            {record.dueDate && (

                <p style={{ marginTop: "15px" }}>
                    📅 Due date: {record.dueDate}
                </p>

            )}

        </div>
    );
}

export default Money;