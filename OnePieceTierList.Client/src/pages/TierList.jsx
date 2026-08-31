import { useEffect, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import {
    getCharacters,
    getTierListItems,
    addTierListItem,
    updateTierListItem
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
        loadTierList();
    }, []);

    const loadTierList = async () => {
        try {
            const token = localStorage.getItem("token");
            const tierListId = Number(
                localStorage.getItem("tierListId")
            );

            if (!token) {
                setError("You are not logged in.");
                setLoading(false);
                return;
            }

            if (!tierListId) {
                setError("No tier list found for this user.");
                setLoading(false);
                return;
            }

            const characterData = await getCharacters(token);
            setCharacters(characterData);

            const tierItems = await getTierListItems(
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
                const character = characterData.find(
                    c => c.id === item.characterId
                );

                if (character && loadedTiers[item.tier]) {
                    loadedTiers[item.tier].push({
                        ...character,
                        tierItemId: item.id,
                        position: item.position
                    });
                }
            });

            Object.keys(loadedTiers).forEach(tier => {
                loadedTiers[tier].sort(
                    (a, b) => a.position - b.position
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

        const newTier = overId.replace("tier-", "");

        if (!["S", "A", "B", "C", "D"].includes(newTier)) {
            return;
        }

        const character = characters.find(
            c => c.id === characterId
        );

        if (!character) {
            return;
        }

        const token = localStorage.getItem("token");
        const tierListId = Number(
            localStorage.getItem("tierListId")
        );

        if (!token || !tierListId) {
            console.error("Missing token or tier list ID.");
            return;
        }

        let existingItem = null;

        Object.values(tiers).forEach(tierCharacters => {
            const found = tierCharacters.find(
                c => c.id === characterId
            );

            if (found && found.tierItemId) {
                existingItem = found;
            }
        });

        const newPosition = tiers[newTier].length;

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

            updatedTiers[newTier].push({
                ...character,
                tierItemId: existingItem?.tierItemId,
                position: newPosition
            });

            return updatedTiers;
        });

        try {
            if (existingItem) {
                await updateTierListItem(
                    tierListId,
                    existingItem.tierItemId,
                    newTier,
                    newPosition,
                    token
                );

                console.log(
                    `${character.name} moved to ${newTier} tier`
                );
            } else {
                const savedItem = await addTierListItem(
                    tierListId,
                    characterId,
                    newTier,
                    newPosition,
                    token
                );

                console.log(
                    `${character.name} added to ${newTier} tier`
                );

                setTiers(previousTiers => {
                    const updatedTiers = {
                        ...previousTiers
                    };

                    updatedTiers[newTier] =
                        updatedTiers[newTier].map(c =>
                            c.id === characterId
                                ? {
                                    ...c,
                                    tierItemId: savedItem.id
                                }
                                : c
                        );

                    return updatedTiers;
                });
            }
        } catch (error) {
            console.error(
                "Failed to save tier placement:",
                error
            );

            // Reload database data if saving fails
            loadTierList();
        }
    };

    if (loading) {
        return <h2>Loading tier list...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const rankedCharacters = Object.values(tiers)
        .flat()
        .map(character => character.id);

    const availableCharacters = characters.filter(
        character =>
            !rankedCharacters.includes(character.id)
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
                        {availableCharacters.map(character => (
                            <CharacterCard
                                key={character.id}
                                character={character}
                            />
                        ))}
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