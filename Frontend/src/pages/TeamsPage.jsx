import { Users, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeamsPage() {

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // modals
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);

    const [teamName, setTeamName] = useState("");
    const [joinCode, setJoinCode] = useState("");

    // 🔥 FETCH TEAMS
    useEffect(() => {
        async function fetchTeams() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/api/teams", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                console.log("TEAMS:", data);

                if (Array.isArray(data)) {
                    setTeams(data);
                } else {
                    setTeams([]);
                }

            } catch (err) {
                console.error("Failed to fetch teams", err);
                setTeams([]);
            } finally {
                setLoading(false);
            }
        }

        fetchTeams();
    }, []);

    // 🔥 CREATE TEAM
    async function handleCreateTeam() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8080/api/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: teamName,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setShowCreate(false);
                setTeamName("");

                // refresh
                setTeams(prev => [...prev, data]);
            }

        } catch (err) {
            console.error("Create team failed", err);
        }
    }

    // 🔥 JOIN TEAM
    async function handleJoinTeam() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8080/api/teams/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    code: joinCode,
                }),
            });

            if (res.ok) {
                setShowJoin(false);
                setJoinCode("");
                // optional refresh
            }

        } catch (err) {
            console.error("Join failed", err);
        }
    }

    if (loading) {
        return <div className="page-wrapper">Loading teams...</div>;
    }

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
                <button
                    className="create-team-btn"
                    onClick={() => setShowCreate(true)}
                >
                    <Plus size={16} />
                    Create Team
                </button>

                <button
                    className="join-team-btn"
                    onClick={() => setShowJoin(true)}
                >
                    Join Team
                </button>
            </div>

            {/* GRID */}
            <div className="teams-grid">

                {teams.length === 0 ? (
                    <p>No teams found</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.id || team.name} className="team-card">

                            <div className="team-name">
                                {team.name || team.Name}
                            </div>

                            <div className="team-meta">
                                <span>
                                    {team.members || team.MemberCount || 0} members
                                </span>

                                <span>
                                    {team.score || team.Score || 0} pts
                                </span>
                            </div>

                        </div>
                    ))
                )}

            </div>

            {/* CREATE TEAM MODAL */}
            {showCreate && (
                <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>Create Team</h2>

                        <input
                            placeholder="Team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />

                        <button onClick={handleCreateTeam}>
                            Create
                        </button>

                    </div>
                </div>
            )}

            {/* JOIN TEAM MODAL */}
            {showJoin && (
                <div className="modal-overlay" onClick={() => setShowJoin(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>Join Team</h2>

                        <input
                            placeholder="Enter invite code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                        />

                        <button onClick={handleJoinTeam}>
                            Join
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}