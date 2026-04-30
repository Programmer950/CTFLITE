import { Zap, Shield, CheckCircle } from "lucide-react";

export default function ChallengeList({ challenges = [] }) {

    const safe = Array.isArray(challenges) ? challenges : [];

    return (
        <div className="widget-card">

            <div className="widget-title">
                Challenges
            </div>

            <div className="challenge-list">

                {safe.length === 0 ? (
                    <p className="empty">No challenges available</p>
                ) : (
                    safe.slice(0, 5).map((c) => (
                        <div key={c.ID || c.id} className="challenge-row">

                            {/* LEFT */}
                            <div className="challenge-info">
                                <span className="challenge-name">
                                    {c.Title || c.title}
                                </span>

                                <span className={`diff-badge diff-${(c.Difficulty || "easy").toLowerCase()}`}>
                                    {c.Difficulty || "easy"}
                                </span>

                                {c.Solved && (
                                    <CheckCircle size={14} className="solved-icon" />
                                )}
                            </div>

                            {/* RIGHT */}
                            <div className="challenge-meta">

                                <span className="points">
                                    <Zap size={12} />
                                    {c.Points || 0}
                                </span>

                                <span className="category">
                                    <Shield size={12} />
                                    {c.Category || "misc"}
                                </span>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}