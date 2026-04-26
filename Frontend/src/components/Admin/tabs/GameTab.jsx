export default function GameTab() {
    return (
        <div className="config-card">
            <h2>Game Settings</h2>

            <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" />
            </div>

            <div className="form-group">
                <label>End Time</label>
                <input type="datetime-local" />
            </div>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Freeze Scoreboard</label>
            </div>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Enable Dynamic Scoring</label>
            </div>
        </div>
    );
}