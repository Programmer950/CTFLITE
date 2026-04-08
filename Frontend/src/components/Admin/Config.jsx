import "./Config.css";
import { useState } from "react";

export default function Config() {

    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="config-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Configuration</h1>
            </div>

            <div className="config-container">

                {/* SIDEBAR */}
                <div className="config-sidebar">

                    <div
                        className={activeTab === "general" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("general")}
                    >
                        General
                    </div>

                    <div
                        className={activeTab === "appearance" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("appearance")}
                    >
                        Appearance
                    </div>

                    <div
                        className={activeTab === "security" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("security")}
                    >
                        Security
                    </div>

                    <div
                        className={activeTab === "game" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("game")}
                    >
                        Game Settings
                    </div>

                    <div
                        className={activeTab === "access" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("access")}
                    >
                        Access Control
                    </div>

                    <div
                        className={activeTab === "integrations" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("integrations")}
                    >
                        Integrations
                    </div>

                </div>

                {/* CONTENT */}
                <div className="config-content">

                    {/* GENERAL */}
                    {activeTab === "general" && (
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
                    )}

                    {/* APPEARANCE */}
                    {activeTab === "appearance" && (
                        <div className="config-card">
                            <h2>Appearance</h2>

                            <div className="form-group">
                                <label>Theme</label>
                                <select>
                                    <option>Dark Neon</option>
                                    <option>Glass</option>
                                    <option>Minimal</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Primary Color</label>
                                <input type="color" />
                            </div>

                            <div className="form-group">
                                <label>Logo URL</label>
                                <input placeholder="https://..." />
                            </div>
                        </div>
                    )}

                    {/* SECURITY */}
                    {activeTab === "security" && (
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
                    )}

                    {/* GAME */}
                    {activeTab === "game" && (
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
                    )}

                    {/* ACCESS */}
                    {activeTab === "access" && (
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
                    )}

                    {/* INTEGRATIONS */}
                    {activeTab === "integrations" && (
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
                    )}

                    {/* ACTION */}
                    <div className="form-actions">
                        <button className="submit-btn">Save Changes</button>
                    </div>

                </div>

            </div>

        </div>
    );
}