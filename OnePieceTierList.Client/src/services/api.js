const API_URL = "http://localhost:5000/api";

export async function getCharacters(token) {
    const response = await fetch(`${API_URL}/characters`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to load characters: ${response.status}`);
    }

    return await response.json();
}

export async function getTierListItems(tierListId, token) {
    const response = await fetch(
        `${API_URL}/tierlists/${tierListId}/items`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to load tier list: ${response.status}`);
    }

    return await response.json();
}