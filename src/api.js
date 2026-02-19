const API_URL = 'http://localhost:5000/api';

export const fetchAnswers = async () => {
    try {
        const res = await fetch(`${API_URL}/answers`);
        if (!res.ok) throw new Error('Failed to fetch');
        return await res.json();
    } catch (error) {
        console.error("Error fetching answers:", error);
        return [];
    }
};

export const updateAnswerStatus = async (id, status) => {
    try {
        const res = await fetch(`${API_URL}/answers/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return await res.json();
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};
