export default function Features({ title = "Why Choose Us" }) {
    const data = [
        "Real-time scoring",
        "Team battles",
        "AI hints",
        "Global leaderboard"
    ];

    return (
        <div className="card">
            <h2>{title}</h2>

            <div className="grid">
                {data.map((f, i) => (
                    <div key={i} className="feature">{f}</div>
                ))}
            </div>
        </div>
    );
}