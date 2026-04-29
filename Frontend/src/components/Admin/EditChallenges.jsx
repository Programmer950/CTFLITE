import "./CreateChallenge.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EditChallenge() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [type, setType] = useState("standard");

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "easy",

        points: "",
        initialValue: "",
        decay: "",
        minValue: "",

        flag: "",
        flagType: "static",
        caseSensitive: false,

        state: "visible",
        maxAttempts: 0,

        author: "",
        tags: "",
        hints: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // 🔥 FIXED PREFILL (NEW ENDPOINT)
    useEffect(() => {
        async function fetchChallenge() {
            try {
                const res = await fetch(`http://localhost:8080/admin/challenges/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const ch = await res.json();
                console.log("EDIT DATA:", ch);

                if (!res.ok) {
                    throw new Error(ch.error || "Failed to fetch challenge");
                }

                setType(ch.type || "standard");

                setForm({
                    title: ch.Title || "",
                    description: ch.Description || "",
                    category: ch.Category || "",
                    difficulty: ch.Difficulty || "easy",

                    points: ch.Points || "",

                    initialValue: ch.InitialValue || "",
                    decay: ch.Decay || "",
                    minValue: ch.MinValue || "",

                    flag: "",
                    flagType: ch.FlagType || "static",
                    caseSensitive: ch.CaseSensitive || false,

                    state: ch.State || "visible",
                    maxAttempts: ch.MaxAttempts || 0,

                    author: ch.Author || "",
                    tags: Array.isArray(ch.Tags) ? ch.Tags.join(", ") : "",
                    hints: Array.isArray(ch.Hints) ? ch.Hints.join("\n") : "",
                });

            } catch (err) {
                setMessage({ type: "error", text: err.message });
            } finally {
                setLoading(false);
            }
        }

        fetchChallenge();
    }, [id, token]);

    async function handleUpdate() {
        if (!form.title || !form.description) {
            setMessage({ type: "error", text: "Fill required fields" });
            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`http://localhost:8080/admin/challenges/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    difficulty: form.difficulty,
                    type,

                    points: type === "standard" ? Number(form.points) : 0,

                    initialValue: Number(form.initialValue),
                    decay: Number(form.decay),
                    minValue: Number(form.minValue),

                    flag: form.flag,
                    flagType: form.flagType,
                    caseSensitive: form.caseSensitive,

                    state: form.state,
                    maxAttempts: Number(form.maxAttempts),

                    author: form.author,
                    tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
                    hints: form.hints ? form.hints.split("\n") : [],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Update failed");
            }

            setMessage({ type: "success", text: "Updated successfully" });

            setTimeout(() => navigate("/admin/challenges"), 1200);

        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="loading-state">Loading...</div>;

    return (
        <div className="create-challenge-page">

            <div className="page-header">
                <h1>Edit Challenge</h1>
                <p className="subtext">Modify challenge details</p>
            </div>

            <div className="form-container single">
                <div className="form-panel">

                    {/* TYPE */}
                    <div className="form-section">
                        <h3>Challenge Type</h3>
                        <div className="type-switch">
                            <button
                                className={type === "standard" ? "active" : ""}
                                onClick={() => setType("standard")}
                            >
                                Standard
                            </button>
                            <button
                                className={type === "dynamic" ? "active" : ""}
                                onClick={() => setType("dynamic")}
                            >
                                Dynamic
                            </button>
                        </div>
                    </div>

                    {/* BASIC */}
                    <div className="form-section">
                        <h3>Basic Info</h3>
                        <div className="section-grid">
                            <input
                                value={form.title}
                                onChange={e => updateField("title", e.target.value)}
                                placeholder="Title"
                            />

                            <textarea
                                className="full"
                                value={form.description}
                                onChange={e => updateField("description", e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                    </div>

                    {/* CONFIG */}
                    <div className="form-section">
                        <h3>Configuration</h3>

                        <div className="section-grid">
                            <input
                                value={form.category}
                                onChange={e => updateField("category", e.target.value)}
                                placeholder="Category"
                            />

                            <select
                                value={form.difficulty}
                                onChange={e => updateField("difficulty", e.target.value)}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            {type === "standard" && (
                                <input
                                    type="number"
                                    value={form.points}
                                    onChange={e => updateField("points", e.target.value)}
                                    placeholder="Points"
                                />
                            )}

                            {type === "dynamic" && (
                                <>
                                    <input type="number" value={form.initialValue} onChange={e => updateField("initialValue", e.target.value)} placeholder="Initial Value" />
                                    <input type="number" value={form.decay} onChange={e => updateField("decay", e.target.value)} placeholder="Decay" />
                                    <input type="number" value={form.minValue} onChange={e => updateField("minValue", e.target.value)} placeholder="Min Value" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* FLAG */}
                    <div className="form-section">
                        <h3>Flag</h3>
                        <input
                            value={form.flag}
                            onChange={e => updateField("flag", e.target.value)}
                            placeholder="Leave empty to keep existing flag"
                        />
                    </div>

                    {/* METADATA */}
                    <div className="form-section">
                        <h3>Metadata</h3>
                        <div className="section-grid">
                            <input value={form.author} onChange={e => updateField("author", e.target.value)} placeholder="Author" />
                            <input value={form.tags} onChange={e => updateField("tags", e.target.value)} placeholder="Tags (comma separated)" />
                            <textarea className="full" value={form.hints} onChange={e => updateField("hints", e.target.value)} placeholder="Hints (one per line)" />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => navigate("/admin/challenges")}>
                            Cancel
                        </button>

                        <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                            {saving ? "Saving..." : "Update Challenge"}
                        </button>
                    </div>

                </div>
            </div>

            {message && (
                <div className={`popup ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}