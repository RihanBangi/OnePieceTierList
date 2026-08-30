const API_URL = "http://localhost:5000/api";

export async function getCharacters(token) {
    const response = await fetch(`${API_URL}/characters`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get characters: ${response.status}`);
    }

    return await response.json();
}