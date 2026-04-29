import "./Submissions.css";
import { Search, Flag, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Submissions() {

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 FETCH FROM BACKEND
    useEffect(() => {
        async function fetchSubmissions() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/admin/submissions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch submissions");
                }

                setSubmissions(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error("Submissions fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchSubmissions();
    }, []);

    // 🔥 FILTER + SEARCH
    const filteredSubmissions = submissions.filter((s) => {

        const matchesFilter =
            filter === "correct" ? s.correct :
                filter === "incorrect" ? !s.correct :
                    true;

        const matchesSearch =
            s.user.toLowerCase().includes(search.toLowerCase()) ||
            s.challenge.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // 🔥 LOADING STATE
    if (loading) {
        return <div className="submissions-page">Loading submissions...</div>;
    }

    return (
        <div className="submissions-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Submissions</h1>
            </div>

            {/* CONTROLS */}
            <div className="controls">

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All</option>
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                </select>

                <input
                    placeholder="Search submissions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

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
                        <th>User</th>
                        <th>Challenge</th>
                        <th>Type</th>
                        <th>Provided</th>
                        <th>Result</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredSubmissions.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="empty">
                                No submissions found
                            </td>
                        </tr>
                    ) : (
                        filteredSubmissions.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>

                                <td className="username">{s.user}</td>

                                <td>{s.challenge}</td>

                                <td>
                                    <span className="badge type">{s.type}</span>
                                </td>

                                <td className="provided">{s.provided}</td>

                                <td>
                                    {s.correct ? (
                                        <span className="badge correct">Correct</span>
                                    ) : (
                                        <span className="badge incorrect">Incorrect</span>
                                    )}
                                </td>

                                <td>{s.date}</td>

                                <td className="actions">
                                    <button className="icon-btn">
                                        <Flag size={16} />
                                    </button>

                                    <button className="icon-btn danger">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}