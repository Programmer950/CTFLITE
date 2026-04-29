import "./Challenges.css";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Challenges() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 FETCH CHALLENGES
    useEffect(() => {
        async function fetchChallenges() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/admin/challenges", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (Array.isArray(data)) {
                    setChallenges(data);
                } else {
                    setChallenges([]);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchChallenges();
    }, []);

    // 🔥 DELETE FUNCTION
    async function handleDelete(id) {
        const confirmDelete = confirm("Delete this challenge?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:8080/admin/challenges/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            // ✅ remove from UI
            setChallenges((prev) => prev.filter((c) => c.id !== id));

        } catch (err) {
            console.error(err);
            alert("Failed to delete challenge");
        }
    }

    if (loading) {
        return <div className="challenges-page">Loading...</div>;
    }

    return (
        <div className="challenges-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Challenges</h1>
                <button className="add-btn" onClick={() => navigate("create")}>
                    <Plus size={18} />
                </button>
            </div>

            {/* SEARCH (UI only for now) */}
            <div className="controls">
                <input placeholder="Search challenges..." />
                <button className="search-btn">
                    <Search size={16} />
                </button>
            </div>

            {/* TABLE */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Value</th>
                        <th>Difficulty</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {challenges.map((c) => (
                        <tr key={c.id}>
                            <td>{c.id}</td>

                            <td className="challenge-name">
                                {c.title}
                            </td>

                            <td>
                                    <span className="badge category">
                                        {Array.isArray(c.category)
                                            ? c.category.map((cat, i) => (
                                                <span key={i}>{cat}</span>
                                            ))
                                            : c.category}
                                    </span>
                            </td>

                            <td className="value">{c.points}</td>

                            <td>
                                    <span className="badge type">
                                        {Array.isArray(c.difficulty)
                                            ? c.difficulty.map((d, i) => (
                                                <span key={i}>{d}</span>
                                            ))
                                            : c.difficulty}
                                    </span>
                            </td>

                            <td className="actions">

                                {/* EDIT (next step) */}
                                <button className="icon-btn" onClick={() => navigate(`edit/${c.id}`)}>
                                    <Pencil size={16} />
                                </button>

                                {/* DELETE */}
                                <button
                                    className="icon-btn danger"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    <Trash2 size={16} />
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}