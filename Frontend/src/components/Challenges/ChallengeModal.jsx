import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    X,
    Download,
    Tag,
    User,
    BarChart,
    Layers,
    AlertCircle,
    CheckCircle
} from "lucide-react";

export default function ChallengeModal({ challenge, onClose, onSolved }) {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [flag, setFlag] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFlag("");
        setStatus("");
    }, [challenge]);

    if (!challenge) return null;

    async function handleSubmit() {
        if (!token) {
            navigate("/login");
            return;
        }

        if (!flag) {
            setStatus("empty");
            return;
        }

        setLoading(true);
        setStatus("");

        try {
            const res = await fetch("http://localhost:8080/api/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    challenge_id: challenge.ID,
                    flag: flag,
                }),
            });

            const data = await res.json();

            if (data.result === "correct") {
                setStatus("success");
                onSolved?.(challenge.ID);

                setTimeout(() => onClose(), 1200);
            } else {
                setStatus("error");
            }

        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                {/* HEADER */}
                <div className="modal-header">
                    <h2>{challenge.Title}</h2>

                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                {/* STATUS */}
                {status && (
                    <div className={`status-banner ${status}`}>
                        {status === "success" && (
                            <>
                                <CheckCircle size={16} /> Challenge Solved
                            </>
                        )}
                        {status === "error" && (
                            <>
                                <AlertCircle size={16} /> Incorrect Flag
                            </>
                        )}
                        {status === "empty" && "Enter a flag"}
                    </div>
                )}

                {/* BODY */}
                <div className="modal-body">

                    {/* DESCRIPTION */}
                    <p className="challenge-desc">
                        {challenge.Description || "No description"}
                    </p>

                    {/* META INFO */}
                    <div className="meta-grid">

                        <div className="meta-item">
                            <Layers size={14} />
                            {challenge.Category || "unknown"}
                        </div>

                        <div className="meta-item">
                            <BarChart size={14} />
                            {challenge.Difficulty}
                        </div>

                        {challenge.Author && (
                            <div className="meta-item">
                                <User size={14} />
                                {challenge.Author}
                            </div>
                        )}

                        {challenge.MaxAttempts > 0 && (
                            <div className="meta-item">
                                Attempts: {challenge.MaxAttempts}
                            </div>
                        )}
                    </div>

                    {/* TAGS */}
                    {challenge.Tags?.length > 0 && (
                        <div className="tags">
                            {challenge.Tags.map((t, i) => (
                                <span key={i} className="tag">
                                    <Tag size={10} /> {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* FILE DOWNLOAD */}
                    {challenge.FileURL && (
                        <a
                            href={`http://localhost:8080/${challenge.FileURL}`}
                            target="_blank"
                            rel="noreferrer"
                            className="file-btn"
                        >
                            <Download size={14} />
                            Download Attachment
                        </a>
                    )}

                    {/* HINTS */}
                    {challenge.Hints?.length > 0 && (
                        <div className="hints">
                            <h4>Hints</h4>
                            {challenge.Hints.map((h, i) => (
                                <div key={i} className="hint-box">
                                    {h}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FLAG INPUT */}
                    {!challenge.Solved && (
                        <div className="flag-section">

                            <input
                                placeholder="flag{...}"
                                value={flag}
                                onChange={(e) => setFlag(e.target.value)}
                            />

                            <button
                                className="modal-submit-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>

                        </div>
                    )}

                    {/* SOLVED STATE */}
                    {challenge.Solved && (
                        <div className="already-solved">
                            ✔ Already solved
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}