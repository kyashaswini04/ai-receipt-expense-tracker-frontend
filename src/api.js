// Central API URL configuration

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();

export const API_BASE_URL = (
    configuredApiUrl ||
    (import.meta.env.DEV
        ? "http://localhost:8080"
        : "https://ai-receipt-expense-tracker-backend-2.onrender.com")
).replace(/\/$/, "");

export const API_CONFIGURED = true;

export const API_CONFIGURATION_MESSAGE =
    "Backend URL is not configured.";

export const getAuthHeaders = (includeJson = false) => {
    const token = localStorage.getItem("authToken");

    return {
        ...(includeJson ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};
