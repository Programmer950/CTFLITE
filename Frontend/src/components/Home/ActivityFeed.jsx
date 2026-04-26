export default function ActivityFeed({ challenges = [] }) {
    const recent = challenges
        .sort((a, b) => b.solve_count - a.solve_count)
        .slice(0, 5);

    return (
        <div className="card">
            <h2>Recent Activity</h2>

            {recent.map((c) => (
                <div key={c.id} className="row">
                    {c.title} solved {c.solve_count} times
                </div>
            ))}
        </div>
    );
}