import { FileText } from "lucide-react";

export default function RulesPage() {
    return (
        <div className="page-wrapper">

            {/* HEADER */}
            <div className="rules-header">
                <h1 className="rules-title">
                    <FileText size={22} />
                    Rules
                </h1>

                <p className="rules-sub">
                    Please read all rules carefully before participating.
                </p>
            </div>

            {/* CONTENT */}
            <div className="rules-container">

                {/* SECTION */}
                <div className="rule-section">
                    <h3>General Rules</h3>
                    <ul>
                        <li>No attacking the platform infrastructure.</li>
                        <li>No sharing flags with other teams.</li>
                        <li>Respect all participants.</li>
                    </ul>
                </div>

                <div className="rule-section">
                    <h3>Flag Format</h3>
                    <ul>
                        <li>All flags follow the format: <code>flag&#123;...&#125;</code></li>
                        <li>Flags are case-sensitive.</li>
                    </ul>
                </div>

                <div className="rule-section">
                    <h3>Scoring</h3>
                    <ul>
                        <li>Each challenge has a fixed point value.</li>
                        <li>Leaderboard updates in real-time.</li>
                    </ul>
                </div>

                <div className="rule-section">
                    <h3>Conduct</h3>
                    <ul>
                        <li>No brute-force or denial-of-service attacks.</li>
                        <li>Violation may result in disqualification.</li>
                    </ul>
                </div>

            </div>

        </div>
    );
}