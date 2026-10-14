import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Welcome from "./Welcome";
import Expenses from "./Expenses";
import Money from "./Money";
import Loan from "./Loans";
import Reports from "./Reports";

function App() {
  const path = window.location.pathname;

  // First page = Login
  if (path === "/") {
    return <Login />;
  }

  // Login
  if (path === "/login") {
    return <Login />;
  }

  // Register
  if (path === "/register") {
    return <Register />;
  }

  // Dashboard
  if (
    path === "/welcome" ||
    path === "/dashboard"
  ) {
    return <Welcome />;
  }

  // Expenses + Scan Receipt
  if (path === "/expenses") {
    return <Expenses />;
  }

  // Money Given / Taken
  if (path === "/money") {
    return <Money />;
  }

  // Loans + Chit Funds
  if (path === "/loans") {
    return <Loan />;
  }

  // Reports
  if (path === "/reports") {
    return <Reports />;
  }

  // Unknown URL → Login
  return <Login />;
}

export default App;