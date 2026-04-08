import "./Scoreboard.css";

export default function Scoreboard() {
    const data = [
        { place: 1, user: "admin", score: 5000, visibility: "public" },
        { place: 2, user: "player1", score: 4200, visibility: "public" },
        { place: 3, user: "hacker", score: 3900, visibility: "hidden" },
    ];

    return (
        <div className="scoreboard-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Scoreboard</h1>
            </div>

            {/* TABLE */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>Place</th>
                        <th>User</th>
                        <th>Score</th>
                        <th>Visibility</th>
                    </tr>
                    </thead>

                    <tbody>
                    {data.map((row) => (
                        <tr key={row.place}>
                            <td className="place">#{row.place}</td>
                            <td className="username">{row.user}</td>
                            <td className="score">{row.score}</td>

                            <td>
                  <span
                      className={`badge ${
                          row.visibility === "hidden" ? "hidden" : "active"
                      }`}
                  >
                    {row.visibility}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}