import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user's TierList ID
            localStorage.setItem(
                "tierListId",
                data.tierListId.toString()
            );

            // Save user ID
            localStorage.setItem(
                "userId",
                data.userId.toString()
            );

            // Save user name
            localStorage.setItem(
                "userName",
                data.name
            );

            setMessage("Login successful! ✅");

            console.log("User:", data.name);
            console.log("User ID:", data.userId);
            console.log("TierList ID:", data.tierListId);

        } catch (error) {
            console.error(error);
            setMessage("Could not connect to the API.");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>
                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;