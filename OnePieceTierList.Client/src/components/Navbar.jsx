import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    // Don't show navbar on authentication pages
    if (
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar">

            <div
                className="navbar-logo"
                onClick={() => navigate("/tier-list")}
            >
                🏴‍☠️
                <span>One Piece Tier List</span>
            </div>

            {token && (
                <div className="navbar-right">

                    <span className="welcome-text">
                        Welcome, {userName || "User"}
                    </span>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>
            )}

        </nav>
    );
}

export default Navbar;