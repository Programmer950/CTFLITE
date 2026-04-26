export default function AccessTab() {
    return (
        <div className="config-card">
            <h2>Access Control</h2>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Public Registration</label>
            </div>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Invite Only Mode</label>
            </div>

            <div className="form-group">
                <label>Allowed Domains</label>
                <input placeholder="example.com" />
            </div>
        </div>
    );
}