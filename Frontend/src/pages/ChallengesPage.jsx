import ChallengeCard from "../components/Challenges/ChallengeCard";
import ChallengeModal from "../components/Challenges/ChallengeModal";
import { Flag, Layers, CheckCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function ChallengesPage() {

    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const [loading, setLoading] = useState(true);

    // 🔥 FETCH DATA
    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");

                const [chRes, catRes] = await Promise.all([
                    fetch("http://localhost:8080/api/challenges", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/categories", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const chData = await chRes.json();
                const catData = await catRes.json();

                const safeChallenges = Array.isArray(chData) ? chData : [];
                const safeCategories = Array.isArray(catData) ? catData : [];

                setChallenges(safeChallenges);
                setFiltered(safeChallenges);
                setCategories(safeCategories);

            } catch (err) {
                console.error("Failed to fetch challenges", err);
                setChallenges([]);
                setFiltered([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // 🔥 FILTER + SEARCH
    useEffect(() => {
        let result = [...challenges];

        // category filter
        if (activeCategory !== "all") {
            result = result.filter(
                (c) => c.category?.toLowerCase() === activeCategory
            );
        }

        // search
        if (search.trim()) {
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(search.toLowerCase()) ||
                    c.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFiltered(result);
    }, [search, activeCategory, challenges]);

    if (loading) {
        return <div className="page-wrapper">Loading challenges...</div>;
    }

    // 🔥 solved count (real)
    const solvedCount = challenges.filter(c => c.solved).length;

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
                            <CheckCircle size={16} /> {solvedCount}
                        </span>
                        <span className="stat-label">Solved</span>
                    </div>
                </div>
            </div>

            {/* FILTER */}
            <div className="ch-filter-bar">

                <div className="filters-left">
                    <button
                        className={`filter ${activeCategory === "all" ? "active" : ""}`}
                        onClick={() => setActiveCategory("all")}
                    >
                        All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`filter ${activeCategory === cat ? "active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="filters-right">
                    <div className="search-box">
                        <Search size={14} />
                        <input
                            placeholder="Search challenges..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            {/* GRID */}
            <div className="ch-section">
                <div className="ch-grid">

                    {filtered.length === 0 ? (
                        <p>No challenges found</p>
                    ) : (
                        filtered.map((ch) => (

                            <ChallengeCard
                                key={`${ch.ID}-${ch.Title}`}
                                name={ch.Title}
                                desc={ch.Description}
                                points={ch.Points}
                                difficulty={ch.Difficulty}
                                solves={ch.SolveCount}
                                solved={ch.Solved}
                                onClick={() => setSelectedChallenge(ch)}
                            />
                        ))
                    )}

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