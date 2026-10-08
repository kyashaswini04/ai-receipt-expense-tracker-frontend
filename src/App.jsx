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

  // Login Page
  if (path === "/login") {
    return <Login />;
  }

  // Register Page
  if (path === "/register") {
    return <Register />;
  }

  // Welcome to Dashboard
  if (
    path === "/" ||
    path === "/welcome" ||
    path === "/dashboard"
  ) {
    return <Welcome />;
  }

  // Expenses Page
  if (path === "/expenses") {
    return <Expenses />;
  }

  // Money Given / Taken Page
  if (path === "/money") {
    return <Money />;
  }

  // Loans and Chit Funds Page
  if (path === "/loans") {
    return <Loan />;
  }

  // Reports Page
  if (path === "/reports") {
    return <Reports />;
  }

  // Unknown URL → Login
  return <Login />;
}

export default App;