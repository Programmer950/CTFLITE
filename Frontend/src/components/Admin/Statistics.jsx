import "./Statistics.css";
import { useEffect, useState } from "react";

import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, CartesianGrid
} from "recharts";

export default function Statistics() {

    const [stats, setStats] = useState({
        users: 0,
        teams: 0,
        challenges: 0,
        points: 0,
    });

    const [challenges, setChallenges] = useState([]);

    const [progression, setProgression] = useState([]);
    const [scoreDistribution, setScoreDistribution] = useState([]);
    const [submissionStats, setSubmissionStats] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [difficultyStats, setDifficultyStats] = useState([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const token = localStorage.getItem("token");

                const [
                    chRes,
                    sbRes,
                    statsRes,   // ✅ NEW
                    subRes,
                    catRes,
                    diffRes,
                    progRes,
                    distRes
                ] = await Promise.all([
                    fetch("http://localhost:8080/api/challenges", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/scoreboard", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/stats", {   // ✅ NEW
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/stats/submissions", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/stats/categories", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/stats/difficulty", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/stats/progression", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/stats/score-distribution", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const chData = await chRes.json();
                const sbData = await sbRes.json();
                const subData = await subRes.json();
                const catData = await catRes.json();
                const diffData = await diffRes.json();
                const progData = await progRes.json();
                const distData = await distRes.json();
                const statsData = await statsRes.json();

                // 🔥 Basic stats
                setChallenges(Array.isArray(chData) ? chData : []);

                setStats({
                    challenges: chData.length,
                    users: statsData.players || statsData.total_players || 0, // ✅ FIXED
                    teams: sbData.filter(x => x.type === "team").length,
                    points: sbData.reduce((sum, x) => sum + (x.score || 0), 0),
                });

                // 🔥 Submission stats → convert to pie format
                setSubmissionStats([
                    { name: "Correct", value: subData.correct || 0 },
                    { name: "Incorrect", value: subData.incorrect || 0 },
                ]);

                // 🔥 Direct mappings
                setCategoryStats(Array.isArray(catData) ? catData : []);
                setDifficultyStats(Array.isArray(diffData) ? diffData : []);
                setScoreDistribution(Array.isArray(distData) ? distData : []);

                // 🔥 Progression fix (backend sends {name, value})
                setProgression(
                    Array.isArray(progData)
                        ? progData.map(p => ({
                            name: p.name,
                            score: p.value,
                        }))
                        : []
                );

            } catch (err) {
                console.error("Stats fetch failed", err);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="stats-page">

            {/* HEADER */}
            <div className="stats-header">
                <h1>Statistics</h1>
                <p>Platform analytics and performance insights</p>
            </div>

            {/* TOP STATS */}
            <div className="stats-grid top">

                <div className="card stat-card">
                    <span className="label">Users</span>
                    <span className="value">{stats.users}</span>
                </div>

                <div className="card stat-card">
                    <span className="label">Teams</span>
                    <span className="value">{stats.teams}</span>
                </div>

                <div className="card stat-card">
                    <span className="label">Points</span>
                    <span className="value">{stats.points}</span>
                </div>

                <div className="card stat-card">
                    <span className="label">Challenges</span>
                    <span className="value">{stats.challenges}</span>
                </div>

            </div>

            {/* PLAYER PROGRESSION */}
            <div className="card large">
                <div className="card-header">
                    <h3>Player Progression</h3>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progression}>
                        <CartesianGrid stroke="#1f2937" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#22d3ee" />
                    </LineChart>
                </ResponsiveContainer>

                {!progression.length && <p className="empty">No data yet</p>}
            </div>

            {/* SOLVE COUNTS + SCORE DIST */}
            <div className="stats-grid two">

                {/* SOLVE COUNTS */}
                <div className="card">
                    <div className="card-header">
                        <h3>Solve Counts</h3>
                    </div>

                    <div className="progress-list">
                        {challenges.map((ch) => (
                            <div key={ch.id} className="progress-item">
                                <div className="progress-top">
                                    <span>{ch.title}</span>
                                    <span className="value">{ch.solve_count}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${Math.min(ch.solve_count * 5, 100)}%`,
                                            background: "#22d3ee"
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SCORE DISTRIBUTION */}
                <div className="card">
                    <div className="card-header">
                        <h3>Score Distribution</h3>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={scoreDistribution}>
                            <CartesianGrid stroke="#1f2937" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="value" stroke="#a855f7" />
                        </LineChart>
                    </ResponsiveContainer>

                    {!scoreDistribution.length && <p className="empty">No data yet</p>}
                </div>

            </div>

            {/* BOTTOM PIE CHARTS */}
            <div className="stats-grid three">

                {/* SUBMISSIONS */}
                <div className="card center">
                    <h3>Submission Percentages</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={submissionStats} dataKey="value" innerRadius={60} outerRadius={80}>
                                {submissionStats.map((_, i) => (
                                    <Cell key={i} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {!submissionStats.length && <p className="empty">No data yet</p>}
                </div>

                {/* CATEGORY */}
                <div className="card center">
                    <h3>Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={categoryStats} dataKey="value" innerRadius={60} outerRadius={80}>
                                {categoryStats.map((_, i) => (
                                    <Cell key={i} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {!categoryStats.length && <p className="empty">No data yet</p>}
                </div>

                {/* DIFFICULTY */}
                <div className="card center">
                    <h3>Point Breakdown</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={difficultyStats} dataKey="value" innerRadius={60} outerRadius={80}>
                                {difficultyStats.map((_, i) => (
                                    <Cell key={i} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {!difficultyStats.length && <p className="empty">No data yet</p>}
                </div>

            </div>

        </div>
    );
}