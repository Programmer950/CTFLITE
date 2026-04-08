import { Zap, Users } from "lucide-react";

export default function ChallengeCard({ name, desc, points, difficulty, solves, onClick }) {
    return (
        <div className="challenge-card" onClick={onClick}>

            <div className="ch-card-header">
                <div className="ch-card-title">{name}</div>

                <span className={`diff-badge diff-${difficulty}`}>
                    {difficulty}
                </span>
            </div>

            <div className="ch-card-desc">{desc}</div>

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