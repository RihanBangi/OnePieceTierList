import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function CharacterCard({ character, isOverlay = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `character-${character.id}`,
        disabled: isOverlay,
    });

    const style = isOverlay
        ? {}
        : {
            transform: CSS.Translate.toString(transform),
            opacity: isDragging ? 0.5 : 1,
            cursor: "grab",

            // Important for mobile/touch dragging
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
        };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="character-card"
            {...(!isOverlay ? listeners : {})}
            {...(!isOverlay ? attributes : {})}
        >
            <img
                src={character.imageUrl}
                alt={character.name}
                draggable="false"
            />

            <div className="character-name">
                {character.name}
            </div>
        </div>
    );
}

export default CharacterCard;