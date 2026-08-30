import { useEffect, useState } from "react";
import { getCharacters } from "../services/api";
import CharacterCard from "../components/CharacterCard";
import TierRow from "../components/TierRow";

function TierList() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const tiers = ["S", "A", "B", "C", "D"];

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("You are not logged in.");
                    return;
                }

                const data = await getCharacters(token);

                setCharacters(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load characters.");
            } finally {
                setLoading(false);
            }
        };

        loadCharacters();
    }, []);

    if (loading) {
        return <h2>Loading characters...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="tier-list-page">

            <h1>One Piece Tier List</h1>

            {/* Tier Board */}
            <section className="tier-board">

                {tiers.map(tier => (
                    <TierRow
                        key={tier}
                        tier={tier}
                    />
                ))}

            </section>

            {/* Character Pool */}
            <section className="character-section">

                <h2>Character Pool</h2>

                <div className="character-pool">

                    {characters.map(character => (
                        <CharacterCard
                            key={character.id}
                            character={character}
                        />
                    ))}

                </div>

            </section>

        </div>
    );
}

export default TierList;