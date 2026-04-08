export default function Stats() {
    return (
        <div className="stats-row">

            <div className="stat-card c1">
                <span className="stat-icon">🏁</span>
                <div className="stat-value">42</div>
                <div className="stat-label">Challenges</div>
            </div>

            <div className="stat-card c2">
                <span className="stat-icon">👥</span>
                <div className="stat-value">128</div>
                <div className="stat-label">Players</div>
            </div>

            <div className="stat-card c3">
                <span className="stat-icon">⚡</span>
                <div className="stat-value">900</div>
                <div className="stat-label">Points</div>
            </div>

            <div className="stat-card c4">
                <span className="stat-icon">🔥</span>
                <div className="stat-value">12</div>
                <div className="stat-label">Active</div>
            </div>

        </div>
    );
}