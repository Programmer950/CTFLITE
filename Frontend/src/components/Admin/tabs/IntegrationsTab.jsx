export default function IntegrationsTab() {
    return (
        <div className="config-card">
            <h2>Integrations</h2>

            <div className="form-group">
                <label>Discord Webhook</label>
                <input placeholder="https://discord..." />
            </div>

            <div className="form-group">
                <label>SMTP Email</label>
                <input placeholder="smtp settings" />
            </div>

            <div className="checkbox">
                <input type="checkbox" />
                <label>Enable Notifications</label>
            </div>
        </div>
    );
}