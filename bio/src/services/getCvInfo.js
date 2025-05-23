import { API_BASE_URL } from "./api";

// --- getCvInfo function ---

export const getCvInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cv`);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
    }
    console.error("Get CV Info API error:", error);
    throw error;
};
