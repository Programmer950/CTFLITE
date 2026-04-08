import "./Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

    const [form, setForm] = useState({
        username: "",
        email: "",      // kept for UI only
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // ✅ redirect to login after success
            navigate("/login");

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Register</h1>
                <p className="subtitle">Create your hacker identity</p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            placeholder="Choose username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            placeholder="Enter email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </div>

                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Creating..." : "Register"}
                    </button>

                </form>

                {error && <p className="error">{error}</p>}

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>

            </div>

        </div>
    );
}