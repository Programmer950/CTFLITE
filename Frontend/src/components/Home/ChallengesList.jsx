export default function ChallengeList({ challenges = [] }) {
    return (
        <div className="card">
            <h2>Challenges</h2>

            {challenges.slice(0, 5).map((c) => (
                <div key={c.id} className="row">
                    <span>{c.title}</span>
                    <span>{c.points}</span>
                    <span>{c.difficulty}</span>
                </div>
            ))}
        </div>
    );
}