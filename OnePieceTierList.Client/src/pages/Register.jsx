import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const data = await registerUser(
                name,
                email,
                password
            );

            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("tierListId", data.tierListId);

            navigate("/login", {
                replace: true,
                state: {
                    alert: {
                        message: "Account created successfully!",
                        type: "success"
                    }
                }
            });

        } catch (error) {
            console.error(error);

            let message = "Registration failed.";

            try {
                const errorText = error.message || "";
                const jsonStart = errorText.indexOf("{");

                if (jsonStart !== -1) {
                    const jsonText =
                        errorText.substring(jsonStart);

                    const errorData =
                        JSON.parse(jsonText);

                    if (errorData.message) {
                        message = errorData.message;
                    }
                }
            } catch {
                message = "Registration failed.";
            }

            navigate("/register", {
                replace: true,
                state: {
                    alert: {
                        message,
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

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Create your One Piece Tier List account
                </p>

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
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
                                placeholder="Create a password"
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
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;