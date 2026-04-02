const BASE_URL = "http://localhost:8000";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
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