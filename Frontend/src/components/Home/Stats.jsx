export default function Stats({ stats }) {
    if (!stats) return null;

    return (
        <div className="card">
            <h2>Platform Stats</h2>

            <div className="stats-grid">
                <div className="stat-box">
                    <div>{stats.total_challenges}</div>
                    <span>Challenges</span>
                </div>

                <div className="stat-box">
                    <div>{stats.total_solves}</div>
                    <span>Solves</span>
                </div>

                <div className="stat-box">
                    <div>{stats.total_players}</div>
                    <span>Players</span>
                </div>
            </div>
        </div>
    );
}