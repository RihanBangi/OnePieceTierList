import { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay
} from "@dnd-kit/core";

import { getCharacters } from "../services/api";
import CharacterCard from "../components/CharacterCard";
import TierRow from "../components/TierRow";

function TierList() {
    const [characters, setCharacters] = useState([]);

    const [tiers, setTiers] = useState({
        S: [],
        A: [],
        B: [],
        C: [],
        D: []
    });

    const [activeCharacter, setActiveCharacter] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const handleDragStart = (event) => {
        const characterId = Number(
            event.active.id.toString().replace("character-", "")
        );

        const character = characters.find(
            c => c.id === characterId
        );

        setActiveCharacter(character);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveCharacter(null);

        if (!over) {
            return;
        }

        const characterId = Number(
            active.id.toString().replace("character-", "")
        );

        const overId = over.id.toString();

        if (!overId.startsWith("tier-")) {
            return;
        }

        const tier = overId.replace("tier-", "");

        setTiers(previousTiers => {

            const updatedTiers = {
                S: previousTiers.S.filter(
                    c => c.id !== characterId
                ),
                A: previousTiers.A.filter(
                    c => c.id !== characterId
                ),
                B: previousTiers.B.filter(
                    c => c.id !== characterId
                ),
                C: previousTiers.C.filter(
                    c => c.id !== characterId
                ),
                D: previousTiers.D.filter(
                    c => c.id !== characterId
                )
            };

            const character = characters.find(
                c => c.id === characterId
            );

            if (character && updatedTiers[tier]) {
                updatedTiers[tier].push(character);
            }

            return updatedTiers;
        });
    };

    if (loading) {
        return <h2>Loading characters...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const rankedCharacters = Object.values(tiers)
        .flat()
        .map(character => character.id);

    const availableCharacters = characters.filter(
        character => !rankedCharacters.includes(character.id)
    );

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >

            <div className="tier-list-page">

                <h1>One Piece Tier List</h1>

                {/* Tier Board */}
                <section className="tier-board">

                    {Object.keys(tiers).map(tier => (
                        <TierRow
                            key={tier}
                            tier={tier}
                        >
                            {tiers[tier].map(character => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                />
                            ))}
                        </TierRow>
                    ))}

                </section>

                {/* Character Pool */}
                <section className="character-section">

                    <h2>Character Pool</h2>

                    <div className="character-pool">

                        {availableCharacters.map(character => (
                            <CharacterCard
                                key={character.id}
                                character={character}
                            />
                        ))}

                    </div>

                </section>

            </div>

            {/* Character being dragged */}
            <DragOverlay>
                {activeCharacter ? (
                    <CharacterCard
                        character={activeCharacter}
                        isOverlay={true}
                    />
                ) : null}
            </DragOverlay>

        </DndContext>
    );
}

export default TierList;