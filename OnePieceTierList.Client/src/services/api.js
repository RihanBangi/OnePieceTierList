const API_URL = "http://localhost:5000/api";

export async function getCharacters(token) {
    const response = await fetch(`${API_URL}/characters`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(
            `Failed to load characters: ${response.status}`
        );
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
        const errorText = await response.text();

        throw new Error(
            `Failed to load tier list: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}

export async function addTierListItem(
    tierListId,
    characterId,
    tier,
    position,
    token
) {
    const response = await fetch(
        `${API_URL}/tierlists/${tierListId}/items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                characterId,
                tier,
                position
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to add tier item: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}

export async function updateTierListItem(
    tierListId,
    itemId,
    tier,
    position,
    token
) {
    const response = await fetch(
        `${API_URL}/tierlists/${tierListId}/items/${itemId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                tier,
                position
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update tier item: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}

export async function deleteTierListItem(
    tierListId,
    itemId,
    token
) {
    const response = await fetch(
        `${API_URL}/tierlists/${tierListId}/items/${itemId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to delete tier item: ${response.status} ${errorText}`
        );
    }

    return true;
}