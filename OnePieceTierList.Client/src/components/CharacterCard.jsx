import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function CharacterCard({ character, isOverlay = false }) {

    const draggable = useDraggable({
        id: `character-${character.id}`,
        disabled: isOverlay
    });

    const style = isOverlay
        ? {}
        : {
            transform: CSS.Translate.toString(
                draggable.transform
            )
        };

    return (
        <div
            ref={isOverlay ? undefined : draggable.setNodeRef}
            style={style}
            className="character-card"
            {...(isOverlay ? {} : draggable.listeners)}
            {...(isOverlay ? {} : draggable.attributes)}
        >
            <img
                src={character.imageUrl}
                alt={character.name}
            />

            <h3>{character.name}</h3>
        </div>
    );
}

export default CharacterCard;