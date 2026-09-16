import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/tier-list", { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const data = await loginUser(
                email,
                password
            );

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);

            if (data.tierListId) {
                localStorage.setItem(
                    "tierListId",
                    data.tierListId
                );
            }

            navigate("/tier-list", {
                replace: true,
                state: {
                    alert: {
                        message: "Login successful!",
                        type: "success"
                    }
                }
            });

        } catch (error) {
            console.error(error);

            navigate("/login", {
                replace: true,
                state: {
                    alert: {
                        message: "Invalid email or password.",
                        type: "error"
                    }
                }
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-icon">🏴‍☠️</div>

                <h1>Welcome Back!</h1>

                <p className="auth-subtitle">
                    Login to your One Piece Tier List
                </p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div className="password-input">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;