export default function ScoreboardPreview({ scoreboard = [] }) {
    return (
        <div className="card">
            <h2>Top Players</h2>

            {scoreboard.slice(0, 3).map((p) => (
                <div key={p.rank} className="row">
                    <span>#{p.rank}</span>
                    <span>{p.name}</span>
                    <span>{p.score}</span>
                </div>
            ))}
        </div>
    );
}