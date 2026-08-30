import { useEffect, useState } from "react";
import { getCharacters } from "./services/api";

function App() {
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No login token found. Please login first.");
            return;
        }

        getCharacters(token)
            .then(data => {
                setCharacters(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    return (
        <div>
            <h1>One Piece Tier List</h1>

            {error && <p>{error}</p>}

            <h2>Characters</h2>

            {characters.map(character => (
                <div key={character.id}>
                    <h3>{character.name}</h3>
                    <p>{character.description}</p>
                </div>
            ))}
        </div>
    );
}

export default App;