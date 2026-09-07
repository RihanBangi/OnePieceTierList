import { useDroppable } from "@dnd-kit/core";

function CharacterPool({ children }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "character-pool"
    });

    return (
        <div
            ref={setNodeRef}
            className={`character-pool ${isOver ? "character-pool-over" : ""
                }`}
        >
            {children}
        </div>
    );
}

export default CharacterPool;