import { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    useDroppable,
} from "@dnd-kit/core";

import {
    getCharacters,
    getTierListItems,
    addTierListItem,
    updateTierListItem,
    deleteTierListItem,
} from "../services/api";

import CharacterCard from "../components/CharacterCard";
import TierRow from "../components/TierRow";

const INITIAL_TIERS = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
};

function TierList() {
    const [characters, setCharacters] = useState([]);
    const [tiers, setTiers] = useState(INITIAL_TIERS);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // CHARACTER POOL DROP ZONE
    // =========================

    const {
        isOver: isPoolOver,
        setNodeRef: setPoolNodeRef,
    } = useDroppable({
        id: "character-pool",
    });

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("token");
                const tierListId = Number(
                    localStorage.getItem("tierListId")
                );

                console.log("Loading Tier List ID:", tierListId);

                if (!token) {
                    setError("You are not logged in.");
                    return;
                }

                if (!tierListId) {
                    setError("No tier list found for this user.");
                    return;
                }

                const [characterData, tierItems] =
                    await Promise.all([
                        getCharacters(token),
                        getTierListItems(
                            tierListId,
                            token
                        ),
                    ]);

                setCharacters(characterData);

                const loadedTiers = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                };

                tierItems.forEach((item) => {
                    if (
                        item.character &&
                        loadedTiers[item.tier]
                    ) {
                        loadedTiers[item.tier].push({
                            ...item.character,

                            tierItemId: item.id,

                            position:
                                item.position ?? 0,
                        });
                    }
                });

                Object.keys(loadedTiers).forEach(
                    (tier) => {
                        loadedTiers[tier].sort(
                            (a, b) =>
                                a.position -
                                b.position
                        );
                    }
                );

                setTiers(loadedTiers);

            } catch (err) {
                console.error(
                    "Failed to load tier list:",
                    err
                );

                setError(
                    "Failed to load tier list."
                );

            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // =========================
    // DRAG START
    // =========================

    const handleDragStart = (event) => {
        const characterId = Number(
            event.active.id
                .toString()
                .replace("character-", "")
        );

        const character =
            characters.find(
                (c) => c.id === characterId
            );

        if (character) {
            setActiveCharacter(character);
        }
    };

    // =========================
    // FIND CHARACTER'S CURRENT TIER
    // =========================

    const findCharacterInTiers = (
        characterId
    ) => {
        for (const tier of Object.keys(tiers)) {
            const character =
                tiers[tier].find(
                    (c) => c.id === characterId
                );

            if (character) {
                return {
                    tier,
                    character,
                };
            }
        }

        return null;
    };

    // =========================
    // DRAG END
    // =========================

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        setActiveCharacter(null);

        if (!active) {
            return;
        }

        const characterId = Number(
            active.id
                .toString()
                .replace("character-", "")
        );

        const token =
            localStorage.getItem("token");

        const tierListId = Number(
            localStorage.getItem("tierListId")
        );

        if (!token || !tierListId) {
            console.error(
                "Missing token or tier list ID."
            );

            return;
        }

        const character =
            characters.find(
                (c) => c.id === characterId
            );

        if (!character) {
            return;
        }

        // ==================================================
        // IMPORTANT:
        // CHECK CHARACTER POOL USING ITS REAL DOM RECTANGLE
        // ==================================================

        const poolElement =
            document.getElementById(
                "character-pool"
            );

        let droppedInsidePool = false;

        if (poolElement) {
            const poolRect =
                poolElement.getBoundingClientRect();

            const draggedRect =
                active.rect.current.translated;

            if (draggedRect) {
                const centerX =
                    draggedRect.left +
                    draggedRect.width / 2;

                const centerY =
                    draggedRect.top +
                    draggedRect.height / 2;

                droppedInsidePool =
                    centerX >= poolRect.left &&
                    centerX <= poolRect.right &&
                    centerY >= poolRect.top &&
                    centerY <= poolRect.bottom;
            }
        }

        // ==================================================
        // CASE 1
        // CHARACTER DROPPED INTO CHARACTER POOL
        // ==================================================

        if (
            droppedInsidePool ||
            over?.id === "character-pool"
        ) {
            console.log(
                "Dropped on: character-pool"
            );

            const existing =
                findCharacterInTiers(
                    characterId
                );

            if (!existing) {
                console.log(
                    `${character.name} is already in pool`
                );

                return;
            }

            const tierItem =
                existing.character;

            // Remove from UI immediately
            setTiers((previousTiers) => {
                const updated = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                };

                Object.keys(
                    previousTiers
                ).forEach((tier) => {
                    updated[tier] =
                        previousTiers[
                            tier
                        ].filter(
                            (c) =>
                                c.id !==
                                characterId
                        );
                });

                return updated;
            });

            // Delete from database
            if (tierItem.tierItemId) {
                try {
                    await deleteTierListItem(
                        tierListId,
                        tierItem.tierItemId,
                        token
                    );

                    console.log(
                        `${character.name} returned to Character Pool`
                    );

                } catch (err) {
                    console.error(
                        "Failed to remove character from backend:",
                        err
                    );
                }
            }

            return;
        }

        // ==================================================
        // NO DROP TARGET
        // ==================================================

        if (!over) {
            console.log(
                "Character was not dropped on a valid target."
            );

            return;
        }

        const overId =
            over.id.toString();

        console.log(
            "Dropped on:",
            overId
        );

        // ==================================================
        // CASE 2
        // CHARACTER DROPPED INTO TIER
        // ==================================================

        if (
            !overId.startsWith("tier-")
        ) {
            return;
        }

        const newTier =
            overId.replace(
                "tier-",
                ""
            );

        if (!tiers[newTier]) {
            return;
        }

        const existing =
            findCharacterInTiers(
                characterId
            );

        // Position at end of tier
        const newPosition =
            tiers[newTier].length;

        // ==================================================
        // CASE 2A
        // MOVE CHARACTER FROM ONE TIER TO ANOTHER
        // ==================================================

        if (
            existing &&
            existing.character.tierItemId
        ) {
            const existingCharacter =
                existing.character;

            setTiers((previousTiers) => {
                const updated = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                };

                Object.keys(
                    previousTiers
                ).forEach((tier) => {
                    updated[tier] =
                        previousTiers[
                            tier
                        ].filter(
                            (c) =>
                                c.id !==
                                characterId
                        );
                });

                updated[newTier] = [
                    ...updated[newTier],
                    {
                        ...existingCharacter,
                        position:
                            newPosition,
                    },
                ];

                return updated;
            });

            try {
                await updateTierListItem(
                    tierListId,

                    existingCharacter.tierItemId,

                    newTier,

                    newPosition,

                    token
                );

                console.log(
                    `${character.name} moved to ${newTier}`
                );

            } catch (err) {
                console.error(
                    "Failed to update tier item:",
                    err
                );
            }

            return;
        }

        // ==================================================
        // CASE 2B
        // CHARACTER FROM POOL -> TIER
        // ==================================================

        const temporaryId =
            `temp-${Date.now()}`;

        const newCharacter = {
            ...character,

            tierItemId:
                temporaryId,

            position:
                newPosition,
        };

        // Optimistic UI update
        setTiers((previousTiers) => ({
            ...previousTiers,

            [newTier]: [
                ...previousTiers[
                newTier
                ],

                newCharacter,
            ],
        }));

        try {
            const savedItem =
                await addTierListItem(
                    tierListId,

                    characterId,

                    newTier,

                    newPosition,

                    token
                );

            // Replace temporary ID
            // with database ID

            setTiers((previousTiers) => ({
                ...previousTiers,

                [newTier]:
                    previousTiers[
                        newTier
                    ].map((item) =>
                        item.tierItemId ===
                            temporaryId
                            ? {
                                ...item,

                                tierItemId:
                                    savedItem.id,
                            }
                            : item
                    ),
            }));

            console.log(
                `${character.name} moved to ${newTier}`
            );

        } catch (err) {
            console.error(
                "Failed to save tier placement:",
                err
            );

            // Remove temporary character
            setTiers((previousTiers) => ({
                ...previousTiers,

                [newTier]:
                    previousTiers[
                        newTier
                    ].filter(
                        (item) =>
                            item.tierItemId !==
                            temporaryId
                    ),
            }));
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="tier-list-page">
                <h2>
                    Loading tier list...
                </h2>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="tier-list-page">
                <h2>{error}</h2>
            </div>
        );
    }

    // =========================
    // FIND CHARACTERS IN POOL
    // =========================

    const rankedCharacterIds =
        new Set(
            Object.values(tiers)
                .flat()
                .map(
                    (character) =>
                        character.id
                )
        );

    const availableCharacters =
        characters.filter(
            (character) =>
                !rankedCharacterIds.has(
                    character.id
                )
        );

    // =========================
    // UI
    // =========================

    return (
        <DndContext
            onDragStart={
                handleDragStart
            }
            onDragEnd={
                handleDragEnd
            }
        >
            <div className="tier-list-page">

                <h1>
                    One Piece Tier List
                </h1>

                {/* =========================
                    TIER BOARD
                ========================= */}

                <section className="tier-board">

                    {Object.keys(tiers).map(
                        (tier) => (
                            <TierRow
                                key={tier}
                                tier={tier}
                            >
                                {tiers[
                                    tier
                                ].map(
                                    (
                                        character
                                    ) => (
                                        <CharacterCard
                                            key={
                                                character.id
                                            }
                                            character={
                                                character
                                            }
                                        />
                                    )
                                )}
                            </TierRow>
                        )
                    )}

                </section>

                {/* =========================
                    CHARACTER POOL
                ========================= */}

                <section className="character-section">

                    <h2>
                        Character Pool
                    </h2>

                    <div
                        ref={
                            setPoolNodeRef
                        }
                        id="character-pool"
                        className={
                            `character-pool ${isPoolOver
                                ? "character-pool-over"
                                : ""
                            }`
                        }
                    >

                        {availableCharacters.map(
                            (character) => (
                                <CharacterCard
                                    key={
                                        character.id
                                    }
                                    character={
                                        character
                                    }
                                />
                            )
                        )}

                    </div>

                </section>

            </div>

            {/* =========================
                DRAG OVERLAY
            ========================= */}

            <DragOverlay>
                {activeCharacter ? (
                    <CharacterCard
                        character={
                            activeCharacter
                        }
                        isOverlay
                    />
                ) : null}
            </DragOverlay>

        </DndContext>
    );
}

export default TierList;