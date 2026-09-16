import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import { useEffect, useState } from "react";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TierList from "./pages/TierList";
import Alert from "./components/Alert";


function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function AppContent() {
    const location = useLocation();

    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);

            // Remove alert from navigation history
            window.history.replaceState({}, document.title);

            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [location]);

    return (
        <>
            <Navbar />

            <Alert
                message={alert?.message}
                type={alert?.type}
                onClose={() => setAlert(null)}
            />

            <Routes>

                {/* Home */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/tier-list"
                            replace
                        />
                    }
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Tier List */}
                <Route
                    path="/tier-list"
                    element={
                        <ProtectedRoute>
                            <TierList />
                        </ProtectedRoute>
                    }
                />

            </Routes>

            <Footer />
        </>
    );
}


function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}


export default App;