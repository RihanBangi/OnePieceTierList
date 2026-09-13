import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TierList from "./pages/TierList";


function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function App() {
    return (
        <BrowserRouter>

            <Navbar />

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

        </BrowserRouter>
    );
}

export default App;