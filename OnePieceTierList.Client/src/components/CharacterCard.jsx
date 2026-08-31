import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function CharacterCard({ character, isOverlay = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform
    } = useDraggable({
        id: `character-${character.id}`,
        disabled: isOverlay
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        cursor: isOverlay ? "grabbing" : "grab"
    };

    return (
        <div
            ref={isOverlay ? undefined : setNodeRef}
            style={style}
            className="character-card"
            {...(isOverlay ? {} : listeners)}
            {...(isOverlay ? {} : attributes)}
        >
            <img
                src={character.imageUrl}
                alt={character.name}
            />

            <div className="character-name">
                {character.name}
            </div>
        </div>
    );
}

export default CharacterCard;
