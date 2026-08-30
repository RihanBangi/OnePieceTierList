function TierRow({ tier, children }) {
    return (
        <div className="tier-row">
            <div className="tier-label">
                {tier}
            </div>

            <div className="tier-characters">
                {children}
            </div>
        </div>
    );
}

export default TierRow;