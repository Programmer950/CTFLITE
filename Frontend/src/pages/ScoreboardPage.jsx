import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScoreboardPage() {

    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/api/scoreboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                console.log("SCOREBOARD:", data);

                // normalize + rank assign
                if (Array.isArray(data)) {
                    const sorted = data
                        .sort((a, b) => b.score - a.score)
                        .map((p, i) => ({
                            ...p,
                            rank: i + 1
                        }));

                    setPlayers(sorted);
                } else {
                    setPlayers([]);
                }

            } catch (err) {
                console.error("Failed to fetch scoreboard", err);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div className="page-wrapper">Loading scoreboard...</div>;
    }

    return (
        <div className="page-wrapper">

            {/* HEADER */}
            <div className="sb-header">
                <h1 className="sb-title">
                    <Trophy size={22} />
                    Scoreboard
                </h1>

                <p className="sb-sub">
                    Top players competing in the CTF
                </p>
            </div>

            {/* TOP 3 */}
            <div className="top3">

                {players.slice(0, 3).map((p) => (
                    <div key={p.id || p.username} className={`top-card rank-${p.rank}`}>

                        <div className="top-rank">#{p.rank}</div>

                        <div className="top-name">
                            {p.username || p.name}
                        </div>

                        <div className="top-score">
                            {p.score}
                        </div>

                    </div>
                ))}

            </div>

            {/* TABLE */}
            <div className="sb-table">

                <div className="sb-header-row">
                    <div>Rank</div>
                    <div>Player</div>
                    <div>Score</div>
                </div>

                {players.map((p) => (
                    <div
                        key={p.id || p.username}
                        className={`sb-row ${p.rank <= 3 ? "top-player" : ""}`}
                    >
                        <div className="sb-rank">#{p.rank}</div>

                        <div className="sb-name">
                            {p.username || p.name}
                        </div>

                        <div className="sb-score">{p.score}</div>
                    </div>
                ))}

            </div>

        </div>
    );
}