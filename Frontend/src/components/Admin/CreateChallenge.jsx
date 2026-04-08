import "./CreateChallenge.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CreateChallenge() {
    const { token } = useAuth();

    const [type, setType] = useState("standard");

    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        points: "",
        difficulty: "easy",
        flag: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit() {
        if (!form.title || !form.description || !form.flag) {
            setMessage("Please fill required fields");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:8080/admin/challenges", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    difficulty: form.difficulty,
                    points: Number(form.points),
                    flag: form.flag,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create challenge");
            }

            setMessage("✅ Challenge created!");

            // reset
            setForm({
                title: "",
                category: "",
                description: "",
                points: "",
                difficulty: "easy",
                flag: "",
            });

        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-challenge-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Create Challenge</h1>
            </div>

            <div className="form-container">

                {/* LEFT */}
                <div className="type-panel">
                    <h3>Challenge Types</h3>

                    <div
                        className={type === "standard" ? "type-box active" : "type-box"}
                        onClick={() => setType("standard")}
                    >
                        Standard
                    </div>

                    <div
                        className={type === "dynamic" ? "type-box active" : "type-box"}
                        onClick={() => setType("dynamic")}
                    >
                        Dynamic
                    </div>
                </div>

                {/* RIGHT */}
                <div className="form-panel">

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    {/* STANDARD */}
                    {type === "standard" && (
                        <div className="form-group">
                            <label>Points</label>
                            <input
                                type="number"
                                value={form.points}
                                onChange={(e) => setForm({ ...form, points: e.target.value })}
                            />
                        </div>
                    )}

                    {/* DYNAMIC (UI only for now) */}
                    {type === "dynamic" && (
                        <>
                            <div className="form-group">
                                <label>Initial Value</label>
                                <input placeholder="Coming soon" disabled />
                            </div>

                            <div className="form-group">
                                <label>Decay Function</label>
                                <select disabled>
                                    <option>Linear</option>
                                    <option>Logarithmic</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Decay Value</label>
                                <input placeholder="Coming soon" disabled />
                            </div>

                            <div className="form-group">
                                <label>Minimum Value</label>
                                <input placeholder="Coming soon" disabled />
                            </div>
                        </>
                    )}

                    {/* FLAG */}
                    <div className="form-group">
                        <label>Flag</label>
                        <input
                            value={form.flag}
                            onChange={(e) => setForm({ ...form, flag: e.target.value })}
                        />
                    </div>

                    {/* BUTTON */}
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>

                    {message && <p className="form-message">{message}</p>}

                </div>

            </div>

        </div>
    );
}