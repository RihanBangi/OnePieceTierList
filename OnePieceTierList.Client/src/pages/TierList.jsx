import { useEffect, useState } from "react";

import {
    DndContext,
    DragOverlay,
    useDroppable,
    closestCenter
} from "@dnd-kit/core";

import {
    getCharacters,
    getTierListItems,
    addTierListItem,
    updateTierListItem,
    deleteTierListItem
} from "../services/api";

import CharacterCard from "../components/CharacterCard";
import TierRow from "../components/TierRow";

const INITIAL_TIERS = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: []
};

function TierList() {
    const [characters, setCharacters] = useState([]);
    const [tiers, setTiers] = useState(INITIAL_TIERS);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // CHARACTER POOL
    // =========================

    const {
        isOver: isPoolOver,
        setNodeRef: setPoolNodeRef
    } = useDroppable({
        id: "character-pool"
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
                        )
                    ]);

                setCharacters(characterData);

                const loadedTiers = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: []
                };

                tierItems.forEach((item) => {
                    if (
                        item.character &&
                        loadedTiers[item.tier]
                    ) {
                        loadedTiers[item.tier].push({
                            ...item.character,
                            tierItemId: item.id,
                            position: item.position ?? 0
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
    // FIND CHARACTER
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
                    character
                };
            }
        }

        return null;
    };

    // =========================
    // SAVE TIER POSITIONS
    // =========================

    const saveTierPositions = async (
        tierName,
        tierCharacters,
        token,
        tierListId
    ) => {
        for (
            let index = 0;
            index < tierCharacters.length;
            index++
        ) {
            const character =
                tierCharacters[index];

            if (!character.tierItemId) {
                continue;
            }

            await updateTierListItem(
                tierListId,
                character.tierItemId,
                tierName,
                index,
                token
            );
        }
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
            localStorage.getItem(
                "tierListId"
            )
        );

        if (!token || !tierListId) {
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
        // CHARACTER POOL DETECTION
        // ==================================================

        const poolElement =
            document.getElementById(
                "character-pool"
            );

        let droppedInsidePool = false;

        if (
            poolElement &&
            active.rect.current.translated
        ) {
            const poolRect =
                poolElement.getBoundingClientRect();

            const draggedRect =
                active.rect.current.translated;

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

        const overId = over
            ? over.id.toString()
            : "";

        // ==================================================
        // CASE 1: CHARACTER POOL
        // ==================================================

        if (
            droppedInsidePool ||
            overId === "character-pool"
        ) {
            const existing =
                findCharacterInTiers(
                    characterId
                );

            if (!existing) {
                return;
            }

            const tierItem =
                existing.character;

            setTiers((previousTiers) => {
                const updated = {};

                Object.keys(previousTiers).forEach(
                    (tier) => {
                        updated[tier] =
                            previousTiers[tier].filter(
                                (c) =>
                                    c.id !==
                                    characterId
                            );
                    }
                );

                return updated;
            });

            if (tierItem.tierItemId) {
                try {
                    await deleteTierListItem(
                        tierListId,
                        tierItem.tierItemId,
                        token
                    );
                } catch (err) {
                    console.error(
                        "Failed to delete tier item:",
                        err
                    );
                }
            }

            return;
        }

        if (!over) {
            return;
        }

        // ==================================================
        // CASE 2: DROPPED ON ANOTHER CHARACTER
        // ==================================================

        if (
            overId.startsWith(
                "character-drop-"
            )
        ) {
            const targetCharacterId =
                Number(
                    overId.replace(
                        "character-drop-",
                        ""
                    )
                );

            // This branch is currently not used
            // because CharacterCard is only draggable.
            return;
        }

        // ==================================================
        // CASE 3: DROPPED ON TIER
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

        // ==================================================
        // EXISTING CHARACTER
        // ==================================================

        if (
            existing &&
            existing.character.tierItemId
        ) {
            const oldTier =
                existing.tier;

            const existingCharacter =
                existing.character;

            // Same tier
            if (oldTier === newTier) {
                const currentList =
                    [...tiers[oldTier]];

                const oldIndex =
                    currentList.findIndex(
                        (c) =>
                            c.id ===
                            characterId
                    );

                if (oldIndex === -1) {
                    return;
                }

                // Move character to end
                const [
                    movedCharacter
                ] =
                    currentList.splice(
                        oldIndex,
                        1
                    );

                currentList.push(
                    movedCharacter
                );

                const updatedList =
                    currentList.map(
                        (
                            item,
                            index
                        ) => ({
                            ...item,
                            position:
                                index
                        })
                    );

                setTiers(
                    (previousTiers) => ({
                        ...previousTiers,
                        [newTier]:
                            updatedList
                    })
                );

                try {
                    await saveTierPositions(
                        newTier,
                        updatedList,
                        token,
                        tierListId
                    );

                    console.log(
                        "Tier order saved"
                    );

                } catch (err) {
                    console.error(
                        "Failed to save order:",
                        err
                    );
                }

                return;
            }

            // ==================================================
            // MOVE TO DIFFERENT TIER
            // ==================================================

            const oldList =
                tiers[oldTier].filter(
                    (c) =>
                        c.id !==
                        characterId
                );

            const newList = [
                ...tiers[newTier],
                {
                    ...existingCharacter
                }
            ];

            const updatedOldList =
                oldList.map(
                    (
                        item,
                        index
                    ) => ({
                        ...item,
                        position:
                            index
                    })
                );

            const updatedNewList =
                newList.map(
                    (
                        item,
                        index
                    ) => ({
                        ...item,
                        position:
                            index
                    })
                );

            setTiers(
                (previousTiers) => ({
                    ...previousTiers,

                    [oldTier]:
                        updatedOldList,

                    [newTier]:
                        updatedNewList
                })
            );

            try {
                await updateTierListItem(
                    tierListId,
                    existingCharacter.tierItemId,
                    newTier,
                    updatedNewList.length - 1,
                    token
                );

                await saveTierPositions(
                    oldTier,
                    updatedOldList,
                    token,
                    tierListId
                );

                await saveTierPositions(
                    newTier,
                    updatedNewList,
                    token,
                    tierListId
                );

            } catch (err) {
                console.error(
                    "Failed to move character:",
                    err
                );
            }

            return;
        }

        // ==================================================
        // CHARACTER FROM POOL → TIER
        // ==================================================

        const newPosition =
            tiers[newTier].length;

        const temporaryId =
            `temp-${Date.now()}`;

        const newCharacter = {
            ...character,
            tierItemId:
                temporaryId,
            position:
                newPosition
        };

        setTiers(
            (previousTiers) => ({
                ...previousTiers,

                [newTier]: [
                    ...previousTiers[
                    newTier
                    ],
                    newCharacter
                ]
            })
        );

        try {
            const savedItem =
                await addTierListItem(
                    tierListId,
                    characterId,
                    newTier,
                    newPosition,
                    token
                );

            setTiers(
                (previousTiers) => ({
                    ...previousTiers,

                    [newTier]:
                        previousTiers[
                            newTier
                        ].map(
                            (item) =>
                                item.tierItemId ===
                                    temporaryId
                                    ? {
                                        ...item,
                                        tierItemId:
                                            savedItem.id
                                    }
                                    : item
                        )
                })
            );

        } catch (err) {
            console.error(
                "Failed to add character:",
                err
            );

            setTiers(
                (previousTiers) => ({
                    ...previousTiers,

                    [newTier]:
                        previousTiers[
                            newTier
                        ].filter(
                            (item) =>
                                item.tierItemId !==
                                temporaryId
                        )
                })
            );
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

    if (error) {
        return (
            <div className="tier-list-page">
                <h2>{error}</h2>
            </div>
        );
    }

    // =========================
    // CHARACTER POOL
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
            collisionDetection={
                closestCenter
            }
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

                <section className="tier-board">

                    {Object.keys(tiers).map(
                        (tier) => (
                            <TierRow
                                key={tier}
                                tier={tier}
                            >
                                {tiers[tier].map(
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
                            </TierRow>
                        )
                    )}

                </section>

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