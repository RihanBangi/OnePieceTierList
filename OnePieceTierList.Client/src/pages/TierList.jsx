import { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay
} from "@dnd-kit/core";

import {
    getCharacters,
    getTierListItems,
    addTierListItem
} from "../services/api";

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
        const loadTierList = async () => {
            try {
                const token = localStorage.getItem("token");
                const savedTierListId =
                    localStorage.getItem("tierListId");

                if (!token) {
                    setError("You are not logged in.");
                    return;
                }

                if (!savedTierListId) {
                    setError("No tier list found for this user.");
                    return;
                }

                const tierListId = Number(savedTierListId);

                // Load characters
                const characterData =
                    await getCharacters(token);

                setCharacters(characterData);

                // Load this user's tier list
                const tierItems =
                    await getTierListItems(
                        tierListId,
                        token
                    );

                const loadedTiers = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: []
                };

                tierItems.forEach(item => {
                    const character =
                        characterData.find(
                            c => c.id === item.characterId
                        );

                    if (
                        character &&
                        loadedTiers[item.tier]
                    ) {
                        loadedTiers[item.tier].push({
                            ...character,
                            tierItemId: item.id,
                            position: item.position
                        });
                    }
                });

                // Sort by position
                Object.keys(loadedTiers).forEach(tier => {
                    loadedTiers[tier].sort(
                        (a, b) =>
                            a.position - b.position
                    );
                });

                setTiers(loadedTiers);

            } catch (error) {
                console.error(error);
                setError("Failed to load tier list.");
            } finally {
                setLoading(false);
            }
        };

        loadTierList();
    }, []);

    const handleDragStart = event => {
        const characterId = Number(
            event.active.id
                .toString()
                .replace("character-", "")
        );

        const character = characters.find(
            c => c.id === characterId
        );

        setActiveCharacter(character);
    };

    const handleDragEnd = async event => {
        const { active, over } = event;

        setActiveCharacter(null);

        if (!over) {
            return;
        }

        const characterId = Number(
            active.id
                .toString()
                .replace("character-", "")
        );

        const overId = over.id.toString();

        if (!overId.startsWith("tier-")) {
            return;
        }

        const tier = overId.replace("tier-", "");

        if (!["S", "A", "B", "C", "D"].includes(tier)) {
            return;
        }

        const character = characters.find(
            c => c.id === characterId
        );

        if (!character) {
            return;
        }

        // Remove character from every tier
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

            updatedTiers[tier].push(character);

            return updatedTiers;
        });

        try {
            const token = localStorage.getItem("token");
            const tierListId =
                Number(localStorage.getItem("tierListId"));

            const position =
                tiers[tier].length;

            await addTierListItem(
                tierListId,
                characterId,
                tier,
                position,
                token
            );

            console.log(
                `${character.name} saved to ${tier} tier`
            );

        } catch (error) {
            console.error(
                "Failed to save tier placement:",
                error
            );
        }
    };

    if (loading) {
        return <h2>Loading tier list...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const rankedCharacters =
        Object.values(tiers)
            .flat()
            .map(character => character.id);

    const availableCharacters =
        characters.filter(
            character =>
                !rankedCharacters.includes(
                    character.id
                )
        );

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="tier-list-page">

                <h1>One Piece Tier List</h1>

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

                <section className="character-section">

                    <h2>Character Pool</h2>

                    <div className="character-pool">

                        {availableCharacters.map(
                            character => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                />
                            )
                        )}

                    </div>

                </section>

            </div>

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