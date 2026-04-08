import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ChallengeModal({ challenge, onClose }) {
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

        // 🔐 not logged in → redirect
        if (!token) {
            navigate("/login");
            return;
        }

        if (!flag) {
            setStatus("Enter a flag");
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
                    challenge_id: challenge.id,
                    flag: flag,
                }),
            });

            const data = await res.json();

            // ✅ SUCCESS
            if (data.result === "correct") {
                setStatus("correct");

                setTimeout(() => {
                    onClose();
                }, 1000);
            }

            // ❌ WRONG
            else if (data.result) {
                setStatus("wrong");
            }

            // ⚠️ RATE LIMIT / ERROR
            else if (data.error) {
                setStatus(data.error);
            }

        } catch (err) {
            setStatus("Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">

            <div className="modal">

                {/* HEADER */}
                <div className="modal-header">
                    <h2>{challenge.title}</h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                    <p>{challenge.description}</p>

                    <input
                        placeholder="flag{...}"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                    />

                    <button className="modal-submit-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Flag"}
                    </button>

                    {/* STATUS */}
                    {status === "correct" && (
                        <p className="success">✅ Correct!</p>
                    )}

                    {status === "wrong" && (
                        <p className="error">❌ Wrong flag</p>
                    )}

                    {status &&
                        status !== "correct" &&
                        status !== "wrong" && (
                            <p className="error">{status}</p>
                        )}
                </div>

            </div>

        </div>
    );
}