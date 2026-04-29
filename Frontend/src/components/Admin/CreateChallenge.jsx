import "./CreateChallenge.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CreateChallenge() {
    const { token } = useAuth();

    const [popup, setPopup] = useState(null);
    const [type, setType] = useState("standard");
    const [file, setFile] = useState(null);

    const [form, setForm] = useState({
        title: "",
        category: "",
        difficulty: "easy",
        description: "",

        points: "",

        initialValue: "",
        decay: "",
        minValue: "",

        flag: "",
        flagType: "static",
        caseSensitive: false,

        state: "visible",
        maxAttempts: 0,

        tags: "",
        author: "",
        hints: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!popup) return;
        const timer = setTimeout(() => setPopup(null), 3000);
        return () => clearTimeout(timer);
    }, [popup]);

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    async function handleSubmit() {
        if (!form.title || !form.description || !form.flag) {
            setPopup({ type: "error", text: "Fill required fields" });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            // 🔥 BASIC
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("difficulty", form.difficulty);
            formData.append("type", type);

            // 🔥 SCORING
            if (type === "standard") {
                formData.append("points", form.points);
            }

            if (type === "dynamic") {
                formData.append("initialValue", form.initialValue);
                formData.append("decay", form.decay);
                formData.append("minValue", form.minValue);
            }

            // 🔥 FLAG
            formData.append("flag", form.flag);
            formData.append("flagType", form.flagType);
            formData.append("caseSensitive", form.caseSensitive);

            // 🔥 CONFIG
            formData.append("state", form.state);
            formData.append("maxAttempts", form.maxAttempts);

            // 🔥 METADATA (MATCHES BACKEND EXACTLY)
            formData.append("author", form.author);
            formData.append("tags", form.tags);   // backend expects string
            formData.append("hints", form.hints); // backend expects string

            // 🔥 FILE
            if (file) {
                formData.append("file", file);
            }

            const res = await fetch("http://localhost:8080/admin/challenges", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            let data;
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            if (!res.ok) {
                throw new Error(data.error || "Failed to create challenge");
            }

            setPopup({ type: "success", text: "Challenge created!" });

            setForm({
                title: "",
                category: "",
                difficulty: "easy",
                description: "",
                points: "",
                initialValue: "",
                decay: "",
                minValue: "",
                flag: "",
                flagType: "static",
                caseSensitive: false,
                state: "visible",
                maxAttempts: 0,
                tags: "",
                author: "",
                hints: "",
            });

            setFile(null);

        } catch (err) {
            setPopup({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-challenge-page">

            <div className="page-header center">
                <h1>Create Challenge</h1>
            </div>

            <div className="form-container">

                {/* LEFT PANEL */}
                <div className="type-panel">
                    <h3>Challenge Type</h3>

                    <div
                        className={`type-box ${type === "standard" ? "active" : ""}`}
                        onClick={() => setType("standard")}
                    >
                        Standard
                    </div>

                    <div
                        className={`type-box ${type === "dynamic" ? "active" : ""}`}
                        onClick={() => setType("dynamic")}
                    >
                        Dynamic
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="form-panel">

                    {/* BASIC */}
                    <div className="form-section">
                        <h3>Basic Info</h3>

                        <div className="section-grid">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    placeholder="name"
                                    value={form.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="web">Web</option>
                                    <option value="crypto">Crypto</option>
                                    <option value="pwn">Pwn</option>
                                    <option value="rev">Reverse</option>
                                    <option value="misc">Misc</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Difficulty</label>
                                <select
                                    value={form.difficulty}
                                    onChange={(e) => updateField("difficulty", e.target.value)}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div className="form-group full">
                                <label>Description *</label>
                                <textarea
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CONFIG */}
                    <div className="form-section">
                        <h3>Configuration</h3>

                        <div className="section-grid">
                            {type === "standard" && (
                                <div className="form-group">
                                    <label>Points</label>
                                    <input
                                        placeholder="points"
                                        type="number"
                                        value={form.points}
                                        onChange={(e) => updateField("points", e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Visibility</label>
                                <select
                                    value={form.state}
                                    onChange={(e) => updateField("state", e.target.value)}
                                >
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Max Attempts</label>
                                <input
                                    placeholder="0 = infinite attempts"
                                    type="number"
                                    value={form.maxAttempts}
                                    onChange={(e) => updateField("maxAttempts", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC */}
                    {type === "dynamic" && (
                        <div className="form-section">
                            <h3>Dynamic Scoring</h3>

                            <div className="section-grid">
                                <input type="number" placeholder="Initial Value"
                                       value={form.initialValue}
                                       onChange={(e) => updateField("initialValue", e.target.value)} />

                                <input type="number" placeholder="Decay"
                                       value={form.decay}
                                       onChange={(e) => updateField("decay", e.target.value)} />

                                <input type="number" placeholder="Min Value"
                                       value={form.minValue}
                                       onChange={(e) => updateField("minValue", e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* FLAG */}
                    <div className="form-section">
                        <h3>Flag</h3>
                        <input
                            placeholder="CTF{...}"
                            value={form.flag}
                            onChange={(e) => updateField("flag", e.target.value)}
                        />
                    </div>

                    <div className="form-section">
                        <h3>Metadata</h3>

                        <div className="metadata-grid">

                            <input
                                placeholder="Author"
                                value={form.author}
                                onChange={(e) => updateField("author", e.target.value)}
                            />

                            <input
                                placeholder="Tags (comma separated)"
                                value={form.tags}
                                onChange={(e) => updateField("tags", e.target.value)}
                            />

                            <textarea
                                className="full-width"
                                placeholder="Hints (one per line)"
                                value={form.hints}
                                onChange={(e) => updateField("hints", e.target.value)}
                            />

                        </div>
                    </div>

                    {/* FILE UPLOAD */}
                    <div className="form-section">
                        <h3>Attachment</h3>

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        {file && <p>Selected: {file.name}</p>}
                    </div>

                    {/* ACTION */}
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Create Challenge"}
                        </button>
                    </div>

                </div>
            </div>

            {popup && (
                <div className={`popup ${popup.type}`}>
                    {popup.text}
                </div>
            )}
        </div>
    );
}