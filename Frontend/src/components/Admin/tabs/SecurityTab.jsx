export default function SecurityTab() {
    return (
        <div className="config-card">
            <h2>Security</h2>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Enable Rate Limiting</label>
            </div>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Enable IP Tracking</label>
            </div>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Prevent Duplicate Accounts</label>
            </div>
        </div>
    );
}