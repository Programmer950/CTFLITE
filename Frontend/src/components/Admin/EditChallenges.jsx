import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EditChallenge() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "easy",
        points: "",
        flag: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // 🔥 LOAD EXISTING DATA
    useEffect(() => {
        async function fetchChallenge() {
            try {
                const res = await fetch("http://localhost:8080/api/challenges");
                const data = await res.json();

                const ch = data.find(c => c.id === Number(id));

                if (ch) {
                    setForm({
                        title: ch.title,
                        description: ch.description,
                        category: ch.category,
                        difficulty: ch.difficulty,
                        points: ch.points,
                        flag: "", // ⚠️ usually not returned
                    });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchChallenge();
    }, [id]);

    // 🔥 UPDATE
    async function handleUpdate() {
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
                    points: Number(form.points),
                    flag: form.flag,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Update failed");
            }

            setMessage("✅ Updated successfully");

            setTimeout(() => {
                navigate("/admin/challenges");
            }, 1000);

        } catch (err) {
            setMessage(err.message);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-wrapper">

            <h1>Edit Challenge</h1>

            <div className="form-panel">

                <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Title"
                />

                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description"
                />

                <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Category"
                />

                <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <input
                    type="number"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: e.target.value })}
                    placeholder="Points"
                />

                <input
                    value={form.flag}
                    onChange={(e) => setForm({ ...form, flag: e.target.value })}
                    placeholder="New Flag (optional)"
                />

                <button onClick={handleUpdate}>
                    Update
                </button>

                {message && <p>{message}</p>}

            </div>

        </div>
    );
}