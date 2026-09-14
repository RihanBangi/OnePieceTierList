const API_URL ="https://onepiecetierlist.onrender.com/api";

// ===============================
// REGISTER
// ===============================

export async function registerUser(name, email, password) {
    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Registration failed: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


// ===============================
// LOGIN
// ===============================

export async function loginUser(email, password) {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Login failed: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


// ===============================
// GET CHARACTERS
// ===============================

export async function getCharacters(token) {
    const response = await fetch(
        `${API_URL}/characters`,
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
            `Failed to load characters: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


// ===============================
// GET TIER LIST ITEMS
// ===============================

export async function getTierListItems(
    tierListId,
    token
) {
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


// ===============================
// ADD TIER LIST ITEM
// ===============================

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


// ===============================
// UPDATE TIER LIST ITEM
// ===============================

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


// ===============================
// DELETE TIER LIST ITEM
// ===============================

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