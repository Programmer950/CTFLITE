import "./Submissions.css";
import { Search, Flag, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Submissions() {

    const [filter, setFilter] = useState("all");

    const submissions = [
        {
            id: 1,
            user: "admin",
            challenge: "SQL Injection 101",
            type: "Static",
            provided: "flag{correct}",
            date: "2026-04-07",
            correct: true,
        },
        {
            id: 2,
            user: "player1",
            challenge: "Buffer Overflow",
            type: "Dynamic",
            provided: "wrong_flag",
            date: "2026-04-07",
            correct: false,
        },
    ];

    // FILTER LOGIC
    const filteredSubmissions = submissions.filter((s) => {
        if (filter === "correct") return s.correct;
        if (filter === "incorrect") return !s.correct;
        return true;
    });

    return (
        <div className="submissions-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Submissions</h1>
            </div>

            {/* CONTROLS */}
            <div className="controls">

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All</option>
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                </select>

                <input placeholder="Search submissions..." />

                <button className="search-btn">
                    <Search size={16} />
                </button>

            </div>

            {/* TABLE */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Challenge</th>
                        <th>Type</th>
                        <th>Provided</th>
                        <th>Result</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredSubmissions.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>

                            <td className="username">{s.user}</td>

                            <td>{s.challenge}</td>

                            <td>
                                <span className="badge type">{s.type}</span>
                            </td>

                            <td className="provided">{s.provided}</td>

                            <td>
                                {s.correct ? (
                                    <span className="badge correct">Correct</span>
                                ) : (
                                    <span className="badge incorrect">Incorrect</span>
                                )}
                            </td>

                            <td>{s.date}</td>

                            <td className="actions">
                                <button className="icon-btn">
                                    <Flag size={16} />
                                </button>
                                <button className="icon-btn danger">
                                    <Trash2 size={16} />
                                </button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}