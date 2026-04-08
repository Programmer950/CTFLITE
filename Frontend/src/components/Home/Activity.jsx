export default function Activity() {
    return (
        <div className="panel">
            <div className="panel-header">
                <div className="panel-title">Recent Activity</div>
            </div>

            <div className="activity-item">
                <div className="act-icon solve">✔</div>
                <div className="act-text">
                    <strong>HackerX</strong> solved SQL Injection
                    <div className="act-time">2 min ago</div>
                </div>
            </div>

            <div className="activity-item">
                <div className="act-icon new">★</div>
                <div className="act-text">
                    <strong>CyberPro</strong> joined the game
                    <div className="act-time">5 min ago</div>
                </div>
            </div>
        </div>
    );
}