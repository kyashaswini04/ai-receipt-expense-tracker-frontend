import { useEffect, useState } from "react";

const API = "http://localhost:8080";

function Loan() {
    const [loans, setLoans] = useState([]);

    const [form, setForm] = useState({
        loanType: "BANK_LOAN",
        loanName: "",
        providerName: "",
        contactPerson: "",
        principalAmount: "",
        amountReceived: "",
        interestRate: "",
        tenureMonths: "",
        monthlyPayment: "",
        startDate: "",
        nextPaymentDate: "",
        notes: "",
    });

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            const response = await fetch(`${API}/loans`);

            if (!response.ok) {
                throw new Error("Could not load loans");
            }

            const data = await response.json();
            setLoans(data);
        } catch (error) {
            console.error("Error loading loans:", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const addLoan = async (e) => {
        e.preventDefault();

        if (form.loanName.trim() === "") {
            alert("Please enter the loan name.");
            return;
        }

        if (form.providerName.trim() === "") {
            alert("Please enter the provider name.");
            return;
        }

        if (form.principalAmount === "") {
            alert("Please enter the principal amount.");
            return;
        }

        const loanData = {
            loanType: form.loanType,
            loanName: form.loanName,
            providerName: form.providerName,
            contactPerson: form.contactPerson,

            // Amounts come ONLY from user input
            principalAmount: Number(form.principalAmount),

            amountReceived:
                form.amountReceived === ""
                    ? null
                    : Number(form.amountReceived),

            interestRate:
                form.interestRate === ""
                    ? null
                    : Number(form.interestRate),

            tenureMonths:
                form.tenureMonths === ""
                    ? null
                    : Number(form.tenureMonths),

            monthlyPayment:
                form.monthlyPayment === ""
                    ? null
                    : Number(form.monthlyPayment),

            startDate:
                form.startDate === ""
                    ? null
                    : form.startDate,

            nextPaymentDate:
                form.nextPaymentDate === ""
                    ? null
                    : form.nextPaymentDate,

            notes: form.notes,
        };

        try {
            const response = await fetch(`${API}/loans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loanData),
            });

            if (!response.ok) {
                throw new Error("Could not save loan");
            }

            alert("Loan saved successfully!");

            setForm({
                loanType: "BANK_LOAN",
                loanName: "",
                providerName: "",
                contactPerson: "",
                principalAmount: "",
                amountReceived: "",
                interestRate: "",
                tenureMonths: "",
                monthlyPayment: "",
                startDate: "",
                nextPaymentDate: "",
                notes: "",
            });

            loadLoans();
        } catch (error) {
            console.error(error);
            alert("Could not save loan.");
        }
    };

    const deleteLoan = async (id) => {
        if (!window.confirm("Delete this loan?")) {
            return;
        }

        try {
            const response = await fetch(`${API}/loans/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Could not delete loan");
            }

            loadLoans();
        } catch (error) {
            console.error(error);
            alert("Could not delete loan.");
        }
    };

    const bankLoans = loans.filter(
        (loan) => loan.loanType === "BANK_LOAN"
    );

    const chitFunds = loans.filter(
        (loan) => loan.loanType === "CHITTI"
    );

    return (
        <div className="page">

            <div className="page-header">
                <h1>🏦 Loans & Chit Funds</h1>
                <p>Manage your bank loans and chit fund details</p>
            </div>

            {/* ADD LOAN */}
            <div className="card">
                <h2>➕ Add Loan / Chit Fund</h2>

                <form onSubmit={addLoan}>

                    <label>Type</label>

                    <select
                        name="loanType"
                        value={form.loanType}
                        onChange={handleChange}
                    >
                        <option value="BANK_LOAN">
                            Bank Loan
                        </option>

                        <option value="CHITTI">
                            Chit Fund
                        </option>
                    </select>


                    <label>
                        {form.loanType === "BANK_LOAN"
                            ? "Loan Name"
                            : "Chit Fund Name"}
                    </label>

                    <input
                        type="text"
                        name="loanName"
                        value={form.loanName}
                        onChange={handleChange}
                        placeholder={
                            form.loanType === "BANK_LOAN"
                                ? "Enter loan name"
                                : "Enter chit fund name"
                        }
                    />


                    <label>
                        {form.loanType === "BANK_LOAN"
                            ? "Bank / Provider Name"
                            : "Chit Fund Provider"}
                    </label>

                    <input
                        type="text"
                        name="providerName"
                        value={form.providerName}
                        onChange={handleChange}
                        placeholder="Enter provider name"
                    />


                    <label>Contact Person</label>

                    <input
                        type="text"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        placeholder="Enter contact person"
                    />


                    <label>Principal Amount</label>

                    <input
                        type="number"
                        name="principalAmount"
                        value={form.principalAmount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                    />


                    <label>Amount Received</label>

                    <input
                        type="number"
                        name="amountReceived"
                        value={form.amountReceived}
                        onChange={handleChange}
                        placeholder="Enter amount received"
                        min="0"
                        step="0.01"
                    />


                    <label>Interest Rate (%)</label>

                    <input
                        type="number"
                        name="interestRate"
                        value={form.interestRate}
                        onChange={handleChange}
                        placeholder="Enter interest rate"
                        min="0"
                        step="0.01"
                    />


                    <label>Tenure (Months)</label>

                    <input
                        type="number"
                        name="tenureMonths"
                        value={form.tenureMonths}
                        onChange={handleChange}
                        placeholder="Enter tenure"
                        min="0"
                    />


                    <label>Monthly Payment</label>

                    <input
                        type="number"
                        name="monthlyPayment"
                        value={form.monthlyPayment}
                        onChange={handleChange}
                        placeholder="Enter monthly payment"
                        min="0"
                        step="0.01"
                    />


                    <label>Start Date</label>

                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                    />


                    <label>Next Payment Date</label>

                    <input
                        type="date"
                        name="nextPaymentDate"
                        value={form.nextPaymentDate}
                        onChange={handleChange}
                    />


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
                        ➕ Save
                    </button>

                </form>
            </div>


            {/* BANK LOANS */}
            <div className="section">

                <h2>🏦 Bank Loans</h2>

                {bankLoans.length === 0 ? (

                    <div className="empty-card">
                        No bank loans added yet.
                    </div>

                ) : (

                    bankLoans.map((loan) => (
                        <LoanCard
                            key={loan.id}
                            loan={loan}
                            deleteLoan={deleteLoan}
                        />
                    ))

                )}

            </div>


            {/* CHIT FUNDS */}
            <div className="section">

                <h2>🪙 Chit Funds</h2>

                {chitFunds.length === 0 ? (

                    <div className="empty-card">
                        No chit funds added yet.
                    </div>

                ) : (

                    chitFunds.map((loan) => (
                        <LoanCard
                            key={loan.id}
                            loan={loan}
                            deleteLoan={deleteLoan}
                        />
                    ))

                )}

            </div>

        </div>
    );
}


/* LOAN CARD */

function LoanCard({ loan, deleteLoan }) {

    return (

        <div className="card">

            <div className="loan-card-header">

                <div>

                    <h3>{loan.loanName}</h3>

                    <p>{loan.providerName}</p>

                </div>

                <button
                    className="delete-btn"
                    onClick={() => deleteLoan(loan.id)}
                >
                    🗑️
                </button>

            </div>


            <div className="loan-details">

                <div>
                    <span>Principal</span>

                    <strong>
                        ₹{Number(loan.principalAmount).toLocaleString("en-IN")}
                    </strong>
                </div>


                <div>
                    <span>Amount Received</span>

                    <strong>
                        {loan.amountReceived == null
                            ? "Not entered"
                            : `₹${Number(
                                loan.amountReceived
                            ).toLocaleString("en-IN")}`}
                    </strong>
                </div>


                <div>
                    <span>Interest</span>

                    <strong>
                        {loan.interestRate == null
                            ? "Not entered"
                            : `${loan.interestRate}%`}
                    </strong>
                </div>


                <div>
                    <span>Monthly Payment</span>

                    <strong>
                        {loan.monthlyPayment == null
                            ? "Not entered"
                            : `₹${Number(
                                loan.monthlyPayment
                            ).toLocaleString("en-IN")}`}
                    </strong>
                </div>


                <div>
                    <span>Tenure</span>

                    <strong>
                        {loan.tenureMonths == null
                            ? "Not entered"
                            : `${loan.tenureMonths} months`}
                    </strong>
                </div>


                <div>
                    <span>Status</span>

                    <strong>
                        {loan.status || "Not entered"}
                    </strong>
                </div>

            </div>


            {loan.nextPaymentDate && (
                <p style={{ marginTop: "15px" }}>
                    📅 Next payment: {loan.nextPaymentDate}
                </p>
            )}


            {loan.notes && (
                <p style={{ marginTop: "10px" }}>
                    📝 {loan.notes}
                </p>
            )}

        </div>

    );
}

export default Loan;