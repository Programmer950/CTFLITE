import "./Config.css";
import { useState } from "react";

import GeneralTab from "./tabs/GeneralTab";
import AppearanceTab from "./tabs/AppearanceTab";
import SecurityTab from "./tabs/SecurityTab";
import GameTab from "./tabs/GameTab";
import AccessTab from "./tabs/AccessTab";
import IntegrationsTab from "./tabs/IntegrationsTab";

export default function Config() {
    const [activeTab, setActiveTab] = useState("general");

    const renderTab = () => {
        switch (activeTab) {
            case "general":
                return <GeneralTab />;
            case "appearance":
                return <AppearanceTab />;
            case "security":
                return <SecurityTab />;
            case "game":
                return <GameTab />;
            case "access":
                return <AccessTab />;
            case "integrations":
                return <IntegrationsTab />;
            default:
                return null;
        }
    };

    return (
        <div className="config-page">

            <div className="page-header center">
                <h1>Configuration</h1>
            </div>

            <div className="config-container">

                {/* SIDEBAR */}
                <div className="config-sidebar">
                    {[
                        ["general", "General"],
                        ["appearance", "Appearance"],
                        ["security", "Security"],
                        ["game", "Game Settings"],
                        ["access", "Access Control"],
                        ["integrations", "Integrations"]
                    ].map(([key, label]) => (
                        <div
                            key={key}
                            className={activeTab === key ? "tab active" : "tab"}
                            onClick={() => setActiveTab(key)}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="config-content">
                    {renderTab()}

                    <div className="form-actions">
                        <button className="submit-btn">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}