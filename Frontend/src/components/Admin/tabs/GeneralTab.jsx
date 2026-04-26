export default function GeneralTab() {
    return (
        <div className="config-card">
            <h2>General Settings</h2>

            <div className="form-group">
                <label>CTF Name</label>
                <input placeholder="Enter event name" />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your CTF..." />
            </div>

            <div className="form-group">
                <label>Max Team Size</label>
                <input type="number" placeholder="e.g. 4" />
            </div>
        </div>
    );
}