import { useDroppable } from "@dnd-kit/core";

function TierRow({ tier, children }) {
    const { isOver, setNodeRef } = useDroppable({
        id: `tier-${tier}`
    });

    return (
        <div
            ref={setNodeRef}
            className={`tier-row ${isOver ? "tier-row-over" : ""
                }`}
        >
            <div className={`tier-label tier-${tier}`}>
                {tier}
            </div>

            <div className="tier-characters">
                {children}
            </div>
        </div>
    );
}

export default TierRow;