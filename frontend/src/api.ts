const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? {"Authorization": `Bearer ${token}`}: {}),
            ...options.headers,
        }
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const contentType = response.headers.get("Content-Type")
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null;
};