import "./Scoreboard.css";
import { useEffect, useState } from "react";

export default function Scoreboard() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScoreboard() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/api/scoreboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.error || "Failed to fetch scoreboard");
                }

                // map backend → UI format
                const mapped = result.map((item, index) => ({
                    place: item.rank ?? index + 1,
                    user: item.username || item.user || "unknown",
                    score: item.score || 0,
                    visibility: "public", // you can extend later
                }));

                setData(mapped);

            } catch (err) {
                console.error("Scoreboard error:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchScoreboard();
    }, []);

    if (loading) {
        return <div className="scoreboard-page">Loading scoreboard...</div>;
    }

    return (
        <div className="scoreboard-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Scoreboard</h1>
            </div>

            {/* TABLE */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>Place</th>
                        <th>User</th>
                        <th>Score</th>
                        <th>Visibility</th>
                    </tr>
                    </thead>

                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="empty">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.place}>
                                <td className="place">#{row.place}</td>

                                <td className="username">
                                    {row.user}
                                </td>

                                <td className="score">
                                    {row.score}
                                </td>

                                <td>
                                        <span
                                            className={`badge ${
                                                row.visibility === "hidden"
                                                    ? "hidden"
                                                    : "active"
                                            }`}
                                        >
                                            {row.visibility}
                                        </span>
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