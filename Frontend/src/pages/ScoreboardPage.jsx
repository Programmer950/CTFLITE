import { Trophy } from "lucide-react";

export default function ScoreboardPage() {

    const players = [
        { name: "HackerX", score: 1200, rank: 1 },
        { name: "CyberPro", score: 950, rank: 2 },
        { name: "NullX", score: 870, rank: 3 },
        { name: "RootUser", score: 650, rank: 4 },
        { name: "Shadow", score: 540, rank: 5 },
    ];

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

                {players.slice(0, 3).map((p, i) => (
                    <div key={i} className={`top-card rank-${p.rank}`}>
                        <div className="top-rank">#{p.rank}</div>
                        <div className="top-name">{p.name}</div>
                        <div className="top-score">{p.score}</div>
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

                {players.map((p, i) => (
                    <div key={i} className="sb-row">
                        <div className="sb-rank">#{p.rank}</div>
                        <div className="sb-name">{p.name}</div>
                        <div className="sb-score">{p.score}</div>
                    </div>
                ))}

            </div>

        </div>
    );
}