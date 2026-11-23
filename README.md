## AI Receipt Expense Tracker – Frontend

A web-based expense management application built with React and Vite. It helps users manage their expenses, track monthly salary and spending, and view their financial history through a simple dashboard.

## Features

- **User Authentication:** Login and registration.
- **Expense Tracking:** Add and manage personal expenses.
- **Monthly Salary Management:** Set and save salary for each month.
- **Monthly Expense History:** View expenses by selecting a month and year.
- **Financial Dashboard:** Monitor salary, expenses, and remaining balance.
- **Reports:** View financial summaries.
- **Money Management:** Track money transfers and payments.
- **Loan Management:** Manage loan-related information.
- **User Data Isolation:** Display personal financial information for the logged-in user.

## Tech Stack

- React.js
- JavaScript
- Vite
- HTML5
- CSS3
- Fetch API
- REST API
- JWT Authentication

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── Welcome.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Expenses.jsx
│   ├── Reports.jsx
│   ├── Money.jsx
│   ├── Loans.jsx
│   ├── api.js
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/kyashaswini04/ai-receipt-expense-tracker-frontend.git
```

### 2. Navigate to the project

```bash
cd ai-receipt-expense-tracker-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the backend URL

Create a `.env` file in the frontend root directory if you want to override the default API URL:

```env
VITE_API_URL=http://localhost:8080
```

For production, configure `VITE_API_URL` with your deployed backend URL in Vercel.

The application currently has a default production backend URL configured in `src/api.js`.

### 5. Run the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Build for production

```bash
npm run build
```

## Backend Integration

The frontend communicates with the Spring Boot backend using REST APIs.

Backend repository:

https://github.com/kyashaswini04/ai-receipt-expense-tracker-backend

Production backend:

https://ai-receipt-expense-tracker-backend-2.onrender.com

Authentication uses JWT tokens to authorize protected API requests.

## Deployment

The frontend is deployed using Vercel.

1. Import the GitHub repository into Vercel.
2. Select Vite as the framework.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Configure `VITE_API_URL` if you want to override the configured backend URL.
6. Deploy the application.

Future updates pushed to the connected GitHub branch can trigger automatic deployments.

## Author

**Yashaswini Kooroju**

GitHub: https://github.com/kyashaswini04

## License

This project is developed for educational and practical application purposes. 
