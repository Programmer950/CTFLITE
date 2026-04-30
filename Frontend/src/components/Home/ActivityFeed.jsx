import { Activity, Flame } from "lucide-react";

export default function ActivityFeed({ challenges = [] }) {

    const safe = Array.isArray(challenges) ? [...challenges] : [];

    const recent = safe
        .sort((a, b) => (b.SolveCount || 0) - (a.SolveCount || 0))
        .slice(0, 5);

    return (
        <div className="widget-card">

            <div className="widget-title">
                <Activity size={16} />
                Recent Activity
            </div>

            <div className="activity-list">

                {recent.length === 0 ? (
                    <p className="empty">No activity yet</p>
                ) : (
                    recent.map((c) => (
                        <div key={c.ID || c.id} className="activity-row">

                            {/* LEFT */}
                            <div className="activity-text">
                                <span className="activity-name">
                                    {c.Title || c.title}
                                </span>

                                <span className="activity-desc">
                                    solved {c.SolveCount || 0} times
                                </span>
                            </div>

                            {/* RIGHT */}
                            <div className="activity-meta">
                                <Flame size={14} />
                                {c.SolveCount || 0}
                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}