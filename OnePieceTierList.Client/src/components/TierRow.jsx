import { useDroppable } from "@dnd-kit/core";

function TierRow({ tier, children }) {

    const { setNodeRef, isOver } = useDroppable({
        id: `tier-${tier}`
    });

    return (
        <div className="tier-row">

            <div className="tier-label">
                {tier}
            </div>

            <div
                ref={setNodeRef}
                className={`tier-characters ${isOver ? "tier-over" : ""
                    }`}
            >
                {children}
            </div>

        </div>
    );
}

export default TierRow;