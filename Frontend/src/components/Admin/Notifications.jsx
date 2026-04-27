import "./Notifications.css";
import { useState } from "react";

export default function Notifications() {
    const [type, setType] = useState("toast");
    const [playSound, setPlaySound] = useState(true);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title || !content) {
            alert("Title and content required");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8080/admin/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    type,
                    play_sound: playSound,
                    target: "all"
                })
            });

            const data = await res.json();

            console.log("Notification sent:", data);

            // reset form
            setTitle("");
            setContent("");

            alert("Notification sent successfully");

        } catch (err) {
            console.error("Send failed:", err);
            alert("Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notifications-page">

            <div className="page-header">
                <h1>Notifications</h1>
                <p>Create and send platform notifications</p>
            </div>

            <div className="card form-card">

                {/* Title */}
                <div className="form-group">
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Notification title"
                    />
                </div>

                {/* Content */}
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your notification..."
                    />
                </div>

                {/* Row */}
                <div className="form-row">

                    {/* Type */}
                    <div className="form-group">
                        <label>Notification Type</label>
                        <div className="radio-group">
                            {["toast", "alert", "background"].map(t => (
                                <label key={t}>
                                    <input
                                        type="radio"
                                        checked={type === t}
                                        onChange={() => setType(t)}
                                    />
                                    {t}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sound */}
                    <div className="form-group">
                        <label>Play Sound</label>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={playSound}
                                onChange={() => setPlaySound(!playSound)}
                            />
                            Play sound
                        </label>
                    </div>

                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button
                        className="submit-btn"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Notification"}
                    </button>
                </div>

            </div>

        </div>
    );
}