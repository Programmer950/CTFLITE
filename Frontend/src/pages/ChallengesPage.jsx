import ChallengeCard from "../components/Challenges/ChallengeCard";
import ChallengeModal from "../components/Challenges/ChallengeModal";
import { Flag, Layers, CheckCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";


export default function ChallengesPage() {

    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChallenges() {
            try {
                const token = localStorage.getItem("token");
                console.log(token);

                const res = await fetch("http://localhost:8080/api/challenges", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                console.log("API RESPONSE:", data); // 👈 debug

                // ✅ ensure it's an array
                if (Array.isArray(data)) {
                    setChallenges(data);
                } else {
                    console.error("Unexpected response:", data);
                    setChallenges([]); // fallback
                }

            } catch (err) {
                console.error("Failed to fetch challenges", err);
                setChallenges([]);
            } finally {
                setLoading(false);
            }
        }

        fetchChallenges();
    }, []);

    if (loading) {
        return <div className="page-wrapper">Loading challenges...</div>;
    }

    return (
        <div className="page-wrapper">

            {/* HEADER */}
            <div className="ch-header-block">
                <div>
                    <h1 className="ch-title">
                        <Flag size={20} />
                        Challenges
                    </h1>

                    <p className="ch-sub">
                        Solve challenges and climb the leaderboard.
                    </p>
                </div>

                <div className="ch-stats">
                    <div className="ch-stat">
                        <span className="stat-num">
                            <Layers size={16} /> {challenges.length}
                        </span>
                        <span className="stat-label">Total</span>
                    </div>

                    <div className="ch-stat">
                        <span className="stat-num">
                            <CheckCircle size={16} /> 12
                        </span>
                        <span className="stat-label">Solved</span>
                    </div>
                </div>
            </div>

            {/* FILTER */}
            <div className="ch-filter-bar">
                <div className="filters-left">
                    <button className="filter active">All</button>
                    <button className="filter">Web</button>
                    <button className="filter">Crypto</button>
                    <button className="filter">Pwn</button>
                </div>

                <div className="filters-right">
                    <div className="search-box">
                        <Search size={14} />
                        <input placeholder="Search challenges..." />
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="ch-section">
                <div className="ch-grid">
                    {challenges.map((ch) => (
                        <ChallengeCard
                            key={ch.id}
                            name={ch.title}
                            desc={ch.description}
                            points={ch.points}
                            difficulty={ch.difficulty}
                            solves={ch.solve_count}
                            onClick={() => setSelectedChallenge(ch)}
                        />
                    ))}
                </div>
            </div>

            {/* MODAL */}
            <ChallengeModal
                challenge={selectedChallenge}
                onClose={() => setSelectedChallenge(null)}
            />

        </div>
    );
}