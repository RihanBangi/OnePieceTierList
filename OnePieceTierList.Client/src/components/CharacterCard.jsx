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

    const style = isOverlay
        ? {}
        : {
            transform: CSS.Translate.toString(transform),
            cursor: "grab"
        };

    return (
        <div
            ref={isOverlay ? undefined : setNodeRef}
            style={style}
            className="character-card"
            {...(isOverlay ? {} : attributes)}
            {...(isOverlay ? {} : listeners)}
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