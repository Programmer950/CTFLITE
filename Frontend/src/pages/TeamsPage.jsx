import { Users, Plus } from "lucide-react";

export default function TeamsPage() {

    const teams = [
        { name: "Red Dragons", members: 5, score: 1200 },
        { name: "Cyber Knights", members: 4, score: 950 },
        { name: "Null Squad", members: 3, score: 870 },
    ];

    return (
        <div className="page-wrapper">

            {/* HEADER */}
            <div className="teams-header">
                <h1 className="teams-title">
                    <Users size={22} />
                    Teams
                </h1>

                <p className="teams-sub">
                    Collaborate with teammates and compete together.
                </p>
            </div>

            {/* ACTION BAR */}
            <div className="teams-actions">
                <button className="create-team-btn">
                    <Plus size={16} />
                    Create Team
                </button>

                <button className="join-team-btn">
                    Join Team
                </button>
            </div>

            {/* GRID */}
            <div className="teams-grid">

                {teams.map((team, i) => (
                    <div key={i} className="team-card">

                        <div className="team-name">{team.name}</div>

                        <div className="team-meta">
                            <span>{team.members} members</span>
                            <span>{team.score} pts</span>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}