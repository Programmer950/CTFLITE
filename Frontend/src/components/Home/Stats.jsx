export default function Stats({ stats }) {
    if (!stats) return null;

    return (
        <div className="widget-card">
            <h2 className="widget-title">Platform Stats</h2>

            <div className="widget-stats-grid">
                <div className="widget-stat-box">
                    <div className="widget-stat-value">{stats.total_challenges}</div>
                    <span className="widget-stat-label">Challenges</span>
                </div>

                <div className="widget-stat-box">
                    <div className="widget-stat-value">{stats.total_solves}</div>
                    <span className="widget-stat-label">Solves</span>
                </div>

                <div className="widget-stat-box">
                    <div className="widget-stat-value">{stats.total_players}</div>
                    <span className="widget-stat-label">Players</span>
                </div>
            </div>
        </div>
    );
}