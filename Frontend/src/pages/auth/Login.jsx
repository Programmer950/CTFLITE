import "./Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            // ❗ handle invalid login
            if (!res.ok || !data.token) {
                throw new Error("Invalid username or password");
            }

            // ✅ store token via context
            login(data.token);

            // ✅ redirect to home
            navigate("/");

        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Login</h1>
                <p className="subtitle">Access your CTF account</p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            placeholder="Enter username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </div>

                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {error && <p className="error">{error}</p>}

                <p className="auth-switch">
                    Don’t have an account? <Link to="/register">Register</Link>
                </p>

            </div>

        </div>
    );
}