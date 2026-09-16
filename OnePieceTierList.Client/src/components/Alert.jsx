function Alert({ message, type = "success", onClose }) {
    if (!message) {
        return null;
    }

    return (
        <div className={`alert alert-${type}`}>
            <span>{message}</span>

            <button
                onClick={onClose}
                aria-label="Close alert"
            >
                ×
            </button>
        </div>
    );
}

export default Alert;