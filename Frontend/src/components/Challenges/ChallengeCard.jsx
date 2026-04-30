import { Zap, Users, CheckCircle } from "lucide-react";

export default function ChallengeCard({
                                          name,
                                          desc,
                                          points,
                                          difficulty,
                                          solves,
                                          solved,
                                          onClick
                                      }) {
    return (
        <div
            className={`challenge-card ${solved ? "solved" : ""}`}
            onClick={onClick}
        >

            {/* SOLVED OVERLAY */}
            {solved && <div className="solved-overlay">Solved</div>}

            {/* HEADER */}
            <div className="ch-card-header">
                <div className="ch-card-title">
                    {name}
                    {solved && (
                        <div className="solved-badge">
                            <CheckCircle size={14} />
                            <span>SOLVED</span>
                        </div>
                    )}
                </div>

                <span className={`diff-badge diff-${difficulty}`}>
                    {difficulty}
                </span>
            </div>

            {/* DESC */}
            <div className="ch-card-desc">
                {desc || "No description"}
            </div>

            {/* FOOTER */}
            <div className="ch-card-footer">
                <span className="ch-points">
                    <Zap size={14} />
                    {points} pts
                </span>

                <span className="ch-solves">
                    <Users size={14} />
                    {solves} solves
                </span>
            </div>

        </div>
    );
}